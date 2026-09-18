import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';
import { Divider } from '../ui';
import { occasions } from '../../data';

function OccasionCard({ occasion, index }) {
  return (
    <motion.div variants={staggerItem} className="group">
      <Link
        to={`/shop?occasion=${occasion.id}`}
        className="block relative overflow-hidden aspect-occasion rounded-xl"
        style={{ background: 'var(--surface-alt)' }}
        aria-label={`Shop ${occasion.label} gifts`}
      >
        {/* Image */}
        <img
          src={occasion.image}
          alt={occasion.label}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Base overlay */}
        <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(11,31,58,0.75) 0%, rgba(11,31,58,0.1) 60%, transparent 100%)' }} />

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'rgba(11,31,58,0.25)' }} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <p className="font-sans text-xs tracking-[0.2em] uppercase mb-1 transition-all duration-300" style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
          >
            {occasion.emoji} {occasion.description}
          </p>
          <div className="flex items-end justify-between">
            <h3 className="font-serif text-xl font-light leading-tight transition-all duration-300 group-hover:-translate-y-0.5" style={{ color: '#FFFFFF' }}>
              {occasion.label}
            </h3>
            <motion.div
              className="w-8 h-8 flex items-center justify-center transition-all duration-300 rounded-full"
              style={{ border: '1px solid rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.7)' }}
              whileHover={{ rotate: -45 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; }}
            >
              <ArrowRight size={14} />
            </motion.div>
          </div>
        </div>

        {/* Index number */}
        <div className="absolute top-4 right-4 font-sans text-[10px] tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </div>
      </Link>
    </motion.div>
  );
}

export function ShopByOccasion() {
  return (
    <section className="section-py overflow-hidden" style={{ background: 'var(--primary)' }}>
      <div className="container-gokana">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text mb-4" style={{ color: 'rgba(212,175,55,0.7)' }}>✦ Shop by Occasion</p>
            </ScrollReveal>
            <AnimatedHeading className="heading-lg" delay={0.15} style={{ color: '#FFFFFF' }}>
              Every moment<br />has a gift.
            </AnimatedHeading>
          </div>
          <ScrollReveal delay={0.3}>
            <Link to="/shop" className="flex items-center gap-2 font-sans text-sm font-medium tracking-[0.08em] uppercase mb-1 transition-colors duration-200 whitespace-nowrap focus-visible:outline-none" style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              View all occasions
              <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" stagger={0.07}>
          {occasions.map((occ, i) => (
            <OccasionCard key={occ.id} occasion={occ} index={i} />
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
