import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';

// Lazy-loaded admin pages
const Dashboard           = lazy(() => import('./pages/admin/Dashboard'));
const ProductManagement   = lazy(() => import('./pages/admin/ProductManagement'));
const OrderManagement     = lazy(() => import('./pages/admin/OrderManagement'));
const SalesReport         = lazy(() => import('./pages/admin/SalesReport'));
const ShippingManagement  = lazy(() => import('./pages/admin/ShippingManagement'));
const PromotionManagement = lazy(() => import('./pages/admin/PromotionManagement'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">Memuat halaman...</p>
    </div>
  </div>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek apakah sudah login (ada token di localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.role === 'admin') {
          setIsLoggedIn(true);
        }
      } catch {
        // token invalid
      }
    }
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  // Belum login → tampilkan halaman login
  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"  element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="products"   element={<Suspense fallback={<PageLoader />}><ProductManagement /></Suspense>} />
          <Route path="orders"     element={<Suspense fallback={<PageLoader />}><OrderManagement /></Suspense>} />
          <Route path="reports"    element={<Suspense fallback={<PageLoader />}><SalesReport /></Suspense>} />
          <Route path="shipping"   element={<Suspense fallback={<PageLoader />}><ShippingManagement /></Suspense>} />
          <Route path="promotions" element={<Suspense fallback={<PageLoader />}><PromotionManagement /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
