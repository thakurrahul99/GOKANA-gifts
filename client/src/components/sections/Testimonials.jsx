import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';
import { Rating, Divider } from '../ui';
import { testimonials } from '../../data';

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-ivory border border-charcoal/[0.07] p-7 hover:shadow-premium transition-all duration-500"
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={14} className="text-gold fill-gold" />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="font-serif text-lg font-light text-charcoal leading-relaxed mb-6 italic">
        "{testimonial.review}"
      </blockquote>

      {/* Divider */}
      <div className="w-8 h-px bg-gold/40 mb-5" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-champagne flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-sm font-medium text-charcoal/70">{testimonial.initials}</span>
        </div>
        <div>
          <p className="font-sans text-sm font-medium text-charcoal">{testimonial.name}</p>
          <p className="font-sans text-xs text-charcoal/40">{testimonial.location} · {testimonial.product}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section className="section-py bg-ivory">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-gold mb-5">✦ Customer Stories</p>
          </ScrollReveal>
          <AnimatedHeading className="heading-lg text-charcoal mb-5" delay={0.15}>
            Loved. Gifted. Remembered.
          </AnimatedHeading>

          {/* Overall rating */}
          <ScrollReveal delay={0.35}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className="text-gold fill-gold" />
                ))}
              </div>
              <span className="font-serif text-2xl font-light text-charcoal">4.9</span>
              <span className="font-sans text-sm text-charcoal/40">from 2,300+ reviews</span>
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
          {testimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </StaggerReveal>

        {/* Second row — slightly different layout */}
        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 max-w-3xl mx-auto"
          stagger={0.1}
          delay={0.3}
        >
          {testimonials.slice(3, 5).map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </StaggerReveal>

        {/* Trust badges */}
        <ScrollReveal delay={0.2} className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-t border-b border-charcoal/[0.07]">
            {[
              { num: '50,000+', label: 'Happy Customers' },
              { num: '4.9/5', label: 'Average Rating' },
              { num: '2-4 Days', label: 'Delivery' },
              { num: '100%', label: 'Premium Quality' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-serif text-2xl font-light text-charcoal mb-1">{item.num}</p>
                <p className="font-sans text-xs text-charcoal/45 tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
