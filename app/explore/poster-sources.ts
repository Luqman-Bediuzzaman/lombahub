/**
 * Opsional: URL poster untuk kartu GRID di Cari Lomba.
 * Kunci = slug pada data lomba. Nilai = URL gambar langsung (jpg/png/webp), bukan URL unggahan IG.
 * Biarkan tidak diisi jika belum ada poster; sistem akan membuat sampul tipografis 4:5.
 * Jika data Competition kelak memiliki properti posterUrl, properti tersebut juga dibaca.
 * Mengubah file ini TIDAK memengaruhi tampilan List dan halaman lain.
 */
export const posterSources: Record<string, string> = {
  // "slug-lomba": "https://domain-penyelenggara.id/poster.jpg",
};
