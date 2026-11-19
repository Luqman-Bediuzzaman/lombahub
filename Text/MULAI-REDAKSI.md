# Memulai ruang redaksi Jejakarsa

## Pertama kali di laptop

1. Ekstrak isi ZIP ke folder proyek Jejakarsa yang memuat `package.json`. Folder `app`, `components`, dan `lib` di dalam ZIP menyatu dengan folder proyek yang sudah ada. Jika proyek Anda sudah mendapat perubahan setelah ZIP 18 November, cocokkan dahulu berkas yang bernama sama.
2. Di terminal VS Code, jalankan `node -v`. Gunakan Node.js 24 untuk penyimpanan SQLite lokal. Jika dependensi proyek belum terpasang, jalankan `npm install`.
3. Dari folder proyek, jalankan `node scripts/siapkan-redaksi.mjs`. Skrip ini membuat satu kunci acak di `.env.local`. Buka file tersebut di VS Code dan salin nilai di sebelah kanan `JEJAKARSA_OWNER_KEY=`. Simpan kuncinya untuk Anda sendiri.
4. Jalankan `npm run dev`, atau mulai ulang jika sedang berjalan. Buka [Ruang redaksi lokal](http://localhost:3000/admin/review), masukkan kunci, lalu simpan halaman itu sebagai bookmark.

## Memasukkan wawancara pertama

Buka **Kisah Juara → Buat kisah**. Isi judul, bidang, nama peserta atau tim, kompetisi, pencapaian dan tahun. Nama institusi, foto, dan kredit mitra dapat ditambahkan bila tersedia. Anda bisa memakai templat sampul dengan kata pendek seperti *Di balik final*, atau mengunggah foto sendiri.

Tempel teks wawancara dan pilih bagian yang ingin Anda jadikan subjudul, kutipan, atau daftar. Tambahkan kredit sesuai peran. Untuk akun sosial, isi nama publik dan alamat profil lengkap. **Pratinjau** menampilkan kartu dan halaman artikel. Pilih **Simpan draf** sebelum meninggalkan editor. Setelah memeriksa pencapaian dan memperoleh izin publikasi narasumber, pilih **Terbitkan**.

Saat menyunting kisah yang sudah tayang, **Simpan draf** menyimpan revisi untuk Anda. Pembaca menerima revisi saat **Terbitkan perubahan** dipilih. **Tarik dari publikasi** menyimpan naskah di redaksi dan menarik versi publik. **Hapus kisah** meminta konfirmasi, lalu menghapus naskah dan foto yang tersimpan untuk kisah itu.

Sebelum publikasi pertama, Beranda dan Kisah Juara menampilkan cerita contoh bawaan. Setelah publikasi pertama, keduanya menampilkan koleksi redaksi. Jika kisah terakhir ditarik, arsip menunjukkan keadaan kosong.

Ruang **Cari Lomba** memuat kurasi yang sudah ada. Tanda pemeriksaan lomba demo masih tersimpan di browser yang digunakan.

## Menyalakan editor di Vercel

Saat pengujian lokal, draf dan foto tersimpan di `.jejakarsa-local/` pada laptop. Untuk menyimpan konten pada situs Vercel, patch menyediakan koneksi ke satu proyek Supabase. Lakukan pengaturan ini sekali.

1. Di proyek Supabase milik Anda, buka SQL Editor. Jalankan isi `editorial/supabase.sql` sekali. Pastikan Data API untuk skema `public` aktif. Skrip membuat tiga tabel berawalan `jk_` dan membatasi akses ke server Jejakarsa.
2. Pada proyek Jejakarsa di Vercel, buka Settings → Environment Variables. Tambahkan tiga nilai untuk lingkungan Production. Jika memakai Preview, gunakan basis data uji terpisah untuk lingkungan tersebut.

| Nama | Nilai yang diisi |
|---|---|
| `JEJAKARSA_OWNER_KEY` | Kunci acak pemilik. Anda bisa menggunakan nilai yang dihasilkan skrip lokal. |
| `JEJAKARSA_DB_URL` | Project URL Supabase dalam format `https://<proyek>.supabase.co`. |
| `JEJAKARSA_DB_KEY` | Secret key Supabase berawalan `sb_secret_`, atau kunci lama `service_role`. Simpan ketiga variabel di lingkungan server. |

3. Deploy kode dengan variabel tersebut, lalu buka alamat situs Anda di `/admin/review`. Uji dengan menyimpan satu draf. Draf yang dibuat di SQLite pada laptop berada di penyimpanan terpisah. Untuk naskah sungguhan, mulai dari editor daring yang sudah terhubung ke Supabase.
4. Setelah pemasangan, Anda bisa menambah, mengoreksi, menarik, dan menghapus kisah langsung dari browser. Publikasi berikutnya berlaku tanpa deploy ulang.

Jika editor mengabarkan bahwa penyimpanan belum tersedia, periksa URL proyek, secret key, lingkungan Vercel yang dipilih, dan apakah SQL sudah dijalankan di proyek yang sama. Jika sesi habis ketika menulis, masuk kembali melalui tab baru, lalu simpan dari tab editor semula.
