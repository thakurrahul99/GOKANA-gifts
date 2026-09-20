import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { Divider } from '../ui';
import { ProductCard } from '../product/ProductCard';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../lib/api';

export function FeaturedCollection() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/products?limit=100&featured=true`)
      .then((res) => res.json())
      .then((data) => {
        const products = (data.products || []).map((p) => ({
          ...p,
          id: p._id || p.id,
          image: p.thumbnail || p.images?.[0],
          image2: p.images?.[1] || p.thumbnail || p.images?.[0],
          tags: p.tags || [],
          categories: (p.categories || []).map((cat) => typeof cat === 'string' ? cat : cat.slug).filter(Boolean),
          variants: (p.variants || []).map((v) => typeof v === 'string' ? v : v.label),
        }));
        setFeatured(products);
      })
      .catch(() => setFeatured([]));
  }, []);

  return (
    <section className="section-py bg-surface-alt" aria-labelledby="featured-heading">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center mb-14 max-w-xl mx-auto">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3">✦ Hand-Selected Excellence</p>
          </ScrollReveal>
          <AnimatedHeading id="featured-heading" className="heading-lg text-primary mb-4" delay={0.15}>
            Featured Curations
          </AnimatedHeading>
          <ScrollReveal delay={0.25}>
            <p className="font-sans text-base text-muted leading-relaxed">
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
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            View Complete Collection
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
