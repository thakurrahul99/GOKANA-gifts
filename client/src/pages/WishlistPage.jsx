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
      className="group flex gap-5 py-6 border-b border-border last:border-0"
    >
      {/* Image */}
      <Link
        to={`/products/${product.slug}`}
        className="flex-shrink-0 w-24 h-28 bg-bg overflow-hidden border border-border"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg font-light text-primary hover:text-accent transition-colors mb-1 leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="font-sans text-xs text-muted mb-3 line-clamp-1">{product.tagline}</p>

        <div className="flex items-center gap-3 mb-4">
          <span className="font-sans text-base font-semibold text-primary">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="font-sans text-sm text-muted line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {discount && (
            <span className="text-[11px] font-sans font-semibold bg-blush text-primary px-2.5 py-0.5 rounded-full">−{discount}%</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="btn-primary py-2.5 px-4 text-xs font-semibold uppercase tracking-wider"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            Move to Cart
          </button>
          <button
            onClick={() => onRemove(product)}
            className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-error hover:bg-error/10 transition-colors duration-300 border border-border rounded-lg"
            aria-label={`Remove ${product.name} from wishlist`}
          >
            <Trash2 size={16} strokeWidth={1.5} />
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
    <main className="pt-24 min-h-screen bg-bg">
      {/* Midnight Navy Header */}
      <section className="bg-primary py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.18) 0%, transparent 55%)`,
          }}
        />
        <div className="container-gokana relative z-10">
          <ScrollReveal>
            <p className="label-text text-accent mb-3 flex items-center gap-2">
              <Sparkles size={13} />
              Saved Items
            </p>
          </ScrollReveal>
          <div className="flex items-end justify-between">
            <ScrollReveal delay={0.1}>
              <h1 className="heading-xl text-surface">My Wishlist</h1>
            </ScrollReveal>
            {items.length > 0 && (
              <ScrollReveal delay={0.2}>
                <span className="font-sans text-sm text-surface/50 bg-surface/10 px-3 py-1">
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
              <div className="w-20 h-20 border-2 border-border bg-surface flex items-center justify-center mb-7 shadow-sm">
                <Heart size={32} strokeWidth={1} className="text-accent/60" />
              </div>
              <h2 className="font-serif text-2xl font-light text-primary mb-3">Your wishlist is empty</h2>
              <p className="font-sans text-sm text-muted mb-8 leading-relaxed">
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
              <div className="lg:col-span-2 bg-surface border border-border p-6 sm:p-8 shadow-sm">
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
                  <div className="bg-surface border border-border p-7 sticky top-28 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <h3 className="font-serif text-xl font-light text-primary">Collection Summary</h3>
                    </div>
                    <div className="space-y-3 mb-5">
                      {items.map((p) => (
                        <div key={p.id} className="flex justify-between items-baseline gap-2">
                          <span className="font-sans text-sm text-muted truncate max-w-[160px]">{p.name}</span>
                          <span className="font-sans text-sm font-semibold text-primary flex-shrink-0">{formatPrice(p.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-base text-text">Total Value</span>
                        <span className="font-serif text-lg font-medium text-primary">
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
                      className="block text-center mt-4 font-sans text-xs text-muted hover:text-primary transition-colors py-2"
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
