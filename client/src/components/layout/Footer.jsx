import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Share2, Video, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const footerLinks = {
  Shop: [
    { label: 'All Gifts', href: '/shop' },
    { label: 'Bestsellers', href: '/collections/bestsellers' },
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: 'Personalized Gifts', href: '/collections/personalized' },
    { label: 'Gift Hampers', href: '/collections/hampers' },
  ],
  Help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Track Order', href: '/track' },
  ],
  Company: [
    { label: 'About GŌKANA', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const socials = [
  { Icon: Globe, href: '#', label: 'Instagram' },
  { Icon: MessageCircle, href: '#', label: 'Facebook' },
  { Icon: Share2, href: '#', label: 'Twitter / X' },
  { Icon: Video, href: '#', label: 'YouTube' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal text-ivory">
      {/* Top wave */}
      <div className="h-px bg-gold/20" />

      <div className="container-gokana py-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-serif text-3xl font-light tracking-[0.15em] uppercase text-ivory mb-6 block">
              GŌKANA
            </Link>
            <p className="font-sans text-sm text-ivory/55 leading-relaxed max-w-xs mb-8">
              Thoughtfully chosen, beautifully gifted. Premium gifting for every moment worth celebrating.
            </p>

            {/* Newsletter */}
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-0 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-white/[0.07] border border-white/[0.12] px-4 py-3 text-sm font-sans text-ivory placeholder-ivory/35 focus:outline-none focus:border-gold transition-colors duration-300"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-gold text-ivory text-xs font-medium tracking-[0.1em] uppercase hover:bg-accent transition-colors duration-300 flex items-center gap-2"
                >
                  Join
                  <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              <p className="text-gold font-serif text-lg italic">
                Welcome to GŌKANA. ✦
              </p>
            )}

            {/* Socials */}
            <div className="flex items-center gap-4 mt-8">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-white/15 flex items-center justify-center text-ivory/50 hover:text-ivory hover:border-gold transition-all duration-300"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-ivory/40 mb-6">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="font-sans text-sm text-ivory/60 hover:text-ivory transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-white/[0.08]">
          <p className="font-sans text-xs text-ivory/35">
            © {new Date().getFullYear()} GŌKANA. All rights reserved. Crafted with love in India.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-sans text-xs text-ivory/25 tracking-widest">✦ THOUGHTFULLY GIFTED ✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
