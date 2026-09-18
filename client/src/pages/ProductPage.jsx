import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, MessageCircle, Star, ChevronDown, Plus, Minus, ArrowRight, Check } from 'lucide-react';
import clsx from 'clsx';
import { products } from '../data';
import { useCartStore, useWishlistStore } from '../store';
import { Rating, Badge, Divider, formatPrice } from '../components/ui';
import { ProductCard } from '../components/product/ProductCard';
import { ScrollReveal } from '../components/ui/ScrollReveal';

const WHATSAPP_NUMBER = '919999999999';

function buildWhatsAppMsg(product, variant, qty) {
  const url = window.location.href;
  return encodeURIComponent(
    `Hi GŌKANA! 👋\n\nI'd like to order:\n\n🎁 *${product.name}*\n📦 Variant: ${variant || 'Standard'}\n🔢 Quantity: ${qty}\n💰 Price: ${formatPrice(product.price * qty)}\n\n${url}\n\nPlease help me complete the order. Thank you!`
  );
}

function ImageGallery({ images }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3 w-20 flex-shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={clsx(
              'w-20 h-20 overflow-hidden border-2 transition-all duration-200',
              active === i ? 'border-gold' : 'border-transparent hover:border-charcoal/20'
            )}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative overflow-hidden bg-beige aspect-[4/5]">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt="Product"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-charcoal/10">
      <button
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-sans text-sm font-medium text-charcoal">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={16} strokeWidth={1.5} className="text-charcoal/40" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-5 font-sans text-sm text-charcoal/60 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug) || products[0];
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const isWished = has(product?.id);

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [qty, setQty] = useState(1);
  const [personalisation, setPersonalisation] = useState({ name: '', message: '', note: '' });
  const [addedToCart, setAddedToCart] = useState(false);

  const related = products.filter((p) => p.id !== product?.id).slice(0, 4);
  const images = [product?.image, product?.image2 || product?.image].filter(Boolean);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, qty, personalisation.name ? personalisation : null);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (!product) return (
    <div className="pt-40 text-center">
      <p className="font-serif text-2xl text-charcoal/40">Product not found</p>
      <Link to="/shop" className="btn-ghost mt-4">Back to Shop</Link>
    </div>
  );

  return (
    <main className="pt-24 bg-ivory min-h-screen">
      <div className="container-gokana py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-xs text-charcoal/40 mb-8">
          <Link to="/" className="hover:text-charcoal">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-charcoal">Shop</Link>
          <span>/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Gallery */}
          <ScrollReveal direction="scale">
            <ImageGallery images={images} />
          </ScrollReveal>

          {/* Right — Product info */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              {product.badge && <Badge variant="gold">{product.badge}</Badge>}
              {discount && <Badge variant="sale">−{discount}% off</Badge>}
              {product.personalisable && <Badge variant="champagne">Personalisable</Badge>}
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-light text-charcoal mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <Rating value={product.rating} count={product.reviews} size="md" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl font-light text-charcoal">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="font-sans text-lg text-charcoal/35 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {discount && (
                <span className="font-sans text-sm text-green-700 font-medium">Save {discount}%</span>
              )}
            </div>

            <Divider className="mb-6" />

            <p className="body-text text-charcoal/65 mb-8 max-w-lg">{product.description}</p>

            {/* Variant selector */}
            {product.variants && (
              <div className="mb-8">
                <p className="font-sans text-xs font-medium text-charcoal tracking-[0.1em] uppercase mb-3">
                  Select: <span className="text-gold">{selectedVariant}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={clsx(
                        'px-4 py-2 font-sans text-sm border transition-all duration-200',
                        selectedVariant === v
                          ? 'border-gold bg-gold/10 text-charcoal'
                          : 'border-charcoal/20 text-charcoal/60 hover:border-charcoal'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Personalization */}
            {product.personalisable && (
              <div className="mb-8 p-5 bg-champagne/20 border border-champagne/40">
                <p className="font-sans text-xs font-medium tracking-[0.12em] uppercase text-gold mb-4">✦ Personalise Your Gift</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Recipient's name (e.g. Priya)"
                    value={personalisation.name}
                    onChange={(e) => setPersonalisation((p) => ({ ...p, name: e.target.value }))}
                    className="input-premium"
                  />
                  <textarea
                    placeholder="Custom message (e.g. Happy Birthday Priya! Wishing you…)"
                    value={personalisation.message}
                    onChange={(e) => setPersonalisation((p) => ({ ...p, message: e.target.value }))}
                    className="input-premium resize-none"
                    rows={2}
                  />
                  <input
                    type="text"
                    placeholder="Special note for packaging"
                    value={personalisation.note}
                    onChange={(e) => setPersonalisation((p) => ({ ...p, note: e.target.value }))}
                    className="input-premium"
                  />
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="flex items-center gap-4 mb-6">
              <p className="font-sans text-xs font-medium tracking-[0.1em] uppercase text-charcoal">Qty</p>
              <div className="flex items-center border border-charcoal/20">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-charcoal/60 hover:text-charcoal">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-sans text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-charcoal/60 hover:text-charcoal">
                  <Plus size={14} />
                </button>
              </div>
              <p className="font-sans text-sm font-medium text-charcoal">{formatPrice(product.price * qty)}</p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                className={clsx(
                  'btn-primary flex-1 justify-center',
                  addedToCart && 'bg-green-700'
                )}
              >
                {addedToCart ? (
                  <><Check size={16} /> Added to Cart</>
                ) : (
                  <><ShoppingBag size={16} /> Add to Cart</>
                )}
              </button>
              <button
                onClick={handleAddToCart}
                className="btn-secondary flex-1 justify-center"
              >
                Buy Now
              </button>
              <button
                onClick={() => toggle(product)}
                className={clsx(
                  'w-12 h-12 border flex items-center justify-center transition-all duration-300 flex-shrink-0',
                  isWished
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-charcoal/20 text-charcoal/50 hover:border-gold hover:text-gold'
                )}
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.5} fill={isWished ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMsg(product, selectedVariant, qty)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 border border-green-700/40 text-green-700 hover:bg-green-50 transition-colors font-sans text-sm font-medium mb-8"
            >
              <MessageCircle size={16} />
              Order via WhatsApp
            </a>

            {/* Info accordions */}
            <div>
              <AccordionItem title="What's Included">
                <ul className="list-disc list-inside space-y-1">
                  <li>Premium {product.name}</li>
                  <li>Handcrafted gift box with tissue paper</li>
                  <li>Silk ribbon and custom gift tag</li>
                  {product.personalisable && <li>Personalised message card (if added)</li>}
                </ul>
              </AccordionItem>
              <AccordionItem title="Shipping Information">
                <p>We ship across India in 2–4 business days. Express delivery available at checkout. Free shipping on orders above ₹999.</p>
              </AccordionItem>
              <AccordionItem title="Returns & Exchanges">
                <p>Personalised items cannot be returned unless defective. Non-personalised items can be returned within 7 days of delivery. Please contact us on WhatsApp or email.</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-24">
          <ScrollReveal>
            <h2 className="heading-md text-charcoal mb-10">You may also love</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
