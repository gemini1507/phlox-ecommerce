import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ClipboardList, BarChart2,
  Truck, Tag, LogOut, Bell, Settings
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/reports', icon: BarChart2, label: 'Sales Reports' },
  { to: '/shipping', icon: Truck, label: 'Shipping' },
  { to: '/promotions', icon: Tag, label: 'Promotions' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-background overflow-hidden text-sm">
      {/* Sidebar */}
      <div className="w-64 bg-background border-r border-border h-full flex flex-col pt-6 pb-6 px-4 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
            <img src="https://i.pravatar.cc/150?u=admin1" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-white font-medium text-sm">Admin Panel</h2>
            <p className="text-muted-foreground text-xs">eCommerce Manager</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary text-black font-medium'
                    : 'text-muted-foreground hover:bg-card hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 mt-6 border-t border-border pt-4">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-card hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-card hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <div className="h-16 flex items-center justify-between px-8 border-b border-border bg-background shrink-0">
          <h1 className="text-white font-semibold text-base">eCommerce Admin</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <button className="relative hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <img src="https://i.pravatar.cc/150?u=admin1" className="w-8 h-8 rounded-full cursor-pointer" alt="user" />
          </div>
        </div>
        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
