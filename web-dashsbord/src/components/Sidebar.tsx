import { Search, LayoutDashboard, ShoppingBag, BarChart2, Users, Mail, MessageSquare, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar = ({ currentPage, setCurrentPage }: SidebarProps) => {
  const navItems = [
    { name: 'Ringkasan', icon: LayoutDashboard },
    { name: 'eCommerce', icon: ShoppingBag },
    { name: 'Analisis', icon: BarChart2 },
    { name: 'Pelanggan', icon: Users },
  ];

  const settingItems = [
    { name: 'Pesan', icon: Mail },
    { name: 'Ulasan Pelanggan', icon: MessageSquare },
    { name: 'Pengaturan', icon: Settings },
    { name: 'Pusat Bantuan', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-background border-r border-border h-full flex flex-col pt-6 pb-6 px-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-white font-medium text-sm">Guy Hawkins</h2>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Mencari..." 
          className="w-full bg-card text-white text-sm rounded-full pl-10 pr-12 py-2 focus:outline-none focus:ring-1 focus:ring-border border border-transparent"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-background rounded px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border">
          ⌘K
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">DASBOR</h3>
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.name}>
                <button 
                  onClick={() => setCurrentPage(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    currentPage === item.name 
                      ? 'bg-primary text-black font-medium' 
                      : 'text-muted-foreground hover:bg-card hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">PENGATURAN</h3>
          <ul className="space-y-1">
            {settingItems.map(item => (
              <li key={item.name}>
                <button 
                  onClick={() => setCurrentPage(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    currentPage === item.name 
                      ? 'bg-primary text-black font-medium' 
                      : 'text-muted-foreground hover:bg-card hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto px-2 pt-4 flex items-center justify-center gap-2">
         {/* Logo placeholder */}
         <div className="flex gap-1 text-primary">
            <div className="w-2 h-2 rounded-full border border-primary"></div>
            <div className="w-2 h-2 rounded-full border border-primary"></div>
            <div className="w-2 h-2 rounded-full border border-primary"></div>
         </div>
         <span className="font-semibold text-white tracking-widest text-sm">DWISON</span>
      </div>
    </div>
  );
};

export default Sidebar;
