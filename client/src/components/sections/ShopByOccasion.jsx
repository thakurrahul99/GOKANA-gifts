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
        className="block relative overflow-hidden aspect-occasion bg-beige"
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
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent transition-opacity duration-500" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-ivory/60 mb-1 transition-all duration-300 group-hover:text-gold/80">
            {occasion.emoji} {occasion.description}
          </p>
          <div className="flex items-end justify-between">
            <h3 className="font-serif text-xl font-light text-ivory leading-tight transition-all duration-300 group-hover:translate-y-[-2px]">
              {occasion.label}
            </h3>
            <motion.div
              className="w-8 h-8 border border-ivory/40 flex items-center justify-center text-ivory/70 transition-all duration-300 group-hover:border-gold group-hover:text-gold group-hover:bg-gold/10"
              whileHover={{ rotate: -45 }}
            >
              <ArrowRight size={14} />
            </motion.div>
          </div>
        </div>

        {/* Index number */}
        <div className="absolute top-4 right-4 font-sans text-[10px] tracking-[0.2em] text-ivory/30">
          {String(index + 1).padStart(2, '0')}
        </div>
      </Link>
    </motion.div>
  );
}

export function ShopByOccasion() {
  return (
    <section className="section-py bg-charcoal overflow-hidden">
      <div className="container-gokana">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text text-gold/70 mb-4">✦ Shop by Occasion</p>
            </ScrollReveal>
            <AnimatedHeading className="heading-lg text-ivory" delay={0.15}>
              Every moment<br />has a gift.
            </AnimatedHeading>
          </div>
          <ScrollReveal delay={0.3}>
            <Link to="/shop" className="btn-ghost text-ivory/60 hover:text-ivory whitespace-nowrap mb-1">
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
