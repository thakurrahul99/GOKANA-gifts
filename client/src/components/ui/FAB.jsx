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
          className="fixed bottom-6 right-5 z-40 md:hidden"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/gift-finder"
            className="flex items-center gap-2.5 py-3.5 pl-4 pr-5 rounded-full shadow-gold focus-visible:outline-none focus-visible:ring-2 font-sans text-sm font-semibold"
            style={{
              background: 'var(--accent)',
              color: '#121212',
              '--tw-ring-color': 'var(--primary)',
            }}
            aria-label="Open Gift Finder"
          >
            <Gift size={18} strokeWidth={1.5} />
            Gift Finder
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
