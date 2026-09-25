import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ChevronDown,
  Plus,
  Minus,
  Check,
  Clock,
  AlertCircle,
  Sparkles,
  Star,
  X,
  Send,
  User,
  CheckCircle2,
} from 'lucide-react';
import clsx from 'clsx';
import { products as fallbackProducts } from '../data';
import { API_BASE } from '../lib/api';
import { useCartStore, useWishlistStore, useAuthStore } from '../store';
import { Rating, Badge, Divider, formatPrice, getDeliveryDate } from '../components/ui';
import { ProductCard } from '../components/product/ProductCard';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { BUSINESS_INFO } from '../data/business';

function buildWhatsAppMsg(product, variant, qty) {
  const url = window.location.href;
  return encodeURIComponent(
    `Hi ${BUSINESS_INFO.brandName}! 👋\n\nI'd like to order:\n\n🎁 *${product.name}*\n📦 Variant: ${variant || 'Standard'}\n🔢 Quantity: ${qty}\n💰 Price: ${formatPrice(product.price * qty)}\n\n${url}\n\nPlease help me complete this order. Thank you!`
  );
}

function ImageGallery({ images, productName }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
      <div className="flex sm:flex-col gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar sm:w-20 flex-shrink-0 -mx-1 px-1 sm:mx-0 sm:px-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1} of ${productName}`}
            className={clsx(
              'w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-w-[44px] min-h-[44px]',
              active === i ? 'border-accent shadow-sm' : 'border-border bg-bg-alt opacity-75 hover:opacity-100'
            )}
          >
            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-bg-alt border border-border aspect-[4/5] shadow-xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={productName}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
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

function AccordionItem({ title, children, defaultOpen = false, badge = null }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        className="w-full flex items-center justify-between py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm min-h-[44px]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="font-serif text-base font-light text-ivory">{title}</span>
          {badge && <span className="text-[11px] text-accent font-sans">{badge}</span>}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={17} className="text-accent" />
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
            <div className="pb-4 font-sans text-xs sm:text-sm text-muted leading-relaxed font-light">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const { addItem } = useCartStore();
  const { user, token } = useAuthStore();

  const normalizeProduct = (p) => ({
    ...p,
    id: p._id || p.id,
    image: p.thumbnail || p.images?.[0],
    image2: p.images?.[1] || p.thumbnail || p.images?.[0],
    rating: p.rating ?? 0,
    reviews: p.reviewCount ?? p.reviews ?? 0,
    categories: (p.categories || []).map((c) => (typeof c === 'string' ? c : c.slug)).filter(Boolean),
    variants: (p.variants || []).map((v) => (typeof v === 'string' ? v : v.label)),
  });

  const loadReviews = async (productId) => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews?product=${productId}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch {
      // Quietly keep empty if backend review route is unreachable
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Product not found');
        const current = normalizeProduct(data.product);
        setProduct(current);
        loadReviews(current.id);

        const listRes = await fetch(`${API_BASE}/products?limit=8`);
        const listData = await listRes.json();
        setRelated(
          (listData.products || [])
            .map(normalizeProduct)
            .filter((p) => p.id !== current.id)
            .slice(0, 4)
        );
      } catch (error) {
        console.error('Failed to load product from API, using fallback:', error);
        const fallback = fallbackProducts.find((p) => p.slug === slug || p.id === slug);
        if (fallback) {
          const normalizedFallback = normalizeProduct(fallback);
          setProduct(normalizedFallback);
          loadReviews(normalizedFallback.id);
          setRelated(
            fallbackProducts
              .filter((p) => p.id !== normalizedFallback.id)
              .map(normalizeProduct)
              .slice(0, 4)
          );
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  const { toggle, has } = useWishlistStore();
  const isWished = has(product?.id);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [personalisation, setPersonalisation] = useState({ name: '', message: '', note: '' });
  const personalisationFields = product?.personalisable
    ? product.personalisationFields?.length
      ? product.personalisationFields
      : [
          { type: 'text', label: "Recipient's Name", placeholder: 'e.g. For someone special', required: false },
          { type: 'textarea', label: 'Handwritten Note Message', placeholder: 'Write your heartfelt words here...', required: false },
        ]
    : [];
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setSelectedVariant(product?.variants?.[0] || null);
  }, [product]);

  const images = [product?.image, ...(product?.images || [])].filter(Boolean).filter((img, index, arr) => arr.indexOf(img) === index);
  const estimatedDate = getDeliveryDate(3);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, qty, Object.values(personalisation).some(Boolean) ? personalisation : null);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Compute live rating statistics from genuine verified reviews or product DB
  const genuineReviewCount = reviews.length > 0 ? reviews.length : (product?.reviews || 0);
  const genuineRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length) * 10) / 10
      : (product?.rating || 0);
  const hasGenuineReviews = genuineReviewCount > 0 && genuineRating > 0;

  if (loading) return <div className="pt-40 text-center min-h-screen bg-bg text-ivory"><p className="text-muted">Loading curated gift…</p></div>;
  if (!product) return <div className="pt-40 text-center min-h-screen bg-bg text-ivory"><h1 className="font-serif text-3xl text-ivory">Product Not Found</h1><Link to="/shop" className="btn-primary mt-6 inline-block">Return to Shop</Link></div>;

  return (
    <main id="main-content" className="pt-20 sm:pt-24 md:pt-28 bg-bg text-ivory min-h-screen pb-24 md:pb-20">
      <div className="container-gokana py-6 sm:py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-xs text-muted mb-6 sm:mb-8 overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-accent transition-colors flex-shrink-0">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-accent transition-colors flex-shrink-0">Shop</Link>
          <span>/</span>
          <span className="text-ivory font-medium truncate max-w-xs">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <ScrollReveal direction="scale">
              <ImageGallery images={images} productName={product.name} />
            </ScrollReveal>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Factual Badges only */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.personalisable ? (
                <Badge variant="personalisable">✦ Custom Engravable</Badge>
              ) : (
                <Badge variant="new">✦ New Arrival</Badge>
              )}
              {discount && <Badge variant="sale">Save {discount}%</Badge>}
            </div>

            <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-light text-ivory mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Dynamic Ratings & Reviews UI */}
            <div className="flex items-center gap-3 mb-4">
              {hasGenuineReviews ? (
                <>
                  <Rating value={genuineRating} count={genuineReviewCount} size="md" />
                  <span className="text-xs font-sans text-accent font-semibold bg-accent/15 border border-accent/30 px-2.5 py-0.5 rounded-full">
                    Quality Verified
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs font-sans">
                  <span className="text-muted font-light">No customer reviews yet</span>
                  <span className="text-muted/40">•</span>
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="text-accent hover:text-accent-light font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Be the first to review
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-4">
              <span className="font-serif text-2xl xs:text-3xl font-light text-accent">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-sm sm:text-base text-muted-2 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discount && (
                <span className="font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-bg-alt border border-border space-y-2.5 mb-6 shadow-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <AlertCircle size={15} />
                <span>Handcrafted in limited artisanal batches</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-ivory font-medium pt-2 border-t border-border">
                <Clock size={15} className="text-accent" />
                <span>
                  Order today, estimated delivery by <b className="text-accent">{estimatedDate}</b>
                </span>
              </div>
            </div>

            <p className="font-sans text-sm text-muted leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block font-sans text-xs font-semibold text-ivory mb-2 uppercase tracking-wider">
                  Select Size / Variant: <span className="text-accent font-semibold">{selectedVariant}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={clsx(
                        'px-3.5 sm:px-4 py-2 rounded-lg font-sans text-xs font-semibold uppercase tracking-wider border transition-all min-h-[44px]',
                        selectedVariant === v
                          ? 'border-accent bg-accent text-bg shadow-sm'
                          : 'border-border bg-bg text-ivory hover:border-accent hover:text-accent'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.personalisable && (
              <div className="mb-6 p-4 sm:p-5 rounded-xl bg-bg-alt border border-border shadow-md">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                  <Sparkles size={14} />
                  <span>Free Custom Personalisation</span>
                </div>
                <div className="space-y-3">
                  {personalisationFields.map((field, index) => {
                    const key = field.label || `field-${index}`;
                    const inputId = `personalisation-${index}`;
                    const value = personalisation[key] || '';
                    const updateValue = (next) => setPersonalisation((p) => ({ ...p, [key]: next }));
                    return (
                      <div key={inputId}>
                        <label htmlFor={inputId} className="block font-sans text-xs font-semibold text-ivory mb-1.5 uppercase tracking-wider">
                          {field.label}
                          {field.required ? <span className="text-accent ml-1">*</span> : ''}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            id={inputId}
                            rows={3}
                            placeholder={field.placeholder || ''}
                            value={value}
                            onChange={(e) => updateValue(e.target.value)}
                            className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-ivory text-sm placeholder:text-muted/50 focus:border-accent outline-none resize-none"
                            required={field.required}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            id={inputId}
                            value={value}
                            onChange={(e) => updateValue(e.target.value)}
                            className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-ivory text-sm focus:border-accent outline-none"
                            required={field.required}
                          >
                            <option value="" className="bg-bg text-ivory">
                              Select an option
                            </option>
                            {(field.options || []).map((option) => (
                              <option key={option} value={option} className="bg-bg text-ivory">
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={inputId}
                            type="text"
                            placeholder={field.placeholder || ''}
                            value={value}
                            onChange={(e) => updateValue(e.target.value)}
                            className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-ivory text-sm placeholder:text-muted/50 focus:border-accent outline-none"
                            required={field.required}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted mt-3">
                  Your personalisation is saved with this cart item and sent to GŌKANA with the order.
                </p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-ivory mb-0">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg bg-bg">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-ivory hover:text-accent hover:bg-white/5 rounded-l-lg transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-sans text-sm font-semibold text-ivory">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-ivory hover:text-accent hover:bg-white/5 rounded-r-lg transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-sans text-sm font-semibold text-accent">
                  Total: {formatPrice(product.price * qty)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`btn-primary flex-1 ${addedToCart ? 'bg-accent-light hover:bg-accent-light' : ''}`}
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
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-border bg-bg-alt text-ivory hover:border-accent hover:text-accent'
                  )}
                >
                  <Heart size={20} className={isWished ? 'fill-accent' : ''} />
                </button>
              </div>

              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsapp.number}?text=${buildWhatsAppMsg(product, selectedVariant, qty)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl border border-border bg-bg-alt hover:bg-surface-alt text-ivory hover:border-accent hover:text-accent font-sans text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <MessageCircle size={17} className="text-accent" />
                Order on WhatsApp
              </a>
            </div>

            <div className="space-y-1 border-t border-border pt-2">
              <AccordionItem title="What's Inside the Box" defaultOpen={true}>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-muted">
                  <li>Hand-crafted rigid keepsake box with embossed seal</li>
                  <li>Double-faced satin ribbon tying with gift tag</li>
                  <li>Signature protective botanical tissue wrapping</li>
                  <li>Complimentary calligraphy note card (if personalised)</li>
                </ul>
              </AccordionItem>
              <AccordionItem title="Shipping & Presentation">
                <p className="text-xs text-muted leading-relaxed">
                  Shipped in protective packaging to ensure pristine condition across India. Free delivery for orders over ₹999.
                </p>
              </AccordionItem>
              <AccordionItem title="Customer Reviews" badge={hasGenuineReviews ? `(${genuineReviewCount})` : null}>
                <div className="space-y-4 pt-1">
                  {hasGenuineReviews ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Rating value={genuineRating} size="sm" />
                          <span className="text-xs font-semibold text-ivory">{genuineRating} out of 5</span>
                        </div>
                        <button
                          onClick={() => setReviewModalOpen(true)}
                          className="btn-outline py-1.5 px-3 text-[11px] uppercase tracking-wider"
                        >
                          Write a Review
                        </button>
                      </div>
                      <div className="space-y-3">
                        {reviews.map((rev) => (
                          <div key={rev._id || rev.id} className="p-3 rounded-lg bg-bg border border-border space-y-1.5">
                            <div className="flex items-center justify-between">
                              <Rating value={rev.rating || 5} size="sm" />
                              <span className="text-[10px] text-muted">
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN') : 'Verified Customer'}
                              </span>
                            </div>
                            {rev.title && <p className="font-serif text-sm text-ivory font-light">{rev.title}</p>}
                            <p className="text-xs text-muted font-light">{rev.review}</p>
                            <p className="text-[10px] text-accent font-medium">
                              — {rev.user?.name || 'Verified Buyer'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5 px-4 rounded-lg bg-bg border border-border space-y-2.5">
                      <p className="font-serif text-base text-ivory font-light">Be the first to review this gift</p>
                      <p className="text-xs text-muted max-w-sm mx-auto font-light">
                        Share your thoughts and gifting experience. Your feedback helps other shoppers choose the perfect gift.
                      </p>
                      <button
                        onClick={() => setReviewModalOpen(true)}
                        className="btn-outline text-xs uppercase tracking-wider py-2 px-4 mt-2 inline-flex items-center gap-1.5"
                      >
                        <Star size={13} className="text-accent" />
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-border">
          <div className="text-center mb-8 sm:mb-10">
            <p className="label-text text-accent mb-2">✦ More to Cherish</p>
            <h2 className="heading-md text-ivory">You May Also Love</h2>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        product={product}
        onReviewSubmitted={() => loadReviews(product.id)}
      />

      {/* Quick Mobile Checkout Bar */}
      <aside
        className="fixed bottom-0 left-0 right-0 z-40 bg-bg/95 backdrop-blur-md border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-4 shadow-2xl flex items-center justify-between gap-3 md:hidden"
        aria-label="Quick mobile checkout"
      >
        <div className="pl-1 min-w-0">
          <p className="font-serif text-base sm:text-lg font-semibold text-accent leading-none truncate">
            {formatPrice(product.price)}
          </p>
          <p className="font-sans text-[10px] sm:text-[11px] text-accent font-medium mt-0.5">✓ In Stock</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="btn-primary py-2.5 px-4 sm:px-5 text-xs flex items-center gap-1.5 flex-shrink-0"
          aria-label="Add product to cart"
        >
          {addedToCart ? <Check size={16} /> : <ShoppingBag size={16} />}
          {addedToCart ? 'Added!' : 'Add to Cart'}
        </button>
      </aside>
    </main>
  );
}

function ReviewModal({ isOpen, onClose, product, onReviewSubmitted }) {
  const { user, token } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please sign in to submit a verified customer review.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product.id,
          rating,
          title,
          review,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      setSubmitted(true);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      setError(err.message || 'An error occurred while submitting your review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm" role="dialog" aria-modal="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-bg-alt border border-border rounded-2xl p-6 sm:p-8 shadow-2xl text-ivory max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-accent p-1.5 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Close review modal"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <p className="label-text text-accent mb-1">✦ Share Your Feedback</p>
          <h2 className="font-serif text-2xl text-ivory font-light">Review {product?.name}</h2>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="font-serif text-xl text-ivory">Thank You for Your Review</h3>
            <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
              Your genuine review has been submitted for verification. It will appear on the product page shortly.
            </p>
            <button onClick={onClose} className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider mt-4">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <div className="p-3.5 rounded-lg bg-bg border border-accent/30 text-xs text-muted flex items-start justify-between gap-3">
                <span>Sign in to verify your purchase and publish your review.</span>
                <Link to={`/login?redirect=/products/${product?.slug}`} className="text-accent font-semibold underline whitespace-nowrap">
                  Sign In
                </Link>
              </div>
            )}

            <div>
              <label className="block font-sans text-xs font-semibold text-ivory mb-2 uppercase tracking-wider">
                Your Rating <span className="text-accent">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={24}
                      className={clsx(
                        star <= (hoverRating || rating) ? 'fill-accent text-accent' : 'text-border'
                      )}
                    />
                  </button>
                ))}
                <span className="text-xs text-accent font-medium ml-2">{hoverRating || rating} / 5</span>
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold text-ivory mb-1.5 uppercase tracking-wider">
                Review Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Exceptional packaging and presentation"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-ivory text-sm placeholder:text-muted/50 focus:border-accent outline-none"
              />
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold text-ivory mb-1.5 uppercase tracking-wider">
                Your Review <span className="text-accent">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you love about this gift? How was the recipient's reaction?"
                className="w-full px-4 py-2.5 bg-bg border border-border rounded-lg text-ivory text-sm placeholder:text-muted/50 focus:border-accent outline-none resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="btn-outline py-2.5 px-4 text-xs uppercase tracking-wider">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-semibold flex items-center gap-2"
              >
                {submitting ? 'Submitting…' : <><Send size={14} /> Submit Review</>}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

