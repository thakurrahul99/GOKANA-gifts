import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, ArrowRight, Zap, Clock } from 'lucide-react';
import clsx from 'clsx';
import { formatPrice, Rating, Badge, getDeliveryDate } from '../ui';
import { useCartStore, useWishlistStore } from '../../store';

export function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const isWished = has(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const deliveryDate = getDeliveryDate(3);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAddingToCart(true);
    addItem(product, product.variants?.[0] || null);
    setTimeout(() => setAddingToCart(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
  };

  return (
    <motion.article
      className="group relative flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <Link
        to={`/products/${product.slug}`}
        className="block relative aspect-product overflow-hidden rounded-xl"
        style={{ background: 'var(--surface-alt)' }}
        aria-label={`View ${product.name}`}
      >
        {/* Primary image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
          loading="lazy"
        />
        {/* Secondary hover image */}
        <img
          src={product.image2 || product.image}
          alt={`${product.name} — alternate view`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
          loading="lazy"
          aria-hidden="true"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5" aria-label="Product badges">
          {product.badge && (
            <Badge
              variant={
                product.badge === 'Bestseller' ? 'bestseller'
                : product.badge === 'New' ? 'new'
                : product.badge === 'Limited' ? 'limited'
                : 'gold'
              }
            >
              {product.badge}
            </Badge>
          )}
          {discount && <Badge variant="sale">−{discount}%</Badge>}
          {product.personalisable && <Badge variant="personalisable">Personalisable</Badge>}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={isWished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWished}
          className="absolute top-3 right-3 rounded-full transition-all duration-300 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2"
          style={{
            width: '36px',
            height: '36px',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            '--tw-ring-color': 'var(--accent)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.92)'; }}
        >
          <Heart
            size={15}
            strokeWidth={1.5}
            style={{
              color: isWished ? 'var(--accent)' : 'var(--muted)',
              fill: isWished ? 'var(--accent)' : 'none',
              transition: 'all 0.2s ease',
            }}
          />
        </button>

        {/* Stock indicator */}
        {product.inStock && product.lowStock && (
          <div
            className="absolute bottom-12 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(183,121,31,0.9)', backdropFilter: 'blur(4px)' }}
          >
            <Zap size={10} fill="white" color="white" />
            <span className="font-sans text-[10px] font-semibold text-white">Only 4 left in stock</span>
          </div>
        )}

        {/* Hover actions */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 flex overflow-hidden"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 font-sans text-xs font-semibold tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none"
                style={{
                  background: addingToCart ? 'var(--success)' : 'var(--accent)',
                  color: addingToCart ? '#FFFFFF' : '#121212',
                }}
                aria-label={addingToCart ? `${product.name} added to cart` : `Add ${product.name} to cart`}
              >
                {addingToCart ? (
                  <>
                    <span>✓</span>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} strokeWidth={1.5} />
                    Add to Cart
                  </>
                )}
              </button>
              <Link
                to={`/products/${product.slug}`}
                className="w-12 flex items-center justify-center transition-colors duration-200 focus-visible:outline-none"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--primary)',
                  borderLeft: '1px solid var(--border-soft)',
                }}
                aria-label={`Quick view ${product.name}`}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-soft)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; }}
              >
                <Eye size={15} strokeWidth={1.5} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Product info */}
      <div className="pt-4 pb-2 flex-1 flex flex-col">
        <Link to={`/products/${product.slug}`} className="block group/name mb-1">
          <h3
            className="font-serif text-lg font-light leading-tight transition-colors duration-200"
            style={{ color: 'var(--text-strong)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; }}
          >
            {product.name}
          </h3>
        </Link>

        <p className="font-sans text-xs mb-3 leading-relaxed line-clamp-1" style={{ color: 'var(--muted)' }}>
          {product.tagline}
        </p>

        {/* Delivery estimate */}
        <p className="font-sans text-[11px] mb-3 flex items-center gap-1" style={{ color: 'var(--success)' }}>
          <Clock size={10} />
          Order today, get by {deliveryDate}
        </p>

        {/* Price + Rating */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-base font-semibold" style={{ color: 'var(--text-strong)' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-sm line-through" style={{ color: 'var(--muted-2)' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Rating value={product.rating} count={product.reviews} size="sm" />
        </div>

        {/* Always-visible mobile Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full py-2.5 font-sans text-xs font-semibold tracking-[0.08em] uppercase flex items-center justify-center gap-2 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 md:hidden"
          style={{
            background: addingToCart ? 'var(--success)' : 'var(--primary)',
            color: '#FFFFFF',
            '--tw-ring-color': 'var(--accent)',
          }}
          aria-label={addingToCart ? 'Added to cart' : `Add ${product.name} to cart`}
        >
          <ShoppingBag size={13} strokeWidth={1.5} />
          {addingToCart ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </motion.article>
  );
}
