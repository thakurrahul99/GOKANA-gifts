import { Order } from '../models/Order.js';
import { Coupon } from '../models/Coupon.js';

/**
 * Marks an order as paid — atomically, and exactly once.
 *
 * Why this exists (bugs it fixes):
 *  1. Both the client-side `/verify-payment` call AND the Razorpay webhook
 *     can try to confirm the same order. Without a guard, a coupon's
 *     `usedCount` could be incremented twice for one order, or status
 *     history could get duplicate "payment confirmed" entries.
 *  2. Coupon usage should only be counted once payment is actually
 *     confirmed — not at order creation — otherwise abandoned/failed
 *     carts silently burn a redemption.
 *
 * The `{ 'payment.status': { $ne: 'paid' } }` filter makes the update
 * atomic: whichever caller (webhook or client) gets there first wins, and
 * the second call is a safe no-op (matchedOrder will be null).
 */
export async function confirmOrderPaid({ filter, razorpayPaymentId, note }) {
  const order = await Order.findOneAndUpdate(
    { ...filter, 'payment.status': { $ne: 'paid' } },
    {
      'payment.status': 'paid',
      'payment.razorpayPaymentId': razorpayPaymentId,
      'payment.paidAt': new Date(),
      status: 'CONFIRMED',
      $push: { statusHistory: { status: 'CONFIRMED', note } },
    },
    { new: true }
  );

  // Already confirmed by the other path (or order not found) — nothing more to do.
  if (!order) return null;

  if (order.billing?.couponCode) {
    await Coupon.findOneAndUpdate(
      { code: order.billing.couponCode },
      { $inc: { usedCount: 1 } }
    );
  }

  return order;
}
