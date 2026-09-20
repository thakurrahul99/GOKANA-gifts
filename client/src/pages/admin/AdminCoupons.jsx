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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-ivory font-serif">Coupons</h2>
          <p className="text-sm text-[#A39A8E] mt-0.5">{loading ? 'Loading…' : `${coupons.length} coupons`}</p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2.5 px-5 text-xs inline-flex items-center gap-2 uppercase tracking-wider font-semibold">
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/30 text-red-300 px-5 py-4 text-sm mb-5 rounded-lg">
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
        <div className="bg-[#181512] border border-[rgba(197,160,89,0.2)] text-center py-16 rounded-xl shadow-lg">
          <Loader2 size={24} className="mx-auto text-accent animate-spin mb-2" />
          <p className="text-sm text-[#A39A8E]">Loading coupons…</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div data-lenis-prevent className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div data-lenis-prevent className="bg-[#181512] text-ivory border border-[rgba(197,160,89,0.25)] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl overscroll-contain">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(197,160,89,0.18)]">
              <h3 className="text-lg font-serif font-light text-ivory">
                {editCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 text-[#A39A8E] hover:text-accent transition-colors rounded"
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
                <label className="text-xs font-semibold text-[#A39A8E] uppercase tracking-wider">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. WELCOME10"
                  className="w-full mt-1 px-3.5 py-2.5 border border-[rgba(197,160,89,0.25)] bg-[#12100E] text-ivory text-sm focus:border-accent outline-none rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A39A8E] uppercase tracking-wider">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 border border-[rgba(197,160,89,0.25)] bg-[#12100E] text-ivory text-sm focus:border-accent rounded-lg cursor-pointer"
                  >
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed ₹</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A39A8E] uppercase tracking-wider">Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full mt-1 px-3.5 py-2.5 border border-[rgba(197,160,89,0.25)] bg-[#12100E] text-ivory text-sm focus:border-accent outline-none rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A39A8E] uppercase tracking-wider">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full mt-1 px-3.5 py-2.5 border border-[rgba(197,160,89,0.25)] bg-[#12100E] text-ivory text-sm focus:border-accent outline-none rounded-lg"
                />
              </div>

              {formData.type === 'percentage' && (
                <div>
                  <label className="text-xs font-semibold text-[#A39A8E] uppercase tracking-wider">Max Discount Cap (₹, optional)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="e.g. 300"
                    className="w-full mt-1 px-3.5 py-2.5 border border-[rgba(197,160,89,0.25)] bg-[#12100E] text-ivory text-sm focus:border-accent outline-none rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#A39A8E] uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Welcome discount for new users"
                  className="w-full mt-1 px-3.5 py-2.5 border border-[rgba(197,160,89,0.25)] bg-[#12100E] text-ivory text-sm focus:border-accent outline-none rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-ivory">Active</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-[rgba(197,160,89,0.18)]">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-semibold text-[#A39A8E] hover:text-ivory transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={formSaving}
                className="px-5 py-2.5 bg-accent text-[#12100E] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-accent-light transition-colors disabled:opacity-40"
              >
                {formSaving ? 'Saving…' : 'Save Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-[#181512] border border-[rgba(197,160,89,0.2)] rounded-xl overflow-hidden shadow-lg overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-[#A39A8E] text-sm">
              {coupons.length === 0 ? 'No coupons yet. Create one to get started.' : 'No coupons match your search.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#A39A8E] border-b border-[rgba(197,160,89,0.15)] bg-[#1F1A16]">
                  <th className="text-left px-4 py-3.5 font-semibold">Code</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Discount</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Min Order</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Status</th>
                  <th className="text-center px-4 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(197,160,89,0.1)]">
                {filtered.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-accent tracking-wider">{coupon.code}</span>
                      {coupon.description && (
                        <p className="text-xs text-[#A39A8E] mt-0.5">{coupon.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-ivory">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      {coupon.maxDiscount && (
                        <p className="text-xs text-[#A39A8E] mt-0.5">Cap: ₹{coupon.maxDiscount}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-ivory">₹{coupon.minOrderAmount || 0}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded inline-block ${
                        coupon.isActive
                          ? 'bg-accent/15 text-accent border border-accent/30'
                          : 'bg-[#1F1A16] text-[#A39A8E] border border-[rgba(197,160,89,0.2)]'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEdit(coupon)}
                          className="p-1.5 text-ivory hover:text-accent hover:bg-white/5 transition-colors rounded"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          disabled={deletingId === coupon._id}
                          className="p-1.5 text-[#A39A8E] hover:text-red-400 hover:bg-red-400/10 transition-colors rounded disabled:opacity-40"
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
