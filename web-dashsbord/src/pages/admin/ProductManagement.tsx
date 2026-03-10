import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { apiFetch } from '../../lib/api';

type Product = {
  id: number;
  name: string;
  description: string | null;
  specs: string | null;
  reviews: string | null;
  category: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  
  const initialForm = { name: '', description: '', specs: '', reviews: '', category: '', price: '', stock: '', imageUrl: '' };
  const [form, setForm] = useState(initialForm);

  // ===== AMBIL DATA PRODUK DARI API =====
  const fetchProducts = async () => {
    try {
      const data = await apiFetch('/products');
      setProducts(data);
    } catch (err) {
      console.error('Gagal mengambil produk:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm(initialForm); setShowModal(true); };
  const openEdit = (p: Product) => { 
    setEditing(p); 
    setForm({ 
      name: p.name, 
      description: p.description || '',
      specs: p.specs || '',
      reviews: p.reviews || '',
      category: p.category, 
      price: String(p.price), 
      stock: String(p.stock), 
      imageUrl: p.imageUrl || '' 
    }); 
    setShowModal(true); 
  };

  // ===== HAPUS PRODUK VIA API =====
  const remove = async (id: number) => {
    if (!confirm('Apakah yaki ingin menghapus produk ini?')) return;
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Gagal menghapus produk: ' + (err as Error).message);
    }
  };

  // ===== SIMPAN PRODUK (TAMBAH / EDIT) VIA API =====
  const save = async () => {
    try {
      const body = JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        specs: form.specs || undefined,
        reviews: form.reviews || undefined,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl || undefined,
      });

      if (editing) {
        // EDIT
        const res = await apiFetch(`/products/${editing.id}`, { method: 'PUT', body });
        setProducts(prev => prev.map(p => p.id === editing.id ? res.product : p));
      } else {
        // TAMBAH
        const res = await apiFetch('/products', { method: 'POST', body });
        setProducts(prev => [res.product, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert('Gagal menyimpan: ' + (err as Error).message);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Product Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your inventory, prices, and product details.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-black font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-hover transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-primary" />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="py-4 px-6 font-medium">Product</th>
              <th className="py-4 px-4 font-medium">Category</th>
              <th className="py-4 px-4 font-medium">Price</th>
              <th className="py-4 px-4 font-medium">Stock</th>
              <th className="py-4 px-4 font-medium">Status</th>
              <th className="py-4 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 flex items-center gap-3">
                  {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-contain bg-background p-1" />}
                  <div>
                    <span className="text-white text-sm font-medium block">{p.name}</span>
                    <div className="flex gap-2 mt-1">
                      {p.description && <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded">Desc</span>}
                      {p.specs && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 rounded">Specs</span>}
                      {p.reviews && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 rounded">Reviews</span>}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground text-sm">{p.category}</td>
                <td className="py-4 px-4 text-primary font-semibold text-sm">${p.price}</td>
                <td className="py-4 px-4 text-white text-sm">{p.stock}</td>
                <td className="py-4 px-4">
                  <span className={`badge text-[10px] px-2 py-1 rounded-full ${p.stock === 0 ? 'bg-red-500/20 text-red-400' : p.stock < 10 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                    {p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-white/5 hover:bg-white/10 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(p.id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-muted-foreground text-sm">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-white font-semibold text-xl">{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white/80 border-b border-border pb-2">Basic Info</h4>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Product Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Category *</label>
                      <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Stock Quantity *</label>
                      <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Price ($) *</label>
                    <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Image URL</label>
                    <input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary" />
                  </div>
                </div>

                {/* Detailed Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white/80 border-b border-border pb-2">Detailed Content</h4>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                    <textarea 
                      value={form.description} 
                      onChange={e => setForm({...form, description: e.target.value})} 
                      rows={3}
                      placeholder="Product description for the main tab..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary resize-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Specifications (JSON format recommended)</label>
                    <textarea 
                      value={form.specs} 
                      onChange={e => setForm({...form, specs: e.target.value})} 
                      rows={3}
                      placeholder='e.g: [{"label": "Weight", "value": "350g"}]'
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary resize-none font-mono text-[11px]" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Reviews (JSON format recommended)</label>
                    <textarea 
                      value={form.reviews} 
                      onChange={e => setForm({...form, reviews: e.target.value})} 
                      rows={3}
                      placeholder='e.g: [{"name": "John", "rating": 5, "text": "Great!"}]'
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-primary resize-none font-mono text-[11px]" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-border text-white bg-background py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
              <button 
                onClick={save} 
                disabled={!form.name || !form.category || !form.price || !form.stock}
                className="flex-[2] bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
