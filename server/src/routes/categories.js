import { Router } from 'express';
import { Category } from '../models/Category.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

const DEFAULT_CATEGORIES = [
  { name: 'Birthday', slug: 'birthday', emoji: '🎂', sortOrder: 1 },
  { name: 'Anniversary', slug: 'anniversary', emoji: '💍', sortOrder: 2 },
  { name: 'Wedding', slug: 'wedding', emoji: '🌸', sortOrder: 3 },
  { name: 'Diwali', slug: 'diwali', emoji: '🪔', sortOrder: 4 },
  { name: "Valentine's Day", slug: 'valentine', emoji: '❤️', sortOrder: 5 },
  { name: 'Corporate Gifting', slug: 'corporate', emoji: '💼', sortOrder: 6 },
  { name: 'Thank You', slug: 'thankyou', emoji: '🙏', sortOrder: 7 },
  { name: 'Just Because', slug: 'justbecause', emoji: '✨', sortOrder: 8 },
  { name: 'New Baby', slug: 'new-baby', emoji: '👶', sortOrder: 9 },
  { name: 'Housewarming', slug: 'housewarming', emoji: '🏠', sortOrder: 10 },
  { name: 'Graduation', slug: 'graduation', emoji: '🎓', sortOrder: 11 },
  { name: 'Friendship', slug: 'friendship', emoji: '🤝', sortOrder: 12 },
  { name: "Mother's Day", slug: 'mothers-day', emoji: '🌷', sortOrder: 13 },
  { name: "Father's Day", slug: 'fathers-day', emoji: '👔', sortOrder: 14 },
  { name: 'Rakhi', slug: 'rakhi', emoji: '🪢', sortOrder: 15 },
  { name: 'Christmas', slug: 'christmas', emoji: '🎄', sortOrder: 16 },
  { name: 'Holi', slug: 'holi', emoji: '🎨', sortOrder: 17 },
];


router.get('/', async (req, res, next) => {
  try {
    // Keep the admin/product dropdown populated even for existing databases
    // that were seeded before the newer occasion categories were added.
    await Promise.all(DEFAULT_CATEGORIES.map((category) =>
      Category.updateOne(
        { slug: category.slug },
        { $setOnInsert: { ...category, isActive: true } },
        { upsert: true }
      )
    ));
    const categories = await Category.find({ isActive: true }).sort('sortOrder');
    res.json({ success: true, categories });
  } catch (err) { next(err); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) { next(err); }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, category });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
