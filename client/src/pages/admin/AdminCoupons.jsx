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
    <div className="text-ivory">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-ivory font-serif">Coupons</h2>
          <p className="text-sm text-muted mt-0.5">{loading ? 'Loading…' : `${coupons.length} coupons`}</p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2.5 px-5 text-xs inline-flex items-center justify-center gap-2 uppercase tracking-wider font-semibold w-full sm:w-auto min-h-[44px]">
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/30 text-red-300 px-4 sm:px-5 py-3.5 sm:py-4 text-sm mb-5 rounded-lg">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            onClick={fetchCoupons}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-red-300 underline underline-offset-2 hover:text-red-200 transition-colors"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-bg-alt border border-border text-center py-16 rounded-xl shadow-lg">
          <Loader2 size={24} className="mx-auto text-accent animate-spin mb-2" />
          <p className="text-sm text-muted">Loading coupons…</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div data-lenis-prevent className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4">
          <div data-lenis-prevent className="bg-bg-alt text-ivory border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl overscroll-contain">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <h3 className="text-lg font-serif font-light text-ivory">
                {editCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-muted hover:text-accent transition-colors rounded min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs text-red-300">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. WELCOME10"
                  className="w-full mt-1 px-3.5 py-2.5 border border-border bg-bg text-ivory text-sm focus:border-accent outline-none rounded-lg min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 border border-border bg-bg text-ivory text-sm focus:border-accent rounded-lg cursor-pointer min-h-[44px]"
                  >
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed ₹</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full mt-1 px-3.5 py-2.5 border border-border bg-bg text-ivory text-sm focus:border-accent outline-none rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full mt-1 px-3.5 py-2.5 border border-border bg-bg text-ivory text-sm focus:border-accent outline-none rounded-lg min-h-[44px]"
                />
              </div>

              {formData.type === 'percentage' && (
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider">Max Discount Cap (₹, optional)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="e.g. 300"
                    className="w-full mt-1 px-3.5 py-2.5 border border-border bg-bg text-ivory text-sm focus:border-accent outline-none rounded-lg min-h-[44px]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Welcome discount for new users"
                  className="w-full mt-1 px-3.5 py-2.5 border border-border bg-bg text-ivory text-sm focus:border-accent outline-none rounded-lg min-h-[44px]"
                />
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer pt-1 min-h-[36px]">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-ivory">Active</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-border">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-ivory transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={formSaving}
                className="px-5 py-2.5 bg-accent text-bg text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-accent-light transition-colors disabled:opacity-40 min-h-[44px] inline-flex items-center justify-center"
              >
                {formSaving ? 'Saving…' : 'Save Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-bg-alt border border-border rounded-xl overflow-hidden shadow-lg overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-muted text-sm">
              {coupons.length === 0 ? 'No coupons yet. Create one to get started.' : 'No coupons match your search.'}
            </div>
          ) : (
            <table className="w-full text-sm min-w-[540px]">
              <thead>
                <tr className="text-xs text-muted border-b border-border bg-surface-alt">
                  <th className="text-left px-4 py-3.5 font-semibold">Code</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Discount</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Min Order</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Status</th>
                  <th className="text-center px-4 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-accent tracking-wider">{coupon.code}</span>
                      {coupon.description && (
                        <p className="text-xs text-muted mt-0.5">{coupon.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-ivory">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      {coupon.maxDiscount && (
                        <p className="text-xs text-muted mt-0.5">Cap: ₹{coupon.maxDiscount}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-ivory">₹{coupon.minOrderAmount || 0}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded inline-block ${
                        coupon.isActive
                          ? 'bg-accent/15 text-accent border border-accent/30'
                          : 'bg-surface-alt text-muted border border-border'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEdit(coupon)}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-ivory hover:text-accent hover:bg-white/5 transition-colors rounded"
                          title="Edit"
                          aria-label="Edit coupon"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          disabled={deletingId === coupon._id}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors rounded disabled:opacity-40"
                          title="Delete"
                          aria-label="Delete coupon"
                        >
                          {deletingId === coupon._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
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
