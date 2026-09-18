import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, ArrowRight, Star } from 'lucide-react';
import clsx from 'clsx';
import { formatPrice, Rating, Badge } from '../ui';
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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAddingToCart(true);
    addItem(product, product.variants?.[0] || null);
    setTimeout(() => setAddingToCart(false), 1200);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
  };

  return (
    <motion.div
      className="product-card group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-product overflow-hidden bg-beige-100">
        {/* Primary image */}
        <img
          src={product.image}
          alt={product.name}
          className={clsx(
            'product-img-hover w-full h-full object-cover',
            hovered ? 'opacity-0' : 'opacity-100'
          )}
          style={{ transition: 'opacity 0.6s ease-out' }}
          loading="lazy"
        />
        {/* Secondary hover image */}
        <img
          src={product.image2 || product.image}
          alt={`${product.name} alternate view`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <Badge variant={product.badge === 'New' ? 'new' : product.badge === 'Bestseller' ? 'gold' : 'default'}>
              {product.badge}
            </Badge>
          )}
          {discount && <Badge variant="sale">−{discount}%</Badge>}
          {product.personalisable && (
            <Badge variant="champagne">Personalisable</Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 bg-ivory/90 flex items-center justify-center transition-all duration-300 hover:bg-ivory"
        >
          <motion.div whileScale={isWished ? 1.3 : 1} transition={{ type: 'spring', stiffness: 300 }}>
            <Heart
              size={16}
              strokeWidth={1.5}
              className={clsx(
                'transition-colors duration-300',
                isWished ? 'fill-gold text-gold' : 'text-charcoal/60 hover:text-gold'
              )}
            />
          </motion.div>
        </button>

        {/* Quick actions on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 flex"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={handleAddToCart}
                className={clsx(
                  'flex-1 py-3 font-sans text-xs font-medium tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-colors duration-300',
                  addingToCart
                    ? 'bg-gold text-ivory'
                    : 'bg-charcoal text-ivory hover:bg-accent'
                )}
              >
                {addingToCart ? (
                  <>
                    <span>✓</span> Added to Cart
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
                className="w-12 flex items-center justify-center bg-ivory text-charcoal hover:bg-champagne transition-colors border-l border-charcoal/10"
                aria-label="Quick view"
              >
                <Eye size={16} strokeWidth={1.5} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Product info */}
      <div className="pt-4 pb-2">
        <Link to={`/products/${product.slug}`} className="block group/name">
          <h3 className="font-serif text-lg font-light text-charcoal leading-tight mb-1 group-hover/name:text-accent transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        <p className="font-sans text-xs text-charcoal/50 mb-3 leading-relaxed line-clamp-1">{product.tagline}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-sans text-base font-medium text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-sm text-charcoal/35 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Rating value={product.rating} count={product.reviews} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}
