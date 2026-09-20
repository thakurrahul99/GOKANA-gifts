import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { SearchModal } from './components/layout/SearchModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { GiftFinderPage } from './pages/GiftFinderPage';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { FAB } from './components/ui/FAB';

function StorePage() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/gift-finder" element={<GiftFinderPage />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/collections" element={<ShopPage />} />
            <Route path="/collections/:type" element={<ShopPage />} />
            <Route path="/gifts" element={<ShopPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <Footer />
      {location.pathname !== '/gift-finder' && location.pathname !== '/checkout' && <FAB />}
    </>
  );
}

function ContactPage() {
  return (
    <main className="pt-28 min-h-screen bg-bg">
      <div className="container-gokana section-py">
        <div className="max-w-2xl">
          <p className="label-text text-accent mb-5">✦ Get in Touch</p>
          <h1 className="heading-xl text-primary mb-8">We'd love to<br />hear from you.</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            {[
              { label: 'WhatsApp', value: '+91 99999 99999', href: 'https://wa.me/919999999999' },
              { label: 'Email', value: 'hello@gokana.in', href: 'mailto:hello@gokana.in' },
              { label: 'Instagram', value: '@gokana.in', href: '#' },
              { label: 'Working Hours', value: 'Mon–Sat: 9am–7pm', href: null },
            ].map((item) => (
              <div key={item.label}>
                <p className="label-text text-muted mb-2">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="font-serif text-xl text-primary hover:text-accent transition-colors">{item.value}</a>
                ) : (
                  <p className="font-serif text-xl text-primary">{item.value}</p>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-4 max-w-md">
            <input placeholder="Your name" className="input-field" aria-label="Your name" />
            <input placeholder="Email address" type="email" className="input-field" aria-label="Email address" />
            <textarea placeholder="Your message" rows={4} className="input-field resize-none" aria-label="Your message" />
            <button className="btn-primary">Send Message</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="pt-40 min-h-screen bg-bg flex items-center justify-center text-center px-4">
      <div>
        <p className="font-serif text-8xl font-light text-primary/20 mb-4">404</p>
        <h1 className="font-serif text-3xl font-light text-primary mb-4">Page not found</h1>
        <p className="font-sans text-sm text-muted max-w-md mx-auto mb-8 leading-relaxed">
          The curated gift or page you are seeking could not be found or may have moved.
        </p>
        <a href="/" className="btn-primary">Back to Home</a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="coupons" element={<AdminCoupons />} />
        </Route>
        {/* Store routes */}
        <Route path="/*" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
}

function AdminCustomers() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-primary">Customers</h2>
        <p className="text-sm text-muted mt-1">Customer management</p>
      </div>
      <div className="bg-surface border border-border p-8 text-center rounded-xl">
        <div className="mx-auto w-12 h-12 rounded-full bg-blush flex items-center justify-center text-primary"><Users size={22} /></div>
        <p className="text-sm text-text mt-3">Customer management interface is ready for API integration.</p>
      </div>
    </section>
  );
}

function AdminSettings() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-primary">Settings</h2>
        <p className="text-sm text-muted mt-1">Store administration settings</p>
      </div>
      <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
        <div><h3 className="font-semibold text-primary">Store</h3><p className="text-sm text-muted mt-1">GŌKANA luxury gifting store</p></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-border rounded-lg p-4"><p className="text-xs text-muted uppercase tracking-wide">Environment</p><p className="text-sm text-text mt-1">Production</p></div>
          <div className="border border-border rounded-lg p-4"><p className="text-xs text-muted uppercase tracking-wide">Access</p><p className="text-sm text-text mt-1">Administrator</p></div>
        </div>
      </div>
    </section>
  );
}
