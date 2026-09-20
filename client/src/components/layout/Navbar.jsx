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
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    // React Router handles the route first; then scroll to the requested
    // Home section after its DOM has mounted. This works from every page.
    const hash = location.hash.slice(1);
    if (!hash) return;

    // The Home page can take longer than one render frame to mount its
    // sections after navigating from Shop/other routes. Keep checking until
    // the requested section exists instead of falling back to the hero.
    let attempts = 0;
    let timer;

    const scrollToSection = () => {
      const element = document.getElementById(hash);

      if (element) {
        // Recalculate while Home finishes laying out so late-loading content
        // cannot push the requested section away from the final position.
        const header = document.querySelector("header");
        const headerOffset = header?.getBoundingClientRect().height ?? 76;
        const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });

        attempts += 1;
        if (attempts < 20) {
          timer = window.setTimeout(scrollToSection, 100);
        }
        return;
      }

      attempts += 1;
      if (attempts < 20) {
        timer = window.setTimeout(scrollToSection, 100);
      }
    };

    timer = window.setTimeout(scrollToSection, 0);
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
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (link.isHash) {
      const hash = link.href.split("#")[1];
      navigate({ pathname: "/", hash: `#${hash}` });
    } else {
      navigate(link.href);
    }
  };

  // Keep the navbar solid and readable over every hero/section background.
  const navClasses = scrolled || !isHomePage
    ? "bg-surface shadow-[0_4px_18px_rgba(11,31,58,0.08)] border-b border-border"
    : "bg-transparent";

  const transparentHomeTop = isHomePage && !scrolled;
  const textColor = transparentHomeTop ? "!text-white" : "!text-primary";
  const logoColor = transparentHomeTop ? "!text-white" : "!text-primary";

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
          height: scrolled ? "72px" : "76px",
        }}
      >
        <div className="container-gokana h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={clsx(
              "font-serif text-[1.75rem] md:text-[2rem] font-medium tracking-[0.12em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 rounded-sm",
              logoColor,
            )}
            aria-label="GŌKANA Home"
          >
            GŌKANA
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1"
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
                    "relative px-3.5 py-2 font-sans text-[0.72rem] font-semibold tracking-[0.11em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 rounded-md",
                    textColor,
                    isActive
                      ? "text-accent"
                      : "hover:!text-accent",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
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

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onSearchOpen}
              aria-label="Open search dialog"
              className={clsx(
                "min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-bg hover:!text-accent",
                textColor,
              )}
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishCount} items`}
              className={clsx(
                "relative min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-bg hover:!text-accent",
                textColor,
              )}
            >
              <Heart size={19} strokeWidth={1.8} />
              {wishCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent text-text text-[10px] font-bold font-sans flex items-center justify-center">
                  {wishCount > 9 ? "9+" : wishCount}
                </span>
              )}
            </Link>

            <Link
              to={user ? "/account" : "/login"}
              aria-label={user ? "My Account" : "Sign in to account"}
              className={clsx(
                "min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-bg hover:text-accent",
                textColor,
              )}
            >
              <User size={19} strokeWidth={1.8} />
            </Link>

            <button
              onClick={openCart}
              aria-label={`Open shopping cart, ${cartCount} items`}
              className={clsx(
                "relative min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-bg hover:text-accent",
                textColor,
              )}
            >
              <ShoppingBag size={19} strokeWidth={1.8} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent text-text text-[10px] font-bold font-sans flex items-center justify-center"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className={clsx(
                "lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-bg hover:text-accent",
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
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <span className="font-serif text-2xl font-light tracking-[0.15em] uppercase text-primary">
                  GŌKANA
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary hover:text-accent rounded-lg transition-colors"
                >
                  <X size={24} strokeWidth={1.8} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={(e) => handleNavClick(link, e)}
                    className="block py-4 px-2 font-serif text-2xl font-light text-primary hover:text-accent transition-colors border-b border-border/60"
                  >
                    {link.label}
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-sans text-sm font-semibold tracking-wider uppercase text-accent border-b border-border/60"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>

              <div className="p-6 border-t border-border bg-surface-alt">
                <div className="text-center text-xs font-medium tracking-wide text-muted">
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
