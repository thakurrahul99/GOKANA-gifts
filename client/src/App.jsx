import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
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
    <main className="pt-28 min-h-screen bg-[var(--bg)]">
      <div className="container-gokana section-py">
        <div className="max-w-2xl">
          <p className="label-text text-[var(--accent)] mb-5">✦ Get in Touch</p>
          <h1 className="heading-xl text-[var(--primary)] mb-8">We'd love to<br />hear from you.</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            {[
              { label: 'WhatsApp', value: '+91 99999 99999', href: 'https://wa.me/919999999999' },
              { label: 'Email', value: 'hello@gokana.in', href: 'mailto:hello@gokana.in' },
              { label: 'Instagram', value: '@gokana.in', href: '#' },
              { label: 'Working Hours', value: 'Mon–Sat: 9am–7pm', href: null },
            ].map((item) => (
              <div key={item.label}>
                <p className="label-text text-[var(--muted)] mb-2">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="font-serif text-xl text-[var(--primary)] hover:text-[var(--accent)] transition-colors">{item.value}</a>
                ) : (
                  <p className="font-serif text-xl text-[var(--primary)]">{item.value}</p>
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
    <main className="pt-40 min-h-screen bg-[var(--bg)] flex items-center justify-center text-center px-4">
      <div>
        <p className="font-serif text-8xl font-light text-[var(--primary)]/20 mb-4">404</p>
        <h1 className="font-serif text-3xl font-light text-[var(--primary)] mb-4">Page not found</h1>
        <p className="font-sans text-sm text-[var(--muted)] max-w-md mx-auto mb-8 leading-relaxed">
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
          <Route path="customers" element={<AdminCustomersPlaceholder />} />
          <Route path="coupons" element={<AdminCouponsPlaceholder />} />
        </Route>
        {/* Store routes */}
        <Route path="/*" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
}

function AdminCustomersPlaceholder() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">Customers</h2>
      <div className="bg-[var(--surface)] border border-[var(--border)] p-8 text-center text-[var(--muted)] rounded-xl">
        <p className="text-sm">Customer management interface — connect to backend API to populate.</p>
      </div>
    </div>
  );
}

function AdminCouponsPlaceholder() {
  const [coupons, setCoupons] = useState([
    { code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 500, expires: '2025-12-31', used: 142 },
    { code: 'DIWALI25', type: 'percentage', value: 25, minOrder: 1500, expires: '2024-11-15', used: 88 },
    { code: 'FLAT200', type: 'fixed', value: 200, minOrder: 1000, expires: '2025-03-31', used: 34 },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--primary)]">Coupons</h2>
        <button className="btn-primary py-2 px-4 text-xs">
          + Create Coupon
        </button>
      </div>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-[var(--muted)] border-b border-[var(--border)] bg-[var(--surface-alt)]">
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Discount</th>
              <th className="text-left px-4 py-3">Min Order</th>
              <th className="text-left px-4 py-3">Expires</th>
              <th className="text-left px-4 py-3">Used</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {coupons.map(c => (
              <tr key={c.code} className="hover:bg-[var(--surface-alt)] transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-[var(--primary)]">{c.code}</td>
                <td className="px-4 py-3">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="px-4 py-3">₹{c.minOrder}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{c.expires}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{c.used} times</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
