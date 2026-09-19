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
  ShoppingBag,
  Check,
  SlidersHorizontal,
  PackageCheck,
  Heart,
  Truck
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ScrollReveal, AnimatedHeading } from '../components/ui/ScrollReveal';
import { products, occasions } from '../data';
import { formatPrice } from '../components/ui';
import { useCartStore } from '../store';

const STEPS = [
  {
    id: 'occasion',
    title: "Step 1: What's the special occasion?",
    subtitle: 'Every celebration has its own unique sentiment and tradition.',
    options: [
      { id: 'birthday', label: 'Birthday', emoji: '🎂', desc: 'Celebrate their special milestone' },
      { id: 'anniversary', label: 'Anniversary', emoji: '💍', desc: 'Timeless symbols of love' },
      { id: 'wedding', label: 'Wedding / Festive', emoji: '🌺', desc: 'Grand wishes & blessings' },
      { id: 'diwali', label: 'Festive & Diwali', emoji: '🪔', desc: 'Radiance, sweets & prosperity' },
      { id: 'thankyou', label: 'Gratitude & Thanks', emoji: '🙏', desc: 'A heartfelt token of appreciation' },
      { id: 'justbecause', label: 'Just Because', emoji: '💫', desc: 'A pleasant surprise without reason' },
    ],
  },
  {
    id: 'recipient',
    title: 'Step 2: Who are you gifting for?',
    subtitle: 'We tailor aesthetics and selections to their unique vibe.',
    options: [
      { id: 'her', label: 'For Her', emoji: '🌸', desc: 'Elegant botanicals, scents & luxury' },
      { id: 'him', label: 'For Him', emoji: '🎩', desc: 'Sophisticated gourmet, leather & woods' },
      { id: 'couple', label: 'For a Couple', emoji: '💑', desc: 'Romantic and shared memories' },
      { id: 'kids', label: 'For Kids & Teens', emoji: '🎈', desc: 'Playful confections and treats' },
      { id: 'parents', label: 'For Parents', emoji: '🏡', desc: 'Comforting, traditional & warm' },
      { id: 'corporate', label: 'Corporate / Client', emoji: '💼', desc: 'Refined, prestigious & executive' },
    ],
  },
  {
    id: 'budget',
    title: 'Step 3: What is your preferred budget?',
    subtitle: 'Handcrafted luxury designed thoughtfully across every tier.',
    options: [
      { id: 'under-1000', label: 'Under ₹1,000', emoji: '💫', min: 0, max: 1000, desc: 'Petite delights & curated essentials' },
      { id: '1000-2500', label: '₹1,000 – ₹2,500', emoji: '✨', min: 1000, max: 2500, desc: 'Our most popular artisan gift boxes' },
      { id: '2500-5000', label: '₹2,500 – ₹5,000', emoji: '⭐', min: 2500, max: 5000, desc: 'Grand multi-item luxury hampers' },
      { id: 'above-5000', label: '₹5,000 and above', emoji: '💎', min: 5000, max: 999999, desc: 'Bespoke heirloom-grade curations' },
    ],
  },
  {
    id: 'personalisation',
    title: 'Step 4: Would you like personalization?',
    subtitle: 'Add a handwritten touch to transform your gift into a keepsake.',
    options: [
      { id: 'name', label: 'Name / Monogram', emoji: '✍️', desc: 'Laser engraved on keepsake box' },
      { id: 'message', label: 'Calligraphy Card', emoji: '💌', desc: 'Complimentary handwritten letter' },
      { id: 'photo', label: 'Photo Keepsake', emoji: '📷', desc: 'Include a printed memory photograph' },
      { id: 'none', label: 'Standard Luxury Packaging', emoji: '🎁', desc: 'Signature rigid box with satin ribbon' },
    ],
  },
];

const STORAGE_KEY = 'gokana_giftfinder_v2_full';

