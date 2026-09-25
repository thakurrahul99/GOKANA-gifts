import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Sparkles,
  Send,
  ShieldCheck,
  Building2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { BUSINESS_INFO } from '../data/business';

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Personal Gifting',
    message: '',
  });

  const buildWhatsAppInquiry = () => {
    const text = `Hi GŌKANA Gifts! 👋\n\n*New Inquiry*\n👤 Name: ${form.name || 'Not provided'}\n✉️ Email: ${form.email || 'Not provided'}\n📞 Phone: ${form.phone || 'Not provided'}\n🏷️ Topic: ${form.inquiryType}\n\n📝 Message:\n${form.message || 'I would like to inquire about your curated gifting collection.'}`;
    return BUSINESS_INFO.whatsapp.buildUrl(text);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    const subject = `[GŌKANA Inquiry] ${form.inquiryType} - ${form.name || 'Customer'}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nTopic: ${form.inquiryType}\n\nMessage:\n${form.message}`;
    window.location.href = BUSINESS_INFO.email.buildMailto(subject, body);
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    window.open(buildWhatsAppInquiry(), '_blank', 'noopener,noreferrer');
  };

  const inputClass =
    'w-full px-4 py-3.5 bg-bg border border-border rounded-lg text-ivory text-sm placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition-all';

  return (
    <main className="pt-24 min-h-screen bg-bg text-ivory">
      {/* Editorial Luxury Header */}
      <section className="bg-bg-banner text-ivory py-16 sm:py-20 relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse at 70% 30%, rgba(197,160,89,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(197,160,89,0.08) 0%, transparent 50%)`,
          }}
        />
        <div className="container-gokana text-center relative z-10 max-w-2xl mx-auto">
          <ScrollReveal>
            <p className="label-text text-accent mb-3 flex items-center justify-center gap-2 tracking-[0.22em]">
              <Sparkles size={14} />
              CUSTOMER CARE & CUSTOM ORDERS
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="heading-xl text-ivory font-serif">
              We'd Love to <span className="italic text-accent font-light">Hear From You.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-sans text-sm md:text-base text-muted mt-4 leading-relaxed font-light">
              Our support team is here to assist you with custom orders, corporate gifts, tracking, and any special gifting questions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container-gokana py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left Column: Direct Support Touchpoints */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            <div className="bg-bg-alt border border-border rounded-2xl p-5 sm:p-7 shadow-xl">
              <h2 className="font-serif text-xl sm:text-2xl font-light text-ivory mb-2">Direct Contact</h2>
              <p className="font-sans text-xs text-muted mb-5 sm:mb-6 font-light leading-relaxed">
                Connect directly with our team for quick help, recommendations, or custom gifting advice.
              </p>

              <div className="space-y-4 sm:space-y-5">
                {/* WhatsApp */}
                <a
                  href={BUSINESS_INFO.whatsapp.buildUrl("Hi GŌKANA Gifts, I would like to inquire about curated gifting.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-bg border border-border hover:border-accent hover:bg-surface transition-all group min-h-[48px]"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-muted font-medium">WhatsApp Support</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">Fast Reply</span>
                    </div>
                    <p className="font-serif text-base sm:text-lg text-ivory group-hover:text-accent transition-colors mt-0.5">{BUSINESS_INFO.phone.display}</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={BUSINESS_INFO.email.mailto}
                  className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-bg border border-border hover:border-accent hover:bg-surface transition-all group min-h-[48px]"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Mail size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-muted font-medium">Email Support</span>
                    <p className="font-serif text-base sm:text-lg text-ivory group-hover:text-accent transition-colors mt-0.5">{BUSINESS_INFO.email.address}</p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={BUSINESS_INFO.phone.tel}
                  className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-bg border border-border hover:border-accent hover:bg-surface transition-all group min-h-[48px]"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-muted font-medium">Phone Support</span>
                    <p className="font-serif text-base sm:text-lg text-ivory group-hover:text-accent transition-colors mt-0.5">{BUSINESS_INFO.phone.display}</p>
                  </div>
                </a>

                {/* Public Location */}
                <div className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-bg border border-border">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0">
                    <MapPin size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-muted font-medium">Public Location</span>
                    <p className="font-serif text-sm sm:text-base text-ivory mt-0.5">{BUSINESS_INFO.location.display}</p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-bg border border-border">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0">
                    <Clock size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider text-muted font-medium">Customer Support Hours</span>
                    <p className="font-serif text-sm sm:text-base text-ivory mt-0.5">{BUSINESS_INFO.supportHours.display}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Highlight */}
            <div className="bg-bg-alt border border-border rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2.5">
                <Building2 size={18} className="text-accent" />
                <h3 className="font-serif text-base sm:text-lg font-light text-ivory">Corporate & Bulk Orders</h3>
              </div>
              <p className="font-sans text-xs text-muted leading-relaxed font-light mb-3.5">
                Planning celebratory bulk orders or company client gifting? We provide custom branding, personalised ribbons, and special corporate pricing.
              </p>
              <div className="flex items-center gap-2 text-xs text-accent font-medium">
                <ShieldCheck size={15} />
                <span>Dedicated support for custom & bulk orders</span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form with Genuine Functional Dispatch */}
          <div className="lg:col-span-7">
            <div className="bg-bg-alt border border-border rounded-2xl p-5 sm:p-8 md:p-10 shadow-2xl">
              <div className="mb-6 sm:mb-8">
                <span className="inline-block text-xs font-semibold tracking-[0.18em] text-accent uppercase mb-2">
                  ✦ GET IN TOUCH
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-ivory mb-2">Send Us an Inquiry</h2>
                <p className="font-sans text-xs sm:text-sm text-muted font-light">
                  Fill out your details below and choose to send directly via WhatsApp or Email.
                </p>
              </div>

              <form onSubmit={handleSendWhatsApp} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-ivory mb-2 uppercase tracking-wider">
                      Your Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-ivory mb-2 uppercase tracking-wider">
                      Email Address <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@domain.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-ivory mb-2 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold text-ivory mb-2 uppercase tracking-wider">
                      Type of Request
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className={inputClass}
                    >
                      <option value="Personal Gifting">Personal Gifting Help</option>
                      <option value="Corporate Order">Corporate / Bulk Gifting</option>
                      <option value="Custom Hamper">Custom Gift Box</option>
                      <option value="Order Tracking">Order Help / Tracking</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-ivory mb-2 uppercase tracking-wider">
                    Your Message <span className="text-accent">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your occasion, gift requirements, or questions..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="submit"
                    className="btn-primary w-full justify-center min-h-[48px] uppercase tracking-wider font-semibold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    Send via WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="btn-outline w-full justify-center min-h-[48px] uppercase tracking-wider font-semibold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Mail size={16} />
                    Send via Email
                  </button>
                </div>

                <p className="text-center font-sans text-[11px] text-muted pt-2 font-light">
                  ✦ Direct inquiry dispatch: Connects directly with our {BUSINESS_INFO.brandName} customer support team ({BUSINESS_INFO.supportHours.short}).
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
