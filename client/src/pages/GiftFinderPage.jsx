import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronLeft, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle, 
  Gift, 
  Heart, 
  SlidersHorizontal,
  PackageCheck,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ScrollReveal, AnimatedHeading } from '../components/ui/ScrollReveal';
import { products, occasions } from '../data';
import { formatPrice } from '../components/ui';

const STEPS = [
  {
    id: 'recipient',
    title: 'Who are you gifting for?',
    subtitle: 'Select your recipient so we can curate matching aesthetics and styles.',
    options: [
      { id: 'partner', label: 'Partner / Spouse', emoji: '💑', desc: 'Romantic & intimate keepsakes' },
      { id: 'friend', label: 'Close Friend', emoji: '🤝', desc: 'Joyful, thoughtful & fun treats' },
      { id: 'parents', label: 'Parents / In-Laws', emoji: '🌸', desc: 'Traditional, respectful & comforting' },
      { id: 'colleague', label: 'Colleague / Client', emoji: '💼', desc: 'Refined, elegant & professional' },
      { id: 'family', label: 'Family & Siblings', emoji: '👨‍👩‍👧', desc: 'Celebratory & heartwarming' },
      { id: 'self', label: 'Myself (Self-Care)', emoji: '✨', desc: 'Indulgent, relaxing & rejuvenating' },
    ],
  },
  {
    id: 'occasion',
    title: "What's the special occasion?",
    subtitle: 'Every occasion carries its own sentiment and tradition.',
    options: [
      { id: 'birthday', label: 'Birthday', emoji: '🎂', desc: 'Celebrate their special milestone' },
      { id: 'anniversary', label: 'Anniversary', emoji: '💍', desc: 'Timeless symbols of love' },
      { id: 'wedding', label: 'Wedding / Festive', emoji: '🌺', desc: 'Grand wishes & celebrations' },
      { id: 'diwali', label: 'Festive & Diwali', emoji: '🪔', desc: 'Radiance, sweets & prosperity' },
      { id: 'thankyou', label: 'Gratitude & Thanks', emoji: '🙏', desc: 'A heartfelt token of appreciation' },
      { id: 'justbecause', label: 'Just Because', emoji: '💫', desc: 'A pleasant surprise without reason' },
    ],
  },
  {
    id: 'budget',
    title: 'What is your preferred budget?',
    subtitle: 'We offer thoughtfully packed luxury at every price point.',
    options: [
      { id: 'under-1000', label: 'Under ₹1,000', emoji: '✨', min: 0, max: 1000, desc: 'Charming essentials & petite delights' },
      { id: '1000-2000', label: '₹1,000 – ₹2,000', emoji: '⭐', min: 1000, max: 2000, desc: 'Our most popular handcrafted boxes' },
      { id: '2000-3500', label: '₹2,000 – ₹3,500', emoji: '👑', min: 2000, max: 3500, desc: 'Grand multi-item luxury hampers' },
      { id: 'above-3500', label: '₹3,500 and above', emoji: '💎', min: 3500, max: 999999, desc: 'Bespoke, heirloom-grade curations' },
    ],
  },
  {
    id: 'vibe',
    title: 'What vibe fits them best?',
    subtitle: 'Fine-tune recommendations to match their personal aesthetic.',
    options: [
      { id: 'all', label: 'Everything / Surprise Me', emoji: '🌟', desc: 'Show the most celebrated items' },
      { id: 'gourmet', label: 'Gourmet & Chocolates', emoji: '🍫', desc: 'Artisan flavours, berries & confections' },
      { id: 'aroma', label: 'Aromatherapy & Candles', emoji: '🕯️', desc: 'Hand-poured soy wax & calming scents' },
      { id: 'selfcare', label: 'Luxury Self-Care', emoji: '🌿', desc: 'Soothing body treats & rituals' },
    ],
  },
];

const STORAGE_KEY = 'gokana_giftfinder_full_selections';

