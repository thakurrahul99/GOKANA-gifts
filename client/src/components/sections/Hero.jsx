import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { heroImg } from '../../data';

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
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-charcoal"
      aria-label="Hero"
    >
      {/* Parallax Image */}
      <motion.div
        className="absolute inset-0 scale-110 origin-center"
        style={{ y: imgY }}
      >
        <img
          src={heroImg}
          alt="GŌKANA premium gift collection"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-28"
        style={{ y: textY, opacity }}
      >
        <div className="container-gokana">
          {/* Pre-label */}
          <motion.p
            className="label-text text-gold/80 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            ✦ Curated Collections
          </motion.p>

          {/* Main heading */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              className="font-serif text-[clamp(3rem,8vw,7rem)] font-light text-ivory leading-[1.05] tracking-tight max-w-4xl"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Gifts that become
              <span className="text-champagne italic"> memories.</span>
            </motion.h1>
          </div>

          {/* Supporting text */}
          <motion.p
            className="font-sans text-base md:text-lg text-ivory/65 max-w-md leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Discover thoughtfully curated gifts for every moment worth celebrating.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-ivory text-charcoal font-sans text-sm font-medium tracking-[0.1em] uppercase transition-all duration-400 hover:bg-champagne hover:gap-4 active:scale-[0.98]"
            >
              Explore Collection
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/gift-finder"
              className="inline-flex items-center gap-3 px-8 py-4 border border-ivory/40 text-ivory font-sans text-sm font-medium tracking-[0.1em] uppercase transition-all duration-400 hover:bg-ivory/10 hover:border-ivory/80 hover:gap-4"
            >
              Find the Perfect Gift
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/40 hover:text-ivory/70 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        aria-label="Scroll down"
      >
        <span className="label-text text-[10px]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} strokeWidth={1.5} />
        </motion.div>
      </motion.button>

      {/* Side number */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 writing-vertical text-[10px] font-sans tracking-[0.25em] text-ivory/25 hidden lg:block">
        01 / GŌKANA
      </div>
    </section>
  );
}
