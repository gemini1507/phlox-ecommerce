import { Truck, RefreshCw, Headphones, ShieldCheck } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'Free Shipping On All Order',
  },
  {
    icon: RefreshCw,
    title: 'Money Guarantee',
    desc: '30 Day Money Back',
  },
  {
    icon: Headphones,
    title: 'Online Support 24/7',
    desc: 'Technical Support 24/7',
    iconColor: 'text-primary',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    desc: 'All Cards Accepted',
  },
];

const TrustBadges = () => {
  return (
    <section className="border-y border-gray-100 bg-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${b.iconColor || 'text-gray-500'} group-hover:text-primary transition-colors`}>
                <b.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-dark">{b.title}</p>
                <p className="text-xs text-gray-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
