// ================================================================
// ROUTE: PROMOS — Coupon & Flash Sale Management
// ================================================================
// GET    /api/promos         → Lihat semua promo (admin: semua, customer: aktif saja)
// POST   /api/promos         → Admin buat coupon baru
// PUT    /api/promos/:id     → Admin toggle aktif/nonaktif
// DELETE /api/promos/:id     → Admin hapus coupon
// POST   /api/promos/verify  → Customer cek apakah kode coupon valid
// ================================================================

import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

// ===== GET SEMUA PROMO =====
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Jika bukan admin, hanya tampilkan coupon yang aktif
    const isAdmin = req.headers.authorization ? true : false;

    const coupons = await prisma.coupon.findMany({
      where: isAdmin ? {} : { active: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(coupons);
  } catch (error) {
    console.error('Get promos error:', error);
    res.status(500).json({ error: 'Gagal mengambil data promo.' });
  }
});

// ===== BUAT COUPON BARU (Admin Only) =====
// Body: { code, type, value, minOrder, expiresAt }
router.post('/', authenticate, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, type, value, minOrder, expiresAt } = req.body;

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      res.status(400).json({ error: 'Kode coupon sudah ada.' });
      return;
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: Number(value),
        minOrder: Number(minOrder) || 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json({ message: 'Coupon berhasil dibuat!', coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Gagal membuat coupon.' });
  }
});

// ===== TOGGLE AKTIF/NONAKTIF (Admin Only) =====
router.put('/:id', authenticate, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id: Number(req.params.id) } });
    if (!coupon) {
      res.status(404).json({ error: 'Coupon tidak ditemukan.' });
      return;
    }

    const updated = await prisma.coupon.update({
      where: { id: coupon.id },
      data: { active: !coupon.active },
    });

    res.json({ message: `Coupon ${updated.active ? 'diaktifkan' : 'dinonaktifkan'}`, coupon: updated });
  } catch (error) {
    console.error('Toggle coupon error:', error);
    res.status(500).json({ error: 'Gagal mengubah status coupon.' });
  }
});

// ===== HAPUS COUPON (Admin Only) =====
router.delete('/:id', authenticate, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.coupon.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Coupon berhasil dihapus!' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Gagal menghapus coupon.' });
  }
});

// ===== VERIFIKASI COUPON (Customer) =====
// Body: { code, orderTotal }
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, orderTotal } = req.body;

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon || !coupon.active) {
      res.status(400).json({ error: 'Kode coupon tidak valid atau tidak aktif.' });
      return;
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      res.status(400).json({ error: 'Coupon sudah expired.' });
      return;
    }

    if (Number(orderTotal) < coupon.minOrder) {
      res.status(400).json({ error: `Minimum order $${coupon.minOrder} untuk coupon ini.` });
      return;
    }

    const discount = coupon.type === 'Percentage'
      ? (Number(orderTotal) * coupon.value) / 100
      : coupon.value;

    res.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: Math.min(discount, Number(orderTotal)),
      message: `Coupon ${coupon.code} berhasil! Diskon: $${discount.toFixed(2)}`,
    });
  } catch (error) {
    console.error('Verify coupon error:', error);
    res.status(500).json({ error: 'Gagal memverifikasi coupon.' });
  }
});

export default router;
