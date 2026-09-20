import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { formatPrice, Rating, Badge } from '../ui';
import { useCartStore, useWishlistStore } from '../../store';

export function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
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

  return (
    <motion.article
      className="card-premium group relative flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
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
          />

          {/* Secondary hover image if available */}
          {product.image2 && (
            <img
              src={product.image2}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
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
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-primary hover:text-accent hover:bg-white shadow-xs transition-all z-10 min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Heart
              size={18}
              className={isWished ? 'fill-accent text-accent' : 'text-primary'}
            />
          </button>
        </Link>

        {/* Product Details */}
        <div className="space-y-1.5 mb-4">
          {/* Rating */}
          <div className="flex items-center justify-between">
            <Rating value={product.rating || 5} count={product.reviews || 48} size="sm" />
            {product.inStock && (
              <span className="text-[11px] font-sans font-medium text-accent-dark">
                In Stock
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg md:text-xl font-light text-primary group-hover:text-accent transition-colors line-clamp-1">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Short USP line */}
          <p className="font-sans text-xs text-muted line-clamp-1">
            {product.tagline || 'Artisan handcrafted luxury curation'}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-sans text-base font-semibold text-primary">
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

      {/* Visible "Add to Cart" Button (CRO Requirement) */}
      <button
        onClick={handleAddToCart}
        aria-label={`Add ${product.name} to cart`}
        className={`w-full py-2.5 px-4 rounded-lg font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px] ${
          added
            ? 'bg-accent text-text'
            : 'bg-accent text-text hover:bg-accent-dark active:scale-[0.98]'
        }`}
      >
        {added ? (
          <>
            <Check size={16} />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag size={15} />
            Add to Cart
          </>
        )}
      </button>
    </motion.article>
  );
}
