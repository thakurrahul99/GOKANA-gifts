import { motion } from 'framer-motion';
import { Sparkles, PackageCheck, Clock, Leaf, RefreshCw, Award } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';

const reasons = [
  {
    icon: Sparkles,
    title: 'Curated with Care',
    desc: 'Every product is handpicked by our gifting experts — quality over quantity, always.',
  },
  {
    icon: PackageCheck,
    title: 'Beautifully Packaged',
    desc: 'Premium gift boxes, satin ribbons, and branded tissue — ready to gift the moment it arrives.',
  },
  {
    icon: Clock,
    title: 'Express Delivery',
    desc: 'Need it urgently? We offer same-day and next-day delivery across major cities in India.',
  },
  {
    icon: Leaf,
    title: 'Eco-Conscious',
    desc: 'Sustainable packaging, responsibly sourced products, and plastic-free shipping.',
  },
  {
    icon: RefreshCw,
    title: 'Hassle-Free Returns',
    desc: 'Not quite right? Easy 7-day returns with no questions asked — your satisfaction guaranteed.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    desc: 'We partner only with artisans and brands who share our obsession with craft and quality.',
  },
];

export function WhyGokana() {
  return (
    <section className="section-py" style={{ background: 'var(--surface)' }}>
      <div className="container-gokana">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <ScrollReveal delay={0.1}>
            <p className="label-text mb-5" style={{ color: 'var(--accent)' }}>✦ Why GŌKANA</p>
          </ScrollReveal>
          <AnimatedHeading className="heading-lg mb-5" delay={0.15}>
            Gifting, elevated.
          </AnimatedHeading>
          <ScrollReveal delay={0.35}>
            <p className="font-sans text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
              We believe the best gifts deserve more than just beautiful wrapping. Here's what makes GŌKANA different.
            </p>
          </ScrollReveal>
        </div>

        {/* Reasons grid */}
        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          stagger={0.07}
          delay={0.2}
        >
          {reasons.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="group flex flex-col gap-4 p-7 rounded-2xl transition-all duration-300 cursor-default"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
              }}
              whileHover={{
                boxShadow: '0 8px 24px rgba(11,31,58,0.06)',
                y: -2,
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                style={{ background: 'var(--primary-soft)' }}
              >
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  style={{ color: 'var(--primary)' }}
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="font-serif text-xl font-light mb-2" style={{ color: 'var(--text-strong)' }}>
                  {title}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {desc}
                </p>
              </div>

              {/* Gold accent line on hover */}
              <div
                className="h-0.5 w-0 group-hover:w-8 transition-all duration-400 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
            </motion.div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
