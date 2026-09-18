import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) setSubscribed(true);
  };

  return (
    <section className="section-py-sm bg-charcoal">
      <div className="container-gokana">
        <div className="max-w-2xl mx-auto text-center">
          {/* Label */}
          <ScrollReveal delay={0.1}>
            <p className="label-text text-gold/70 mb-6">✦ Stay Connected</p>
          </ScrollReveal>

          <AnimatedHeading className="heading-lg text-ivory mb-5" delay={0.15}>
            A little inspiration,<br />
            <span className="italic text-champagne">delivered.</span>
          </AnimatedHeading>

          <ScrollReveal delay={0.35}>
            <p className="body-text text-ivory/50 mb-10 max-w-md mx-auto">
              Discover new collections, gifting ideas and special moments from GŌKANA — straight to your inbox.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.45}>
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 bg-white/[0.07] border border-white/[0.12] px-5 py-4 text-ivory placeholder-ivory/35 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gold text-ivory font-sans text-xs font-medium tracking-[0.15em] uppercase hover:bg-accent transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Join GŌKANA
                    <ArrowRight size={14} />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="py-6"
                >
                  <p className="font-serif text-2xl font-light text-ivory mb-2">
                    Welcome to GŌKANA. ✦
                  </p>
                  <p className="font-sans text-sm text-ivory/50">
                    Thank you for subscribing. Expect beautiful things.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!subscribed && (
              <p className="font-sans text-xs text-ivory/25 mt-4">
                No spam. Unsubscribe anytime. Privacy guaranteed.
              </p>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
