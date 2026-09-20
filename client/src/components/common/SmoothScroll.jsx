import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * SmoothScroll component integrates the high-performance Lenis inertia scroll engine.
 * It provides fluid, luxury inertia scrolling across the entire store, handles route
 * transitions cleanly, and synchronizes with body modal locks.
 */
export function SmoothScroll() {
  const location = useLocation();

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.2,
      infinite: false,
    });

    window.lenis = lenis;

    let animId;
    function raf(time) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    // Watch document.body style changes to pause/resume Lenis when drawers or modals lock scroll
    const observer = new MutationObserver(() => {
      const isLocked =
        document.body.style.overflow === 'hidden' ||
        document.documentElement.classList.contains('overflow-hidden');
      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  // Handle route change without section hash: reset smoothly to top
  useEffect(() => {
    if (!location.hash) {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }
  }, [location.pathname, location.hash]);

  return null;
}
