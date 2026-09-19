import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, MessageCircle, ChevronDown, Plus, Minus, Check, Clock, AlertCircle, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { products } from '../data';
import { useCartStore, useWishlistStore } from '../store';
import { Rating, Badge, Divider, formatPrice, getDeliveryDate } from '../components/ui';
import { ProductCard } from '../components/product/ProductCard';
import { ScrollReveal } from '../components/ui/ScrollReveal';

const WHATSAPP_NUMBER = '919999999999';

function buildWhatsAppMsg(product, variant, qty) {
  const url = window.location.href;
  return encodeURIComponent(
    `Hi GŌKANA! 👋\n\nI'd like to order:\n\n🎁 *${product.name}*\n📦 Variant: ${variant || 'Standard'}\n🔢 Quantity: ${qty}\n💰 Price: ${formatPrice(product.price * qty)}\n\n${url}\n\nPlease help me complete this order. Thank you!`
  );
}

function ImageGallery({ images, productName }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-3 overflow-x-auto no-scrollbar sm:w-20 flex-shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1} of ${productName}`}
            className={clsx(
              'w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]',
              active === i ? 'border-[#D4AF37] shadow-xs' : 'border-[#E8DFD3] opacity-75 hover:opacity-100'
            )}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-[#FBF8F2] border border-[#E8DFD3] aspect-[4/5]">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={productName}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E8DFD3]">
      <button
        className="w-full flex items-center justify-between py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-sm min-h-[44px]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-sans text-sm font-semibold text-[#0B1F3A]">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={17} className="text-[#6B6B6B]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4 font-sans text-sm text-[#6B6B6B] leading-relaxed">
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
  const estimatedDate = getDeliveryDate(3);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, qty, personalisation.name ? personalisation : null);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (!product) {
    return (
      <div className="pt-40 text-center min-h-screen bg-[#F7F3EC]">
        <h1 className="font-serif text-3xl text-[#0B1F3A]">Product Not Found</h1>
        <Link to="/shop" className="btn-accent mt-6 inline-block">Return to Shop</Link>
      </div>
    );
  }

  return (
    <main id="main-content" className="pt-24 md:pt-28 bg-[#F7F3EC] min-h-screen pb-20">
      <div className="container-gokana py-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-xs text-[#6B6B6B] mb-8">
          <Link to="/" className="hover:text-[#0B1F3A] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#0B1F3A] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#0B1F3A] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left — Image Gallery (7 cols) */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="scale">
              <ImageGallery images={images} productName={product.name} />
            </ScrollReveal>
          </div>

          {/* Right — Product Purchasing Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Badges & Urgency */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.badge && <Badge variant="bestseller">{product.badge}</Badge>}
              {discount && <Badge variant="sale">Save {discount}%</Badge>}
              {product.personalisable && <Badge variant="personalisable">✦ Custom Engravable</Badge>}
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#0B1F3A] mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Star Rating */}
            <div className="flex items-center gap-3 mb-4">
              <Rating value={product.rating || 5} count={product.reviews || 94} size="md" />
              <span className="text-xs font-sans text-[#B08D57] font-semibold bg-[#F3D9D4] px-2 py-0.5 rounded-full">
                Verified Curation
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-serif text-3xl font-light text-[#0B1F3A]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-base text-[#9A9A9A] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discount && (
                <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded bg-[#F3D9D4] text-[#0B1F3A]">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            {/* Scarcity & Delivery Estimator (CRO Requirement) */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD3] space-y-2 mb-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#B7791F]">
                <AlertCircle size={15} />
                <span>Only 4 left in stock — hand-packed in limited batches</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#0B1F3A] font-medium pt-1 border-t border-[#E8DFD3]/50">
                <Clock size={15} className="text-[#D4AF37]" />
                <span>Order today, estimated delivery by <b>{estimatedDate}</b></span>
              </div>
            </div>

            <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && (
              <div className="mb-6">
                <label className="form-label mb-2">
                  Select Size / Variant: <span className="text-[#D4AF37] font-semibold">{selectedVariant}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={clsx(
                        'px-4 py-2 rounded-lg font-sans text-xs font-semibold uppercase tracking-wider border transition-all min-h-[44px]',
                        selectedVariant === v
                          ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-xs'
                          : 'border-[#E8DFD3] bg-white text-[#0B1F3A] hover:border-[#D4AF37]'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Personalization Inputs with Visible Labels (Section 3 & 7) */}
            {product.personalisable && (
              <div className="mb-6 p-5 rounded-xl bg-white border border-[#E8DFD3] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-3">
                  <Sparkles size={14} />
                  <span>Complimentary Personalisation</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="recipient-name" className="form-label">
                      Recipient's Name (for box & card)
                    </label>
                    <input
                      id="recipient-name"
                      type="text"
                      name="recipient-name"
                      autoComplete="name"
                      placeholder="e.g. Radhika Sharma"
                      value={personalisation.name}
                      onChange={(e) => setPersonalisation((p) => ({ ...p, name: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="custom-message" className="form-label">
                      Handwritten Note Message
                    </label>
                    <textarea
                      id="custom-message"
                      rows={2}
                      placeholder="Write your heartfelt words here..."
                      value={personalisation.message}
                      onChange={(e) => setPersonalisation((p) => ({ ...p, message: e.target.value }))}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector & Main CTAs */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="form-label mb-0">Quantity:</span>
                <div className="flex items-center border border-[#E8DFD3] rounded-lg bg-white">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#0B1F3A] hover:bg-[#FBF8F2] rounded-l-lg transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-sans text-sm font-semibold text-[#0B1F3A]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#0B1F3A] hover:bg-[#FBF8F2] rounded-r-lg transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-sans text-sm font-semibold text-[#0B1F3A]">
                  Total: {formatPrice(product.price * qty)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`btn-primary flex-1 ${addedToCart ? 'bg-[#B08D57] hover:bg-[#B08D57]' : ''}`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={18} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Add to Cart • {formatPrice(product.price * qty)}
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggle(product)}
                  aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={clsx(
                    'min-w-[48px] min-h-[48px] rounded-xl border flex items-center justify-center transition-all',
                    isWished
                      ? 'border-[#D4AF37] bg-[#F5E9C8] text-[#D4AF37]'
                      : 'border-[#E8DFD3] bg-white text-[#0B1F3A] hover:border-[#D4AF37]'
                  )}
                >
                  <Heart size={20} className={isWished ? 'fill-[#D4AF37]' : ''} />
                </button>
              </div>

              {/* WhatsApp Quick Order Link */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMsg(product, selectedVariant, qty)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl border border-[#2E7D32]/30 bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 text-[#2E7D32] font-sans text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <MessageCircle size={17} />
                Order via WhatsApp Concierge
              </a>
            </div>

            {/* Accordions */}
            <div className="space-y-1 border-t border-[#E8DFD3] pt-2">
              <AccordionItem title="What's Inside the Box" defaultOpen={true}>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[#6B6B6B]">
                  <li>Hand-crafted rigid keepsake box with embossed gold seal</li>
                  <li>Double-faced satin ribbon tying with gift tag</li>
                  <li>Signature protective botanical tissue wrapping</li>
                  <li>Complimentary calligraphy note card (if personalized)</li>
                </ul>
              </AccordionItem>
              <AccordionItem title="Shipping & Climate Control">
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Shipped in insulated protective packing to ensure pristine condition even in summer months. Free delivery across India for orders over ₹999.
                </p>
              </AccordionItem>
              <AccordionItem title="7-Day Guarantee & Returns">
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Every product is inspected by our quality manager before dispatch. Non-personalized items can be returned within 7 days with zero friction.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related Curations */}
        <div className="mt-20 pt-16 border-t border-[#E8DFD3]">
          <div className="text-center mb-10">
            <p className="label-text text-[#D4AF37] mb-2">✦ More to Cherish</p>
            <h2 className="heading-md text-[#0B1F3A]">You May Also Love</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Mobile CTA Bar (Section 4 & 6 CRO Requirement) ── */}
      <aside
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DFD3] p-3 shadow-lg flex items-center justify-between gap-3 md:hidden"
        aria-label="Quick mobile checkout"
      >
        <div className="pl-2">
          <p className="font-serif text-lg font-semibold text-[#0B1F3A] leading-none">
            {formatPrice(product.price)}
          </p>
          <p className="font-sans text-[11px] text-[#B08D57] font-medium mt-0.5">
            ✓ In Stock
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="btn-accent py-2.5 px-5 text-xs flex items-center gap-1.5"
          aria-label="Add product to cart"
        >
          {addedToCart ? <Check size={16} /> : <ShoppingBag size={16} />}
          {addedToCart ? 'Added!' : 'Add to Cart'}
        </button>
      </aside>
    </main>
  );
}
