import { useState, useEffect } from 'react';
import { IntroReveal } from '../components/sections/IntroReveal';
import { Hero } from '../components/sections/Hero';
import { BrandStory } from '../components/sections/BrandStory';
import { ShopByOccasion } from '../components/sections/ShopByOccasion';
import { FeaturedCollection } from '../components/sections/FeaturedCollection';
import { WhyGokana } from '../components/sections/WhyGokana';
import { PersonalizedGifting } from '../components/sections/PersonalizedGifting';
import { GiftFinder } from '../components/sections/GiftFinder';
import { Bestsellers } from '../components/sections/Bestsellers';
import { Testimonials } from '../components/sections/Testimonials';
import { FAQ } from '../components/sections/FAQ';
import { InstagramGrid } from '../components/sections/InstagramGrid';
import { Newsletter } from '../components/sections/Newsletter';

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
      <main id="main-content">
        <Hero />
        <GiftFinder />
        <BrandStory />
        <ShopByOccasion />
        <FeaturedCollection />
        <WhyGokana />
        <PersonalizedGifting />
        <Bestsellers />
        <Testimonials />
        <FAQ />
        <InstagramGrid />
        <Newsletter />
      </main>
    </>
  );
}
