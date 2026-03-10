// ================================================================
// API CONFIG — Konfigurasi koneksi ke Backend
// ================================================================
// File ini dipakai di seluruh admin app untuk memanggil API
// ================================================================

const API_BASE = 'http://localhost:4000/api';

// Helper: ambil token dari localStorage
const getToken = (): string | null => localStorage.getItem('token');

// Helper: fetch dengan auth header
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Terjadi kesalahan');
  }

  return data;
}

export default API_BASE;
