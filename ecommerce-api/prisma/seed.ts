// ================================================================
// SEED — Mengisi database dengan data contoh
// ================================================================
// Jalankan: npm run db:seed
// File ini akan menambahkan data awal ke database supaya
// tidak kosong saat pertama kali dijalankan.
// ================================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai seeding database...');

  // ===== 1. Buat user admin =====
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@phlox.com' },
    update: {},
    create: {
      name: 'Admin PHLOX',
      email: 'admin@phlox.com',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ User admin dibuat:', admin.email);

  // ===== 2. Buat user customer =====
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'danny@gmail.com' },
    update: {},
    create: {
      name: 'Danny Liu',
      email: 'danny@gmail.com',
      password: customerPassword,
      role: 'customer',
    },
  });
  console.log('✅ User customer dibuat:', customer.email);

  // ===== 3. Buat produk =====
  const products = [
    { name: 'Beats Studio Pro', category: 'Headphones', price: 349.99, stock: 42, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', description: 'Premium wireless headphones with Active Noise Cancelling, Personalized Spatial Audio, and up to 40 hours of battery life. Features lossless audio via USB-C and a sleek, comfortable design for all-day listening.' },
    { name: 'Apple Watch Series 9', category: 'Wearables', price: 399.99, stock: 18, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', description: 'The most advanced Apple Watch yet with the S9 SiP chip, a brighter Always-On display, and new Double Tap gesture. Track your health with blood oxygen, ECG, and temperature sensing. Water resistant to 50 meters.' },
    { name: 'Sony WH-1000XM5', category: 'Headphones', price: 279.99, stock: 0, imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300', description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. 30-hour battery life with quick charging — 3 minutes for 3 hours of playback.' },
    { name: 'PlayStation 5', category: 'Gaming', price: 499.99, stock: 5, imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300', description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback and adaptive triggers, and ray tracing for stunning visuals. Includes DualSense wireless controller.' },
    { name: 'MacBook Pro M3', category: 'Laptops', price: 1299.99, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300', description: 'Supercharged by the M3 chip with up to 22 hours of battery life. Stunning Liquid Retina XDR display, 1080p FaceTime HD camera, and a six-speaker sound system. The ultimate pro laptop for creative professionals.' },
    { name: 'Amazon Echo Studio', category: 'Speakers', price: 199.99, stock: 35, imageUrl: 'https://images.unsplash.com/photo-1558618666-fdc3c39b2e35?w=300', description: 'High-fidelity smart speaker with 3D audio and Dolby Atmos. Five directional speakers produce rich, immersive sound that adapts to your room. Built-in Zigbee smart home hub for controlling your devices.' },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(p) + 1 },
      update: {},
      create: p,
    });
  }
  console.log(`✅ ${products.length} produk dibuat`);

  // ===== 4. Buat coupon =====
  await prisma.coupon.upsert({
    where: { code: 'SAVE20' },
    update: {},
    create: { code: 'SAVE20', type: 'Percentage', value: 20, minOrder: 100, active: true },
  });
  await prisma.coupon.upsert({
    where: { code: 'SUMMER10' },
    update: {},
    create: { code: 'SUMMER10', type: 'Percentage', value: 10, minOrder: 50, active: true },
  });
  console.log('✅ Coupon dibuat: SAVE20, SUMMER10');

  console.log('🎉 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
