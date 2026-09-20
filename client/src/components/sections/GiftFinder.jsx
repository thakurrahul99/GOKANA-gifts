import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, RotateCcw, Check, Sparkles } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { formatPrice } from '../ui';
import { API_BASE } from '../../lib/api';
import { useCartStore } from '../../store';

const STEPS = [
  {
    id: 'occasion',
    title: "What's the occasion?",
    subtitle: 'Every celebration has its own unique sentiment.',
    options: [
      { label: 'Birthday', emoji: '🎂', value: 'birthday' },
      { label: 'Anniversary', emoji: '💍', value: 'anniversary' },
      { label: 'Wedding', emoji: '🌺', value: 'wedding' },
      { label: 'Festival / Diwali', emoji: '🪔', value: 'diwali' },
      { label: 'Thank You', emoji: '🙏', value: 'thankyou' },
      { label: 'Just Because', emoji: '✨', value: 'justbecause' },
    ],
  },
  {
    id: 'recipient',
    title: 'Who is this gift for?',
    subtitle: 'We tailor our curations to their personal aesthetic.',
    options: [
      { label: 'For Her', emoji: '🌸', value: 'her' },
      { label: 'For Him', emoji: '🎩', value: 'him' },
      { label: 'For a Couple', emoji: '💑', value: 'couple' },
      { label: 'For Kids / Teens', emoji: '🎈', value: 'kids' },
      { label: 'For Parents', emoji: '🏡', value: 'parents' },
      { label: 'Corporate / Client', emoji: '💼', value: 'corporate' },
    ],
  },
  {
    id: 'budget',
    title: 'What is your budget?',
    subtitle: 'Luxury gifting designed thoughtfully across every tier.',
    options: [
      { label: 'Under ₹1,000', emoji: '💫', value: '0-1000', min: 0, max: 1000 },
      { label: '₹1,000 – ₹2,500', emoji: '✨', value: '1000-2500', min: 1000, max: 2500 },
      { label: '₹2,500 – ₹5,000', emoji: '⭐', value: '2500-5000', min: 2500, max: 5000 },
      { label: '₹5,000+', emoji: '💎', value: '5000-999999', min: 5000, max: 999999 },
    ],
  },
  {
    id: 'personalisation',
    title: 'Would you like to personalise it?',
    subtitle: 'Add a memorable touch to make it truly unforgettable.',
    options: [
      { label: 'Custom Name / Monogram', emoji: '✍️', value: 'name' },
      { label: 'Handwritten Message Card', emoji: '💌', value: 'message' },
      { label: 'Cherished Photo Keepsake', emoji: '📷', value: 'photo' },
      { label: 'Standard Signature Packaging', emoji: '🎁', value: 'none' },
    ],
  },
];

const STORAGE_KEY = 'gokana_giftfinder_v2';

