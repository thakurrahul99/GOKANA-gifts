import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  label: { type: String, required: true },
  sku: { type: String },
  stock: { type: Number, default: 0 },
  priceModifier: { type: Number, default: 0 }, // additional price for this variant
});

const personalisationFieldSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'textarea', 'image', 'select'], required: true },
  label: { type: String, required: true },
  placeholder: String,
  required: { type: Boolean, default: false },
  options: [String], // for select type
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  tagline: { type: String, trim: true },
  description: { type: String, required: true },
  whatsIncluded: [String],

  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  cost: { type: Number }, // for margin tracking

  images: [String], // Cloudinary URLs
  thumbnail: String,

  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [String], // 'bestseller', 'featured', 'new'
  badge: { type: String, enum: ['Bestseller', 'New', 'Most Loved', null], default: null },

  variants: [variantSchema],
  personalisable: { type: Boolean, default: false },
  personalisationFields: [personalisationFieldSchema],

  stock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },

  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },

  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  metaTitle: String,
  metaDescription: String,

  weight: Number, // grams, for shipping calc
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
}, { timestamps: true });

productSchema.index({ name: 'text', tagline: 'text', description: 'text', tags: 'text' });
productSchema.index({ categories: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

export const Product = mongoose.model('Product', productSchema);
