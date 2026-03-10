import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: { id: number; name: string; price: number; imageUrl: string | null }) => void;
  updateQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: { id: number; name: string; price: number; imageUrl: string | null }) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setItems([]);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};