export function GiftFinderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    occasion: searchParams.get('occasion') || null,
    recipient: searchParams.get('recipient') || null,
    budget: searchParams.get('budget') || null,
    personalisation: searchParams.get('personalisation') || null,
  });
  const [showResults, setShowResults] = useState(false);

  // Restore saved state
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

  // Persist state
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
      setTimeout(() => {
        setShowResults(true);
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 250);
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

  // Compute matched items
  const matchedProducts = useMemo(() => {
    let list = [...products];

    if (selections.occasion) {
      const byOccasion = list.filter((p) => p.categories?.includes(selections.occasion));
      if (byOccasion.length > 0) list = byOccasion;
    }

    if (selections.budget) {
      const budgetObj = STEPS[2].options.find((b) => b.id === selections.budget);
      if (budgetObj) {
        const byBudget = list.filter((p) => p.price >= budgetObj.min && p.price <= budgetObj.max);
        if (byBudget.length > 0) list = byBudget;
      }
    }

    if (selections.personalisation && selections.personalisation !== 'none') {
      const customisable = list.filter((p) => p.personalisable);
      if (customisable.length > 0) list = customisable;
    }

    if (list.length < 3) {
      const remaining = products.filter((p) => !list.some((i) => i.id === p.id));
      list = [...list, ...remaining.slice(0, 4 - list.length)];
    }

    return list;
  }, [selections]);

  const currentStepData = STEPS[currentStep];

  return (
    <main id="main-content" className="min-h-screen pt-24 md:pt-28 bg-[#F7F3EC]">
      {/* ── Page Hero ── */}
      <section className="relative py-16 md:py-20 bg-[#0B1F3A] text-white overflow-hidden">
        <div className="container-gokana text-center relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 mb-5 font-sans text-xs tracking-wider uppercase text-white/50">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D4AF37]">Gift Finder</span>
          </nav>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-sans text-xs font-semibold tracking-widest uppercase mb-4 bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30">
            <Sparkles size={13} />
            Step-by-Step Curation Engine
          </span>

          <h1 className="heading-xl text-white mb-4 max-w-2xl mx-auto">
            Find the Perfect Gift
          </h1>

          <p className="font-sans text-base text-[#C9D2DE] max-w-xl mx-auto leading-relaxed">
            Answer 4 quick questions. Our bespoke concierge algorithm will match you with hand-crafted, beautifully packaged gifts tailored to your recipient.
          </p>
        </div>
      </section>

      {/* ── Stepper Quiz Section ── */}
      <section className="section-py">
        <div className="container-gokana max-w-4xl mx-auto">
          <div className="p-6 md:p-12 rounded-2xl bg-white border border-[#E8DFD3] shadow-lg">
            {/* Header / Progress bar */}
            <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8DFD3]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm font-bold bg-[#F5E9C8] text-[#0B1F3A]">
                  {showResults ? '5' : currentStep + 1}
                </span>
                <div>
                  <p className="font-sans text-xs uppercase tracking-wider text-[#6B6B6B]">
                    {showResults ? 'Completed • Step 5 of 5' : `Step ${currentStep + 1} of 5`}
                  </p>
                  <p className="font-sans text-sm font-semibold text-[#0B1F3A]">
                    {showResults ? 'Your Curated Selection' : currentStepData.title.split(': ')[1]}
                  </p>
                </div>
              </div>

              {(showResults || currentStep > 0) && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 font-sans text-xs font-medium text-[#6B6B6B] hover:text-[#0B1F3A] px-3 py-1.5 rounded-lg border border-[#E8DFD3] hover:bg-[#FBF8F2] transition-colors"
                >
                  <RotateCcw size={13} />
                  Reset Quiz
                </button>
              )}
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((s, idx) => (
                <div
                  key={s}
                  className="flex-1 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      idx < currentStep || showResults
                        ? '#D4AF37'
                        : idx === currentStep
                        ? '#0B1F3A'
                        : '#E8DFD3',
                  }}
                  title={`Step ${s}`}
                />
              ))}
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
                  <h2 className="heading-md text-[#0B1F3A] mb-1">
                    {currentStepData.title}
                  </h2>
                  <p className="font-sans text-sm text-[#6B6B6B] mb-8">
                    {currentStepData.subtitle}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {currentStepData.options.map((opt) => {
                      const isSelected = selections[currentStepData.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelect(currentStepData.id, opt.id)}
                          className={`p-5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                            isSelected
                              ? 'border-[#D4AF37] bg-[#F5E9C8] text-[#0B1F3A] shadow-xs'
                              : 'border-[#E8DFD3] bg-[#FBF8F2] text-[#0B1F3A] hover:border-[#D4AF37]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-3xl p-2 rounded-lg bg-white shadow-xs" aria-hidden="true">
                              {opt.emoji}
                            </span>
                            {isSelected && <CheckCircle2 size={20} className="text-[#D4AF37]" />}
                          </div>
                          <div>
                            <p className="font-sans text-base font-semibold text-[#0B1F3A] mb-1">
                              {opt.label}
                            </p>
                            <p className="font-sans text-xs text-[#6B6B6B] leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Nav Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E8DFD3]">
                    {currentStep > 0 ? (
                      <button
                        onClick={() => setCurrentStep((s) => s - 1)}
                        className="btn-secondary py-2.5 px-5 text-xs flex items-center gap-2"
                      >
                        <ChevronLeft size={16} />
                        Back
                      </button>
                    ) : <div />}

                    <button
                      onClick={handleSkip}
                      className="text-xs text-[#D4AF37] hover:underline font-semibold"
                    >
                      Skip this question →
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Step 5: Curated Results */
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Active Criteria Chips */}
                  <div className="flex flex-wrap items-center gap-2 mb-8 p-4 rounded-xl bg-[#FBF8F2] border border-[#E8DFD3]">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0B1F3A] mr-2 flex items-center gap-1.5">
                      <SlidersHorizontal size={14} />
                      Your Matches:
                    </span>
                    {selections.occasion && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#E8DFD3] text-[#0B1F3A]">
                        Occasion: <b>{STEPS[0].options.find((o) => o.id === selections.occasion)?.label}</b>
                      </span>
                    )}
                    {selections.recipient && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#E8DFD3] text-[#0B1F3A]">
                        Recipient: <b>{STEPS[1].options.find((o) => o.id === selections.recipient)?.label}</b>
                      </span>
                    )}
                    {selections.budget && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#E8DFD3] text-[#0B1F3A]">
                        Budget: <b>{STEPS[2].options.find((o) => o.id === selections.budget)?.label}</b>
                      </span>
                    )}
                    <button
                      onClick={handleReset}
                      className="text-xs text-[#D4AF37] hover:underline font-semibold ml-auto"
                    >
                      Change Preferences
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="heading-md text-[#0B1F3A] mb-1">
                        Curated Gifts For You
                      </h2>
                      <p className="font-sans text-sm text-[#6B6B6B]">
                        Showing {matchedProducts.length} thoughtfully matched presents
                      </p>
                    </div>

                    <Link to="/shop" className="btn-secondary py-2 px-4 text-xs inline-flex items-center gap-2">
                      Explore All Collections
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Product Cards with Live Add to Cart */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    {matchedProducts.map((product, idx) => (
                      <ProductCard key={product.id} product={product} index={idx} />
                    ))}
                  </div>

                  <div className="text-center pt-6 border-t border-[#E8DFD3]">
                    <button
                      onClick={handleReset}
                      className="btn-ghost text-xs inline-flex items-center gap-2 text-[#0B1F3A]"
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

      {/* ── Concierge Support ── */}
      <section className="py-16 bg-[#FBF8F2] border-t border-[#E8DFD3]">
        <div className="container-gokana max-w-4xl">
          <div className="p-8 md:p-10 rounded-2xl bg-white border border-[#E8DFD3] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-[#F3D9D4] text-[#0B1F3A]">
                <MessageCircle size={13} />
                Bespoke & Bulk Gifting Concierge
              </span>
              <h3 className="heading-md text-[#0B1F3A] mb-2">
                Need bespoke curation or corporate hampers?
              </h3>
              <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                Connect directly with our gifting stylist for customized wooden keepsakes, corporate logos, volume discounts, and personalized calligraphy cards.
              </p>
            </div>

            <a
              href="https://wa.me/919999999999?text=Hi%20GŌKANA!%20I'd%20like%20assistance%20curating%20a%20custom%20gift."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent flex items-center gap-2 py-3 px-6 text-xs whitespace-nowrap"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
