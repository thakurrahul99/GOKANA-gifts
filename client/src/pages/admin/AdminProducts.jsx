import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, AlertCircle, RefreshCw, X, Upload, Image as ImageIcon, ChevronDown, Check } from 'lucide-react';
import { useAuthStore } from '../../store';
import { formatPrice } from '../../components/ui';
import { API_BASE } from '../../lib/api';

const API = API_BASE;

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
  personalisable: false,
  personalisationFields: [
    { type: 'text', label: "Recipient's Name", placeholder: 'e.g. Radhika Sharma', required: false, options: [] },
    { type: 'textarea', label: 'Handwritten Note Message', placeholder: 'Write your heartfelt words here...', required: false, options: [] },
  ],
  stock: '0',
  thumbnail: '',
  images: '',
  imageFiles: [],
};

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function AdminProducts() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const authHeader = { Authorization: `Bearer ${token}` };

  // ── Fetch products from backend ─────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Open form for Add / Edit ─────────────────────────────────────────────
  const openAdd = () => {
    setEditProduct(null);
    setFormData({ ...EMPTY_FORM, categories: [] });
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
      categories: Array.isArray(product.categories)
        ? product.categories.map((category) => category?._id || category).filter(Boolean)
        : [],
      inStock: product.inStock ?? true,
      isFeatured: product.isFeatured ?? false,
      personalisable: product.personalisable ?? false,
      personalisationFields: product.personalisationFields?.length ? product.personalisationFields : EMPTY_FORM.personalisationFields,
      stock: product.stock ?? 0,
      thumbnail: product.thumbnail || '',
      images: Array.isArray(product.images) ? product.images.join('\\n') : '',
      imageFiles: [],
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
      let imageUrls = formData.images.split(/\n|,/).map(url => url.trim()).filter(Boolean);

      if (formData.imageFiles.length) {
        setUploadingImages(true);
        const uploadData = new FormData();
        formData.imageFiles.forEach((file) => uploadData.append('images', file));

        const uploadRes = await fetch(`${API}/admin/uploads/images`, {
          method: 'POST',
          headers: authHeader,
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.message || 'Image upload failed');

        imageUrls = [...imageUrls, ...(uploadJson.images || []).map((image) => image.url)];
        setUploadingImages(false);
      }

      const payload = {
        ...formData,
        slug: formData.slug || slugify(formData.name),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        badge: formData.badge || null,
        categories: formData.categories || [],
        stock: Number(formData.stock),
        // The admin checkbox is the source of truth for availability.
        // If In Stock is checked while stock is 0, the UI handler keeps stock at 1.
        inStock: Boolean(formData.inStock),
        thumbnail: imageUrls[0] || formData.thumbnail.trim() || undefined,
        images: imageUrls,
        personalisable: Boolean(formData.personalisable),
        personalisationFields: formData.personalisable ? formData.personalisationFields.filter((field) => field.label?.trim()) : [],
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
      setUploadingImages(false);
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
      // Keep inventory logically consistent: an In Stock product must have at least 1 unit.
      ...(key === 'inStock' && val && Number(f.stock) <= 0 ? { stock: 1 } : {}),
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
          <button
            onClick={fetchProducts}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 underline underline-offset-2 hover:text-error transition-colors"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-surface border border-border overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <p className="text-sm">No products found.</p>
              <button onClick={openAdd} className="mt-4 text-xs text-accent hover:underline">Add your first product</button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted font-semibold border-b border-border bg-bg">
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Price</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Badge</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Featured</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(product => (
                  <tr key={product._id} className="hover:bg-bg transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt="" className="w-10 h-10 object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-bg border border-border flex items-center justify-center text-muted text-xs">IMG</div>
                        )}
                        <div>
                          <p className="font-semibold text-primary">{product.name}</p>
                          <p className="text-xs text-muted hidden md:block font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary hidden md:table-cell">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[10px] px-2 py-1 font-semibold border ${product.inStock ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {product.inStock ? `${product.stock ?? 0} in stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-muted">{product.badge || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[10px] px-2 py-1 font-semibold border ${product.isFeatured ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-bg text-muted border-border'}`}>
                        {product.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-muted hover:text-accent transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="Edit product"
                          aria-label="Edit product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product._id}
                          className="p-2 text-muted hover:text-red-600 transition-colors disabled:opacity-50 min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="Delete product"
                          aria-label="Delete product"
                        >
                          {deletingId === product._id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />}
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
          <div className="bg-surface w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="text-lg font-semibold text-primary">
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-primary p-2" aria-label="Close modal">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Stock *</label>
                  <input
                    placeholder="20"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={setF('stock')}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">Thumbnail URL (optional)</label>
                  <input
                    placeholder="Auto-filled after upload"
                    type="url"
                    value={formData.thumbnail}
                    onChange={setF('thumbnail')}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="border border-dashed border-accent/50 rounded-xl p-4 bg-bg">
                <label className="flex items-center gap-2 text-xs text-primary font-semibold mb-2">
                  <ImageIcon size={15} className="text-accent" />
                  Product Images
                </label>
                <label className="flex items-center justify-center gap-2 min-h-[110px] border border-border rounded-lg bg-surface cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => setFormData((f) => ({ ...f, imageFiles: Array.from(e.target.files || []) }))}
                  />
                  <span className="text-sm text-primary flex items-center gap-2">
                    <Upload size={17} className="text-accent" />
                    {formData.imageFiles.length
                      ? `${formData.imageFiles.length} image(s) selected`
                      : 'Select images from your device'}
                  </span>
                </label>
                <p className="text-[11px] text-muted mt-2">JPG, PNG or WebP • up to 8 images • 8 MB each. Images are uploaded to Cloudinary when you save.</p>
                {formData.imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.imageFiles.map((file) => (
                      <span key={file.name + file.size} className="text-[11px] bg-blush text-primary px-2 py-1 rounded">
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Existing Image URLs</label>
                <textarea
                  placeholder="Optional: one URL per line"
                  rows={2}
                  value={formData.images}
                  onChange={setF('images')}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Gift Categories / Occasions</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen((open) => !open)}
                    className="w-full min-h-[44px] border border-gray-200 bg-white px-3 py-2.5 text-sm flex items-center justify-between gap-3 text-left focus:outline-none focus:border-gold"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {formData.categories?.length ? formData.categories.map((id) => {
                        const category = categories.find((item) => item._id === id);
                        return category ? (
                          <span key={id} className="inline-flex items-center gap-1 rounded-full bg-blush px-2 py-1 text-xs text-primary">
                            {category.emoji ? category.emoji + ' ' : ''}{category.name}
                          </span>
                        ) : null;
                      }) : <span className="text-gray-400">Select gift categories…</span>}
                    </div>
                    <ChevronDown size={17} className={categoryDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {categories.length > 0 ? categories.map((category) => {
                        const checked = formData.categories?.includes(category._id);
                        return (
                          <button
                            key={category._id}
                            type="button"
                            onClick={() => setFormData((f) => ({
                              ...f,
                              categories: checked
                                ? (f.categories || []).filter((id) => id !== category._id)
                                : [...(f.categories || []), category._id],
                            }))}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            <span>{category.emoji ? category.emoji + ' ' : ''}{category.name}</span>
                            {checked && <Check size={16} className="text-[#D4AF37]" />}
                          </button>
                        );
                      }) : (
                        <p className="px-3 py-3 text-xs text-muted">No active categories found.</p>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-muted mt-1.5">Dropdown se multiple occasions select kar sakte ho — Birthday, Anniversary, Wedding, New Baby, Housewarming, Graduation, etc.</p>
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

              <div className="rounded-xl border border-accent/30 bg-blush/40 p-4 space-y-3">
                <label className="flex items-center gap-2 text-sm text-primary font-semibold cursor-pointer">
                  <input type="checkbox" checked={formData.personalisable} onChange={setF('personalisable')} className="w-4 h-4 accent-[#D4AF37]" />
                  Enable Personalisation
                </label>
                {formData.personalisable && (
                  <div className="space-y-3">
                    {formData.personalisationFields.map((field, index) => (
                      <div key={index} className="grid grid-cols-[1fr_120px_32px] gap-2 items-end">
                        <div>
                          <label className="block text-[11px] text-muted mb-1">Field label</label>
                          <input value={field.label} onChange={(e) => setFormData((f) => ({ ...f, personalisationFields: f.personalisationFields.map((x, i) => i === index ? { ...x, label: e.target.value } : x) }))} className="w-full border border-border bg-white px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-muted mb-1">Type</label>
                          <select value={field.type} onChange={(e) => setFormData((f) => ({ ...f, personalisationFields: f.personalisationFields.map((x, i) => i === index ? { ...x, type: e.target.value } : x) }))} className="w-full border border-border bg-white px-2 py-2 text-sm">
                            <option value="text">Text</option><option value="textarea">Message</option><option value="select">Select</option>
                          </select>
                        </div>
                        <button type="button" onClick={() => setFormData((f) => ({ ...f, personalisationFields: f.personalisationFields.filter((_, i) => i !== index) }))} className="h-9 border border-border text-muted hover:text-primary">×</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setFormData((f) => ({ ...f, personalisationFields: [...f.personalisationFields, { type: 'text', label: 'Custom Detail', placeholder: '', required: false, options: [] }] }))} className="text-xs font-semibold text-accent-dark hover:text-primary">+ Add personalisation field</button>
                    <p className="text-[11px] text-muted">These fields appear on the product page and are saved with the cart/order.</p>
                  </div>
                )}
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
                {uploadingImages ? 'Uploading images…' : formSaving ? 'Saving…' : editProduct ? 'Update Product' : 'Create Product'}
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
