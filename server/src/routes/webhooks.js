import { Router } from 'express';
import crypto from 'crypto';
import { Order } from '../models/Order.js';

const router = Router();

/**
 * POST /api/webhooks/razorpay
 * Razorpay webhook for payment events.
 * Configure this URL in Razorpay Dashboard → Settings → Webhooks
 */
router.post('/razorpay', async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (webhookSecret) {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSig) {
      console.warn('[Webhook] Invalid Razorpay signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  }

  const event = req.body;
  console.log(`[Webhook] Razorpay event: ${event.event}`);

  try {
    if (event.event === 'payment.captured') {
      const { order_id, id: payment_id } = event.payload.payment.entity;
      await Order.findOneAndUpdate(
        { 'payment.razorpayOrderId': order_id },
        {
          'payment.status': 'paid',
          'payment.razorpayPaymentId': payment_id,
          'payment.paidAt': new Date(),
          status: 'CONFIRMED',
          $push: { statusHistory: { status: 'CONFIRMED', note: 'Payment captured via webhook' } },
        }
      );
    }

    if (event.event === 'payment.failed') {
      const { order_id } = event.payload.payment.entity;
      await Order.findOneAndUpdate(
        { 'payment.razorpayOrderId': order_id },
        { 'payment.status': 'failed' }
      );
    }

    if (event.event === 'refund.processed') {
      const { payment_id } = event.payload.refund.entity;
      await Order.findOneAndUpdate(
        { 'payment.razorpayPaymentId': payment_id },
        {
          'payment.status': 'refunded',
          status: 'RETURNED',
          $push: { statusHistory: { status: 'RETURNED', note: 'Refund processed' } },
        }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[Webhook] Error processing event:', err.message);
    res.status(500).json({ success: false });
  }
});

export default router;
