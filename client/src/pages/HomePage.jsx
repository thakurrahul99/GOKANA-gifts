import { useState, useEffect } from 'react';
import { IntroReveal } from '../components/sections/IntroReveal';
import { Hero } from '../components/sections/Hero';
import { ShopByOccasion } from '../components/sections/ShopByOccasion';
import { Bestsellers } from '../components/sections/Bestsellers';
import { FeaturedCollection } from '../components/sections/FeaturedCollection';
import { PersonalizedGifting } from '../components/sections/PersonalizedGifting';
import { GiftFinder } from '../components/sections/GiftFinder';
import { WhyGokana } from '../components/sections/WhyGokana';
import { Testimonials } from '../components/sections/Testimonials';
import { BrandStory } from '../components/sections/BrandStory';
import { InstagramGrid } from '../components/sections/InstagramGrid';
import { FAQ } from '../components/sections/FAQ';
import { Newsletter } from '../components/sections/Newsletter';
import { FinalCTA } from '../components/sections/FinalCTA';

const INTRO_KEY = 'gokana_intro_shown';

export function HomePage() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Show intro only once per session
    const shown = sessionStorage.getItem(INTRO_KEY);
    if (!shown) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_KEY, '1');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroReveal onComplete={handleIntroComplete} />}
      <main id="main-content" className="bg-[#12100E]">
        {/* 1. Hero with Trust / Value Bar */}
        <Hero />

        {/* 2. Shop by Occasion */}
        <ShopByOccasion />

        {/* 3. Most Adored Bestsellers Carousel */}
        <Bestsellers />

        {/* 4. Signature Collection */}
        <FeaturedCollection />

        {/* 5. Personalise Your Gift */}
        <PersonalizedGifting />

        {/* 6. 4-Step Interactive Gift Finder Quiz */}
        <GiftFinder />

        {/* 7. The GŌKANA Experience */}
        <WhyGokana />

        {/* 8. Customer Reviews */}
        <Testimonials />

        {/* 9. Brand Philosophy & Story */}
        <BrandStory />

        {/* 10. Community Moments Instagram Grid */}
        <InstagramGrid />

        {/* 11. Frequently Asked Questions */}
        <FAQ />

        {/* 12. Private Circle Newsletter */}
        <Newsletter />

        {/* 13. Final Unboxing CTA */}
        <FinalCTA />
      </main>
    </>
  );
}

