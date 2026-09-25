import { motion } from 'framer-motion';
import { Sparkles, PackageCheck, HeartHandshake, Compass } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';

const journeySteps = [
  {
    action: 'SELECT',
    title: 'Thoughtfully Selected',
    desc: 'Gifts selected with care — from Belgian chocolates to premium soy candles and special keepsake gifts.',
    icon: Compass,
  },
  {
    action: 'PERSONALISE',
    title: 'Personalised With Care',
    desc: 'Add a meaningful personal touch with custom engravings, heartfelt handwritten notes, and luxury wax seals.',
    icon: Sparkles,
  },
  {
    action: 'PRESENTATION',
    title: 'Premium Presentation',
    desc: 'Designed to make the moment feel special — hand-assembled in textured rigid boxes tied with silk ribbons.',
    icon: PackageCheck,
  },
  {
    action: 'DELIVERY',
    title: 'Delivered With Care',
    desc: 'Careful packaging and reliable pan-India delivery, ensuring an unforgettable unboxing experience.',
    icon: HeartHandshake,
  },
];

export function WhyGokana() {
  return (
    <section className="section-py bg-bg-alt text-ivory border-b border-border" aria-labelledby="experience-heading">
      <div className="container-gokana">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3">✦ The Gifting Journey</p>
          </ScrollReveal>
          <AnimatedHeading id="experience-heading" className="heading-lg text-ivory mb-4" delay={0.15}>
            The GŌKANA Experience
          </AnimatedHeading>
          <ScrollReveal delay={0.25}>
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 md:gap-3 py-2 px-3 xs:px-5 rounded-full bg-surface-alt border border-border text-accent font-sans text-[10px] xs:text-xs font-semibold tracking-[0.12em] xs:tracking-[0.18em] uppercase max-w-full">
              <span>Curate</span>
              <span className="text-ivory/30">→</span>
              <span>Personalise</span>
              <span className="text-ivory/30">→</span>
              <span>Present</span>
              <span className="text-ivory/30">→</span>
              <span>Deliver</span>
            </div>
          </ScrollReveal>
        </div>

        <StaggerReveal
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
          stagger={0.08}
          delay={0.2}
        >
          {journeySteps.map(({ action, title, desc, icon: Icon }) => (
            <motion.div
              key={action}
              variants={staggerItem}
              className="card-premium group relative flex flex-col justify-between p-5 sm:p-6 md:p-7 bg-surface border border-border hover:border-border transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-end mb-6">
                  <div className="w-10 h-10 rounded-full border border-border bg-surface-alt flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg group-hover:border-accent transition-all duration-300">
                    <Icon size={18} strokeWidth={1.7} />
                  </div>
                </div>

                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-1.5">
                  {action}
                </p>
                <h3 className="font-serif text-xl font-light text-ivory mb-2.5">
                  {title}
                </h3>
                <p className="font-sans text-xs text-muted leading-relaxed font-light">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
