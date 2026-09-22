import { useState, useEffect, useCallback } from 'react';
import {
  Search, ChevronDown, ChevronUp, Loader2, AlertCircle, RefreshCw, Check,
} from 'lucide-react';
import { formatPrice } from '../../components/ui';
import { api } from '../../lib/api';

const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED',
  'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED',
];

const STATUS_BADGE = {
  PENDING:          'bg-accent/15 text-accent border border-accent/30',
  CONFIRMED:        'bg-accent text-bg font-semibold',
  PROCESSING:       'bg-surface-alt text-ivory border border-border',
  PACKED:           'bg-accent/20 text-accent border border-accent/30',
  SHIPPED:          'bg-accent/25 text-accent-light border border-accent/35',
  OUT_FOR_DELIVERY: 'bg-accent/30 text-ivory border border-accent/40',
  DELIVERED:        'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30',
  CANCELLED:        'bg-red-950/60 text-red-300 border border-red-500/30',
  RETURNED:         'bg-surface-alt text-muted border border-border',
};

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric',
});

/** Debounce a fast-changing value so typing doesn't fire a request per keystroke. */
function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Per-order draft state for the status/tracking editor.
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [rowError, setRowError] = useState({});

  // ── Load orders (search + status filtering happen server-side) ───────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const data = await api.get(`/admin/orders?${params}`, { auth: true });
      setOrders(data.orders || []);
      setTotal(data.pagination?.total ?? (data.orders || []).length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const draftFor = (order) =>
    drafts[order._id] || {
      status: order.status,
      trackingNumber: order.tracking?.trackingNumber || '',
      trackingProvider: order.tracking?.provider || '',
    };

  const setDraft = (id, patch) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  // ── Persist a status / tracking change ───────────────────────────────────
  const saveOrder = async (order) => {
    const draft = draftFor(order);
    setSavingId(order._id);
    setRowError((prev) => ({ ...prev, [order._id]: '' }));
    try {
      const data = await api.put(
        `/admin/orders/${order._id}/status`,
        {
          status: draft.status,
          note: `Status changed to ${draft.status} from admin panel`,
          trackingNumber: draft.trackingNumber || undefined,
          trackingProvider: draft.trackingProvider || undefined,
        },
        { auth: true }
      );
      // Replace just this row rather than refetching the whole list.
      setOrders((prev) => prev.map((o) => (o._id === order._id ? data.order : o)));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[order._id];
        return next;
      });
      setSavedId(order._id);
      setTimeout(() => setSavedId(null), 2500);
    } catch (err) {
      setRowError((prev) => ({ ...prev, [order._id]: err.message }));
    } finally {
      setSavingId(null);
    }
  };

  const customerName = (o) =>
    o.shippingAddress?.name || o.user?.name || o.guestEmail || 'Guest';

  const itemSummary = (o) => {
    const names = (o.items || []).map((i) => i.name);
    if (names.length === 0) return '—';
    return names.length === 1 ? names[0] : `${names[0]} +${names.length - 1} more`;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ivory font-serif">Orders</h2>
        <p className="text-sm text-muted mt-0.5">
          {loading ? 'Loading…' : `${total} total orders`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="orders-search"
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border bg-bg-alt text-ivory placeholder:text-muted/50 text-sm focus:outline-none focus:border-accent rounded-lg min-h-[44px]"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none border border-border px-3.5 py-2.5 text-sm text-ivory bg-bg-alt focus:outline-none focus:border-accent rounded-lg cursor-pointer min-h-[44px]"
          >
            <option value="ALL">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <button
            onClick={fetchOrders}
            className="flex items-center justify-center gap-2 border border-border bg-bg-alt px-4 py-2.5 text-sm text-ivory hover:border-accent hover:text-accent transition-colors rounded-lg min-h-[44px]"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-accent' : 'text-accent'} />
            <span className="hidden xs:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/30 text-red-300 px-4 sm:px-5 py-3.5 sm:py-4 text-sm mb-5 rounded-lg">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            onClick={fetchOrders}
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
          <Loader2 size={26} className="mx-auto text-accent animate-spin mb-3" />
          <p className="text-sm text-muted">Loading orders…</p>
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="bg-bg-alt border border-border text-center py-14 text-muted text-sm rounded-xl">
              No orders match your search.
            </div>
          ) : orders.map((order) => {
            const expanded = expandedOrder === order._id;
            const draft = draftFor(order);
            const dirty =
              draft.status !== order.status ||
              draft.trackingNumber !== (order.tracking?.trackingNumber || '');

            return (
              <div key={order._id} className="bg-bg-alt border border-border hover:border-accent/40 rounded-xl overflow-hidden shadow-sm transition-all">
                {/* Order row */}
                <button
                  className="w-full flex items-center gap-2.5 sm:gap-4 px-3.5 sm:px-5 py-3.5 sm:py-4 cursor-pointer hover:bg-white/5 transition-colors text-left"
                  onClick={() => setExpandedOrder(expanded ? null : order._id)}
                  aria-expanded={expanded}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] sm:text-xs text-muted truncate">{order.orderId}</span>
                      <span className={`text-[9px] px-2 py-0.5 font-semibold rounded sm:hidden ${STATUS_BADGE[order.status] || STATUS_BADGE.PENDING}`}>
                        {(order.status || 'PENDING').replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-ivory truncate">{customerName(order)}</p>
                    <div className="flex items-center gap-2 sm:hidden mt-0.5">
                      <span className="font-semibold text-xs text-accent">
                        {formatPrice(order.billing?.total ?? 0)}
                      </span>
                      <span className="text-[10px] text-muted">
                        {order.createdAt ? dateFmt.format(new Date(order.createdAt)) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted hidden md:block truncate mt-0.5">{itemSummary(order)}</p>
                  </div>
                  <span className="font-semibold text-sm text-accent hidden sm:block">
                    {formatPrice(order.billing?.total ?? 0)}
                  </span>
                  <span className={`text-[10px] px-2.5 py-1 font-semibold rounded hidden sm:block flex-shrink-0 ${STATUS_BADGE[order.status] || STATUS_BADGE.PENDING}`}>
                    {(order.status || 'PENDING').replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-muted hidden md:block flex-shrink-0">
                    {order.createdAt ? dateFmt.format(new Date(order.createdAt)) : ''}
                  </span>
                  {expanded
                    ? <ChevronUp size={15} className="text-accent flex-shrink-0" />
                    : <ChevronDown size={15} className="text-muted flex-shrink-0" />}
                </button>

                {/* Expanded detail */}
                {expanded && (
                  <div className="border-t border-border px-3.5 sm:px-5 py-4 sm:py-5 bg-bg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-5">
                      <div>
                        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Customer</p>
                        <p className="text-sm font-medium text-ivory">{customerName(order)}</p>
                        <p className="text-xs text-muted">{order.user?.email || order.guestEmail || '—'}</p>
                        <p className="text-xs text-muted">{order.shippingAddress?.phone || order.guestPhone || ''}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Address</p>
                        <p className="text-sm text-ivory leading-relaxed font-light">
                          {[
                            order.shippingAddress?.line1,
                            order.shippingAddress?.line2,
                            order.shippingAddress?.city,
                            order.shippingAddress?.state,
                            order.shippingAddress?.pincode,
                          ].filter(Boolean).join(', ') || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Payment</p>
                        <p className="text-sm text-ivory">
                          {order.payment?.method === 'cod' ? 'Cash on Delivery' : order.payment?.method || '—'}
                        </p>
                        <p className="text-xs text-muted capitalize">{order.payment?.status || ''}</p>
                      </div>
                    </div>

                    {/* Line items */}
                    <div className="mb-5 border border-border bg-bg-alt divide-y divide-border/50 rounded-lg overflow-hidden">
                      {(order.items || []).map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-3 sm:px-4 py-2.5 text-xs">
                          <span className="text-ivory truncate">
                            {item.qty}× {item.name}{item.variant ? ` • ${item.variant}` : ''}
                          </span>
                          <span className="text-accent font-medium flex-shrink-0 ml-3">
                            {formatPrice((item.price || 0) * (item.qty || 0))}
                          </span>
                        </div>
                      ))}
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 px-3 sm:px-4 py-2.5 text-xs bg-surface-alt border-t border-border">
                        <span className="text-muted">
                          Subtotal {formatPrice(order.billing?.subtotal ?? 0)}
                          {order.billing?.discount ? ` · Discount −${formatPrice(order.billing.discount)}` : ''}
                          {order.billing?.shippingCharge ? ` · Shipping ${formatPrice(order.billing.shippingCharge)}` : ''}
                        </span>
                        <span className="text-accent font-bold">{formatPrice(order.billing?.total ?? 0)}</span>
                      </div>
                    </div>

                    {/* Status editor */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider self-start sm:self-center">Update Status:</p>
                      <select
                        value={draft.status}
                        onChange={(e) => setDraft(order._id, { status: e.target.value })}
                        className="border border-border bg-bg-alt px-3 py-2 text-xs text-ivory focus:outline-none focus:border-accent rounded min-h-[40px] sm:min-h-[36px]"
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                      </select>
                      <input
                        placeholder="Add tracking number…"
                        value={draft.trackingNumber}
                        onChange={(e) => setDraft(order._id, { trackingNumber: e.target.value })}
                        className="flex-1 min-w-[140px] border border-border bg-bg-alt px-3 py-2 text-xs text-ivory placeholder:text-muted/50 focus:outline-none focus:border-accent rounded min-h-[40px] sm:min-h-[36px]"
                      />
                      <button
                        onClick={() => saveOrder(order)}
                        disabled={savingId === order._id || !dirty}
                        className="w-full sm:w-auto px-4 py-2 bg-accent text-bg text-xs font-semibold uppercase tracking-wider hover:bg-accent-light transition-colors min-h-[40px] sm:min-h-[36px] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
                      >
                        {savingId === order._id
                          ? <><Loader2 size={12} className="animate-spin" /> Saving…</>
                          : savedId === order._id
                          ? <><Check size={12} /> Saved</>
                          : 'Save'}
                      </button>
                    </div>

                    {rowError[order._id] && (
                      <p className="mt-2 text-xs text-error">{rowError[order._id]}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
