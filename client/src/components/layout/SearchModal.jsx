import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data';
import { formatPrice } from '../ui';

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const results = query.length > 1
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm flex flex-col items-center pt-24 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="w-full max-w-2xl bg-ivory shadow-premium-lg"
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Search input */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-charcoal/10">
              <Search size={20} strokeWidth={1.5} className="text-charcoal/40 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for gifts, occasions, products…"
                className="flex-1 bg-transparent font-sans text-lg text-charcoal placeholder-charcoal/30 focus:outline-none"
              />
              <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Results */}
            <div className="px-6 py-4 max-h-80 overflow-y-auto">
              {query.length <= 1 && (
                <div>
                  <p className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal/40 mb-4">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Birthday Gifts', 'Diwali Hamper', 'Personalized Gifts', 'Corporate Gifting', 'Chocolate Box'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="px-4 py-2 border border-charcoal/15 font-sans text-sm text-charcoal/60 hover:border-gold hover:text-charcoal transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.length > 1 && results.length === 0 && (
                <p className="font-serif text-lg font-light text-charcoal/40 py-6 text-center">
                  No results found for "{query}"
                </p>
              )}

              {results.length > 0 && (
                <div className="space-y-3">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-2 hover:bg-champagne/20 transition-colors group"
                    >
                      <div className="w-14 h-14 bg-beige overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-base font-light text-charcoal">{product.name}</p>
                        <p className="font-sans text-xs text-charcoal/50">{product.tagline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm font-medium text-charcoal">{formatPrice(product.price)}</span>
                        <ArrowRight size={14} className="text-charcoal/30 group-hover:text-gold transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
