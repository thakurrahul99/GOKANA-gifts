import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings, ChevronRight, LogOut, Menu, X } from 'lucide-react';
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

  useEffect(() => {
    if (!token || !user) navigate('/login', { replace: true });
    else if (user.role !== 'admin') navigate('/', { replace: true });
  }, [token, user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div data-lenis-prevent className="flex h-screen bg-[#12100E] font-sans text-ivory overflow-hidden">
      <aside data-lenis-prevent className={clsx('flex flex-col bg-[#181512] border-r border-[rgba(197,160,89,0.2)] transition-all duration-300 flex-shrink-0 shadow-xl overflow-y-auto', sidebarOpen ? 'w-60' : 'w-16')}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(197,160,89,0.18)]">
          <span className={clsx('font-serif tracking-[0.15em] uppercase text-ivory transition-all', sidebarOpen ? 'text-xl' : 'text-sm')}>{sidebarOpen ? 'GŌKANA' : 'G'}</span>
          {sidebarOpen && <span className="text-[10px] text-accent font-sans font-semibold tracking-widest uppercase bg-accent/10 border border-accent/30 px-1.5 py-0.5 rounded">Admin</span>}
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = location.pathname === href;
            return (
              <Link key={href} to={href} className={clsx('flex items-center gap-3 px-4 py-3 mx-2 rounded-sm transition-all duration-200 group min-h-[44px]', active ? 'bg-accent/15 text-accent border border-accent/30 font-medium' : 'text-[#A39A8E] hover:text-ivory hover:bg-white/5')}>
                <Icon size={18} strokeWidth={1.6} className={active ? 'text-accent' : 'text-[#A39A8E] group-hover:text-accent'} />
                {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} className="ml-auto text-accent" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[rgba(197,160,89,0.15)]">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30">
                <span className="text-accent text-xs font-semibold">{user?.name?.[0]?.toUpperCase() || 'A'}</span>
              </div>
              <div className="truncate">
                <p className="text-xs text-ivory font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-[#A39A8E] truncate">{user?.email || 'admin@gokana.in'}</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center gap-2 text-[#A39A8E] hover:text-accent transition-colors text-xs min-h-[40px] w-full"><LogOut size={14} />{sidebarOpen && 'Logout'}</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#181512] border-b border-[rgba(197,160,89,0.2)] px-6 py-4 flex items-center gap-4 shadow-sm flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-ivory hover:text-accent transition-colors p-1.5 min-h-[40px] min-w-[40px] flex items-center justify-center rounded hover:bg-white/5" aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
          <h1 className="font-sans text-sm font-semibold text-ivory tracking-wide uppercase">{navItems.find(n => n.href === location.pathname)?.label || 'Admin'}</h1>
          <div className="ml-auto flex items-center gap-3"><Link to="/" target="_blank" className="text-xs text-accent hover:text-accent-light font-medium flex items-center gap-1">View Store ↗</Link></div>
        </header>
        <main data-lenis-prevent className="flex-1 overflow-y-auto p-6 bg-[#12100E] text-ivory overscroll-contain"><Outlet /></main>
      </div>
    </div>
  );
}
