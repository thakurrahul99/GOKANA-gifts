import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { BUSINESS_INFO } from '../../data/business';

const SvgInstagram = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const SvgYouTube = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const SvgFacebook = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export function InstagramGrid() {
  return (
    <section className="section-py bg-bg overflow-hidden border-b border-border" aria-labelledby="instagram-heading">
      <div className="container-gokana">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3 flex items-center justify-center gap-2">
              <Sparkles size={13} />
              Join Our Community
            </p>
          </ScrollReveal>
          <AnimatedHeading id="instagram-heading" className="heading-lg text-ivory mb-3" delay={0.15}>
            Follow <span className="italic text-accent font-light">{BUSINESS_INFO.socials.instagram.handle}</span>
          </AnimatedHeading>
          <ScrollReveal delay={0.25}>
            <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed font-light">
              Explore our latest gift curations, artisanal packaging, and behind-the-scenes moments from Mathura, Uttar Pradesh.
            </p>
          </ScrollReveal>
        </div>

        {/* Tasteful Follow CTA Showcase Card */}
        <ScrollReveal delay={0.2} direction="scale">
          <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-2xl bg-bg-alt border border-border shadow-2xl relative overflow-hidden text-center">
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(197,160,89,0.2) 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent mx-auto shadow-lg">
                <SvgInstagram size={28} className="text-accent" />
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light mb-2">
                  GŌKANA Gifts on Instagram
                </h3>
                <p className="font-sans text-xs sm:text-sm text-accent font-medium">
                  {BUSINESS_INFO.socials.instagram.handle}
                </p>
              </div>

              {/* Verified Community Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-muted font-light pt-2">
                <span className="px-3 py-1 rounded-full bg-surface-alt border border-border text-ivory">
                  ✦ Luxury Hampers
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-alt border border-border text-ivory">
                  ✦ Handmade Chocolates
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-alt border border-border text-ivory">
                  ✦ Custom Personalisation
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-alt border border-border text-ivory">
                  ✦ Pan India Gifting
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                <a
                  href={BUSINESS_INFO.socials.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={BUSINESS_INFO.socials.instagram.label}
                  className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs py-3.5 px-8 font-semibold tracking-wider uppercase min-h-[44px]"
                >
                  <SvgInstagram size={17} />
                  Follow on Instagram
                  <ExternalLink size={13} className="ml-0.5" />
                </a>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                  <a
                    href={BUSINESS_INFO.socials.youtube.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={BUSINESS_INFO.socials.youtube.label}
                    className="btn-outline flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-xs py-3.5 px-4 min-h-[44px]"
                  >
                    <SvgYouTube size={16} className="text-accent" />
                    <span>YouTube</span>
                  </a>

                  <a
                    href={BUSINESS_INFO.socials.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={BUSINESS_INFO.socials.facebook.label}
                    className="btn-outline flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-xs py-3.5 px-4 min-h-[44px]"
                  >
                    <SvgFacebook size={16} className="text-accent" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
