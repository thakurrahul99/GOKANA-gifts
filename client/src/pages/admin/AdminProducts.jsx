import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useAuthStore } from '../../store';
import { formatPrice } from '../../components/ui';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EMPTY_FORM = {
  name: '',
  tagline: '',
  description: '',
  slug: '',
  price: '',
  originalPrice: '',
  badge: '',
  inStock: true,
  isFeatured: false,
};

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function AdminProducts() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const authHeader = { Authorization: `Bearer ${token}` };

  // ── Fetch products from backend ─────────────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/products?limit=100`, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Open form for Add / Edit ─────────────────────────────────────────────
  const openAdd = () => {
    setEditProduct(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || '',
      tagline: product.tagline || '',
      description: product.description || '',
      slug: product.slug || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      badge: product.badge || '',
      inStock: product.inStock ?? true,
      isFeatured: product.isFeatured ?? false,
    });
    setFormError('');
    setShowForm(true);
  };

  // ── Save (Create or Update) ──────────────────────────────────────────────
  const handleSave = async () => {
    setFormError('');
    if (!formData.name || !formData.price || !formData.description) {
      setFormError('Name, price and description are required.');
      return;
    }

    setFormSaving(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug || slugify(formData.name),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        badge: formData.badge || null,
      };

      let res;
      if (editProduct) {
        res = await fetch(`${API}/products/${editProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');

      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This will deactivate the product.`)) return;
    setDeletingId(product._id);
    try {
      const res = await fetch(`${API}/products/${product._id}`, {
        method: 'DELETE',
        headers: authHeader,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      // Remove from local list
      setProducts(prev => prev.filter(p => p._id !== product._id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const setF = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(f => ({
      ...f,
      [key]: val,
      // Auto-generate slug only when creating new product
      ...(key === 'name' && !editProduct ? { slug: slugify(val) } : {}),
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal text-ivory text-sm font-medium hover:bg-accent transition-colors"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={24} className="animate-spin mr-3" />
          <span className="text-sm">Loading products…</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 px-5 py-4 text-sm mb-5">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={fetchProducts} className="ml-auto underline text-xs">Retry</button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white border border-gray-100 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">No products found.</p>
              <button onClick={openAdd} className="mt-4 text-xs text-gold hover:underline">Add your first product</button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Price</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Badge</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Featured</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt="" className="w-10 h-10 object-cover rounded-sm" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center text-gray-300 text-xs">IMG</div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-400 hidden md:block font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 hidden md:table-cell">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${product.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{product.badge || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${product.isFeatured ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-400'}`}>
                        {product.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === product._id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />
                          }
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

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 text-sm">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Product Name *</label>
                <input
                  placeholder="e.g. Signature Chocolate Box"
                  value={formData.name}
                  onChange={setF('name')}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Slug (URL) *</label>
                <input
                  placeholder="auto-generated from name"
                  value={formData.slug}
                  onChange={setF('slug')}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Tagline</label>
                <input
                  placeholder="A short catchy line"
                  value={formData.tagline}
                  onChange={setF('tagline')}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Description *</label>
                <textarea
                  placeholder="Detailed description…"
                  rows={3}
                  value={formData.description}
                  onChange={setF('description')}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Price (₹) *</label>
                  <input
                    placeholder="1999"
                    type="number"
                    value={formData.price}
                    onChange={setF('price')}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Original Price (₹)</label>
                  <input
                    placeholder="2499 (optional)"
                    type="number"
                    value={formData.originalPrice}
                    onChange={setF('originalPrice')}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Badge</label>
                <select
                  value={formData.badge}
                  onChange={setF('badge')}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                >
                  <option value="">No badge</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="New">New</option>
                  <option value="Most Loved">Most Loved</option>
                </select>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={setF('inStock')}
                    className="w-4 h-4 accent-charcoal"
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={setF('isFeatured')}
                    className="w-4 h-4 accent-charcoal"
                  />
                  Featured
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={handleSave}
                disabled={formSaving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-charcoal text-ivory text-sm font-medium hover:bg-accent transition-colors disabled:opacity-60"
              >
                {formSaving && <Loader2 size={14} className="animate-spin" />}
                {formSaving ? 'Saving…' : editProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
