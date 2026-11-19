# Impor naskah Kisah Juara

## Pasang di proyek Jejakarsa

1. Ekstrak ZIP ke folder sementara. Salin folder `components` dan `lib` dari hasil ekstraksi ke folder `lombahub` yang berisi `package.json`. Pilih gabungkan folder dan timpa berkas dengan nama yang sama. Paket ini dibuat untuk versi yang sudah memakai Ruang Redaksi.
2. Jalankan `npm run dev`. Masuk melalui `/admin/review/kisah-juara`, buka satu draf, lalu cari **Isi wawancara → Impor naskah**. Pilih **Coba contoh** untuk melihat hasilnya.
3. Setelah puas dengan hasil lokal, kirim perubahan kode ke cabang Git yang digunakan Vercel seperti biasa. Fitur ini memakai instalasi Next.js dan konfigurasi Supabase yang sudah berjalan.

## Dari wawancara menjadi draf

1. Di panel impor, buka **Prompt untuk AI pribadi**, lalu pilih **Salin prompt**. Tempel ke AI yang biasa Anda gunakan dan ganti penanda transkrip dengan bagian wawancara yang ingin diolah.
2. Tempel jawaban AI ke **Naskah Markdown**. Pratinjau mengikuti perubahan teks. Di laptop keduanya dapat tampil berdampingan. Di HP, hasilnya muncul di bawah kolom naskah.
3. Pilih **Masukkan ke editor**. Jika sudah ada isi, **Tambahkan ke akhir naskah** menyertakan bagian baru setelah tulisan dan foto lama. **Ganti isi wawancara…** meminta konfirmasi sebelum mengganti seluruh isi, termasuk foto di dalam cerita.
4. Klik kalimat atau sel tabel yang ingin diperbaiki di editor. Gunakan **Pratinjau** untuk membaca artikelnya secara utuh, lalu **Simpan draf**. Pilih **Terbitkan** atau **Terbitkan perubahan** saat versi itu siap dibaca publik.

Judul, sampul, profil pencapaian, kredit, serta persetujuan publikasi diisi melalui kolom masing-masing. Saat panel impor masih terbuka, teks di kolom Markdown merupakan bahan kerja sementara. Masukkan ke editor sebelum menyimpan draf.

## Format yang bisa dipakai

| Kebutuhan | Cara menulisnya |
| --- | --- |
| Paragraf | Pisahkan dengan satu baris kosong. |
| Subjudul dan subjudul kecil | Awali baris dengan `## ` atau `### `. |
| Penekanan | Gunakan `**tebal**` atau `*miring*`. |
| Kutipan | Awali ucapan narasumber dengan `> `. |
| Sorotan | Tulis `> [!NOTE]`, lalu mulai baris berikutnya dengan `> `. |
| Daftar | Mulai setiap baris dengan `- ` atau `1. `. Gunakan satu tingkat daftar. |
| Garis pemisah | Tulis `---` pada baris tersendiri. |
| Tabel | Gunakan kepala kolom, baris pemisah, dan setidaknya satu baris isi. Contoh tersedia di panel impor. |

Untuk tabel, dua atau tiga kolom biasanya cukup untuk membandingkan informasi wawancara. Batasnya enam kolom, 79 baris isi, dan 60.000 karakter per impor. Jika bentuk tabel belum sesuai, editor menunjukkan baris yang perlu diperiksa. Gunakan tombol **Sisipkan foto** di editor untuk dokumentasi.

Format paragraf dan tabel mengacu pada [GitHub Flavored Markdown](https://github.github.com/gfm/). Tabel artikel memakai sel kepala kolom sesuai [panduan tabel W3C](https://www.w3.org/WAI/tutorials/tables/one-header/).
