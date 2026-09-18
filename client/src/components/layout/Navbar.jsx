import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useCartStore, useWishlistStore, useAuthStore } from '../../store';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
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

  const isHomePage = location.pathname === '/';
  const navBg = scrolled
    ? 'bg-ivory/90 nav-blur shadow-premium border-b border-charcoal/[0.06]'
    : isHomePage
    ? 'bg-transparent'
    : 'bg-ivory/95 nav-blur border-b border-charcoal/[0.06]';

  const textColor = !scrolled && isHomePage ? 'text-ivory' : 'text-charcoal';
  const logoColor = !scrolled && isHomePage ? 'text-ivory' : 'text-charcoal';

  return (
    <>
      <motion.header
        className={clsx(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-600",
          navBg,
        )}
        style={{
          height: scrolled ? "64px" : "80px",
          transition: "height 0.4s ease, background 0.4s ease",
        }}
      >
        <div className="container-gokana h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={clsx(
              "font-serif text-2xl font-light tracking-[0.15em] uppercase transition-colors duration-300",
              logoColor,
            )}
          >
            GŌKANA
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={clsx(
                    "flex items-center gap-1 font-sans text-xs font-medium tracking-[0.1em] uppercase transition-colors duration-300",
                    textColor,
                    location.pathname === link.href
                      ? "text-gold"
                      : "hover:text-gold",
                  )}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown size={12} className="opacity-60" />
                  )}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      className="absolute top-full left-0 mt-4 w-52 bg-ivory shadow-premium-lg border border-charcoal/[0.06]"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div className="py-3">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block px-5 py-2.5 text-xs font-sans font-medium tracking-[0.08em] uppercase text-charcoal/70 hover:text-charcoal hover:bg-champagne/30 transition-colors duration-200"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <IconBtn
              onClick={onSearchOpen}
              label="Search"
              textColor={textColor}
            >
              <Search size={18} strokeWidth={1.5} />
            </IconBtn>

            <Link to="/wishlist" className="relative">
              <IconBtn label="Wishlist" textColor={textColor}>
                <Heart size={18} strokeWidth={1.5} />
                {wishCount > 0 && <CountBadge count={wishCount} />}
              </IconBtn>
            </Link>

            <Link to={user ? "/account" : "/login"}>
              <IconBtn label="Account" textColor={textColor}>
                <User size={18} strokeWidth={1.5} />
              </IconBtn>
            </Link>

            <div className="relative">
              <IconBtn onClick={openCart} label="Cart" textColor={textColor}>
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && <CountBadge count={cartCount} />}
              </IconBtn>
            </div>

            {/* Mobile hamburger */}
            <button
              className={clsx(
                "lg:hidden p-2 transition-colors duration-200",
                textColor,
                "hover:text-gold",
              )}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-ivory flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10">
                <span className="font-serif text-xl tracking-[0.15em] uppercase text-charcoal">
                  GŌKANA
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-charcoal/60 hover:text-charcoal"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-6 py-8">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      to={link.href}
                      className="block py-4 font-serif text-2xl font-light text-charcoal hover:text-gold transition-colors border-b border-charcoal/[0.06]"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="pl-4 pb-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block py-2 font-sans text-sm text-charcoal/60 hover:text-charcoal transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block py-4 font-sans text-sm font-medium text-gold border-b border-charcoal/[0.06]"
                  >
                    Admin Panel
                  </Link>
                )}
              </nav>
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
      className={clsx(
        'relative p-2.5 transition-colors duration-200',
        textColor,
        'hover:text-gold'
      )}
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
      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-ivory text-[9px] font-bold font-sans flex items-center justify-center rounded-full"
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  );
}
