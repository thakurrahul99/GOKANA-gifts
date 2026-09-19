import { motion } from 'framer-motion';
import { Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';
import { testimonials } from '../../data';

function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      variants={staggerItem}
      className="card-premium flex flex-col justify-between"
    >
      <div>
        {/* Rating Stars + Verified Tag */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} size={15} className="text-[#D4AF37] fill-[#D4AF37]" />
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-[#2E7D32] bg-[#E7ECF3] px-2 py-0.5 rounded-full">
            <CheckCircle size={12} className="text-[#2E7D32]" />
            Verified Buyer
          </span>
        </div>

        {/* Quote */}
        <blockquote className="font-serif text-lg font-light text-[#0B1F3A] leading-relaxed mb-6 italic">
          "{testimonial.review}"
        </blockquote>
      </div>

      {/* Author & Product */}
      <div className="pt-4 border-t border-[#E8DFD3] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F5E9C8] text-[#0B1F3A] font-serif font-semibold text-sm flex items-center justify-center flex-shrink-0">
          {testimonial.initials}
        </div>
        <div className="min-w-0">
          <p className="font-sans text-sm font-semibold text-[#0B1F3A] truncate">
            {testimonial.name}
          </p>
          <p className="font-sans text-xs text-[#6B6B6B] truncate">
            {testimonial.location} • <span className="text-[#D4AF37]">{testimonial.product}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="section-py bg-[#F7F3EC]" aria-labelledby="reviews-heading">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-[#D4AF37] mb-3">✦ Verified Customer Stories</p>
          </ScrollReveal>
          <AnimatedHeading id="reviews-heading" className="heading-lg text-[#0B1F3A] mb-4" delay={0.15}>
            Loved. Gifted. Remembered.
          </AnimatedHeading>

          {/* Aggregate Rating Banner */}
          <ScrollReveal delay={0.25}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-[#E8DFD3] shadow-xs">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
                ))}
              </div>
              <span className="font-serif text-xl font-light text-[#0B1F3A]">4.9 / 5.0</span>
              <span className="text-xs font-sans text-[#6B6B6B]">from 2,300+ Verified Buyers</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Reviews Grid (CRO Requirement) */}
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
