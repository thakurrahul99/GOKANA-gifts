import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Package, TrendingUp, Star, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import { formatPrice } from '../../components/ui';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_COLOR = {
  PENDING:    'bg-yellow-100 text-yellow-700',
  CONFIRMED:  'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  PACKED:     'bg-indigo-100 text-indigo-700',
  SHIPPED:    'bg-orange-100 text-orange-700',
  DELIVERED:  'bg-green-100 text-green-700',
  CANCELLED:  'bg-red-100 text-red-700',
};

export function AdminDashboard() {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to load stats');
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const stats = data ? [
    { label: 'Total Orders',     value: data.stats.totalOrders.toLocaleString(),                   change: '',   icon: ShoppingBag, color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Revenue (All)',     value: `₹${data.stats.totalRevenue.toLocaleString('en-IN')}`,     change: '',   icon: TrendingUp,  color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Total Customers',   value: data.stats.totalCustomers.toLocaleString(),                change: '',   icon: Users,       color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Products',   value: data.stats.activeProducts.toLocaleString(),                change: '',   icon: Package,     color: 'text-amber-600',  bg: 'bg-amber-50' },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here's what's happening with GŌKANA.</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={24} className="animate-spin mr-3" />
          <span className="text-sm">Loading stats…</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-50 text-red-700 px-5 py-4 text-sm mb-8 rounded-sm">
          <AlertCircle size={16} />
          <span>Could not load stats: {error}</span>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 ${s.bg} rounded-sm`}>
                    <s.icon size={18} className={s.color} />
                  </div>
                  {data?.stats.pendingOrders > 0 && s.label === 'Total Orders' && (
                    <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                      {data.stats.pendingOrders} pending
                    </span>
                  )}
                </div>
                <p className="text-2xl font-semibold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Recent orders from API */}
          <div className="bg-white border border-gray-100 rounded-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">Recent Orders</h3>
              <a href="/admin/orders" className="text-xs text-gold hover:underline">View all</a>
            </div>
            <div className="overflow-x-auto">
              {!data?.recentOrders?.length ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  {error ? 'Could not load orders.' : 'No orders yet.'}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 font-medium border-b border-gray-50">
                      <th className="text-left px-6 py-3">Order</th>
                      <th className="text-left px-6 py-3">Customer</th>
                      <th className="text-left px-6 py-3 hidden md:table-cell">Amount</th>
                      <th className="text-left px-6 py-3">Status</th>
                      <th className="text-left px-6 py-3 hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-600">{order.orderId || order._id?.slice(-8)}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {order.user?.name || order.shippingAddress?.name || 'Guest'}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800 hidden md:table-cell">
                          {formatPrice(order.billing?.total || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${STATUS_COLOR[order.status] || STATUS_COLOR.PENDING}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 hidden md:table-cell text-xs">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
