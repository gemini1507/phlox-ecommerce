// ================================================================
// ROUTE: PRODUCTS — CRUD Produk
// ================================================================
// GET    /api/products       → Semua orang bisa lihat produk
// GET    /api/products/:id   → Detail satu produk
// POST   /api/products       → Admin tambah produk baru
// PUT    /api/products/:id   → Admin edit produk
// DELETE /api/products/:id   → Admin hapus produk
// ================================================================

import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

// ===== GET SEMUA PRODUK (Publik) =====
// Query: ?category=Headphones&search=beats
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(category && category !== 'All' ? { category: String(category) } : {}),
        ...(search ? { name: { contains: String(search) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Gagal mengambil data produk.' });
  }
});

// ===== GET DETAIL PRODUK (Publik) =====
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) {
      res.status(404).json({ error: 'Produk tidak ditemukan.' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Gagal mengambil data produk.' });
  }
});

// ===== TAMBAH PRODUK (Admin Only) =====
// Body: { name, category, price, stock, imageUrl }
router.post('/', authenticate, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, specs, reviews, category, price, stock, imageUrl } = req.body;

    const product = await prisma.product.create({
      data: { name, description, specs, reviews, category, price: Number(price), stock: Number(stock), imageUrl },
    });

    res.status(201).json({ message: 'Produk berhasil ditambahkan!', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Gagal menambahkan produk.' });
  }
});

// ===== EDIT PRODUK (Admin Only) =====
router.put('/:id', authenticate, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, specs, reviews, category, price, stock, imageUrl } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(specs !== undefined && { specs }),
        ...(reviews !== undefined && { reviews }),
        ...(category && { category }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(imageUrl && { imageUrl }),
      },
    });

    res.json({ message: 'Produk berhasil diperbarui!', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Gagal memperbarui produk.' });
  }
});

// ===== HAPUS PRODUK (Admin Only) =====
router.delete('/:id', authenticate, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: 'Produk berhasil dihapus!' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Gagal menghapus produk.' });
  }
});

// ===== TAMBAH REVIEW (User/Admin) =====
router.post('/:id/reviews', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { rating, text } = req.body;
    const user = (req as any).user; // From authenticate middleware

    if (!rating || !text) {
      res.status(400).json({ error: 'Rating dan teks review wajib diisi.' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) {
      res.status(404).json({ error: 'Produk tidak ditemukan.' });
      return;
    }

    let currentReviews = [];
    if (product.reviews) {
      try {
        currentReviews = JSON.parse(product.reviews);
        if (!Array.isArray(currentReviews)) currentReviews = [];
      } catch (e) {
        currentReviews = [];
      }
    }

    const newReview = {
      name: user.name || 'User',
      rating: Number(rating),
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      text: String(text),
    };

    currentReviews.push(newReview);

    await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { reviews: JSON.stringify(currentReviews) },
    });

    res.json({ message: 'Review berhasil ditambahkan!', review: newReview });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Gagal menambahkan review.' });
  }
});

export default router;
