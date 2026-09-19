import { Router } from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { escapeRegex } from '../utils/escapeRegex.js';

const router = Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalOrders, totalRevenue, totalCustomers, activeProducts,
      recentOrders, pendingOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$billing.total' } } }
      ]),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Order.find().sort('-createdAt').limit(10)
        .populate('user', 'name email')
        .populate('items.product', 'name thumbnail'),
      Order.countDocuments({ status: 'PENDING' }),
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCustomers,
        activeProducts,
        pendingOrders,
      },
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      const safe = escapeRegex(search);
      filter.$or = [
        { orderId: new RegExp(safe, 'i') },
        { 'shippingAddress.name': new RegExp(safe, 'i') },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort('-createdAt').skip(skip).limit(Number(limit))
        .populate('user', 'name email'),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, orders, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res, next) => {
  try {
    const { status, note, trackingNumber, trackingUrl, trackingProvider } = req.body;
    const update = {
      status,
      $push: { statusHistory: { status, note, updatedBy: req.user.email } },
    };
    if (trackingNumber) {
      update['tracking.trackingNumber'] = trackingNumber;
      update['tracking.trackingUrl'] = trackingUrl;
      update['tracking.provider'] = trackingProvider;
    }
    if (status === 'DELIVERED') update.deliveredAt = new Date();
    if (status === 'CANCELLED') update.cancelledAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) throw new AppError('Order not found', 404);

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/customers
router.get('/customers', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { role: 'customer' };
    if (search) {
      const safe = escapeRegex(search);
      filter.$or = [
        { name: new RegExp(safe, 'i') },
        { email: new RegExp(safe, 'i') },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).select('-password'),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, customers, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
});

export default router;
