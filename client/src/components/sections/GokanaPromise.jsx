import { motion } from 'framer-motion';
import { Heart, Sparkles, Package, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';

const promisePillars = [
  {
    category: 'Quality Selection',
    title: 'Thoughtful Gifting',
    icon: Sparkles,
    desc: 'Every gift is chosen with intention. From handcrafted Belgian chocolates to soothing soy candles, we select only the finest items that spark genuine joy.',
    features: ['Handcrafted in small batches', 'Pure premium ingredients', 'Zero generic compromises'],
  },
  {
    category: 'Personalisation',
    title: 'Personal Touch',
    icon: Heart,
    desc: 'A gift should feel like it was made exclusively for them. We provide complimentary handwritten note cards and personalised custom name engravings.',
    features: ['Handwritten note cards', 'Custom name engraving', 'Tailored to your occasion'],
  },
  {
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
      <span id="reviews" className="sr-only">The GŌKANA Promise</span>

      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(197,160,89,0.18) 0%, transparent 60%)`,
        }}
      />

      <div className="container-gokana relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 md:mb-16">
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

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8" stagger={0.1} delay={0.2}>
          {promisePillars.map(({ category, title, icon: Icon, desc, features }) => (
            <motion.div
              key={category}
              variants={staggerItem}
              className="card-premium flex flex-col justify-between bg-bg-alt border border-border hover:border-accent/40 transition-all duration-300 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-5">
                  <p className="font-sans text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-accent">
                    {category}
                  </p>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-surface-alt border border-border group-hover:border-accent/50 flex items-center justify-center text-accent transition-all duration-300 flex-shrink-0">
                    <Icon size={16} className="sm:hidden" strokeWidth={1.7} />
                    <Icon size={20} className="hidden sm:block" strokeWidth={1.7} />
                  </div>
                </div>

                <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-light text-ivory mb-1.5 sm:mb-3">
                  {title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed font-light mb-3.5 sm:mb-6">
                  {desc}
                </p>
              </div>

              <div className="pt-2.5 sm:pt-4 border-t border-border/70 space-y-1.5 sm:space-y-2">
                {features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-[11px] sm:text-xs text-ivory/90 font-light">
                    <CheckCircle2 size={12} className="text-accent flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerReveal>

        <ScrollReveal delay={0.35} className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-full bg-surface-alt border border-border text-xs text-muted font-light shadow-md">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Every single gift is hand-inspected and packed with care in Mathura, Uttar Pradesh</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
