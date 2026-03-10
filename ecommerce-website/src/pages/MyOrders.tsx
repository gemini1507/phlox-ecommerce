import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

type OrderItem = { id: number; quantity: number; price: number; product: { name: string; imageUrl: string | null } };
type Order = {
  id: number;
  total: number;
  status: string;
  courier: string | null;
  trackingNo: string | null;
  createdAt: string;
  items: OrderItem[];
};

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  Processing: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  Shipped: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  Delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  Cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

const MyOrders = () => {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchOrders = async () => {
      try {
        const data = await apiFetch('/orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-dark mb-2">Login Required</h2>
        <p className="text-gray-500 text-sm mb-6">Sign in to view your orders.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-dark mb-2">My Orders</h1>
      <p className="text-gray-500 text-sm mb-8">Track and manage all your orders</p>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">{filter === 'All' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const cfg = statusConfig[order.status] || statusConfig.Processing;
            const StatusIcon = cfg.icon;
            return (
              <div key={order.id} className={`rounded-2xl border p-5 ${cfg.bg} transition-shadow hover:shadow-md`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.color} bg-white shadow-sm`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-dark text-sm">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.color} bg-white`}>{order.status}</span>
                    {order.trackingNo && <p className="text-xs text-gray-500 mt-1 font-mono">{order.trackingNo}</p>}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-white/80 rounded-xl p-2.5">
                      {item.product.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-sm font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/50 pt-3">
                  <p className="text-xs text-gray-500">{order.courier || 'Standard shipping'}</p>
                  <p className="font-bold text-dark">Total: <span className="text-primary">${order.total.toFixed(2)}</span></p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
