import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '../../components/ui';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'];

const mockOrders = [
  { id: 'GKN001', customer: 'Priya Menon',   email: 'priya@gmail.com',  product: 'Signature Chocolate Collection', amount: 1899, status: 'DELIVERED',  date: '15 Jan 2026', address: 'Mumbai, MH',    payment: 'Online' },
  { id: 'GKN002', customer: 'Arjun Kapoor',  email: 'arjun@gmail.com',  product: 'Grand Celebration Hamper',       amount: 3499, status: 'SHIPPED',     date: '16 Jan 2026', address: 'New Delhi, DL', payment: 'Online' },
  { id: 'GKN003', customer: 'Sneha Iyer',    email: 'sneha@gmail.com',  product: 'Serenity Candle Trio',           amount: 1499, status: 'PROCESSING',  date: '17 Jan 2026', address: 'Bangalore, KA', payment: 'COD'    },
  { id: 'GKN004', customer: 'Rahul Sharma',  email: 'rahul@gmail.com',  product: 'Botanical Skincare Ritual',      amount: 2699, status: 'PENDING',     date: '17 Jan 2026', address: 'Pune, MH',      payment: 'Online' },
  { id: 'GKN005', customer: 'Anika Patel',   email: 'anika@gmail.com',  product: 'Signature Chocolate Collection', amount: 1899, status: 'CONFIRMED',   date: '18 Jan 2026', address: 'Hyderabad, TS', payment: 'Online' },
];

const STATUS_BADGE = {
  PENDING:          'bg-amber-50   text-amber-700  border border-amber-200',
  CONFIRMED:        'bg-blue-50    text-blue-700   border border-blue-200',
  PROCESSING:       'bg-purple-50  text-purple-700 border border-purple-200',
  PACKED:           'bg-indigo-50  text-indigo-700 border border-indigo-200',
  SHIPPED:          'bg-orange-50  text-orange-700 border border-orange-200',
  OUT_FOR_DELIVERY: 'bg-cyan-50    text-cyan-700   border border-cyan-200',
  DELIVERED:        'bg-emerald-50 text-emerald-700 border border-emerald-200',
  CANCELLED:        'bg-red-50     text-red-700    border border-red-200',
  RETURNED:         'bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)]',
};

export function AdminOrders() {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const updateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--primary)]">Orders</h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            id="orders-search"
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text)] bg-[var(--surface)] focus:outline-none focus:border-[var(--accent)]"
        >
          <option value="ALL">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Orders list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-[var(--surface)] border border-[var(--border)] text-center py-14 text-[var(--text-muted)] text-sm">
            No orders match your search.
          </div>
        ) : filtered.map(order => {
          const expanded = expandedOrder === order.id;
          return (
            <div key={order.id} className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors">
              {/* Order row */}
              <button
                className="w-full flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-[var(--bg)] transition-colors text-left"
                onClick={() => setExpandedOrder(expanded ? null : order.id)}
                aria-expanded={expanded}
              >
                <span className="font-mono text-xs text-[var(--text-muted)] w-16 flex-shrink-0">{order.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--primary)] truncate">{order.customer}</p>
                  <p className="text-xs text-[var(--text-muted)] hidden md:block truncate">{order.product}</p>
                </div>
                <span className="font-semibold text-sm text-[var(--primary)] hidden sm:block">{formatPrice(order.amount)}</span>
                <span className={`text-[10px] px-2 py-1 font-semibold hidden sm:block flex-shrink-0 ${STATUS_BADGE[order.status] || STATUS_BADGE.PENDING}`}>
                  {order.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-[var(--text-muted)] hidden md:block flex-shrink-0">{order.date}</span>
                {expanded
                  ? <ChevronUp size={14} className="text-[var(--accent)] flex-shrink-0" />
                  : <ChevronDown size={14} className="text-[var(--text-muted)] flex-shrink-0" />}
              </button>

              {/* Expanded detail */}
              {expanded && (
                <div className="border-t border-[var(--border)] px-4 py-5 bg-[var(--bg)]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Customer</p>
                      <p className="text-sm font-medium text-[var(--primary)]">{order.customer}</p>
                      <p className="text-xs text-[var(--text-muted)]">{order.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Address</p>
                      <p className="text-sm text-[var(--text)]">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Payment</p>
                      <p className="text-sm text-[var(--text)]">{order.payment}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Update Status:</p>
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[36px]"
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                    <input
                      placeholder="Add tracking number…"
                      className="flex-1 min-w-[140px] border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[36px]"
                    />
                    <button className="px-4 py-1.5 bg-[var(--primary)] text-[var(--surface)] text-xs font-semibold hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-colors min-h-[36px]">
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
