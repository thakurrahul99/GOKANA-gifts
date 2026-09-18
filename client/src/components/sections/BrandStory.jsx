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
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section className="section-py overflow-hidden" style={{ background: 'var(--surface-alt)' }}>
      <div className="container-gokana">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Text */}
          <div className="order-2 lg:order-1">
            <ScrollReveal delay={0.1}>
              <p className="label-text mb-6" style={{ color: 'var(--accent)' }}>✦ Our Philosophy</p>
            </ScrollReveal>

            <AnimatedHeading
              className="heading-xl mb-8 leading-tight"
              delay={0.15}
            >
              Made for moments<br />
              <span className="italic" style={{ color: 'var(--accent)' }}>that matter.</span>
            </AnimatedHeading>

            <ScrollReveal delay={0.3}>
              <Divider className="mb-8" />
            </ScrollReveal>

            <ScrollReveal delay={0.35}>
              <p className="font-sans text-base leading-relaxed mb-6 max-w-lg" style={{ color: 'var(--muted)' }}>
                At GŌKANA, we believe a gift is never just an object — it's a feeling wrapped in paper, a memory sealed with ribbon. Every product in our collection is selected with one question in mind: will this make someone feel truly seen and celebrated?
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.45}>
              <p className="font-sans text-base leading-relaxed mb-10 max-w-lg" style={{ color: 'var(--muted)' }}>
                We work with artisans, small producers and brands who share our obsession with quality, craft and care. Because the people you love deserve more than an afterthought.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.55}>
              <Link to="/about" className="btn-ghost">
                Read Our Story
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={0.65}>
              <div className="grid grid-cols-3 gap-8 mt-14 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
                {[
                  { num: '50,000+', label: 'Gifts Delivered' },
                  { num: '4.9★', label: 'Average Rating' },
                  { num: '100%', label: 'Premium Curated' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-3xl font-light mb-1" style={{ color: 'var(--primary)' }}>{stat.num}</p>
                    <p className="font-sans text-xs tracking-wide" style={{ color: 'var(--muted)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right — Image with parallax */}
          <div className="order-1 lg:order-2 relative" ref={imageRef}>
            <div className="relative overflow-hidden aspect-[4/5] max-w-lg mx-auto lg:mx-0">
              <motion.img
                src={brandStoryImg}
                alt="GŌKANA gift wrapping process"
                className="w-full h-full object-cover"
                style={{ y: imageY, scale: 1.1 }}
              />
              {/* Decorative frame */}
              <div className="absolute -inset-3 pointer-events-none -z-10" style={{ border: '1px solid rgba(212,175,55,0.2)' }} />
            </div>

            {/* Floating quote card */}
            <motion.div
              className="absolute -bottom-6 -left-6 lg:-left-12 p-6 max-w-[200px] shadow-premium-xl hidden md:block rounded-xl"
              style={{ background: 'var(--primary)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p className="font-serif text-xl font-light italic mb-3" style={{ color: '#FFFFFF' }}>"Every gift tells a story."</p>
              <p className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>GŌKANA</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
