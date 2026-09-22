import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlistStore, useCartStore } from '../store';
import { formatPrice } from '../components/ui';
import { ScrollReveal, StaggerReveal, staggerItem } from '../components/ui/ScrollReveal';

function WishlistItem({ product, onRemove, onAddToCart }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      variants={staggerItem}
      layout
      exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
      className="group flex gap-3.5 sm:gap-5 py-4 sm:py-6 border-b border-border last:border-0"
    >
      {/* Image */}
      <Link
        to={`/products/${product.slug}`}
        className="flex-shrink-0 w-20 h-24 sm:w-24 sm:h-28 bg-surface-alt overflow-hidden rounded-lg border border-border shadow-xs"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-serif text-base sm:text-lg font-light text-ivory hover:text-accent transition-colors mb-1 leading-tight line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="font-sans text-xs text-muted mb-2 sm:mb-3 line-clamp-1 font-light">{product.tagline}</p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <span className="font-sans text-sm sm:text-base font-semibold text-accent">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="font-sans text-xs sm:text-sm text-muted/60 line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {discount && (
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold bg-accent/15 text-accent border border-accent/30 px-2 py-0.5 rounded-full">−{discount}%</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="btn-primary py-2 px-3 sm:py-2.5 sm:px-4 text-[11px] sm:text-xs font-semibold uppercase tracking-wider"
          >
            <ShoppingBag size={13} strokeWidth={2} />
            Move to Cart
          </button>
          <button
            onClick={() => onRemove(product)}
            className="p-2.5 sm:p-3 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors duration-300 border border-border rounded-lg"
            aria-label={`Remove ${product.name} from wishlist`}
          >
            <Trash2 size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product) => {
    addItem(product, product.variants?.[0] || null);
  };

  return (
    <main className="pt-24 min-h-screen bg-bg text-ivory">
      {/* Luxury Dark Espresso Header */}
      <section className="bg-bg-banner border-b border-border py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse at 70% 30%, rgba(197,160,89,0.18) 0%, transparent 55%)`,
          }}
        />
        <div className="container-gokana relative z-10">
          <ScrollReveal>
            <p className="label-text text-accent mb-3 flex items-center gap-2 tracking-[0.22em]">
              <Sparkles size={13} />
              SAVED ITEMS
            </p>
          </ScrollReveal>
          <div className="flex items-end justify-between">
            <ScrollReveal delay={0.1}>
              <h1 className="heading-xl text-ivory font-serif">My Wishlist</h1>
            </ScrollReveal>
            {items.length > 0 && (
              <ScrollReveal delay={0.2}>
                <span className="font-sans text-xs font-semibold text-accent bg-accent/15 border border-accent/30 px-3 py-1 uppercase tracking-wider rounded-full">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      <div className="container-gokana py-12">
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            /* Improved empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto"
            >
              <div className="w-20 h-20 border border-border bg-bg-alt rounded-full flex items-center justify-center mb-7 shadow-lg">
                <Heart size={32} strokeWidth={1} className="text-accent" />
              </div>
              <h2 className="font-serif text-2xl font-light text-ivory mb-3">Your wishlist is empty</h2>
              <p className="font-sans text-sm text-muted mb-8 leading-relaxed font-light">
                Tap the heart icon on any product to save it here. Come back any time to pick up where you left off.
              </p>
              <Link to="/shop" className="btn-primary">
                Explore Curated Gifts
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14"
            >
              {/* Wishlist items */}
              <div className="lg:col-span-2 bg-bg-alt border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
                <AnimatePresence>
                  <StaggerReveal stagger={0.07}>
                    {items.map((product) => (
                      <WishlistItem
                        key={product.id}
                        product={product}
                        onRemove={toggle}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </StaggerReveal>
                </AnimatePresence>
              </div>

              {/* Summary sidebar */}
              <div className="lg:col-span-1">
                <ScrollReveal delay={0.2}>
                  <div className="bg-bg-alt border border-border rounded-2xl p-7 sticky top-28 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                      <h3 className="font-serif text-xl font-light text-ivory">Collection Summary</h3>
                    </div>
                    <div className="space-y-3 mb-5">
                      {items.map((p) => (
                        <div key={p.id} className="flex justify-between items-baseline gap-2">
                          <span className="font-sans text-sm text-muted truncate max-w-[160px]">{p.name}</span>
                          <span className="font-sans text-sm font-semibold text-accent flex-shrink-0">{formatPrice(p.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-base text-ivory">Total Value</span>
                        <span className="font-serif text-xl font-medium text-accent">
                          {formatPrice(items.reduce((s, p) => s + p.price, 0))}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => items.forEach((p) => handleAddToCart(p))}
                      className="btn-primary w-full justify-center min-h-[44px]"
                    >
                      <ShoppingBag size={16} />
                      Add All to Cart
                    </button>
                    <Link
                      to="/shop"
                      className="block text-center mt-4 font-sans text-xs text-muted hover:text-accent transition-colors py-2"
                    >
                      Continue Shopping →
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