export function GiftFinderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    recipient: searchParams.get('recipient') || null,
    occasion: searchParams.get('occasion') || null,
    budget: searchParams.get('budget') || null,
    vibe: searchParams.get('vibe') || 'all',
  });
  const [showResults, setShowResults] = useState(false);

  // Restore saved selections if any
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selections && !searchParams.get('occasion')) {
          setSelections(parsed.selections);
          if (parsed.showResults) setShowResults(true);
        }
      }
    } catch (_) {}
  }, [searchParams]);

  // Sync with searchParams if provided
  useEffect(() => {
    const occParam = searchParams.get('occasion');
    if (occParam) {
      setSelections((prev) => ({ ...prev, occasion: occParam }));
    }
  }, [searchParams]);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selections, currentStep, showResults })
      );
    } catch (_) {}
  }, [selections, currentStep, showResults]);

  const handleSelectOption = (key, value) => {
    const nextSelections = { ...selections, [key]: value };
    setSelections(nextSelections);

    if (currentStep < STEPS.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 220);
    } else {
      setTimeout(() => {
        setShowResults(true);
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }, 250);
    }
  };

  const handleReset = () => {
    setSelections({
      recipient: null,
      occasion: null,
      budget: null,
      vibe: 'all',
    });
    setCurrentStep(0);
    setShowResults(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  // Compute matched products
  const matchedProducts = useMemo(() => {
    let list = [...products];

    // Filter by occasion
    if (selections.occasion) {
      const byOccasion = list.filter(
        (p) => p.categories && p.categories.includes(selections.occasion)
      );
      if (byOccasion.length > 0) {
        list = byOccasion;
      }
    }

    // Filter by budget
    if (selections.budget) {
      const budgetObj = STEPS[2].options.find((b) => b.id === selections.budget);
      if (budgetObj) {
        const byBudget = list.filter(
          (p) => p.price >= budgetObj.min && p.price <= budgetObj.max
        );
        if (byBudget.length > 0) {
          list = byBudget;
        }
      }
    }

    // Filter by vibe / category keywords
    if (selections.vibe && selections.vibe !== 'all') {
      const vibeMap = {
        gourmet: ['chocolate', 'gourmet', 'sweet', 'chocolates'],
        aroma: ['candle', 'candles', 'scent', 'serenity'],
        selfcare: ['skincare', 'bath', 'care', 'pamper'],
      };
      const keywords = vibeMap[selections.vibe] || [];
      const byVibe = list.filter((p) =>
        keywords.some(
          (k) =>
            p.slug.includes(k) ||
            p.name.toLowerCase().includes(k) ||
            (p.categories && p.categories.includes(k))
        )
      );
      if (byVibe.length > 0) {
        list = byVibe;
      }
    }

    // Always ensure at least 3-4 top products if criteria were too narrow
    if (list.length < 3) {
      const remaining = products.filter((p) => !list.some((item) => item.id === p.id));
      list = [...list, ...remaining.slice(0, 4 - list.length)];
    }

    return list;
  }, [selections]);

  const activeStepData = STEPS[currentStep];

  return (
    <main className="min-h-screen pt-24 md:pt-28" style={{ background: 'var(--bg)' }}>
      {/* ── Page Header / Hero ── */}
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'var(--primary)' }}>
        {/* Subtle decorative glow */}
        <div 
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-15 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="container-gokana relative z-10 text-center">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 mb-6 font-sans text-xs tracking-wider uppercase text-white/50">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--accent)' }}>Gift Finder</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-sans text-xs font-semibold tracking-widest uppercase mb-4"
              style={{
                background: 'rgba(212,175,55,0.15)',
                color: 'var(--accent)',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              <Sparkles size={13} />
              GŌKANA Concierge & Gift Finder
            </span>
          </motion.div>

          <motion.h1
            className="heading-xl text-white mb-5 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Find the Perfect Gift in Moments
          </motion.h1>

          <motion.p
            className="font-sans text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Answer a few quick questions. Our bespoke gifting assistant will curate
            meaningful, hand-packed gifts guaranteed to spark genuine delight.
          </motion.p>
        </div>
      </section>

      {/* ── Wizard / Stepper Section ── */}
      <section className="section-py relative">
        <div className="container-gokana max-w-4xl mx-auto">
          <div
            className="p-6 md:p-12 rounded-2xl shadow-xl transition-all"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Step Progress Header */}
            <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <span 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm font-semibold"
                  style={{ background: 'var(--accent-soft)', color: 'var(--primary)' }}
                >
                  {showResults ? '✓' : currentStep + 1}
                </span>
                <div>
                  <p className="font-sans text-xs uppercase tracking-wider text-muted font-medium">
                    {showResults ? 'Completed' : `Step ${currentStep + 1} of ${STEPS.length}`}
                  </p>
                  <p className="font-sans text-sm font-semibold text-primary">
                    {showResults ? 'Your Curated Selection' : activeStepData.title}
                  </p>
                </div>
              </div>

              {(showResults || currentStep > 0) && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 font-sans text-xs font-medium text-muted hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-border hover:bg-surface-alt"
                >
                  <RotateCcw size={13} />
                  Reset & Start Over
                </button>
              )}
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2 mb-8">
              {STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (idx <= currentStep || showResults) {
                      setCurrentStep(idx);
                      setShowResults(false);
                    }
                  }}
                  disabled={idx > currentStep && !showResults}
                  className="flex-1 h-2 rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{
                    background:
                      idx < currentStep || showResults
                        ? 'var(--accent)'
                        : idx === currentStep
                        ? 'var(--primary)'
                        : 'var(--border)',
                    cursor: idx <= currentStep || showResults ? 'pointer' : 'default',
                  }}
                  title={`Jump to: ${s.title}`}
                  aria-label={`Step ${idx + 1}: ${s.title}`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-8">
                    <h2 className="heading-md text-primary mb-2">
                      {activeStepData.title}
                    </h2>
                    <p className="font-sans text-sm text-muted">
                      {activeStepData.subtitle}
                    </p>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {activeStepData.options.map((option) => {
                      const isSelected = selections[activeStepData.id] === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSelectOption(activeStepData.id, option.id)}
                          className="flex flex-col text-left p-5 rounded-xl border transition-all duration-200 group relative focus-visible:outline-none focus-visible:ring-2"
                          style={{
                            borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                            backgroundColor: isSelected ? 'var(--accent-soft)' : 'var(--surface-alt)',
                            boxShadow: isSelected ? '0 4px 14px rgba(212,175,55,0.2)' : 'none',
                            '--tw-ring-color': 'var(--accent)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-3xl p-2 rounded-lg bg-surface shadow-xs">
                              {option.emoji}
                            </span>
                            {isSelected && (
                              <CheckCircle2 size={20} style={{ color: 'var(--accent-dark)' }} />
                            )}
                          </div>
                          <span className="font-sans text-base font-semibold text-primary mb-1">
                            {option.label}
                          </span>
                          <span className="font-sans text-xs text-muted leading-relaxed">
                            {option.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    {currentStep > 0 ? (
                      <button
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        className="btn-secondary py-2.5 px-5 text-xs flex items-center gap-2"
                      >
                        <ChevronLeft size={16} />
                        Back
                      </button>
                    ) : <div />}

                    {selections[activeStepData.id] && (
                      <button
                        onClick={() => {
                          if (currentStep < STEPS.length - 1) {
                            setCurrentStep((prev) => prev + 1);
                          } else {
                            setShowResults(true);
                          }
                        }}
                        className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
                      >
                        {currentStep === STEPS.length - 1 ? 'View Matches' : 'Next Step'}
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* ── Results View ── */
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Applied Filter Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-8 p-4 rounded-xl bg-surface-alt border border-border">
                    <span className="font-sans text-xs font-semibold tracking-wider uppercase text-primary mr-2 flex items-center gap-1.5">
                      <SlidersHorizontal size={14} />
                      Your Criteria:
                    </span>
                    {selections.recipient && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-primary">
                        Recipient: <b>{STEPS[0].options.find((o) => o.id === selections.recipient)?.label}</b>
                      </span>
                    )}
                    {selections.occasion && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-primary">
                        Occasion: <b>{STEPS[1].options.find((o) => o.id === selections.occasion)?.label}</b>
                      </span>
                    )}
                    {selections.budget && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-primary">
                        Budget: <b>{STEPS[2].options.find((o) => o.id === selections.budget)?.label}</b>
                      </span>
                    )}
                    {selections.vibe && selections.vibe !== 'all' && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-primary">
                        Vibe: <b>{STEPS[3].options.find((o) => o.id === selections.vibe)?.label}</b>
                      </span>
                    )}
                    <button
                      onClick={handleReset}
                      className="text-xs text-accent hover:underline font-semibold ml-auto"
                    >
                      Change all
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="heading-md text-primary mb-1">
                        Curated Gifts For You
                      </h2>
                      <p className="font-sans text-sm text-muted">
                        Showing {matchedProducts.length} thoughtfully matched presents
                      </p>
                    </div>

                    <Link to="/shop" className="btn-secondary py-2 px-4 text-xs inline-flex items-center gap-2">
                      Explore All Collections
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    {matchedProducts.map((product, idx) => (
                      <ProductCard key={product.id} product={product} index={idx} />
                    ))}
                  </div>

                  {/* Secondary Call to Action */}
                  <div className="text-center pt-6 border-t border-border">
                    <button
                      onClick={handleReset}
                      className="btn-ghost text-xs inline-flex items-center gap-2 text-primary"
                    >
                      <RotateCcw size={14} />
                      Take the quiz again with different preferences
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Concierge & WhatsApp Assistance ── */}
      <section className="py-16" style={{ background: 'var(--surface-alt)' }}>
        <div className="container-gokana max-w-4xl">
          <div 
            className="p-8 md:p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 border"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="max-w-lg">
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3"
                style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}
              >
                <MessageCircle size={13} />
                Bespoke & Bulk Gifting Concierge
              </span>
              <h3 className="heading-md text-primary mb-3">
                Need customized hampers or corporate gifts?
              </h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Connect directly with our gifting stylist for customized wooden keepsakes,
                corporate logos, bulk discounts, and hand-lettered calligraphy cards.
              </p>
            </div>

            <a
              href="https://wa.me/919999999999?text=Hi%20GŌKANA!%20I'd%20like%20assistance%20finding%20the%20perfect%20gift."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent flex-none flex items-center gap-2 py-4 px-8 text-sm whitespace-nowrap"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── The GŌKANA Gifting Standard ── */}
      <section className="section-py border-t border-border/60">
        <div className="container-gokana">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="label-text text-accent mb-3">✦ The GŌKANA Experience</p>
            <h2 className="heading-lg text-primary">Thoughtfully Packaged Perfection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card-premium p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: 'var(--accent-soft)', color: 'var(--primary)' }}>
                <PackageCheck size={26} />
              </div>
              <h4 className="font-serif text-xl font-medium text-primary mb-2">Luxury Rigid Boxes</h4>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Every hamper arrives in custom textured keepsake boxes, wrapped with silk satin ribbon and gold foil seal.
              </p>
            </div>

            <div className="card-premium p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: 'var(--accent-soft)', color: 'var(--primary)' }}>
                <Heart size={26} />
              </div>
              <h4 className="font-serif text-xl font-medium text-primary mb-2">Calligraphy Notes</h4>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Complimentary personalized messages handwritten by calligraphers on 300 GSM handmade cotton paper.
              </p>
            </div>

            <div className="card-premium p-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: 'var(--accent-soft)', color: 'var(--primary)' }}>
                <Truck size={26} />
              </div>
              <h4 className="font-serif text-xl font-medium text-primary mb-2">Guaranteed On-Time Delivery</h4>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Climate-controlled shipping with live tracking so your delicate chocolates and gifts arrive fresh and flawless.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
