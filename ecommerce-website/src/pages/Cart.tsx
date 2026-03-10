import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../lib/api';

const Cart = () => {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const total = subtotal - (subtotal * discount / 100);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await apiFetch('/promos/verify', {
        method: 'POST',
        body: JSON.stringify({ code: coupon, orderTotal: subtotal }),
      });
      setDiscount(res.type === 'Percentage' ? res.value : (res.discount / subtotal) * 100);
      setCouponMsg(`✓ ${res.message}`);
    } catch (err) {
      setCouponMsg('✗ ' + (err as Error).message);
      setDiscount(0);
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/shop" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-dark mb-8">Shopping Cart ({items.length} items)</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Your cart is empty</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain rounded-xl bg-gray-50 p-2" />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark text-sm mb-1 truncate">{item.name}</h3>
                  <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-semibold w-5 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  <p className="font-bold text-sm">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code (try SAVE20)" className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
              <button onClick={applyCoupon} disabled={applyingCoupon} className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50">{applyingCoupon ? '...' : 'Apply'}</button>
            </div>
            {couponMsg && <p className={`text-sm font-medium ${couponMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>{couponMsg}</p>}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-dark mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({discount.toFixed(0)}%)</span><span>-${(subtotal * discount / 100).toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-green-600 font-medium">Free</span></div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
            </div>
            <Link to="/checkout" className="btn-primary w-full py-3 text-sm font-semibold block text-center">Proceed to Checkout</Link>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500"><span>🔒</span> Secure SSL encrypted checkout</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
