import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../../data";
import { formatPrice } from "../ui";

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const results =
    query.trim().length > 1
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.tagline.toLowerCase().includes(query.toLowerCase()) ||
            (p.categories &&
              p.categories.some((c) =>
                c.toLowerCase().includes(query.toLowerCase()),
              )),
        )
      : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div role="dialog" aria-modal="true" aria-label="Search Catalog">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-[var(--primary)]/70 backdrop-blur-sm flex flex-col items-center pt-20 md:pt-28 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              className="w-full max-w-2xl bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden"
              initial={{ y: -20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border)]">
                <Search
                  size={20}
                  strokeWidth={1.8}
                  className="text-[var(--accent)] flex-shrink-0"
                />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by occasion, hamper, or chocolate..."
                  className="flex-1 bg-transparent text-[var(--text)] placeholder-[var(--muted-2)] font-sans text-base focus:outline-none min-h-[44px]"
                  aria-label="Search gifts"
                />
                <button
                  onClick={onClose}
                  aria-label="Close search"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="max-h-[60vh] overflow-y-auto p-6 bg-[var(--surface-alt)]">
                {query.trim().length > 1 ? (
                  results.length > 0 ? (
                    <div className="space-y-3">
                      <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
                        {results.length} gifts found
                      </p>
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-3 rounded-xl bg-white border border-[#E8DFD3] hover:border-[#D4AF37] hover:shadow-xs transition-all group"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-base font-light text-[#0B1F3A] group-hover:text-[#D4AF37] transition-colors truncate">
                              {product.name}
                            </h4>
                            <p className="font-sans text-xs text-[#6B6B6B] truncate">
                              {product.tagline}
                            </p>
                          </div>
                          <span className="font-sans text-sm font-semibold text-[#0B1F3A]">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="font-serif text-xl font-light text-[#0B1F3A] mb-1">
                        No gifts found for "{query}"
                      </p>
                      <p className="font-sans text-xs text-[#6B6B6B]">
                        Try searching for "Birthday", "Chocolates", or
                        "Anniversary"
                      </p>
                    </div>
                  )
                ) : (
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0B1F3A] mb-3">
                      Popular Occasions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Birthday",
                        "Anniversary",
                        "Wedding",
                        "Diwali",
                        "Thank You",
                        "Chocolates",
                      ].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-[#E8DFD3] text-[#0B1F3A] hover:border-[#D4AF37] hover:bg-[#F5E9C8] transition-all min-h-[36px]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
