/**
 * Kisah Juara - data editorial statis untuk MVP.
 * Semua entri berstatus `sample` FIKTIF, hanya untuk uji tampilan.
 * Jangan ubah menjadi `published` tanpa pemeriksaan fakta dan izin narasumber.
 */

export type StoryCategory = "Bisnis & Kewirausahaan" | "Riset & Karya Tulis" | "Inovasi & Teknologi" | "Desain & Kreatif" | "Lainnya";
export type StoryStatus = "sample" | "draft" | "published";
export type StoryAccent = "moss" | "clay" | "slate";

export interface WinnerStory {
  slug: string;
  status: StoryStatus;
  // Untuk status published, KEDUANYA harus true agar tampil ke publik.
  achievementChecked: boolean;
  publicationApproved: boolean;
  title: string;
  // Judul ringkas untuk kartu; judul artikel lengkap tetap memakai title.
  cardTitle?: string;
  subtitle: string;
  excerpt: string;
  category: StoryCategory;
  competition: string;
  achievement: string;
  level: string;
  participantType: "Individu" | "Tim";
  participants: string;
  campus: string;
  year: number;
  publishedAt: string; // yyyy-mm-dd
  readMinutes: number;
  featured: boolean;
  accent: StoryAccent;
  coverLabel: string;
  // Foto sungguhan: simpan di public/kisah-juara, lalu isi path di sini.
  photo?: { src: string; alt: string; objectPosition?: string };
  editorialBody?: import("./editorial/model").Block[];
  credits?: import("./story-credits").StoryCredit[];
  opening: string[];
  sections: Array<{ heading: string; paragraphs: string[]; quote?: string }>;
  lessons: string[];
  hindsight: string;
  source?: { label: string; url: string };
  relatedPlaybookSlug?: string;
  relatedSearch?: string;
}

/** Matikan setelah siap meluncurkan tanpa contoh. */
export const SHOW_SAMPLE_STORIES = true;

