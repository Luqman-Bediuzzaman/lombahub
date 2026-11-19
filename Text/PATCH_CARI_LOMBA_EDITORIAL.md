# Patch editorial Cari Lomba — Jejakarsa

Patch ini dibuat terhadap arsip `.jejakarsa-local(1).zip` yang dikirim pada 19 November 2026. **Ini hanya berisi file baru/berubah, bukan pengganti seluruh proyek.** Tidak ada file `.env`, database lokal, file Git, file media pribadi, atau `node_modules` dalam paket.

## 1. Pemasangan tanpa mengganggu Kisah Juara

1. **Buat cadangan/commit proyek yang masih berjalan** sebelum menyalin file.
2. Ekstrak ZIP patch di **root proyek Next.js**, yakni folder tempat `package.json` berada. Izinkan overwrite untuk file yang memang ada dalam patch. Jangan mengganti seluruh folder `app` atau `lib` dengan folder kosong dari arsip.
3. Untuk Vercel + Supabase: buka Supabase **SQL Editor**, jalankan `editorial/cari-lomba.sql` **sekali**. Migrasi membuat tabel `jk_opportunities` dan `jk_opportunity_state`, tidak memodifikasi tabel Kisah Juara (`jk_stories`, `jk_media`, dan sebagainya).
4. Pertahankan variabel server yang **sudah digunakan editorial Kisah Juara**: `JEJAKARSA_DB_URL` (URL proyek Supabase), `JEJAKARSA_DB_KEY` (secret key dengan hak akses service role/server), dan `JEJAKARSA_OWNER_KEY` (kata kunci redaksi jika Anda menggunakan mekanisme login yang tersedia). **Jangan** pakai prefiks `NEXT_PUBLIC_` untuk secret key atau menaruhnya di repositori.
5. Jika lingkungan lokal belum diatur, data editorial disimpan di `.jejakarsa-local/editor.sqlite` oleh `node:sqlite` (Node 22.16+ direkomendasikan karena dukungan SQLite bawaan). Di Vercel/production gunakan Supabase; penyimpanan file lokal tidak persisten.
6. Jalankan `npm install`, `npm run typecheck`, dan `npm run build` pada **repositori lengkap milik Anda** sebelum deploy. Buka `/admin/masuk`, masuk, kemudian `/admin/review/cari-lomba`. Buat lomba → simpan draf → uji terbit/revisi/tarik terbitan.

**Penting soal arsip sumber:** ZIP yang diberikan untuk pemeriksaan ini tidak memuat `app/components/home-content.tsx`, `app/components/editorial/story-editor.tsx`, dan `app/components/stories/story-article.tsx`, padahal ada import yang membutuhkan file tersebut. Ketiga komponen **sengaja tidak dibuat ulang atau ditimpa** demi menjaga sistem beranda/Kisah Juara yang sudah Anda pertahankan. Pastikan ketiganya ada di proyek sumber Anda yang lengkap. Karena dependensi npm juga tidak bisa diunduh dari lingkungan pengujian, *typecheck* dan *build* Next.js penuh **belum dapat dipastikan lolos** dari ZIP ini saja. Parser sintaks 85 berkas dan tes alur editorial lokal telah lulus; tetap perlu uji integrasi di proyek asli.

## 2. Fitur editor

**Halaman antrean** `/admin/review/cari-lomba`: pencarian, penyaring draf/terbit/perlu perhatian, jumlah berkas, tindakan Buat lomba/Sunting.

**Editor per lomba** `/admin/review/cari-lomba/[id]` memiliki lima area:

