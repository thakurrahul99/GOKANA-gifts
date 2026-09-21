import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Package, MapPin, Heart, LogOut, ChevronRight,
  Edit2, Check, Loader2, Sparkles, AlertCircle,
} from 'lucide-react';
import { useAuthStore, useWishlistStore, useCartStore } from '../store';
import { formatPrice } from '../components/ui';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { api } from '../lib/api';

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric',
});

const STATUS_STYLES = {
  DELIVERED:  'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30',
  SHIPPED:    'bg-accent/20 text-accent-light border border-accent/30',
  PROCESSING: 'bg-surface-alt text-ivory border border-[rgba(197,160,89,0.25)]',
  PENDING:    'bg-accent/15 text-accent border border-accent/30',
  CANCELLED:  'bg-red-950/60 text-red-300 border border-red-500/30',
};

const TABS = [
  { id: 'profile',  label: 'Profile',   Icon: User },
  { id: 'orders',   label: 'Orders',    Icon: Package },
  { id: 'wishlist', label: 'Wishlist',  Icon: Heart },
  { id: 'address',  label: 'Addresses', Icon: MapPin },
];

export function AccountPage() {
  const { user, token, logout, updateUser } = useAuthStore();
  const { items: wishlist, toggle } = useWishlistStore();
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveMsgType, setSaveMsgType] = useState('success');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // ── Real order history (GET /api/orders/my) ──────────────────────────────
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const data = await api.get('/orders/my', { auth: true });
      setOrders(data.orders || []);
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  }, [token]);

  // Fetched lazily — only when the Orders tab is actually opened.
  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab, fetchOrders]);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!user || !token) navigate('/login');
  }, [user, token, navigate]);

  // Sync form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const data = await api.put(
        '/auth/me',
        { name: profileForm.name, phone: profileForm.phone },
        { auth: true }
      );
      updateUser(data.user);
      setSaveMsgType('success');
      setSaveMsg('Profile saved successfully!');
      setEditMode(false);
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      setSaveMsgType('error');
      setSaveMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const initials = (profileForm.name || 'GU')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (!user) return null;

  return (
    <main className="pt-24 min-h-screen bg-bg text-ivory">
      {/* Luxury Dark Top Bar */}
      <section className="bg-bg-banner relative overflow-hidden border-b border-[rgba(197,160,89,0.2)]">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse at 80% 40%, rgba(197,160,89,0.18) 0%, transparent 55%)`,
          }}
        />
        <div className="container-gokana py-12 relative z-10">
          <ScrollReveal>
            <p className="label-text text-accent mb-3 flex items-center gap-2 tracking-[0.22em]">
              <Sparkles size={13} />
              MY ACCOUNT
            </p>
          </ScrollReveal>
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <ScrollReveal delay={0.1}>
              <div className="w-16 h-16 rounded-full bg-accent/15 border-2 border-accent/40 flex items-center justify-center shadow-lg">
                <span className="font-serif text-xl text-accent">{initials}</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div>
                <h1 className="font-serif text-2xl font-light text-ivory">{profileForm.name || 'Guest'}</h1>
                <p className="font-sans text-sm text-muted">{profileForm.email}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="container-gokana py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <ScrollReveal>
              <nav className="bg-bg-alt border border-[rgba(197,160,89,0.2)] rounded-2xl overflow-hidden shadow-xl">
                {TABS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 font-sans text-sm transition-all duration-200 border-b border-[rgba(197,160,89,0.15)] last:border-0 min-h-[52px] ${
                      activeTab === id
                        ? 'bg-accent/15 text-accent font-semibold border-l-2 border-accent'
                        : 'text-muted hover:bg-white/5 hover:text-ivory'
                    }`}
                    aria-current={activeTab === id ? 'page' : undefined}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    {label}
                    <ChevronRight
                      size={14}
                      className={`ml-auto transition-opacity ${activeTab === id ? 'opacity-80 text-accent' : 'opacity-30'}`}
                    />
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 font-sans text-sm text-red-400 hover:bg-red-950/25 transition-colors duration-200 min-h-[52px]"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  Sign Out
                </button>
              </nav>
            </ScrollReveal>
          </div>

          {/* Main panel */}
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.1}>

              {/* ── Profile Tab ── */}
              {activeTab === 'profile' && (
                <div className="bg-bg-alt border border-[rgba(197,160,89,0.2)] rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-2xl font-light text-ivory">Profile Details</h2>
                    <button
                      onClick={() => {
                        if (editMode) handleSaveProfile();
                        else setEditMode(true);
                      }}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 font-sans text-xs font-semibold text-accent border border-[rgba(197,160,89,0.3)] hover:bg-accent/15 rounded-lg transition-colors disabled:opacity-50 min-h-[40px]"
                    >
                      {saving
                        ? <Loader2 size={14} className="animate-spin" />
                        : editMode ? <Check size={14} /> : <Edit2 size={14} />}
                      {saving ? 'Saving…' : editMode ? 'Save Changes' : 'Edit Profile'}
                    </button>
                  </div>

                  {saveMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-2 font-sans text-sm px-4 py-3 mb-6 rounded-lg ${
                        saveMsgType === 'error'
                          ? 'bg-red-950/40 text-red-300 border border-red-500/30'
                          : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      }`}
                      role="status"
                    >
                      {saveMsgType === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                      {saveMsg}
                    </motion.div>
                  )}

                  <div className="space-y-6">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', editable: true, autocomplete: 'name' },
                      { label: 'Email Address', key: 'email', type: 'email', editable: false, autocomplete: 'email' },
                      { label: 'Phone Number', key: 'phone', type: 'tel', editable: true, autocomplete: 'tel' },
                    ].map(({ label, key, type, editable, autocomplete }) => (
                      <div key={key} className="border-b border-[rgba(197,160,89,0.15)] pb-5 last:border-0">
                        <label
                          htmlFor={`profile-${key}`}
                          className="block font-sans text-xs font-semibold text-muted uppercase tracking-wider mb-2"
                        >
                          {label}
                        </label>
                        {editMode && editable ? (
                          <input
                            id={`profile-${key}`}
                            type={type}
                            value={profileForm[key]}
                            onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                            autoComplete={autocomplete}
                            className="w-full px-4 py-3 bg-bg border border-[rgba(197,160,89,0.25)] rounded-lg text-ivory text-sm focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition-all placeholder:text-muted/50"
                            placeholder={`Enter your ${label.toLowerCase()}`}
                          />
                        ) : (
                          <p className="font-sans text-base text-ivory">
                            {profileForm[key] || <span className="text-muted italic text-sm">Not added yet</span>}
                            {key === 'email' && editMode && (
                              <span className="ml-2 text-xs text-muted">(email cannot be changed)</span>
                            )}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {editMode && (
                    <button
                      onClick={() => { setEditMode(false); setSaveMsg(''); }}
                      className="mt-5 font-sans text-xs text-muted hover:text-accent transition-colors py-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}

              {/* ── Orders Tab ── */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl font-light text-ivory">My Orders</h2>
                    <span className="font-sans text-xs font-semibold text-accent bg-accent/15 border border-accent/30 px-3 py-1 rounded-full uppercase tracking-wider">
                      {ordersLoading ? 'Loading…' : `${orders.length} orders`}
                    </span>
                  </div>

                  {ordersLoading ? (
                    <div className="bg-bg-alt border border-[rgba(197,160,89,0.2)] rounded-2xl p-14 text-center shadow-xl">
                      <Loader2 size={28} className="mx-auto text-accent animate-spin mb-3" />
                      <p className="font-sans text-sm text-muted">Fetching your orders…</p>
                    </div>
                  ) : ordersError ? (
                    <div className="bg-bg-alt border border-red-500/30 rounded-2xl p-10 text-center shadow-xl">
                      <AlertCircle size={30} strokeWidth={1.5} className="mx-auto text-red-400 mb-3" />
                      <p className="font-sans text-sm text-red-300 mb-4">{ordersError}</p>
                      <button onClick={fetchOrders} className="btn-primary">Try Again</button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-bg-alt border border-[rgba(197,160,89,0.2)] rounded-2xl p-14 text-center shadow-xl">
                      <Package size={36} strokeWidth={1} className="mx-auto text-accent/50 mb-4" />
                      <h3 className="font-serif text-xl font-light text-ivory mb-2">No orders yet</h3>
                      <p className="font-sans text-sm text-muted mb-6 font-light">Your order history will appear here once you place your first order.</p>
                      <Link to="/shop" className="btn-primary">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-bg-alt border border-[rgba(197,160,89,0.2)] rounded-2xl p-6 hover:border-accent/40 transition-colors shadow-lg"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="font-mono text-sm font-semibold text-ivory">{order.orderId}</p>
                              <p className="font-sans text-xs text-muted mt-0.5">
                                {order.createdAt ? dateFmt.format(new Date(order.createdAt)) : ''}
                              </p>
                            </div>
                            <span className={`text-[10px] font-sans font-semibold px-3 py-1 uppercase tracking-wider rounded ${STATUS_STYLES[order.status] || STATUS_STYLES.PENDING}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="border-t border-[rgba(197,160,89,0.15)] pt-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              {(order.items || []).map((item, i) => (
                                <p key={i} className="font-sans text-sm text-ivory truncate">
                                  {item.qty}× {item.name}
                                </p>
                              ))}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-serif text-lg text-accent">
                                {formatPrice(order.billing?.total ?? 0)}
                              </p>
                              <p className="font-sans text-xs text-muted">
                                {order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Online'}
                                {order.payment?.status ? ` • ${order.payment.status}` : ''}
                              </p>
                            </div>
                          </div>

                          {order.tracking?.trackingNumber && (
                            <div className="border-t border-[rgba(197,160,89,0.15)] mt-4 pt-3 font-sans text-xs text-muted">
                              Tracking: <span className="text-ivory font-medium">{order.tracking.trackingNumber}</span>
                              {order.tracking.trackingUrl && (
                                <a
                                  href={order.tracking.trackingUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="ml-2 text-accent hover:underline"
                                >
                                  Track →
                                </a>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Wishlist Tab ── */}
              {activeTab === 'wishlist' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl font-light text-ivory">Saved Items</h2>
                    {wishlist.length > 0 && (
                      <span className="font-sans text-xs font-semibold text-accent bg-accent/15 border border-accent/30 px-3 py-1 rounded-full uppercase tracking-wider">
                        {wishlist.length} items
                      </span>
                    )}
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="bg-bg-alt border border-[rgba(197,160,89,0.2)] rounded-2xl p-14 text-center shadow-xl">
                      <Heart size={36} strokeWidth={1} className="mx-auto text-accent/50 mb-4" />
                      <h3 className="font-serif text-xl font-light text-ivory mb-2">No saved items</h3>
                      <p className="font-sans text-sm text-muted mb-6 font-light">Heart any product to save it here for later.</p>
                      <Link to="/shop" className="btn-primary">Explore Collection</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wishlist.map((product) => (
                        <div key={product.id} className="bg-bg-alt border border-[rgba(197,160,89,0.2)] rounded-xl overflow-hidden group shadow-md hover:border-accent/40 transition-colors">
                          <Link to={`/products/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-bg">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                            />
                          </Link>
                          <div className="p-4">
                            <p className="font-serif text-sm font-light text-ivory mb-1 leading-snug truncate">{product.name}</p>
                            <p className="font-sans text-sm font-semibold text-accent mb-3">{formatPrice(product.price)}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addItem(product, product.variants?.[0])}
                                className="btn-primary flex-1 text-center py-2 font-sans text-[11px] font-semibold tracking-wider uppercase min-h-[38px]"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => toggle(product)}
                                className="px-2.5 min-w-[38px] flex items-center justify-center border border-[rgba(197,160,89,0.25)] rounded text-muted hover:text-red-400 hover:border-red-400/50 hover:bg-red-950/20 transition-colors"
                                title={`Remove ${product.name} from wishlist`}
                                aria-label={`Remove ${product.name} from wishlist`}
                              >
                                <Heart size={14} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Address Tab ── */}
              {activeTab === 'address' && (
                <div className="bg-bg-alt border border-[rgba(197,160,89,0.2)] rounded-2xl p-8 shadow-xl">
                  <h2 className="font-serif text-2xl font-light text-ivory mb-8">Saved Addresses</h2>
                  <div className="border-2 border-dashed border-[rgba(197,160,89,0.25)] rounded-xl p-10 text-center bg-bg">
                    <MapPin size={32} strokeWidth={1} className="mx-auto text-accent mb-4" />
                    <p className="font-sans text-sm text-ivory mb-2 font-medium">No saved addresses yet</p>
                    <p className="font-sans text-xs text-muted leading-relaxed font-light">
                      Delivery addresses are automatically saved when you place an order, so you never have to re-enter them.
                    </p>
                  </div>
                </div>
              )}

            </ScrollReveal>
          </div>
        </div>
      </div>
    </main>
  );
}
