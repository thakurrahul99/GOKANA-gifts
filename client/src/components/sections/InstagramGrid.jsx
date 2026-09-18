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
      className={`block relative overflow-hidden bg-beige group ${className}`}
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
      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-500 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-2 text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-400"
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
    <section className="section-py-sm bg-beige overflow-hidden">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-gold mb-4">✦ @gokana.in</p>
          </ScrollReveal>
          <AnimatedHeading className="heading-md text-charcoal" delay={0.15}>
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
            className="inline-flex items-center gap-2 font-sans text-sm text-charcoal/50 hover:text-charcoal transition-colors"
          >
            <Link2 size={16} strokeWidth={1.5} />
            Follow us on Instagram
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
