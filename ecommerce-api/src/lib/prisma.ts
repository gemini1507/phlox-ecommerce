// ================================================================
// PRISMA CLIENT — Koneksi ke database
// ================================================================
// File ini membuat satu instance PrismaClient yang dipakai
// di seluruh aplikasi. Jangan buat PrismaClient baru di setiap file.
// ================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
