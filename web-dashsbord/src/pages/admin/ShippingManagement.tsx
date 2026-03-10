import { useState } from 'react';
import { Package, Truck } from 'lucide-react';
import { apiFetch } from '../../lib/api';

const couriers = [
  { id: 'jne', name: 'JNE', logo: '📦', description: 'Jalur Nugraha Ekakurir', services: ['REG', 'YES', 'OKE'] },
  { id: 'jnt', name: 'J&T', logo: '🚚', description: 'J&T Express', services: ['EZ', 'SAMEDAY'] },
  { id: 'sicepat', name: 'SiCepat', logo: '⚡', description: 'SiCepat Express', services: ['HALU', 'BIMER', 'GOKIL'] },
];

const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar', 'Semarang', 'Palembang', 'Yogyakarta'];

type ShippingResult = { courier: string; service: string; cost: number; eta: string };

const ShippingManagement = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [results, setResults] = useState<ShippingResult[]>([]);
  const [loading, setLoading] = useState(false);

  // ===== HITUNG ONGKIR VIA API =====
  const calculate = async () => {
    if (!origin || !destination || !weight || +weight <= 0) return;
    setLoading(true);
    try {
      const data = await apiFetch('/shipping/calculate', {
        method: 'POST',
        body: JSON.stringify({ origin, destination, weight: Number(weight) }),
      });
      setResults(data.results);
    } catch (err) {
      alert('Gagal menghitung ongkir: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Shipping Management</h2>
        <p className="text-muted-foreground text-sm mt-1">Shipping cost calculator — JNE, J&T, SiCepat integration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" /> Shipping Calculator
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Origin City</label>
              <select value={origin} onChange={e => setOrigin(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary">
                <option value="">Select origin city</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Destination City</label>
              <select value={destination} onChange={e => setDestination(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary">
                <option value="">Select destination city</option>
                {cities.filter(c => c !== origin).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Package Weight (grams)</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 500" className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <button onClick={calculate} disabled={loading} className="w-full bg-primary text-black font-semibold py-2.5 rounded-xl hover:bg-primary-hover transition-colors text-sm mt-2 disabled:opacity-50">
              {loading ? 'Menghitung...' : 'Calculate Shipping Cost'}
            </button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-white font-semibold mb-4">Available Rates</h3>
          {results.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Enter details and calculate to see rates
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-96">
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors">
                  <div>
                    <p className="text-white text-sm font-semibold">{r.courier} — {r.service}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Estimated: {r.eta}</p>
                  </div>
                  <p className="text-primary font-bold text-sm">Rp {r.cost.toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {couriers.map(c => (
          <div key={c.id} className="bg-card rounded-2xl border border-border p-5">
            <div className="text-3xl mb-3">{c.logo}</div>
            <h4 className="text-white font-semibold text-sm mb-1">{c.name}</h4>
            <p className="text-muted-foreground text-xs mb-3">{c.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {c.services.map(s => (
                <span key={s} className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingManagement;
