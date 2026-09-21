import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Gift,
} from 'lucide-react';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Personal Gifting',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
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
              Our support team is here to assist you with custom orders, corporate gifts, tracking, and any special questions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container-gokana py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Direct Support Touchpoints */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-bg-alt border border-border rounded-2xl p-7 shadow-xl">
              <h2 className="font-serif text-2xl font-light text-ivory mb-2">Direct Contact</h2>
              <p className="font-sans text-xs text-muted mb-6 font-light leading-relaxed">
                Connect directly with our team for quick help, recommendations, or custom gifting advice.
              </p>

              <div className="space-y-5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/919999999999?text=Hi%20GŌKANA,%20I%20would%20like%20to%20inquire%20about%20curated%20gifting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl bg-bg border border-border hover:border-accent hover:bg-surface transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs uppercase tracking-wider text-muted font-medium">WhatsApp Support</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">Fast Reply</span>
                    </div>
                    <p className="font-serif text-lg text-ivory group-hover:text-accent transition-colors mt-0.5">+91 99999 99999</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:hello@gokana.in"
                  className="flex items-start gap-4 p-4 rounded-xl bg-bg border border-border hover:border-accent hover:bg-surface transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-xs uppercase tracking-wider text-muted font-medium">Email Support</span>
                    <p className="font-serif text-lg text-ivory group-hover:text-accent transition-colors mt-0.5">hello@gokana.in</p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+919999999999"
                  className="flex items-start gap-4 p-4 rounded-xl bg-bg border border-border hover:border-accent hover:bg-surface transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-xs uppercase tracking-wider text-muted font-medium">Phone Support</span>
                    <p className="font-serif text-lg text-ivory group-hover:text-accent transition-colors mt-0.5">+91 99999 99999</p>
                  </div>
                </a>

                {/* Operating Hours */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-bg border border-border">
                  <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-xs uppercase tracking-wider text-muted font-medium">Working Hours</span>
                    <p className="font-serif text-base text-ivory mt-0.5">Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
                    <p className="text-[11px] text-muted mt-0.5">Orders placed on Sundays dispatched on Monday morning.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Highlight */}
            <div className="bg-bg-alt border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <Building2 size={20} className="text-accent" />
                <h3 className="font-serif text-lg font-light text-ivory">Corporate & Bulk Orders</h3>
              </div>
              <p className="font-sans text-xs text-muted leading-relaxed font-light mb-4">
                Planning celebratory bulk orders or company client gifting? We provide custom logos, branded ribbons, and special bulk pricing.
              </p>
              <div className="flex items-center gap-2 text-xs text-accent font-medium">
                <ShieldCheck size={16} />
                <span>Dedicated account manager for bulk orders</span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-bg-alt border border-border rounded-2xl p-8 sm:p-10 shadow-2xl">
              <div className="mb-8">
                <span className="inline-block text-xs font-semibold tracking-[0.18em] text-accent uppercase mb-2">
                  ✦ GET IN TOUCH
                </span>
                <h2 className="font-serif text-3xl font-light text-ivory mb-2">Send Us a Message</h2>
                <p className="font-sans text-sm text-muted font-light">
                  Fill out the details below and our team will get back to you within 4 business hours.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 px-6 bg-bg border border-accent/40 rounded-xl"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-serif text-2xl text-ivory mb-2">Thank You, {form.name || 'Valued Guest'}</h3>
                  <p className="font-sans text-sm text-muted max-w-md mx-auto mb-6 leading-relaxed">
                    Your message has been received! Our support team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', phone: '', inquiryType: 'Personal Gifting', message: '' });
                    }}
                    className="btn-outline text-xs uppercase tracking-wider py-2.5 px-6"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        placeholder="e.g. Deepti Agarwal"
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
                        <option value="Other">General Question</option>
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center min-h-[48px] uppercase tracking-wider font-semibold text-xs flex items-center gap-2 mt-4"
                  >
                    {loading ? (
                      'Sending Message…'
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center font-sans text-[11px] text-muted pt-2 font-light">
                    ✦ Respect for privacy: Your information is handled securely and never shared.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
