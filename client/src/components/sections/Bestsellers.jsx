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
    <section className="section-py bg-beige-100 overflow-hidden">
      <div className="container-gokana">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text text-gold mb-4">✦ Most Loved</p>
            </ScrollReveal>
            <AnimatedHeading className="heading-lg text-charcoal" delay={0.15}>
              Our Bestsellers
            </AnimatedHeading>
          </div>
          <ScrollReveal delay={0.3} className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-11 h-11 border border-charcoal/20 flex items-center justify-center text-charcoal/60 hover:border-charcoal hover:text-charcoal transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-11 h-11 border border-charcoal/20 flex items-center justify-center text-charcoal/60 hover:border-charcoal hover:text-charcoal transition-all duration-300"
              aria-label="Scroll right"
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
          <p className="font-sans text-xs text-charcoal/35 tracking-widest">← Swipe to explore →</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
