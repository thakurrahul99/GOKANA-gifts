import { motion } from 'framer-motion';
import { Sparkles, PackageCheck, HeartHandshake, Compass, ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';

const journeySteps = [
  {
    step: '01',
    action: 'CHOOSE',
    title: 'Curated with Intention',
    desc: 'Select from masterfully curated collections of Belgian chocolates, artisanal soy candles, and luxury keepsakes.',
    icon: Compass,
  },
  {
    step: '02',
    action: 'PERSONALISE',
    title: 'Crafted for Their Story',
    desc: 'Custom laser engraving, heartfelt wax-sealed calligraphy notes on 300 GSM paper, and custom ribbon finishes.',
    icon: Sparkles,
  },
  {
    step: '03',
    action: 'WE PACK',
    title: 'The Art of the Rigid Box',
    desc: 'Every gift is meticulously hand-assembled in textured rigid boxes, accented with champagne gold foil.',
    icon: PackageCheck,
  },
  {
    step: '04',
    action: 'THEY REMEMBER',
    title: 'An Enduring Memory',
    desc: 'Delivered in immaculate condition across India — creating a breathtaking moment of reverence and unboxing joy.',
    icon: HeartHandshake,
  },
];

export function WhyGokana() {
  return (
    <section className="section-py bg-[#181512] text-ivory border-b border-[rgba(197,160,89,0.15)]" aria-labelledby="experience-heading">
      <div className="container-gokana">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3">✦ The Gifting Journey</p>
          </ScrollReveal>
          <AnimatedHeading id="experience-heading" className="heading-lg text-ivory mb-4" delay={0.15}>
            The GŌKANA Experience
          </AnimatedHeading>
          <ScrollReveal delay={0.25}>
            {/* Journey Flow Indicator */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 md:gap-3 py-2 px-5 rounded-full bg-[#1F1A16] border border-[rgba(197,160,89,0.25)] text-accent font-sans text-xs font-semibold tracking-[0.18em] uppercase">
              <span>Choose</span>
              <span className="text-ivory/30">→</span>
              <span>Personalise</span>
              <span className="text-ivory/30">→</span>
              <span>We Pack</span>
              <span className="text-ivory/30">→</span>
              <span>They Remember</span>
            </div>
          </ScrollReveal>
        </div>

        {/* 4 Steps Journey Grid */}
        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          stagger={0.08}
          delay={0.2}
        >
          {journeySteps.map(({ step, action, title, desc, icon: Icon }) => (
            <motion.div
              key={step}
              variants={staggerItem}
              className="card-premium group relative flex flex-col justify-between p-6 md:p-7 bg-[#191613] border border-[rgba(197,160,89,0.2)] hover:border-[rgba(197,160,89,0.5)] transition-all duration-300"
            >
              <div>
                {/* Step Marker & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl font-light text-accent/60 tracking-wider">
                    {step}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-[rgba(197,160,89,0.3)] bg-[#1F1A16] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-[#12100E] group-hover:border-accent transition-all duration-300">
                    <Icon size={18} strokeWidth={1.7} />
                  </div>
                </div>

                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-1.5">
                  {action}
                </p>
                <h3 className="font-serif text-xl font-light text-ivory mb-2.5">
                  {title}
                </h3>
                <p className="font-sans text-xs text-[#A39A8E] leading-relaxed font-light">
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
