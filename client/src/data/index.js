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
    rating: 0,
    reviews: 0,
    image: chocolatesImg,
    image2: hamperImg,
    categories: ['birthday', 'anniversary', 'valentine'],
    tags: ['featured'],
    inStock: true,
    personalisable: true,
    variants: ['20 Pieces', '32 Pieces', '50 Pieces'],
    badge: 'Personalise It',
    description: 'A curated selection of 20 handcrafted Belgian chocolates infused with authentic Indian flavours — saffron, cardamom, rose and more.',
  },
  {
    id: 'p2',
    slug: 'serenity-candle-trio',
    name: 'Serenity Candle Trio',
    tagline: 'Premium soy candles in three signature scents',
    price: 1499,
    originalPrice: null,
    rating: 0,
    reviews: 0,
    image: candlesImg,
    image2: skincareImg,
    categories: ['thankyou', 'justbecause', 'birthday'],
    tags: ['featured', 'new'],
    inStock: true,
    personalisable: true,
    variants: ['Jasmine & Amber', 'Sandalwood & Rose', 'Vetiver & Oud'],
    badge: 'New Arrival',
    description: 'Three premium soy candles in signature scents, presented in handcrafted glass jars with elegant labels.',
  },
  {
    id: 'p3',
    slug: 'grand-celebration-hamper',
    name: 'Grand Celebration Hamper',
    tagline: 'A festive collection of handcrafted Indian sweets and treats',
    price: 3499,
    originalPrice: 4200,
    rating: 0,
    reviews: 0,
    image: hamperImg,
    image2: chocolatesImg,
    categories: ['diwali', 'corporate', 'wedding'],
    tags: ['featured'],
    inStock: true,
    personalisable: false,
    variants: ['Standard', 'Premium', 'Luxury'],
    badge: 'New Arrival',
    description: 'A grand hamper filled with premium dry fruits, fine teas, saffron cookies and handcrafted sweets — presented in a beautiful wicker basket.',
  },
  {
    id: 'p4',
    slug: 'botanical-skincare-ritual',
    name: 'Botanical Skincare Ritual',
    tagline: 'Luxurious botanical skincare curated for gifting',
    price: 2699,
    originalPrice: 3200,
    rating: 0,
    reviews: 0,
    image: skincareImg,
    image2: candlesImg,
    categories: ['birthday', 'thankyou', 'justbecause'],
    tags: ['featured'],
    inStock: true,
    personalisable: true,
    variants: ['Rose & Saffron', 'Sandalwood & Turmeric', 'Vetiver & Neem'],
    badge: 'Personalise It',
    description: 'A luxurious skincare set featuring a botanical face serum, whipped moisturiser and rose water mist — all crafted from Indian botanicals.',
  },
];
