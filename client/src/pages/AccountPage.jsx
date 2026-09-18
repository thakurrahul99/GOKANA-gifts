import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Heart, LogOut, ChevronRight, Edit2, Check, Loader2 } from 'lucide-react';
import { useAuthStore, useWishlistStore, useCartStore } from '../store';
import { formatPrice } from '../components/ui';
import { ScrollReveal } from '../components/ui/ScrollReveal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  DELIVERED:  'bg-emerald-50 text-emerald-700',
  SHIPPED:    'bg-sky-50 text-sky-700',
  PROCESSING: 'bg-amber-50 text-amber-700',
  PENDING:    'bg-charcoal/8 text-charcoal/60',
  CANCELLED:  'bg-red-50 text-red-700',
};

const TABS = [
  { id: 'profile',  label: 'Profile',  Icon: User },
  { id: 'orders',   label: 'Orders',   Icon: Package },
  { id: 'wishlist', label: 'Wishlist', Icon: Heart },
  { id: 'address',  label: 'Address',  Icon: MapPin },
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
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  // Sync form if user changes (e.g. after login)
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch(`${API}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      updateUser(data.user);
      setSaveMsg('Profile saved successfully!');
      setEditMode(false);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(`Error: ${err.message}`);
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
    <main className="pt-20 min-h-screen bg-ivory">
      {/* Top bar */}
      <div className="bg-charcoal">
        <div className="container-gokana py-12">
          <ScrollReveal>
            <p className="label-text text-gold/70 mb-3">✦ My Account</p>
          </ScrollReveal>
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <ScrollReveal delay={0.1}>
              <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                <span className="font-serif text-xl text-gold">{initials}</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div>
                <h1 className="font-serif text-2xl font-light text-ivory">{profileForm.name || 'Guest'}</h1>
                <p className="font-sans text-sm text-ivory/40">{profileForm.email}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="container-gokana py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ScrollReveal>
              <nav className="bg-white border border-charcoal/[0.06] overflow-hidden">
                {TABS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 font-sans text-sm transition-all duration-200 border-b border-charcoal/[0.06] last:border-0 ${
                      activeTab === id
                        ? 'bg-charcoal text-ivory'
                        : 'text-charcoal/70 hover:bg-beige/50 hover:text-charcoal'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                    {label}
                    <ChevronRight size={14} className={`ml-auto opacity-40 ${activeTab === id ? 'opacity-60' : ''}`} />
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 font-sans text-sm text-red-500 hover:bg-red-50 transition-colors duration-200"
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
                <div className="bg-white border border-charcoal/[0.06] p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-2xl font-light text-charcoal">Profile Details</h2>
                    <button
                      onClick={() => {
                        if (editMode) {
                          handleSaveProfile();
                        } else {
                          setEditMode(true);
                        }
                      }}
                      disabled={saving}
                      className="flex items-center gap-2 font-sans text-xs text-charcoal/50 hover:text-gold transition-colors disabled:opacity-50"
                    >
                      {saving
                        ? <Loader2 size={14} className="animate-spin" />
                        : editMode ? <Check size={14} /> : <Edit2 size={14} />
                      }
                      {saving ? 'Saving…' : editMode ? 'Save' : 'Edit'}
                    </button>
                  </div>

                  {saveMsg && (
                    <p className={`font-sans text-sm px-4 py-3 mb-6 ${saveMsg.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                      {saveMsg}
                    </p>
                  )}

                  <div className="space-y-6">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', editable: true },
                      { label: 'Email Address', key: 'email', type: 'email', editable: false },
                      { label: 'Phone Number', key: 'phone', type: 'tel', editable: true },
                    ].map(({ label, key, type, editable }) => (
                      <div key={key} className="border-b border-charcoal/[0.06] pb-5">
                        <p className="label-text text-charcoal/40 mb-2">{label}</p>
                        {editMode && editable ? (
                          <input
                            type={type}
                            value={profileForm[key]}
                            onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                            className="input-premium text-sm"
                            placeholder={`Enter your ${label.toLowerCase()}`}
                          />
                        ) : (
                          <p className="font-sans text-base text-charcoal">
                            {profileForm[key] || <span className="text-charcoal/30 italic text-sm">Not added yet</span>}
                            {key === 'email' && editMode && (
                              <span className="ml-2 text-xs text-charcoal/30">(email cannot be changed)</span>
                            )}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {editMode && (
                    <button
                      onClick={() => { setEditMode(false); setSaveMsg(''); }}
                      className="mt-4 font-sans text-xs text-charcoal/40 hover:text-charcoal transition-colors"
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
                    <h2 className="font-serif text-2xl font-light text-charcoal">My Orders</h2>
                    <span className="font-sans text-sm text-charcoal/40">{mockOrders.length} orders</span>
                  </div>

                  {mockOrders.length === 0 ? (
                    <div className="bg-white border border-charcoal/[0.06] p-12 text-center">
                      <Package size={36} strokeWidth={1} className="mx-auto text-charcoal/20 mb-4" />
                      <h3 className="font-serif text-xl font-light text-charcoal mb-2">No orders yet</h3>
                      <p className="font-sans text-sm text-charcoal/50 mb-6">Your order history will appear here.</p>
                      <Link to="/shop" className="btn-primary">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-charcoal/[0.06] p-6 hover:border-charcoal/20 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="font-mono text-sm font-medium text-charcoal">{order.id}</p>
                              <p className="font-sans text-xs text-charcoal/40 mt-0.5">{order.date}</p>
                            </div>
                            <span className={`text-[11px] font-sans font-semibold px-3 py-1.5 uppercase tracking-wider ${STATUS_STYLES[order.status] || STATUS_STYLES.PENDING}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="border-t border-charcoal/[0.06] pt-4 flex items-center justify-between">
                            <div>
                              {order.items.map((item, i) => (
                                <p key={i} className="font-sans text-sm text-charcoal/70">
                                  {item.qty}× {item.name}
                                </p>
                              ))}
                            </div>
                            <div className="text-right">
                              <p className="font-serif text-lg text-charcoal">{formatPrice(order.total)}</p>
                              <Link
                                to={`/orders/${order.id}`}
                                className="font-sans text-xs text-gold hover:text-accent transition-colors"
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
                    <h2 className="font-serif text-2xl font-light text-charcoal">Saved Items</h2>
                    {wishlist.length > 0 && (
                      <span className="font-sans text-sm text-charcoal/40">{wishlist.length} items</span>
                    )}
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="bg-white border border-charcoal/[0.06] p-12 text-center">
                      <Heart size={36} strokeWidth={1} className="mx-auto text-charcoal/20 mb-4" />
                      <h3 className="font-serif text-xl font-light text-charcoal mb-2">No saved items</h3>
                      <p className="font-sans text-sm text-charcoal/50 mb-6">Heart any product to save it here.</p>
                      <Link to="/shop" className="btn-primary">Explore Collection</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wishlist.map((product) => (
                        <div key={product.id} className="bg-white border border-charcoal/[0.06] overflow-hidden group">
                          <Link to={`/products/${product.slug}`} className="block aspect-product overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>
                          <div className="p-4">
                            <p className="font-serif text-sm font-light text-charcoal mb-1 leading-snug">{product.name}</p>
                            <p className="font-sans text-sm font-medium text-charcoal mb-3">{formatPrice(product.price)}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addItem(product, product.variants?.[0])}
                                className="flex-1 text-center py-2 bg-charcoal text-ivory font-sans text-[11px] font-medium tracking-wider uppercase hover:bg-accent transition-colors"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => toggle(product)}
                                className="px-2.5 border border-charcoal/15 text-charcoal/40 hover:text-red-500 hover:border-red-300 transition-colors"
                                title="Remove"
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
                <div className="bg-white border border-charcoal/[0.06] p-8">
                  <h2 className="font-serif text-2xl font-light text-charcoal mb-8">Saved Addresses</h2>
                  <div className="border-2 border-dashed border-charcoal/15 p-8 text-center">
                    <MapPin size={32} strokeWidth={1} className="mx-auto text-charcoal/20 mb-3" />
                    <p className="font-sans text-sm text-charcoal/50 mb-4">No saved addresses yet.</p>
                    <p className="font-sans text-xs text-charcoal/35">
                      Addresses are saved automatically when you place an order.
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
