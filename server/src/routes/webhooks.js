import { Router } from 'express';
import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { confirmOrderPaid } from '../utils/orderPayment.js';

const router = Router();

/**
 * POST /api/webhooks/razorpay
 * Razorpay webhook for payment events.
 * Configure this URL in Razorpay Dashboard → Settings → Webhooks
 *
 * IMPORTANT: signature verification MUST run against the exact raw bytes
 * Razorpay sent, not `JSON.stringify(req.body)`. Re-serializing a parsed
 * object can reorder keys / change spacing and will not reliably match the
 * signature, causing verification to fail unpredictably. `req.rawBody` is
 * captured in index.js via express.json()'s `verify` option — see there.
 */
router.post('/razorpay', async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (webhookSecret) {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (!signature || signature !== expectedSig) {
      console.warn('[Webhook] Invalid Razorpay signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } else {
    console.warn('[Webhook] RAZORPAY_WEBHOOK_SECRET not set — accepting event without verification. Do not run production like this.');
  }

  const event = req.body;
  console.log(`[Webhook] Razorpay event: ${event.event}`);

  try {
    if (event.event === 'payment.captured') {
      const { order_id, id: payment_id } = event.payload.payment.entity;
      // Bound to the order that has THIS razorpayOrderId — combined with the
      // amount having been fixed server-side at order creation, this makes
      // the webhook authoritative without needing to trust the client at all.
      await confirmOrderPaid({
        filter: { 'payment.razorpayOrderId': order_id },
        razorpayPaymentId: payment_id,
        note: 'Payment captured via webhook',
      });
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
