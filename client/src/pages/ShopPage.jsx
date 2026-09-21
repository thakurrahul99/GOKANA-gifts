import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Sparkles, Filter } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { occasions, products as staticProducts } from '../data';
import { fetchProductsWithCache } from '../lib/api';

const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rated', value: 'rating' },
];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeOccasion, setActiveOccasion] = useState(searchParams.get('occasion') || 'all');
  const personalisedOnly = searchParams.get('personalised') === 'true';
  const [sortBy, setSortBy] = useState('recommended');
  const [products, setProducts] = useState(staticProducts);
  const [loading, setLoading] = useState(false);

  const normalizeProduct = (p) => ({
    ...p,
    id: p._id || p.id,
    image: p.thumbnail || p.images?.[0],
    image2: p.images?.[1] || p.thumbnail || p.images?.[0],
    reviews: p.reviewCount ?? p.reviews ?? 0,
    categories: (p.categories || []).map((c) => typeof c === 'string' ? c : c.slug).filter(Boolean),
    variants: (p.variants || []).map((v) => typeof v === 'string' ? v : v.label),
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsWithCache('all-100', '?limit=100');
        if (data?.products && data.products.length > 0) {
          setProducts((data.products || []).map(normalizeProduct));
        }
      } catch (error) {
        console.error('Failed to load products from API, using static catalog:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filtered = products
    .filter((p) => (!personalisedOnly || p.personalisable) && (activeOccasion === 'all' || p.categories.includes(activeOccasion)))
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

  const currentOccasion = occasions.find((o) => o.id === activeOccasion);

  const headerEyebrow = personalisedOnly
    ? '✦ PERSONALISED GIFTS'
    : currentOccasion
    ? `✦ SPECIAL OCCASION · ${currentOccasion.label.toUpperCase()}`
    : '✦ ALL GIFTS & HAMPERS';

  const headerTitle = personalisedOnly
    ? 'Personalised Gifts'
    : currentOccasion
    ? `${currentOccasion.label} Gifts`
    : 'All Gifts & Hampers';

  const headerDesc = personalisedOnly
    ? 'Gifts you can make uniquely special with custom engraving, names, and handwritten note cards.'
    : currentOccasion
    ? `Thoughtfully assembled hampers, delicious chocolates, and luxury gifts tailored for ${currentOccasion.label.toLowerCase()} celebrations.`
    : 'Thoughtfully selected and handcrafted gifts for every celebration, milestone, and special moment.';

  return (
    <main className="pt-24 min-h-screen bg-bg text-ivory">
      {/* Page Header — Luxury Dark Espresso with Champagne Gold Accent */}
      <section className="bg-bg-banner text-ivory py-16 sm:py-20 relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(ellipse at 80% 20%, rgba(197,160,89,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(197,160,89,0.08) 0%, transparent 45%)`,
          }}
        />
        <div className="container-gokana text-center relative z-10 max-w-2xl mx-auto">
          <ScrollReveal>
            <p className="label-text text-accent mb-3 flex items-center justify-center gap-2 tracking-[0.22em]">
              <Sparkles size={14} />
              {headerEyebrow}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="heading-xl text-ivory font-serif">{headerTitle}</h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-sans text-sm md:text-base text-muted mt-4 leading-relaxed font-light">
              {headerDesc}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container-gokana py-10 sm:py-14">
        {/* Filters and Sort Bar */}
        <div className="bg-bg-alt border border-border rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Occasion filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-semibold text-ivory uppercase tracking-wider flex items-center gap-1.5 mr-1 flex-shrink-0">
              <Filter size={14} className="text-accent" />
              Occasion:
            </span>
            {[{ id: 'all', label: 'All Gifts' }, ...occasions].map((occ) => {
              const active = activeOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => handleOccasion(occ.id)}
                  className={`flex-none px-4 py-2 text-xs font-medium tracking-[0.06em] uppercase transition-all duration-200 whitespace-nowrap min-h-[40px] flex items-center justify-center rounded-full ${
                    active
                      ? 'bg-accent text-bg font-semibold shadow-[0_2px_12px_rgba(197,160,89,0.25)] border border-accent'
                      : 'bg-bg text-muted border border-border hover:border-accent hover:text-ivory'
                  }`}
                  aria-pressed={active}
                >
                  {occ.label}
                </button>
              );
            })}
          </div>

          {/* Sort & Count */}
          <div className="flex items-center justify-between md:justify-end gap-4 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
            <span className="font-sans text-xs text-muted font-medium">
              Showing <strong className="text-ivory font-semibold">{filtered.length}</strong> {filtered.length === 1 ? 'gift' : 'gifts'}
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor="shop-sort" className="sr-only">Sort gifts</label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-sans text-xs sm:text-sm text-ivory border border-border px-3.5 py-2 bg-bg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 min-h-[40px] cursor-pointer rounded-lg"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value} className="bg-bg text-ivory">{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid or Friendly Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-7">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-bg-alt border border-border rounded-xl p-4 space-y-3 animate-pulse shadow-md">
                <div className="aspect-[4/5] bg-surface-alt rounded-lg" />
                <div className="h-4 bg-surface-skeleton rounded w-3/4" />
                <div className="h-3 bg-surface-skeleton rounded w-1/2" />
                <div className="h-9 bg-surface-skeleton rounded mt-2" />
              </div>
            ))}
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-bg-alt border border-border rounded-2xl p-10 max-w-lg mx-auto shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mx-auto mb-5">
                <Sparkles size={26} />
              </div>
              <p className="font-serif text-2xl font-light text-ivory mb-2">No gifts match this filter</p>
              <p className="font-sans text-sm text-muted mb-6 font-light">
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
        )}
      </div>
    </main>
  );
}