- **01 Sumber:** daftar pengumuman, panduan, poster resmi, atau tautan pendaftaran; judul, URL HTTPS, tanggal pemeriksaan dan catatan. Satu sumber dapat dirujuk banyak ketentuan. Mengubah alamat/judul/jenis sumber membatalkan status pemeriksaan terkait.
- **02 Informasi:** identitas, edisi, penyelenggara vs pengirim, ringkasan, naskah Tentang lomba, tema, hadiah, jenjang, batas prodi/wilayah, anggota tim, biaya (gratis/berbayar/tidak diketahui), nominal, mata uang, satuan biaya, format/lokasi, tenggat pendaftaran vs pengumpulan, jam/zona waktu, tahap acara, dan tautan resmi. Ada impor teks naskah dan opsi tempel JSON dari AI extension.
- **03 Persyaratan:** butir individual dengan nilai, jenis pemeriksaan, kutipan asli, lokasi di sumber, sumber yang sama bisa dipakai ulang, dan status Sudah diperiksa/Perlu klarifikasi/Belum diperiksa. Ketentuan yang profil belum dapat verifikasi (kampus, wilayah, pengumpulan) diperiksa manual.
- **04 Persiapan:** tambah, buka/edit, naik, turun, hapus. Setiap langkah memiliki ID tetap; wajib dari sumber dibedakan dari saran redaksi. Draf boleh memiliki langkah wajib yang belum dirujuk, tetapi **tidak boleh terbit** dengan langkah wajib tanpa rujukan resmi yang diperiksa.
- **05 Pratinjau/publikasi:** ringkasan kartu dan data detail/Bandingkan, pemeriksaan kesalahan wajib vs peringatan, simpan draf, terbitkan, revisi, tarik, dan hapus draf yang belum pernah terbit.

### Catatan desain data

- Draf disimpan terpisah dari snapshot versi terbit. Menyimpan draf tidak mengubah publik. Koreksi judul setelah terbit tidak mengganti slug URL. Setelah pernah terbit, berkas tidak dapat dihapus permanen melalui editor, tetapi bisa ditarik dari katalog.
- Versi draf menggunakan pemeriksaan konflik (*optimistic locking*) untuk mencegah tab lama menimpa versi terbaru tanpa peringatan. **Belum** ada riwayat immutable semua revisi maupun tombol rollback.
- Data publik bersumber dari snapshot yang sama untuk `/explore`, `/opportunities/[slug]`, `/compare`, dan `/workspace`. Halaman `/` milik arsip bergantung pada `home-content` yang tidak disertakan; adaptasi komponen beranda tersebut mungkin masih dibutuhkan di proyek lengkap.
- Tanda centang di Tersimpan memakai ID langkah. Pemakaian teks pada data demo lama tetap ditangani lewat migrasi sisi browser saat dimuat. Bila sebuah tindakan *berubah makna*, buat langkah baru alih-alih memakai ID lama.
- Biaya berbayar tanpa angka tampil **“Berbayar · nominal belum diumumkan”**, bukan Rp0. Biaya per tim dan mata uang selain IDR tidak otomatis diklaim cocok dengan anggaran pribadi.
- Jika suatu syarat mendasar belum memiliki butir terverifikasi, publikasi akan menyertakan catatan manual **Perlu pemeriksaan**; satu syarat yang benar saja tidak cukup untuk memberi label kelayakan menyeluruh.
- Sumber disimpan sebagai tautan, bukan unggahan dan penyimpanan guidebook berukuran besar. Poster dapat memakai URL HTTPS; jika kosong/tidak termuat, komponen sampul 4:5 yang sudah ada tetap berlaku.

### Penting: peralihan data demo → data editorial

Sebelum **publikasi pertama**, katalog asli masih menampilkan data contoh (jelas berlabel demo). Begitu **satu lomba editorial diterbitkan**, katalog publik hanya menampilkan lomba editorial yang terbit. Data demo tidak dicampur dengan kompetisi nyata, tidak dihapus dari `lib/demo-data.ts`, dan tidak muncul lagi secara otomatis ketika semua terbitan ditarik. **Artinya, terbitkan lomba pertama ketika Anda memang siap berpindah dari contoh ke katalog nyata.** Untuk menguji tombol publikasi tanpa mengganti isi situs yang aktif, gunakan deployment lokal/staging terlebih dahulu.

