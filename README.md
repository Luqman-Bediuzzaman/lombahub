# Jejakarsa — Informasi Lomba Mahasiswa

Prototipe Next.js untuk mencari lomba, membaca persyaratan beserta sumbernya, membandingkan pilihan, dan menyiapkan pendaftaran.

> **Catatan data:** Seluruh lomba, penyelenggara, kutipan panduan, hadiah, biaya, tanggal, dan bukti persyaratan di proyek ini merupakan data fiktif untuk demonstrasi. Ganti dengan informasi dari sumber resmi dan periksa kembali sebelum situs dipublikasikan.

## Persyaratan

- Node.js 20.9 atau lebih baru
- npm 10 atau lebih baru (disarankan)

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.

Untuk menjalankan pemeriksaan dan build produksi:

```bash
npm run typecheck
npm run build
npm run start
```

## Halaman utama

| Rute | Fungsi |
|---|---|
| `/` | Beranda dan ringkasan lomba |
| `/explore` | Katalog, pencarian, filter, dan pengurutan lomba |
| `/opportunities/[slug]` | Detail lomba, persyaratan, sumber, dan pemeriksaan profil |
| `/compare` | Membandingkan hingga tiga lomba |
| `/workspace` | Lomba yang disimpan, status, daftar persiapan, dan catatan |
| `/profile` | Profil peserta dan preferensi pencarian |
| `/playbook` | Kumpulan panduan |
| `/playbook/[slug]` | Artikel panduan |
| `/about` | Informasi prototipe dan batas fitur |
| `/admin/review` | Halaman demo untuk melihat antrean pemeriksaan sumber dan bukti |
| `/api/opportunities` | API contoh untuk daftar lomba |
| `/api/opportunities/[slug]` | API contoh untuk detail lomba |

## Fitur yang sudah berjalan

- Tampilan responsif dengan navigasi desktop dan perangkat seluler.
- Pencarian serta filter gabungan pada katalog.
- Pemeriksaan persyaratan berbasis aturan dengan hasil yang dapat ditelusuri.
- Pemisahan antara ketidaksesuaian syarat wajib dan kendala kesiapan atau anggaran.
- Kutipan bukti untuk setiap persyaratan, termasuk nama sumber, bagian dokumen, status, dan tanggal pemeriksaan.
- Penyimpanan dan penghapusan lomba dari daftar pribadi.
- Perbandingan maksimal tiga lomba.
- Profil peserta, perubahan status, daftar persiapan, dan catatan yang disimpan pada `localStorage`.
- Daftar panduan dan halaman artikel.
- Rute API dengan data contoh.
- Halaman demo untuk melihat sumber dan persyaratan yang perlu diperiksa.

## Batas prototipe saat ini

Proyek ini masih berupa prototipe antarmuka dengan data contoh.

- Belum menggunakan database atau penyimpanan terpusat.
- Belum memiliki autentikasi, akun pengguna, atau sinkronisasi antarperangkat.
- Belum ada proses ekstraksi data berbasis AI.
- Belum ada perayap web, pemantauan perubahan sumber, atau konfirmasi otomatis dari penyelenggara.
- Belum ada notifikasi email atau perangkat.
- Belum ada pencarian anggota tim, pesan, atau integrasi pendaftaran.
- Kutipan bukti hanya contoh, bukan kutipan dari panduan lomba nyata.

## Mengganti data contoh

Mulai dari `lib/demo-data.ts`. Pertahankan struktur `Competition` dan `Requirement` pada `lib/types.ts`. Sebelum mengganti data contoh dengan lomba sungguhan:

1. Catat sumber resmi dan tanggal aksesnya.
2. Periksa tenggat, biaya, jenjang pendidikan, jumlah anggota tim, dan cara pengumpulan.
3. Simpan bukti untuk setiap persyaratan yang menentukan kelayakan peserta.
4. Tandai informasi yang belum jelas sebagai belum terverifikasi; jangan menebak.
5. Lakukan pemeriksaan sebelum informasi dipublikasikan.

## Struktur proyek

```text
app/
  api/opportunities/       Rute API contoh
  admin/review/            Halaman kurasi data
  compare/                 Perbandingan lomba
  explore/                 Katalog dan filter
  opportunities/[slug]/    Detail lomba
  playbook/                Kumpulan panduan
  profile/                 Profil peserta
  workspace/               Tersimpan
components/                Komponen antarmuka dan pengelolaan state
lib/                       Data contoh, tipe, dan logika pemeriksaan
```

Arah produk dan rancangan arsitektur dijelaskan lebih lengkap dalam [`PRODUCT_ARCHITECTURE.md`](./PRODUCT_ARCHITECTURE.md).
