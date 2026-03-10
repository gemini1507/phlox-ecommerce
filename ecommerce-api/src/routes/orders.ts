// ================================================================
// ROUTE: ORDERS — Manajemen Pesanan
// ================================================================
// GET    /api/orders           → Admin: semua order, Customer: milik sendiri
// GET    /api/orders/:id       → Detail order
// POST   /api/orders           → Customer buat order baru
// PUT    /api/orders/:id/status→ Admin update status kirim
// ================================================================

import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

// ===== GET SEMUA ORDER =====
// Admin: melihat semua order
// Customer: hanya melihat order miliknya
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const where = req.user!.role === 'admin' ? {} : { userId: req.user!.id };

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { name: true, imageUrl: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Gagal mengambil data pesanan.' });
  }
});

// ===== GET DETAIL ORDER =====
router.get('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
      return;
    }

    // Customer hanya boleh lihat order miliknya
    if (req.user!.role !== 'admin' && order.userId !== req.user!.id) {
      res.status(403).json({ error: 'Akses ditolak.' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Gagal mengambil data pesanan.' });
  }
});

// ===== BUAT ORDER BARU (Customer) =====
// Body: { items: [{ productId, quantity }], courier? }
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, courier } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'Keranjang kosong.' });
      return;
    }

    // Ambil semua produk yang dipesan
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    // Hitung total & validasi stok
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        res.status(400).json({ error: `Produk ID ${item.productId} tidak ditemukan.` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ error: `Stok ${product.name} tidak cukup. Sisa: ${product.stock}` });
        return;
      }
      total += product.price * item.quantity;
      orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
    }

    // Buat order + kurangi stok (dalam satu transaksi)
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user!.id,
          total,
          courier: courier || null,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });

      // Kurangi stok
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    res.status(201).json({ message: 'Pesanan berhasil dibuat!', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Gagal membuat pesanan.' });
  }
});

// ===== UPDATE STATUS ORDER (Admin Only) =====
// Body: { status: "Shipped", trackingNo?: "JNE001234" }
router.put('/:id/status', authenticate, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, trackingNo } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Status tidak valid. Pilih: ${validStatuses.join(', ')}` });
      return;
    }

    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: {
        status,
        ...(trackingNo && { trackingNo }),
      },
    });

    res.json({ message: `Status pesanan diubah ke "${status}"`, order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Gagal mengubah status pesanan.' });
  }
});

export default router;
