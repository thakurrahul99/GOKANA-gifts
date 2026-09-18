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
          className="fixed inset-0 z-50 flex flex-col items-center pt-24 px-4"
          style={{ background: 'rgba(11,31,58,0.85)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <motion.div
            className="w-full max-w-2xl overflow-hidden rounded-2xl"
            style={{ background: 'var(--surface)', boxShadow: '0 24px 64px rgba(11,31,58,0.3)' }}
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-4 px-6 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <Search size={20} strokeWidth={1.5} style={{ color: 'var(--muted-2)', flexShrink: 0 }} aria-hidden="true" />
              <label htmlFor="search-input" className="sr-only">Search products</label>
              <input
                ref={inputRef}
                id="search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gifts, occasions, products…"
                className="flex-1 bg-transparent font-sans text-lg focus:outline-none"
                style={{ color: 'var(--text)', caretColor: 'var(--accent)' }}
                autoComplete="off"
              />
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
                style={{
                  color: 'var(--muted-2)',
                  '--tw-ring-color': 'var(--accent)',
                  minWidth: '44px',
                  minHeight: '44px',
                }}
                aria-label="Close search"
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-2)'; }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Results */}
            <div className="px-6 py-4 max-h-80 overflow-y-auto">
              {/* Popular searches (idle state) */}
              {query.length <= 1 && (
                <div>
                  <p className="font-sans text-xs tracking-[0.15em] uppercase mb-4" style={{ color: 'var(--muted-2)' }}>
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Birthday Gifts', 'Diwali Hamper', 'Personalized Gifts', 'Corporate Gifting', 'Chocolate Box'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="px-4 py-2 font-sans text-sm rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
                        style={{
                          border: '1px solid var(--border)',
                          color: 'var(--muted)',
                          '--tw-ring-color': 'var(--accent)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent)';
                          e.currentTarget.style.color = 'var(--primary)';
                          e.currentTarget.style.background = 'var(--accent-soft)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.color = 'var(--muted)';
                          e.currentTarget.style.background = '';
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {query.length > 1 && results.length === 0 && (
                <div className="py-10 text-center">
                  <p className="font-serif text-xl font-light mb-2" style={{ color: 'var(--muted-2)' }}>
                    No results for "{query}"
                  </p>
                  <p className="font-sans text-sm" style={{ color: 'var(--muted-2)' }}>
                    Try searching for a different gift or occasion
                  </p>
                </div>
              )}

              {/* Results list */}
              {results.length > 0 && (
                <div className="space-y-2" role="listbox" aria-label="Search results">
                  <p className="font-sans text-xs tracking-[0.12em] uppercase mb-3" style={{ color: 'var(--muted-2)' }}>
                    {results.length} result{results.length !== 1 ? 's' : ''} found
                  </p>
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 rounded-xl transition-colors duration-200 group focus-visible:outline-none"
                      role="option"
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-alt)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                      onFocus={(e) => { e.currentTarget.style.background = 'var(--surface-alt)'; }}
                      onBlur={(e) => { e.currentTarget.style.background = ''; }}
                    >
                      <div
                        className="w-14 h-14 overflow-hidden flex-shrink-0 rounded-lg"
                        style={{ background: 'var(--surface-alt)' }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base font-light" style={{ color: 'var(--text-strong)' }}>{product.name}</p>
                        <p className="font-sans text-xs truncate" style={{ color: 'var(--muted)' }}>{product.tagline}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-sans text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>
                          {formatPrice(product.price)}
                        </span>
                        <ArrowRight size={14} style={{ color: 'var(--accent)', opacity: 0 }}
                          className="group-hover:opacity-100 transition-opacity duration-200"
                        />
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
