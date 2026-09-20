import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { ProductCard } from '../product/ProductCard';
import { products } from '../../data';

export function Bestsellers() {
  const scrollRef = useRef(null);
  const bestsellers = products.filter((p) => p.tags.includes('bestseller'));
  const carouselItems = [...bestsellers, ...products.slice(0, 2)];

  const scroll = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.offsetWidth * 0.75;
    container.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="section-py bg-white overflow-hidden" aria-labelledby="bestsellers-heading">
      <div className="container-gokana">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text text-accent mb-3">✦ Most Adored</p>
            </ScrollReveal>
            <AnimatedHeading id="bestsellers-heading" className="heading-lg text-primary" delay={0.15}>
              Our Bestsellers
            </AnimatedHeading>
          </div>

          <ScrollReveal delay={0.2} className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="min-w-[44px] min-h-[44px] rounded-full border border-border flex items-center justify-center text-primary hover:border-accent hover:bg-accent-soft transition-all"
              aria-label="Scroll bestsellers left"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="min-w-[44px] min-h-[44px] rounded-full border border-border flex items-center justify-center text-primary hover:border-accent hover:bg-accent-soft transition-all"
              aria-label="Scroll bestsellers right"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </ScrollReveal>
        </div>

        {/* Carousel Row */}
        <motion.div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 sm:-mx-8 sm:px-8"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {carouselItems.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="flex-none w-[280px] sm:w-[320px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
