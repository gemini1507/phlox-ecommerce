import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShoppingCart, Heart, Check } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useSearchParams } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

const categories = ['All', 'Headphones', 'Earphones', 'Wearables', 'Laptops', 'Gaming', 'Speakers'];

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const handleAdd = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = products
    .filter(p => p.stock > 0)
    .filter(p => selectedCat === 'All' || p.category === selectedCat)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-dark mb-2">Shop</h1>
      <p className="text-gray-500 text-sm mb-8">{filtered.length} products found</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary">
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCat === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} className="card group relative block">
            <div className="relative overflow-hidden bg-gray-50 h-48 flex items-center justify-center p-4">
              {p.stock === 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-medium">Sold Out</span>}
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                <Heart className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
              </button>
              {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="h-40 object-contain group-hover:scale-105 transition-transform duration-500" />}
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-0.5">{p.category}</p>
              <h3 className="text-sm font-semibold text-dark mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-dark">${p.price}</span>
                <button onClick={(e) => handleAdd(e, p)} disabled={p.stock === 0} className={`p-1.5 rounded-lg transition-all ${addedId === p.id ? 'bg-green-500 text-white scale-110' : 'bg-primary text-white hover:bg-primary-dark'} disabled:opacity-30`}>
                  {addedId === p.id ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shop;
