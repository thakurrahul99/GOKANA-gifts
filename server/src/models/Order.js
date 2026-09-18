import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  variant: String,
  personalisation: {
    name: String,
    message: String,
    photo: String,
    note: String,
  },
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  timestamp: { type: Date, default: Date.now },
  note: String,
  updatedBy: String,
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // GKN-XXXXXX
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: String,
  guestPhone: String,

  items: [orderItemSchema],

  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },

  billing: {
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: String,
  },

  payment: {
    method: { type: String, enum: ['online', 'cod', 'whatsapp'], default: 'online' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
  },

  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'],
    default: 'PENDING',
  },

  statusHistory: [statusHistorySchema],

  tracking: {
    provider: String,
    trackingNumber: String,
    trackingUrl: String,
  },

  giftMessage: String,
  specialInstructions: String,

  expectedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
}, { timestamps: true });

// Auto-generate order ID
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    this.orderId = `GKN-${random}`;
  }
  next();
});

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
