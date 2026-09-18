import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { ProductCard } from '../product/ProductCard';
import { products } from '../../data';

export function Bestsellers() {
  const scrollRef = useRef(null);
  const bestsellers = products.filter((p) => p.tags.includes('bestseller'));
  // Duplicate for carousel feel
  const carouselItems = [...bestsellers, ...products.slice(0, 2)];

  const scroll = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.offsetWidth * 0.8;
    container.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="section-py overflow-hidden" style={{ background: 'var(--surface)' }}>
      <div className="container-gokana">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text mb-4" style={{ color: 'var(--accent)' }}>✦ Most Loved</p>
            </ScrollReveal>
            <AnimatedHeading className="heading-lg" delay={0.15}>
              Our Bestsellers
            </AnimatedHeading>
          </div>
          <ScrollReveal delay={0.3} className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-11 h-11 flex items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
              style={{ border: '1px solid var(--border)', color: 'var(--muted)', '--tw-ring-color': 'var(--accent)' }}
              aria-label="Scroll left"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-11 h-11 flex items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2"
              style={{ border: '1px solid var(--border)', color: 'var(--muted)', '--tw-ring-color': 'var(--accent)' }}
              aria-label="Scroll right"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </ScrollReveal>
        </div>

        {/* Carousel */}
        <motion.div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {carouselItems.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="flex-none w-[260px] md:w-[300px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </motion.div>

        {/* Mobile drag hint */}
        <ScrollReveal delay={0.2} className="text-center mt-6 md:hidden">
          <p className="font-sans text-xs tracking-widest" style={{ color: 'var(--muted-2)' }}>← Swipe to explore →</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
