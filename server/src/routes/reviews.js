import { Router } from 'express';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET /api/reviews?product=<id>
router.get('/', async (req, res, next) => {
  try {
    const filter = { isApproved: true };
    if (req.query.product) filter.product = req.query.product;
    const reviews = await Review.find(filter).sort('-createdAt').populate('user', 'name').lean();
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
});

// POST /api/reviews
router.post('/', protect, async (req, res, next) => {
  try {
    const { product, rating, title, review, images } = req.body;
    const existing = await Review.findOne({ product, user: req.user._id });
    if (existing) throw new AppError('You have already reviewed this product');
    const newReview = await Review.create({
      product, user: req.user._id, rating, title, review, images,
    });
    // Recalculate product rating
    const reviews = await Review.find({ product, isApproved: true });
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(product, { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length });
    res.status(201).json({ success: true, review: newReview });
  } catch (err) { next(err); }
});

// PUT /api/reviews/:id/approve (admin)
router.put('/:id/approve', protect, adminOnly, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, review });
  } catch (err) { next(err); }
});

export default router;
