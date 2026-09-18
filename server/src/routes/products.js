import { Router } from 'express';
import { Product } from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET /api/products — list with filters
router.get('/', async (req, res, next) => {
  try {
    const {
      search, category, tag, minPrice, maxPrice, personalisable,
      sort = '-createdAt', page = 1, limit = 20,
      featured, inStock,
    } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.categories = category;
    if (tag) filter.tags = tag;
    if (personalisable === 'true') filter.personalisable = true;
    if (featured === 'true') filter.isFeatured = true;
    if (inStock === 'true') filter.inStock = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(Number(limit)).populate('categories', 'name slug'),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('categories', 'name slug');
    if (!product) throw new AppError('Product not found', 404);
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// POST /api/products (admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) throw new AppError('Product not found', 404);
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id (admin) — soft delete
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) {
    next(err);
  }
});

export default router;
