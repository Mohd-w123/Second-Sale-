import { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Smartphone,
  Layers, 
  Handshake, 
  ClipboardList, 
  LogOut,
  MapPin,
  Settings2,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Package,
  Layout,
  FileText,
  Users2,
  ShieldAlert,
} from 'lucide-react';
import './admin.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getAdminUser = () => {
    try {
      const stored = localStorage.getItem('adminUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getAdminUser();
  const isSuperAdmin = !currentUser || currentUser.role === 'superadmin' || currentUser.permissions?.includes('*');
  const userPermissions = currentUser?.permissions || [];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/homepage')) return 'Homepage Section Manager';
    if (path.includes('/pages')) return 'Custom Pages (CMS)';
    if (path.includes('/users')) return 'User Directory';
    if (path.includes('/devices')) return 'Device Catalog';
    if (path.includes('/refurbished')) return 'Refurbished Marketplace';
    if (path.includes('/categories')) return 'Category Management';
    if (path.includes('/partners')) return 'Partner Applications';
    if (path.includes('/orders')) return 'System Orders';
    if (path.includes('/pincodes')) return 'Serviceable Pincodes';
    if (path.includes('/site-settings')) return 'Site Settings';
    if (path.includes('/sales-users')) return 'Sales Team & Feature Permissions';
    return 'Admin Panel';
  };

  const ALL_NAV_ITEMS = [
    { key: 'dashboard', to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'homepage', to: '/admin/homepage', icon: Layout, label: 'Homepage' },
    { key: 'pages', to: '/admin/pages', icon: FileText, label: 'Pages (CMS)' },
    { key: 'users', to: '/admin/users', icon: Users, label: 'Users' },
    { key: 'devices', to: '/admin/devices', icon: Smartphone, label: 'Devices (Sell)' },
    { key: 'refurbished', to: '/admin/refurbished', icon: Package, label: 'Refurbished' },
    { key: 'categories', to: '/admin/categories', icon: Layers, label: 'Categories' },
    { key: 'partners', to: '/admin/partners', icon: Handshake, label: 'Partners' },
    { key: 'orders', to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { key: 'pincodes', to: '/admin/pincodes', icon: MapPin, label: 'Pincodes' },
    { key: 'site-settings', to: '/admin/site-settings', icon: Settings2, label: 'Site Settings' },
    { key: 'sales-users', to: '/admin/sales-users', icon: Users2, label: 'Sales Team', superAdminOnly: true },
  ];

  // Filter nav items based on user role & permissions
  const navItems = ALL_NAV_ITEMS.filter((item) => {
    if (isSuperAdmin) return true;
    if (item.superAdminOnly) return false;
    return userPermissions.includes(item.key);
  });

  const userName = currentUser?.name || (isSuperAdmin ? 'Super Admin' : 'Staff');
  const userRoleBadge = isSuperAdmin ? 'Super Admin' : (currentUser?.role === 'sales' ? 'Sales Team' : 'Staff');

  return (
    <div className="admin-panel">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="admin-mobile-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Dark Gradient matching cash kr) */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-icon">
              <span>S</span>
            </div>
            <div>
              <h1>SecondSale</h1>
              <span>Admin Console</span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="admin-sidebar-close"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>
        
        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.to}
                to={item.to} 
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar User Card */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-black shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block">
              {userRoleBadge}
            </span>
          </div>
        </div>

        {/* Bottom Logout Section */}
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={17} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="admin-menu-btn"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2>{getPageTitle()}</h2>
              <p className="admin-breadcrumb">Admin / {getPageTitle()}</p>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer"
              className="admin-store-link"
              title="View Live Storefront"
            >
              <ExternalLink size={15} />
              <span>Live Website</span>
            </a>

            <div className="admin-profile-pill">
              <div className="admin-avatar">
                <ShieldCheck size={16} />
              </div>
              <div className="admin-profile-info">
                <span className="admin-profile-name">{userName}</span>
                <span className="admin-profile-status">{userRoleBadge}</span>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="admin-header-logout-btn"
              title="Logout session"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
