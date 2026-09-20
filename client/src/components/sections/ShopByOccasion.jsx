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
        className="block relative overflow-hidden aspect-occasion rounded-xl bg-primary border border-white/10"
        aria-label={`Shop ${occasion.label} gifts`}
      >
        {/* Image */}
        <img
          src={occasion.image}
          alt={occasion.label}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Base Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent transition-opacity duration-500" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-white/70 mb-1 transition-colors duration-300 group-hover:text-accent">
            {occasion.emoji} {occasion.description}
          </p>
          <div className="flex items-end justify-between">
            <h3 className="font-serif text-2xl font-light text-white leading-tight transition-transform duration-300 group-hover:translate-y-[-2px]">
              {occasion.label}
            </h3>
            <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-text">
              <ArrowRight size={15} />
            </div>
          </div>
        </div>

        {/* Index number */}
        <div className="absolute top-4 right-4 font-sans text-[10px] tracking-[0.2em] text-white/30">
          {String(index + 1).padStart(2, '0')}
        </div>
      </Link>
    </motion.div>
  );
}

export function ShopByOccasion() {
  return (
    <section className="section-py bg-primary text-white overflow-hidden" aria-labelledby="occasions-heading">
      <div className="container-gokana">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text text-accent mb-3">✦ Explore By Moment</p>
            </ScrollReveal>
            <AnimatedHeading id="occasions-heading" className="heading-lg text-white mb-2" delay={0.15}>
              Shop by Occasion
            </AnimatedHeading>
            <ScrollReveal delay={0.25}>
              <p className="font-sans text-sm text-charcoal-200 max-w-md">
                From grand milestone anniversaries to spontaneous surprises, find expressions that fit the emotion.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <Link
              to="/shop"
              className="btn-primary inline-flex items-center gap-2 text-xs py-3 px-6"
            >
              View All Occasions
              <ArrowRight size={15} />
            </Link>
          </ScrollReveal>
        </div>

        {/* Occasions Grid */}
        <StaggerReveal
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          stagger={0.06}
          delay={0.2}
        >
          {occasions.slice(0, 8).map((occasion, i) => (
            <OccasionCard key={occasion.id} occasion={occasion} index={i} />
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
