import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import clsx from "clsx";
import { useCartStore, useWishlistStore, useAuthStore } from "../../store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Personalisation", href: "/#personalisation", isHash: true },
  { label: "Reviews", href: "/#reviews", isHash: true },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { items: cartItems, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAdmin } = useAuthStore();

  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0);
  const wishCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);

    // Route navigation should always start at the top, except for Home
    // section links which are handled below after the Home page renders.
    if (location.pathname !== "/" || !location.hash) {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      return;
    }

    // React Router handles the route first; then scroll to the requested
    // Home section after its DOM has mounted. This works from every page.
    const hash = location.hash.slice(1);
    if (!hash) return;

    let attempts = 0;
    let timer;

    const scrollToSection = () => {
      const element = document.getElementById(hash);

      if (element) {
        const header = document.querySelector("header");
        const headerOffset = header?.getBoundingClientRect().height ?? 76;
        if (window.lenis) {
          window.lenis.scrollTo(element, { offset: -headerOffset, duration: 1.1 });
        } else {
          const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({
            top,
            behavior: "smooth",
          });
        }
        return;
      }

      attempts += 1;
      if (attempts < 15) {
        timer = window.setTimeout(scrollToSection, 100);
      }
    };

    timer = window.setTimeout(scrollToSection, 50);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const isHomePage = location.pathname === "/";

  // Use React Router for every internal link. Hash links are routed to Home
  // first, then the effect above scrolls to the matching section.
  const handleNavClick = (link, e) => {
    e.preventDefault();
    setMobileOpen(false);
    if (link.label === "Home") {
      navigate("/");
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    if (link.isHash) {
      const hash = link.href.split("#")[1];
      navigate({ pathname: "/", hash: `#${hash}` });
    } else {
      navigate(link.href);
    }
  };

  // Header transitions from transparent overlay to dark espresso on scroll
  const navClasses = scrolled || !isHomePage
    ? "bg-[#12100E]/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] border-b border-[rgba(197,160,89,0.2)]"
    : "bg-transparent border-b border-transparent";

  const transparentHomeTop = isHomePage && !scrolled;
  const textColor = transparentHomeTop ? "!text-white" : "!text-ivory";
  const logoColor = transparentHomeTop ? "!text-white" : "!text-ivory";

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <motion.header
        className={clsx(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          navClasses,
        )}
        style={{
          height: scrolled ? "72px" : "80px",
        }}
      >
        <div className="container-gokana h-full flex items-center justify-between">
          {/* Logo & Tagline */}
          <Link
            to="/"
            className="flex flex-col group py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
            aria-label="GŌKANA Home — Gifts Curated With Love"
          >
            <span
              className={clsx(
                "font-serif text-[1.65rem] md:text-[1.95rem] font-light tracking-[0.14em] uppercase leading-none transition-colors duration-200 group-hover:text-accent",
                logoColor,
              )}
            >
              GŌKANA
            </span>
            <span className="font-sans text-[8px] md:text-[9px] tracking-[0.28em] uppercase text-accent font-medium mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
              Gifts • Curated • With Love
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-2"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = link.isHash
                ? location.pathname === "/" && location.hash === link.href.split("#")[1] ? true : location.pathname === "/" && location.hash === `#${link.href.split("#")[1]}`
                : location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={clsx(
                    "relative px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm",
                    textColor,
                    isActive
                      ? "!text-accent"
                      : "hover:!text-accent",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-accent"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Account, Wishlist, Shopping Bag */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* 1. Search Icon */}
            <button
              onClick={onSearchOpen}
              aria-label="Open search dialog"
              className={clsx(
                "min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent hover:bg-white/5 hover:!text-accent",
                textColor,
              )}
            >
              <Search size={18} strokeWidth={1.8} />
            </button>

            {/* 2. Account Icon */}
            <Link
              to={user ? "/account" : "/login"}
              aria-label={user ? "My Account" : "Sign in to account"}
              className={clsx(
                "min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent hover:bg-white/5 hover:!text-accent",
                textColor,
              )}
            >
              <User size={18} strokeWidth={1.8} />
            </Link>

            {/* 3. Wishlist Icon */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishCount} items`}
              className={clsx(
                "relative min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent hover:bg-white/5 hover:!text-accent",
                textColor,
              )}
            >
              <Heart size={18} strokeWidth={1.8} />
              {wishCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent text-[#12100E] text-[9px] font-bold font-sans flex items-center justify-center">
                  {wishCount > 9 ? "9+" : wishCount}
                </span>
              )}
            </Link>

            {/* 4. Shopping Bag Icon */}
            <button
              onClick={openCart}
              aria-label={`Open shopping cart, ${cartCount} items`}
              className={clsx(
                "relative min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent hover:bg-white/5 hover:!text-accent",
                textColor,
              )}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent text-[#12100E] text-[9px] font-bold font-sans flex items-center justify-center shadow-xs"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className={clsx(
                "lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent hover:bg-white/5 hover:!text-accent",
                textColor,
              )}
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={24} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Slide-in Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <div role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            {/* Backdrop */}
            <motion.div
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in panel from right */}
            <motion.div
              data-lenis-prevent
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-bg flex flex-col shadow-2xl border-l border-border"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(197,160,89,0.2)] bg-[#181512]">
                <span className="font-serif text-2xl font-light tracking-[0.15em] uppercase text-ivory">
                  GŌKANA
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#A39A8E] hover:text-accent rounded-lg transition-colors"
                >
                  <X size={24} strokeWidth={1.8} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-4 bg-[#12100E]">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={(e) => handleNavClick(link, e)}
                    className="block py-4 px-2 font-serif text-2xl font-light text-ivory hover:text-accent transition-colors border-b border-[rgba(197,160,89,0.15)]"
                  >
                    {link.label}
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-sans text-sm font-semibold tracking-wider uppercase text-accent border-b border-[rgba(197,160,89,0.15)]"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>

              <div className="p-6 border-t border-[rgba(197,160,89,0.2)] bg-[#181512]">
                <div className="text-center text-xs font-medium tracking-wide text-[#A39A8E]">
                  Handcrafted & Delivered Across India
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
