import type { Playbook, Competition, Evidence } from "./types";

// Semua kompetisi di file ini sengaja dibuat sebagai DATA DEMO FIKTIF.
// Ganti dengan data terverifikasi dari penyelenggara sebelum dipublikasikan.
const demoEvidence = (location: string, excerpt: string, status: Evidence["status"] = "verified"): Evidence => ({
  sourceTitle: "Contoh Panduan Lomba (Dokumen Simulasi)",
  location,
  excerpt,
  checkedAt: "2026-11-14",
  status,
  note: "Bukti contoh untuk demonstrasi pemeriksaan persyaratan.",
});

export const competitions: Competition[] = [
  {
    id: "opp-001", slug: "nusantara-innovation-challenge", title: "Nusantara Innovation Challenge", organizer: "Nusantara Future Lab (simulasi)",
    category: "Inovasi & Teknologi", discipline: "Teknologi", level: ["D3", "S1"], participation: "Tim", minTeamSize: 2, maxTeamSize: 4,
    feeStatus: "Gratis", feeAmount: 0, mode: "Online", location: "Nasional · Indonesia", deadline: "2026-12-18", publishedAt: "2026-11-10",
    summary: "Peserta mengusulkan solusi teknologi untuk masalah layanan publik atau lingkungan.",
    description: "Peserta memilih masalah nyata, merancang solusi, lalu menjelaskan cara kerja dan dampaknya. Penilaian contoh mencakup relevansi masalah, kelayakan solusi, dampak, dan presentasi. Data ini dibuat untuk menguji tampilan, bukan sebagai pengumuman lomba sungguhan.",
    theme: "Teknologi untuk Ketahanan Sehari-hari", prize: "Hadiah simulasi hingga Rp10.000.000",
    requirements: [
      { id: "r1", label: "Jenjang pendidikan", field: "educationLevel", value: "D3 atau S1", rule: "levels", evidence: demoEvidence("Panduan simulasi · hlm. 2", "Peserta merupakan mahasiswa aktif program Diploma Tiga atau Sarjana.") },
      { id: "r2", label: "Program studi", field: "studyProgram", value: "Seluruh program studi", rule: "all", evidence: demoEvidence("Panduan simulasi · hlm. 2", "Kompetisi terbuka bagi mahasiswa dari seluruh program studi.") },
      { id: "r3", label: "Ukuran tim", field: "teamSize", value: "2–4 orang", rule: "team", evidence: demoEvidence("Panduan simulasi · hlm. 3", "Setiap tim terdiri dari dua hingga empat mahasiswa dari perguruan tinggi yang sama.") },
      { id: "r4", label: "Biaya pendaftaran", field: "fee", value: "Gratis", rule: "free", evidence: demoEvidence("Panduan simulasi · hlm. 4", "Pendaftaran peserta tidak dipungut biaya.") },
    ],
    checklist: ["Baca panduan dan ketentuan lengkap", "Tentukan masalah yang ingin diselesaikan", "Bentuk tim dan tetapkan peran", "Susun proposal solusi", "Buat prototipe atau demonstrasi", "Periksa format dan kelengkapan pengumpulan"],
    sourceName: "Panduan simulasi", sourceUrl: "#", verificationStatus: "sample", verificationNote: "Data contoh untuk demonstrasi antarmuka.",
  },
  {
    id: "opp-002", slug: "archipelago-research-forum", title: "Archipelago Research Forum", organizer: "Archipelago Academic Network (simulasi)",
    category: "Riset & Karya Tulis", discipline: "Riset", level: ["S1", "S2"], participation: "Individu", minTeamSize: null, maxTeamSize: null,
    feeStatus: "Berbayar", feeAmount: 75000, mode: "Hybrid", location: "Banjarmasin & Online", deadline: "2026-12-09", publishedAt: "2026-11-08",
    summary: "Forum karya ilmiah mahasiswa yang membahas riset terapan, ekologi, dan pembangunan wilayah.",
    description: "Peserta mengirim abstrak dan naskah lengkap, kemudian mempresentasikan hasil riset. Pada data contoh ini, bidang studi belum disebutkan sehingga perlu ditanyakan kepada penyelenggara.",
    theme: "Riset Terapan untuk Pembangunan Wilayah Berkelanjutan", prize: "Publikasi prosiding simulasi dan penghargaan", 
    requirements: [
      { id: "r1", label: "Jenjang pendidikan", field: "educationLevel", value: "S1 atau S2", rule: "levels", evidence: demoEvidence("Panduan simulasi · hlm. 1", "Peserta adalah mahasiswa aktif program Sarjana atau Magister.") },
      { id: "r2", label: "Program studi", field: "studyProgram", value: "Belum dijelaskan", rule: "unknown", evidence: demoEvidence("Panduan simulasi · hlm. 1", "Dokumen simulasi tidak mencantumkan pembatasan program studi.", "ambiguous") },
      { id: "r3", label: "Bentuk partisipasi", field: "teamSize", value: "Individu", rule: "individual", evidence: demoEvidence("Panduan simulasi · hlm. 2", "Satu naskah didaftarkan oleh satu penulis utama.") },
      { id: "r4", label: "Biaya pendaftaran", field: "fee", value: "Rp75.000", rule: "paid", evidence: demoEvidence("Panduan simulasi · hlm. 4", "Biaya administrasi peserta sebesar Rp75.000.") },
    ],
    checklist: ["Pilih subtema riset", "Susun abstrak", "Siapkan naskah sesuai templat", "Periksa etika dan sitasi", "Latih presentasi", "Unggah naskah dan bukti pembayaran"],
    sourceName: "Panduan simulasi", sourceUrl: "#", verificationStatus: "sample", verificationNote: "Data contoh dengan satu persyaratan yang perlu diklarifikasi.",
  },
  {
    id: "opp-003", slug: "design-for-impact-student-challenge", title: "Design for Impact Student Challenge", organizer: "Impact Design Studio (simulasi)",
    category: "Desain & UI/UX", discipline: "Desain", level: ["SMA", "D3", "S1"], participation: "Individu atau Tim", minTeamSize: 1, maxTeamSize: 3,
    feeStatus: "Gratis", feeAmount: 0, mode: "Online", location: "Nasional · Indonesia", deadline: "2026-12-27", publishedAt: "2026-11-12",
    summary: "Tantangan desain layanan digital dengan penilaian pada riset pengguna, aksesibilitas, dan kemudahan penggunaan.",
    description: "Peserta merancang solusi untuk satu skenario layanan digital. Karya yang dikumpulkan berupa studi kasus, alur pengguna, dan prototipe interaktif. Ketentuan pada halaman ini merupakan contoh.",
    theme: "Merancang Layanan Digital yang Lebih Inklusif", prize: "Mentoring dan hadiah simulasi", 
    requirements: [
      { id: "r1", label: "Jenjang pendidikan", field: "educationLevel", value: "SMA, D3, atau S1", rule: "levels", evidence: demoEvidence("Panduan desain simulasi · bagian Persyaratan Peserta", "Pelajar SMA dan mahasiswa Diploma atau Sarjana dapat berpartisipasi.") },
      { id: "r2", label: "Program studi", field: "studyProgram", value: "Seluruh program studi", rule: "all", evidence: demoEvidence("Panduan desain simulasi · bagian Persyaratan Peserta", "Tidak ada batasan bidang studi.") },
      { id: "r3", label: "Ukuran tim", field: "teamSize", value: "1–3 orang", rule: "team", evidence: demoEvidence("Panduan desain simulasi · bagian Pengumpulan", "Karya dapat diajukan secara Individu/Tim dengan maksimal tiga anggota.") },
      { id: "r4", label: "Biaya pendaftaran", field: "fee", value: "Gratis", rule: "free", evidence: demoEvidence("Panduan desain simulasi · bagian Pendaftaran", "Tidak ada biaya pendaftaran.") },
    ],
    checklist: ["Baca panduan desain", "Tentukan masalah pengguna", "Lakukan riset singkat", "Susun alur pengguna", "Buat prototipe", "Susun studi kasus dan tautan karya"],
    sourceName: "Panduan desain simulasi", sourceUrl: "#", verificationStatus: "sample", verificationNote: "Data contoh untuk demonstrasi antarmuka.",
  },
  {
    id: "opp-004", slug: "student-business-case-league", title: "Student Business Case League", organizer: "Civic Venture Society (simulasi)",
    category: "Bisnis & Kewirausahaan", discipline: "Bisnis", level: ["D3", "S1", "S2"], participation: "Tim", minTeamSize: 3, maxTeamSize: 5,
    feeStatus: "Berbayar", feeAmount: 125000, mode: "Offline", location: "Surabaya, Jawa Timur", deadline: "2026-12-05", publishedAt: "2026-11-05",
    summary: "Kompetisi analisis kasus bisnis yang meminta tim menyusun strategi dan rencana usaha.",
    description: "Tim menganalisis satu studi kasus, lalu menyampaikan rekomendasi strategi dalam presentasi. Data contoh ini menampilkan persyaratan jumlah anggota tim dan biaya pendaftaran.",
    theme: "Membangun Usaha Lokal yang Tangguh", prize: "Hadiah simulasi dan sesi presentasi", 
    requirements: [
      { id: "r1", label: "Jenjang pendidikan", field: "educationLevel", value: "D3, S1, atau S2", rule: "levels", evidence: demoEvidence("Panduan studi kasus simulasi · hlm. 2", "Peserta berasal dari program Diploma Tiga, Sarjana, atau Magister.") },
      { id: "r2", label: "Program studi", field: "studyProgram", value: "Seluruh program studi", rule: "all", evidence: demoEvidence("Panduan studi kasus simulasi · hlm. 2", "Kompetisi terbuka untuk semua disiplin ilmu.") },
      { id: "r3", label: "Ukuran tim", field: "teamSize", value: "3–5 orang", rule: "team", evidence: demoEvidence("Panduan studi kasus simulasi · hlm. 3", "Setiap tim terdiri dari tiga sampai lima peserta.") },
      { id: "r4", label: "Biaya pendaftaran", field: "fee", value: "Rp125.000", rule: "paid", evidence: demoEvidence("Panduan studi kasus simulasi · hlm. 5", "Biaya registrasi tim sebesar Rp125.000.") },
    ],
    checklist: ["Bentuk tim lintas keahlian", "Analisis masalah dalam studi kasus", "Kembangkan opsi strategi", "Buat proyeksi dan asumsi", "Susun berkas presentasi", "Latihan presentasi tim"],
    sourceName: "Panduan studi kasus simulasi", sourceUrl: "#", verificationStatus: "sample", verificationNote: "Data contoh untuk demonstrasi antarmuka.",
  },
  {
    id: "opp-005", slug: "open-source-buildathon", title: "Open Source Buildathon", organizer: "Open Collaboration Hub (simulasi)",
    category: "Pemrograman", discipline: "Teknologi", level: ["D3", "S1"], participation: "Individu atau Tim", minTeamSize: 1, maxTeamSize: 4,
    feeStatus: "Gratis", feeAmount: 0, mode: "Online", location: "Internasional · Online", deadline: "2027-01-12", publishedAt: "2026-11-13",
    summary: "Kompetisi pengembangan perangkat lunak sumber terbuka untuk menyelesaikan masalah komunitas.",
    description: "Peserta mengembangkan proyek, menulis dokumentasi penggunaan, dan menyiapkan demonstrasi. Periksa lisensi serta ketentuan kontribusi sebelum mengirimkan karya. Data ini sepenuhnya fiktif.",
    theme: "Alat Sederhana, Dampak Bersama", prize: "Kredit komputasi awan (simulasi) dan proyek unggulan", 
    requirements: [
      { id: "r1", label: "Jenjang pendidikan", field: "educationLevel", value: "D3 atau S1", rule: "levels", evidence: demoEvidence("Aturan simulasi · Persyaratan Peserta", "Peserta merupakan mahasiswa Diploma atau Sarjana.") },
      { id: "r2", label: "Program studi", field: "studyProgram", value: "Bidang teknologi atau komputasi", rule: "programs", evidence: demoEvidence("Aturan simulasi · Persyaratan Peserta", "Peserta diutamakan dari bidang teknologi, komputasi, atau disiplin terkait.", "ambiguous") },
      { id: "r3", label: "Ukuran tim", field: "teamSize", value: "1–4 orang", rule: "team", evidence: demoEvidence("Aturan simulasi · Tim", "Proyek dapat diajukan Individu/Tim hingga empat orang.") },
      { id: "r4", label: "Biaya pendaftaran", field: "fee", value: "Gratis", rule: "free", evidence: demoEvidence("Aturan simulasi · Pendaftaran", "Tidak ada biaya partisipasi.") },
    ],
    checklist: ["Tentukan masalah komunitas", "Pilih lisensi proyek", "Buat repositori", "Bangun fitur inti", "Tulis dokumentasi proyek", "Siapkan demonstrasi dan berkas pengumpulan"],
    sourceName: "Aturan simulasi", sourceUrl: "#", verificationStatus: "sample", verificationNote: "Data contoh fiktif. Ketentuan lisensi hanya contoh.",
  },
  {
    id: "opp-006", slug: "young-essay-on-wetlands", title: "Young Essay on Wetlands", organizer: "Wetland Futures Initiative (simulasi)",
    category: "Esai & Karya Tulis", discipline: "Lingkungan", level: ["SMA", "D3", "S1"], participation: "Individu", minTeamSize: null, maxTeamSize: null,
    feeStatus: "Gratis", feeAmount: 0, mode: "Online", location: "Nasional · Indonesia", deadline: "2026-12-14", publishedAt: "2026-11-11",
    summary: "Kompetisi esai tentang solusi lingkungan yang berangkat dari pengetahuan dan kondisi lokal.",
    description: "Peserta menulis esai yang menghubungkan persoalan lingkungan dengan kondisi setempat, lalu mengusulkan langkah penyelesaian. Contoh ini menggambarkan lomba individu tanpa biaya pendaftaran.",
    theme: "Pengetahuan Lokal untuk Masa Depan Lahan Basah", prize: "Publikasi digital simulasi dan penghargaan", 
    requirements: [
      { id: "r1", label: "Jenjang pendidikan", field: "educationLevel", value: "SMA, D3, atau S1", rule: "levels", evidence: demoEvidence("Panduan simulasi · Peserta", "Peserta merupakan pelajar SMA atau mahasiswa Diploma dan Sarjana.") },
      { id: "r2", label: "Program studi", field: "studyProgram", value: "Seluruh program studi", rule: "all", evidence: demoEvidence("Panduan simulasi · Peserta", "Peserta dari seluruh program studi dapat mengikuti kompetisi.") },
      { id: "r3", label: "Bentuk partisipasi", field: "teamSize", value: "Individu", rule: "individual", evidence: demoEvidence("Panduan simulasi · Ketentuan Karya", "Satu karya dikirimkan oleh satu peserta.") },
      { id: "r4", label: "Biaya pendaftaran", field: "fee", value: "Gratis", rule: "free", evidence: demoEvidence("Panduan simulasi · Registrasi", "Pendaftaran tidak dipungut biaya.") },
    ],
    checklist: ["Pilih isu lahan basah", "Tentukan tesis utama", "Kumpulkan sumber ilmiah", "Susun kerangka argumentasi", "Tulis dan revisi esai", "Periksa format dan orisinalitas"],
    sourceName: "Panduan simulasi", sourceUrl: "#", verificationStatus: "sample", verificationNote: "Data contoh untuk demonstrasi pencarian dan pemeriksaan.",
  },
];

