// Product & occasion data used throughout the app

import heroImg from '../assets/images/hero.webp';
import heroLuxuryImg from '../assets/images/hero_luxury.webp';
import brandStoryImg from '../assets/images/brand_story.webp';
import birthdayImg from '../assets/images/occasion_birthday.webp';
import diwaliImg from '../assets/images/occasion_diwali.webp';
import anniversaryImg from '../assets/images/occasion_anniversary.webp';
import weddingImg from '../assets/images/occasion_wedding.webp';
import chocolatesImg from '../assets/images/product_chocolates.webp';
import candlesImg from '../assets/images/product_candles.webp';
import hamperImg from '../assets/images/product_hamper.webp';
import skincareImg from '../assets/images/product_skincare.webp';

import { BUSINESS_INFO } from './business';

export { heroImg, heroLuxuryImg, brandStoryImg, birthdayImg, diwaliImg, anniversaryImg, weddingImg, BUSINESS_INFO };

export const occasions = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', image: birthdayImg, description: 'Celebrate their special day with joy' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💍', image: anniversaryImg, description: 'Timeless gifts of love & romance' },
  { id: 'wedding', label: 'Wedding', emoji: '🌸', image: weddingImg, description: 'Blessings for a beautiful new beginning' },
  { id: 'thankyou', label: 'Thank You', emoji: '🙏', image: candlesImg, description: 'Express heartfelt thanks & appreciation' },
  { id: 'festive', label: 'Festive', emoji: '🪔', image: diwaliImg, description: 'Brighten celebrations with joyful gifts' },
  { id: 'corporate', label: 'Corporate', emoji: '💼', image: hamperImg, description: 'Premium gift hampers for clients & teams' },
];

export const products = [
  {
    id: 'p1',
    slug: 'signature-chocolate-collection',
    name: 'Signature Chocolate Collection',
    tagline: 'Handcrafted Belgian chocolates with Indian flavours',
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 128,
    image: chocolatesImg,
    image2: hamperImg,
    categories: ['birthday', 'anniversary', 'valentine'],
    tags: ['bestseller', 'featured'],
    inStock: true,
    personalisable: true,
    variants: ['20 Pieces', '32 Pieces', '50 Pieces'],
    badge: 'Bestseller',
    description: 'A curated selection of 20 handcrafted Belgian chocolates infused with authentic Indian flavours — saffron, cardamom, rose and more.',
  },
  {
    id: 'p2',
    slug: 'serenity-candle-trio',
    name: 'Serenity Candle Trio',
    tagline: 'Premium soy candles in three signature scents',
    price: 1499,
    originalPrice: null,
    rating: 4.8,
    reviews: 94,
    image: candlesImg,
    image2: skincareImg,
    categories: ['thankyou', 'justbecause', 'birthday'],
    tags: ['featured', 'new'],
    inStock: true,
    personalisable: true,
    variants: ['Jasmine & Amber', 'Sandalwood & Rose', 'Vetiver & Oud'],
    badge: 'New',
    description: 'Three premium soy candles in signature scents, presented in artisanal glass vessels with hand-stamped labels.',
  },
  {
    id: 'p3',
    slug: 'grand-celebration-hamper',
    name: 'Grand Celebration Hamper',
    tagline: 'A curated collection of artisanal Indian delicacies',
    price: 3499,
    originalPrice: 4200,
    rating: 4.9,
    reviews: 67,
    image: hamperImg,
    image2: chocolatesImg,
    categories: ['diwali', 'corporate', 'wedding'],
    tags: ['bestseller', 'featured'],
    inStock: true,
    personalisable: false,
    variants: ['Standard', 'Premium', 'Luxury'],
    badge: 'Most Loved',
    description: 'A grand hamper filled with artisanal dry fruits, premium teas, saffron cookies and handcrafted sweets — presented in a beautiful wicker basket.',
  },
  {
    id: 'p4',
    slug: 'botanical-skincare-ritual',
    name: 'Botanical Skincare Ritual',
    tagline: 'Luxurious botanical skincare curated for gifting',
    price: 2699,
    originalPrice: 3200,
    rating: 4.7,
    reviews: 52,
    image: skincareImg,
    image2: candlesImg,
    categories: ['birthday', 'thankyou', 'justbecause'],
    tags: ['featured'],
    inStock: true,
    personalisable: true,
    variants: ['Rose & Saffron', 'Sandalwood & Turmeric', 'Vetiver & Neem'],
    badge: null,
    description: 'A luxurious skincare set featuring a botanical face serum, whipped moisturiser and rose water mist — all crafted from Indian botanicals.',
  },
];

export const testimonials = [
  {
    id: 't1',
    name: 'Priya Menon',
    location: 'Mumbai',
    review: 'I ordered the Diwali hamper for my entire team. The packaging was absolutely stunning — everyone was genuinely impressed. GŌKANA truly understands what premium gifting means.',
    rating: 5,
    product: 'Grand Celebration Hamper',
    initials: 'PM',
  },
  {
    id: 't2',
    name: 'Arjun Kapoor',
    location: 'Delhi',
    review: 'Gifted the chocolate collection to my wife for our anniversary. She was moved to tears — not just by the chocolates but by the beautiful personalised note and packaging.',
    rating: 5,
    product: 'Signature Chocolate Collection',
    initials: 'AK',
  },
  {
    id: 't3',
    name: 'Sneha Iyer',
    location: 'Bangalore',
    review: 'The candle trio is unbelievably beautiful. I ended up ordering one for myself after gifting it. The quality is unlike anything I\'ve seen in India at this price.',
    rating: 5,
    product: 'Serenity Candle Trio',
    initials: 'SI',
  },
  {
    id: 't4',
    name: 'Rahul Sharma',
    location: 'Pune',
    review: 'GŌKANA made our wedding gifting effortless and elegant. 50 gifts delivered on time, each one perfectly packed. Our guests were absolutely wowed.',
    rating: 5,
    product: 'Wedding Gift Collection',
    initials: 'RS',
  },
  {
    id: 't5',
    name: 'Anika Patel',
    location: 'Hyderabad',
    review: 'The skincare gift set was beyond expectations. Every product feels handpicked. The presentation was so premium, I almost didn\'t want to open it!',
    rating: 5,
    product: 'Botanical Skincare Ritual',
    initials: 'AP',
  },
];

export const instagramPosts = [
  { id: 'i1', image: heroImg, likes: '2.4k' },
  { id: 'i2', image: birthdayImg, likes: '1.8k' },
  { id: 'i3', image: brandStoryImg, likes: '3.1k' },
  { id: 'i4', image: diwaliImg, likes: '4.2k' },
  { id: 'i5', image: weddingImg, likes: '2.9k' },
  { id: 'i6', image: hamperImg, likes: '1.6k' },
];
