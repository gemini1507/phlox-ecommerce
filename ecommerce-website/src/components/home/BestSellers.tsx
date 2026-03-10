import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { useCart } from '../../context/CartContext';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch('/products');
        setProducts(data.slice(0, 6));
      } catch (err) {
        console.error('Gagal mengambil produk:', err);
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

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-dark mb-2">Best Seller Products</h2>
        <p className="text-gray-500 text-sm">Our most popular products picked just for you</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
        {products.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} className="card group relative block">
            <div className="relative overflow-hidden bg-gray-50 h-52 flex items-center justify-center p-4">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                <Heart className="w-4 h-4 text-gray-400 hover:text-primary" />
              </button>
              {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="h-44 w-full object-contain group-hover:scale-105 transition-transform duration-500" />}
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{p.category}</p>
              <h3 className="text-sm font-semibold text-dark mb-2 group-hover:text-primary transition-colors">{p.name}</h3>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-dark">${p.price}</span>
                <button onClick={(e) => handleAdd(e, p)} disabled={p.stock === 0} className={`p-2 rounded-lg transition-all ${addedId === p.id ? 'bg-green-500 text-white scale-110' : 'bg-primary text-white hover:bg-primary-dark hover:scale-110 active:scale-95'} disabled:opacity-30`}>
                  {addedId === p.id ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
