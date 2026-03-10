import { UserPlus, ShoppingCart, DollarSign, Mail, MoreHorizontal, Phone, Mail as MailIcon } from 'lucide-react';

const notifications = [
  { icon: UserPlus, title: '56 New users registered.', time: 'Just now', color: 'text-primary' },
  { icon: ShoppingCart, title: '132 Orders placed.', time: '59 Minutes ago', color: 'text-white' },
  { icon: DollarSign, title: 'Funds have been withdrawn.', time: '12 Hours ago', color: 'text-white' },
  { icon: Mail, title: '5 Unread messages.', time: 'Today, 11:59 PM', color: 'text-white' },
];

const activities = [
  { img: 'https://i.pravatar.cc/150?u=1', title: 'Changed the style.', time: 'Just now', action: 'edit' },
  { img: 'https://i.pravatar.cc/150?u=2', title: '177 New products added.', time: '47 Minutes ago', action: 'add' },
  { img: 'https://i.pravatar.cc/150?u=3', title: '11 Products have been archived.', time: '1 Days ago', action: 'archive' },
  { img: 'https://i.pravatar.cc/150?u=4', title: 'Page "Toys" has been removed.', time: 'Feb 2, 2024', action: 'delete' },
];

const contacts = [
  { name: 'Daniel Craig', img: 'https://i.pravatar.cc/150?u=daniel' },
  { name: 'Kate Morrison', img: 'https://i.pravatar.cc/150?u=kate' },
  { name: 'Nataniel Donowan', img: 'https://i.pravatar.cc/150?u=nat', active: true },
  { name: 'Elisabeth Wayne', img: 'https://i.pravatar.cc/150?u=eli' },
  { name: 'Felicia Raspet', img: 'https://i.pravatar.cc/150?u=felicia' },
];

const RightSidebar = () => {
  return (
    <div className="w-[300px] bg-background border-l border-border h-full flex flex-col pt-6 pb-6 px-4 overflow-y-auto no-scrollbar">
      
      {/* Notifications */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-white mb-4">Notifications</h3>
        <ul className="space-y-4">
          {notifications.map((n, i) => (
            <li key={i} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 mt-0.5">
                <n.icon className={`w-4 h-4 ${n.color}`} />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Activities */}
      <div className="mb-8 relative">
        <h3 className="text-sm font-semibold text-white mb-4">Activities</h3>
        <div className="absolute left-[15px] top-[40px] bottom-[20px] w-[1px] bg-border z-0"></div>
        <ul className="space-y-5 relative z-10">
          {activities.map((a, i) => (
            <li key={i} className="flex gap-3 items-start relative">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-background shrink-0 mt-0.5 relative z-10 bg-background">
                <img src={a.img} alt="Activity User" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Contacts */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Contacts of your managers</h3>
        <ul className="space-y-3">
          {contacts.map((c, i) => (
            <li key={i} className={`flex items-center justify-between p-2 -mx-2 rounded-xl transition-all cursor-pointer ${
              c.active ? 'bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(163,230,53,0.1)]' : 'hover:bg-card'
            }`}>
              <div className="flex items-center gap-3">
                <img src={c.img} alt={c.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm text-white font-medium">{c.name}</span>
              </div>
              
              {c.active ? (
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary-hover transition-colors shadow-[0_0_10px_rgba(163,230,53,0.4)]">
                    <MailIcon className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary-hover transition-colors shadow-[0_0_10px_rgba(163,230,53,0.4)]">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default RightSidebar;
