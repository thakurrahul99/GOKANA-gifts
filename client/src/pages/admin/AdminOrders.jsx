import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { formatPrice } from '../../components/ui';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'];

const mockOrders = [
  { id: 'GKN001', customer: 'Priya Menon', email: 'priya@gmail.com', product: 'Signature Chocolate Collection', amount: 1899, status: 'DELIVERED', date: '2024-01-15', address: 'Mumbai, MH', payment: 'Online' },
  { id: 'GKN002', customer: 'Arjun Kapoor', email: 'arjun@gmail.com', product: 'Grand Celebration Hamper', amount: 3499, status: 'SHIPPED', date: '2024-01-16', address: 'New Delhi, DL', payment: 'Online' },
  { id: 'GKN003', customer: 'Sneha Iyer', email: 'sneha@gmail.com', product: 'Serenity Candle Trio', amount: 1499, status: 'PROCESSING', date: '2024-01-17', address: 'Bangalore, KA', payment: 'COD' },
  { id: 'GKN004', customer: 'Rahul Sharma', email: 'rahul@gmail.com', product: 'Botanical Skincare Ritual', amount: 2699, status: 'PENDING', date: '2024-01-17', address: 'Pune, MH', payment: 'Online' },
  { id: 'GKN005', customer: 'Anika Patel', email: 'anika@gmail.com', product: 'Signature Chocolate Collection', amount: 1899, status: 'CONFIRMED', date: '2024-01-18', address: 'Hyderabad, TS', payment: 'Online' },
];

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  PACKED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-orange-100 text-orange-800',
  OUT_FOR_DELIVERY: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-gray-100 text-gray-600',
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
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold bg-white"
        >
          <option value="ALL">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders */}
      <div className="space-y-2">
        {filtered.map(order => (
          <div key={order.id} className="bg-white border border-gray-100">
            {/* Order row */}
            <div
              className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <span className="font-mono text-xs text-gray-500 w-16">{order.id}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{order.customer}</p>
                <p className="text-xs text-gray-400 hidden md:block">{order.product}</p>
              </div>
              <span className="font-medium text-sm text-gray-800 hidden sm:block">{formatPrice(order.amount)}</span>
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold hidden sm:block ${statusColors[order.status]}`}>
                {order.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-400 hidden md:block">{order.date}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
            </div>

            {/* Expanded detail */}
            {expandedOrder === order.id && (
              <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Customer</p>
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-sm">{order.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment</p>
                    <p className="text-sm">{order.payment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">Update Status:</p>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-gold bg-white"
                  >
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                  <input placeholder="Add tracking number…" className="flex-1 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-gold" />
                  <button className="px-3 py-1.5 bg-charcoal text-ivory text-xs font-medium hover:bg-accent transition-colors">
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
