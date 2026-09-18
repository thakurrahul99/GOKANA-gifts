import { Router } from 'express';
import { Coupon } from '../models/Coupon.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// POST /api/coupons/validate — validate a coupon code
router.post('/validate', async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) throw new AppError('Coupon code required');

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) throw new AppError('Invalid coupon code', 404);

    const { valid, reason } = coupon.isValid(orderAmount || 0);
    if (!valid) throw new AppError(reason);

    const discount = coupon.calculateDiscount(orderAmount || 0);

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
        description: coupon.description,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Admin routes ───

// GET /api/coupons (admin)
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ success: true, coupons });
  } catch (err) {
    next(err);
  }
});

// POST /api/coupons (admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    next(err);
  }
});

// PUT /api/coupons/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) throw new AppError('Coupon not found', 404);
    res.json({ success: true, coupon });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/coupons/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
