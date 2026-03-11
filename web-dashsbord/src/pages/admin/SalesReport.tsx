import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../../lib/api';

const chartStyle = {
  contentStyle: { background: '#1c1c1e', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }
};

const SalesReport = () => {
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

  // Filter only valid orders for revenue computation (assuming 'Cancelled' are usually ignored from revenue)
  const validOrders = orders.filter(o => o.status !== 'Cancelled');

  // Today Revenue Compute
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysRevenue = validOrders
    .filter(o => new Date(o.createdAt) >= today)
    .reduce((sum, o) => sum + o.total, 0);

  // This Month Revenue
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthRevenue = validOrders
    .filter(o => new Date(o.createdAt) >= firstDayOfMonth)
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = validOrders.length;
  const avgOrderValue = totalOrders > 0 ? (validOrders.reduce((sum, o) => sum + o.total, 0) / totalOrders) : 0;

  // Compute Weekly Daily Data (Similar to dashboard)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyData = Array(7).fill(0).map((_, i) => ({ day: days[i], revenue: 0, orders: 0 }));
  
  validOrders.forEach(order => {
    if (order.createdAt) {
      const date = new Date(order.createdAt);
      // Optional: limit to only *this week's* dates for a true weekly chart
      const dayIndex = date.getDay();
      dailyData[dayIndex].revenue += order.total;
      dailyData[dayIndex].orders += 1;
    }
  });

  const formattedDailyData = [
    dailyData[1], dailyData[2], dailyData[3], dailyData[4], 
    dailyData[5], dailyData[6], dailyData[0]
  ];

  // Compute Monthly Data for this year
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = Array(12).fill(0).map((_, i) => ({ month: months[i], revenue: 0 }));

  validOrders.forEach(order => {
    if (order.createdAt) {
      const date = new Date(order.createdAt);
      if (date.getFullYear() === today.getFullYear()) {
        monthlyData[date.getMonth()].revenue += order.total;
      }
    }
  });

  // Top Products computation
  const productStats: Record<string, { name: string, category: string, sales: number, revenue: number }> = {};
  
  validOrders.forEach(order => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item: any) => {
        const pName = item.product?.name || 'Unknown Product';
        const pCategory = item.product?.category || 'General';
        
        if (!productStats[pName]) {
          productStats[pName] = { name: pName, category: pCategory, sales: 0, revenue: 0 };
        }
        productStats[pName].sales += item.quantity;
        productStats[pName].revenue += (item.price * item.quantity);
      });
    }
  });

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map((p, index) => ({ ...p, rank: index + 1 }));

  if (loading) {
    return <div className="p-8 text-white">Loading sales reports...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Sales Reports</h2>
        <p className="text-muted-foreground text-sm mt-1">Daily and monthly revenue statistics.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Today\'s Revenue', value: `$${todaysRevenue.toLocaleString()}`, change: 'Today' },
          { label: 'This Month', value: `$${thisMonthRevenue.toLocaleString()}`, change: 'Current Month' },
          { label: 'Total Valid Orders', value: totalOrders.toLocaleString(), change: 'Overall' },
          { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, change: 'Per transaction' },
        ].map((s, i) => (
          <div key={i} className="bg-card p-5 rounded-2xl border border-border">
            <p className="text-muted-foreground text-xs mb-2">{s.label}</p>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-primary text-xs mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Revenue */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-white font-semibold mb-4">Daily Revenue (By Day of Week)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={formattedDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip {...chartStyle} formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#a3e635" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-white font-semibold mb-4">Monthly Revenue (This Year)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip {...chartStyle} formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#a3e635" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best-selling products */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-white font-semibold mb-4">Best-Selling Products</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left py-3 pr-4">#</th>
              <th className="text-left py-3 pr-4">Product</th>
              <th className="text-left py-3 pr-4">Units Sold</th>
              <th className="text-left py-3">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {topProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">No sales data found yet.</td>
              </tr>
            ) : topProducts.map(p => (
              <tr key={p.rank} className="hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4 text-muted-foreground font-bold text-sm">#{p.rank}</td>
                <td className="py-3 pr-4 text-white text-sm font-medium">{p.name}</td>
                <td className="py-3 pr-4 text-white text-sm">{p.sales}</td>
                <td className="py-3 text-primary font-semibold text-sm">${p.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
