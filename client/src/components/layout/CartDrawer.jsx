import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Truck } from "lucide-react";
import { useCartStore } from "../../store";
import { formatPrice } from "../ui";
import { products as allProducts } from "../../data";

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQty, removeItem } = useCartStore();
  const drawerRef = useRef(null);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const FREE_SHIPPING_THRESHOLD = 999;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const total = subtotal + shipping;
  const progressToFree = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const diffToFree = FREE_SHIPPING_THRESHOLD - subtotal;

  const cartIds = items.map((i) => i.product.id);
  const recommended = allProducts.filter((p) => !cartIds.includes(p.id)).slice(0, 2);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape" && isOpen) closeCart(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div role="dialog" aria-modal="true" aria-label="Shopping Cart">
          <motion.div className="drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={closeCart} />
          <motion.div ref={drawerRef} data-lenis-prevent className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-bg text-ivory flex flex-col shadow-2xl border-l border-border" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-bg-alt">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <ShoppingBag size={20} strokeWidth={1.8} className="text-accent" />
                <h2 className="font-serif text-xl sm:text-2xl font-light text-ivory">Your Cart</h2>
                {items.length > 0 && <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">{items.reduce((a, i) => a + i.qty, 0)}</span>}
              </div>
              <button onClick={closeCart} aria-label="Close cart drawer" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-accent rounded-lg transition-colors"><X size={22} strokeWidth={1.8} /></button>
            </div>

            {/* Shipping Progress */}
            <div className="bg-primary-2 px-4 sm:px-6 py-3 sm:py-3.5 border-b border-border">
              <div className="flex items-center gap-2 mb-2 text-xs font-medium text-ivory">
                <Truck size={15} className="text-accent flex-shrink-0" />
                {subtotal >= FREE_SHIPPING_THRESHOLD ? <span className="text-accent font-semibold">🎉 You unlocked FREE express delivery!</span> : <span>Add <b className="text-accent">{formatPrice(diffToFree)}</b> more to unlock <b className="text-ivory">FREE shipping</b></span>}
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-accent via-accent-light to-accent rounded-full" initial={{ width: 0 }} animate={{ width: `${progressToFree}%` }} transition={{ duration: 0.4 }} /></div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4" aria-live="polite">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-4"><ShoppingBag size={28} strokeWidth={1.5} /></div>
                  <h3 className="font-serif text-2xl font-light text-ivory mb-2">Your cart is empty</h3>
                  <p className="font-sans text-sm text-muted max-w-xs mb-8">Discover handcrafted gift boxes, artisanal chocolates, and luxury hampers.</p>
                  <Link to="/shop" onClick={closeCart} className="btn-primary">Explore Curated Gifts <ArrowRight size={16} /></Link>
                </div>
              ) : (
                <div className="space-y-3.5 sm:space-y-4">
                  {items.map(({ key, product, variant, qty }) => (
                    <div key={key} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-bg-alt border border-border shadow-sm">
                      <Link to={`/products/${product.slug}`} onClick={closeCart} className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-surface-alt border border-border flex-shrink-0"><img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" /></Link>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link to={`/products/${product.slug}`} onClick={closeCart} className="font-serif text-sm sm:text-base font-light text-ivory hover:text-accent leading-tight line-clamp-2">{product.name}</Link>
                            <button onClick={() => removeItem(key)} aria-label={`Remove ${product.name} from cart`} className="text-muted hover:text-red-400 min-w-[36px] min-h-[36px] flex items-center justify-center -mr-1.5 -mt-1.5 transition-colors flex-shrink-0"><Trash2 size={15} /></button>
                          </div>
                          {variant && <p className="font-sans text-xs text-muted mt-0.5 truncate">Variant: {variant}</p>}
                        </div>
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border">
                          <div className="flex items-center border border-border rounded-lg bg-surface-alt">
                            <button onClick={() => updateQty(key, qty - 1)} aria-label={`Decrease quantity of ${product.name}`} className="min-w-[32px] sm:min-w-[36px] min-h-[32px] sm:min-h-[36px] flex items-center justify-center text-ivory hover:text-accent hover:bg-white/5 rounded-l-lg transition-colors"><Minus size={11} /></button>
                            <span className="w-7 sm:w-8 text-center font-sans text-xs font-semibold text-ivory">{qty}</span>
                            <button onClick={() => updateQty(key, qty + 1)} aria-label={`Increase quantity of ${product.name}`} className="min-w-[32px] sm:min-w-[36px] min-h-[32px] sm:min-h-[36px] flex items-center justify-center text-ivory hover:text-accent hover:bg-white/5 rounded-r-lg transition-colors"><Plus size={11} /></button>
                          </div>
                          <div className="text-right"><span className="block text-[9px] sm:text-[10px] uppercase tracking-wider text-muted">Item Subtotal</span><span className="font-sans text-xs sm:text-sm font-semibold text-accent">{formatPrice(product.price * qty)}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 bg-bg-alt border-t border-border space-y-2.5 sm:space-y-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <div className="flex justify-between text-xs text-muted"><span>Subtotal</span><span className="text-ivory font-medium">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-xs text-muted"><span>Estimated Shipping</span><span className="text-ivory font-medium">{shipping === 0 ? <span className="text-accent font-semibold">FREE</span> : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-base font-semibold text-ivory pt-2 border-t border-border"><span>Total</span><span className="font-serif text-lg text-accent">{formatPrice(total)}</span></div>
                <Link to="/checkout" onClick={closeCart} className="btn-primary w-full flex items-center justify-center gap-2 mt-3 sm:mt-4 font-semibold uppercase tracking-[0.12em] min-h-[48px]">Proceed to Secure Checkout <ArrowRight size={16} /></Link>
                <p className="text-center text-[10px] sm:text-[11px] text-muted opacity-80 pt-1">✦ 100% Satisfaction Guarantee • Handcrafted Keepsake Packaging</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
