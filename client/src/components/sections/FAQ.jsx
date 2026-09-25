import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { ScrollReveal, AnimatedHeading } from '../ui/ScrollReveal';
import { BUSINESS_INFO } from '../../data/business';

const faqs = [
  {
    q: 'How long does shipping and delivery take?',
    a: 'We dispatch all non-custom orders within 24 hours. Standard delivery across major Indian cities takes 2–4 business days. Express dispatch is also available at checkout for urgent moments.',
    category: 'Shipping',
  },
  {
    q: 'Can I personalise the gifts with names, photos, or custom messages?',
    a: 'Yes! Every GŌKANA gift includes a complimentary handwritten note card. Many of our gift hampers and keepsakes can also be customised with names and special messages.',
    category: 'Personalisation',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods including UPI (Google Pay, PhonePe, Paytm), Visa, Mastercard, RuPay, NetBanking, and Cash on Delivery (COD) for eligible pin codes.',
    category: 'Payment',
  },
  {
    q: 'What is your replacement and support policy?',
    a: `We inspect every product before dispatch. If your gift arrives damaged or requires assistance, connect with us on WhatsApp (${BUSINESS_INFO.phone.display}) or email ${BUSINESS_INFO.email.address} and our team will resolve it promptly.`,
    category: 'Returns',
  },
  {
    q: 'Do you offer bulk, wedding, or corporate gifting?',
    a: 'Absolutely. We curate custom corporate hampers, festive bulk gifts, and wedding favors with custom branding and volume coordination. Contact our team on WhatsApp for custom options.',
    category: 'Corporate',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="section-py bg-bg" aria-labelledby="faq-heading">
      <div className="container-gokana max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollReveal delay={0.1}>
            <p className="label-text text-accent mb-3">✦ Got Questions?</p>
          </ScrollReveal>
          <AnimatedHeading id="faq-heading" className="heading-lg text-ivory mb-4" delay={0.15}>
            Frequently Asked Questions
          </AnimatedHeading>
          <ScrollReveal delay={0.25}>
            <p className="font-sans text-base text-muted leading-relaxed max-w-lg mx-auto">
              Everything you need to know about our luxury hampers, delivery, and custom options.
            </p>
          </ScrollReveal>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.q}
                className="rounded-xl border border-border bg-bg-alt overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[52px]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="font-serif text-base sm:text-lg md:text-xl font-light text-ivory pr-3 sm:pr-4">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-8 h-8 rounded-full bg-surface-alt border border-border flex items-center justify-center text-accent flex-shrink-0"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6 pt-1 text-xs sm:text-sm font-sans text-muted leading-relaxed border-t border-border">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Help Callout */}
        <div className="mt-12 text-center sm:text-left p-5 sm:p-6 rounded-2xl bg-bg-alt border border-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-center sm:text-left">
            <h4 className="font-serif text-base sm:text-lg font-light text-ivory">
              Still have questions or need a custom gift box?
            </h4>
            <p className="font-sans text-xs text-muted mt-1">
              Our gifting specialists are active {BUSINESS_INFO.supportHours.display} on WhatsApp to assist you.
            </p>
          </div>
          <a
            href={BUSINESS_INFO.whatsapp.buildUrl('Hi GŌKANA Gifts! I have a question about your gifts.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-3 px-5 text-xs whitespace-nowrap flex items-center justify-center w-full sm:w-auto gap-2 min-h-[44px]"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
