import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Star, Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { heroImg } from '../../data';

export function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight - 30, behavior: 'smooth' });
  };

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full min-h-[640px] h-[92vh] max-h-[960px] overflow-hidden bg-[#0B1F3A]"
        aria-label="Hero Introduction"
      >
        {/* Parallax Image */}
        <motion.div
          className="absolute inset-0 scale-105 origin-center"
          style={{ y: imgY }}
        >
          <img
            src={heroImg}
            alt="GŌKANA handcrafted luxury gift boxes and hampers"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-[#07172C]/48" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07172C] via-[#0B1F3A]/42 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07172C]/72 via-[#0B1F3A]/28 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#07172C]/35" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-24"
          style={{ y: textY, opacity }}
        >
          <div className="container-gokana">
            {/* Trust Badges Pill (Above the fold) */}
            <motion.div
              className="inline-flex flex-wrap items-center gap-3 px-4 py-2 rounded-full bg-[#07172C]/70 backdrop-blur-lg border border-[#D4AF37]/45 shadow-[0_6px_24px_rgba(0,0,0,0.2)] text-white text-xs font-sans mb-7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-1 text-[#D4AF37]">
                <Star size={13} className="fill-[#D4AF37]" />
                <span className="font-semibold text-white">4.9/5 Rating</span>
              </div>
              <span className="text-white/30">•</span>
              <span className="text-white/80">50,000+ Gifts Delivered with Love</span>
            </motion.div>

            {/* Main Headline */}
            <div className="overflow-hidden mb-5 max-w-4xl">
              <motion.h1
                className="font-serif text-[clamp(3rem,7.2vw,6.8rem)] font-light text-[#FFFDF8] leading-[0.98] tracking-[-0.02em] drop-shadow-[0_8px_24px_rgba(0,0,0,0.24)]"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                Gifts that become
                <span className="relative text-[#F5E9C8] italic font-normal whitespace-nowrap"> unforgettable.</span>
              </motion.h1>
            </div>

            {/* Supporting Subheadline */}
            <motion.p
              className="font-sans text-[15px] md:text-lg text-white/80 max-w-[590px] leading-[1.75] mb-9"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Artisan chocolates, hand-poured soy candles, and bespoke keepsakes. Hand-packed in luxury rigid boxes with complimentary handwritten calligraphy cards.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hero-cta-stack flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link
                to="/gift-finder"
                className="btn-accent shadow-[0_8px_28px_rgba(212,175,55,0.18)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.28)]"
              >
                ✦ Find the Perfect Gift
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop"
                className="btn-outline border-white/80 text-white hover:bg-white/10 hover:border-white shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
              >
                Explore Collection
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollDown}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 rounded p-1"
          aria-label="Scroll down to content"
        >
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} strokeWidth={2} />
          </motion.div>
        </button>
      </section>

      {/* ── Trust Strip Directly Below Hero (Section 4 CRO Requirement) ── */}
      <aside className="bg-[#0B1F3A] border-b border-[#1E3A5F] py-4 relative z-10" aria-label="Trust and Guarantees">
        <div className="container-gokana">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F3D9D4] flex items-center justify-center text-[#0B1F3A] flex-shrink-0">
                <Truck size={17} />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-white">
                  Free Express Shipping
                </p>
                <p className="font-sans text-[11px] text-white/65 hidden sm:block">
                  On all orders above ₹999
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F5E9C8] flex items-center justify-center text-[#0B1F3A] flex-shrink-0">
                <ShieldCheck size={17} />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-white">
                  100% Secure Payment
                </p>
                <p className="font-sans text-[11px] text-white/65 hidden sm:block">
                  Encrypted UPI, Cards & NetBanking
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F3D9D4] flex items-center justify-center text-[#0B1F3A] flex-shrink-0">
                <RotateCcw size={17} />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-white">
                  Easy 7-Day Returns
                </p>
                <p className="font-sans text-[11px] text-white/65 hidden sm:block">
                  No questions asked guarantee
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F3D9D4] flex items-center justify-center text-[#0B1F3A] flex-shrink-0">
                <Sparkles size={17} />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-white">
                  Handcrafted Luxury
                </p>
                <p className="font-sans text-[11px] text-white/65 hidden sm:block">
                  Signature rigid box packaging
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
