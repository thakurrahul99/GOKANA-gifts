import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Package, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store';
import { formatPrice } from '../../components/ui';
import { API_BASE } from '../../lib/api';

const API = API_BASE;
const STATUS_COLOR = {
  PENDING: 'bg-[#F3D9D4] text-[#0B1F3A]',
  CONFIRMED: 'bg-[#0B1F3A] text-white',
  PROCESSING: 'bg-[#F3D9D4] text-[#0B1F3A]',
  PACKED: 'bg-[#F3D9D4] text-[#0B1F3A]',
  SHIPPED: 'bg-[#D4AF37]/20 text-[#7A5E00]',
  DELIVERED: 'bg-[#D4AF37]/20 text-[#7A5E00]',
  CANCELLED: 'bg-[#0B1F3A]/10 text-[#0B1F3A] border border-[#0B1F3A]/20',
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
    { label: 'Total Orders', value: data.stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-[#0B1F3A]', bg: 'bg-[#0B1F3A]/10' },
    { label: 'Revenue (All)', value: `₹${data.stats.totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-[#7A5E00]', bg: 'bg-[#D4AF37]/20' },
    { label: 'Total Customers', value: data.stats.totalCustomers.toLocaleString(), icon: Users, color: 'text-[#0B1F3A]', bg: 'bg-[#F3D9D4]' },
    { label: 'Active Products', value: data.stats.activeProducts.toLocaleString(), icon: Package, color: 'text-[#7A5E00]', bg: 'bg-[#D4AF37]/20' },
  ] : [];

  return (
    <div>
      <div className="mb-8"><h2 className="text-2xl font-semibold text-[#0B1F3A]">Dashboard</h2><p className="text-sm text-[#5F6570] mt-1">Welcome back, Admin. Here's what's happening with GŌKANA.</p></div>
      {loading && <div className="flex items-center justify-center py-20 text-[#5F6570]"><Loader2 size={24} className="animate-spin mr-3" /><span className="text-sm">Loading stats…</span></div>}
      {error && !loading && <div className="flex items-center gap-3 bg-[#F3D9D4] border border-[#D4AF37] text-[#0B1F3A] px-5 py-4 text-sm mb-8"><AlertCircle size={16} /><span>Could not load stats: {error}</span></div>}
      {!loading && <><div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">{stats.map((s) => <div key={s.label} className="bg-white border border-[#E6DED2] p-5 shadow-sm"><div className="flex items-start justify-between mb-4"><div className={`p-2 ${s.bg} rounded-sm`}><s.icon size={18} className={s.color} /></div>{data?.stats.pendingOrders > 0 && s.label === 'Total Orders' && <span className="text-xs text-[#7A5E00] font-semibold bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-2 py-0.5">{data.stats.pendingOrders} pending</span>}</div><p className="text-2xl font-semibold text-[#0B1F3A]">{s.value}</p><p className="text-xs text-[#5F6570] mt-1">{s.label}</p></div>)}</div>
      <div className="bg-white border border-[#E6DED2] shadow-sm"><div className="flex items-center justify-between px-6 py-4 border-b border-[#E6DED2]"><h3 className="font-semibold text-[#0B1F3A] text-sm">Recent Orders</h3><a href="/admin/orders" className="text-xs text-[#7A5E00] hover:underline font-medium">View all</a></div><div className="overflow-x-auto">{!data?.recentOrders?.length ? <div className="text-center py-10 text-[#5F6570] text-sm">{error ? 'Could not load orders.' : 'No orders yet.'}</div> : <table className="w-full text-sm"><thead><tr className="text-xs text-[#5F6570] font-semibold border-b border-[#E6DED2] bg-[#F7F3EC]"><th className="text-left px-6 py-3">Order</th><th className="text-left px-6 py-3">Customer</th><th className="text-left px-6 py-3 hidden md:table-cell">Amount</th><th className="text-left px-6 py-3">Status</th><th className="text-left px-6 py-3 hidden md:table-cell">Date</th></tr></thead><tbody>{data.recentOrders.map((order) => <tr key={order._id} className="border-b border-[#E6DED2] hover:bg-[#F7F3EC] transition-colors"><td className="px-6 py-4 font-mono text-xs text-[#5F6570]">{order.orderId || order._id?.slice(-8)}</td><td className="px-6 py-4 font-medium text-[#0B1F3A]">{order.user?.name || order.shippingAddress?.name || 'Guest'}</td><td className="px-6 py-4 font-semibold text-[#0B1F3A] hidden md:table-cell">{formatPrice(order.billing?.total || 0)}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-[10px] font-semibold ${STATUS_COLOR[order.status] || STATUS_COLOR.PENDING}`}>{order.status}</span></td><td className="px-6 py-4 text-[#5F6570] hidden md:table-cell text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td></tr>)}</tbody></table>}</div></div></>}
    </div>
  );
}