export function GiftFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    occasion: null,
    recipient: null,
    budget: null,
    personalisation: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const { addItem } = useCartStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/products?limit=100`)
      .then((res) => res.json())
      .then((data) => setProducts((data.products || []).map((p) => ({
        ...p,
        id: p._id || p.id,
        image: p.thumbnail || p.images?.[0],
        image2: p.images?.[1] || p.thumbnail || p.images?.[0],
        tags: p.tags || [],
        categories: (p.categories || []).map((cat) => typeof cat === 'string' ? cat : cat.slug).filter(Boolean),
        variants: (p.variants || []).map((v) => typeof v === 'string' ? v : v.label),
      })))).catch(() => setProducts([]));
  }, []);

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selections) setSelections(parsed.selections);
        if (parsed.showResults) setShowResults(parsed.showResults);
      }
    } catch (_) {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ selections, showResults }));
    } catch (_) {}
  }, [selections, showResults]);

  const handleSelect = (key, value) => {
    const updated = { ...selections, [key]: value };
    setSelections(updated);
    if (currentStep < STEPS.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 200);
    } else {
      setTimeout(() => setShowResults(true), 250);
    }
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelections({ occasion: null, recipient: null, budget: null, personalisation: null });
    setShowResults(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addItem(product, product.variants?.[0] || null);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Compute matched items
  const results = useMemo(() => {
    let list = [...products];

    if (selections.occasion) {
      const byOccasion = list.filter((p) => p.categories?.includes(selections.occasion));
      if (byOccasion.length > 0) list = byOccasion;
    }

    if (selections.budget) {
      const [min, max] = selections.budget.split('-').map(Number);
      const byBudget = list.filter((p) => p.price >= min && p.price <= max);
      if (byBudget.length > 0) list = byBudget;
    }

    if (selections.personalisation && selections.personalisation !== 'none') {
      const customisable = list.filter((p) => p.personalisable);
      if (customisable.length > 0) list = customisable;
    }

    if (list.length < 3) {
      const remaining = products.filter((p) => !list.some((i) => i.id === p.id));
      list = [...list, ...remaining.slice(0, 3 - list.length)];
    }

    return list.slice(0, 3);
  }, [selections]);

  const currentStepData = STEPS[currentStep];

  return (
    <section id="gift-finder" className="section-py overflow-hidden bg-primary text-white" aria-labelledby="gift-finder-heading">
      <div className="container-gokana">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <ScrollReveal delay={0.1}>
              <p className="label-text text-accent mb-3">✦ 5-Step Gifting Assistant</p>
            </ScrollReveal>
            <AnimatedHeading id="gift-finder-heading" className="heading-lg text-white mb-4" delay={0.15}>
              Not Sure What to Gift?
            </AnimatedHeading>
            <ScrollReveal delay={0.25}>
              <p className="font-sans text-base text-charcoal-200 max-w-md mx-auto leading-relaxed">
                Take our 60-second quiz. We will match you with hand-selected gifts guaranteed to be remembered.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <div className="p-6 md:p-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              {/* Progress Indicator (Step X of 5) */}
              <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-accent text-text font-sans text-xs font-bold flex items-center justify-center">
                    {showResults ? '5' : currentStep + 1}
                  </span>
                  <span className="font-sans text-xs uppercase tracking-wider text-charcoal-200">
                    {showResults ? 'Step 5 of 5: Curated Results' : `Step ${currentStep + 1} of 5: ${currentStepData.title}`}
                  </span>
                </div>

                {(showResults || currentStep > 0) && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-charcoal-200 hover:text-accent transition-colors"
                    aria-label="Restart quiz"
                  >
                    <RotateCcw size={13} />
                    Reset
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-white mb-2">
                      {currentStepData.title}
                    </h3>
                    <p className="font-sans text-xs text-charcoal-200 mb-6">
                      {currentStepData.subtitle}
                    </p>

                    {/* Step Options Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                      {currentStepData.options.map((opt) => {
                        const isSelected = selections[currentStepData.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleSelect(currentStepData.id, opt.value)}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[84px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                              isSelected
                                ? 'border-accent bg-accent/15 text-accent'
                                : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
                            }`}
                          >
                            <span className="text-2xl mb-2" aria-hidden="true">{opt.emoji}</span>
                            <span className="font-sans text-xs font-semibold tracking-wide">
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons: Back & Skip */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      {currentStep > 0 ? (
                        <button
                          onClick={() => setCurrentStep((s) => s - 1)}
                          className="flex items-center gap-1.5 text-xs text-charcoal-200 hover:text-white transition-colors"
                        >
                          <ChevronLeft size={16} />
                          Back
                        </button>
                      ) : <div />}

                      <button
                        onClick={handleSkip}
                        className="text-xs text-accent hover:underline font-semibold"
                      >
                        Skip this step →
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Step 5: Results */
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-serif text-2xl text-white font-light">
                          We Think You'll Love These ✦
                        </h3>
                        <p className="font-sans text-xs text-charcoal-200">
                          Curated specifically to your celebration preferences
                        </p>
                      </div>
                      <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-xs text-accent hover:underline"
                      >
                        <RotateCcw size={13} />
                        Retake Quiz
                      </button>
                    </div>

                    {/* Results Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {results.map((product) => (
                        <div
                          key={product.id}
                          className="rounded-xl overflow-hidden bg-white/10 border border-white/15 flex flex-col justify-between"
                        >
                          <div>
                            <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </Link>
                            <div className="p-4">
                              <h4 className="font-serif text-base font-light text-white mb-1 line-clamp-1">
                                {product.name}
                              </h4>
                              <p className="font-sans text-sm font-semibold text-accent mb-3">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 pt-0">
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              className={`w-full py-2 px-3 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
                                addedId === product.id
                                  ? 'bg-accent text-text'
                                  : 'bg-accent text-text hover:bg-accent-dark'
                              }`}
                            >
                              {addedId === product.id ? (
                                <>
                                  <Check size={14} /> Added
                                </>
                              ) : (
                                'Add to Cart'
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center pt-2">
                      <Link to="/shop" className="btn-accent py-3 px-8 text-xs">
                        Explore Full Collection
                        <ArrowRight size={15} />
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
