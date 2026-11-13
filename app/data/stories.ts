/**
 * DATA DEMONSTRASI, BUKAN KISAH NYATA.
 * Ganti seluruh isi sebelum menerbitkan situs untuk publik.
 * Jangan menetapkan status verifikasi tanpa bukti yang telah ditinjau.
 */
export type StoryCategory = "Teknologi" | "Bisnis" | "Karya Tulis" | "Desain" | "Sains" | "Sosial";
export type Experience = "Juara" | "Finalis" | "Peserta";
export type StorySection = { title: string; paragraphs: string[] };
export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  quote: string;
  category: StoryCategory;
  experience: Experience;
  format: "Tim" | "Individu";
  year: number;
  participant: string;
  institution: string;
  competition: string;
  sourceType: "Simulasi editorial" | "Wawancara Jejakarsa" | "Kontribusi peserta";
  isAchievementConfirmed: boolean;
  publishedAt: string;
  readingMinutes: number;
  imageUrl: string | null;
  imageDescription: string | null;
  lead: string;
  sections: StorySection[];
  fieldNotes: { challenge: string; approach: string; lesson: string };
  catalogQuery: string | null;
};

export const STORIES: Story[] = [
  {
    slug: "mengulang-ide-sebelum-final",
    title: "Ketika sebuah ide harus dibangun ulang sebelum final.",
    excerpt: "Tentang menguji asumsi lebih awal, menerima revisi, dan menyusun ulang arah kerja tim.",
    quote: "Kami baru bergerak lebih cepat setelah berani mengubah ide awal.",
    category: "Teknologi", experience: "Finalis", format: "Tim", year: 2026,
    participant: "Tim contoh A", institution: "Identitas belum tersedia", competition: "Kompetisi inovasi teknologi (contoh)",
    sourceType: "Simulasi editorial", isAchievementConfirmed: false, publishedAt: "2026-11-10", readingMinutes: 4,
    imageUrl: null, imageDescription: null,
    lead: "Simulasi cerita ini memperlihatkan bagaimana pengalaman kompetisi dapat diolah menjadi catatan yang bisa dipelajari, bukan sekadar pengumuman hasil.",
    sections: [
      { title: "Awal perjalanan", paragraphs: ["Sebuah tim mahasiswa menyiapkan gagasan teknologi untuk menjawab persoalan yang mereka temukan di lingkungan sekitar. Pada tahap awal, mereka terlalu cepat menentukan solusi sebelum memahami kebutuhannya."] },
      { title: "Tantangan dan proses", paragraphs: ["Ketika melakukan evaluasi internal, sebagian asumsi ternyata tidak cocok dengan kebutuhan pengguna. Tim harus menata ulang prioritas, mendokumentasikan keputusan, dan membagi pekerjaan menjadi tahapan kecil.", "Mereka kemudian mengutamakan prototipe sederhana dan pengujian dini dibanding memperbanyak fitur. Proses revisi menjadi bahan pembelajaran yang paling terasa."] },
      { title: "Hasil dan pelajaran", paragraphs: ["Bagian ini nantinya harus diisi hasil yang dapat dikonfirmasi dari peserta. Dalam contoh ini, tidak ada prestasi yang diklaim sebagai fakta.", "Pembelajaran yang ingin ditonjolkan adalah pentingnya memvalidasi masalah sebelum memperluas solusi."] },
    ],
    fieldNotes: { challenge: "Asumsi awal tentang kebutuhan pengguna belum teruji.", approach: "Menyederhanakan prototipe dan membagi tahap evaluasi.", lesson: "Uji masalah dan gagasan lebih awal, sebelum tim menghabiskan waktu membangun solusi." },
    catalogQuery: null,
  },
  {
    slug: "membagi-pekerjaan-saat-tenggat",
    title: "Membagi pekerjaan ketika tenggat semakin dekat.",
    excerpt: "Catatan tentang komunikasi tim, pemetaan kemampuan, dan menjaga kualitas proposal.",
    quote: "Persiapan kami membaik ketika setiap orang tahu apa yang perlu diselesaikan.",
    category: "Bisnis", experience: "Peserta", format: "Tim", year: 2026,
    participant: "Tim contoh B", institution: "Identitas belum tersedia", competition: "Business plan competition (contoh)",
    sourceType: "Simulasi editorial", isAchievementConfirmed: false, publishedAt: "2026-11-08", readingMinutes: 3,
    imageUrl: null, imageDescription: null,
    lead: "Dalam kompetisi tim, kesulitan kadang muncul bukan dari ide, melainkan dari cara orang bekerja bersama.",
    sections: [
      { title: "Awal perjalanan", paragraphs: ["Tim membentuk kelompok berdasarkan minat yang sama, tetapi belum membicarakan tanggung jawab masing-masing. Pekerjaan penting akhirnya menumpuk menjelang tenggat."] },
      { title: "Tantangan dan proses", paragraphs: ["Untuk menata ulang pekerjaan, tim memisahkan riset pasar, perhitungan keuangan, penulisan, dan presentasi. Kemajuan dibahas pada pertemuan singkat yang memiliki keluaran jelas."] },
      { title: "Hasil dan pelajaran", paragraphs: ["Contoh ini tidak menyatakan hasil lomba yang faktual. Fokusnya adalah bagaimana pembagian tugas dan tenggat internal dapat diuji pada perjalanan nyata narasumber nanti."] },
    ],
    fieldNotes: { challenge: "Pekerjaan menumpuk karena tanggung jawab belum dibagi.", approach: "Menentukan pemilik tugas dan tenggat internal untuk tiap bagian.", lesson: "Kesepakatan cara kerja lebih penting daripada jadwal yang hanya dibuat di awal." },
    catalogQuery: null,
  },
  {
    slug: "proposal-ditolak-seleksi",
    title: "Apa yang berubah setelah proposal pertama ditolak?",
    excerpt: "Belajar membaca kriteria penilaian dan memperbaiki argumen, bukan sekadar memperpanjang tulisan.",
    quote: "Penolakan pertama membuat kami membaca ulang persoalannya dari awal.",
    category: "Karya Tulis", experience: "Peserta", format: "Individu", year: 2026,
    participant: "Peserta contoh C", institution: "Identitas belum tersedia", competition: "Lomba karya tulis (contoh)",
    sourceType: "Simulasi editorial", isAchievementConfirmed: false, publishedAt: "2026-11-04", readingMinutes: 4,
    imageUrl: null, imageDescription: null,
    lead: "Sebuah contoh bagaimana kegagalan seleksi bisa menjadi bahan evaluasi yang lebih konkret daripada nasihat motivasi.",
    sections: [
      { title: "Awal perjalanan", paragraphs: ["Peserta menulis proposal berdasarkan topik yang menarik secara pribadi, tetapi kurang memperhatikan lingkup dan kriteria yang diminta penyelenggara."] },
      { title: "Tantangan dan proses", paragraphs: ["Setelah proposal tidak lolos, peserta meninjau kembali hubungan antara rumusan masalah, metode, dan keluaran. Mereka belajar membedakan argumen utama dari bagian yang hanya menambah panjang naskah."] },
      { title: "Hasil dan pelajaran", paragraphs: ["Belum ada dokumen atau hasil kompetisi nyata di balik contoh ini. Saat digunakan untuk wawancara sebenarnya, bagian ini wajib merujuk pada penilaian dan pengalaman narasumber."] },
    ],
    fieldNotes: { challenge: "Topik menarik tetapi kurang sesuai dengan kriteria kompetisi.", approach: "Mencocokkan setiap bagian proposal dengan tujuan dan rubrik penilaian.", lesson: "Revisi tidak selalu berarti menambah isi; kadang justru memperjelas argumen." },
    catalogQuery: null,
  },
  {
    slug: "revisi-desain-dari-pengujian",
    title: "Desain yang terlihat bagus belum tentu mudah digunakan.",
    excerpt: "Mengevaluasi keputusan desain dari pengujian sederhana sebelum memoles tampilan akhir.",
    quote: "Satu pengujian memberi kami pertanyaan yang tidak terpikir sebelumnya.",
    category: "Desain", experience: "Finalis", format: "Tim", year: 2025,
    participant: "Tim contoh D", institution: "Identitas belum tersedia", competition: "Tantangan UI/UX (contoh)",
    sourceType: "Simulasi editorial", isAchievementConfirmed: false, publishedAt: "2025-12-01", readingMinutes: 3,
    imageUrl: null, imageDescription: null,
    lead: "Bahan editorial ilustratif tentang pentingnya memeriksa cara orang menggunakan produk.",
    sections: [
      { title: "Awal perjalanan", paragraphs: ["Tim mulai dari referensi antarmuka dan membuat beberapa alternatif visual untuk tantangan desain."] },
      { title: "Tantangan dan proses", paragraphs: ["Saat diuji dengan skenario tugas sederhana, beberapa langkah ternyata membingungkan. Tim memperbaiki hierarki dan label navigasi sebelum memfinalkan komponen visual."] },
      { title: "Hasil dan pelajaran", paragraphs: ["Kisah ini masih sepenuhnya ilustratif. Tidak ada pencapaian peserta yang dikonfirmasi."] },
    ],
    fieldNotes: { challenge: "Tampilan awal lebih menekankan estetika daripada kejelasan alur.", approach: "Menguji skenario tugas, mencatat hambatan, lalu menyusun prioritas revisi.", lesson: "Argumen desain menjadi lebih kuat ketika didukung observasi pengguna." },
    catalogQuery: null,
  },
];

export const STORY_CATEGORIES: Array<"Semua" | StoryCategory> = ["Semua", "Teknologi", "Bisnis", "Karya Tulis", "Desain", "Sains", "Sosial"];
export const STORY_EXPERIENCES: Array<"Semua" | Experience> = ["Semua", "Juara", "Finalis", "Peserta"];

export function findStory(slug: string): Story | undefined {
  return STORIES.find((story) => story.slug === slug);
}
