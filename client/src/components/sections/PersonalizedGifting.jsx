import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Pen, MessageCircle, Camera, Gift, Sparkles } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';

const features = [
  { icon: Pen, label: 'Name Monograms', desc: 'Custom laser engraving on wooden gift boxes and signature sleeves.' },
  { icon: MessageCircle, label: 'Calligraphy Notes', desc: 'Complimentary handwritten notes on 300 GSM cotton paper with wax seal.' },
  { icon: Camera, label: 'Photo Keepsakes', desc: 'Upload cherished polaroids or moments to embed inside memory boxes.' },
  { icon: Gift, label: 'Bespoke Ribbons', desc: 'Choice of double-faced satin ribbons in champagne, emerald, or gold.' },
];

export function PersonalizedGifting() {
  return (
    <section id="personalisation" className="section-py bg-bg overflow-hidden" aria-labelledby="personalisation-heading">
      <div className="container-gokana">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Visual Calligraphy Keepsake Preview */}
          <ScrollReveal direction="scale" className="relative">
            <div className="relative aspect-square max-w-md mx-auto bg-white rounded-2xl p-8 md:p-12 border border-border shadow-lg flex flex-col items-center justify-center text-center">
              {/* Decorative Gold Header */}
              <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center text-primary mb-6">
                <Sparkles size={22} className="text-accent" />
              </div>

              {/* Sample Calligraphy Letter */}
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                Handwritten with Care
              </p>
              <h4 className="font-serif text-3xl md:text-4xl font-light text-primary mb-3 italic">
                Dearest Ananya,
              </h4>
              <p className="font-serif text-base md:text-lg text-muted leading-relaxed max-w-xs italic mb-6">
                "May this year bring you endless laughter, peaceful mornings, and sweeter memories."
              </p>

              <div className="pt-4 border-t border-border w-full flex items-center justify-between text-xs text-primary font-sans">
                <span className="font-medium">Wax Sealed • 300 GSM</span>
                <span className="font-semibold text-accent">Complimentary</span>
              </div>

              {/* Floating Tag */}
              <div className="absolute -top-3 -right-3 bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent" />
                100% Personalised
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Features and Description */}
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text text-accent mb-3">✦ The Thought That Counts</p>
            </ScrollReveal>
            <AnimatedHeading id="personalisation-heading" className="heading-lg text-primary mb-5" delay={0.15}>
              Every Gift Tells Their Story
            </AnimatedHeading>
            <ScrollReveal delay={0.25}>
              <p className="font-sans text-base text-muted leading-relaxed mb-8">
                A gift should never feel generic. Our artisans hand-letter your exact words, apply custom name seals, and tailor each detail to turn your present into an enduring heirloom.
              </p>
            </ScrollReveal>

            {/* Feature List */}
            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" stagger={0.06}>
              {features.map(({ icon: Icon, label, desc }) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  className="p-4 rounded-xl bg-white border border-border"
                >
                  <div className="flex items-center gap-2.5 mb-1.5 text-primary">
                    <Icon size={17} className="text-accent" />
                    <h5 className="font-sans text-sm font-semibold text-primary">{label}</h5>
                  </div>
                  <p className="font-sans text-xs text-muted leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </StaggerReveal>

            <ScrollReveal delay={0.4}>
              <Link to="/shop?personalised=true" className="btn-primary inline-flex items-center gap-2">
                Browse Personalised Gifts
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
