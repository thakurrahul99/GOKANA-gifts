import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { formatPrice, Badge } from '../ui';
import { products } from '../../data';

const steps = [
  {
    id: 'who',
    question: 'Who are you gifting?',
    options: [
      { label: 'Partner', emoji: '💑', value: 'partner' },
      { label: 'Friend', emoji: '🤝', value: 'friend' },
      { label: 'Family', emoji: '👨‍👩‍👧', value: 'family' },
      { label: 'Colleague', emoji: '💼', value: 'colleague' },
      { label: 'Parent', emoji: '🌸', value: 'parent' },
    ],
  },
  {
    id: 'occasion',
    question: "What's the occasion?",
    options: [
      { label: 'Birthday', emoji: '🎂', value: 'birthday' },
      { label: 'Anniversary', emoji: '💍', value: 'anniversary' },
      { label: 'Wedding', emoji: '🌺', value: 'wedding' },
      { label: 'Festival', emoji: '🪔', value: 'diwali' },
      { label: 'Thank You', emoji: '🙏', value: 'thankyou' },
      { label: 'Just Because', emoji: '✨', value: 'justbecause' },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget?",
    options: [
      { label: 'Under ₹500', emoji: '💫', value: '0-500' },
      { label: '₹500 – ₹1,000', emoji: '✨', value: '500-1000' },
      { label: '₹1,000 – ₹2,500', emoji: '⭐', value: '1000-2500' },
      { label: '₹2,500+', emoji: '💎', value: '2500-999999' },
    ],
  },
];

const STORAGE_KEY = 'gokana_giftfinder_selections';

export function GiftFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({ who: null, occasion: null, budget: null });
  const [showResults, setShowResults] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selections) setSelections(parsed.selections);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.showResults) setShowResults(parsed.showResults);
      }
    } catch (_) {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ selections, currentStep, showResults }));
  }, [selections, currentStep, showResults]);

  const step = steps[currentStep];

  const handleSelect = (value) => {
    const key = step.id;
    const updated = { ...selections, [key]: value };
    setSelections(updated);
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelections({ who: null, occasion: null, budget: null });
    setShowResults(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getResults = () => {
    let results = [...products];
    if (selections.occasion) {
      const byOccasion = results.filter((p) => p.categories?.includes(selections.occasion));
      results = byOccasion.length > 0 ? byOccasion : results;
    }
    if (selections.budget) {
      const [min, max] = selections.budget.split('-').map(Number);
      const byBudget = results.filter((p) => p.price >= min && p.price <= max);
      if (byBudget.length > 0) results = byBudget;
    }
    return results.slice(0, 3);
  };

  return (
    <section id="gift-finder" className="section-py overflow-hidden" style={{ background: 'var(--primary)' }}>
      <div className="container-gokana">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <ScrollReveal delay={0.1}>
              <p className="label-text mb-5" style={{ color: 'rgba(212,175,55,0.75)' }}>✦ Gift Finder</p>
            </ScrollReveal>
            <AnimatedHeading className="heading-lg mb-5" delay={0.15} style={{ color: '#FFFFFF' }}>
              Not Sure What to Gift?
            </AnimatedHeading>
            <ScrollReveal delay={0.3}>
              <p className="font-sans text-base leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Tell us the moment. We'll help you find the perfect gift.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.4}>
            <div
              className="p-8 md:p-12 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Progress stepper */}
              {!showResults && (
                <div className="flex items-center gap-3 mb-10" aria-label="Step progress">
                  {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 flex-1">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-medium transition-all duration-400"
                        style={{
                          background: i < currentStep ? 'var(--accent)' : i === currentStep ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.06)',
                          color: i < currentStep ? '#121212' : i === currentStep ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
                          border: i === currentStep ? '1px solid rgba(212,175,55,0.5)' : 'none',
                        }}
                        aria-current={i === currentStep ? 'step' : undefined}
                      >
                        {i < currentStep ? '✓' : i + 1}
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className="flex-1 h-px transition-all duration-600"
                          style={{ background: i < currentStep ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-serif text-2xl md:text-3xl font-light mb-8" style={{ color: '#FFFFFF' }}>
                      {step.question}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="group" aria-label={step.question}>
                      {step.options.map((opt) => {
                        const isSelected = selections[step.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            aria-pressed={isSelected}
                            className="gift-option focus-visible:outline-none focus-visible:ring-2"
                            style={{
                              '--tw-ring-color': 'var(--accent)',
                              borderColor: isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.12)',
                              background: isSelected ? 'rgba(212,175,55,0.12)' : 'transparent',
                              color: isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.65)',
                            }}
                          >
                            <span className="text-2xl" aria-hidden="true">{opt.emoji}</span>
                            <span className="font-sans text-sm font-medium tracking-wide">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {currentStep > 0 && (
                      <button
                        onClick={() => setCurrentStep((s) => s - 1)}
                        className="flex items-center gap-2 mt-7 font-sans text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:rounded"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                        aria-label="Go back to previous step"
                      >
                        <ChevronLeft size={14} />
                        Back
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center justify-between mb-7">
                      <p className="font-serif text-2xl font-light" style={{ color: '#FFFFFF' }}>
                        We think you'll love these ✦
                      </p>
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 font-sans text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:rounded"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                        aria-label="Start the gift finder over"
                      >
                        <RotateCcw size={12} />
                        Start over
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {getResults().map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.slug}`}
                          className="group rounded-xl overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
                          style={{
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            '--tw-ring-color': 'var(--accent)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          }}
                        >
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-4">
                            <p className="font-serif text-base font-light leading-tight mb-1" style={{ color: '#FFFFFF' }}>
                              {product.name}
                            </p>
                            <p className="font-sans text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="text-center">
                      <Link to="/shop" className="btn-accent">
                        Explore All Gifts
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
