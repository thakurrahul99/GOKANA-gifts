import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section className="section-py-sm bg-bg-alt text-ivory border-t border-border" aria-labelledby="newsletter-heading">
      <div className="container-gokana">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3">✦ Stay Inspired</p>
          </ScrollReveal>

          <AnimatedHeading id="newsletter-heading" className="heading-lg text-ivory mb-4" delay={0.15}>
            A Little Gifting Inspiration,<br />
            <span className="italic text-accent font-light">delivered to your inbox.</span>
          </AnimatedHeading>

          <ScrollReveal delay={0.25}>
            <p className="font-sans text-sm md:text-base text-muted mb-8 max-w-md mx-auto leading-relaxed font-light">
              Be the first to explore seasonal festive curations, artisan collaborations, and exclusive member privileges.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="max-w-md mx-auto"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your email address"
                      className="flex-1 bg-bg border border-border rounded-lg px-4 py-3 text-ivory placeholder:text-muted/60 font-sans text-sm focus:outline-none focus:border-accent transition-colors min-h-[44px]"
                      aria-label="Email address for newsletter"
                      required
                    />
                    <button
                      type="submit"
                      className="btn-primary py-3 px-6 text-xs flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px]"
                    >
                      Join GŌKANA
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  {error && (
                    <p className="text-xs text-red-400 font-medium mt-2 text-left sm:text-center" role="alert">
                      {error}
                    </p>
                  )}
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-bg border border-accent/40 text-accent"
                >
                  <CheckCircle2 size={18} />
                  <span className="font-serif text-lg italic text-ivory">
                    Welcome to GŌKANA. Expect something beautiful soon.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
