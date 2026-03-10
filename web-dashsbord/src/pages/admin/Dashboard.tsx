import { BarChart2, ShoppingBag, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const revenueData = [
  { day: 'Mon', value: 4200 }, { day: 'Tue', value: 5800 }, { day: 'Wed', value: 3900 },
  { day: 'Thu', value: 6200 }, { day: 'Fri', value: 7100 }, { day: 'Sat', value: 8900 }, { day: 'Sun', value: 5400 },
];

const stats = [
  { label: 'Total Revenue', value: '$138,752', change: '+12.4%', up: true, icon: DollarSign, color: 'text-primary' },
  { label: 'Total Orders', value: '3,842', change: '+8.1%', up: true, icon: ShoppingBag, color: 'text-blue-400' },
  { label: 'Total Customers', value: '12,405', change: '-2.3%', up: false, icon: Users, color: 'text-purple-400' },
  { label: 'Avg Order Value', value: '$36.10', change: '+4.5%', up: true, icon: BarChart2, color: 'text-yellow-400' },
];

const recentOrders = [
  { id: '#3021', customer: 'Danny Liu', product: 'Beats Studio Pro', total: '$349.99', status: 'Delivered' },
  { id: '#3020', customer: 'Bella Deviant', product: 'Apple Watch S9', total: '$799.98', status: 'Shipped' },
  { id: '#3019', customer: 'Darrell Steward', product: 'PlayStation 5', total: '$499.99', status: 'Processing' },
  { id: '#3018', customer: 'Sara Kim', product: 'Sony WH-1000XM5', total: '$279.99', status: 'Delivered' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-500/20 text-green-400',
  Shipped: 'bg-blue-500/20 text-blue-400',
  Processing: 'bg-yellow-500/20 text-yellow-400',
};

const Dashboard = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Dashboard Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-card p-5 rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-xs font-medium">{s.label}</p>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-white mb-2">{s.value}</p>
            <div className={`flex items-center gap-1 text-xs font-medium ${s.up ? 'text-primary' : 'text-red-400'}`}>
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {s.change} vs last week
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-8">
        <h3 className="text-white font-semibold mb-6">Weekly Revenue</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="day" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip
              contentStyle={{ background: '#1c1c1e', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
            />
            <Line type="monotone" dataKey="value" stroke="#a3e635" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-white font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left py-3 pr-4">Order ID</th>
                <th className="text-left py-3 pr-4">Customer</th>
                <th className="text-left py-3 pr-4">Product</th>
                <th className="text-left py-3 pr-4">Total</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((o, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 text-primary font-medium text-xs">{o.id}</td>
                  <td className="py-3 pr-4 text-white text-sm">{o.customer}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-sm">{o.product}</td>
                  <td className="py-3 pr-4 text-white font-semibold text-sm">{o.total}</td>
                  <td className="py-3">
                    <span className={`badge text-[10px] px-2 py-1 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
