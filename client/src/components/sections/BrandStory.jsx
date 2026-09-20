import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { Divider } from '../ui';
import { brandStoryImg } from '../../data';

export function BrandStory() {
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section className="section-py bg-white overflow-hidden" aria-labelledby="brand-philosophy-heading">
      <div className="container-gokana">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column — Philosophy Text */}
          <div className="order-2 lg:order-1">
            <ScrollReveal delay={0.1}>
              <p className="label-text text-accent mb-3">✦ The GŌKANA Philosophy</p>
            </ScrollReveal>

            <AnimatedHeading
              id="brand-philosophy-heading"
              className="heading-xl text-primary mb-6 leading-tight"
              delay={0.15}
            >
              Made for moments<br />
              <span className="italic text-accent-dark">that truly matter.</span>
            </AnimatedHeading>

            <ScrollReveal delay={0.25}>
              <Divider className="mb-6" />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="font-sans text-base text-muted leading-relaxed mb-4 max-w-lg">
                At GŌKANA, we believe a gift is never just an object — it is a sentiment wrapped in anticipation, a tangible token of love, gratitude, and remembrance.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <p className="font-sans text-base text-muted leading-relaxed mb-8 max-w-lg">
                We partner with master chocolatiers, ceramicists, and perfumers who refuse shortcuts. Every ribbon is hand-tied, every note hand-lettered, and every box hand-checked.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <Link to="/about" className="btn-secondary inline-flex items-center gap-2">
                Read Our Story
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>

            {/* Impact & Quality Metrics */}
            <ScrollReveal delay={0.6}>
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
                <div>
                  <p className="font-serif text-3xl font-light text-primary">50K+</p>
                  <p className="font-sans text-xs text-muted uppercase tracking-wider mt-1">Gifts Delivered</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-light text-primary">4.9★</p>
                  <p className="font-sans text-xs text-muted uppercase tracking-wider mt-1">Buyer Rating</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-light text-primary">100%</p>
                  <p className="font-sans text-xs text-muted uppercase tracking-wider mt-1">Artisan Made</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column — Imagery with Parallax */}
          <div ref={imageRef} className="order-1 lg:order-2 overflow-hidden rounded-2xl border border-border shadow-lg aspect-square">
            <motion.img
              src={brandStoryImg}
              alt="Artisan handcrafting GŌKANA luxury gift hamper"
              className="w-full h-full object-cover scale-110"
              style={{ y: imageY }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
