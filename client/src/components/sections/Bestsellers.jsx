import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { ProductCard } from '../product/ProductCard';
import { fetchProductsWithCache } from '../../lib/api';
import { products as defaultProducts } from '../../data';

export function Bestsellers() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState(defaultProducts);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [draggedDistance, setDraggedDistance] = useState(0);

  useEffect(() => {
    fetchProductsWithCache('all-100', '?limit=100')
      .then((data) => {
        if (data?.products && data.products.length > 0) {
          const normalized = (data.products || []).map((p) => ({
            ...p,
            id: p._id || p.id,
            image: p.thumbnail || p.images?.[0],
            image2: p.images?.[1] || p.thumbnail || p.images?.[0],
            tags: p.tags || [],
            categories: (p.categories || []).map((cat) => typeof cat === 'string' ? cat : cat.slug).filter(Boolean),
            variants: (p.variants || []).map((v) => typeof v === 'string' ? v : v.label),
          }));
          setProducts(normalized);
        }
      })
      .catch(() => setProducts(defaultProducts));
  }, []);

  const bestsellers = products.filter((p) => (p.tags && p.tags.includes('bestseller')) || p.badge === 'Bestseller');
  const carouselItems = bestsellers.length > 0
    ? [...bestsellers, ...products.filter((p) => !bestsellers.some((b) => b.id === p.id)).slice(0, 4)]
    : products.slice(0, 8);

  const scroll = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = dir === 'left' ? -344 : 344;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDraggedDistance(0);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeftPos(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    setDraggedDistance((d) => d + Math.abs(x - startX));
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Global mouseup listener so dragging resets even if mouse leaves window
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const handleClickCapture = (e) => {
    if (draggedDistance > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="bestsellers" className="section-py bg-bg overflow-hidden" aria-labelledby="bestsellers-heading">
      <div className="container-gokana">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-12">
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text text-accent mb-3">✦ Most Adored</p>
            </ScrollReveal>
            <AnimatedHeading id="bestsellers-heading" className="heading-lg text-ivory" delay={0.15}>
              Our Bestsellers
            </AnimatedHeading>
          </div>

          <ScrollReveal delay={0.2} className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="min-w-[44px] min-h-[44px] rounded-full border border-border flex items-center justify-center text-ivory hover:text-bg hover:bg-accent hover:border-accent transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll bestsellers left"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="min-w-[44px] min-h-[44px] rounded-full border border-border flex items-center justify-center text-ivory hover:text-bg hover:bg-accent hover:border-accent transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll bestsellers right"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </ScrollReveal>
        </div>

        {/* Carousel Row */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClickCapture={handleClickCapture}
          className={`flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-4 sm:pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            scrollSnapType: isDragging ? 'none' : 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: isDragging ? 'auto' : 'smooth',
          }}
        >
          {carouselItems.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className={`flex-none w-[240px] xs:w-[270px] sm:w-[320px] ${isDragging ? 'pointer-events-none' : ''}`}
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
