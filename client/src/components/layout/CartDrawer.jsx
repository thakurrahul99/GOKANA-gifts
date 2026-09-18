import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Gift } from 'lucide-react';
import { useCartStore } from '../../store';
import { formatPrice } from '../ui';
import { products as allProducts } from '../../data';

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQty, removeItem, subtotal } = useCartStore();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const cartIds = items.map((i) => i.product.id);
  const recommended = allProducts.filter((p) => !cartIds.includes(p.id)).slice(0, 2);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && isOpen) closeCart(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: 'var(--surface)', boxShadow: '0 0 48px rgba(11,31,58,0.15)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} style={{ color: 'var(--primary)' }} />
                <h2 className="font-serif text-xl font-light" style={{ color: 'var(--text-strong)' }}>
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span
                    className="font-sans text-xs"
                    style={{ color: 'var(--muted)' }}
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    ({items.reduce((a, i) => a + i.qty, 0)} {items.reduce((a, i) => a + i.qty, 0) === 1 ? 'item' : 'items'})
                  </span>
                )}
              </div>
              <button
                ref={closeButtonRef}
                onClick={closeCart}
                className="rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 flex items-center justify-center"
                style={{
                  color: 'var(--muted)',
                  minWidth: '44px',
                  minHeight: '44px',
                  '--tw-ring-color': 'var(--accent)',
                }}
                aria-label="Close cart"
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--primary-soft)' }}
                >
                  <ShoppingBag size={36} strokeWidth={1} style={{ color: 'var(--primary)', opacity: 0.4 }} />
                </div>
                <div>
                  <p className="font-serif text-2xl font-light mb-2" style={{ color: 'var(--text-strong)' }}>
                    Your cart is empty
                  </p>
                  <p className="font-sans text-sm" style={{ color: 'var(--muted)' }}>
                    Discover thoughtful gifts for everyone you love.
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button onClick={closeCart} className="btn-primary justify-center">
                    Explore Gifts
                    <ArrowRight size={16} />
                  </button>
                  <Link
                    to="/gift-finder"
                    onClick={closeCart}
                    className="btn-accent justify-center text-center flex items-center gap-2"
                  >
                    <Gift size={16} />
                    Find the Perfect Gift
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 py-3"
                        style={{ borderBottom: '1px solid var(--border-soft)' }}
                      >
                        <div
                          className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-lg"
                          style={{ background: 'var(--surface-alt)' }}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-base font-light leading-tight mb-1 truncate" style={{ color: 'var(--text-strong)' }}>
                            {item.product.name}
                          </h3>
                          {item.variant && (
                            <p className="font-sans text-xs mb-1" style={{ color: 'var(--muted)' }}>{item.variant}</p>
                          )}
                          {item.personalisation?.name && (
                            <p className="font-sans text-xs mb-2" style={{ color: 'var(--accent)' }}>
                              ✦ Personalised for {item.personalisation.name}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            {/* Qty controls */}
                            <div
                              className="flex items-center overflow-hidden rounded-lg"
                              style={{ border: '1px solid var(--border)' }}
                            >
                              <button
                                onClick={() => updateQty(item.key, item.qty - 1)}
                                className="px-2.5 py-1.5 transition-colors duration-200 focus-visible:outline-none"
                                style={{ color: 'var(--muted)', minWidth: '32px', minHeight: '32px' }}
                                aria-label={`Decrease quantity of ${item.product.name}`}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-alt)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-7 text-center font-sans text-sm font-medium" style={{ color: 'var(--text)' }}>
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.key, item.qty + 1)}
                                className="px-2.5 py-1.5 transition-colors duration-200 focus-visible:outline-none"
                                style={{ color: 'var(--muted)', minWidth: '32px', minHeight: '32px' }}
                                aria-label={`Increase quantity of ${item.product.name}`}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-alt)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-sans text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>
                                {formatPrice(item.product.price * item.qty)}
                              </span>
                              <button
                                onClick={() => removeItem(item.key)}
                                className="transition-colors duration-200 focus-visible:outline-none rounded p-1"
                                style={{ color: 'var(--muted-2)', minWidth: '28px', minHeight: '28px' }}
                                aria-label={`Remove ${item.product.name} from cart`}
                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-2)'; }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Recommendations */}
                  {recommended.length > 0 && (
                    <div className="pt-4">
                      <p className="font-sans text-xs tracking-[0.12em] uppercase mb-4" style={{ color: 'var(--muted-2)' }}>
                        Complete your gift with…
                      </p>
                      <div className="space-y-3">
                        {recommended.map((prod) => (
                          <div key={prod.id} className="flex items-center gap-3">
                            <div className="w-14 h-16 overflow-hidden flex-shrink-0 rounded-lg" style={{ background: 'var(--surface-alt)' }}>
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-sm font-light truncate" style={{ color: 'var(--text-strong)' }}>{prod.name}</p>
                              <p className="font-sans text-xs" style={{ color: 'var(--accent)' }}>{formatPrice(prod.price)}</p>
                            </div>
                            <button
                              onClick={() => useCartStore.getState().addItem(prod)}
                              className="px-3 py-1.5 font-sans text-xs font-medium rounded-lg transition-all duration-200 focus-visible:outline-none"
                              style={{
                                border: '1px solid var(--border)',
                                color: 'var(--primary)',
                                background: 'transparent',
                                minHeight: '36px',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--accent)';
                                e.currentTarget.style.borderColor = 'var(--accent)';
                                e.currentTarget.style.color = '#121212';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.color = 'var(--primary)';
                              }}
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="px-6 py-5"
                  style={{
                    borderTop: '1px solid var(--border)',
                    background: 'var(--surface-alt)',
                  }}
                >
                  {/* Free shipping progress */}
                  {shipping > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between font-sans text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
                        <span>Add {formatPrice(999 - subtotal)} more for free shipping</span>
                        <span style={{ color: 'var(--success)' }}>Free at ₹999</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min((subtotal / 999) * 100, 100)}%`,
                            background: 'var(--accent)',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between font-sans text-sm" style={{ color: 'var(--muted)' }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-sans text-sm" style={{ color: 'var(--muted)' }}>
                      <span>Shipping</span>
                      <span style={{ color: shipping === 0 ? 'var(--success)' : 'var(--text)' }}>
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </span>
                    </div>
                    <div
                      className="flex justify-between font-serif text-xl font-light pt-3"
                      style={{ borderTop: '1px solid var(--border)', color: 'var(--text-strong)' }}
                    >
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="btn-accent w-full justify-center flex"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={closeCart}
                    className="w-full mt-3 text-center font-sans text-xs transition-colors duration-200 py-2 focus-visible:outline-none rounded"
                    style={{ color: 'var(--muted-2)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-2)'; }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
