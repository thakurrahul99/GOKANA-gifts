import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
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
  const [filterOpen, setFilterOpen] = useState(false);

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
    <main className="pt-28 min-h-screen bg-ivory">
      {/* Page header */}
      <div className="bg-charcoal py-16">
        <div className="container-gokana text-center">
          <p className="label-text text-gold/70 mb-4">✦ Our Collection</p>
          <h1 className="heading-xl text-ivory">All Gifts</h1>
          <p className="body-text text-ivory/50 mt-4 max-w-lg mx-auto">
            Thoughtfully curated gifts for every person, every occasion.
          </p>
        </div>
      </div>

      <div className="container-gokana py-12">
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          {/* Occasion pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[{ id: 'all', label: 'All Gifts' }, ...occasions].map((occ) => (
              <button
                key={occ.id}
                onClick={() => handleOccasion(occ.id)}
                className={`flex-none px-4 py-2 font-sans text-xs font-medium tracking-[0.08em] uppercase transition-all duration-300 whitespace-nowrap ${
                  activeOccasion === occ.id
                    ? 'bg-charcoal text-ivory'
                    : 'border border-charcoal/20 text-charcoal/60 hover:border-charcoal hover:text-charcoal'
                }`}
              >
                {occ.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-sans text-xs text-charcoal/40">{filtered.length} products</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-sans text-sm text-charcoal border border-charcoal/20 px-3 py-2 bg-transparent focus:outline-none focus:border-gold"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="font-serif text-2xl font-light text-charcoal/40 mb-4">No gifts found</p>
              <button onClick={() => handleOccasion('all')} className="btn-ghost">
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeOccasion + sortBy}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
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
