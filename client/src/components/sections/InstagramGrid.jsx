import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { instagramPosts } from '../../data';

function InstagramPost({ post, className }) {
  return (
    <motion.a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`block relative overflow-hidden rounded-xl group ${className}`}
      style={{ background: 'var(--surface-alt)' }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={post.image}
        alt="GŌKANA Instagram post"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center transition-colors duration-500" style={{ background: 'rgba(11,31,58,0)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,31,58,0.4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(11,31,58,0)'; }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: '#FFFFFF' }}
        >
          <Link2 size={24} strokeWidth={1.5} />
          <span className="font-sans text-xs tracking-[0.15em] uppercase">♥ {post.likes}</span>
        </motion.div>
      </div>
    </motion.a>
  );
}

export function InstagramGrid() {
  const [p1, p2, p3, p4, p5, p6] = instagramPosts;

  return (
    <section className="section-py-sm overflow-hidden" style={{ background: 'var(--surface-alt)' }}>
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal delay={0.1}>
              <p className="label-text mb-4" style={{ color: 'var(--accent)' }}>✦ @gokana.in</p>
          </ScrollReveal>
          <AnimatedHeading className="heading-md" delay={0.15}>
            Moments from GŌKANA
          </AnimatedHeading>
        </div>

        {/* Asymmetric grid */}
        <ScrollReveal direction="scale" delay={0.2}>
          <div className="grid grid-cols-3 gap-3 md:gap-4" style={{ height: 'min(70vh, 600px)' }}>
            {/* Column 1 — tall */}
            <div className="flex flex-col gap-3 md:gap-4">
              <InstagramPost post={p1} className="flex-[2] min-h-0" />
              <InstagramPost post={p2} className="flex-1 min-h-0" />
            </div>
            {/* Column 2 — short top, tall bottom */}
            <div className="flex flex-col gap-3 md:gap-4">
              <InstagramPost post={p3} className="flex-1 min-h-0" />
              <InstagramPost post={p4} className="flex-[1.5] min-h-0" />
            </div>
            {/* Column 3 — tall single */}
            <div className="flex flex-col gap-3 md:gap-4">
              <InstagramPost post={p5} className="flex-[1.5] min-h-0" />
              <InstagramPost post={p6} className="flex-1 min-h-0" />
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.3} className="text-center mt-8">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:rounded"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; }}
          >
            <Link2 size={16} strokeWidth={1.5} />
            Follow us on Instagram
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
