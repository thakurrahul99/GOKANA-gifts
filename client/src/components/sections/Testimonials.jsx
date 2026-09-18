import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';
import { Rating, Divider, VerifiedBadge } from '../ui';
import { testimonials } from '../../data';

function TestimonialCard({ testimonial }) {
  return (
    <motion.article
      variants={staggerItem}
      className="flex flex-col p-7 rounded-2xl transition-all duration-300"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(11,31,58,0.04)',
      }}
      whileHover={{ boxShadow: '0 8px 24px rgba(11,31,58,0.08)', y: -2 }}
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-5" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={14} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="font-serif text-lg font-light italic leading-relaxed flex-1 mb-6" style={{ color: 'var(--text)' }}>
        "{testimonial.review}"
      </blockquote>

      {/* Divider */}
      <div className="h-px mb-5" style={{ width: '2rem', background: 'var(--accent)' }} />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent-soft)' }}
          aria-hidden="true"
        >
          <span className="font-serif text-sm font-medium" style={{ color: 'var(--primary)' }}>
            {testimonial.initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold" style={{ color: 'var(--text-strong)' }}>
            {testimonial.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-sans text-xs" style={{ color: 'var(--muted)' }}>
              {testimonial.location}
            </p>
            <span
              className="font-sans text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: 'var(--blush)', color: 'var(--primary)' }}
            >
              {testimonial.product}
            </span>
          </div>
          <VerifiedBadge className="mt-1" />
        </div>
      </div>
    </motion.article>
  );
}

export function Testimonials() {
  return (
    <section className="section-py" style={{ background: 'var(--bg)' }}>
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal delay={0.1}>
            <p className="label-text mb-5" style={{ color: 'var(--accent)' }}>✦ Customer Stories</p>
          </ScrollReveal>
          <AnimatedHeading className="heading-lg mb-5" delay={0.15}>
            Loved. Gifted. Remembered.
          </AnimatedHeading>

          {/* Overall rating — social proof */}
          <ScrollReveal delay={0.35}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex gap-0.5" aria-label="4.9 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
                ))}
              </div>
              <span className="font-serif text-2xl font-light" style={{ color: 'var(--text-strong)' }}>4.9</span>
              <span className="font-sans text-sm" style={{ color: 'var(--muted)' }}>from 2,300+ reviews</span>
            </div>
            <Divider className="mx-auto" />
          </ScrollReveal>
        </div>

        {/* Cards grid */}
        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          stagger={0.1}
          delay={0.2}
        >
          {testimonials.slice(0, 3).map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </StaggerReveal>

        {/* Second row */}
        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 max-w-3xl mx-auto"
          stagger={0.1}
          delay={0.3}
        >
          {testimonials.slice(3, 5).map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </StaggerReveal>

        {/* Stats bar */}
        <ScrollReveal delay={0.2} className="mt-16">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10"
            style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
          >
            {[
              { num: '50,000+', label: 'Happy Customers' },
              { num: '4.9/5', label: 'Average Rating' },
              { num: '2-4 Days', label: 'Delivery' },
              { num: '100%', label: 'Premium Quality' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-serif text-2xl font-light mb-1" style={{ color: 'var(--primary)' }}>{item.num}</p>
                <p className="font-sans text-xs tracking-wide" style={{ color: 'var(--muted)' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
