import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';

export function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-bg text-ivory overflow-hidden border-b border-border" aria-labelledby="final-cta-heading">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.12)_0%,transparent_65%)] pointer-events-none" />

      {/* Decorative Gold Framing Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

      <div className="container-gokana relative z-10 text-center max-w-3xl mx-auto">
        <ScrollReveal delay={0.1}>
          <p className="label-text text-accent mb-4 tracking-[0.26em]">✦ MEMORABLE GIFTING</p>
        </ScrollReveal>

        <AnimatedHeading
          id="final-cta-heading"
          className="font-serif text-[clamp(2.4rem,5.5vw,4.8rem)] font-light text-ivory mb-6 leading-[1.08] tracking-tight"
          delay={0.15}
        >
          Make their moment<br />
          <span className="italic text-accent font-light">unforgettable.</span>
        </AnimatedHeading>

        <ScrollReveal delay={0.25}>
          <p className="font-sans text-sm md:text-base text-muted leading-relaxed max-w-xl mx-auto mb-10 font-light">
            Whether celebrating a special occasion or sending a heartfelt surprise, create a personalized gift that leaves an unforgettable impression.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.35}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="btn-primary text-xs py-4 px-8 uppercase tracking-[0.14em] font-semibold shadow-[0_8px_30px_rgba(197,160,89,0.25)]"
            >
              EXPLORE THE COLLECTION →
            </Link>
            <Link
              to="/gift-finder"
              className="btn-outline text-xs py-4 px-7 uppercase tracking-[0.14em] font-semibold !text-accent border-accent hover:bg-accent/10"
            >
              🎁 FIND THE PERFECT GIFT →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
