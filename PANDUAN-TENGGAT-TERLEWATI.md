# Editorial Cari Lomba — Tenggat Terlewati

**Sumber:** `.jejakarsa-local (2).zip`. Fitur ini adalah tambahan pada sistem editorial yang ada; tidak mengganti desain atau struktur data publik Cari Lomba, Kisah Juara, profil, atau rekomendasi.

## Perilaku

- Contoh: tenggat `2026-11-20` **masih terlihat sepanjang 20 November WIB**, dan **tidak dikirim lagi ke pengunjung mulai 21 November pukul 00.00 WIB** (20 November pukul 17.00 UTC).
- Aturan arsip otomatis memakai **tanggal penutupan pendaftaran (`deadline`)** dan kalender **WIB (UTC+7)**; bukan `submissionDeadline`, `deadlineTime`, atau zona waktu acara. Informasi jam/zona acara tidak dihapus.
- Server menyaring seluruh data Cari Lomba pada setiap akses: katalog `/explore`, beranda yang memakai katalog, detail `/opportunities/[slug]`, `/api/opportunities`, `/api/opportunities/[slug]`, dan poster yang diunggah.
- Penjadwal menandai penarikan di basis data dengan kolom `expired_at`, mengosongkan `live` serta `poster_live`, **tanpa menghapus `draft`, `first_slug`, atau `first_published`**.
- `/admin/review/cari-lomba` hanya menampilkan berkas editorial yang belum kedaluwarsa pada antrean utama. Tautan **Tenggat terlewati** membuka `/admin/review/cari-lomba/tenggat-terlewati`.
- Pada area khusus admin: **Sunting / Terbitkan ulang** atau **Hapus permanen** (setelah konfirmasi). Jika tenggat diperpanjang, simpan draf kemudian terbitkan ulang; permalink sebelumnya dipertahankan.
- Penyelenggara yang menutup pendaftaran lebih awal pada jam tertentu **belum memicu arsip otomatis sebelum pergantian hari**. Bila dibutuhkan, fitur ini bisa diperluas pada perubahan berikutnya.
- Jika belum diaktifkan `JEJAKARSA_KATALOG_LIVE=1`, data demo pengguna tetap berjalan seperti semula. Arsip editorial tetap dapat dikelola di admin.

## Pemasangan pada proyek yang sudah berjalan

1. Cadangkan project dan database Supabase terlebih dahulu. Ekstrak file dari ZIP patch ke **root proyek** dengan jalur yang sama. Jangan mengganti folder komponen selain yang tercantum dalam patch.
2. Buka SQL Editor Supabase dan jalankan **`editorial/migrasi-tenggat-terlewati.sql`** tepat satu kali (migrasi memakai `ADD COLUMN IF NOT EXISTS`; tidak menghapus baris). Untuk instalasi database baru, `editorial/cari-lomba.sql` juga telah dilengkapi kolom tersebut.
3. Set environment variable **`CRON_SECRET`** di Vercel Production ke nilai acak panjang. Contoh membuat nilai dengan Node: `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Jangan commit nilainya.
4. Pastikan variabel **`JEJAKARSA_DB_URL`** dan **`JEJAKARSA_DB_KEY`** masih berfungsi. Fitur hanya memodifikasi data di tabel `jk_opportunities`; tidak mengubah tabel Kisah Juara.
5. Deploy ke Vercel Production. `vercel.json` menambahkan cron `0 17 * * *` (UTC = tengah malam WIB pada hari berikutnya). Di Vercel Hobby, eksekusi cron harian bisa bergeser hingga sekitar satu jam. **Penyaringan setiap permintaan tetap bekerja tepat berdasarkan jam server**, sehingga data tetap tidak terlihat meskipun cron terlambat.
6. Uji di salinan atau staging: terbitkan lomba dengan tanggal yang baru lewat dalam test DB (bukan production). Buka katalog dan detail; pastikan tidak ada di hasil. Buka **Tenggat terlewati** di admin, pilih Sunting atau Hapus.

### Menjalankan cron manual (jika diperlukan)

Endpoint: `GET /api/cron/tenggat-lomba` dengan header `Authorization: Bearer <CRON_SECRET>`. Tanpa secret yang sesuai, respons adalah HTTP 401. Hindari mengekspos secret di browser atau log publik.

Keluaran sukses berisi `{ok, due, expired, skipped}`. Penjadwal idempoten: lomba yang sudah ditarik tidak akan ditarik lagi. Apabila terjadi konflik versi dengan admin yang sedang menyimpan, data admin tidak ditimpa.

## Catatan penting dari arsip ZIP sumber

Arsip `.jejakarsa-local (2).zip` yang disediakan tidak berisi folder `components/` di root, meskipun banyak import memakai `@/components/...` dengan alias `@/*` → `./*`. Beberapa komponen berada di `app/components/`, dan ada rujukan lain yang tidak ada di kedua lokasi. **Ini kondisi arsip sumber, bukan akibat fitur tenggat**. Untuk menjalankan proyek lengkap, folder komponen terkini milik proyek aktif perlu tersedia. Paket ini sengaja tidak mengisi kekurangan tersebut menggunakan komponen versi lama dari arsip lain agar visual dan UX tidak berubah diam-diam.

Tidak ada database `.jejakarsa-local/editor.sqlite`, file `.env.local`, atau isi repo Git yang disertakan pada keluaran. Data dan kredensial tetap berada di instalasi Anda.
