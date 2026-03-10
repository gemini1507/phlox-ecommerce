import { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

type WishItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
};

const sampleWishlist: WishItem[] = [
  { id: 1, name: 'Sony WH-1000XM5', price: 349.99, category: 'Headphones', imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&auto=format', rating: 5 },
  { id: 2, name: 'iPad Pro M2', price: 1099.99, category: 'Tablets', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format', rating: 5 },
  { id: 3, name: 'Samsung Galaxy Buds2 Pro', price: 199.99, category: 'Earphones', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=300&auto=format', rating: 4 },
];

const Wishlist = () => {
  const [items, setItems] = useState<WishItem[]>(sampleWishlist);
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const moveToCart = (item: WishItem) => {
    addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl });
    setAddedId(item.id);
    setTimeout(() => { setAddedId(null); removeItem(item.id); }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Heart className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold text-dark">My Wishlist</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">{items.length} items saved for later</p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                <button onClick={() => removeItem(item.id)} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
                <img src={item.imageUrl} alt={item.name} className="h-36 object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{item.category}</p>
                <h3 className="font-semibold text-dark text-sm mb-2">{item.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-dark">${item.price}</span>
                  <button
                    onClick={() => moveToCart(item)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                      addedId === item.id ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {addedId === item.id ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
