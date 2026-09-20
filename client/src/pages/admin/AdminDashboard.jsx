import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Package, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import { formatPrice } from '../../components/ui';
import { API_BASE } from '../../lib/api';

const API = API_BASE;
const STATUS_COLOR = {
  PENDING: 'bg-accent/15 text-accent border border-accent/30',
  CONFIRMED: 'bg-accent text-[#12100E] font-semibold',
  PROCESSING: 'bg-[#1F1A16] text-ivory border border-[rgba(197,160,89,0.25)]',
  PACKED: 'bg-accent/20 text-accent border border-accent/30',
  SHIPPED: 'bg-accent/25 text-accent-light border border-accent/35',
  DELIVERED: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30',
  CANCELLED: 'bg-red-950/60 text-red-300 border border-red-500/30',
};

export function AdminDashboard() {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true); setError('');
      try {
        const res = await fetch(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to load stats');
        setData(json);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, [token]);

  const stats = data ? [
    { label: 'Total Orders', value: data.stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-accent', bg: 'bg-accent/15 border border-accent/30' },
    { label: 'Revenue (All)', value: `₹${data.stats.totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-accent-light', bg: 'bg-accent/15 border border-accent/30' },
    { label: 'Total Customers', value: data.stats.totalCustomers.toLocaleString(), icon: Users, color: 'text-accent', bg: 'bg-accent/15 border border-accent/30' },
    { label: 'Active Products', value: data.stats.activeProducts.toLocaleString(), icon: Package, color: 'text-accent-light', bg: 'bg-accent/15 border border-accent/30' },
  ] : [];

  return (
    <div className="text-ivory space-y-8">
      <div><h2 className="text-2xl font-semibold text-ivory font-serif">Dashboard</h2><p className="text-sm text-[#A39A8E] mt-1">Welcome back, Admin. Here's what's happening with GŌKANA.</p></div>
      {loading && <div className="flex items-center justify-center py-20 text-[#A39A8E]"><Loader2 size={24} className="animate-spin mr-3 text-accent" /><span className="text-sm">Loading stats…</span></div>}
      {error && !loading && <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/30 text-red-300 px-5 py-4 text-sm"><AlertCircle size={16} /><span>Could not load stats: {error}</span></div>}
      {!loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#181512] border border-[rgba(197,160,89,0.2)] p-5 shadow-lg rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 ${s.bg} rounded-lg`}><s.icon size={18} className={s.color} /></div>
                  {data?.stats.pendingOrders > 0 && s.label === 'Total Orders' && <span className="text-xs text-accent font-semibold bg-accent/15 border border-accent/30 px-2 py-0.5 rounded">{data.stats.pendingOrders} pending</span>}
                </div>
                <p className="text-2xl font-semibold text-ivory font-serif">{s.value}</p>
                <p className="text-xs text-[#A39A8E] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#181512] border border-[rgba(197,160,89,0.2)] rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(197,160,89,0.18)]">
              <h3 className="font-serif text-base font-light text-ivory">Recent Orders</h3>
              <a href="/admin/orders" className="text-xs text-accent hover:text-accent-light font-medium">View all →</a>
            </div>
            <div className="overflow-x-auto">
              {!data?.recentOrders?.length ? (
                <div className="text-center py-12 text-[#A39A8E] text-sm">{error ? 'Could not load orders.' : 'No orders yet.'}</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-[#A39A8E] font-semibold border-b border-[rgba(197,160,89,0.15)] bg-[#1F1A16]">
                      <th className="text-left px-6 py-3.5">Order</th>
                      <th className="text-left px-6 py-3.5">Customer</th>
                      <th className="text-left px-6 py-3.5 hidden md:table-cell">Amount</th>
                      <th className="text-left px-6 py-3.5">Status</th>
                      <th className="text-left px-6 py-3.5 hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(197,160,89,0.1)]">
                    {data.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-[#A39A8E]">{order.orderId || order._id?.slice(-8)}</td>
                        <td className="px-6 py-4 font-medium text-ivory">{order.user?.name || order.shippingAddress?.name || 'Guest'}</td>
                        <td className="px-6 py-4 font-semibold text-accent hidden md:table-cell">{formatPrice(order.billing?.total || 0)}</td>
                        <td className="px-6 py-4"><span className={`px-2.5 py-1 text-[10px] font-semibold rounded ${STATUS_COLOR[order.status] || STATUS_COLOR.PENDING}`}>{order.status}</span></td>
                        <td className="px-6 py-4 text-[#A39A8E] hidden md:table-cell text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
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
