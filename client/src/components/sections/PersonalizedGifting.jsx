import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PenTool, MessageSquare, Feather, Gift, Sparkles } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';

const personalizationOptions = [
  {
    icon: PenTool,
    title: 'Name engraving',
    desc: 'Laser-etched initials or names on wooden keepsake boxes, brass plates, and leather tags.',
  },
  {
    icon: MessageSquare,
    title: 'Custom message',
    desc: 'Heartfelt sentiments written for your recipient, capturing your unique bond and memories.',
  },
  {
    icon: Feather,
    title: 'Handwritten card',
    desc: 'Complimentary handwritten calligraphy on cotton paper, sealed with authentic black/gold wax.',
  },
  {
    icon: Gift,
    title: 'Premium wrapping',
    desc: 'Signature rigid keepsake boxes hand-tied with double-faced champagne-gold silk ribbons.',
  },
];

export function PersonalizedGifting() {
  return (
    <section id="personalisation" className="section-py bg-bg text-ivory overflow-hidden border-b border-border" aria-labelledby="personalisation-heading">
      <div className="container-gokana">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Left — Visually Rich Calligraphy Keepsake Simulation */}
          <ScrollReveal direction="scale" className="relative">
            <div className="relative aspect-square max-w-md mx-auto bg-bg-alt rounded-[8px] p-6 sm:p-8 md:p-12 border border-border shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center text-center">
              {/* Subtle Gold Ornamental Stamp */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border bg-surface-alt flex items-center justify-center text-accent mb-4 sm:mb-6">
                <Sparkles size={18} className="text-accent" />
              </div>

              {/* Sample Calligraphy Letter */}
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-accent mb-2">
                Handwritten with Care
              </p>
              <h4 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-ivory mb-2 sm:mb-3 italic">
                Dearest Deepti,
              </h4>
              <p className="font-serif text-sm sm:text-base md:text-lg text-ivory/90 leading-relaxed max-w-xs italic mb-4 sm:mb-6 font-light">
                "May this milestone bring you quiet joy, unforgettable celebrations, and dreams realized."
              </p>

              <div className="pt-3 sm:pt-4 border-t border-border w-full flex items-center justify-between text-xs text-muted font-sans">
                <span className="font-medium tracking-wider text-[11px] sm:text-xs">Wax Sealed • 300 GSM</span>
                <span className="font-semibold text-accent uppercase tracking-wider text-[11px] sm:text-xs">Complimentary</span>
              </div>

              {/* Floating Tag */}
              <div className="absolute top-2 right-2 sm:-top-3 sm:-right-3 bg-surface-alt border border-border text-accent px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase shadow-lg flex items-center gap-1.5">
                <Sparkles size={12} className="text-accent" />
                100% Personalised
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Personalisation Options and Explanation */}
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text text-accent mb-3">✦ Personalised Gifting</p>
            </ScrollReveal>
            <AnimatedHeading id="personalisation-heading" className="heading-lg text-ivory mb-4" delay={0.15}>
              Make It Truly Theirs
            </AnimatedHeading>
            <ScrollReveal delay={0.25}>
              <p className="font-sans text-sm md:text-base text-muted leading-relaxed mb-8 max-w-lg">
                Add a name, message or personal touch to turn a beautiful gift into a lasting memory.
              </p>
            </ScrollReveal>

            {/* 4 Personalisation Options List */}
            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" stagger={0.06}>
              {personalizationOptions.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={staggerItem}
                  className="p-4 rounded-[6px] bg-bg-alt border border-border hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 mb-1.5 text-accent">
                    <Icon size={16} strokeWidth={1.8} className="text-accent" />
                    <h5 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ivory">{title}</h5>
                  </div>
                  <p className="font-sans text-xs text-muted leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </StaggerReveal>

            <ScrollReveal delay={0.4}>
              <Link to="/shop?personalised=true" className="btn-primary inline-flex items-center justify-center w-full sm:w-auto gap-2">
                EXPLORE PERSONALISATION →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
