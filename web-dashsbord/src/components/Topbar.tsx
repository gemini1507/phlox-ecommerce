import { Layers, Moon, Bell, Search, Globe } from 'lucide-react';

const Topbar = ({ pageTitle = "Ringkasan" }: { pageTitle?: string }) => {
  return (
    <div className="h-16 flex items-center justify-between px-8 border-b border-border bg-background shrink-0">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Layers className="w-5 h-5 text-white" />
        <span className="text-sm font-medium">DASBOR</span>
        <span className="text-xs">/</span>
        <span className="text-sm font-medium text-white">{pageTitle}</span>
      </div>

      <div className="flex items-center gap-4 text-muted-foreground">
        <button className="hover:text-white transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        <button className="hover:text-white transition-colors">
          <Globe className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
