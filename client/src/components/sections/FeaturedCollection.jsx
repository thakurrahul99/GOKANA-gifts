import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { Divider } from '../ui';
import { ProductCard } from '../product/ProductCard';
import { products } from '../../data';

export function FeaturedCollection() {
  const featured = products.filter((p) => p.tags.includes('featured'));

  return (
    <section className="section-py bg-[#FBF8F2]" aria-labelledby="featured-heading">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center mb-14 max-w-xl mx-auto">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-[#D4AF37] mb-3">✦ Hand-Selected Excellence</p>
          </ScrollReveal>
          <AnimatedHeading id="featured-heading" className="heading-lg text-[#0B1F3A] mb-4" delay={0.15}>
            Featured Curations
          </AnimatedHeading>
          <ScrollReveal delay={0.25}>
            <p className="font-sans text-base text-[#6B6B6B] leading-relaxed">
              Every hamper hand-assembled for its narrative, quality ingredients, and unboxing grandeur.
            </p>
          </ScrollReveal>
          <div className="flex justify-center mt-5">
            <Divider />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.2} className="text-center mt-12">
          <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
            View Complete Collection
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
