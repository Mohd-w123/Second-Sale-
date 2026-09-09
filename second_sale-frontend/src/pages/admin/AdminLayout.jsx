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
  FileText
} from 'lucide-react';
import './admin.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
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
    return 'Admin Panel';
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/homepage', icon: Layout, label: 'Homepage' },
    { to: '/admin/pages', icon: FileText, label: 'Pages (CMS)' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/devices', icon: Smartphone, label: 'Devices (Sell)' },
    { to: '/admin/refurbished', icon: Package, label: 'Refurbished' },
    { to: '/admin/categories', icon: Layers, label: 'Categories' },
    { to: '/admin/partners', icon: Handshake, label: 'Partners' },
    { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/admin/pincodes', icon: MapPin, label: 'Pincodes' },
    { to: '/admin/site-settings', icon: Settings2, label: 'Site Settings' },
  ];

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
                <span className="admin-profile-name">Admin</span>
                <span className="admin-profile-status">Super User</span>
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
