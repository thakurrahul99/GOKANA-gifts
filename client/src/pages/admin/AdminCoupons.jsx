import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Search, Loader2, AlertCircle, RefreshCw, Check, X,
} from 'lucide-react';
import { api } from '../../lib/api';

export function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    description: '',
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  // ── Fetch coupons from backend ─────────────────────────────────────────
  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/coupons', { auth: true });
      setCoupons(data.coupons || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditCoupon(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minOrderAmount: '',
      maxDiscount: '',
      description: '',
      isActive: true,
    });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (coupon) => {
    setEditCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      type: coupon.type || 'percentage',
      value: coupon.value || '',
      minOrderAmount: coupon.minOrderAmount || '',
      maxDiscount: coupon.maxDiscount || '',
      description: coupon.description || '',
      isActive: coupon.isActive ?? true,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError('');
    if (!formData.code.trim()) {
      setFormError('Coupon code is required');
      return;
    }
    if (!formData.value) {
      setFormError('Discount value is required');
      return;
    }

    setFormSaving(true);
    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: Number(formData.value),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        description: formData.description,
        isActive: formData.isActive,
      };

      if (editCoupon) {
        const data = await api.put(`/coupons/${editCoupon._id}`, payload, { auth: true });
        setCoupons((prev) => prev.map((c) => (c._id === editCoupon._id ? data.coupon : c)));
      } else {
        const data = await api.post('/coupons', payload, { auth: true });
        setCoupons((prev) => [data.coupon, ...prev]);
      }

      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.del(`/coupons/${id}`, { auth: true });
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-primary">Coupons</h2>
          <p className="text-sm text-muted mt-0.5">{loading ? 'Loading…' : `${coupons.length} coupons`}</p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-2">
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 px-5 py-4 text-sm mb-5">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            onClick={fetchCoupons}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 underline underline-offset-2 hover:text-error transition-colors"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-surface border border-border text-center py-12">
          <Loader2 size={24} className="mx-auto text-accent animate-spin mb-2" />
          <p className="text-sm text-muted">Loading coupons…</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">
                {editCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-bg transition-colors"
                aria-label="Close"
              >
                <X size={18} className="text-muted" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-xs text-error">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted uppercase">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. WELCOME10"
                  className="w-full mt-1 px-3 py-2 border border-border bg-bg text-text text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted uppercase">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border bg-bg text-text text-sm focus:border-accent"
                  >
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed ₹</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted uppercase">Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full mt-1 px-3 py-2 border border-border bg-bg text-text text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full mt-1 px-3 py-2 border border-border bg-bg text-text text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>

              {formData.type === 'percentage' && (
                <div>
                  <label className="text-xs font-semibold text-muted uppercase">Max Discount Cap (₹, optional)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="e.g. 300"
                    className="w-full mt-1 px-3 py-2 border border-border bg-bg text-text text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted uppercase">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Welcome discount for new users"
                  className="w-full mt-1 px-3 py-2 border border-border bg-bg text-text text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="accent-accent"
                />
                <span className="text-text">Active</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-border">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={formSaving}
                className="px-4 py-2 bg-primary text-surface text-xs font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-40"
              >
                {formSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-surface border border-border rounded-lg overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-muted text-sm">
              {coupons.length === 0 ? 'No coupons yet. Create one to get started.' : 'No coupons match your search.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted border-b border-border bg-bg">
                  <th className="text-left px-4 py-3 font-semibold">Code</th>
                  <th className="text-left px-4 py-3 font-semibold">Discount</th>
                  <th className="text-left px-4 py-3 font-semibold">Min Order</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-center px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-bg transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-primary">{coupon.code}</span>
                      {coupon.description && (
                        <p className="text-xs text-muted mt-0.5">{coupon.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      {coupon.maxDiscount && (
                        <p className="text-xs text-muted mt-0.5">Cap: ₹{coupon.maxDiscount}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text">₹{coupon.minOrderAmount || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded inline-block ${
                        coupon.isActive
                          ? 'bg-accent-soft text-accent-dark'
                          : 'bg-bg text-muted border border-border'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEdit(coupon)}
                          className="p-1.5 text-primary hover:bg-bg transition-colors rounded"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          disabled={deletingId === coupon._id}
                          className="p-1.5 text-red-600 hover:bg-red-50 transition-colors rounded disabled:opacity-40"
                          title="Delete"
                        >
                          {deletingId === coupon._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
