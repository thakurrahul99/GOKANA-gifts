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
  DELIVERED:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  SHIPPED:    'bg-primary-soft text-primary border border-border',
  PROCESSING: 'bg-amber-50 text-amber-700 border border-amber-200',
  PENDING:    'bg-bg text-muted border border-border',
  CANCELLED:  'bg-red-50 text-red-700 border border-red-200',
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
    <main className="pt-20 min-h-screen bg-bg">
      {/* Midnight Navy top bar */}
      <section className="bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse at 80% 40%, rgba(212,175,55,0.2) 0%, transparent 55%)`,
          }}
        />
        <div className="container-gokana py-12 relative z-10">
          <ScrollReveal>
            <p className="label-text text-accent mb-3 flex items-center gap-2">
              <Sparkles size={13} />
              My Account
            </p>
          </ScrollReveal>
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <ScrollReveal delay={0.1}>
              <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
                <span className="font-serif text-xl text-accent">{initials}</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div>
                <h1 className="font-serif text-2xl font-light text-surface">{profileForm.name || 'Guest'}</h1>
                <p className="font-sans text-sm text-surface/50">{profileForm.email}</p>
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
              <nav className="bg-surface border border-border overflow-hidden shadow-sm">
                {TABS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 font-sans text-sm transition-all duration-200 border-b border-border last:border-0 min-h-[52px] ${
                      activeTab === id
                        ? 'bg-primary text-surface font-semibold'
                        : 'text-text hover:bg-bg hover:text-primary'
                    }`}
                    aria-current={activeTab === id ? 'page' : undefined}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    {label}
                    <ChevronRight
                      size={14}
                      className={`ml-auto transition-opacity ${activeTab === id ? 'opacity-70' : 'opacity-30'}`}
                    />
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 font-sans text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 min-h-[52px]"
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
                <div className="bg-surface border border-border p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-2xl font-light text-primary">Profile Details</h2>
                    <button
                      onClick={() => {
                        if (editMode) handleSaveProfile();
                        else setEditMode(true);
                      }}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 font-sans text-xs font-semibold text-primary border border-border hover:border-accent hover:text-accent transition-colors disabled:opacity-50 min-h-[40px]"
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
                      className={`flex items-center gap-2 font-sans text-sm px-4 py-3 mb-6 ${
                        saveMsgType === 'error'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
                      <div key={key} className="border-b border-border pb-5 last:border-0">
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
                            className="w-full px-4 py-3 bg-bg border border-border text-text text-sm focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all"
                            placeholder={`Enter your ${label.toLowerCase()}`}
                          />
                        ) : (
                          <p className="font-sans text-base text-primary">
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
                      className="mt-5 font-sans text-xs text-muted hover:text-primary transition-colors py-2"
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
                    <h2 className="font-serif text-2xl font-light text-primary">My Orders</h2>
                    <span className="font-sans text-sm text-muted bg-surface border border-border px-3 py-1">
                      {ordersLoading ? 'Loading…' : `${orders.length} orders`}
                    </span>
                  </div>

                  {ordersLoading ? (
                    <div className="bg-surface border border-border p-14 text-center shadow-sm">
                      <Loader2 size={28} className="mx-auto text-accent animate-spin mb-3" />
                      <p className="font-sans text-sm text-muted">Fetching your orders…</p>
                    </div>
                  ) : ordersError ? (
                    <div className="bg-surface border border-border p-10 text-center shadow-sm">
                      <AlertCircle size={30} strokeWidth={1.5} className="mx-auto text-error mb-3" />
                      <p className="font-sans text-sm text-error mb-4">{ordersError}</p>
                      <button onClick={fetchOrders} className="btn-primary">Try Again</button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-surface border border-border p-14 text-center shadow-sm">
                      <Package size={36} strokeWidth={1} className="mx-auto text-muted mb-4" />
                      <h3 className="font-serif text-xl font-light text-primary mb-2">No orders yet</h3>
                      <p className="font-sans text-sm text-muted mb-6">Your order history will appear here once you place your first order.</p>
                      <Link to="/shop" className="btn-primary">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-surface border border-border p-6 hover:border-accent/40 transition-colors shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="font-mono text-sm font-semibold text-primary">{order.orderId}</p>
                              <p className="font-sans text-xs text-muted mt-0.5">
                                {order.createdAt ? dateFmt.format(new Date(order.createdAt)) : ''}
                              </p>
                            </div>
                            <span className={`text-[11px] font-sans font-semibold px-3 py-1.5 uppercase tracking-wider ${STATUS_STYLES[order.status] || STATUS_STYLES.PENDING}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="border-t border-border pt-4 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              {(order.items || []).map((item, i) => (
                                <p key={i} className="font-sans text-sm text-text truncate">
                                  {item.qty}× {item.name}
                                </p>
                              ))}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-serif text-lg text-primary">
                                {formatPrice(order.billing?.total ?? 0)}
                              </p>
                              <p className="font-sans text-xs text-muted">
                                {order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Online'}
                                {order.payment?.status ? ` • ${order.payment.status}` : ''}
                              </p>
                            </div>
                          </div>

                          {order.tracking?.trackingNumber && (
                            <div className="border-t border-border mt-4 pt-3 font-sans text-xs text-muted">
                              Tracking: <span className="text-primary font-medium">{order.tracking.trackingNumber}</span>
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
                    <h2 className="font-serif text-2xl font-light text-primary">Saved Items</h2>
                    {wishlist.length > 0 && (
                      <span className="font-sans text-sm text-muted bg-surface border border-border px-3 py-1">
                        {wishlist.length} items
                      </span>
                    )}
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="bg-surface border border-border p-14 text-center shadow-sm">
                      <Heart size={36} strokeWidth={1} className="mx-auto text-accent/50 mb-4" />
                      <h3 className="font-serif text-xl font-light text-primary mb-2">No saved items</h3>
                      <p className="font-sans text-sm text-muted mb-6">Heart any product to save it here for later.</p>
                      <Link to="/shop" className="btn-primary">Explore Collection</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wishlist.map((product) => (
                        <div key={product.id} className="bg-surface border border-border overflow-hidden group shadow-sm hover:border-accent/40 transition-colors">
                          <Link to={`/products/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-bg">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>
                          <div className="p-4">
                            <p className="font-serif text-sm font-light text-primary mb-1 leading-snug">{product.name}</p>
                            <p className="font-sans text-sm font-semibold text-primary mb-3">{formatPrice(product.price)}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addItem(product, product.variants?.[0])}
                                className="flex-1 text-center py-2.5 bg-primary text-surface font-sans text-[11px] font-semibold tracking-wider uppercase hover:bg-accent hover:text-primary transition-all min-h-[44px]"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => toggle(product)}
                                className="px-2.5 min-w-[44px] flex items-center justify-center border border-border text-muted hover:text-red-500 hover:border-red-300 transition-colors"
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
                <div className="bg-surface border border-border p-8 shadow-sm">
                  <h2 className="font-serif text-2xl font-light text-primary mb-8">Saved Addresses</h2>
                  <div className="border-2 border-dashed border-border p-10 text-center">
                    <MapPin size={32} strokeWidth={1} className="mx-auto text-accent/50 mb-4" />
                    <p className="font-sans text-sm text-text mb-2 font-medium">No saved addresses yet</p>
                    <p className="font-sans text-xs text-muted leading-relaxed">
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
