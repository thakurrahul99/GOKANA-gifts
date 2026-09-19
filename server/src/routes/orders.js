import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { confirmOrderPaid } from '../utils/orderPayment.js';

const router = Router();

let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} catch (e) {
  console.warn('Razorpay not configured — payment features require RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET env vars');
}

// POST /api/orders
//
// SECURITY: the order total is ALWAYS computed here from each product's
// current price in the database — never trust a price/amount sent by the
// client. This route also creates the matching Razorpay order (for online
// payments) in the same step and stores its ID on the order, so that
// `/verify-payment` and the webhook can later confirm this *specific* order
// was paid the *correct* amount, instead of accepting any valid-looking
// Razorpay signature for any order.
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      items, shippingAddress, billing, payment,
      giftMessage, specialInstructions,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('Order must include at least one item');
    }

    // Validate & price items from the DB — client-supplied prices are ignored.
    let calculatedSubtotal = 0;
    const validatedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        throw new AppError(`Product ${item.productId} not available`);
      }
      calculatedSubtotal += product.price * item.qty;
      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.thumbnail || product.images[0],
        price: product.price,
        qty: item.qty,
        variant: item.variant,
        personalisation: item.personalisation,
      });
    }

    // Coupon: validate and compute the discount now, but DON'T increment
    // usedCount yet — that only happens once payment is actually confirmed
    // (see confirmOrderPaid), so abandoned/failed checkouts don't burn a
    // redemption.
    let discount = 0;
    let coupon = null;
    if (billing?.couponCode) {
      coupon = await Coupon.findOne({ code: billing.couponCode.toUpperCase() });
      if (!coupon) throw new AppError('Invalid coupon code');
      const { valid, reason } = coupon.isValid(calculatedSubtotal);
      if (!valid) throw new AppError(reason);
      discount = coupon.calculateDiscount(calculatedSubtotal);
    }

    const shippingCharge = calculatedSubtotal - discount >= 999 ? 0 : 99;
    const total = calculatedSubtotal - discount + shippingCharge;

    const paymentMethod = payment?.method === 'cod' ? 'cod' : payment?.method === 'whatsapp' ? 'whatsapp' : 'online';

    const order = await Order.create({
      user: req.user?._id,
      guestEmail: billing?.guestEmail,
      guestPhone: billing?.guestPhone,
      items: validatedItems,
      shippingAddress,
      billing: { subtotal: calculatedSubtotal, discount, shippingCharge, total, couponCode: coupon?.code },
      payment: { method: paymentMethod },
      giftMessage,
      specialInstructions,
      statusHistory: [{ status: 'PENDING', note: 'Order placed' }],
    });

    // COD / WhatsApp orders don't go through Razorpay — they're confirmed
    // immediately (this is also where coupon usage gets counted for them).
    if (paymentMethod !== 'online') {
      const confirmed = await confirmOrderPaid({
        filter: { _id: order._id },
        razorpayPaymentId: undefined,
        note: paymentMethod === 'cod' ? 'Cash on delivery — order confirmed' : 'Order confirmed',
      });
      return res.status(201).json({ success: true, order: confirmed || order });
    }

    // Online payment: create the Razorpay order now, from the server-trusted
    // total, and bind it to this order so it can't be reused for another one.
    if (!razorpay) throw new AppError('Payment gateway not configured', 503);

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // paise — derived from server total, never from client input
      currency: 'INR',
      receipt: order.orderId,
    });

    order.payment.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({ success: true, order, razorpayOrder });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/verify-payment
//
// Confirms payment for a specific order. Unlike the old version, this now
// checks that the razorpayOrderId being verified actually belongs to the
// order being confirmed (it was set server-side in POST /, from the
// server-computed total) — so a signature from a cheap/unrelated payment
// can no longer be used to mark an expensive order as paid.
router.post('/verify-payment', async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new AppError('Missing payment verification fields');
    }

    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (signature !== razorpaySignature) {
      throw new AppError('Payment verification failed', 400);
    }

    const order = await confirmOrderPaid({
      // Binding check: this razorpayOrderId must be the one WE generated
      // for THIS order — not just any signed Razorpay order.
      filter: { _id: orderId, 'payment.razorpayOrderId': razorpayOrderId },
      razorpayPaymentId,
      note: 'Payment confirmed by client',
    });

    if (!order) {
      // Either the order doesn't exist, the razorpayOrderId doesn't match
      // it, or it was already confirmed (e.g. the webhook beat us to it —
      // in that case treat it as success, not an error).
      const existing = await Order.findOne({ _id: orderId, 'payment.razorpayOrderId': razorpayOrderId });
      if (existing?.payment?.status === 'paid') {
        return res.json({ success: true, order: existing });
      }
      throw new AppError('Order not found or does not match this payment', 404);
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/my — user orders
router.get('/my', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('items.product', 'name slug thumbnail');
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:orderId
//
// SECURITY: previously this had no auth/ownership check at all, so anyone
// who knew or guessed an order's public orderId (e.g. "GKN-A1B2C3") could
// view another customer's full name, phone number and address. Now:
//   - if the order belongs to a logged-in user, only that user (or an
//     admin) can view it;
//   - if it's a guest order, the caller must also know the email address
//     the order was placed with (?email=...), which isn't part of the
//     shareable order ID itself.
router.get('/:orderId', optionalAuth, async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('items.product', 'name slug thumbnail');
    if (!order) throw new AppError('Order not found', 404);

    const isOwner = req.user && order.user && req.user._id.equals(order.user);
    const isAdmin = req.user?.role === 'admin';

    if (order.user) {
      if (!isOwner && !isAdmin) {
        throw new AppError('Not authorized to view this order', 403);
      }
    } else {
      // Guest order — require the email it was placed with.
      const suppliedEmail = (req.query.email || '').toLowerCase().trim();
      const matches = order.guestEmail && suppliedEmail === order.guestEmail.toLowerCase();
      if (!matches && !isAdmin) {
        throw new AppError('Not authorized to view this order', 403);
      }
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

export default router;
