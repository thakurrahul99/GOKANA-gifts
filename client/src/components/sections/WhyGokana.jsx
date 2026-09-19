import { motion } from 'framer-motion';
import { Sparkles, PackageCheck, Truck, HeartHandshake } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';

const pillars = [
  {
    icon: Sparkles,
    title: 'Personalisation',
    subtitle: 'Every Gift is One-of-a-Kind',
    desc: 'Custom monograms, engraved wooden keepsakes, and handwritten calligraphy cards on 300 GSM cotton paper.',
  },
  {
    icon: PackageCheck,
    title: 'Premium Packaging',
    subtitle: 'The Art of the Unboxing',
    desc: 'Textured rigid boxes, embossed gold foil accents, and double-faced satin ribbons that create immediate anticipation.',
  },
  {
    icon: Truck,
    title: 'Fast & Secure Delivery',
    subtitle: 'Guaranteed On-Time Across India',
    desc: 'Climate-controlled courier partners and real-time tracking ensure delicate chocolates and candles arrive pristine.',
  },
  {
    icon: HeartHandshake,
    title: 'Handcrafted Curation',
    subtitle: 'Artisanal Small-Batch Excellence',
    desc: 'Partnered with indigenous master artisans and luxury chocolatiers who put unmatched passion into every single piece.',
  },
];

export function WhyGokana() {
  return (
    <section className="section-py bg-[#FBF8F2]" aria-labelledby="why-gokana-heading">
      <div className="container-gokana">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-[#D4AF37] mb-3">✦ The GŌKANA Distinction</p>
          </ScrollReveal>
          <AnimatedHeading id="why-gokana-heading" className="heading-lg text-[#0B1F3A] mb-4" delay={0.15}>
            Why Choose GŌKANA
          </AnimatedHeading>
          <ScrollReveal delay={0.25}>
            <p className="font-sans text-base text-[#6B6B6B] leading-relaxed">
              We obsess over every detail so that when your gift is opened, it creates a genuine moment of reverence, delight, and connection.
            </p>
          </ScrollReveal>
        </div>

        {/* 4 Pillars Grid (CRO Requirement) */}
        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          stagger={0.08}
          delay={0.2}
        >
          {pillars.map(({ icon: Icon, title, subtitle, desc }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="card-premium group flex flex-col justify-between p-6 md:p-7"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F3D9D4]/60 flex items-center justify-center text-[#0B1F3A] mb-6 group-hover:bg-[#F5E9C8] transition-colors">
                  <Icon size={26} strokeWidth={1.8} className="text-[#0B1F3A]" />
                </div>
                <h3 className="font-serif text-2xl font-light text-[#0B1F3A] mb-1">
                  {title}
                </h3>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-3">
                  {subtitle}
                </p>
                <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
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
