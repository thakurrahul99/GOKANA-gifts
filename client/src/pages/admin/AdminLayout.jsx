import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings,
  ChevronRight, LogOut, Menu, X
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../store';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: Tag, label: 'Coupons', href: '/admin/coupons' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Auth Guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token || !user) {
      navigate('/login', { replace: true });
    } else if (user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [token, user, navigate]);

  if (!user || user.role !== 'admin') return null;
  // ─────────────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className={clsx(
        'flex flex-col bg-charcoal transition-all duration-300 flex-shrink-0',
        sidebarOpen ? 'w-60' : 'w-16'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.08]">
          <span className={clsx('font-serif tracking-[0.15em] uppercase text-ivory transition-all', sidebarOpen ? 'text-xl' : 'text-sm')}>
            {sidebarOpen ? 'GŌKANA' : 'G'}
          </span>
          {sidebarOpen && <span className="text-xs text-white/30 font-sans">Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 mx-2 rounded-sm transition-all duration-200 group',
                  active
                    ? 'bg-gold/20 text-gold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={18} strokeWidth={1.5} />
                {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08]">
          {sidebarOpen && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                <span className="text-gold text-xs font-medium">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="text-xs text-white/70">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-white/30">{user?.email || 'admin@gokana.in'}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs"
          >
            <LogOut size={14} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="font-sans text-sm font-medium text-gray-700">
            {navItems.find(n => n.href === location.pathname)?.label || 'Admin'}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" target="_blank" className="text-xs text-gold hover:underline">
              View Store ↗
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
