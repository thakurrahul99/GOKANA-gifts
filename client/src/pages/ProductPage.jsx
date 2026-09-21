import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, MessageCircle, ChevronDown, Plus, Minus, Check, Clock, AlertCircle, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { products as fallbackProducts } from '../data';
import { API_BASE } from '../lib/api';
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
      <div className="flex sm:flex-col gap-3 overflow-x-auto no-scrollbar sm:w-20 flex-shrink-0">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`View image ${i + 1} of ${productName}`} className={clsx('w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent', active === i ? 'border-accent shadow-sm' : 'border-[rgba(197,160,89,0.25)] bg-[#181512] opacity-75 hover:opacity-100')}>
            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-[#181512] border border-[rgba(197,160,89,0.25)] aspect-[4/5] shadow-xl">
        <AnimatePresence mode="wait">
          <motion.img key={active} src={images[active]} alt={productName} className="w-full h-full object-cover" loading="eager" decoding="async" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
        </AnimatePresence>
      </div>
    </div>
  );
}

function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[rgba(197,160,89,0.18)]">
      <button className="w-full flex items-center justify-between py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm min-h-[44px]" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="font-serif text-base font-light text-ivory">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}><ChevronDown size={17} className="text-accent" /></motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="pb-4 font-sans text-xs sm:text-sm text-[#A39A8E] leading-relaxed font-light">{children}</div>
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
  const { addItem } = useCartStore();

  const normalizeProduct = (p) => ({
    ...p,
    id: p._id || p.id,
    image: p.thumbnail || p.images?.[0],
    image2: p.images?.[1] || p.thumbnail || p.images?.[0],
    reviews: p.reviewCount ?? p.reviews ?? 0,
    categories: (p.categories || []).map((c) => typeof c === 'string' ? c : c.slug).filter(Boolean),
    variants: (p.variants || []).map((v) => typeof v === 'string' ? v : v.label),
  });

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Product not found');
        const current = normalizeProduct(data.product);
        setProduct(current);
        const listRes = await fetch(`${API_BASE}/products?limit=8`);
        const listData = await listRes.json();
        setRelated((listData.products || []).map(normalizeProduct).filter((p) => p.id !== current.id).slice(0, 4));
      } catch (error) {
        console.error('Failed to load product from API, using fallback:', error);
        const fallback = fallbackProducts.find((p) => p.slug === slug || p.id === slug);
        if (fallback) {
          setProduct(fallback);
          setRelated(fallbackProducts.filter((p) => p.id !== fallback.id).slice(0, 4));
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
    ? (product.personalisationFields?.length ? product.personalisationFields : [
        { type: 'text', label: "Recipient's Name", placeholder: 'e.g. Deepti Agarwal', required: false },
        { type: 'textarea', label: 'Handwritten Note Message', placeholder: 'Write your heartfelt words here...', required: false },
      ])
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

  if (loading) return <div className="pt-40 text-center min-h-screen bg-[#12100E] text-ivory"><p className="text-[#A39A8E]">Loading curated gift…</p></div>;
  if (!product) return <div className="pt-40 text-center min-h-screen bg-[#12100E] text-ivory"><h1 className="font-serif text-3xl text-ivory">Product Not Found</h1><Link to="/shop" className="btn-primary mt-6 inline-block">Return to Shop</Link></div>;

  return (
    <main id="main-content" className="pt-24 md:pt-28 bg-[#12100E] text-ivory min-h-screen pb-20">
      <div className="container-gokana py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-xs text-[#A39A8E] mb-8">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link><span>/</span><Link to="/shop" className="hover:text-accent transition-colors">Shop</Link><span>/</span><span className="text-ivory font-medium truncate max-w-xs">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7"><ScrollReveal direction="scale"><ImageGallery images={images} productName={product.name} /></ScrollReveal></div>
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.badge && <Badge variant="bestseller">{product.badge}</Badge>}{discount && <Badge variant="sale">Save {discount}%</Badge>}{product.personalisable && <Badge variant="personalisable">✦ Custom Engravable</Badge>}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-ivory mb-3 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4"><Rating value={product.rating || 5} count={product.reviews || 94} size="md" /><span className="text-xs font-sans text-accent font-semibold bg-accent/15 border border-accent/30 px-2.5 py-0.5 rounded-full">Quality Verified</span></div>
            <div className="flex items-baseline gap-3 mb-4"><span className="font-serif text-3xl font-light text-accent">{formatPrice(product.price)}</span>{product.originalPrice && <span className="font-sans text-base text-[#6E665C] line-through">{formatPrice(product.originalPrice)}</span>}{discount && <span className="font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">Save {formatPrice(product.originalPrice - product.price)}</span>}</div>
            <div className="p-4 rounded-xl bg-[#181512] border border-[rgba(197,160,89,0.2)] space-y-2.5 mb-6 shadow-md"><div className="flex items-center gap-2 text-xs font-semibold text-accent"><AlertCircle size={15} /><span>Only 4 left in stock — packed in limited batches</span></div><div className="flex items-center gap-2 text-xs text-ivory font-medium pt-2 border-t border-[rgba(197,160,89,0.15)]"><Clock size={15} className="text-accent" /><span>Order today, estimated delivery by <b className="text-accent">{estimatedDate}</b></span></div></div>
            <p className="font-sans text-sm text-[#A39A8E] leading-relaxed mb-6 font-light">{product.description}</p>
            {product.variants && <div className="mb-6"><label className="block font-sans text-xs font-semibold text-ivory mb-2 uppercase tracking-wider">Select Size / Variant: <span className="text-accent font-semibold">{selectedVariant}</span></label><div className="flex flex-wrap gap-2">{product.variants.map((v) => <button key={v} onClick={() => setSelectedVariant(v)} className={clsx('px-4 py-2 rounded-lg font-sans text-xs font-semibold uppercase tracking-wider border transition-all min-h-[44px]', selectedVariant === v ? 'border-accent bg-accent text-[#12100E] shadow-sm' : 'border-[rgba(197,160,89,0.25)] bg-[#12100E] text-ivory hover:border-accent hover:text-accent')}>{v}</button>)}</div></div>}
            {product.personalisable && <div className="mb-6 p-5 rounded-xl bg-[#181512] border border-[rgba(197,160,89,0.22)] shadow-md"><div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-3"><Sparkles size={14} /><span>Free Custom Personalisation</span></div><div className="space-y-3">{personalisationFields.map((field, index) => { const key = field.label || `field-${index}`; const inputId = `personalisation-${index}`; const value = personalisation[key] || ''; const updateValue = (next) => setPersonalisation((p) => ({ ...p, [key]: next })); return <div key={inputId}><label htmlFor={inputId} className="block font-sans text-xs font-semibold text-ivory mb-1.5 uppercase tracking-wider">{field.label}{field.required ? <span className="text-accent ml-1">*</span> : ''}</label>{field.type === 'textarea' ? <textarea id={inputId} rows={3} placeholder={field.placeholder || ''} value={value} onChange={(e) => updateValue(e.target.value)} className="w-full px-4 py-2.5 bg-[#12100E] border border-[rgba(197,160,89,0.25)] rounded-lg text-ivory text-sm placeholder:text-[#A39A8E]/50 focus:border-accent outline-none resize-none" required={field.required} /> : field.type === 'select' ? <select id={inputId} value={value} onChange={(e) => updateValue(e.target.value)} className="w-full px-4 py-2.5 bg-[#12100E] border border-[rgba(197,160,89,0.25)] rounded-lg text-ivory text-sm focus:border-accent outline-none" required={field.required}><option value="" className="bg-[#12100E] text-ivory">Select an option</option>{(field.options || []).map((option) => <option key={option} value={option} className="bg-[#12100E] text-ivory">{option}</option>)}</select> : <input id={inputId} type="text" placeholder={field.placeholder || ''} value={value} onChange={(e) => updateValue(e.target.value)} className="w-full px-4 py-2.5 bg-[#12100E] border border-[rgba(197,160,89,0.25)] rounded-lg text-ivory text-sm placeholder:text-[#A39A8E]/50 focus:border-accent outline-none" required={field.required} />}</div>; })}</div><p className="text-[11px] text-[#A39A8E] mt-3">Your personalisation is saved with this cart item and sent to GŌKANA with the order.</p></div>}
            <div className="space-y-4 mb-8"><div className="flex items-center gap-4"><span className="font-sans text-xs font-semibold uppercase tracking-wider text-ivory mb-0">Quantity:</span><div className="flex items-center border border-[rgba(197,160,89,0.25)] rounded-lg bg-[#12100E]"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity" className="min-w-[40px] min-h-[40px] flex items-center justify-center text-ivory hover:text-accent hover:bg-white/5 rounded-l-lg transition-colors"><Minus size={14} /></button><span className="w-10 text-center font-sans text-sm font-semibold text-ivory">{qty}</span><button onClick={() => setQty(qty + 1)} aria-label="Increase quantity" className="min-w-[40px] min-h-[40px] flex items-center justify-center text-ivory hover:text-accent hover:bg-white/5 rounded-r-lg transition-colors"><Plus size={14} /></button></div><span className="font-sans text-sm font-semibold text-accent">Total: {formatPrice(product.price * qty)}</span></div>
              <div className="flex items-center gap-3"><button onClick={handleAddToCart} className={`btn-primary flex-1 ${addedToCart ? 'bg-accent-light hover:bg-accent-light' : ''}`}>{addedToCart ? <><Check size={18} />Added to Cart!</> : <><ShoppingBag size={18} />Add to Cart • {formatPrice(product.price * qty)}</>}</button><button onClick={() => toggle(product)} aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'} className={clsx('min-w-[48px] min-h-[48px] rounded-xl border flex items-center justify-center transition-all', isWished ? 'border-accent bg-accent/20 text-accent' : 'border-[rgba(197,160,89,0.25)] bg-[#181512] text-ivory hover:border-accent hover:text-accent')}><Heart size={20} className={isWished ? 'fill-accent' : ''} /></button></div>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMsg(product, selectedVariant, qty)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 px-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-300 font-sans text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 min-h-[44px]"><MessageCircle size={17} />Order on WhatsApp</a>
            </div>
            <div className="space-y-1 border-t border-[rgba(197,160,89,0.18)] pt-2">
              <AccordionItem title="What's Inside the Box" defaultOpen={true}><ul className="list-disc list-inside space-y-1.5 text-xs text-[#A39A8E]"><li>Hand-crafted rigid keepsake box with embossed rose gold seal</li><li>Double-faced satin ribbon tying with gift tag</li><li>Signature protective botanical tissue wrapping</li><li>Complimentary calligraphy note card (if personalized)</li></ul></AccordionItem>
              <AccordionItem title="Shipping & Climate Control"><p className="text-xs text-[#A39A8E] leading-relaxed">Shipped in insulated protective packing to ensure pristine condition even in summer months. Free delivery across India for orders over ₹999.</p></AccordionItem>
              <AccordionItem title="7-Day Guarantee & Returns"><p className="text-xs text-[#A39A8E] leading-relaxed">Every product is inspected by our quality manager before dispatch. Non-personalized items can be returned within 7 days with zero friction.</p></AccordionItem>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-16 border-t border-[rgba(197,160,89,0.18)]"><div className="text-center mb-10"><p className="label-text text-accent mb-2">✦ More to Cherish</p><h2 className="heading-md text-ivory">You May Also Love</h2></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div></div>
      </div>
      <aside className="fixed bottom-0 left-0 right-0 z-40 bg-[#12100E]/95 backdrop-blur-md border-t border-[rgba(197,160,89,0.2)] p-3 shadow-2xl flex items-center justify-between gap-3 md:hidden" aria-label="Quick mobile checkout"><div className="pl-2"><p className="font-serif text-lg font-semibold text-accent leading-none">{formatPrice(product.price)}</p><p className="font-sans text-[11px] text-accent font-medium mt-0.5">✓ In Stock</p></div><button onClick={handleAddToCart} className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1.5" aria-label="Add product to cart">{addedToCart ? <Check size={16} /> : <ShoppingBag size={16} />}{addedToCart ? 'Added!' : 'Add to Cart'}</button></aside>
    </main>
  );
}
