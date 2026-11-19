-- Jalankan sekali di Supabase SQL Editor untuk Jejakarsa yang SUDAH digunakan.
-- Tidak menghapus maupun mengubah nilai lomba yang tersimpan.
ALTER TABLE public.jk_opportunities
  ADD COLUMN IF NOT EXISTS expired_at timestamptz;
COMMENT ON COLUMN public.jk_opportunities.expired_at IS
  'Waktu saat versi terbit ditarik otomatis setelah tanggal pendaftaran lewat (berdasarkan WIB).';
