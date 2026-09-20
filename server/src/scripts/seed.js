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

    // Seed sample products
    const SAMPLE_PRODUCTS = [
      {
        name: 'Signature Chocolate Collection',
        slug: 'signature-chocolate-collection',
        tagline: 'Handcrafted Belgian chocolates with Indian flavours',
        description: 'A curated selection of 20 handcrafted Belgian chocolates infused with authentic Indian flavours — saffron, cardamom, rose and more.',
        price: 1899,
        originalPrice: 2499,
        stock: 50,
        inStock: true,
        isFeatured: true,
        badge: 'Bestseller',
        rating: 4.9,
        reviewCount: 128,
        tags: ['bestseller', 'featured'],
        personalisable: true,
        variants: [
          { label: '20 Pieces', sku: 'CHOC-20', stock: 25 },
          { label: '32 Pieces', sku: 'CHOC-32', stock: 15 },
          { label: '50 Pieces', sku: 'CHOC-50', stock: 10 },
        ],
      },
      {
        name: 'Serenity Candle Trio',
        slug: 'serenity-candle-trio',
        tagline: 'Premium soy candles in three signature scents',
        description: 'Three premium soy candles in signature scents, presented in artisanal glass vessels with hand-stamped labels.',
        price: 1499,
        stock: 40,
        inStock: true,
        isFeatured: true,
        badge: 'New',
        rating: 4.8,
        reviewCount: 94,
        tags: ['featured', 'new'],
        personalisable: true,
        variants: [
          { label: 'Jasmine & Amber', sku: 'CANDLE-JA', stock: 15 },
          { label: 'Sandalwood & Rose', sku: 'CANDLE-SR', stock: 15 },
          { label: 'Vetiver & Oud', sku: 'CANDLE-VO', stock: 10 },
        ],
      },
      {
        name: 'Grand Celebration Hamper',
        slug: 'grand-celebration-hamper',
        tagline: 'A curated collection of artisanal Indian delicacies',
        description: 'A grand hamper filled with artisanal dry fruits, premium teas, saffron cookies and handcrafted sweets — presented in a beautiful wicker basket.',
        price: 3499,
        originalPrice: 4200,
        stock: 20,
        inStock: true,
        isFeatured: true,
        badge: 'Most Loved',
        rating: 4.9,
        reviewCount: 67,
        tags: ['bestseller', 'featured'],
        personalisable: false,
        variants: [
          { label: 'Standard', sku: 'HAMPER-STD', stock: 8 },
          { label: 'Premium', sku: 'HAMPER-PRE', stock: 7 },
          { label: 'Luxury', sku: 'HAMPER-LUX', stock: 5 },
        ],
      },
      {
        name: 'Botanical Skincare Ritual',
        slug: 'botanical-skincare-ritual',
        tagline: 'Luxurious botanical skincare curated for gifting',
        description: 'A luxurious skincare set featuring a botanical face serum, whipped moisturiser and rose water mist — all crafted from Indian botanicals.',
        price: 2699,
        originalPrice: 3200,
        stock: 30,
        inStock: true,
        isFeatured: false,
        badge: null,
        rating: 4.7,
        reviewCount: 52,
        tags: ['featured'],
        personalisable: true,
        variants: [
          { label: 'Rose & Saffron', sku: 'SKIN-RS', stock: 12 },
          { label: 'Sandalwood & Turmeric', sku: 'SKIN-ST', stock: 10 },
          { label: 'Vetiver & Neem', sku: 'SKIN-VN', stock: 8 },
        ],
      },
    ];

    const products = await Product.insertMany(SAMPLE_PRODUCTS);
    console.log(`✦ Seeded ${products.length} products`);

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
