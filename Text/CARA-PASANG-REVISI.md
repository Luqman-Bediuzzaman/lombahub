# Jejakarsa — revisi integrasi Editorial Cari Lomba

Paket ini berisi **kode sumber proyek lengkap** (bukan `node_modules`, bukan database, bukan secrets) dan menggabungkan patch Cari Lomba dengan proyek Jejakarsa yang menjadi dasarnya. Tidak diperlukan perubahan struktur folder manual setelah ekstraksi.

## Perubahan terarah

1. Lima komponen Cari Lomba dipasang pada **`components/` di root proyek**, sesuai alias `@/* -> ./*` pada `tsconfig.json`. Ini mengatasi TypeScript memakai `AppProvider` lama yang tidak mempunyai `competitions` dan `catalogMode`.
2. `AppProvider` juga tetap mendukung pemakaian tanpa properti tambahan di halaman warisan, agar rute lama tetap kompatibel.
3. Beranda menggunakan katalog yang sama seperti Cari Lomba, tanpa mengubah desain atau konten editorial Kisah Juara.
4. Renderer blok editorial Kisah Juara diperbaiki **hanya untuk kesalahan TypeScript** pada jenis blok (`divider`, `highlight`, `table`); fungsi p/h2/h3/kutipan/daftar/foto tetap didukung.
5. File lain yang berada dalam patch disertakan untuk fungsi editorial Cari Lomba, termasuk penyimpanan terpisah, validasi sumber, publikasi dan API.
6. Breadcrumb redaksi yang sudah ada dipertahankan.

## Cara menjalankan di folder baru

1. **Backup** folder kerja saat ini. Ekstrak ZIP ini di folder baru (folder yang langsung berisi `package.json`). Jangan menyalin folder `app` secara tersendiri.
2. Jika sudah punya `.env.local`, **salin dari proyek lama secara lokal** ke folder ini; paket tidak memuat secret. Lihat `.env.example`.
3. Jika memakai penyimpanan SQLite lokal, **pertahankan folder `.jejakarsa-local/` milik Anda** di perangkat yang sama; paket tidak memuat database. Di Vercel, gunakan penyimpanan Supabase karena data lokal tidak persisten.
4. Jalankan:
   ```powershell
   npm install
   npm run typecheck
   npm run build
   npm run dev
   ```
5. Buka `/admin/masuk` lalu `/admin/review/cari-lomba`. Untuk Supabase, jalankan `editorial/cari-lomba.sql` pada SQL Editor **sekali**, dan atur `JEJAKARSA_DB_URL`, `JEJAKARSA_DB_KEY`, `JEJAKARSA_OWNER_KEY` pada server. Jangan menggunakan `NEXT_PUBLIC_` untuk secret.
6. **Uji lokal/staging** sebelum menerbitkan lomba editorial pertama. Setelah ada publikasi pertama, katalog publik beralih dari data simulasi ke data editorial; draf saja tidak mengubah katalog.

## Pengujian yang sudah dilakukan pada paket ini

- `npm run typecheck`: **LULUS** setelah seluruh proyek dipadukan.
- Parse sintaks & pemeriksaan alias import internal: **LULUS** (kecuali dua referensi `.next/dev/types` yang normalnya dibuat oleh Next.js).
- Pengujian CRUD lokal: mode demo, pembuatan, penolakan publikasi tak lengkap, simpan draf, optimistic locking, terbit, katalog live, tarik terbitan, kestabilan permalink, antrean: **LULUS** memakai SQLite uji baru; tidak menyentuh database asli.
- `next build`: **BELUM BISA DINYATAKAN LULUS** di lingkungan pengujian ini, karena arsip dependensi yang tersedia hanya membawa native SWC **Windows**, sedangkan pengujian berjalan di Linux tanpa akses unduhan untuk SWC Linux. Jalankan `npm install` dan `npm run build` di Windows/Vercel Anda sebelum deployment. Typecheck tidak menggantikan verifikasi build Next.js.

## Apa yang tidak diganti

- Isi dan tampilan halaman Kisah Juara, kecuali koreksi renderer blok agar TypeScript dapat dikompilasi.
- Skema/tabel Kisah Juara (`jk_stories`, `jk_media`), konten cerita, dan data demo asli.
- Desain antarmuka publik, struktur navigasi, serta sistem profil/penyimpanan yang telah ada, kecuali penyambungan katalog baru yang memang dibutuhkan.

## Penting

Jangan menghapus `.env.local` atau `.jejakarsa-local/` dari proyek asli. Keduanya sengaja tidak ikut dibagikan karena berisi konfigurasi privat dan data lokal. Jangan menerapkan SQL migrasi tanpa memeriksa database tujuan terlebih dahulu.
