// ================================================================
// EXPRESS SERVER — Entry Point
// ================================================================
// File ini adalah titik awal backend API.
// Di sini kita:
// 1. Import semua route
// 2. Setup middleware (CORS, JSON parser)
// 3. Daftarkan semua endpoint
// 4. Jalankan server di port 4000
// ================================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import semua route
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import shippingRoutes from './routes/shipping.js';
import promoRoutes from './routes/promos.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ===== MIDDLEWARE =====
// CORS: allow localhost in dev, all origins in production
app.use(cors(
  process.env.NODE_ENV === 'production'
    ? { origin: '*' }
    : { origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'], credentials: true }
));

// Parse JSON body dari request
app.use(express.json());

// ===== ROUTES =====
// Setiap route di-prefix dengan /api/...
app.use('/api/auth', authRoutes);         // Login & Register
app.use('/api/products', productRoutes);  // CRUD Produk
app.use('/api/orders', orderRoutes);      // Manajemen Pesanan
app.use('/api/shipping', shippingRoutes); // Kalkulator Ongkir
app.use('/api/promos', promoRoutes);      // Coupon & Flash Sale

// ===== HEALTH CHECK =====
// Root path for Back4App / container health checks
app.get('/', (_req, res) => {
  res.json({ status: 'OK', message: '🚀 E-Commerce API is running!' });
});

// Detailed health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: '🚀 E-Commerce API berjalan!',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (POST /register, POST /login, GET /me)',
      products: '/api/products (GET, POST, PUT, DELETE)',
      orders: '/api/orders (GET, POST, PUT /:id/status)',
      shipping: '/api/shipping/calculate (POST)',
      promos: '/api/promos (GET, POST, PUT, DELETE, POST /verify)',
    },
  });
});

// ===== START SERVER =====
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('');
    console.log('========================================');
    console.log(`🚀 E-Commerce API berjalan di port ${PORT}`);
    console.log(`📡 http://localhost:${PORT}/api/health`);
    console.log('========================================');
    console.log('');
    console.log('Endpoints tersedia:');
    console.log('  POST   /api/auth/register');
    console.log('  POST   /api/auth/login');
    console.log('  GET    /api/auth/me');
    console.log('  GET    /api/products');
    console.log('  POST   /api/products');
    console.log('  PUT    /api/products/:id');
    console.log('  DELETE /api/products/:id');
    console.log('  GET    /api/orders');
    console.log('  POST   /api/orders');
    console.log('  PUT    /api/orders/:id/status');
    console.log('  POST   /api/shipping/calculate');
    console.log('  GET    /api/promos');
    console.log('  POST   /api/promos');
    console.log('  POST   /api/promos/verify');
    console.log('');
  });
}

// Export for Vercel Serverless
export default app;
