import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Package, MapPin, Heart, LogOut, ChevronRight,
  Edit2, Check, Loader2, Sparkles, AlertCircle,
} from 'lucide-react';
import { useAuthStore, useWishlistStore, useCartStore } from '../store';
import { formatPrice } from '../components/ui';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { API_BASE } from '../lib/api';

const API = API_BASE;

// ─── Mock orders (replace with API call later) ─────────────────────────────
const mockOrders = [
  {
    id: 'GKN-A1B2C3',
    date: '12 Sept 2026',
    status: 'DELIVERED',
    total: 3499,
    items: [{ name: 'Grand Celebration Hamper', qty: 1, image: null }],
  },
  {
    id: 'GKN-D4E5F6',
    date: '5 Sept 2026',
    status: 'SHIPPED',
    total: 1899,
    items: [{ name: 'Signature Chocolate Collection', qty: 1, image: null }],
  },
];

const STATUS_STYLES = {
  DELIVERED:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  SHIPPED:    'bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--border)]',
  PROCESSING: 'bg-amber-50 text-amber-700 border border-amber-200',
  PENDING:    'bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)]',
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
      const res = await fetch(`${API}/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save profile');
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
    <main className="pt-20 min-h-screen bg-[var(--bg)]">
      {/* Midnight Navy top bar */}
      <section className="bg-[var(--primary)] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(ellipse at 80% 40%, rgba(212,175,55,0.2) 0%, transparent 55%)`,
          }}
        />
        <div className="container-gokana py-12 relative z-10">
          <ScrollReveal>
            <p className="label-text text-[var(--accent)] mb-3 flex items-center gap-2">
              <Sparkles size={13} />
              My Account
            </p>
          </ScrollReveal>
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <ScrollReveal delay={0.1}>
              <div className="w-16 h-16 rounded-full bg-[var(--accent)]/20 border-2 border-[var(--accent)]/40 flex items-center justify-center">
                <span className="font-serif text-xl text-[var(--accent)]">{initials}</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div>
                <h1 className="font-serif text-2xl font-light text-[var(--surface)]">{profileForm.name || 'Guest'}</h1>
                <p className="font-sans text-sm text-[var(--surface)]/50">{profileForm.email}</p>
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
              <nav className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-sm">
                {TABS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 font-sans text-sm transition-all duration-200 border-b border-[var(--border)] last:border-0 min-h-[52px] ${
                      activeTab === id
                        ? 'bg-[var(--primary)] text-[var(--surface)] font-semibold'
                        : 'text-[var(--text)] hover:bg-[var(--bg)] hover:text-[var(--primary)]'
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
                <div className="bg-[var(--surface)] border border-[var(--border)] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-2xl font-light text-[var(--primary)]">Profile Details</h2>
                    <button
                      onClick={() => {
                        if (editMode) handleSaveProfile();
                        else setEditMode(true);
                      }}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 font-sans text-xs font-semibold text-[var(--primary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors disabled:opacity-50 min-h-[40px]"
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
                      <div key={key} className="border-b border-[var(--border)] pb-5 last:border-0">
                        <label
                          htmlFor={`profile-${key}`}
                          className="block font-sans text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2"
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
                            className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 outline-none transition-all"
                            placeholder={`Enter your ${label.toLowerCase()}`}
                          />
                        ) : (
                          <p className="font-sans text-base text-[var(--primary)]">
                            {profileForm[key] || <span className="text-[var(--text-muted)] italic text-sm">Not added yet</span>}
                            {key === 'email' && editMode && (
                              <span className="ml-2 text-xs text-[var(--text-muted)]">(email cannot be changed)</span>
                            )}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {editMode && (
                    <button
                      onClick={() => { setEditMode(false); setSaveMsg(''); }}
                      className="mt-5 font-sans text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors py-2"
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
                    <h2 className="font-serif text-2xl font-light text-[var(--primary)]">My Orders</h2>
                    <span className="font-sans text-sm text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1">
                      {mockOrders.length} orders
                    </span>
                  </div>

                  {mockOrders.length === 0 ? (
                    <div className="bg-[var(--surface)] border border-[var(--border)] p-14 text-center shadow-sm">
                      <Package size={36} strokeWidth={1} className="mx-auto text-[var(--text-muted)] mb-4" />
                      <h3 className="font-serif text-xl font-light text-[var(--primary)] mb-2">No orders yet</h3>
                      <p className="font-sans text-sm text-[var(--text-muted)] mb-6">Your order history will appear here once you place your first order.</p>
                      <Link to="/shop" className="btn-primary">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[var(--surface)] border border-[var(--border)] p-6 hover:border-[var(--accent)]/40 transition-colors shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="font-mono text-sm font-semibold text-[var(--primary)]">{order.id}</p>
                              <p className="font-sans text-xs text-[var(--text-muted)] mt-0.5">{order.date}</p>
                            </div>
                            <span className={`text-[11px] font-sans font-semibold px-3 py-1.5 uppercase tracking-wider ${STATUS_STYLES[order.status] || STATUS_STYLES.PENDING}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="border-t border-[var(--border)] pt-4 flex items-center justify-between">
                            <div>
                              {order.items.map((item, i) => (
                                <p key={i} className="font-sans text-sm text-[var(--text)]">
                                  {item.qty}× {item.name}
                                </p>
                              ))}
                            </div>
                            <div className="text-right">
                              <p className="font-serif text-lg text-[var(--primary)]">{formatPrice(order.total)}</p>
                              <Link
                                to={`/orders/${order.id}`}
                                className="font-sans text-xs text-[var(--accent)] hover:underline transition-colors"
                              >
                                View Details →
                              </Link>
                            </div>
                          </div>
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
                    <h2 className="font-serif text-2xl font-light text-[var(--primary)]">Saved Items</h2>
                    {wishlist.length > 0 && (
                      <span className="font-sans text-sm text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1">
                        {wishlist.length} items
                      </span>
                    )}
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="bg-[var(--surface)] border border-[var(--border)] p-14 text-center shadow-sm">
                      <Heart size={36} strokeWidth={1} className="mx-auto text-[var(--accent)]/50 mb-4" />
                      <h3 className="font-serif text-xl font-light text-[var(--primary)] mb-2">No saved items</h3>
                      <p className="font-sans text-sm text-[var(--text-muted)] mb-6">Heart any product to save it here for later.</p>
                      <Link to="/shop" className="btn-primary">Explore Collection</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wishlist.map((product) => (
                        <div key={product.id} className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden group shadow-sm hover:border-[var(--accent)]/40 transition-colors">
                          <Link to={`/products/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-[var(--bg)]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>
                          <div className="p-4">
                            <p className="font-serif text-sm font-light text-[var(--primary)] mb-1 leading-snug">{product.name}</p>
                            <p className="font-sans text-sm font-semibold text-[var(--primary)] mb-3">{formatPrice(product.price)}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addItem(product, product.variants?.[0])}
                                className="flex-1 text-center py-2.5 bg-[var(--primary)] text-[var(--surface)] font-sans text-[11px] font-semibold tracking-wider uppercase hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all min-h-[44px]"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => toggle(product)}
                                className="px-2.5 min-w-[44px] flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-300 transition-colors"
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
                <div className="bg-[var(--surface)] border border-[var(--border)] p-8 shadow-sm">
                  <h2 className="font-serif text-2xl font-light text-[var(--primary)] mb-8">Saved Addresses</h2>
                  <div className="border-2 border-dashed border-[var(--border)] p-10 text-center">
                    <MapPin size={32} strokeWidth={1} className="mx-auto text-[var(--accent)]/50 mb-4" />
                    <p className="font-sans text-sm text-[var(--text)] mb-2 font-medium">No saved addresses yet</p>
                    <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed">
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
