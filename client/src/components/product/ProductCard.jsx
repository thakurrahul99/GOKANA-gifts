import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { formatPrice, Rating, Badge } from '../ui';
import { useCartStore, useWishlistStore } from '../../store';

export function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const isWished = has(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.variants?.[0] || null);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (!hasHovered) setHasHovered(true);
  };

  return (
    <motion.article
      className="card-premium group relative flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        {/* Image Container with Zoom Effect */}
        <Link
          to={`/products/${product.slug}`}
          className="block relative aspect-product overflow-hidden rounded-xl bg-surface-alt mb-4"
          aria-label={`View ${product.name}`}
        >
          {/* Main Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          {/* Secondary hover image if available (lazy mounted on first hover to save mobile bandwidth) */}
          {product.image2 && hasHovered && (
            <img
              src={product.image2}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          )}

          {/* Badges Container */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <Badge
                variant={
                  product.badge.toLowerCase() === 'new'
                    ? 'new'
                    : product.badge.toLowerCase() === 'bestseller'
                    ? 'bestseller'
                    : 'default'
                }
              >
                {product.badge}
              </Badge>
            )}
            {discount && (
              <Badge variant="sale">−{discount}%</Badge>
            )}
            {product.personalisable && (
              <Badge variant="personalisable">✦ Custom</Badge>
            )}
          </div>

          {/* Wishlist Toggle Button (Accessible 44x44px Touch Target) */}
          <button
            onClick={handleWishlist}
            aria-label={isWished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-bg/80 backdrop-blur-xs border border-border-light flex items-center justify-center text-ivory hover:text-accent hover:border-accent transition-all z-10 min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer"
          >
            <Heart
              size={17}
              className={isWished ? 'fill-accent text-accent' : 'text-ivory'}
            />
          </button>
        </Link>

        {/* Product Details */}
        <div className="space-y-1.5 mb-4">
          {/* Rating */}
          <div className="flex items-center justify-between">
            <Rating value={product.rating || 5} count={product.reviews || 48} size="sm" />
            {product.inStock && (
              <span className="text-[10px] font-sans font-semibold tracking-[0.1em] uppercase text-accent">
                In Stock
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg md:text-xl font-light text-ivory group-hover:text-accent transition-colors line-clamp-1">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Short USP line */}
          <p className="font-sans text-xs text-muted line-clamp-1 font-light">
            {product.tagline || 'Handcrafted luxury gift hamper'}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-sans text-base font-semibold text-ivory">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-xs text-muted-2 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subtle "Add to Bag" Button (Luxury Editorial CRO Interaction) */}
      <button
        onClick={handleAddToCart}
        aria-label={`Add ${product.name} to bag`}
        className={`w-full py-2.5 px-4 rounded-[4px] font-sans text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px] cursor-pointer ${
          added
            ? 'bg-accent-light text-bg'
            : 'bg-accent text-bg hover:bg-accent-light active:scale-[0.98] shadow-xs'
        }`}
      >
        {added ? (
          <>
            <Check size={15} />
            Added to Bag
          </>
        ) : (
          <>
            <ShoppingBag size={14} strokeWidth={1.8} />
            Add to Bag
          </>
        )}
      </button>
    </motion.article>
  );
}
