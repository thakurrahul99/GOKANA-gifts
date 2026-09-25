import { useState } from 'react';
import { IntroReveal } from '../components/sections/IntroReveal';
import { Hero } from '../components/sections/Hero';
import { ShopByOccasion } from '../components/sections/ShopByOccasion';
import { Bestsellers } from '../components/sections/Bestsellers';
import { FeaturedCollection } from '../components/sections/FeaturedCollection';
import { PersonalizedGifting } from '../components/sections/PersonalizedGifting';
import { GiftFinder } from '../components/sections/GiftFinder';
import { WhyGokana } from '../components/sections/WhyGokana';
import { GokanaPromise } from '../components/sections/GokanaPromise';
import { BrandStory } from '../components/sections/BrandStory';
import { InstagramGrid } from '../components/sections/InstagramGrid';
import { Newsletter } from '../components/sections/Newsletter';
import { FinalCTA } from '../components/sections/FinalCTA';

const INTRO_KEY = 'gokana_intro_shown';

function isIntroRequired() {
  try {
    return !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return false;
  }
}

export function HomePage() {
  const [showIntro, setShowIntro] = useState(isIntroRequired);

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      // safe fallback
    }
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroReveal onComplete={handleIntroComplete} />}
      <main id="main-content" className={showIntro ? 'bg-bg invisible' : 'bg-bg'}>
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

        {/* 8. The GŌKANA Promise */}
        <GokanaPromise />

        {/* 9. Brand Philosophy & Story */}
        <BrandStory />

        {/* 10. Community Moments Instagram Grid */}
        <InstagramGrid />

        {/* 11. Stay Connected / Direct Communication */}
        <Newsletter />

        {/* 12. Final Unboxing CTA */}
        <FinalCTA />
      </main>
    </>
  );
}
