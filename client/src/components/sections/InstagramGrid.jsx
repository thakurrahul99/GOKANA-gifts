import { motion } from 'framer-motion';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { instagramPosts } from '../../data';

// Inline SVG — lucide-react dropped the Instagram icon in newer versions
const SvgInstagram = ({ size = 22, className = '' }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

function InstagramPost({ post, className }) {
  return (
    <motion.a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`block relative overflow-hidden rounded-xl bg-surface-alt border border-border group ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      aria-label="View GŌKANA moments on Instagram"
    >
      <img
        src={post.image}
        alt="GŌKANA luxury unboxing moment"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/45 transition-colors duration-400 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <SvgInstagram size={22} className="text-accent" />
          <span className="font-sans text-xs tracking-wider uppercase font-semibold">
            ♥ {post.likes}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export function InstagramGrid() {
  const [p1, p2, p3, p4, p5, p6] = instagramPosts;

  return (
    <section className="section-py-sm bg-white overflow-hidden" aria-labelledby="instagram-heading">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3">✦ Join Our Community</p>
          </ScrollReveal>
          <AnimatedHeading id="instagram-heading" className="heading-md text-primary mb-2" delay={0.15}>
            Moments from @gokana.in
          </AnimatedHeading>
          <p className="font-sans text-xs text-muted">
            Tag us to be featured in our gifting chronicles
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <ScrollReveal direction="scale" delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" style={{ height: 'min(65vh, 560px)' }}>
            <div className="flex flex-col gap-3 md:gap-4">
              <InstagramPost post={p1} className="flex-[2] min-h-0" />
              <InstagramPost post={p2} className="flex-1 min-h-0" />
            </div>
            <div className="flex flex-col gap-3 md:gap-4">
              <InstagramPost post={p3} className="flex-1 min-h-0" />
              <InstagramPost post={p4} className="flex-[2] min-h-0" />
            </div>
            <div className="hidden md:flex flex-col gap-3 md:gap-4">
              <InstagramPost post={p5} className="flex-[1.5] min-h-0" />
              <InstagramPost post={p6} className="flex-[1.5] min-h-0" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
