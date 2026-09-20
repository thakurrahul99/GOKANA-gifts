import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Package, TrendingUp, Star, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import { formatPrice } from '../../components/ui';
import { API_BASE } from '../../lib/api';

const API = API_BASE;

const STATUS_COLOR = {
  PENDING:    'bg-accent-soft text-accent-dark',
  CONFIRMED:  'bg-primary-soft text-primary',
  PROCESSING: 'bg-blush text-primary',
  PACKED:     'bg-blush text-primary',
  SHIPPED:    'bg-accent-soft text-accent-dark',
  DELIVERED:  'bg-accent-soft text-accent-dark',
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
    { label: 'Total Orders',     value: data.stats.totalOrders.toLocaleString(),                   change: '',   icon: ShoppingBag, color: 'text-primary',   bg: 'bg-primary-soft' },
    { label: 'Revenue (All)',     value: `₹${data.stats.totalRevenue.toLocaleString('en-IN')}`,     change: '',   icon: TrendingUp,  color: 'text-accent-dark',  bg: 'bg-accent-soft' },
    { label: 'Total Customers',   value: data.stats.totalCustomers.toLocaleString(),                change: '',   icon: Users,       color: 'text-primary', bg: 'bg-blush' },
    { label: 'Active Products',   value: data.stats.activeProducts.toLocaleString(),                change: '',   icon: Package,     color: 'text-accent-dark',  bg: 'bg-accent-soft' },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary">Dashboard</h2>
        <p className="text-sm text-muted mt-1">Welcome back, Admin. Here's what's happening with GŌKANA.</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-muted">
          <Loader2 size={24} className="animate-spin mr-3" />
          <span className="text-sm">Loading stats…</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 text-sm mb-8">
          <AlertCircle size={16} />
          <span>Could not load stats: {error}</span>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface border border-border p-5 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 ${s.bg} rounded-sm`}>
                    <s.icon size={18} className={s.color} />
                  </div>
                  {data?.stats.pendingOrders > 0 && s.label === 'Total Orders' && (
                    <span className="text-xs text-accent-dark font-semibold bg-accent-soft border-accent/30 px-2 py-0.5">
                      {data.stats.pendingOrders} pending
                    </span>
                  )}
                </div>
                <p className="text-2xl font-semibold text-primary">{s.value}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Recent orders from API */}
          <div className="bg-surface border border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-primary text-sm">Recent Orders</h3>
              <a href="/admin/orders" className="text-xs text-accent hover:underline font-medium">View all</a>
            </div>
            <div className="overflow-x-auto">
              {!data?.recentOrders?.length ? (
                <div className="text-center py-10 text-muted text-sm">
                  {error ? 'Could not load orders.' : 'No orders yet.'}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted font-semibold border-b border-border bg-bg">
                      <th className="text-left px-6 py-3">Order</th>
                      <th className="text-left px-6 py-3">Customer</th>
                      <th className="text-left px-6 py-3 hidden md:table-cell">Amount</th>
                      <th className="text-left px-6 py-3">Status</th>
                      <th className="text-left px-6 py-3 hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-border hover:bg-bg transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-muted">{order.orderId || order._id?.slice(-8)}</td>
                        <td className="px-6 py-4 font-medium text-primary">
                          {order.user?.name || order.shippingAddress?.name || 'Guest'}
                        </td>
                        <td className="px-6 py-4 font-semibold text-primary hidden md:table-cell">
                          {formatPrice(order.billing?.total || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-semibold ${STATUS_COLOR[order.status] || STATUS_COLOR.PENDING}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted hidden md:table-cell text-xs">
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
