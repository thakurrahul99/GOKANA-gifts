import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

// Inline SVG social icons (lucide-react dropped Instagram/Facebook/Twitter/Pinterest)
const SvgInstagram = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const SvgFacebook = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const SvgTwitterX = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const SvgPinterest = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.133-1.867 3.133-4.562 0-2.387-1.715-4.057-4.163-4.057-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.775.741 2.276a.3.3 0 0 1 .069.285c-.075.314-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.938.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
  </svg>
);

const footerColumns = {
  Shop: [
    { label: "All Curated Gifts", href: "/shop" },
    { label: "Gift Finder Assistant", href: "/gift-finder" },
    { label: "Bestselling Hampers", href: "/shop?sort=rating" },
    { label: "Birthday Gifts", href: "/shop?occasion=birthday" },
    { label: "Anniversary Keepsakes", href: "/shop?occasion=anniversary" },
    { label: "Festive & Diwali", href: "/shop?occasion=diwali" },
  ],
  Help: [
    { label: "Track Your Order", href: "/account" },
    { label: "Shipping & Delivery", href: "/#faq" },
    { label: "Returns & Replacements", href: "/#faq" },
    { label: "Frequently Asked Questions", href: "/#faq" },
    {
      label: "Bespoke Concierge",
      href: "https://wa.me/919999999999",
      isExternal: true,
    },
  ],
  About: [
    { label: "Our Philosophy", href: "/about" },
    { label: "Artisans & Craft", href: "/about#craft" },
    { label: "Sustainable Packaging", href: "/about#packaging" },
    { label: "Customer Reviews", href: "/#reviews" },
    { label: "Corporate Gifting", href: "/contact" },
  ],
  Contact: [
    {
      label: "hello@gokana.in",
      href: "mailto:hello@gokana.in",
      isExternal: true,
    },
    { label: "+91 99999 99999", href: "tel:+919999999999", isExternal: true },
    {
      label: "WhatsApp Concierge",
      href: "https://wa.me/919999999999",
      isExternal: true,
    },
    { label: "Mon – Sat, 9am – 7pm IST", href: null },
    { label: "Mumbai, Maharashtra, India", href: null },
  ],
};

const socials = [
  { Icon: SvgInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: SvgFacebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: SvgTwitterX, href: "https://x.com", label: "X (Twitter)" },
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
    <footer
      className="bg-[var(--primary)] text-[var(--surface)] border-t border-[var(--surface)]/10"
      aria-label="Site Footer"
    >
      {/* Top Gold Accent Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40" />

      <div className="container-gokana pt-16 pb-12">
        {/* Main Grid: Brand + 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand & Newsletter Column (4 cols) */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="font-serif text-3xl font-light tracking-[0.15em] uppercase text-[var(--surface)] mb-4 block hover:text-[var(--accent)] transition-colors"
            >
              GŌKANA
            </Link>
            <p className="font-sans text-sm text-[#C9D2DE] leading-relaxed max-w-sm mb-6">
              Thoughtfully chosen, beautifully gifted. Luxury gifting curations,
              artisanal treats, and bespoke keepsakes for every milestone worth
              celebrating.
            </p>

            {/* Newsletter Subscription */}
            <div className="mb-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-2">
                Join the GŌKANA Circle
              </p>
              <p className="font-sans text-xs text-[#C9D2DE]/80 mb-3">
                Receive secret previews, gifting reminders, and festive offers.
              </p>

              {!subscribed ? (
                <form
                  onSubmit={handleSubscribe}
                  className="space-y-2"
                  noValidate
                >
                  <div className="flex rounded-lg overflow-hidden border border-[var(--surface)]/20 focus-within:border-[var(--accent)] transition-colors">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter your email"
                      className="flex-1 bg-[var(--surface)]/5 px-4 py-3 text-sm text-[var(--surface)] placeholder-[var(--surface)]/40 focus:outline-none min-h-[44px]"
                      aria-label="Email for newsletter"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 bg-[var(--accent)] text-[var(--text)] font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[var(--accent-dark)] transition-colors flex items-center gap-1.5 min-h-[44px]"
                      aria-label="Subscribe to newsletter"
                    >
                      Join
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  {error && (
                    <p
                      className="text-xs text-[var(--blush)] font-medium mt-1"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </form>
              ) : (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg bg-[var(--surface)]/10 text-[var(--accent)] text-sm"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2 size={16} />
                  <span>Welcome to GŌKANA. You're on the list!</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-[var(--surface)]/15 flex items-center justify-center text-[#C9D2DE] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--surface)]/5 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1: Shop (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)] mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerColumns.Shop.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="font-sans text-sm text-[#C9D2DE] hover:text-[#D4AF37] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Help (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)] mb-4">
              Help
            </h4>
            <ul className="space-y-2.5">
              {footerColumns.Help.map((item) => (
                <li key={item.label}>
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-[#C9D2DE] hover:text-[#D4AF37] transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="font-sans text-sm text-[#C9D2DE] hover:text-[#D4AF37] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: About (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)] mb-4">
              About
            </h4>
            <ul className="space-y-2.5">
              {footerColumns.About.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="font-sans text-sm text-[#C9D2DE] hover:text-[#D4AF37] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 4: Contact (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)] mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C9D2DE]">
              {footerColumns.Contact.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}
                      className="hover:text-[#D4AF37] transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Payment Badges + Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#C9D2DE]/70">
          {/* Payment Methods Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs font-medium text-[#C9D2DE] mr-2">
              100% Secure Checkout:
            </span>
            <span className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white font-semibold text-[11px]">
              UPI
            </span>
            <span className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white font-semibold text-[11px]">
              Visa
            </span>
            <span className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white font-semibold text-[11px]">
              Mastercard
            </span>
            <span className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white font-semibold text-[11px]">
              RuPay
            </span>
            <span className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white font-semibold text-[11px]">
              NetBanking
            </span>
          </div>

          {/* Copyright & Legal Links */}
          <div className="flex flex-wrap items-center gap-4 text-center md:text-right">
            <span>
              © {new Date().getFullYear()} GŌKANA Gifting Private Limited. All
              rights reserved.
            </span>
            <div className="flex items-center gap-3 text-[#C9D2DE]">
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <span>•</span>
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Refund & Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
