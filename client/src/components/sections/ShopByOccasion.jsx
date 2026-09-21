import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';
import { occasions } from '../../data';

function OccasionCard({ occasion, index }) {
  return (
    <motion.div variants={staggerItem} className="group">
      <Link
        to={`/shop?occasion=${occasion.id}`}
        className="block relative overflow-hidden aspect-[4/5] rounded-[6px] bg-bg-alt border border-[rgba(197,160,89,0.2)] hover:border-[rgba(197,160,89,0.5)] transition-colors duration-300"
        aria-label={`Shop ${occasion.label} gifts`}
      >
        {/* Image with subtle hover zoom */}
        <img
          src={occasion.image}
          alt={occasion.label}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-transparent transition-opacity duration-500" />
        <div className="absolute inset-0 bg-bg/20 group-hover:bg-bg/10 transition-colors duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-accent font-semibold mb-1.5">
            {occasion.emoji} {occasion.description}
          </p>
          <div className="flex items-end justify-between gap-2">
            <h3 className="font-serif text-2xl md:text-3xl font-light text-ivory leading-tight group-hover:text-accent transition-colors duration-300">
              {occasion.label}
            </h3>
            <div className="w-10 h-10 rounded-full border border-[rgba(197,160,89,0.35)] bg-bg/70 backdrop-blur-xs flex items-center justify-center text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-bg group-hover:border-accent flex-shrink-0">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>

        {/* Editorial Index Number */}
        <div className="absolute top-4 right-4 font-serif text-xs tracking-[0.2em] text-accent/50 font-light">
          {String(index + 1).padStart(2, '0')}
        </div>
      </Link>
    </motion.div>
  );
}

export function ShopByOccasion() {
  const coreOccasions = occasions.slice(0, 6);

  return (
    <section className="section-py bg-bg text-ivory overflow-hidden border-b border-[rgba(197,160,89,0.15)]" aria-labelledby="occasions-heading">
      <div className="container-gokana">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text text-accent mb-3">✦ Curated For Every Milestone</p>
            </ScrollReveal>
            <AnimatedHeading id="occasions-heading" className="heading-lg text-ivory mb-2" delay={0.15}>
              Shop by Occasion
            </AnimatedHeading>
            <ScrollReveal delay={0.25}>
              <p className="font-sans text-sm text-muted max-w-lg leading-relaxed">
                From milestone celebrations to heartfelt tokens of gratitude, explore curations tailored to the sentiment of the moment.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <Link
              to="/shop"
              className="btn-outline inline-flex items-center gap-2 text-xs py-3 px-6 !text-accent border-accent hover:bg-accent/10 hover:border-accent-light"
            >
              View All Occasions
              <ArrowRight size={15} />
            </Link>
          </ScrollReveal>
        </div>

        {/* 6 Core Occasion Cards Grid */}
        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          stagger={0.07}
          delay={0.2}
        >
          {coreOccasions.map((occasion, i) => (
            <OccasionCard key={occasion.id} occasion={occasion} index={i} />
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
