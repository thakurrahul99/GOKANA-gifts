import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { Divider } from '../ui';
import { ProductCard } from '../product/ProductCard';
import { products } from '../../data';

export function FeaturedCollection() {
  const featured = products.filter((p) => p.tags.includes('featured'));

  return (
    <section className="section-py bg-ivory">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-gold mb-5">✦ Featured Collection</p>
          </ScrollReveal>
          <AnimatedHeading className="heading-lg text-charcoal mb-6" delay={0.15}>
            Curated For You
          </AnimatedHeading>
          <ScrollReveal delay={0.35}>
            <p className="body-text text-charcoal/55 max-w-xl mx-auto">
              Each piece hand-selected for its quality, story and the joy it brings to the one who receives it.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="flex justify-center mt-5">
              <Divider />
            </div>
          </ScrollReveal>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.2} className="text-center mt-14">
          <Link to="/shop" className="btn-secondary">
            View All Products
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
