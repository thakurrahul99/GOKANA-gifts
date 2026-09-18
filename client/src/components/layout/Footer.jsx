import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
  </svg>
);

const footerLinks = {
  Shop: [
    { label: 'All Gifts', href: '/shop' },
    { label: 'Bestsellers', href: '/collections/bestsellers' },
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: 'Personalized Gifts', href: '/collections/personalized' },
    { label: 'Gift Hampers', href: '/collections/hampers' },
    { label: 'Gift Finder', href: '/gift-finder' },
  ],
  Help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Track Order', href: '/track' },
  ],
  About: [
    { label: 'About GŌKANA', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Sustainability', href: '/about#sustainability' },
    { label: 'Blog', href: '/blog' },
  ],
  Contact: [
    { label: 'hello@gokana.in', href: 'mailto:hello@gokana.in', icon: Mail },
    { label: '+91 99999 99999', href: 'https://wa.me/919999999999', icon: Phone },
    { label: '@gokana.in on Instagram', href: '#', icon: InstagramIcon },
    { label: 'Mon–Sat: 9am–7pm', href: null, icon: MapPin },
  ],
};

const socials = [
  { Icon: InstagramIcon, href: '#', label: 'Follow us on Instagram' },
  { Icon: FacebookIcon, href: '#', label: 'Like us on Facebook' },
  { Icon: TwitterIcon, href: '#', label: 'Follow us on Twitter' },
  { Icon: YoutubeIcon, href: '#', label: 'Watch us on YouTube' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer style={{ background: 'var(--primary)', color: '#FFFFFF' }} role="contentinfo">
      {/* Top accent line */}
      <div style={{ height: '1px', background: 'rgba(212,175,55,0.3)' }} />

      <div className="container-gokana py-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="font-serif text-3xl font-light tracking-[0.15em] uppercase mb-6 block focus-visible:outline-none focus-visible:rounded"
              style={{ color: '#FFFFFF' }}
              aria-label="GŌKANA — Home"
            >
              GŌKANA
            </Link>
            <p className="font-sans text-sm leading-relaxed max-w-xs mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Thoughtfully chosen, beautifully gifted. Premium gifting for every moment worth celebrating.
            </p>

            {/* Newsletter */}
            {!subscribed ? (
              <form onSubmit={handleSubscribe} noValidate aria-label="Newsletter signup">
                <label htmlFor="footer-email" className="font-sans text-xs font-medium tracking-[0.15em] uppercase mb-3 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Join our newsletter
                </label>
                <div className="flex max-w-sm">
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="Your email address"
                    className="flex-1 py-3 px-4 font-sans text-sm focus:outline-none transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRight: 'none',
                      color: '#FFFFFF',
                      borderRadius: '8px 0 0 8px',
                    }}
                    required
                    autoComplete="email"
                    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'newsletter-error' : undefined}
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 font-sans text-xs font-semibold tracking-[0.1em] uppercase flex items-center gap-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      background: 'var(--accent)',
                      color: '#121212',
                      borderRadius: '0 8px 8px 0',
                      '--tw-ring-color': '#FFFFFF',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-dark)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; }}
                  >
                    Join
                    <ArrowRight size={14} />
                  </button>
                </div>
                {error && (
                  <p id="newsletter-error" className="font-sans text-xs mt-2" style={{ color: '#FCA5A5' }} role="alert">
                    {error}
                  </p>
                )}
              </form>
            ) : (
              <p className="font-serif text-lg italic" style={{ color: 'var(--accent)' }}>
                Welcome to GŌKANA. ✦
              </p>
            )}

            {/* Socials */}
            <div className="flex items-center gap-3 mt-8" aria-label="Social media links">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center transition-all duration-300 rounded-lg focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.5)',
                    '--tw-ring-color': 'var(--accent)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'rgba(212,175,55,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.background = '';
                  }}
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link
                        to={link.href}
                        className="font-sans text-sm flex items-center gap-2 transition-colors duration-200 focus-visible:outline-none focus-visible:rounded"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                      >
                        {link.icon && <link.icon size={12} style={{ opacity: 0.5, flexShrink: 0 }} />}
                        {link.label}
                      </Link>
                    ) : (
                      <span className="font-sans text-sm flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {link.icon && <link.icon size={12} style={{ opacity: 0.5, flexShrink: 0 }} />}
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-sans text-xs mb-3 tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                SECURE PAYMENTS
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {['VISA', 'MC', 'UPI', 'GPay', 'PayTM', 'NetBanking'].map((method) => (
                  <span
                    key={method}
                    className="font-sans text-[10px] font-semibold px-2.5 py-1.5 rounded"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2" aria-label="Trust badges">
              <span className="font-sans text-[10px] tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
                ✦ THOUGHTFULLY GIFTED ✦
              </span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-8">
            <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              © {new Date().getFullYear()} GŌKANA. All rights reserved. Crafted with love in India.
            </p>
            <div className="flex items-center gap-5 flex-wrap">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Refund Policy', href: '/returns' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="font-sans text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:rounded"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
