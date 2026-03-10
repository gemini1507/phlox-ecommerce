// ================================================================
// AUTH MIDDLEWARE — Memverifikasi JWT token
// ================================================================
// Middleware ini ditempatkan di route yang butuh login.
// Cara kerja:
// 1. Ambil token dari header "Authorization: Bearer <token>"
// 2. Verifikasi token, decode isinya (user id, role)
// 3. Simpan info user ke req.user supaya bisa dipakai di route
// ================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request type supaya TypeScript kenal req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-jwt';

// Middleware: harus login (semua role)
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token tidak ditemukan. Silakan login.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.user = decoded; // simpan info user ke request
    next();
  } catch {
    res.status(401).json({ error: 'Token tidak valid atau sudah expired.' });
  }
};

// Middleware: harus admin
export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Akses ditolak. Hanya admin yang bisa mengakses.' });
    return;
  }
  next();
};
