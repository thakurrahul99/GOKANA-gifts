import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section className="section-py-sm" style={{ background: 'var(--primary)' }}>
      <div className="container-gokana">
        <div className="max-w-2xl mx-auto text-center">
          {/* Label */}
          <ScrollReveal delay={0.1}>
            <p className="label-text mb-6" style={{ color: 'rgba(212,175,55,0.75)' }}>✦ Stay Connected</p>
          </ScrollReveal>

          <AnimatedHeading className="heading-lg mb-5" delay={0.15} style={{ color: '#FFFFFF' }}>
            A little inspiration,<br />
            <span className="italic" style={{ color: 'var(--accent)' }}>delivered.</span>
          </AnimatedHeading>

          <ScrollReveal delay={0.35}>
            <p className="font-sans text-base leading-relaxed mb-10 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                  noValidate
                  aria-label="Newsletter signup"
                >
                  <div className="flex-1 flex flex-col">
                    <label htmlFor="newsletter-input" className="sr-only">Email address</label>
                    <input
                      id="newsletter-input"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="Your email address"
                      className="flex-1 py-4 px-5 font-sans text-sm focus:outline-none transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRight: 'none',
                        color: '#FFFFFF',
                        borderRadius: '10px 0 0 10px',
                      }}
                      required
                      autoComplete="email"
                      aria-invalid={!!error}
                      aria-describedby={error ? 'nl-error' : undefined}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 font-sans text-xs font-semibold tracking-[0.12em] uppercase flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-200 focus-visible:outline-none"
                    style={{
                      background: 'var(--accent)',
                      color: '#121212',
                      borderRadius: '0 10px 10px 0',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-dark)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; }}
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
                  className="py-6 flex flex-col items-center gap-3"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle size={32} style={{ color: 'var(--accent)' }} />
                  <p className="font-serif text-2xl font-light" style={{ color: '#FFFFFF' }}>
                    Welcome to GŌKANA. ✦
                  </p>
                  <p className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Thank you for subscribing. Expect beautiful things.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p id="nl-error" className="font-sans text-xs mt-2" style={{ color: '#FCA5A5' }} role="alert">
                {error}
              </p>
            )}

            {!subscribed && (
              <p className="font-sans text-xs mt-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
                No spam. Unsubscribe anytime. Privacy guaranteed.
              </p>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
