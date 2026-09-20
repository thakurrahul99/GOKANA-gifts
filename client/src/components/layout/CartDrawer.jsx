import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Truck,
} from "lucide-react";
import { useCartStore } from "../../store";
import { formatPrice } from "../ui";
import { products as allProducts } from "../../data";

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQty, removeItem, subtotal } =
    useCartStore();
  const drawerRef = useRef(null);

  const FREE_SHIPPING_THRESHOLD = 999;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const total = subtotal + shipping;
  const progressToFree = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );
  const diffToFree = FREE_SHIPPING_THRESHOLD - subtotal;

  const cartIds = items.map((i) => i.product.id);
  const recommended = allProducts
    .filter((p) => !cartIds.includes(p.id))
    .slice(0, 2);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div role="dialog" aria-modal="true" aria-label="Shopping Cart">
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
          />

          <motion.div
            ref={drawerRef}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-bg flex flex-col shadow-2xl border-l border-border"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-surface">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1.8} className="text-primary" />
                <h2 className="font-serif text-2xl font-light text-primary">Your Cart</h2>
                {items.length > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-soft text-primary">
                    {items.reduce((a, i) => a + i.qty, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart drawer"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-primary rounded-lg transition-colors"
              >
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>

            <div className="bg-surface-alt px-6 py-3.5 border-b border-border">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-medium text-primary">
                <Truck size={15} className="text-accent" />
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-accent-dark font-semibold">🎉 You unlocked FREE express delivery!</span>
                ) : (
                  <span>
                    Add <b>{formatPrice(diffToFree)}</b> more to unlock <b>FREE shipping</b>
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFree}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4" aria-live="polite">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center text-primary mb-4">
                    <ShoppingBag size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl font-light text-primary mb-2">Your cart is empty</h3>
                  <p className="font-sans text-sm text-muted max-w-xs mb-8">
                    Discover handcrafted gift boxes, artisanal chocolates, and luxury hampers.
                  </p>
                  <Link to="/shop" onClick={closeCart} className="btn-accent">
                    Explore Curated Gifts
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(({ product, variant, qty }) => {
                    const itemSubtotal = Number(product.price || 0) * qty;

                    return (
                      <div
                        key={`${product.id}-${variant || "standard"}`}
                        className="flex gap-4 p-4 rounded-xl bg-white border border-border shadow-xs"
                      >
                        <Link
                          to={`/products/${product.slug}`}
                          onClick={closeCart}
                          className="w-20 h-24 rounded-lg overflow-hidden bg-surface-alt flex-shrink-0"
                        >
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </Link>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                to={`/products/${product.slug}`}
                                onClick={closeCart}
                                className="font-serif text-base font-light text-primary hover:text-accent leading-tight"
                              >
                                {product.name}
                              </Link>
                              <button
                                onClick={() => removeItem(product.id, variant)}
                                aria-label={`Remove ${product.name} from cart`}
                                className="text-muted-2 hover:text-error p-1 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            {variant && (
                              <p className="font-sans text-xs text-muted mt-0.5">Variant: {variant}</p>
                            )}
                            <p className="font-sans text-xs text-muted mt-1">
                              {formatPrice(product.price)} × {qty}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                            <div className="flex items-center border border-border rounded-lg bg-surface-alt">
                              <button
                                onClick={() => updateQty(product.id, variant, Math.max(1, qty - 1))}
                                aria-label={`Decrease quantity of ${product.name}`}
                                className="min-w-[32px] min-h-[32px] flex items-center justify-center text-primary hover:bg-border rounded-l-lg transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center font-sans text-xs font-semibold text-primary">{qty}</span>
                              <button
                                onClick={() => updateQty(product.id, variant, qty + 1)}
                                aria-label={`Increase quantity of ${product.name}`}
                                className="min-w-[32px] min-h-[32px] flex items-center justify-center text-primary hover:bg-border rounded-r-lg transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <div className="text-right">
                              <span className="block text-[10px] uppercase tracking-wider text-muted">Item Subtotal</span>
                              <span className="font-sans text-sm font-semibold text-primary">
                                {formatPrice(itemSubtotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-border space-y-3">
                <div className="flex justify-between text-xs text-muted">
                  <span>Subtotal</span>
                  <span className="text-primary font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>Estimated Shipping</span>
                  <span className="text-primary font-medium">
                    {shipping === 0 ? <span className="text-accent-dark">FREE</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-primary pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-accent w-full flex items-center justify-center gap-2 mt-4"
                >
                  Proceed to Secure Checkout
                  <ArrowRight size={16} />
                </Link>

                <p className="text-center text-[11px] text-muted-2">
                  ✦ 100% Satisfaction Guarantee • Handcrafted Keepsake Packaging
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
