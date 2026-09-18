import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import clsx from 'clsx';

/**
 * ScrollReveal — wraps children in a Framer Motion div that animates when scrolled into view.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up', // 'up' | 'left' | 'right' | 'scale' | 'fade'
  duration = 0.8,
  once = true,
  threshold = 0.15,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount: threshold });
  const controls = useAnimation();

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : 0,
      x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
      scale: direction === 'scale' ? 0.96 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  useEffect(() => {
    if (inView) controls.start('visible');
    else if (!once) controls.start('hidden');
  }, [inView, controls, once]);

  return (
    <motion.div
      ref={ref}
      className={clsx(className)}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerReveal — wraps children in a staggered animation container.
 */
export function StaggerReveal({ children, className, stagger = 0.1, delay = 0, threshold = 0.1 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={clsx(className)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AnimatedHeading({ children, className, as: Tag = 'h2', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Tag ref={ref} className={clsx('overflow-hidden', className)}>
      <motion.span
        className="block"
        initial={{ y: '110%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
