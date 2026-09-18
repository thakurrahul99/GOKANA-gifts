import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { Divider, formatPrice } from '../ui';
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
    question: 'What\'s your budget?',
    options: [
      { label: 'Under ₹500', emoji: '💰', value: '0-500' },
      { label: '₹500 – ₹1,000', emoji: '💰', value: '500-1000' },
      { label: '₹1,000 – ₹2,500', emoji: '💰', value: '1000-2500' },
      { label: '₹2,500+', emoji: '💰', value: '2500-999999' },
    ],
  },
];

export function GiftFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({ who: null, occasion: null, budget: null });
  const [showResults, setShowResults] = useState(false);

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
  };

  // Filter products based on selections
  const getResults = () => {
    let results = [...products];
    if (selections.occasion) {
      const byOccasion = results.filter((p) =>
        p.categories.includes(selections.occasion)
      );
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
    <section className="section-py bg-charcoal overflow-hidden">
      <div className="container-gokana">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <ScrollReveal delay={0.1}>
              <p className="label-text text-gold/70 mb-5">✦ Gift Finder</p>
            </ScrollReveal>
            <AnimatedHeading className="heading-lg text-ivory mb-5" delay={0.15}>
              Not Sure What to Gift?
            </AnimatedHeading>
            <ScrollReveal delay={0.3}>
              <p className="body-text text-ivory/50 max-w-md mx-auto">
                Tell us the moment. We'll help you find the perfect gift.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.4}>
            <div className="bg-ivory/[0.04] border border-white/[0.08] p-8 md:p-12">
              {/* Progress */}
              {!showResults && (
                <div className="flex items-center gap-3 mb-10">
                  {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 flex-1">
                      <div className={clsx(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-medium transition-all duration-400',
                        i < currentStep ? 'bg-gold text-ivory' :
                        i === currentStep ? 'bg-gold/20 text-gold border border-gold/50' :
                        'bg-white/5 text-white/20 border border-white/10'
                      )}>
                        {i < currentStep ? '✓' : i + 1}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={clsx(
                          'flex-1 h-px transition-all duration-600',
                          i < currentStep ? 'bg-gold' : 'bg-white/10'
                        )} />
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
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-serif text-2xl md:text-3xl font-light text-ivory mb-8">
                      {step.question}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {step.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect(opt.value)}
                          className={clsx(
                            'gift-option',
                            selections[step.id] === opt.value
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-white/10 text-ivory/70 hover:border-gold/50 hover:text-ivory'
                          )}
                        >
                          <span className="text-2xl">{opt.emoji}</span>
                          <span className="font-sans text-sm font-medium tracking-wide">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                    {currentStep > 0 && (
                      <button
                        onClick={() => setCurrentStep((s) => s - 1)}
                        className="flex items-center gap-2 mt-6 font-sans text-xs text-ivory/30 hover:text-ivory/60 transition-colors"
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
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <p className="font-serif text-2xl font-light text-ivory">We think you'll love these ✦</p>
                      <button
                        onClick={handleReset}
                        className="font-sans text-xs text-ivory/40 hover:text-ivory transition-colors"
                      >
                        Start over
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {getResults().map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.slug}`}
                          className="group bg-ivory/5 hover:bg-ivory/10 border border-white/10 hover:border-gold/30 transition-all duration-300 p-1"
                        >
                          <div className="aspect-square overflow-hidden mb-3">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="px-2 pb-3">
                            <p className="font-serif text-base font-light text-ivory leading-tight mb-1">{product.name}</p>
                            <p className="font-sans text-sm text-gold">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="text-center">
                      <Link to="/shop" className="btn-gold">
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
