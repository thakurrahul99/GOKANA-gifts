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
          <div className="absolute inset-0 bg-[#0B1F3A]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/60 via-[#0B1F3A]/20 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-20"
          style={{ y: textY, opacity }}
        >
          <div className="container-gokana">
            {/* Trust Badges Pill (Above the fold) */}
            <motion.div
              className="inline-flex flex-wrap items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#0B1F3A]/80 backdrop-blur-md border border-[#D4AF37]/30 text-white text-xs font-sans mb-6"
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
                className="font-serif text-[clamp(2.75rem,7vw,6.5rem)] font-light text-white leading-[1.05] tracking-tight"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                Gifts that become
                <span className="text-[#F5E9C8] italic"> unforgettable.</span>
              </motion.h1>
            </div>

            {/* Supporting Subheadline */}
            <motion.p
              className="font-sans text-base md:text-lg text-white/85 max-w-xl leading-relaxed mb-8"
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
                className="btn-accent"
              >
                ✦ Find the Perfect Gift
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop"
                className="btn-outline border-white text-white hover:bg-white/10 hover:border-white"
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
      <aside className="bg-[#FFFFFF] border-b border-[#E8DFD3] py-4 relative z-10" aria-label="Trust and Guarantees">
        <div className="container-gokana">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E7ECF3] flex items-center justify-center text-[#0B1F3A] flex-shrink-0">
                <Truck size={17} />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]">
                  Free Express Shipping
                </p>
                <p className="font-sans text-[11px] text-[#6B6B6B] hidden sm:block">
                  On all orders above ₹999
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F5E9C8] flex items-center justify-center text-[#0B1F3A] flex-shrink-0">
                <ShieldCheck size={17} />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]">
                  100% Secure Payment
                </p>
                <p className="font-sans text-[11px] text-[#6B6B6B] hidden sm:block">
                  Encrypted UPI, Cards & NetBanking
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F3D9D4] flex items-center justify-center text-[#0B1F3A] flex-shrink-0">
                <RotateCcw size={17} />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]">
                  Easy 7-Day Returns
                </p>
                <p className="font-sans text-[11px] text-[#6B6B6B] hidden sm:block">
                  No questions asked guarantee
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E7ECF3] flex items-center justify-center text-[#0B1F3A] flex-shrink-0">
                <Sparkles size={17} />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]">
                  Handcrafted Luxury
                </p>
                <p className="font-sans text-[11px] text-[#6B6B6B] hidden sm:block">
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
