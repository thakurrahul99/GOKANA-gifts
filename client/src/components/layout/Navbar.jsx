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
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";

  // Handle hash links smoothly
  const handleNavClick = (link, e) => {
    if (link.isHash) {
      if (isHomePage) {
        e.preventDefault();
        const elementId = link.href.replace("/#", "");
        const elem = document.getElementById(elementId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate(link.href);
      }
    }
    setMobileOpen(false);
  };

  // Keep the navbar solid and readable over every hero/section background.
  const navClasses = scrolled || !isHomePage
    ? "bg-[var(--surface)] shadow-[0_4px_18px_rgba(11,31,58,0.08)] border-b border-[var(--border)]"
    : "bg-transparent";

  const transparentHomeTop = isHomePage && !scrolled;
  const textColor = transparentHomeTop ? "!text-white" : "!text-[var(--primary)]";
  const logoColor = transparentHomeTop ? "!text-white" : "!text-[var(--primary)]";

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
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={clsx(
                    "relative px-3.5 py-2 font-sans text-[0.72rem] font-semibold tracking-[0.11em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 rounded-md",
                    textColor,
                    isActive
                      ? "text-[var(--accent)]"
                      : "hover:!text-[var(--accent)]",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
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
                "min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-[var(--bg)] hover:!text-[var(--accent)]",
                textColor,
              )}
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishCount} items`}
              className={clsx(
                "relative min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-[var(--bg)] hover:!text-[var(--accent)]",
                textColor,
              )}
            >
              <Heart size={19} strokeWidth={1.8} />
              {wishCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--text)] text-[10px] font-bold font-sans flex items-center justify-center">
                  {wishCount > 9 ? "9+" : wishCount}
                </span>
              )}
            </Link>

            <Link
              to={user ? "/account" : "/login"}
              aria-label={user ? "My Account" : "Sign in to account"}
              className={clsx(
                "min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-[var(--bg)] hover:text-[var(--accent)]",
                textColor,
              )}
            >
              <User size={19} strokeWidth={1.8} />
            </Link>

            <button
              onClick={openCart}
              aria-label={`Open shopping cart, ${cartCount} items`}
              className={clsx(
                "relative min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-[var(--bg)] hover:text-[var(--accent)]",
                textColor,
              )}
            >
              <ShoppingBag size={19} strokeWidth={1.8} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--text)] text-[10px] font-bold font-sans flex items-center justify-center"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className={clsx(
                "lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 hover:bg-[var(--bg)] hover:text-[var(--accent)]",
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
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[var(--bg)] flex flex-col shadow-2xl border-l border-[var(--border)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
                <span className="font-serif text-2xl font-light tracking-[0.15em] uppercase text-[var(--primary)]">
                  GŌKANA
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--primary)] hover:text-[var(--accent)] rounded-lg transition-colors"
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
                    className="block py-4 px-2 font-serif text-2xl font-light text-[var(--primary)] hover:text-[var(--accent)] transition-colors border-b border-[var(--border)]/60"
                  >
                    {link.label}
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-sans text-sm font-semibold tracking-wider uppercase text-[var(--accent)] border-b border-[var(--border)]/60"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>

              <div className="p-6 border-t border-[var(--border)] bg-[var(--surface-alt)]">
                <div className="text-center text-xs font-medium tracking-wide text-[var(--muted)]">
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
