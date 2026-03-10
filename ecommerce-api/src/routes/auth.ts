// ================================================================
// ROUTE: AUTH — Register & Login
// ================================================================
// POST /api/auth/register  → Daftar akun baru
// POST /api/auth/login     → Login, dapat JWT token
// GET  /api/auth/me        → Lihat profil sendiri (harus login)
// ================================================================

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-jwt';

// ===== REGISTER =====
// Body: { name, email, password }
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: 'Email sudah terdaftar.' });
      return;
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Buat JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registrasi berhasil!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat registrasi.' });
  }
});

// ===== LOGIN =====
// Body: { email, password }
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Email atau password salah.' });
      return;
    }

    // Bandingkan password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Email atau password salah.' });
      return;
    }

    // Buat JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login berhasil!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat login.' });
  }
});

// ===== GET PROFILE =====
// Header: Authorization: Bearer <token>
router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan.' });
  }
});

export default router;
