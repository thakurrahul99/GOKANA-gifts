import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number }, // cap for percentage coupons
  usageLimit: { type: Number }, // total uses allowed
  usagePerUser: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  validFrom: Date,
  validUntil: Date,
  isActive: { type: Boolean, default: true },
  description: String,
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
}, { timestamps: true });

couponSchema.methods.isValid = function (orderAmount) {
  const now = new Date();
  if (!this.isActive) return { valid: false, reason: 'Coupon is not active' };
  if (this.validFrom && now < this.validFrom) return { valid: false, reason: 'Coupon not yet active' };
  if (this.validUntil && now > this.validUntil) return { valid: false, reason: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit) return { valid: false, reason: 'Coupon usage limit reached' };
  if (orderAmount < this.minOrderAmount) return { valid: false, reason: `Minimum order of ₹${this.minOrderAmount} required` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (amount) {
  if (this.type === 'fixed') return Math.min(this.value, amount);
  const pct = (amount * this.value) / 100;
  return this.maxDiscount ? Math.min(pct, this.maxDiscount) : pct;
};

export const Coupon = mongoose.model('Coupon', couponSchema);