## 3. Impor dari AI extension tanpa API

Impor bekerja dengan **copy-paste**: AI extension membuat sebuah objek JSON, lalu redaksi menempelkannya di Editor → Informasi lomba → *Impor data terstruktur dari AI extension (JSON)*. Tabel proyek/database tidak dipublikasikan ke extension. Contoh minimal (pakai sumber nyata Anda sendiri):

```json
{
  "title": "Contoh Lomba Riset 2026",
  "organizer": "Nama penyelenggara resmi",
  "category": "Riset & Karya Tulis",
  "discipline": "Riset",
  "summary": "Ringkasan yang berasal dari pengumuman resmi.",
  "description": "Peserta menyiapkan proposal riset yang sesuai ketentuan.",
  "deadline": "2026-12-20",
  "level": ["D3", "S1"],
  "feeStatus": "Berbayar",
  "feeAmount": null,
  "currency": "IDR",
  "sources": [
    { "id": "panduan", "title": "Panduan resmi", "kind": "Panduan", "url": "https://contoh.id/panduan" }
  ],
  "requirements": [
    { "label": "Jumlah anggota tim", "field": "teamSize", "rule": "team", "sourceId": "panduan", "location": "Halaman 3", "quote": "Kutipan asli yang benar-benar terdapat di panduan." }
  ],
  "preparation": [
    { "title": "Siapkan proposal", "mandatory": false }
  ]
}
```

JSON dapat berisi hanya sebagian field; field lain dipertahankan dari draf yang sedang diedit. Semua status verifikasi yang pernah diset pada draf dibatalkan setelah impor AI. **Impor bukan parsing otomatis PDF/website dan tidak memeriksa kebenaran kutipan.** Redaksi tetap harus membuka sumber asli dan memeriksa isinya. Jika Anda mencantumkan langkah baru sebagai `mandatory: true`, tautkan kembali sumbernya secara manual agar boleh terbit.

## 4. Pengujian yang dianjurkan sebelum deploy

1. **Individu/gratis:** sumber resmi dan kutipan benar, masukkan jenjang/prodi/partisipasi/biaya, publikasikan; cek kartu dan detail.
2. **Tim/berbayar:** atur jumlah 2–4, biaya *per tim* dan nominal belum diumumkan; pastikan profil 5 anggota tidak dianggap cocok serta anggaran pribadi tidak dibandingkan mentah dengan biaya per tim.
3. **Regional/internasional:** isi asal kampus/wilayah, lokasi final dan kelayakan mahasiswa Indonesia. Jika bukti manual belum memadai, situs harus menampilkan *Perlu pemeriksaan*, bukan *Syarat terpenuhi*.
4. **Tersimpan:** centang sebuah langkah, koreksi ejaan tanpa mengganti ID, publikasikan ulang, lalu pastikan centang tetap tersimpan pada browser yang sama.
5. **Publikasi:** uji simpan draf tanpa terbit, revisi URL stabil, peringatan konflik dua tab, penarikan terbitan, dan pesan saat Supabase belum dimigrasi.
6. **Regresi:** jalankan semua rute Kisah Juara/beranda/katalog pada proyek lengkap Anda. Patch tidak menyentuh modul cerita maupun databasenya.

## 5. Keterbatasan yang disengaja

Belum ada: pengambilan PDF otomatis dari URL, pemrosesan AI server/API, riwayat revisi immutable, penyimpanan gambar/berkas besar, penjadwalan publikasi, maupun sistem izin berjenjang untuk beberapa redaktur. Ini **bukan** alasan untuk menyatukan editorial Cari Lomba dengan Kisah Juara; penambahan lanjutan bisa dilakukan pada modul Cari Lomba setelah alur manual berhasil diuji di produksi.
