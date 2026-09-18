import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Star, Gift, Truck, Shield, Award } from 'lucide-react';
import { heroImg } from '../../data';

const trustStats = [
  { icon: Award, label: '50,000+ Gifts Delivered' },
  { icon: Star, label: '4.9★ Average Rating' },
  { icon: Truck, label: 'Free Shipping on ₹999+' },
  { icon: Gift, label: 'Handcrafted with Love' },
];

export function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full h-screen min-h-[600px] overflow-hidden"
        style={{ background: 'var(--primary)' }}
        aria-label="Hero — Premium Gifting"
      >
        {/* Parallax Image */}
        <motion.div
          className="absolute inset-0 scale-110 origin-center"
          style={{ y: imgY }}
        >
          <img
            src={heroImg}
            alt="GŌKANA premium gift collection — curated, handcrafted gifts"
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
          {/* Layered overlays for depth */}
          <div className="absolute inset-0" style={{ background: 'rgba(11,31,58,0.55)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,31,58,0.75) 0%, rgba(11,31,58,0.15) 55%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(11,31,58,0.45) 0%, transparent 60%)' }} />
        </motion.div>

        {/* Hero content */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-28"
          style={{ y: textY, opacity }}
        >
          <div className="container-gokana">
            {/* Pre-label */}
            <motion.p
              className="label-text mb-6"
              style={{ color: 'rgba(212,175,55,0.85)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              ✦ Curated Collections
            </motion.p>

            {/* Main heading */}
            <div className="overflow-hidden mb-6">
              <motion.h1
                className="font-serif font-light text-white leading-[1.05] tracking-tight max-w-4xl"
                style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                Gifts that become{' '}
                <span className="italic" style={{ color: 'var(--accent)' }}>memories.</span>
              </motion.h1>
            </div>

            {/* Supporting text */}
            <motion.p
              className="font-sans text-base md:text-lg max-w-md leading-relaxed mb-4"
              style={{ color: 'rgba(255,255,255,0.65)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Discover thoughtfully curated gifts for every moment worth celebrating.
            </motion.p>

            {/* Trust social proof near hero */}
            <motion.div
              className="flex items-center gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="flex -space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>
              <span className="font-sans text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                4.9 · Loved by 50,000+ happy customers
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <Link
                to="/shop"
                className="btn-accent"
              >
                Explore Collection
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/gift-finder"
                className="inline-flex items-center gap-3 px-8 py-4 font-sans text-sm font-semibold tracking-[0.08em] uppercase rounded-[10px] transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  color: '#FFFFFF',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                }}
              >
                <Gift size={16} />
                Find the Perfect Gift
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollDown}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-colors focus-visible:outline-none"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          aria-label="Scroll down to explore"
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >
          <span className="label-text" style={{ fontSize: '10px' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} strokeWidth={1.5} />
          </motion.div>
        </motion.button>

        {/* Side decoration */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 writing-vertical hidden lg:block"
          style={{ fontSize: '10px', fontFamily: 'var(--font-sans)', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)' }}
          aria-hidden="true"
        >
          01 / GŌKANA
        </div>
      </section>

      {/* Trust Strip — below hero */}
      <div style={{ background: 'var(--primary-2)' }}>
        <div className="container-gokana">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {trustStats.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2.5 py-4 px-3">
                <Icon size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span className="font-sans text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
