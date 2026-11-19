# Memasang Editorial Cari Lomba

Anda bisa mulai mengisi lomba di ruang redaksi sambil katalog umum tetap menampilkan data contoh. Draf dan versi terbit disimpan terpisah. Gunakan akun redaksi yang biasa Anda pakai untuk Kisah Juara.

## 1. Pasang patch di laptop

Ekstrak ZIP dan beri nama folder hasilnya `patch-cari-lomba`. Letakkan di samping folder proyek `lombahub`. Pastikan file `pasang.mjs` langsung terlihat ketika Anda membuka folder `patch-cari-lomba`.

Buka terminal VS Code di folder `lombahub`. Perintah pertama menampilkan daftar berkas. Perintah kedua memasang perubahan.

```powershell
node ..\patch-cari-lomba\pasang.mjs . --cek
node ..\patch-cari-lomba\pasang.mjs .
```

Pemasang memeriksa seluruh daftar sebelum mulai menyalin. Jika ada pesan “Ada versi berkas yang berbeda”, simpan daftar nama yang ditampilkan untuk dicocokkan dengan suntingan lokal Anda. Folder `pelengkap` memasok komponen pendukung untuk salinan proyek yang kekurangan folder komponen di akar. Pemasang melewati komponen pelengkap yang sudah ada. Simpan ZIP di luar proyek.

## 2. Siapkan penyimpanan dan buka redaksi

Untuk Vercel dengan Supabase yang sudah dipakai oleh Kisah Juara, buka file `editorial/cari-lomba.sql` **di proyek hasil pemasangan**. Salin seluruh isinya ke SQL Editor pada proyek Supabase yang sama, lalu klik **Run**. Jalankan SQL versi ini juga bila Anda sudah memasang editor Cari Lomba sebelumnya, karena ada kolom untuk poster terbit. SQL menangani tabel lomba secara terpisah dari tabel kisah.

Untuk menguji kode di laptop, jalankan `npm run build` lalu `npm run dev`. Buka `http://localhost:3000/admin/review/cari-lomba` dan masuk dengan akses redaksi Anda. Untuk mengakses versi baru di situs online, kirim perubahan kode proyek ke repositori yang terhubung dengan Vercel dan tunggu deployment berhasil. Konfigurasi akses redaksi dan penyimpanan tetap memakai pengaturan server yang sudah digunakan proyek.

## 3. Coba satu lomba dari awal

1. Buat draf. Masukkan nama dan penyelenggara lomba, lalu catat tautan sumber resmi, misalnya pos Instagram penyelenggara atau panduan.
2. Isi peserta yang diterima, lingkup lomba, bentuk tim, biaya, tenggat dan lokasi sesuai sumber. Untuk fakta yang belum diumumkan, gunakan pilihan belum diketahui jika tersedia. Nominal nol berarti gratis.
3. Untuk tiap syarat, hubungkan ke sumber, salin kutipan persis dan cantumkan halaman atau lokasi teks. Tandai setelah memeriksa bukti. Jika panduan hanya mengatakan “mahasiswa aktif”, hindari menyimpulkan jurusan atau rentang semester.
4. Di bagian persiapan, tambah dan urutkan langkah sesuai kebutuhan lomba. Kaitkan langkah wajib ke sumbernya. Saran praktis dari redaksi dapat berdiri sendiri.
5. Unggah poster jika tersedia, periksa pratinjau, lalu **Simpan draf**. Anda bisa kembali untuk melengkapi isinya. Jika memakai AI pribadi, bagian impor menerima usulan JSON. Periksa dulu sumber dan angka setelah menerapkannya, lalu simpan.
6. Gunakan **Terbitkan** ketika data sudah siap. Perubahan berikutnya baru masuk ke versi terbit ketika Anda memilih **Terbitkan revisi**. **Tarik terbitan** menyimpan draf agar bisa diperbaiki. Tautan lomba tetap sama ketika judul direvisi.

## 4. Tentukan kapan katalog publik beralih

Untuk mencoba editor sambil mempertahankan katalog contoh, biarkan pengaturan standar. Ketika lomba pertama siap tampil di situs, buka Vercel → proyek Jejakarsa → Settings → Environment Variables. Tambahkan nama dan nilai berikut pada lingkungan **Production**, lalu lakukan redeploy.

```dotenv
JEJAKARSA_KATALOG_LIVE=1
```

Untuk mencoba peralihan di laptop, pasang pengaturan yang sama di `.env.local` dan mulai ulang server lokal. Situs memakai data redaksi setelah sakelar aktif dan ada riwayat publikasi pertama pada penyimpanan lingkungan itu. Jika kemudian semua terbitan ditarik, katalog menjadi kosong. Untuk kembali menampilkan contoh, nonaktifkan sakelar dan terapkan ulang deployment.

Jika situs Anda sebelumnya sudah menampilkan lomba hasil redaksi, pasang sakelar sebelum deployment patch agar katalog terus mengambil versi terbit. Draf yang dibuat dalam penyimpanan lokal laptop perlu dimasukkan ke penyimpanan produksi jika ingin diterbitkan di sana.

## Pemeriksaan sebelum mengumumkan lomba

Buka daftar Cari Lomba dan detailnya lewat jendela privat. Cocokkan syarat, biaya dan tenggat dengan kutipan panduan. Simpan perubahan sebagai draf, lalu muat ulang detail di jendela privat untuk memastikan revisi baru tampil setelah diterbitkan. Uji juga di HP Anda dengan satu poster asli agar kepadatan dan keterbacaan sesuai kebiasaan redaksi.
