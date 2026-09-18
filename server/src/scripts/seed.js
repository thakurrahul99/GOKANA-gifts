import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';

dotenv.config();

const CATEGORIES = [
  { name: 'Birthday', slug: 'birthday', emoji: '🎂', sortOrder: 1 },
  { name: 'Anniversary', slug: 'anniversary', emoji: '💍', sortOrder: 2 },
  { name: 'Wedding', slug: 'wedding', emoji: '🌸', sortOrder: 3 },
  { name: 'Diwali', slug: 'diwali', emoji: '🪔', sortOrder: 4 },
  { name: "Valentine's Day", slug: 'valentine', emoji: '❤️', sortOrder: 5 },
  { name: 'Corporate Gifting', slug: 'corporate', emoji: '💼', sortOrder: 6 },
  { name: 'Thank You', slug: 'thankyou', emoji: '🙏', sortOrder: 7 },
  { name: 'Just Because', slug: 'justbecause', emoji: '✨', sortOrder: 8 },
];

const COUPONS = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 500,
    maxDiscount: 300,
    description: '10% off on your first order',
    isActive: true,
  },
  {
    code: 'FLAT200',
    type: 'fixed',
    value: 200,
    minOrderAmount: 1000,
    description: 'Flat ₹200 off on orders above ₹1000',
    isActive: true,
  },
  {
    code: 'DIWALI25',
    type: 'percentage',
    value: 25,
    minOrderAmount: 1500,
    maxDiscount: 750,
    description: '25% off during Diwali season',
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gokana');
    console.log('✦ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('✦ Cleared existing data');

    // Seed categories
    const categories = await Category.insertMany(CATEGORIES);
    console.log(`✦ Seeded ${categories.length} categories`);

    // Seed coupons
    const coupons = await Coupon.insertMany(COUPONS);
    console.log(`✦ Seeded ${coupons.length} coupons`);

    // Seed admin user
    const adminExists = await User.findOne({ email: 'admin@gokana.in' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@gokana.in',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✦ Created admin user: admin@gokana.in / admin123');
    }

    console.log('\n✦ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
