import { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Bell, Shield, Eye, EyeOff, CheckCircle, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+62 812 3456 7890',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
  });

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, promo: true, order: true, newsletter: false });

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-dark mb-2">Login Required</h2>
        <p className="text-gray-500 text-sm mb-6">Sign in to manage your account.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  const saveChanges = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-dark mb-2">Account Settings</h1>
      <p className="text-gray-500 text-sm mb-8">Manage your profile, security, and preferences</p>

      {saved && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-6 border border-green-100 flex items-center gap-2 animate-fade-up">
          <CheckCircle className="w-4 h-4" /> Changes saved successfully!
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                  <Camera className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
              <p className="font-bold text-dark text-sm">{user?.name}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
              <span className="mt-2 text-[10px] bg-primary/10 text-primary px-3 py-0.5 rounded-full font-semibold uppercase">{user?.role}</span>
            </div>
          </div>

          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-4">
              Logout
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-lg font-bold text-dark mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary resize-none" />
                  </div>
                </div>
                <button onClick={saveChanges} className="btn-primary px-6 py-2.5 text-sm font-semibold">Save Changes</button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-bold text-dark mb-6">Change Password</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPass ? 'text' : 'password'} value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:border-primary" placeholder="Enter current password" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPass ? 'text' : 'password'} value={passwords.newPass} onChange={e => setPasswords({...passwords, newPass: e.target.value})} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary" placeholder="Enter new password" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPass ? 'text' : 'password'} value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary" placeholder="Confirm new password" />
                  </div>
                </div>
                <button onClick={saveChanges} className="btn-primary px-6 py-2.5 text-sm font-semibold">Update Password</button>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-dark mb-3">Danger Zone</h3>
                <p className="text-gray-500 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 font-medium transition-colors">Delete Account</button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-bold text-dark mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive important updates via email' },
                  { key: 'order', label: 'Order Updates', desc: 'Get notified about order status changes' },
                  { key: 'promo', label: 'Promotions & Deals', desc: 'Special offers, coupons, and flash sales' },
                  { key: 'newsletter', label: 'Newsletter', desc: 'Weekly digest of new products and tech news' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div>
                      <p className="font-medium text-dark text-sm">{n.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({...notifications, [n.key]: !notifications[n.key as keyof typeof notifications]})}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications[n.key as keyof typeof notifications] ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${notifications[n.key as keyof typeof notifications] ? 'translate-x-5.5 left-[1px]' : 'left-[2px]'}`}
                        style={{ transform: notifications[n.key as keyof typeof notifications] ? 'translateX(22px)' : 'translateX(0)' }}
                      />
                    </button>
                  </div>
                ))}
                <button onClick={saveChanges} className="btn-primary px-6 py-2.5 text-sm font-semibold mt-2">Save Preferences</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
