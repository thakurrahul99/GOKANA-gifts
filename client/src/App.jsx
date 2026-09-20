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

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { FAB } from './components/ui/FAB';
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
    <section className="space-y-5 text-white">
      <div>
        <h2 className="text-2xl font-semibold text-white">Customers</h2>
        <p className="text-sm text-white/70 mt-1">{customers.length} registered customers</p>
      </div>

      <div className="flex items-center gap-2 bg-primary border border-primary-2 rounded-xl px-4 py-3">
        <Search size={17} className="text-white/60" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none text-sm"
        />
      </div>

      <div className="bg-primary border border-primary-2 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-white/70"><Loader2 className="animate-spin mr-2" size={18} /> Loading customers…</div>
        ) : error ? (
          <div className="py-16 text-center text-red-300 text-sm">{error}</div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-white/70"><Users className="mx-auto mb-3 text-accent" size={28} />No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 text-white/60 text-xs uppercase">
                <tr><th className="text-left px-5 py-4">Customer</th><th className="text-left px-5 py-4">Email</th><th className="text-left px-5 py-4">Phone</th><th className="text-left px-5 py-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-white/5">
                    <td className="px-5 py-4 text-white font-medium">{customer.name}</td>
                    <td className="px-5 py-4 text-white/80">{customer.email}</td>
                    <td className="px-5 py-4 text-white/80">{customer.phone || '—'}</td>
                    <td className="px-5 py-4"><span className="text-xs text-accent">{customer.isActive ? 'Active' : 'Inactive'}</span></td>
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

  const inputClass = 'w-full rounded-lg border border-[#E6DED2] bg-white px-3 py-2.5 text-sm text-[#121212] outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20';

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#121212]">Settings</h2>
        <p className="text-sm text-[#5F6570] mt-1">Manage store preferences and admin notifications.</p>
      </div>

      <div className="bg-white border border-[#E6DED2] rounded-xl p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="font-semibold text-[#121212]">Store Information</h3>
          <p className="text-xs text-[#5F6570] mt-1">These preferences are saved for this admin browser.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <label className="space-y-2"><span className="text-sm font-medium text-[#121212]">Store name</span><input className={inputClass} value={settings.storeName} onChange={(e) => update('storeName', e.target.value)} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-[#121212]">Support email</span><input type="email" className={inputClass} value={settings.supportEmail} onChange={(e) => update('supportEmail', e.target.value)} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-[#121212]">Support phone</span><input className={inputClass} value={settings.supportPhone} onChange={(e) => update('supportPhone', e.target.value)} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-[#121212]">Free shipping above (₹)</span><input type="number" min="0" className={inputClass} value={settings.freeShipping} onChange={(e) => update('freeShipping', e.target.value)} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-[#121212]">Low-stock alert below</span><input type="number" min="0" className={inputClass} value={settings.lowStock} onChange={(e) => update('lowStock', e.target.value)} /></label>
        </div>
      </div>

      <div className="bg-white border border-[#E6DED2] rounded-xl p-6 space-y-4 shadow-sm">
        <div><h3 className="font-semibold text-[#121212]">Notifications</h3><p className="text-xs text-[#5F6570] mt-1">Control which admin alerts are enabled.</p></div>
        {[
          ['orderNotifications', 'New order notifications', 'Show a notification preference for new orders.'],
          ['lowStockNotifications', 'Low-stock notifications', 'Enable low-stock alert preference.'],
        ].map(([key, title, description]) => (
          <label key={key} className="flex items-center justify-between gap-4 rounded-lg border border-[#E6DED2] bg-[#F7F3EC] p-4 cursor-pointer">
            <span><span className="block text-sm font-medium text-[#121212]">{title}</span><span className="block text-xs text-[#5F6570] mt-1">{description}</span></span>
            <input type="checkbox" className="h-5 w-5 accent-[#D4AF37]" checked={settings[key]} onChange={(e) => update(key, e.target.checked)} />
          </label>
        ))}
        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={saveSettings} className="rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#121212] hover:bg-[#B08D57] transition-colors">Save Settings</button>
          <button onClick={resetSettings} className="rounded-lg border border-[#D4AF37] px-5 py-2.5 text-sm font-medium text-[#7A5E00] hover:bg-[#F3D9D4] transition-colors">Reset</button>
          {saved && <span className="self-center text-sm font-medium text-[#7A5E00]">✓ Settings saved</span>}
        </div>
      </div>
    </section>
  );
}
