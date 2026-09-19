import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Sparkles, Filter } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { products, occasions } from '../data';

const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rated', value: 'rating' },
];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeOccasion, setActiveOccasion] = useState(searchParams.get('occasion') || 'all');
  const [sortBy, setSortBy] = useState('recommended');

  const filtered = products
    .filter((p) => activeOccasion === 'all' || p.categories.includes(activeOccasion))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  useEffect(() => {
    setActiveOccasion(searchParams.get('occasion') || 'all');
  }, [searchParams]);

  const handleOccasion = (id) => {
    setActiveOccasion(id);
    if (id === 'all') searchParams.delete('occasion');
    else searchParams.set('occasion', id);
    setSearchParams(searchParams);
  };

  return (
    <main className="pt-24 min-h-screen bg-[var(--bg)]">
      {/* Page Header — Midnight Navy 30% primary */}
      <section className="bg-[var(--primary)] text-[var(--surface)] py-16 sm:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.15) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(243,217,212,0.1) 0%, transparent 45%)`,
          }}
        />
        <div className="container-gokana text-center relative z-10 max-w-2xl mx-auto">
          <p className="label-text text-[var(--accent)] mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} />
            The Complete Atelier
          </p>
          <h1 className="heading-xl text-[var(--surface)]">All Curated Gifts</h1>
          <p className="body-text text-[var(--surface)]/70 mt-4 leading-relaxed">
            Thoughtfully selected and handcrafted gifts for every milestone, celebration, and heartfelt occasion.
          </p>
        </div>
      </section>

      <div className="container-gokana py-10 sm:py-14">
        {/* Filters and Sort Bar */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-4 sm:p-5 mb-8 sm:mb-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Occasion filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider flex items-center gap-1 mr-1 flex-shrink-0">
              <Filter size={13} className="text-[var(--accent)]" />
              Occasion:
            </span>
            {[{ id: 'all', label: 'All Gifts' }, ...occasions].map((occ) => {
              const active = activeOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => handleOccasion(occ.id)}
                  className={`flex-none px-4 py-2 text-xs font-medium tracking-[0.05em] uppercase transition-all duration-200 whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                    active
                      ? 'bg-[var(--primary)] text-[var(--surface)] font-semibold shadow-sm'
                      : 'bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--primary)]'
                  }`}
                  aria-pressed={active}
                >
                  {occ.label}
                </button>
              );
            })}
          </div>

          {/* Sort & Count */}
          <div className="flex items-center justify-between md:justify-end gap-4 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
            <span className="font-sans text-xs text-[var(--text-muted)] font-medium">
              Showing <strong className="text-[var(--text)]">{filtered.length}</strong> {filtered.length === 1 ? 'gift' : 'gifts'}
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor="shop-sort" className="sr-only">Sort gifts</label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-sans text-xs sm:text-sm text-[var(--text)] border border-[var(--border)] px-3 py-2.5 bg-[var(--surface)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 min-h-[44px] cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid or Friendly Empty State */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-[var(--surface)] border border-[var(--border)] p-10 max-w-lg mx-auto"
            >
              <p className="font-serif text-2xl font-light text-[var(--primary)] mb-3">No gifts match this filter</p>
              <p className="font-sans text-sm text-[var(--text-muted)] mb-6">
                Try selecting another occasion or clear all active filters to view the entire catalogue.
              </p>
              <button
                onClick={() => handleOccasion('all')}
                className="btn-primary"
              >
                Show All Gifts
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeOccasion + sortBy}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
