import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Lazy-loaded pages
const Home          = lazy(() => import('./pages/Home'));
const Shop          = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart          = lazy(() => import('./pages/Cart'));
const Checkout      = lazy(() => import('./pages/Checkout'));
const Login         = lazy(() => import('./pages/Login'));
const About         = lazy(() => import('./pages/About'));
const Blog          = lazy(() => import('./pages/Blog'));
const Contact       = lazy(() => import('./pages/Contact'));
const MyOrders      = lazy(() => import('./pages/MyOrders'));
const Wishlist      = lazy(() => import('./pages/Wishlist'));
const Settings      = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/orders" element={<MyOrders />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <ChatWidget />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
