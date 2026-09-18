import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Pen, MessageCircle, Camera, Gift, StickyNote } from 'lucide-react';
import { ScrollReveal, StaggerReveal, staggerItem, AnimatedHeading } from '../ui/ScrollReveal';
import { Divider } from '../ui';

const features = [
  { icon: Pen, label: 'Name Personalisation', desc: 'Add a recipient\'s name, monogram or custom text to selected items.' },
  { icon: MessageCircle, label: 'Custom Message', desc: 'A heartfelt handwritten message card included with every gift.' },
  { icon: Camera, label: 'Photo Upload', desc: 'Add a cherished photograph to create a one-of-a-kind keepsake.' },
  { icon: Gift, label: 'Gift Packaging', desc: 'Premium gift boxes, silk ribbons and branded tissue — beautifully done.' },
  { icon: StickyNote, label: 'Special Notes', desc: 'Add private notes or delivery instructions for a flawless experience.' },
];

export function PersonalizedGifting() {
  return (
    <section className="section-py overflow-hidden" style={{ background: 'linear-gradient(135deg, #F7F4EF 0%, #EAD9BE20 60%, #F7F4EF 100%)' }}>
      <div className="container-gokana">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Visual */}
          <ScrollReveal direction="scale" className="relative">
            <div className="relative aspect-square max-w-lg mx-auto bg-beige overflow-hidden">
              {/* Central text display */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-champagne/60 via-beige to-ivory">
                <div className="text-center p-12">
                  <div className="w-16 h-16 border border-gold/30 flex items-center justify-center mx-auto mb-8">
                    <Gift size={28} strokeWidth={1} className="text-gold" />
                  </div>
                  <p className="font-serif text-4xl font-light text-charcoal mb-3 italic">For Ananya,</p>
                  <p className="font-sans text-sm text-charcoal/60 leading-relaxed max-w-48">
                    "Wishing you a year filled with joy, love and beautiful moments."
                  </p>
                  <div className="mt-6 pt-6 border-t border-charcoal/10">
                    <p className="font-sans text-xs text-gold tracking-[0.2em] uppercase">Personalised by GŌKANA</p>
                  </div>
                </div>
              </div>

              {/* Decorative corner lines */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-gold/40" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-gold/40" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-gold/40" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-gold/40" />
            </div>

            {/* Floating tag */}
            <motion.div
              className="absolute -top-4 -right-4 bg-charcoal px-5 py-3 shadow-premium-lg hidden md:block"
              initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="font-sans text-xs tracking-[0.15em] uppercase text-gold">✦ Personalisable</p>
            </motion.div>
          </ScrollReveal>

          {/* Right — Content */}
          <div>
            <ScrollReveal delay={0.1}>
              <p className="label-text text-gold mb-5">✦ Make It Personal</p>
            </ScrollReveal>

            <AnimatedHeading className="heading-lg text-charcoal mb-5" delay={0.15}>
              A gift that's<br />
              <span className="italic text-accent">only yours.</span>
            </AnimatedHeading>

            <ScrollReveal delay={0.3}>
              <Divider className="mb-7" />
            </ScrollReveal>

            <ScrollReveal delay={0.35}>
              <p className="body-text text-charcoal/60 mb-10 max-w-md">
                Add names, messages, photos and personal touches to create a gift that could never belong to anyone else. We handle the details — you get all the credit.
              </p>
            </ScrollReveal>

            <StaggerReveal className="space-y-5" stagger={0.08} delay={0.4}>
              {features.map(({ icon: Icon, label, desc }) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={18} strokeWidth={1.5} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-charcoal mb-0.5">{label}</p>
                    <p className="font-sans text-sm text-charcoal/50">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </StaggerReveal>

            <ScrollReveal delay={0.7} className="mt-10">
              <Link to="/shop?personalized=true" className="btn-primary">
                Create Your Gift
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
