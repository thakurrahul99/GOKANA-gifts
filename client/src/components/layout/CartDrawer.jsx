import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store';
import { formatPrice } from '../ui';
import { products as allProducts } from '../../data';

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQty, removeItem, subtotal } = useCartStore();
  const drawerRef = useRef(null);

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Recommended products (not in cart)
  const cartIds = items.map((i) => i.product.id);
  const recommended = allProducts.filter((p) => !cartIds.includes(p.id)).slice(0, 2);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-ivory flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-charcoal" />
                <h2 className="font-serif text-xl font-light text-charcoal">Your Cart</h2>
                {items.length > 0 && (
                  <span className="text-xs font-sans text-charcoal/50">({items.reduce((a, i) => a + i.qty, 0)} items)</span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-charcoal/50 hover:text-charcoal transition-colors"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
                <div className="w-20 h-20 border border-charcoal/10 flex items-center justify-center">
                  <ShoppingBag size={32} strokeWidth={1} className="text-charcoal/20" />
                </div>
                <div>
                  <p className="font-serif text-2xl font-light text-charcoal mb-2">Your cart is empty</p>
                  <p className="font-sans text-sm text-charcoal/50">Discover thoughtful gifts for everyone you love.</p>
                </div>
                <button onClick={closeCart} className="btn-primary">
                  Explore Gifts
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4"
                      >
                        <div className="w-20 h-24 bg-beige flex-shrink-0 overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-base font-light text-charcoal leading-tight mb-1 truncate">
                            {item.product.name}
                          </h3>
                          {item.variant && (
                            <p className="font-sans text-xs text-charcoal/50 mb-2">{item.variant}</p>
                          )}
                          {item.personalisation?.name && (
                            <p className="font-sans text-xs text-gold mb-2">✦ Personalised for {item.personalisation.name}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            {/* Qty */}
                            <div className="flex items-center gap-2 border border-charcoal/15">
                              <button
                                onClick={() => updateQty(item.key, item.qty - 1)}
                                className="p-1.5 text-charcoal/60 hover:text-charcoal transition-colors"
                                aria-label="Decrease qty"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center font-sans text-sm font-medium">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.key, item.qty + 1)}
                                className="p-1.5 text-charcoal/60 hover:text-charcoal transition-colors"
                                aria-label="Increase qty"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-sans text-sm font-medium text-charcoal">
                                {formatPrice(item.product.price * item.qty)}
                              </span>
                              <button
                                onClick={() => removeItem(item.key)}
                                className="text-charcoal/25 hover:text-red-500 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Recommended */}
                  {recommended.length > 0 && (
                    <div className="pt-4 border-t border-charcoal/10">
                      <p className="font-sans text-xs tracking-[0.12em] uppercase text-charcoal/40 mb-4">Complete your gift with…</p>
                      <div className="space-y-3">
                        {recommended.map((prod) => (
                          <div key={prod.id} className="flex items-center gap-3">
                            <div className="w-14 h-16 bg-beige overflow-hidden flex-shrink-0">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-sm font-light text-charcoal truncate">{prod.name}</p>
                              <p className="font-sans text-xs text-gold">{formatPrice(prod.price)}</p>
                            </div>
                            <button
                              onClick={() => useCartStore.getState().addItem(prod)}
                              className="px-3 py-1.5 border border-charcoal/20 text-charcoal/60 hover:border-gold hover:text-charcoal text-xs font-sans transition-all"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-charcoal/10 bg-white/40">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between font-sans text-sm text-charcoal/60">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-sans text-sm text-charcoal/60">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="font-sans text-xs text-charcoal/40">
                        Free shipping on orders above ₹999
                      </p>
                    )}
                    <div className="flex justify-between font-serif text-lg font-light text-charcoal pt-2 border-t border-charcoal/10">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="btn-primary w-full justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={closeCart}
                    className="w-full mt-3 text-center font-sans text-xs text-charcoal/40 hover:text-charcoal transition-colors"
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
