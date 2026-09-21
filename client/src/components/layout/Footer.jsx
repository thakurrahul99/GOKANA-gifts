import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const SvgInstagram = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const SvgPinterest = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.133-1.867 3.133-4.562 0-2.387-1.715-4.057-4.163-4.057-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.775.741 2.276a.3.3 0 0 1 .069.285c-.075.314-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.938.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
  </svg>
);

const footerColumns = {
  Shop: [
    { label: "All Gifts & Hampers", href: "/shop" },
    { label: "Birthday Gifts", href: "/shop?occasion=birthday" },
    { label: "Anniversary Gifts", href: "/shop?occasion=anniversary" },
    { label: "Wedding Gifts", href: "/shop?occasion=wedding" },
    { label: "Festive Hampers", href: "/shop?occasion=festive" },
    { label: "Corporate Gifting", href: "/contact" },
  ],
  "Customer Care": [
    { label: "WhatsApp Gift Support", href: "https://wa.me/919999999999", isExternal: true },
    { label: "Track Your Order", href: "/account" },
    { label: "Frequently Asked Questions", href: "/#faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  Personalisation: [
    { label: "Name Engraving", href: "/#personalisation" },
    { label: "Custom Messages", href: "/#personalisation" },
    { label: "Handwritten Calligraphy", href: "/#personalisation" },
    { label: "Premium Ribbon Wrapping", href: "/#personalisation" },
  ],
  "Shipping & Returns": [
    { label: "Pan India Express Delivery", href: "/#faq" },
    { label: "Carefully Packed Dispatch", href: "/#faq" },
    { label: "Signature Gift Box Packaging", href: "/#faq" },
    { label: "7-Day Easy Returns Policy", href: "/#faq" },
  ],
};

const socials = [
  { Icon: SvgInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: SvgPinterest, href: "https://pinterest.com", label: "Pinterest" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-primary-dark text-ivory border-t border-border" aria-label="Site Footer">
      {/* Delicate Gold Gradient Hairline */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

      <div className="container-gokana pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-border">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex flex-col group mb-4">
              <span className="font-serif text-3xl font-light tracking-[0.14em] uppercase text-ivory group-hover:text-accent transition-colors">
                GŌKANA
              </span>
              <span className="font-sans text-[9px] tracking-[0.26em] uppercase text-accent font-medium mt-1">
                Gifts • Curated • With Love
              </span>
            </Link>

            <p className="font-sans text-xs text-muted leading-relaxed max-w-sm mb-6 font-light">
              Thoughtfully chosen. Beautifully wrapped. Meaningfully remembered. Luxury gift hampers, handmade chocolates, and personalized gifts for every special occasion.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="font-sans text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-1.5">
                Join the GŌKANA Circle
              </p>
              <p className="font-sans text-xs text-muted mb-3 font-light">
                Receive private collection previews, gifting reminders, and festive privileges.
              </p>

              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-2" noValidate>
                  <div className="flex rounded-[4px] overflow-hidden border border-border-light focus-within:border-accent transition-colors">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                      placeholder="Enter your email address"
                      className="flex-1 bg-bg-alt px-4 py-2.5 text-xs text-ivory placeholder-[#6E665C] focus:outline-none min-h-[44px]"
                      aria-label="Email for newsletter"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 bg-accent text-bg font-sans text-xs font-semibold uppercase tracking-[0.14em] hover:bg-accent-light transition-colors flex items-center gap-1.5 min-h-[44px] cursor-pointer"
                      aria-label="Subscribe to newsletter"
                    >
                      Join <ArrowRight size={13} />
                    </button>
                  </div>
                  {error && <p className="text-xs text-[#E5C378] font-medium mt-1" role="alert">{error}</p>}
                </form>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-[4px] bg-bg-alt border border-accent/40 text-accent text-xs" role="status" aria-live="polite">
                  <CheckCircle2 size={15} />
                  <span>Welcome to GŌKANA. You're on our private list.</span>
                </div>
              )}
            </div>

            {/* Social Channels: Instagram & Pinterest */}
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-border bg-bg-alt flex items-center justify-center text-accent hover:text-bg hover:bg-accent hover:border-accent transition-all cursor-pointer"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* 4 Categorized Columns */}
          {Object.entries(footerColumns).map(([title, items]) => (
            <div key={title} className="lg:col-span-2">
              <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-accent transition-colors font-light"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-muted hover:text-accent transition-colors font-light"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Craft Statement */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-2">
          <p>© {new Date().getFullYear()} GŌKANA Luxury Gifts. All rights reserved.</p>
          <p className="font-serif italic text-accent/80 font-light">
            Crafted with love & reverence in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
