import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * IntroReveal — cinematic full-screen brand entrance animation.
 * Fires once per session, then fades out and is removed.
 */
export function IntroReveal({ onComplete }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out' | 'done'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('out'), 2800);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center"
          animate={phase === 'out' ? { opacity: 0 } : { opacity: 1 }}
          transition={phase === 'out' ? { duration: 1.2, ease: 'easeInOut' } : { duration: 0 }}
        >
          {/* Subtle texture lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(212,175,55,0.4) 40px, rgba(212,175,55,0.4) 41px)',
            }}
          />

          {/* Top decorative line */}
          <motion.div
            className="absolute top-16 left-1/2 -translate-x-1/2 h-px bg-accent/40"
            initial={{ width: 0 }}
            animate={phase !== 'in' ? { width: '60px' } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Main content */}
          <div className="text-center relative">
            {/* Pre-label */}
            <motion.p
              className="font-sans text-[10px] tracking-[0.4em] uppercase text-accent/70 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={phase !== 'in' ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Premium Gifting
            </motion.p>

            {/* GŌKANA wordmark */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-serif text-[clamp(4rem,12vw,9rem)] font-light tracking-[0.25em] uppercase text-white leading-none"
                initial={{ y: '110%' }}
                animate={phase !== 'in' ? { y: '0%' } : {}}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                GŌKANA
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p
              className="font-serif text-lg md:text-xl font-light text-charcoal-200 tracking-[0.05em] mt-6 italic"
              initial={{ opacity: 0 }}
              animate={phase !== 'in' ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.9 }}
            >
              Thoughtfully chosen. Beautifully gifted.
            </motion.p>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 h-px bg-accent/40"
            initial={{ width: 0 }}
            animate={phase !== 'in' ? { width: '60px' } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Corner ornaments */}
          <div className="absolute top-8 left-8 w-8 h-8">
            <motion.div
              className="absolute top-0 left-0 w-full h-px bg-accent/30"
              initial={{ scaleX: 0 }}
              animate={phase !== 'in' ? { scaleX: 1 } : {}}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            <motion.div
              className="absolute top-0 left-0 h-full w-px bg-accent/30"
              initial={{ scaleY: 0 }}
              animate={phase !== 'in' ? { scaleY: 1 } : {}}
              style={{ transformOrigin: 'top' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
          <div className="absolute top-8 right-8 w-8 h-8">
            <motion.div
              className="absolute top-0 right-0 w-full h-px bg-accent/30"
              initial={{ scaleX: 0 }}
              animate={phase !== 'in' ? { scaleX: 1 } : {}}
              style={{ transformOrigin: 'right' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            <motion.div
              className="absolute top-0 right-0 h-full w-px bg-accent/30"
              initial={{ scaleY: 0 }}
              animate={phase !== 'in' ? { scaleY: 1 } : {}}
              style={{ transformOrigin: 'top' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
          <div className="absolute bottom-8 left-8 w-8 h-8">
            <motion.div
              className="absolute bottom-0 left-0 w-full h-px bg-accent/30"
              initial={{ scaleX: 0 }}
              animate={phase !== 'in' ? { scaleX: 1 } : {}}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-full w-px bg-accent/30"
              initial={{ scaleY: 0 }}
              animate={phase !== 'in' ? { scaleY: 1 } : {}}
              style={{ transformOrigin: 'bottom' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
          <div className="absolute bottom-8 right-8 w-8 h-8">
            <motion.div
              className="absolute bottom-0 right-0 w-full h-px bg-accent/30"
              initial={{ scaleX: 0 }}
              animate={phase !== 'in' ? { scaleX: 1 } : {}}
              style={{ transformOrigin: 'right' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-full w-px bg-accent/30"
              initial={{ scaleY: 0 }}
              animate={phase !== 'in' ? { scaleY: 1 } : {}}
              style={{ transformOrigin: 'bottom' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
