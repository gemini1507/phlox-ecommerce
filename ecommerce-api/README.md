# 🚀 E-Commerce API

Backend API untuk E-Commerce PHLOX menggunakan **Node.js + Express + Prisma + MySQL**.

## Cara Setup

### 1. Pastikan XAMPP MySQL berjalan
Buka XAMPP Control Panel → Start **MySQL**

### 2. Buat database di phpMyAdmin
- Buka [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
- Klik **"New"** di sidebar kiri
- Buat database baru dengan nama: `ecommerce_db`
- Collation: `utf8mb4_general_ci`

### 3. Install dependencies
```bash
cd ecommerce-api
npm install
```

### 4. Push schema ke database
```bash
npx prisma db push
```
Ini akan membuat semua tabel di database `ecommerce_db`

### 5. Isi data awal (seed)
```bash
npm run db:seed
```
Ini akan menambahkan:
- 1 user admin (admin@phlox.com / admin123)
- 1 user customer (danny@gmail.com / customer123)
- 6 produk contoh
- 2 coupon (SAVE20, SUMMER10)

### 6. Jalankan server
```bash
npm run dev
```
Server berjalan di **http://localhost:4000**

## Test API

Buka browser: [http://localhost:4000/api/health](http://localhost:4000/api/health)

Atau test dengan curl:
```bash
# Lihat semua produk
curl http://localhost:4000/api/products

# Register user baru
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@gmail.com","password":"123456"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phlox.com","password":"admin123"}'
```

## Struktur Folder

```
ecommerce-api/
├── prisma/
│   ├── schema.prisma    ← Definisi tabel database
│   └── seed.ts          ← Data awal
├── src/
│   ├── index.ts         ← Server Express (entry point)
│   ├── lib/
│   │   └── prisma.ts    ← Koneksi database
│   ├── middleware/
│   │   └── auth.ts      ← JWT authentication
│   └── routes/
│       ├── auth.ts      ← Register & Login
│       ├── products.ts  ← CRUD Produk
│       ├── orders.ts    ← Manajemen Pesanan
│       ├── shipping.ts  ← Kalkulator Ongkir
│       └── promos.ts    ← Coupon & Flash Sale
├── .env                 ← Konfigurasi (database, JWT secret)
├── package.json
└── tsconfig.json
```
