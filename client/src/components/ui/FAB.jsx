import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function FAB() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-40 md:hidden"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/gift-finder"
            className="flex items-center gap-2 py-3 pl-3.5 pr-4.5 rounded-full shadow-[0_6px_20px_rgba(197,160,89,0.35)] focus-visible:outline-none focus-visible:ring-2 font-sans text-xs font-semibold uppercase tracking-wider text-bg bg-accent hover:bg-accent-light transition-all"
            aria-label="Open Gift Finder"
          >
            <Gift size={16} strokeWidth={1.8} className="text-bg" />
            Gift Finder
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
