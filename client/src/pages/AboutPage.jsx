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
  { value: '50,000+', label: 'Gifts Delivered' },
  { value: '4.9 ★', label: 'Average Rating' },
  { value: '200+', label: 'Corporate Clients' },
  { value: '48h', label: 'Express Dispatch' },
];

export function AboutPage() {
  return (
    <main className="bg-bg">
      {/* Hero — Luxury Dark full-bleed */}
      <div className="relative h-[72vh] min-h-[440px] overflow-hidden bg-[#12100E] flex items-center justify-center">
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
              className="font-serif text-5xl md:text-7xl font-light text-ivory leading-tight"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              We gift meaning.
            </motion.h1>
          </div>
          <motion.p
            className="font-sans text-[#A39A8E] mt-6 text-base leading-relaxed max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            GŌKANA was born from a simple belief: the best gifts are the ones that feel truly seen and chosen.
          </motion.p>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="bg-[#181512] border-b border-[rgba(197,160,89,0.18)]">
        <div className="container-gokana">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(197,160,89,0.15)]">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                className="py-8 px-6 text-center"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <p className="font-serif text-3xl font-light text-accent mb-1">{m.value}</p>
                <p className="font-sans text-xs text-[#A39A8E] uppercase tracking-wider">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="section-py bg-[#12100E]">
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
          <ScrollReveal delay={0.35} className="space-y-5 body-text text-[#A39A8E] leading-relaxed">
            <p>
              Our founder, Deepti Agarwal, had a habit: every birthday, anniversary, or festival, she'd spend hours searching for the perfect
              gift — and almost always settle for something generic that felt nothing like the person she was gifting.
            </p>
            <p>
              She realised that premium gifting in India was either overly corporate (branded merchandise no one wanted) or
              completely generic (the same chocolate boxes everyone gives). Nobody was doing beautiful, thoughtful, curated
              gifting at scale.
            </p>
            <p>
              So GŌKANA was born — to be the gifting brand India always deserved. A brand that treats every gift like a
              moment, and every moment like a story worth telling beautifully.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-py bg-[#181512] border-t border-[rgba(197,160,89,0.18)] relative overflow-hidden">
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

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.15}>
            {values.map(({ num, Icon, title, desc }) => (
              <motion.div
                key={num}
                variants={staggerItem}
                className="border border-[rgba(197,160,89,0.2)] p-8 bg-[#12100E] rounded-xl hover:border-accent/50 transition-all duration-300 group shadow-lg"
              >
                <div className="flex items-start justify-between mb-5">
                  <p className="font-serif text-5xl font-light text-accent/40">{num}</p>
                  <Icon size={20} className="text-accent/60 group-hover:text-accent transition-colors mt-1" />
                </div>
                <h3 className="font-serif text-xl font-light text-ivory mb-3">{title}</h3>
                <p className="font-sans text-sm text-[#A39A8E] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
