import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Award, Gift, Sparkles, Truck } from 'lucide-react';
import { heroLuxuryImg, heroMobileImg } from '../../data';

export function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollDown = () => {
    if (window.lenis) {
      window.lenis.scrollTo(window.innerHeight - 30, { duration: 1.2 });
    } else {
      window.scrollTo({ top: window.innerHeight - 30, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full min-h-[720px] h-screen max-h-[1050px] overflow-hidden bg-bg"
        aria-label="Hero Introduction"
      >
        <motion.div
          className="absolute inset-0 scale-105 origin-center"
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#111111]/80 md:via-[#111111]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#0B0B0B]/60" />
          <div className="absolute inset-0 bg-bg/20" />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex flex-col justify-center pt-16 sm:pt-20 md:pt-16 pb-14 sm:pb-16 md:pb-20"
          style={{ y: textY, opacity }}
        >
          <div className="w-full px-5 sm:px-8 md:px-12 lg:px-0 lg:pl-[8vw]">
            <div className="w-full max-w-[650px] text-left flex flex-col items-start">
              <motion.div
                className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-bg-alt/85 backdrop-blur-md border border-border shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-ivory text-[11px] sm:text-xs font-sans mb-4 sm:mb-6"
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

              <div className="overflow-hidden mb-3 sm:mb-4 w-full">
                <motion.h1
                  className="font-serif text-[clamp(2.1rem,6.2vw,5.6rem)] font-light text-ivory leading-[1.05] sm:leading-[1.03] tracking-[-0.015em] drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-left"
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block text-ivory">Gifts that become</span>
                  <span className="block text-accent italic font-light">unforgettable.</span>
                </motion.h1>
              </div>

              <motion.p
                className="font-sans text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.24em] uppercase text-accent mb-3 sm:mb-3.5 text-left"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                LUXURY HANDCRAFTED GIFTS &nbsp;|&nbsp; PERSONALISED WITH CARE
              </motion.p>

              <motion.p
                className="font-sans text-[13.5px] sm:text-[14px] md:text-[16px] text-muted leading-[1.65] sm:leading-[1.8] max-w-[580px] mb-6 sm:mb-8 font-light text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 }}
              >
                Artisan chocolates, hand-poured soy candles, and personalised keepsakes. Hand-packed in luxury gift boxes with complimentary handwritten calligraphy cards.
              </motion.p>

              <motion.div
                className="hero-cta-stack flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 sm:gap-3.5 w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.65 }}
              >
                <Link
                  to="/shop"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-xs py-3.5 px-7 rounded-[4px] uppercase tracking-[0.14em] font-semibold"
                >
                  EXPLORE COLLECTION →
                </Link>

                <Link
                  to="/gift-finder"
                  className="btn-outline inline-flex items-center justify-center gap-2 text-xs py-3.5 px-6 rounded-[4px] uppercase tracking-[0.14em] font-semibold !text-accent border-accent hover:bg-accent/10 hover:border-accent-light"
                >
                  🎁 FIND THE PERFECT GIFT →
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <button
          onClick={scrollDown}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden xs:flex flex-col items-center gap-1 text-ivory/60 hover:text-accent transition-colors focus-visible:outline-none rounded p-1 cursor-pointer"
          aria-label="Scroll down to content"
        >
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-accent font-medium">SCROLL ↓</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={15} strokeWidth={1.8} className="text-accent" />
          </motion.div>
        </button>
      </section>

      <aside
        className="bg-bg-alt border-y border-border py-5 sm:py-6 relative z-10 -mt-px shadow-lg"
        aria-label="Trust and Guarantees"
      >
        <div className="container-gokana">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-border/50">
            <div className="flex items-center gap-2.5 sm:gap-3.5 lg:px-6 first:lg:pl-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface-alt flex items-center justify-center text-accent flex-shrink-0">
                <Award size={18} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-ivory truncate">
                  PREMIUM QUALITY
                </p>
                <p className="font-sans text-[11px] sm:text-xs text-muted mt-0.5 truncate">
                  Finest ingredients
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3.5 lg:px-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface-alt flex items-center justify-center text-accent flex-shrink-0">
                <Gift size={18} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-ivory truncate">
                  BEAUTIFULLY PACKED
                </p>
                <p className="font-sans text-[11px] sm:text-xs text-muted mt-0.5 truncate">
                  Ready to gift
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40 lg:border-0 lg:px-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface-alt flex items-center justify-center text-accent flex-shrink-0">
                <Sparkles size={18} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-ivory truncate">
                  PERSONALISATION
                </p>
                <p className="font-sans text-[11px] sm:text-xs text-muted mt-0.5 truncate">
                  Truly yours
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40 lg:border-0 lg:px-6 last:lg:pr-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface-alt flex items-center justify-center text-accent flex-shrink-0">
                <Truck size={18} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-ivory truncate">
                  FAST & RELIABLE
                </p>
                <p className="font-sans text-[11px] sm:text-xs text-muted mt-0.5 truncate">
                  Pan India delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
