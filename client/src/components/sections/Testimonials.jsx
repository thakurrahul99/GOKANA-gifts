import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';
import { testimonials } from '../../data';

function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      variants={staggerItem}
      className="card-premium flex flex-col justify-between bg-bg-alt border border-border hover:border-border transition-all p-7"
    >
      <div>
        {/* Rating Stars + Verified Tag */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-1">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} size={15} className="text-accent fill-accent" />
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold tracking-wider uppercase text-accent bg-surface-alt border border-border px-2.5 py-0.5 rounded-full">
            <CheckCircle size={11} className="text-accent" />
            Verified Buyer
          </span>
        </div>

        {/* Quote */}
        <blockquote className="font-serif text-lg font-light text-[#E8E2D8] leading-relaxed mb-6 italic">
          "{testimonial.review}"
        </blockquote>
      </div>

      {/* Author & Product */}
      <div className="pt-5 border-t border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-alt border border-border-light text-accent font-serif font-light text-base flex items-center justify-center flex-shrink-0">
          {testimonial.initials}
        </div>
        <div className="min-w-0">
          <p className="font-sans text-sm font-semibold text-ivory truncate">
            {testimonial.name}
          </p>
          <p className="font-sans text-xs text-muted truncate">
            {testimonial.location} • <span className="text-accent">{testimonial.product}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="section-py bg-bg text-ivory border-b border-border" aria-labelledby="reviews-heading">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3">✦ What Our Customers Say</p>
          </ScrollReveal>
          <AnimatedHeading id="reviews-heading" className="heading-lg text-ivory mb-4" delay={0.15}>
            Customer Reviews
          </AnimatedHeading>

          {/* Aggregate Rating Banner */}
          <ScrollReveal delay={0.25}>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-bg-alt border border-border-light shadow-md">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className="text-accent fill-accent" />
                ))}
              </div>
              <span className="font-serif text-xl font-light text-ivory">4.9 / 5.0</span>
              <span className="text-xs font-sans text-muted">from 2,300+ Verified Buyers</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Reviews Grid */}
        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          stagger={0.08}
          delay={0.2}
        >
          {testimonials.slice(0, 6).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
