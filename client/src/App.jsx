import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, Search, Loader2 } from 'lucide-react';
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
import { ContactPage } from './pages/ContactPage';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { FAB } from './components/ui/FAB';
import { SmoothScroll } from './components/common/SmoothScroll';
import { API_BASE } from './lib/api';
import { useAuthStore } from './store';

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



function NotFound() {
  return (
    <main className="pt-40 min-h-screen bg-bg flex items-center justify-center text-center px-4">
      <div>
        <p className="font-serif text-8xl font-light text-accent/20 mb-4">404</p>
        <h1 className="font-serif text-3xl font-light text-ivory mb-4">Page not found</h1>
        <p className="font-sans text-sm text-muted max-w-md mx-auto mb-8 leading-relaxed font-light">
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
      <SmoothScroll />
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
  const { token } = useAuthStore();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError('');
      try {
        const query = search ? `?search=${encodeURIComponent(search)}&limit=100` : '?limit=100';
        const res = await fetch(`${API_BASE}/admin/customers${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load customers');
        setCustomers(data.customers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(loadCustomers, 250);
    return () => clearTimeout(timer);
  }, [token, search]);

  return (
    <section className="space-y-5 text-ivory">
      <div>
        <h2 className="text-2xl font-semibold text-ivory font-serif">Customers</h2>
        <p className="text-sm text-muted mt-1">{customers.length} registered customers</p>
      </div>

      <div className="flex items-center gap-2 bg-bg-alt border border-border rounded-xl px-4 py-3 min-h-[44px]">
        <Search size={17} className="text-muted flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="flex-1 bg-transparent text-ivory placeholder:text-muted/50 outline-none text-sm"
        />
      </div>

      <div className="bg-bg-alt border border-border rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-muted"><Loader2 className="animate-spin mr-2" size={18} /> Loading customers…</div>
        ) : error ? (
          <div className="py-16 text-center text-red-400 text-sm">{error}</div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-muted"><Users className="mx-auto mb-3 text-accent" size={28} />No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="border-b border-border bg-surface-alt text-muted text-xs uppercase">
                <tr><th className="text-left px-3.5 sm:px-5 py-3.5 sm:py-4">Customer</th><th className="text-left px-3.5 sm:px-5 py-3.5 sm:py-4">Email</th><th className="text-left px-3.5 sm:px-5 py-3.5 sm:py-4">Phone</th><th className="text-left px-3.5 sm:px-5 py-3.5 sm:py-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3.5 sm:px-5 py-3.5 sm:py-4 text-ivory font-medium">{customer.name}</td>
                    <td className="px-3.5 sm:px-5 py-3.5 sm:py-4 text-muted">{customer.email}</td>
                    <td className="px-3.5 sm:px-5 py-3.5 sm:py-4 text-muted">{customer.phone || '—'}</td>
                    <td className="px-3.5 sm:px-5 py-3.5 sm:py-4"><span className="text-xs text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/25">{customer.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function AdminSettings() {
  const defaults = {
    storeName: 'GŌKANA',
    supportEmail: 'hello@gokana.in',
    supportPhone: '+91 99999 99999',
    freeShipping: '999',
    lowStock: '5',
    orderNotifications: true,
    lowStockNotifications: true,
  };
  const [settings, setSettings] = useState(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gokana-admin-settings');
      if (stored) setSettings({ ...defaults, ...JSON.parse(stored) });
    } catch {}
  }, []);

  const update = (key, value) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('gokana-admin-settings', JSON.stringify(settings));
    setSaved(true);
  };

  const resetSettings = () => {
    localStorage.removeItem('gokana-admin-settings');
    setSettings(defaults);
    setSaved(false);
  };

  const inputClass = 'w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-ivory outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 min-h-[44px]';

  return (
    <section className="space-y-6 text-ivory">
      <div>
        <h2 className="text-2xl font-semibold text-ivory font-serif">Settings</h2>
        <p className="text-sm text-muted mt-1">Manage store preferences and admin notifications.</p>
      </div>

      <div className="bg-bg-alt border border-border rounded-xl p-4 sm:p-6 space-y-6 shadow-lg">
        <div>
          <h3 className="font-serif text-lg font-light text-ivory">Store Information</h3>
          <p className="text-xs text-muted mt-1">These preferences are saved for this admin browser.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <label className="space-y-2"><span className="text-sm font-medium text-ivory">Store name</span><input className={inputClass} value={settings.storeName} onChange={(e) => update('storeName', e.target.value)} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-ivory">Support email</span><input type="email" className={inputClass} value={settings.supportEmail} onChange={(e) => update('supportEmail', e.target.value)} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-ivory">Support phone</span><input className={inputClass} value={settings.supportPhone} onChange={(e) => update('supportPhone', e.target.value)} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-ivory">Free shipping above (₹)</span><input type="number" min="0" className={inputClass} value={settings.freeShipping} onChange={(e) => update('freeShipping', e.target.value)} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-ivory">Low-stock alert below</span><input type="number" min="0" className={inputClass} value={settings.lowStock} onChange={(e) => update('lowStock', e.target.value)} /></label>
        </div>
      </div>

      <div className="bg-bg-alt border border-border rounded-xl p-4 sm:p-6 space-y-4 shadow-lg">
        <div><h3 className="font-serif text-lg font-light text-ivory">Notifications</h3><p className="text-xs text-muted mt-1">Control which admin alerts are enabled.</p></div>
        {[
          ['orderNotifications', 'New order notifications', 'Show a notification preference for new orders.'],
          ['lowStockNotifications', 'Low-stock notifications', 'Enable low-stock alert preference.'],
        ].map(([key, title, description]) => (
          <label key={key} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface-alt p-3.5 sm:p-4 cursor-pointer hover:border-accent/30 transition-colors min-h-[48px]">
            <span><span className="block text-sm font-medium text-ivory">{title}</span><span className="block text-xs text-muted mt-1">{description}</span></span>
            <input type="checkbox" className="h-5 w-5 accent-accent flex-shrink-0" checked={settings[key]} onChange={(e) => update(key, e.target.checked)} />
          </label>
        ))}
        <div className="flex flex-col xs:flex-row flex-wrap gap-3 pt-2">
          <button onClick={saveSettings} className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-semibold min-h-[44px] inline-flex items-center justify-center">Save Settings</button>
          <button onClick={resetSettings} className="btn-outline py-2.5 px-6 text-xs uppercase tracking-wider font-semibold min-h-[44px] inline-flex items-center justify-center">Reset</button>
          {saved && <span className="self-center text-sm font-medium text-accent">✓ Settings saved</span>}
        </div>
      </div>
    </section>
  );
}