export const stories: WinnerStory[] = [
  {
    slug: "revisi-presentasi-menjelang-final",
    status: "sample", achievementChecked: false, publicationApproved: false,
    title: "Kami terlalu sibuk mempercantik slide, sampai lupa menguji argumen",
    cardTitle: "Menguji argumen sebelum final",
    subtitle: "Sebuah cerita tentang menyusun prioritas ketika waktu menuju final semakin pendek.",
    excerpt: "Menjelang presentasi, tim menyadari bahwa tampilan yang rapi belum cukup. Mereka perlu memastikan solusi yang diajukan benar-benar masuk akal.",
    category: "Bisnis & Kewirausahaan", competition: "Business Case Challenge (simulasi)", achievement: "Juara III (simulasi)",
    level: "Nasional", participantType: "Tim", participants: "Tim Simulasi A", campus: "Kampus contoh", year: 2026,
    publishedAt: "2026-11-14", readMinutes: 5, featured: true, accent: "moss", coverLabel: "DI BALIK FINAL",
    opening: [
      "Dalam simulasi wawancara ini, sebuah tim business case menghadapi persoalan yang sederhana tetapi cukup menentukan: mereka terus memperbaiki tampilan presentasi, sementara alasan di balik rekomendasi bisnisnya belum benar-benar diuji.",
      "Cerita ini sengaja dibuat sebagai contoh format Kisah Juara. Identitas tim, kompetisi, dan pencapaiannya bukan data mahasiswa sungguhan."
    ],
    sections: [
      { heading: "Awalnya semua terasa berjalan sesuai rencana", paragraphs: ["Pembagian pekerjaan dilakukan sejak awal. Sebagian anggota mengumpulkan data, yang lain merancang solusi, lalu semuanya digabungkan ke dalam presentasi. Namun, setiap sesi latihan justru berakhir dengan diskusi tentang warna, urutan slide, dan jumlah teks.", "Mereka baru menyadari masalahnya ketika mencoba menjawab satu pertanyaan sederhana: mengapa solusi ini lebih masuk akal daripada pilihan yang lain?"] },
      { heading: "Perubahan kecil yang akhirnya membantu", paragraphs: ["Tim kemudian berhenti merevisi desain selama satu malam. Setiap anggota diminta menyampaikan argumen utama tanpa melihat layar. Bagian yang sulit dijelaskan dicatat untuk diperiksa ulang bersama.", "Mereka juga membuat daftar pertanyaan yang kemungkinan muncul dari juri. Jawaban tidak dihafalkan kata per kata, tetapi disusun dari bukti dan batasan yang mereka pahami."], quote: "Slide yang bagus membantu orang mengikuti cerita. Tapi kami tetap harus mengerti keputusan yang kami usulkan." },
      { heading: "Apa yang tersisa setelah kompetisi", paragraphs: ["Dari proses itu, tim belajar bahwa kualitas presentasi tidak hanya ditentukan oleh tampilannya. Mereka perlu menyisakan waktu untuk menguji asumsi, membandingkan alternatif, dan berlatih menjelaskan keputusan dengan bahasa sederhana."] }
    ],
    lessons: ["Uji argumen sebelum menghabiskan waktu pada detail visual.", "Minta satu orang di luar tim mengajukan pertanyaan kritis.", "Sisakan sesi latihan tanpa membaca slide."],
    hindsight: "Jika mengulang prosesnya, mereka akan menetapkan batas waktu untuk desain lebih awal, lalu menggunakan sisa waktu untuk latihan tanya jawab.",
    relatedPlaybookSlug: "membangun-tim-lintas-disiplin", relatedSearch: "Bisnis"
  },
  {
    slug: "prototipe-yang-berulang-kali-gagal",
    status: "sample", achievementChecked: false, publicationApproved: false,
    title: "Prototipe pertama mereka tidak bekerja seperti yang dibayangkan",
    cardTitle: "Menelusuri kegagalan prototipe pertama",
    subtitle: "Tentang menguji rancangan, mencatat kegagalan, dan menyempurnakan hasil secara bertahap.",
    excerpt: "Tidak semua percobaan menghasilkan kemajuan yang terlihat. Dalam contoh cerita ini, perubahan justru muncul setelah tim berhenti menebak penyebab masalah.",
    category: "Inovasi & Teknologi", competition: "Student Innovation Challenge (simulasi)", achievement: "Juara II (simulasi)",
    level: "Regional", participantType: "Tim", participants: "Tim Simulasi B", campus: "Kampus contoh", year: 2026,
    publishedAt: "2026-11-12", readMinutes: 6, featured: false, accent: "slate", coverLabel: "PROSES & UJI",
    opening: ["Satu prototipe sederhana tampak berhasil saat diuji di meja kerja, tetapi mulai bermasalah ketika dijalankan dalam kondisi yang sedikit berbeda. Pada awalnya, tim merasa cukup memperbaiki komponen yang terlihat rusak.", "Ini adalah contoh narasi fiktif untuk memperlihatkan bagaimana Jejakarsa dapat mengolah hasil wawancara mahasiswa teknik."],
    sections: [
      { heading: "Dari ide ke rancangan pertama", paragraphs: ["Tim memulai dengan daftar fitur yang panjang. Mereka ingin menunjukkan sebanyak mungkin kemampuan pada satu alat. Akibatnya, beberapa bagian belum diuji secara terpisah ketika jadwal presentasi sudah semakin dekat."] },
      { heading: "Percobaan yang tidak berjalan mulus", paragraphs: ["Alih-alih mengganti semua komponen, mereka mulai membuat catatan uji: kondisi awal, perubahan yang dilakukan, dan hasil yang muncul. Dari sana, masalah yang sebelumnya terlihat acak mulai mempunyai pola.", "Satu fitur yang belum stabil akhirnya ditunda. Tim memilih menunjukkan fungsi inti dengan bukti pengujian yang dapat mereka jelaskan."], quote: "Mencatat kegagalan membuat kami berhenti mengulang percobaan yang sama tanpa alasan." },
      { heading: "Saat harus menjelaskan keterbatasan", paragraphs: ["Mereka menyadari bahwa keterbatasan prototipe tidak selalu perlu disembunyikan. Yang lebih penting adalah menjelaskan apa yang sudah dibuktikan, apa yang belum, dan bagaimana pengembangan berikutnya dapat dilakukan."] }
    ],
    lessons: ["Mulai dari fungsi inti yang bisa diuji.", "Catat perubahan variabel dan hasil setiap percobaan.", "Jelaskan batasan rancangan tanpa melebih-lebihkan kemampuannya."],
    hindsight: "Pada kesempatan berikutnya, tim akan membuat rencana pengujian sejak minggu pertama, bukan setelah prototipe selesai dirakit.",
    relatedPlaybookSlug: "proposal-ke-prototype", relatedSearch: "Teknologi"
  },
  {
    slug: "esai-yang-perlu-dipersempit",
    status: "sample", achievementChecked: false, publicationApproved: false,
    title: "Tiga minggu memperbaiki esai yang awalnya membahas terlalu banyak hal",
    cardTitle: "Tiga minggu mempersempit fokus esai",
    subtitle: "Mencari satu masalah yang jelas ternyata lebih sulit daripada menulis banyak halaman.",
    excerpt: "Sebuah gagasan besar tidak selalu menghasilkan tulisan yang kuat. Kadang, langkah yang paling membantu adalah mempersempit pertanyaannya.",
    category: "Riset & Karya Tulis", competition: "Essay Competition (simulasi)", achievement: "Juara Harapan (simulasi)",
    level: "Nasional", participantType: "Individu", participants: "Narasumber Simulasi C", campus: "Kampus contoh", year: 2026,
    publishedAt: "2026-11-10", readMinutes: 5, featured: false, accent: "clay", coverLabel: "DARI DRAF",
    opening: ["Tulisan pertama dalam simulasi ini memuat terlalu banyak persoalan sekaligus: kondisi lingkungan, perilaku masyarakat, kebijakan, dan teknologi. Semua terasa penting, tetapi tidak ada yang dibahas cukup dalam.", "Cerita fiktif berikut digunakan untuk menguji bentuk artikel wawancara pada Kisah Juara, bukan sebagai laporan pengalaman seorang pemenang nyata."],
    sections: [
      { heading: "Memilih masalah yang benar-benar dapat dibahas", paragraphs: ["Penulis mula-mula mengira semakin banyak isu yang dimasukkan, semakin kuat esainya. Setelah dibaca ulang, ternyata setiap paragraf bergerak ke arah berbeda. Ia lalu memilih satu persoalan yang bisa didukung dengan sumber yang tersedia."] },
      { heading: "Belajar menghapus bagian yang disukai", paragraphs: ["Beberapa paragraf terasa bagus secara bahasa, tetapi tidak membantu menjawab gagasan utama. Bagian-bagian itu akhirnya dihapus. Waktu revisi lebih banyak digunakan untuk memperjelas hubungan antara masalah, bukti, dan usulan penyelesaian."], quote: "Bagian tersulit bukan menambah tulisan. Justru memutuskan bagian mana yang sebenarnya tidak perlu." },
      { heading: "Persiapan yang sering luput", paragraphs: ["Setelah isi membaik, ia masih harus memeriksa format pengumpulan, batas kata, dan kelengkapan sitasi. Daftar periksa yang sederhana membantu mencegah kesalahan administratif menjelang tenggat."] }
    ],
    lessons: ["Tentukan satu pertanyaan utama sebelum menulis terlalu jauh.", "Pastikan setiap bagian mendukung gagasan utama.", "Periksa persyaratan teknis sebelum mengirim karya."],
    hindsight: "Ia akan meminta umpan balik pada kerangka tulisan lebih awal, bukan menunggu draf lengkap selesai.",
    relatedPlaybookSlug: "membaca-brief-kompetisi", relatedSearch: "Karya Tulis"
  }
];

/**
 * Entri draft tidak pernah dipublikasikan. Entri published memerlukan dua persetujuan.
 * Begitu ada cerita nyata yang layak tayang, contoh otomatis disembunyikan.
 */
export function getPublicStories(): WinnerStory[] {
  const verified = stories.filter((s) => s.status === "published" && s.achievementChecked && s.publicationApproved);
  const shown = verified.length ? verified : SHOW_SAMPLE_STORIES ? stories.filter((s) => s.status === "sample") : [];
  return [...shown].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getFeaturedStory(list: WinnerStory[]) {
  return list.find((story) => story.featured) ?? list[0];
}

export function getStoryCardTitle(story: WinnerStory) {
  return story.cardTitle?.trim() || story.title;
}

export function isSampleCollection(list: WinnerStory[]) {
  return list.some((story) => story.status === "sample");
}

export function formatStoryDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

export function isSafeHttpUrl(url: string) {
  try { return ["http:", "https:"].includes(new URL(url).protocol); } catch { return false; }
}
