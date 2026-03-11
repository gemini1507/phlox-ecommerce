import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const dailyData = [
  { day: 'Mon', revenue: 4200, orders: 28 }, { day: 'Tue', revenue: 5800, orders: 36 },
  { day: 'Wed', revenue: 3900, orders: 24 }, { day: 'Thu', revenue: 6200, orders: 42 },
  { day: 'Fri', revenue: 7100, orders: 48 }, { day: 'Sat', revenue: 8900, orders: 61 }, { day: 'Sun', revenue: 5400, orders: 35 },
];

const monthlyData = [
  { month: 'Jan', revenue: 42000 }, { month: 'Feb', revenue: 58000 }, { month: 'Mar', revenue: 47000 },
  { month: 'Apr', revenue: 64000 }, { month: 'May', revenue: 71000 }, { month: 'Jun', revenue: 89000 },
  { month: 'Jul', revenue: 76000 }, { month: 'Aug', revenue: 92000 }, { month: 'Sep', revenue: 68000 },
  { month: 'Oct', revenue: 85000 }, { month: 'Nov', revenue: 112000 }, { month: 'Dec', revenue: 138000 },
];

const topProducts = [
  { rank: 1, name: 'Beats Studio Pro', category: 'Headphones', sales: 248, revenue: '$86,712' },
  { rank: 2, name: 'Apple Watch S9', category: 'Wearables', sales: 185, revenue: '$73,998' },
  { rank: 3, name: 'PlayStation 5', category: 'Gaming', sales: 124, revenue: '$61,998' },
  { rank: 4, name: 'MacBook Pro M3', category: 'Laptops', sales: 67, revenue: '$87,099' },
  { rank: 5, name: 'Amazon Echo Studio', category: 'Speakers', sales: 312, revenue: '$62,398' },
];

const chartStyle = {
  contentStyle: { background: '#1c1c1e', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }
};

const SalesReport = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Sales Reports</h2>
        <p className="text-muted-foreground text-sm mt-1">Daily and monthly revenue statistics.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Today\'s Revenue', value: '$8,900', change: '+12% vs yesterday' },
          { label: 'This Month', value: '$138,752', change: '+22% vs last month' },
          { label: 'Total Orders', value: '274', change: 'This week' },
          { label: 'Avg Order Value', value: '$36.10', change: 'Per transaction' },
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
          <h3 className="text-white font-semibold mb-4">Daily Revenue (This Week)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
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
              <th className="text-left py-3 pr-4">Category</th>
              <th className="text-left py-3 pr-4">Units Sold</th>
              <th className="text-left py-3">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {topProducts.map(p => (
              <tr key={p.rank} className="hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4 text-muted-foreground font-bold text-sm">#{p.rank}</td>
                <td className="py-3 pr-4 text-white text-sm font-medium">{p.name}</td>
                <td className="py-3 pr-4 text-muted-foreground text-sm">{p.category}</td>
                <td className="py-3 pr-4 text-white text-sm">{p.sales}</td>
                <td className="py-3 text-primary font-semibold text-sm">{p.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
