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
  if (!post) return null;
  return (
    <motion.a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`block relative overflow-hidden rounded-xl bg-bg-alt border border-[rgba(197,160,89,0.2)] hover:border-accent/50 shadow-md group ${className}`}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.3 }}
      aria-label="View GŌKANA moments on Instagram"
    >
      <img
        src={post.image}
        alt="GŌKANA luxury unboxing moment"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        loading="lazy"
        decoding="async"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-ivory">
          <div className="w-11 h-11 rounded-full bg-surface-alt border border-accent/40 flex items-center justify-center text-accent shadow-lg group-hover:scale-110 transition-transform">
            <SvgInstagram size={22} className="text-accent" />
          </div>
          <span className="font-sans text-xs tracking-wider uppercase font-semibold text-accent">
            ♥ {post.likes}
          </span>
          <span className="font-sans text-[11px] text-muted tracking-wider uppercase">
            View on Instagram
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export function InstagramGrid() {
  const posts = Array.isArray(instagramPosts) && instagramPosts.length >= 6 
    ? instagramPosts 
    : [
        { id: 'i1', image: '', likes: '2.4k' },
        { id: 'i2', image: '', likes: '1.8k' },
        { id: 'i3', image: '', likes: '3.1k' },
        { id: 'i4', image: '', likes: '4.2k' },
        { id: 'i5', image: '', likes: '2.9k' },
        { id: 'i6', image: '', likes: '1.6k' },
      ];
  const [p1, p2, p3, p4, p5, p6] = posts;

  return (
    <section className="section-py bg-bg overflow-hidden border-b border-[rgba(197,160,89,0.15)]" aria-labelledby="instagram-heading">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3">✦ Join Our Community</p>
          </ScrollReveal>
          <AnimatedHeading id="instagram-heading" className="heading-md text-ivory mb-2" delay={0.15}>
            Moments from @gokana.in
          </AnimatedHeading>
          <ScrollReveal delay={0.25}>
            <p className="font-sans text-xs text-muted">
              Tag us to be featured on our Instagram page
            </p>
          </ScrollReveal>
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

        {/* Follow CTA */}
        <ScrollReveal delay={0.3} className="text-center mt-10">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2.5 text-xs py-3.5 px-8 !text-accent border-accent hover:bg-accent/10 hover:border-accent-light"
          >
            <SvgInstagram size={17} className="text-accent" />
            Follow @gokana.in on Instagram
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