export const categories = ["Semua", "Inovasi & Teknologi", "Riset & Karya Tulis", "Desain & UI/UX", "Bisnis & Kewirausahaan", "Pemrograman", "Esai & Karya Tulis"];

export const playbooks: Playbook[] = [
  { slug: "membaca-brief-kompetisi", title: "Membaca Panduan Lomba Tanpa Melewatkan Detail Penting", category: "Panduan praktis", readTime: "6 menit", excerpt: "Cara menemukan syarat peserta, ketentuan karya, jadwal, dan informasi yang perlu dikonfirmasi.", accent: "sage", featured: true, coverLabel: "PANDUAN" },
  { slug: "membangun-tim-lintas-disiplin", title: "Membangun Tim Lintas Bidang untuk Mengikuti Lomba", category: "Strategi tim", readTime: "8 menit", excerpt: "Cara membagi tugas, menyepakati keputusan, dan mengatur jadwal kerja tim.", accent: "blue", featured: false, coverLabel: "TIM" },
  { slug: "proposal-ke-prototype", title: "Dari Proposal ke Prototipe: Menjaga Gagasan Tetap Bisa Diuji", category: "Catatan pelaksanaan", readTime: "7 menit", excerpt: "Langkah menguji gagasan melalui rancangan, percobaan, dan prototipe.", accent: "amber", featured: false, coverLabel: "KARYA" },
];
