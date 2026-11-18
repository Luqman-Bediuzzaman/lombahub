# Bagikan Prestasi

Salin folder `app/` dan `components/` dari patch ke root proyek Next.js. Gunakan dependensi dan perintah yang sudah dipakai proyek.

## Hubungkan formulir

Salin **tautan untuk responden** dari masing-masing Google Form. Pada pengujian lokal, tambahkan kedua nilai ini ke `.env.local` di root proyek, lalu jalankan ulang server pengembangan.

```dotenv
PRESTASI_FORM_PERORANGAN=
PRESTASI_FORM_MITRA=
```

Di hosting, tambahkan variabel yang sama lalu jalankan ulang build. Halaman menerima tautan Google Forms yang berakhiran `/viewform` atau tautan pendek `https://forms.gle/...`. Saat nilai kosong atau format tautannya tidak sesuai, jalur itu menampilkan status belum dibuka.

- **Perorangan.** Buka formulir untuk umum. Minta nama peserta atau tim, institusi, lomba, capaian, tahun, dan satu kontak pengirim. Gunakan kolom tautan bukti opsional jika ingin menerima pengajuan tanpa login Google.
- **Mitra.** Beri akun PIC yang sudah dikonfirmasi akses sebagai **Responden**. Minta nama organisasi, nama dan kontak PIC, serta satu berkas rekap atau tautan rekap yang bisa dilihat tim Jejakarsa. Jika memakai unggah file, PIC perlu masuk dengan akun Google.
- **Hasil.** Matikan opsi **Lihat ringkasan hasil** di kedua formulir. Batasi akses ke jawaban, Sheet, dan folder unggahan untuk tim yang menangani peninjauan. Pengiriman rekap oleh mitra memakai izin yang diatur pada Google Form.

Uji dari jendela samaran dan dari akun Google yang tidak diundang untuk memastikan pengajuan perorangan bisa dibuka sesuai pengaturan Anda, formulir mitra meminta izin, serta hasil kiriman hanya terlihat oleh tim.
