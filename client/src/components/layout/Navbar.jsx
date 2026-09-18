import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, Gift } from 'lucide-react';
import clsx from 'clsx';
import { useCartStore, useWishlistStore, useAuthStore } from '../../store';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Gift Finder', href: '/gift-finder' },
  {
    label: 'Collections',
    href: '/collections',
    children: [
      { label: 'New Arrivals', href: '/collections/new-arrivals' },
      { label: 'Bestsellers', href: '/collections/bestsellers' },
      { label: 'Personalized Gifts', href: '/collections/personalized' },
      { label: 'Gift Hampers', href: '/collections/hampers' },
    ],
  },
  {
    label: 'Gifts',
    href: '/gifts',
    children: [
      { label: 'Birthday', href: '/shop?occasion=birthday' },
      { label: 'Anniversary', href: '/shop?occasion=anniversary' },
      { label: 'Wedding', href: '/shop?occasion=wedding' },
      { label: 'Diwali', href: '/shop?occasion=diwali' },
      { label: 'Corporate', href: '/shop?occasion=corporate' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const location = useLocation();
  const { items: cartItems, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAdmin } = useAuthStore();

  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0);
  const wishCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Focus trap in mobile drawer
  useEffect(() => {
    if (mobileOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [mobileOpen]);

  // Close drawer on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isHomePage = location.pathname === '/';
  const transparent = !scrolled && isHomePage;

  const navStyle = {
    background: scrolled
      ? 'rgba(247,243,236,0.92)'
      : isHomePage
      ? 'transparent'
      : 'rgba(247,243,236,0.96)',
    backdropFilter: scrolled || !isHomePage ? 'blur(20px) saturate(180%)' : 'none',
    borderBottom: !transparent ? '1px solid var(--border-soft)' : 'none',
    boxShadow: scrolled ? '0 2px 8px rgba(11,31,58,0.04)' : 'none',
  };

  const textColor = transparent ? '#FFFFFF' : 'var(--primary)';

  return (
    <>
      {/* Skip to content */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <motion.header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{
          ...navStyle,
          height: scrolled ? '64px' : '80px',
          transition: 'height 0.4s ease, background 0.4s ease, box-shadow 0.4s ease',
        }}
        role="banner"
      >
        <div className="container-gokana h-full flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-2xl font-light tracking-[0.15em] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:rounded"
            style={{ color: textColor, '--tw-ring-color': 'var(--accent)' }}
            aria-label="GŌKANA — Home"
          >
            GŌKANA
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href ||
                (link.href !== '/' && location.pathname.startsWith(link.href));
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={clsx(
                      'flex items-center gap-1 font-sans text-xs font-medium tracking-[0.1em] uppercase transition-all duration-200 py-1 relative focus-visible:outline-none focus-visible:rounded',
                    )}
                    style={{
                      color: isActive ? 'var(--accent)' : textColor,
                      '--tw-ring-color': 'var(--accent)',
                    }}
                    onFocus={() => link.children && setActiveDropdown(link.label)}
                  >
                    {link.label === 'Gift Finder' && (
                      <Gift size={12} className="opacity-80" />
                    )}
                    {link.label}
                    {link.children && <ChevronDown size={12} className="opacity-60" />}
                    {/* Active indicator */}
                    {isActive && (
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-0.5"
                        style={{ background: 'var(--accent)' }}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        className="absolute top-full left-0 mt-4 w-52 shadow-premium-lg rounded-xl overflow-hidden"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        role="menu"
                      >
                        <div className="py-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              role="menuitem"
                              className="block px-4 py-2.5 font-sans text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-200 focus-visible:outline-none"
                              style={{ color: 'var(--muted)' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--accent-soft)';
                                e.currentTarget.style.color = 'var(--primary)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '';
                                e.currentTarget.style.color = 'var(--muted)';
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-0.5">
            <IconBtn onClick={onSearchOpen} label="Search" textColor={textColor}>
              <Search size={18} strokeWidth={1.5} />
            </IconBtn>

            <Link to="/wishlist" className="relative">
              <IconBtn label={`Wishlist${wishCount > 0 ? ` (${wishCount} items)` : ''}`} textColor={textColor}>
                <Heart size={18} strokeWidth={1.5} />
                {wishCount > 0 && <CountBadge count={wishCount} />}
              </IconBtn>
            </Link>

            <Link to={user ? '/account' : '/login'}>
              <IconBtn label={user ? 'My Account' : 'Sign In'} textColor={textColor}>
                <User size={18} strokeWidth={1.5} />
              </IconBtn>
            </Link>

            <div className="relative">
              <IconBtn
                onClick={openCart}
                label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
                textColor={textColor}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && <CountBadge count={cartCount} />}
              </IconBtn>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2.5 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
              style={{ color: textColor, '--tw-ring-color': 'var(--accent)', minWidth: '44px', minHeight: '44px' }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(11,31,58,0.6)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 flex flex-col"
              style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <Link
                  to="/"
                  className="font-serif text-xl tracking-[0.15em] uppercase"
                  style={{ color: 'var(--primary)' }}
                >
                  GŌKANA
                </Link>
                <button
                  ref={closeButtonRef}
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
                  style={{ color: 'var(--muted)', '--tw-ring-color': 'var(--accent)', minWidth: '44px', minHeight: '44px' }}
                  aria-label="Close navigation menu"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Mobile navigation">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <div key={link.href}>
                      <Link
                        to={link.href}
                        aria-current={isActive ? 'page' : undefined}
                        className="flex items-center gap-2 py-4 font-serif text-2xl font-light transition-colors focus-visible:outline-none"
                        style={{
                          color: isActive ? 'var(--accent)' : 'var(--primary)',
                          borderBottom: '1px solid var(--border-soft)',
                        }}
                      >
                        {link.label === 'Gift Finder' && <Gift size={20} />}
                        {link.label}
                      </Link>
                      {link.children && (
                        <div className="pl-4 pb-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className="block py-2 font-sans text-sm transition-colors focus-visible:outline-none"
                              style={{ color: 'var(--muted)' }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block py-4 font-sans text-sm font-medium focus-visible:outline-none"
                    style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border-soft)' }}
                  >
                    Admin Panel
                  </Link>
                )}
              </nav>

              {/* Drawer footer */}
              <div className="px-6 py-5" style={{ borderTop: '1px solid var(--border)' }}>
                <Link
                  to="/gift-finder"
                  className="btn-accent w-full justify-center text-center flex"
                >
                  <Gift size={16} />
                  Find the Perfect Gift
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({ children, onClick, label, textColor }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 flex items-center justify-center"
      style={{
        color: textColor,
        '--tw-ring-color': 'var(--accent)',
        minWidth: '44px',
        minHeight: '44px',
        padding: '10px',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = textColor; }}
    >
      {children}
    </button>
  );
}

function CountBadge({ count }) {
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      className="absolute -top-0.5 -right-0.5 w-4 h-4 font-sans font-bold flex items-center justify-center rounded-full"
      style={{
        fontSize: '9px',
        background: 'var(--accent)',
        color: '#121212',
      }}
      aria-hidden="true"
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  );
}
