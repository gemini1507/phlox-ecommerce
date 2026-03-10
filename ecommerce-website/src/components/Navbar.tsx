import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Settings, Package, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact Us' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-widest text-dark">PHL<span className="text-primary">O</span>X</Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`text-sm font-medium transition-colors ${location.pathname === l.to ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>

          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">{totalItems}</span>
            )}
          </Link>

          {/* Profile / Login */}
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-dark max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in duration-200">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-dark text-sm">{user?.name}</p>
                    <p className="text-gray-500 text-xs">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" /> Wishlist
                    </Link>
                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                      <Settings className="w-4 h-4" /> Account Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 pt-1">
                    <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors font-medium">
              <User className="w-5 h-5" /> Login
            </Link>
          )}

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-gray-100 px-6 py-3">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for products... (press Enter)"
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className={`block text-sm font-medium py-2 ${location.pathname === l.to ? 'text-primary' : 'text-gray-600'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
