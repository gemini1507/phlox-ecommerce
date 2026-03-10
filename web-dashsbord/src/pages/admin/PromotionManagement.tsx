import { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Zap, Percent } from 'lucide-react';
import { apiFetch } from '../../lib/api';

type Coupon = {
  id: number;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  uses: number;
  active: boolean;
  expiresAt: string | null;
};

const PromotionManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'Percentage', value: '', minOrder: '', expiresAt: '' });

  // ===== AMBIL DATA PROMO DARI API =====
  const fetchCoupons = async () => {
    try {
      const data = await apiFetch('/promos');
      setCoupons(data);
    } catch (err) {
      console.error('Gagal mengambil promos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  // ===== TAMBAH COUPON VIA API =====
  const addCoupon = async () => {
    if (!newCoupon.code || !newCoupon.value) return;
    try {
      const res = await apiFetch('/promos', {
        method: 'POST',
        body: JSON.stringify({
          code: newCoupon.code,
          type: newCoupon.type,
          value: Number(newCoupon.value),
          minOrder: Number(newCoupon.minOrder) || 0,
          expiresAt: newCoupon.expiresAt || null,
        }),
      });
      setCoupons(prev => [res.coupon, ...prev]);
      setNewCoupon({ code: '', type: 'Percentage', value: '', minOrder: '', expiresAt: '' });
      setShowCouponForm(false);
    } catch (err) {
      alert('Gagal membuat coupon: ' + (err as Error).message);
    }
  };

  // ===== TOGGLE AKTIF/NONAKTIF VIA API =====
  const toggleCoupon = async (id: number) => {
    try {
      const res = await apiFetch(`/promos/${id}`, { method: 'PUT' });
      setCoupons(prev => prev.map(c => c.id === id ? res.coupon : c));
    } catch (err) {
      alert('Gagal toggle coupon: ' + (err as Error).message);
    }
  };

  // ===== HAPUS COUPON VIA API =====
  const deleteCoupon = async (id: number) => {
    try {
      await apiFetch(`/promos/${id}`, { method: 'DELETE' });
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Gagal hapus coupon: ' + (err as Error).message);
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
        <h2 className="text-2xl font-semibold text-white">Promotion Management</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage coupon codes, flash sales, and special offers.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active Coupons', value: coupons.filter(c => c.active).length, icon: Tag, color: 'text-primary' },
          { label: 'Inactive Coupons', value: coupons.filter(c => !c.active).length, icon: Zap, color: 'text-yellow-400' },
          { label: 'Total Coupon Uses', value: coupons.reduce((s, c) => s + c.uses, 0), icon: Percent, color: 'text-blue-400' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className={`w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">{s.label}</p>
              <p className="text-xl font-bold text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Coupon Codes</h3>
          <button onClick={() => setShowCouponForm(!showCouponForm)} className="flex items-center gap-1.5 bg-primary text-black text-sm font-semibold px-3 py-2 rounded-xl hover:bg-primary-hover transition-colors">
            <Plus className="w-4 h-4" /> Add Coupon
          </button>
        </div>

        {showCouponForm && (
          <div className="bg-background rounded-xl border border-border p-4 mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            <input value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} placeholder="Coupon Code" className="bg-card border border-border rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary" />
            <select value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value})} className="bg-card border border-border rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary">
              <option>Percentage</option> <option>Fixed</option>
            </select>
            <input value={newCoupon.value} onChange={e => setNewCoupon({...newCoupon, value: e.target.value})} placeholder="Discount value" type="number" className="bg-card border border-border rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary" />
            <input value={newCoupon.minOrder} onChange={e => setNewCoupon({...newCoupon, minOrder: e.target.value})} placeholder="Min. order ($)" type="number" className="bg-card border border-border rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary" />
            <input value={newCoupon.expiresAt} onChange={e => setNewCoupon({...newCoupon, expiresAt: e.target.value})} type="date" className="bg-card border border-border rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary" />
            <button onClick={addCoupon} className="bg-primary text-black font-semibold rounded-lg py-2 text-sm hover:bg-primary-hover transition-colors">Save Coupon</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left py-3 pr-4">Code</th>
                <th className="text-left py-3 pr-4">Discount</th>
                <th className="text-left py-3 pr-4">Min Order</th>
                <th className="text-left py-3 pr-4">Uses</th>
                <th className="text-left py-3 pr-4">Expires</th>
                <th className="text-left py-3 pr-4">Status</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 font-mono text-primary font-bold text-sm">{c.code}</td>
                  <td className="py-3 pr-4 text-white text-sm">{c.type === 'Percentage' ? `${c.value}%` : `$${c.value}`}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-sm">${c.minOrder}</td>
                  <td className="py-3 pr-4 text-white text-sm">{c.uses}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-sm">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '-'}</td>
                  <td className="py-3 pr-4">
                    <button onClick={() => toggleCoupon(c.id)} className={`text-[10px] px-2 py-1 rounded-full font-medium ${c.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3">
                    <button onClick={() => deleteCoupon(c.id)} className="text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

export default PromotionManagement;
