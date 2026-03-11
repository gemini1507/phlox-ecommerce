import { useState, useEffect } from 'react';
import { BarChart2, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { apiFetch } from '../../lib/api';

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-500/20 text-green-400',
  Shipped: 'bg-blue-500/20 text-blue-400',
  Processing: 'bg-yellow-500/20 text-yellow-400',
  Cancelled: 'bg-red-500/20 text-red-400',
};

const Dashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiFetch('/orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Compute stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  
  // Calculate unique customers based on unique userIds in orders
  const uniqueCustomers = new Set(orders.map(o => o.userId)).size;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: 'Overall', up: true, icon: DollarSign, color: 'text-primary' },
    { label: 'Total Orders', value: totalOrders.toLocaleString(), change: 'Overall', up: true, icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Active Customers', value: uniqueCustomers.toLocaleString(), change: 'Overall', up: true, icon: Users, color: 'text-purple-400' },
    { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, change: 'Overall', up: true, icon: BarChart2, color: 'text-yellow-400' },
  ];

  // Compute Revenue Chart Data (Grouping by Day of week for the past 7 days, simplistic approach)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const revenueByDay = Array(7).fill(0).map((_, i) => ({ day: days[i], value: 0 }));
  
  orders.forEach(order => {
    if (order.createdAt && (order.status !== 'Cancelled')) {
      const date = new Date(order.createdAt);
      const dayIndex = date.getDay();
      revenueByDay[dayIndex].value += order.total;
    }
  });

  // Reorder starting from Monday for standard view
  const formattedRevenueData = [
    revenueByDay[1], revenueByDay[2], revenueByDay[3], revenueByDay[4], 
    revenueByDay[5], revenueByDay[6], revenueByDay[0]
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  if (loading) {
    return <div className="p-8 text-white">Loading dashboard data...</div>;
  }

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
            <div className={`flex items-center gap-1 text-xs font-medium text-muted-foreground`}>
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-8">
        <h3 className="text-white font-semibold mb-6">Total Revenue by Day</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formattedRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="day" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip
              contentStyle={{ background: '#1c1c1e', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
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
                <th className="text-left py-3 pr-4">Items Count</th>
                <th className="text-left py-3 pr-4">Total</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground text-sm">No orders found yet.</td>
                </tr>
              ) : recentOrders.map((o, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 text-primary font-medium text-xs">#{o.id}</td>
                  <td className="py-3 pr-4 text-white text-sm">{o.user?.name || 'Unknown'}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-sm">
                    {o.items && o.items.length > 0 
                      ? o.items.map((item: any) => item.product?.name).join(', ') 
                      : 'No items'}
                  </td>
                  <td className="py-3 pr-4 text-white font-semibold text-sm">${o.total.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`badge text-[10px] px-2 py-1 rounded-full ${statusColors[o.status] || 'bg-gray-500/20 text-gray-400'}`}>
                      {o.status}
                    </span>
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
