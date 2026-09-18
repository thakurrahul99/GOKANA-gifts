import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { protect } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

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

// POST /api/orders/create-razorpay-order
router.post('/create-razorpay-order', async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!razorpay) throw new AppError('Payment gateway not configured', 503);

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `gkn_${Date.now()}`,
    });

    res.json({ success: true, order: rzpOrder });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders
router.post('/', async (req, res, next) => {
  try {
    const {
      items, shippingAddress, billing, payment,
      giftMessage, specialInstructions,
    } = req.body;

    // Validate & price items
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

    // Coupon validation
    let discount = 0;
    if (billing.couponCode) {
      const coupon = await Coupon.findOne({ code: billing.couponCode.toUpperCase() });
      if (!coupon) throw new AppError('Invalid coupon code');
      const { valid, reason } = coupon.isValid(calculatedSubtotal);
      if (!valid) throw new AppError(reason);
      discount = coupon.calculateDiscount(calculatedSubtotal);
      coupon.usedCount++;
      await coupon.save();
    }

    const shippingCharge = calculatedSubtotal - discount >= 999 ? 0 : 99;
    const total = calculatedSubtotal - discount + shippingCharge;

    const order = await Order.create({
      user: req.user?._id,
      guestEmail: billing.guestEmail,
      items: validatedItems,
      shippingAddress,
      billing: { subtotal: calculatedSubtotal, discount, shippingCharge, total, couponCode: billing.couponCode },
      payment: { method: payment.method },
      giftMessage,
      specialInstructions,
      statusHistory: [{ status: 'PENDING', note: 'Order placed' }],
    });

    // Send WhatsApp notification (if configured)
    // await notifyWhatsApp(order);

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/verify-payment
router.post('/verify-payment', async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (signature !== razorpaySignature) {
      throw new AppError('Payment verification failed', 400);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        'payment.status': 'paid',
        'payment.razorpayOrderId': razorpayOrderId,
        'payment.razorpayPaymentId': razorpayPaymentId,
        'payment.razorpaySignature': razorpaySignature,
        'payment.paidAt': new Date(),
        status: 'CONFIRMED',
        $push: { statusHistory: { status: 'CONFIRMED', note: 'Payment confirmed' } },
      },
      { new: true }
    );

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
router.get('/:orderId', async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('items.product', 'name slug thumbnail');
    if (!order) throw new AppError('Order not found', 404);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

export default router;
