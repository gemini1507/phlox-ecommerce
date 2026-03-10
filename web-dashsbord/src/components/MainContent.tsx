import { ArrowUpRight, MoreVertical, DollarSign, Target, ShoppingCart, FileText, ChevronDown, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

// Data for charts
const pieData = [
  { name: 'Electronic', value: 55640, color: '#a3e635' }, // Green
  { name: 'Clothes', value: 1840, color: '#fef08a' }, // Yellow
  { name: 'Furniture', value: 11420, color: '#f87171' }, // Red
  { name: 'Shoes', value: 2120, color: '#38bdf8' }, // Blue
];

const lineData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const customers = [
  { name: 'Danny Liu', email: 'danny@gmail.com', deals: '1,023', total: '$37,431', img: 'https://i.pravatar.cc/150?u=danny' },
  { name: 'Bella Deviant', email: 'bella@gmail.com', deals: '963', total: '$30,423', img: 'https://i.pravatar.cc/150?u=bella' },
  { name: 'Darrell Steward', email: 'darrell@gmail.com', deals: '843', total: '$28,549', img: 'https://i.pravatar.cc/150?u=darrell' },
];

const MainContent = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <div className="flex items-center text-sm text-muted-foreground gap-2 cursor-pointer hover:text-white transition-colors">
          Today
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-5 rounded-2xl border border-border">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Net revenue</h3>
          <p className="text-3xl font-bold text-white mb-2">$3,131,021</p>
          <div className="flex items-center text-primary text-xs font-medium content-center">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            0.4% vs last month
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">ARR</h3>
          <p className="text-3xl font-bold text-white mb-2">$1,511,121</p>
          <div className="flex items-center text-primary text-xs font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            32% vs last quarter
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Quarterly revenue goal</h3>
          <p className="text-3xl font-bold text-white mb-2">71%</p>
          <div className="flex items-center text-muted-foreground text-xs justify-between">
            Goal: $1.1M
            <div className="w-8 h-8 rounded-full border-r-2 border-t-2 border-primary border-l-2 border-b-2 border-border rotate-45"></div>
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">New orders</h3>
          <p className="text-3xl font-bold text-white mb-2">18,221</p>
          <div className="flex items-center text-primary text-xs font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            11% vs last quarter
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-card rounded-2xl border border-border p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Sales Overview</h2>
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">102k</span>
                <span className="text-xs text-muted-foreground">Weekly Visits</span>
              </div>
            </div>
            
            <div className="flex-1 ml-10">
              <div className="flex items-center gap-3 mb-6 bg-background rounded-lg p-3 inline-flex">
                 <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground">Number of Sales</p>
                   <p className="text-lg font-semibold text-white">$71,020</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {pieData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">${item.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 bg-card rounded-2xl border border-border p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mb-4 text-primary">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">New customers:</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-semibold text-white">862</p>
                  <span className="text-xs font-medium text-red-400">-8%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-[10px]">Last Week</p>
              </div>
            </div>
            <div className="flex-1 bg-card rounded-2xl border border-border p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mb-4 text-primary">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total profit:</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-semibold text-white">$25.6k</p>
                  <span className="text-xs font-medium text-primary">+42%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-[10px]">Weekly Profit</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 flex-1 flex flex-col">
             <div className="flex justify-between items-start mb-2">
                <div>
                   <h3 className="text-sm font-medium text-white mb-1">Total Profit:</h3>
                   <p className="text-[10px] text-muted-foreground">February 2024</p>
                   <p className="text-xl font-bold text-white mt-1">$136,755.77</p>
                </div>
             </div>
             <div className="flex-1 -mx-2 mt-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <Line type="monotone" dataKey="value" stroke="#a3e635" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                {/* Glow effect hack for chart */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"></div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-card rounded-2xl border border-border p-6 h-full flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Customer list</h2>
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1">
             <div className="grid grid-cols-3 text-xs text-muted-foreground border-b border-border pb-3 mb-3">
                 <div>Name</div>
                 <div>Deals</div>
                 <div>Total Deal Value</div>
             </div>
             
             <div className="flex flex-col space-y-4">
                {customers.map((c, i) => (
                  <div key={i} className="grid grid-cols-3 items-center hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                     <div className="flex items-center gap-3">
                        <img src={c.img} alt={c.name} className="w-8 h-8 rounded-full" />
                        <div>
                           <p className="text-sm font-medium text-white">{c.name}</p>
                           <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                     </div>
                     <div className="text-sm text-white font-medium">{c.deals}</div>
                     <div className="text-sm text-white font-medium">{c.total}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div>
           <div className="relative rounded-2xl overflow-hidden p-6 h-full flex flex-col justify-between bg-gradient-to-br from-green-900/40 via-green-800/20 to-card border border-primary/20">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-6">
                 <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 inline-flex">
                    <Target className="w-3 h-3" />
                    Premium Plane
                 </div>
                 <MoreVertical className="w-5 h-5 text-white/50" />
              </div>
              
              <div className="relative z-10 mb-6">
                 <div className="flex items-baseline gap-2 mb-2">
                    <h2 className="text-4xl font-bold text-white">$30</h2>
                    <span className="text-sm text-white/70">/ Per Month<br/>/ Per User</span>
                 </div>
                 <p className="text-sm text-white/80 leading-relaxed max-w-[80%]">
                    Improve your workplace, view and analyze your profits and losses ✨
                 </p>
              </div>
              
              <div className="relative z-10 flex gap-2">
                 <button className="flex-1 bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                    Get Started
                 </button>
                 <button className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-xl text-white hover:bg-white/20 transition-colors">
                    <FileText className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
