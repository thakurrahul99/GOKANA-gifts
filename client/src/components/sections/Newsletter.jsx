import { MessageCircle, Mail, Sparkles } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { BUSINESS_INFO } from '../../data/business';

export function Newsletter() {
  return (
    <section className="section-py-sm bg-bg-alt text-ivory border-t border-border" aria-labelledby="newsletter-heading">
      <div className="container-gokana">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3 flex items-center justify-center gap-1.5">
              <Sparkles size={13} />
              Stay Inspired
            </p>
          </ScrollReveal>

          <AnimatedHeading id="newsletter-heading" className="heading-lg text-ivory mb-4" delay={0.15}>
            Curated Gifting Insights &amp; Updates
          </AnimatedHeading>

          <ScrollReveal delay={0.25}>
            <p className="font-sans text-sm md:text-base text-muted mb-8 max-w-md mx-auto leading-relaxed font-light">
              Connect directly with our team in Mathura, UP for bespoke hampers, corporate gifting previews, and seasonal festive recommendations.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={BUSINESS_INFO.whatsapp.buildUrl('Hi GŌKANA Gifts! I would like to get updates on upcoming collections & custom hampers.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto py-3.5 px-6 text-xs flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px]"
              >
                <MessageCircle size={15} />
                Connect on WhatsApp
              </a>
              <a
                href={BUSINESS_INFO.email.mailto}
                className="btn-outline w-full sm:w-auto py-3.5 px-6 text-xs flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px]"
              >
                <Mail size={15} />
                Email Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
