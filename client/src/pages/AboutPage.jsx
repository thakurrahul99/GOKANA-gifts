import { ScrollReveal, AnimatedHeading, StaggerReveal, staggerItem } from '../components/ui/ScrollReveal';
import { Divider } from '../components/ui';
import { Newsletter } from '../components/sections/Newsletter';
import { motion } from 'framer-motion';
import { brandStoryImg } from '../data';

const values = [
  { num: '01', title: 'Curation over Quantity', desc: 'We\'d rather have 20 perfect products than 200 ordinary ones. Every item in our collection is chosen for its story, quality and the joy it brings.' },
  { num: '02', title: 'Craft & Artisanship', desc: 'We partner with artisans, small brands and premium producers who put care into every detail — because that care is what you feel when you receive the gift.' },
  { num: '03', title: 'The Whole Experience', desc: 'From the moment you browse to the moment it\'s unwrapped, we obsess over every step. Packaging, presentation and personalisation are never afterthoughts.' },
];

export function AboutPage() {
  return (
    <main className="bg-ivory">
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[400px] overflow-hidden bg-charcoal flex items-center justify-center">
        <img src={brandStoryImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative text-center px-6">
          <motion.p
            className="label-text text-gold/70 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ✦ About GŌKANA
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
            className="font-sans text-ivory/50 mt-6 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            GŌKANA was born from a simple belief: the best gifts are the ones that feel truly seen and chosen.
          </motion.p>
        </div>
      </div>

      {/* Story */}
      <section className="section-py">
        <div className="container-gokana max-w-3xl">
          <ScrollReveal>
            <p className="label-text text-gold mb-6">✦ Our Story</p>
          </ScrollReveal>
          <AnimatedHeading className="heading-lg text-charcoal mb-8" delay={0.1}>
            It started with one bad gift.
          </AnimatedHeading>
          <ScrollReveal delay={0.3}>
            <Divider className="mb-8" />
          </ScrollReveal>
          <ScrollReveal delay={0.35} className="space-y-5 body-text text-charcoal/65">
            <p>Our founder had a habit: every birthday, anniversary, or festival, she'd spend hours searching for the perfect gift — and almost always settle for something generic that felt nothing like the person she was gifting.</p>
            <p>She realised that premium gifting in India was either overly corporate (branded merchandise no one wanted) or completely generic (the same chocolate boxes everyone gives). Nobody was doing beautiful, thoughtful, curated gifting at scale.</p>
            <p>So GŌKANA was born — to be the gifting brand India always deserved. A brand that treats every gift like a moment, and every moment like a story worth telling beautifully.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-py bg-charcoal">
        <div className="container-gokana">
          <div className="text-center mb-16">
            <ScrollReveal><p className="label-text text-gold/70 mb-5">✦ What We Believe</p></ScrollReveal>
            <AnimatedHeading className="heading-lg text-ivory" delay={0.15}>Our Values</AnimatedHeading>
          </div>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.15}>
            {values.map((v) => (
              <motion.div key={v.num} variants={staggerItem} className="border border-white/[0.08] p-8">
                <p className="font-serif text-5xl font-light text-gold/30 mb-5">{v.num}</p>
                <h3 className="font-serif text-xl font-light text-ivory mb-3">{v.title}</h3>
                <p className="font-sans text-sm text-ivory/50 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
