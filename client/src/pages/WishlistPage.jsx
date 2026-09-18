import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
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
      className="group flex gap-5 py-6 border-b border-charcoal/[0.07] last:border-0"
    >
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="flex-shrink-0 w-24 h-28 bg-beige overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg font-light text-charcoal hover:text-gold transition-colors mb-1 leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="font-sans text-xs text-charcoal/50 mb-3 line-clamp-1">{product.tagline}</p>

        <div className="flex items-center gap-3 mb-4">
          <span className="font-sans text-base font-medium text-charcoal">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="font-sans text-sm text-charcoal/35 line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {discount && (
            <span className="text-[10px] font-sans font-semibold bg-red-50 text-red-700 px-2 py-0.5">−{discount}%</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal text-ivory font-sans text-xs font-medium tracking-[0.08em] uppercase hover:bg-accent transition-colors duration-300"
          >
            <ShoppingBag size={13} strokeWidth={1.5} />
            Add to Cart
          </button>
          <button
            onClick={() => onRemove(product)}
            className="p-2 text-charcoal/30 hover:text-red-500 transition-colors duration-300"
            aria-label="Remove from wishlist"
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
    <main className="pt-24 min-h-screen bg-ivory">
      {/* Header */}
      <div className="bg-charcoal py-14">
        <div className="container-gokana">
          <ScrollReveal>
            <p className="label-text text-gold/70 mb-3">✦ Saved Items</p>
          </ScrollReveal>
          <div className="flex items-end justify-between">
            <ScrollReveal delay={0.1}>
              <h1 className="heading-xl text-ivory">
                My Wishlist
              </h1>
            </ScrollReveal>
            {items.length > 0 && (
              <ScrollReveal delay={0.2}>
                <span className="font-sans text-sm text-ivory/40">{items.length} item{items.length !== 1 ? 's' : ''}</span>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>

      <div className="container-gokana py-12">
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 border border-charcoal/15 flex items-center justify-center mb-7">
                <Heart size={32} strokeWidth={1} className="text-charcoal/20" />
              </div>
              <h2 className="font-serif text-2xl font-light text-charcoal mb-3">Your wishlist is empty</h2>
              <p className="font-sans text-sm text-charcoal/50 mb-8 max-w-xs">
                Save products you love and come back to them anytime.
              </p>
              <Link to="/shop" className="btn-primary">
                Explore Collection
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Wishlist items */}
              <div className="lg:col-span-2">
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

              {/* Summary */}
              <div className="lg:col-span-1">
                <ScrollReveal delay={0.2}>
                  <div className="bg-beige p-7 sticky top-28">
                    <h3 className="font-serif text-xl font-light text-charcoal mb-6">Summary</h3>
                    <div className="space-y-3 mb-6">
                      {items.map((p) => (
                        <div key={p.id} className="flex justify-between">
                          <span className="font-sans text-sm text-charcoal/60 truncate max-w-[160px]">{p.name}</span>
                          <span className="font-sans text-sm font-medium text-charcoal flex-shrink-0 ml-2">{formatPrice(p.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-charcoal/10 pt-4 mb-6">
                      <div className="flex justify-between">
                        <span className="font-serif text-base text-charcoal">Total Value</span>
                        <span className="font-serif text-base font-medium text-charcoal">
                          {formatPrice(items.reduce((s, p) => s + p.price, 0))}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => items.forEach((p) => handleAddToCart(p))}
                      className="btn-primary w-full justify-center"
                    >
                      <ShoppingBag size={16} />
                      Add All to Cart
                    </button>
                    <Link to="/shop" className="block text-center mt-4 font-sans text-xs text-charcoal/40 hover:text-charcoal transition-colors">
                      Continue Shopping
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
