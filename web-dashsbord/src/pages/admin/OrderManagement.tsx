import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { apiFetch } from '../../lib/api';

type OrderItem = { id: number; quantity: number; price: number; product: { name: string; imageUrl: string | null } };
type Order = {
  id: number;
  userId: number;
  total: number;
  status: string;
  courier: string | null;
  trackingNo: string | null;
  createdAt: string;
  user: { id: number; name: string; email: string };
  items: OrderItem[];
};

const statuses = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColors: Record<string, string> = {
  Delivered: 'bg-green-500/20 text-green-400',
  Shipped: 'bg-blue-500/20 text-blue-400',
  Processing: 'bg-yellow-500/20 text-yellow-400',
  Cancelled: 'bg-red-500/20 text-red-400',
};
const nextStatus: Record<string, string> = {
  Processing: 'Shipped',
  Shipped: 'Delivered',
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selected, setSelected] = useState<Order | null>(null);

  // ===== AMBIL DATA ORDER DARI API =====
  const fetchOrders = async () => {
    try {
      const data = await apiFetch('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Gagal mengambil orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders
    .filter(o => filterStatus === 'All' || o.status === filterStatus)
    .filter(o => o.user.name.toLowerCase().includes(search.toLowerCase()) || String(o.id).includes(search));

  // ===== UPDATE STATUS VIA API =====
  const advance = async (id: number) => {
    const order = orders.find(o => o.id === id);
    if (!order || !nextStatus[order.status]) return;

    try {
      await apiFetch(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus[order.status] }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus[o.status] } : o));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: nextStatus[prev.status] } : null);
    } catch (err) {
      alert('Gagal update status: ' + (err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Order Management</h2>
        <p className="text-muted-foreground text-sm mt-1">View and manage all incoming orders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..." className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-primary" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterStatus === s ? 'bg-primary text-black' : 'bg-card border border-border text-muted-foreground hover:text-white'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left py-4 px-5">Order</th>
                <th className="text-left py-4 px-4">Customer</th>
                <th className="text-left py-4 px-4">Total</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-left py-4 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Belum ada pesanan.</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} onClick={() => setSelected(o)} className={`cursor-pointer hover:bg-white/5 transition-colors ${selected?.id === o.id ? 'bg-white/5' : ''}`}>
                  <td className="py-3 px-5 text-primary text-xs font-medium">#{o.id}</td>
                  <td className="py-3 px-4">
                    <p className="text-white text-sm">{o.user.name}</p>
                    <p className="text-muted-foreground text-xs">{o.user.email}</p>
                  </td>
                  <td className="py-3 px-4 text-white font-semibold text-sm">${o.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`badge text-[10px] px-2 py-1 rounded-full ${statusColors[o.status] || ''}`}>{o.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    {nextStatus[o.status] && (
                      <button onClick={(e) => { e.stopPropagation(); advance(o.id); }} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-lg hover:bg-primary/40 transition-colors font-medium">
                        → {nextStatus[o.status]}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5">
          {selected ? (
            <>
              <h3 className="text-white font-semibold mb-4">Order Detail — #{selected.id}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="text-white">{selected.user.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span className="text-white text-right max-w-[180px]">{selected.items.map(i => `${i.product.name} x${i.quantity}`).join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-white">{new Date(selected.createdAt).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="text-primary font-bold">${selected.total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Courier</span><span className="text-white">{selected.courier || '-'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tracking</span><span className="text-white font-mono text-xs">{selected.trackingNo || '-'}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><span className={`badge text-[10px] px-2 py-1 rounded-full ${statusColors[selected.status] || ''}`}>{selected.status}</span></div>
              </div>
              {nextStatus[selected.status] && (
                <button onClick={() => advance(selected.id)} className="w-full mt-6 bg-primary text-black font-semibold py-2.5 rounded-xl hover:bg-primary-hover transition-colors text-sm">
                  Mark as {nextStatus[selected.status]}
                </button>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ChevronDown className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">Click on an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
