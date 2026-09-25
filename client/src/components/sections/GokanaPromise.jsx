import { motion } from 'framer-motion';
import { Heart, Sparkles, Package, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';

const promisePillars = [
  {
    num: '01',
    category: 'Curation',
    title: 'Thoughtful Gifting',
    icon: Sparkles,
    desc: 'Every gift is chosen with intention. From handcrafted Belgian chocolates to soothing soy candles, we select only the finest items that spark genuine joy.',
    features: ['Handcrafted in small batches', 'Artisanal recipes & ingredients', 'Zero generic compromises'],
  },
  {
    num: '02',
    category: 'Personalisation',
    title: 'Personal Touch',
    icon: Heart,
    desc: 'A gift should feel like it was made exclusively for them. We provide complimentary handwritten calligraphy note cards and bespoke name engravings.',
    features: ['Handwritten calligraphy notes', 'Custom keepsake engraving', 'Tailored to your occasion'],
  },
  {
    num: '03',
    category: 'Presentation',
    title: 'Beautiful Presentation',
    icon: Package,
    desc: 'Unboxing is where the magic begins. Hand-assembled in luxury rigid keepsake boxes, wrapped in delicate botanical tissue, and tied with silk satin ribbons.',
    features: ['Signature rigid gift boxes', 'Silk satin ribbon tying', 'Delivered pristine pan-India'],
  },
];

export function GokanaPromise() {
  return (
    <section id="promise" className="section-py bg-bg text-ivory border-b border-border relative overflow-hidden" aria-labelledby="promise-heading">
      {/* Invisible anchor for backward compatibility with #reviews links */}
      <span id="reviews" className="sr-only">The GŌKANA Promise</span>

      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(197,160,89,0.18) 0%, transparent 60%)`,
        }}
      />

      <div className="container-gokana relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} />
              Our Commitment
            </p>
          </ScrollReveal>
          <AnimatedHeading id="promise-heading" className="heading-lg text-ivory mb-4" delay={0.15}>
            The GŌKANA Promise
          </AnimatedHeading>
          <ScrollReveal delay={0.25}>
            <p className="font-sans text-sm md:text-base text-muted leading-relaxed font-light">
              We believe a gift should never feel ordinary. Every hamper is packed with devotion, precision, and heartfelt artistry.
            </p>
          </ScrollReveal>
        </div>

        {/* 3 Pillars Grid */}
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" stagger={0.1} delay={0.2}>
          {promisePillars.map(({ num, category, title, icon: Icon, desc, features }) => (
            <motion.div
              key={num}
              variants={staggerItem}
              className="card-premium flex flex-col justify-between bg-bg-alt border border-border hover:border-accent/40 transition-all duration-300 p-6 sm:p-8 rounded-2xl shadow-xl group"
            >
              <div>
                {/* Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl sm:text-4xl font-light text-accent/50 group-hover:text-accent transition-colors">
                    {num}
                  </span>
                  <div className="w-11 h-11 rounded-full bg-surface-alt border border-border group-hover:border-accent/50 flex items-center justify-center text-accent transition-all duration-300">
                    <Icon size={20} strokeWidth={1.7} />
                  </div>
                </div>

                {/* Eyebrow & Title */}
                <p className="font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                  {category}
                </p>
                <h3 className="font-serif text-xl sm:text-2xl font-light text-ivory mb-3">
                  {title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed font-light mb-6">
                  {desc}
                </p>
              </div>

              {/* Feature Points */}
              <div className="pt-4 border-t border-border/70 space-y-2">
                {features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-ivory/90 font-light">
                    <CheckCircle2 size={13} className="text-accent flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerReveal>

        {/* Bottom Trust Assurance Badge */}
        <ScrollReveal delay={0.35} className="mt-12 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-full bg-surface-alt border border-border text-xs text-muted font-light shadow-md">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Every single gift is hand-inspected and packed with care in Mathura, Uttar Pradesh</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
