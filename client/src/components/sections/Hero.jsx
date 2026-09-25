import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Gift, Sparkles, Truck } from 'lucide-react';
import { heroLuxuryImg, heroMobileImg } from '../../data';

export function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[640px] sm:min-h-[700px] max-h-[1050px] overflow-hidden bg-bg flex flex-col justify-between"
      aria-label="Hero Introduction"
    >
      {/* Background Image & Parallax with Responsive Composition */}
      <motion.div
        className="absolute inset-0 scale-105 origin-center pointer-events-none"
        style={{ y: imgY }}
      >
        <picture className="w-full h-full block">
          <source media="(max-width: 767px)" srcSet={heroMobileImg} />
          <img
            src={heroLuxuryImg}
            alt="GŌKANA luxury handcrafted gift boxes, chocolates, and candles"
            className="w-full h-full object-cover object-bottom md:object-center"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#111111]/85 md:via-[#111111]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#0B0B0B]/60" />
        <div className="absolute inset-0 bg-bg/20" />
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        className="relative z-10 w-full flex-1 flex flex-col justify-center pt-20 sm:pt-24 md:pt-24 lg:pt-28 pb-4 sm:pb-6"
        style={{ y: textY, opacity }}
      >
        <div className="w-full px-5 sm:px-8 md:px-12 lg:px-0 lg:pl-[8vw]">
          <div className="w-full max-w-[640px] text-left flex flex-col items-start">
            {/* Promise Pill */}
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-bg-alt/85 backdrop-blur-md border border-border shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-ivory text-[10.5px] sm:text-xs font-sans mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-1.5 text-accent flex-shrink-0">
                <Sparkles size={12} className="text-accent" />
                <span className="font-semibold text-ivory">The GŌKANA Promise</span>
              </div>
              <span className="text-accent/40">•</span>
              <span className="text-ivory/90 tracking-wide truncate">Handcrafted Luxury Gift Hampers</span>
            </motion.div>

            {/* Main Headline */}
            <div className="overflow-hidden mb-2 sm:mb-3 w-full">
              <motion.h1
                className="font-serif text-[clamp(2rem,5.4vw,5.2rem)] font-light text-ivory leading-[1.06] sm:leading-[1.03] tracking-[-0.015em] drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-left"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="block text-ivory">Gifts that become</span>
                <span className="block text-accent italic font-light">unforgettable.</span>
              </motion.h1>
            </div>

            {/* Sub-label */}
            <motion.p
              className="font-sans text-[9.5px] sm:text-[10.5px] md:text-xs font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-accent mb-2.5 sm:mb-3 text-left"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              LUXURY HANDCRAFTED GIFTS &nbsp;|&nbsp; PERSONALISED WITH CARE
            </motion.p>

            {/* Description */}
            <motion.p
              className="font-sans text-[13px] sm:text-[14px] md:text-[15.5px] text-muted leading-[1.6] sm:leading-[1.75] max-w-[560px] mb-5 sm:mb-7 font-light text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              Artisan chocolates, hand-poured soy candles, and personalised keepsakes. Hand-packed in luxury gift boxes with complimentary handwritten note cards.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="hero-cta-stack flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2.5 sm:gap-3.5 w-full sm:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
            >
              <Link
                to="/shop"
                className="btn-primary inline-flex items-center justify-center gap-2 text-xs py-3 sm:py-3.5 px-6 sm:px-7 rounded-[4px] uppercase tracking-[0.14em] font-semibold"
              >
                EXPLORE COLLECTION →
              </Link>

              <Link
                to="/gift-finder"
                className="btn-outline inline-flex items-center justify-center gap-2 text-xs py-3 sm:py-3.5 px-5 sm:px-6 rounded-[4px] uppercase tracking-[0.14em] font-semibold !text-accent border-accent hover:bg-accent/10 hover:border-accent-light"
              >
                🎁 FIND THE PERFECT GIFT →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Integrated Signature Trust Layer — Centered and fading smoothly at left and right edges */}
      <div
        className="relative z-10 w-full py-3 sm:py-3.5 md:py-4 overflow-hidden"
        aria-label="Trust and Guarantees"
      >
        {/* Soft centered backdrop with horizontal gradient fade to transparent on both sides */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#111111]/75 to-transparent pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        />

        {/* Soft hairline divider fading to transparent at both ends */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-[340px] xs:max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto px-3 xs:px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2.5 gap-x-3 sm:gap-x-5 md:gap-0 md:divide-x divide-white/[0.06]">
            {/* 1. Premium Quality */}
            <div className="flex items-center gap-2 sm:gap-2.5 md:px-4 lg:px-6 first:md:pl-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-accent flex-shrink-0">
                <Award size={13} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.06em] sm:tracking-[0.1em] text-ivory/95 leading-tight">
                  PREMIUM QUALITY
                </p>
                <p className="font-sans text-[9px] sm:text-[10px] text-muted-2 leading-tight mt-0.5">
                  Finest ingredients
                </p>
              </div>
            </div>

            {/* 2. Luxury Boxes */}
            <div className="flex items-center gap-2 sm:gap-2.5 md:px-4 lg:px-6">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-accent flex-shrink-0">
                <Gift size={13} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.06em] sm:tracking-[0.1em] text-ivory/95 leading-tight">
                  LUXURY BOXES
                </p>
                <p className="font-sans text-[9px] sm:text-[10px] text-muted-2 leading-tight mt-0.5">
                  Ready to gift
                </p>
              </div>
            </div>

            {/* 3. Custom Touch */}
            <div className="flex items-center gap-2 sm:gap-2.5 md:px-4 lg:px-6">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-accent flex-shrink-0">
                <Sparkles size={13} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.06em] sm:tracking-[0.1em] text-ivory/95 leading-tight">
                  CUSTOM TOUCH
                </p>
                <p className="font-sans text-[9px] sm:text-[10px] text-muted-2 leading-tight mt-0.5">
                  Truly personal
                </p>
              </div>
            </div>

            {/* 4. Safe Delivery */}
            <div className="flex items-center gap-2 sm:gap-2.5 md:px-4 lg:px-6 last:md:pr-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-accent flex-shrink-0">
                <Truck size={13} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.06em] sm:tracking-[0.1em] text-ivory/95 leading-tight">
                  SAFE DELIVERY
                </p>
                <p className="font-sans text-[9px] sm:text-[10px] text-muted-2 leading-tight mt-0.5">
                  Pan-India reach
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
