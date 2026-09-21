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
    <section className="section-py bg-bg-alt text-ivory overflow-hidden border-b border-border" aria-labelledby="brand-philosophy-heading">
      <div className="container-gokana">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column — Philosophy Text */}
          <div className="order-2 lg:order-1">
            <ScrollReveal delay={0.1}>
              <p className="label-text text-accent mb-3">✦ The GŌKANA Philosophy</p>
            </ScrollReveal>

            <AnimatedHeading
              id="brand-philosophy-heading"
              className="heading-xl text-ivory mb-6 leading-[1.15]"
              delay={0.15}
            >
              Thoughtfully chosen.<br />
              <span className="italic text-accent font-light">Beautifully wrapped.</span><br />
              Meaningfully remembered.
            </AnimatedHeading>

            <ScrollReveal delay={0.25}>
              <Divider className="mb-6" />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="font-sans text-sm md:text-base text-[#D4CDC3] leading-relaxed mb-4 max-w-lg font-light">
                At GŌKANA, we believe a gift is never merely an object — it is a heartfelt sentiment wrapped in joyful anticipation, a tangible token of affection, gratitude, and lasting remembrance.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <p className="font-sans text-sm md:text-base text-muted leading-relaxed mb-8 max-w-lg font-light">
                We partner with master chocolatiers, ceramicists, and artisanal perfumers who refuse shortcuts. Every ribbon is hand-tied, every note hand-lettered, and every rigid box hand-checked.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <Link to="/about" className="btn-outline inline-flex items-center gap-2 !text-accent border-accent hover:bg-accent/10 hover:border-accent-light">
                Read Our Story
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>

            {/* Impact & Quality Metrics */}
            <ScrollReveal delay={0.6}>
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
                <div>
                  <p className="font-serif text-3xl font-light text-accent">50K+</p>
                  <p className="font-sans text-[11px] text-muted uppercase tracking-wider mt-1">Gifts Delivered</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-light text-accent">4.9★</p>
                  <p className="font-sans text-[11px] text-muted uppercase tracking-wider mt-1">Buyer Rating</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-light text-accent">100%</p>
                  <p className="font-sans text-[11px] text-muted uppercase tracking-wider mt-1">Artisan Made</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column — Imagery with Parallax & Gold Border */}
          <div ref={imageRef} className="order-1 lg:order-2 overflow-hidden rounded-[8px] border border-border-light shadow-[0_12px_40px_rgba(0,0,0,0.7)] aspect-square bg-bg">
            <motion.img
              src={brandStoryImg}
              alt="Artisan handcrafting GŌKANA luxury gift hamper"
              className="w-full h-full object-cover scale-105"
              style={{ y: imageY }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
