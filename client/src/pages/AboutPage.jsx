import { motion } from 'framer-motion';
import { ScrollReveal, AnimatedHeading, StaggerReveal, staggerItem } from '../components/ui/ScrollReveal';
import { Divider } from '../components/ui';
import { Newsletter } from '../components/sections/Newsletter';
import { brandStoryImg } from '../data';
import { Heart, Award, Sparkles, Package } from 'lucide-react';

const values = [
  {
    num: '01',
    Icon: Sparkles,
    title: 'Quality over Quantity',
    desc: "We'd rather have 20 perfect products than 200 ordinary ones. Every item in our collection is chosen for its story, quality, and the joy it brings.",
  },
  {
    num: '02',
    Icon: Award,
    title: 'Craft & Artisanship',
    desc: 'We partner with artisans, small brands, and premium producers who put care into every detail — because that care is what you feel when you receive the gift.',
  },
  {
    num: '03',
    Icon: Package,
    title: 'The Whole Experience',
    desc: "From the moment you browse to the moment it's unwrapped, we obsess over every step. Packaging, presentation, and personalisation are never afterthoughts.",
  },
];

const metrics = [
  { value: 'Handmade', label: 'Handcrafted Quality' },
  { value: 'Custom', label: 'Personalised Gifting' },
  { value: 'Pan-India', label: 'Doorstep Delivery' },
  { value: 'Care', label: 'Complimentary Cards' },
];

export function AboutPage() {
  return (
    <main className="bg-bg">
      {/* Hero — Luxury Dark full-bleed */}
      <div className="relative h-[72vh] min-h-[440px] overflow-hidden bg-bg flex items-center justify-center">
        <img
          src={brandStoryImg}
          alt="GŌKANA artisan gift workshop"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
          loading="lazy"
          decoding="async"
        />
        {/* Ambient champagne gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 70%, rgba(197,160,89,0.25) 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.p
            className="label-text text-accent mb-6 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Heart size={14} />
            About GŌKANA
          </motion.p>
          <div className="overflow-hidden">
            <motion.h1
              className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-light text-ivory leading-tight"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              We gift meaning.
            </motion.h1>
          </div>
          <motion.p
            className="font-sans text-muted mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            GŌKANA was born from a simple belief: the best gifts are the ones that feel truly seen and chosen.
          </motion.p>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="bg-bg-alt border-b border-border">
        <div className="container-gokana">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/50">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                className="py-6 px-3 sm:py-8 sm:px-6 text-center"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <p className="font-serif text-2xl sm:text-3xl font-light text-accent mb-1">{m.value}</p>
                <p className="font-sans text-[11px] sm:text-xs text-muted uppercase tracking-wider">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="section-py bg-bg">
        <div className="container-gokana max-w-3xl">
          <ScrollReveal>
            <p className="label-text text-accent mb-6 flex items-center gap-2">
              <Sparkles size={13} />
              Our Story
            </p>
          </ScrollReveal>
          <AnimatedHeading className="heading-lg text-ivory mb-8" delay={0.1}>
            It started with one bad gift.
          </AnimatedHeading>
          <ScrollReveal delay={0.3}>
            <Divider className="mb-8" />
          </ScrollReveal>
          <ScrollReveal delay={0.35} className="space-y-5 body-text text-muted leading-relaxed">
            <p>
              GŌKANA Gifts was founded on a simple observation: during every birthday, anniversary, or festival, people spend hours searching for the perfect
              gift — yet often settle for something generic that fails to capture the true depth of the relationship.
            </p>
            <p>
              We realised that thoughtful gifting in India deserved a higher standard of quality, personalisation, and care — combining hand-selected Belgian chocolates, hand-poured candles, and personalised handwritten notes into memorable gift boxes.
            </p>
            <p>
              From Mathura, Uttar Pradesh to doorsteps across India, GŌKANA Gifts treats every gift like a
              cherished moment, and every moment like a story worth telling beautifully.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-py bg-bg-alt border-t border-border relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(ellipse at 80% 20%, rgba(197,160,89,0.2) 0%, transparent 50%)`,
          }}
        />
        <div className="container-gokana relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal>
              <p className="label-text text-accent mb-5 flex items-center justify-center gap-2">
                <Heart size={13} />
                What We Believe
              </p>
            </ScrollReveal>
            <AnimatedHeading className="heading-lg text-ivory" delay={0.15}>
              Our Values
            </AnimatedHeading>
          </div>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8" stagger={0.15}>
            {values.map(({ num, Icon, title, desc }) => (
              <motion.div
                key={num}
                variants={staggerItem}
                className="border border-border p-5 sm:p-8 bg-bg rounded-xl hover:border-accent/50 transition-all duration-300 group shadow-lg"
              >
                <div className="flex items-start justify-between mb-5">
                  <p className="font-serif text-5xl font-light text-accent/40">{num}</p>
                  <Icon size={20} className="text-accent/60 group-hover:text-accent transition-colors mt-1" />
                </div>
                <h3 className="font-serif text-xl font-light text-ivory mb-3">{title}</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
