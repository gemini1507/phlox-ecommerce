// ================================================================
// ROUTE: SHIPPING — Kalkulator Ongkos Kirim
// ================================================================
// POST /api/shipping/calculate → Hitung ongkir (JNE, J&T, SiCepat)
// ================================================================

import { Router, Request, Response } from 'express';

const router = Router();

// Data tarif dasar per kg (simulasi — di production, gunakan API asli)
const baseRates: Record<string, Record<string, number>> = {
  jne:     { REG: 9000, YES: 38000, OKE: 7000 },
  jnt:     { EZ: 7500, SAMEDAY: 45000 },
  sicepat: { HALU: 7000, BIMER: 17000, GOKIL: 6500 },
};

const etaMap: Record<string, string> = {
  REG: '3-5 Hari', YES: '1 Hari', OKE: '4-6 Hari',
  EZ: '3-5 Hari', SAMEDAY: '1 Hari',
  HALU: '1 Hari', BIMER: '2 Hari', GOKIL: '3-5 Hari',
};

const courierNames: Record<string, string> = {
  jne: 'JNE', jnt: 'J&T', sicepat: 'SiCepat',
};

// ===== HITUNG ONGKIR =====
// Body: { origin, destination, weight (gram) }
router.post('/calculate', (req: Request, res: Response): void => {
  try {
    const { origin, destination, weight } = req.body;

    if (!origin || !destination || !weight) {
      res.status(400).json({ error: 'Origin, destination, dan weight harus diisi.' });
      return;
    }

    const kg = Math.ceil(Number(weight) / 1000); // konversi gram ke kg (dibulatkan ke atas)

    const results = Object.entries(baseRates).flatMap(([courierId, services]) =>
      Object.entries(services).map(([service, rate]) => ({
        courier: courierNames[courierId],
        service,
        cost: rate * kg,
        eta: etaMap[service] || '3-5 Hari',
        origin,
        destination,
        weight: Number(weight),
      }))
    ).sort((a, b) => a.cost - b.cost);

    res.json({
      message: `Ditemukan ${results.length} opsi pengiriman`,
      results,
    });
  } catch (error) {
    console.error('Shipping calculate error:', error);
    res.status(500).json({ error: 'Gagal menghitung ongkos kirim.' });
  }
});

export default router;
