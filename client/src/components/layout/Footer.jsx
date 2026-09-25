import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Mail, MessageSquare } from "lucide-react";
import { BUSINESS_INFO } from "../../data/business";

const SvgInstagram = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const SvgFacebook = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const SvgYouTube = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
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
    { label: "WhatsApp: " + BUSINESS_INFO.phone.display, href: BUSINESS_INFO.whatsapp.buildUrl("Hi GŌKANA Gifts! I need help with an order/gift."), isExternal: true },
    { label: "Email: " + BUSINESS_INFO.email.address, href: BUSINESS_INFO.email.mailto, isExternal: true },
    { label: "Track Your Order", href: "/account" },
    { label: "Frequently Asked Questions", href: "/#faq" },
    { label: "Contact & Location", href: "/contact" },
  ],
  Personalisation: [
    { label: "Name Engraving", href: "/#personalisation" },
    { label: "Custom Messages", href: "/#personalisation" },
    { label: "Handwritten Calligraphy", href: "/#personalisation" },
    { label: "Premium Ribbon Wrapping", href: "/#personalisation" },
  ],
  "Shipping & Policies": [
    { label: "Pan India Delivery", href: "/#faq" },
    { label: "Signature Gift Packaging", href: "/#faq" },
    { label: "Replacement & Support", href: "/#faq" },
    { label: "Help & Inquiries", href: "/contact" },
  ],
};

const socials = [
  { Icon: SvgInstagram, href: BUSINESS_INFO.socials.instagram.url, label: BUSINESS_INFO.socials.instagram.label },
  { Icon: SvgFacebook, href: BUSINESS_INFO.socials.facebook.url, label: BUSINESS_INFO.socials.facebook.label },
  { Icon: SvgYouTube, href: BUSINESS_INFO.socials.youtube.url, label: BUSINESS_INFO.socials.youtube.label },
];

export function Footer() {
  return (
    <footer className="bg-primary-dark text-ivory border-t border-border" aria-label="Site Footer">
      {/* Delicate Gold Gradient Hairline */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

      <div className="container-gokana pt-16 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-8 pb-12 sm:pb-14 border-b border-border">
          {/* Brand & Direct Channels Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-4">
            <Link to="/" className="flex flex-col group mb-4">
              <span className="font-serif text-2xl sm:text-3xl font-light tracking-[0.14em] uppercase text-ivory group-hover:text-accent transition-colors">
                {BUSINESS_INFO.brandName}
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.26em] uppercase text-accent font-medium mt-1">
                {BUSINESS_INFO.tagline}
              </span>
            </Link>

            <p className="font-sans text-xs text-muted leading-relaxed max-w-sm mb-5 font-light">
              Thoughtfully chosen. Beautifully wrapped. Meaningfully remembered. Luxury gift hampers, handmade chocolates, and personalised gifts for every special occasion.
            </p>

            {/* Verified Business Details */}
            <div className="space-y-2 mb-6 text-xs text-muted font-light">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-accent flex-shrink-0" />
                <span>{BUSINESS_INFO.location.display}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-accent flex-shrink-0" />
                <span>Support Hours: {BUSINESS_INFO.supportHours.display}</span>
              </div>
            </div>

            {/* Social Channels: Instagram, Facebook & YouTube */}
            <div>
              <p className="font-sans text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-3">
                Connect With Us
              </p>
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
          </div>

          {/* 4 Categorized Columns */}
          {Object.entries(footerColumns).map(([title, items]) => (
            <div key={title} className="col-span-1 md:col-span-1 lg:col-span-2">
              <h4 className="font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-accent mb-3 sm:mb-4">
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
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.brandName}. All rights reserved.</p>
          <p className="font-serif italic text-accent/80 font-light">
            Crafted with love & reverence in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
