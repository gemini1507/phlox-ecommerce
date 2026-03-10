import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [courier, setCourier] = useState('JNE REG');
  const [address, setAddress] = useState({ street: '', city: 'Jakarta', phone: '' });
  const [shippingCost] = useState(9000);

  const total = subtotal + shippingCost;

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-dark mb-2">Login Required</h2>
        <p className="text-gray-500 text-sm mb-6">Please sign in to proceed with checkout.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <h2 className="text-xl font-bold text-dark mb-2">Cart is Empty</h2>
        <p className="text-gray-500 text-sm mb-6">Add items to your cart before checking out.</p>
        <Link to="/shop" className="btn-primary">Go Shopping</Link>
      </div>
    );
  }

  const handleOrder = async () => {
    if (!address.street || !address.phone) return;
    setStep('processing');

    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.qty })),
          courier,
        }),
      });
      clearCart();
      setStep('success');
    } catch (err) {
      alert('Gagal membuat pesanan: ' + (err as Error).message);
      setStep('form');
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">Order Placed! 🎉</h2>
        <p className="text-gray-500 text-sm mb-8">Thank you {user?.name}! Your order is being processed. Check your order status in My Orders.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="btn-primary">View My Orders</Link>
          <Link to="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Processing your order...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link to="/cart" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      <h1 className="text-3xl font-bold text-dark mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-dark mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Shipping Address
            </h2>
            <div className="space-y-3">
              <input type="text" placeholder="Full address (street, building, etc.)" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" required />
              <div className="grid grid-cols-2 gap-3">
                <select value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary">
                  {['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar', 'Semarang', 'Yogyakarta'].map(c => <option key={c}>{c}</option>)}
                </select>
                <input type="tel" placeholder="Phone number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" required />
              </div>
            </div>
          </div>

          {/* Courier */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-dark mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" /> Shipping Method
            </h2>
            <div className="space-y-2">
              {[
                { label: 'JNE REG', desc: '3-5 days', price: 'Rp 9.000' },
                { label: 'J&T EZ', desc: '3-5 days', price: 'Rp 7.500' },
                { label: 'SiCepat HALU', desc: '1 day', price: 'Rp 7.000' },
              ].map(opt => (
                <label key={opt.label} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${courier === opt.label ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="courier" checked={courier === opt.label} onChange={() => setCourier(opt.label)} className="accent-primary" />
                    <div>
                      <p className="text-sm font-medium text-dark">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">{opt.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-dark mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {['Bank Transfer (BCA)', 'GoPay', 'OVO', 'Cash on Delivery'].map(pm => (
                <label key={pm} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-primary cursor-pointer text-sm">
                  <input type="radio" name="payment" defaultChecked={pm === 'Bank Transfer (BCA)'} className="accent-primary" />
                  {pm}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit sticky top-20">
          <h2 className="font-bold text-dark mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">x{item.qty}</p>
                </div>
                <p className="text-sm font-semibold">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>Rp {shippingCost.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
          </div>
          <button
            onClick={handleOrder}
            disabled={!address.street || !address.phone}
            className="btn-primary w-full py-3 text-sm font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Place Order
          </button>
          <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-green-500" /> Secure SSL encrypted checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
