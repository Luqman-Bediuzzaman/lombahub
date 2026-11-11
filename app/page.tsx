"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

// ============================================================
// TYPES
// ============================================================

type Competition = {
  id: number;
  title: string;
  organizer: string;
  category: string;
  level: string;
  format: string;
  fee: number;
  deadline: string;
  eventDate: string | null;
  eligibility: string;
  summary: string;
  timeline: { label: string; date: string }[];
  sourceUrl: string | null;
  isVerified: boolean;
};

type CompetitionRowProps = {
  competition: Competition;
  todayString: string | null;
  isExpanded: boolean;
  onToggle: (id: number) => void;
};

// ============================================================
// 1. DATA LOMBA
// Data berikut masih berupa contoh tampilan. Ganti dengan data
// yang sudah diperiksa sebelum website dipublikasikan.
// ============================================================

const competitions: Competition[] = [
  {
    id: 1,
    title: "Hackathon Nasional Gemastik 2026",
    organizer: "Puspresnas / BPTI",
    category: "Teknologi",
    level: "Nasional",
    format: "Tim",
    fee: 0,
    deadline: "2026-11-12",
    eventDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi pengembangan solusi teknologi untuk mahasiswa. Periksa panduan resmi untuk mengetahui bidang dan persyaratan pendaftaran.",
    timeline: [],
    sourceUrl: null,
    isVerified: false,
  },
  {
    id: 2,
    title: "National Business Plan Competition",
    organizer: "Universitas Indonesia",
    category: "Bisnis",
    level: "Nasional",
    format: "Tim",
    fee: 0,
    deadline: "2026-11-15",
    eventDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi penyusunan rencana bisnis untuk mengembangkan ide dan model usaha.",
    timeline: [],
    sourceUrl: null,
    isVerified: false,
  },
  {
    id: 3,
    title: "UI/UX Design Challenge Nusantara",
    organizer: "Tech Startup JKT",
    category: "Desain",
    level: "Nasional",
    format: "Individu / Tim",
    fee: 50000,
    deadline: "2026-11-18",
    eventDate: null,
    eligibility: "Mahasiswa dan umum",
    summary:
      "Kompetisi desain antarmuka dan pengalaman pengguna dalam pengembangan produk digital.",
    timeline: [],
    sourceUrl: null,
    isVerified: false,
  },
  {
    id: 4,
    title: "Lomba Esai Mahasiswa Nasional",
    organizer: "Kementerian Pendidikan",
    category: "Karya Tulis",
    level: "Nasional",
    format: "Individu",
    fee: 0,
    deadline: "2026-11-20",
    eventDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi penulisan esai dengan tema dan ketentuan sesuai panduan penyelenggara.",
    timeline: [],
    sourceUrl: null,
    isVerified: false,
  },
  {
    id: 5,
    title: "Olimpiade Sains dan Teknologi Terapan",
    organizer: "Institut Teknologi Bandung",
    category: "Sains",
    level: "Nasional",
    format: "Individu",
    fee: 75000,
    deadline: "2026-11-25",
    eventDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi bidang sains dan penerapan teknologi bagi mahasiswa perguruan tinggi.",
    timeline: [],
    sourceUrl: null,
    isVerified: false,
  },
  {
    id: 6,
    title: "Debat Bahasa Inggris Mahasiswa",
    organizer: "UGM English Club",
    category: "Bahasa",
    level: "Nasional",
    format: "Tim",
    fee: 100000,
    deadline: "2026-12-01",
    eventDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi debat bahasa Inggris untuk menguji kemampuan argumentasi dan komunikasi peserta.",
    timeline: [],
    sourceUrl: null,
    isVerified: false,
  },
];

// Beranda hanya menampilkan empat peluang terdekat.
// Seluruh pencarian dan penyaringan dilakukan pada halaman /katalog.
const featuredCompetitions = [...competitions]
  .sort((a, b) => a.deadline.localeCompare(b.deadline))
  .slice(0, 4);

// ============================================================
// 2. FORMAT DATA
// ============================================================

function formatCurrency(amount: number): string {
  if (amount === 0) return "Gratis";

  return `Rp${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  return `${String(day).padStart(2, "0")} ${monthNames[month - 1]} ${year}`;
}

function getDaysLeft(
  dateString: string,
  todayString: string | null
): number | null {
  if (!todayString) return null;

  const [year, month, day] = dateString.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = todayString
    .split("-")
    .map(Number);

  const deadline = Date.UTC(year, month - 1, day);
  const today = Date.UTC(todayYear, todayMonth - 1, todayDay);

  return Math.round((deadline - today) / 86400000);
}

function getDaysLabel(daysLeft: number | null): string {
  if (daysLeft === null) return "";
  if (daysLeft < 0) return "Pendaftaran ditutup";
  if (daysLeft === 0) return "Tutup hari ini";
  if (daysLeft === 1) return "1 hari lagi";

  return `${daysLeft} hari lagi`;
}

// ============================================================
// 3. ICONS
// ============================================================

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
    </svg>
  );
}

function MenuToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {isOpen ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}

function ChevronDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

// ============================================================
// 4. BARIS KOMPETISI
// ============================================================

function CompetitionRow({
  competition,
  todayString,
  isExpanded,
  onToggle,
}: CompetitionRowProps) {
  const daysLeft = getDaysLeft(competition.deadline, todayString);
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
  const isClosed = daysLeft !== null && daysLeft < 0;
  const detailHref = `/katalog/${competition.id}`;

  return (
    <article
      className={`group border-b border-[#DCD8CC] transition-colors duration-200 dark:border-[#30382D] ${
        isExpanded
          ? "bg-[#F8F7F1] dark:bg-[#1D241B]"
          : "bg-[#F5F3EB] hover:bg-white dark:bg-[#1A1D19] dark:hover:bg-[#263022]"
      }`}
    >
      {/* Surface row: klik untuk membuka/menutup rincian. */}
      <button
        type="button"
        onClick={() => onToggle(competition.id)}
        aria-expanded={isExpanded}
        aria-controls={`competition-details-${competition.id}`}
        className="relative flex w-full flex-col gap-4 px-4 py-4 text-left transition-all duration-200 hover:shadow-[inset_3px_0_0_0_#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] md:grid md:grid-cols-[180px_minmax(0,1fr)_245px_22px] md:items-center md:gap-5 md:px-5 md:py-3.5 md:pr-5"
      >
        {/* Grup atas: kategori, penyelenggara, verifikasi, dan panah mobile */}
        <div className="flex min-w-0 items-start justify-between gap-3 md:block">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 md:block">
            <span className="max-w-full border border-[#C8C5B8] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-[#55594D] dark:border-[#3E4A35] dark:text-[#9CA392]">
              {competition.category}
            </span>
            <span className="min-w-0 max-w-full truncate text-[11px] text-[#777568] dark:text-[#9CA392] md:mt-1.5 md:block">
              {competition.organizer}
            </span>
            {competition.isVerified ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#65745A] dark:text-[#A8B79A] md:mt-1.5">
                <CheckIcon /> Sumber diperiksa
              </span>
            ) : (
              <span className="inline-flex items-center text-[9px] text-[#999587] dark:text-[#9CA392] md:mt-1.5">
                Belum diverifikasi
              </span>
            )}
          </div>

          {/* Indikator accordion mobile */}
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center border border-[#D5D1C5] text-[#65745A] transition-all duration-200 group-hover:border-[#65745A] dark:border-[#3E4A35] dark:text-[#A8B79A] md:hidden ${
              isExpanded ? "rotate-180 bg-[#65745A] text-white" : "rotate-0"
            }`}
          >
            <ChevronDownIcon />
          </span>
        </div>

        {/* Grup tengah: judul dan metadata */}
        <div className="min-w-0">
          <h3 className="break-words text-lg font-bold leading-snug text-[#2C2C2C] transition-colors duration-150 group-hover:text-[#526249] dark:text-[#EAE8E0] dark:group-hover:text-[#A8B79A] md:text-xl">
            {competition.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-[#777568] dark:text-[#9CA392]">
            <span className="font-mono uppercase tracking-wide">{competition.level}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono uppercase tracking-wide">{competition.format}</span>
            <span aria-hidden="true">·</span>
            <span className="break-words">{competition.eligibility}</span>
          </div>
        </div>

        {/* Grup bawah: micro-grid dua kolom pada mobile */}
        <div className="grid min-w-0 grid-cols-2 gap-4 border-t border-[#E7E4DA] pt-3 dark:border-[#30382D] md:gap-x-3 md:gap-y-2 md:border-l md:border-t-0 md:pl-4 md:pt-0">
          {/* Kolom 1 mobile: daftar dan sisa waktu. Kembali menjadi baris grid desktop. */}
          <div className="flex min-w-0 flex-col gap-3 md:contents">
            <div className="min-w-0 md:col-span-2 md:flex md:items-baseline md:justify-end md:gap-3">
              <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-[#969183] md:hidden">
                Daftar
              </span>
              <span className="block break-words text-left font-mono text-[10px] font-bold tabular-nums text-[#34362F] dark:text-[#EAE8E0] md:text-right">
                {formatDate(competition.deadline)}
              </span>
            </div>
            <div className="min-w-0 md:col-span-2 md:flex md:items-baseline md:justify-end md:gap-3">
              <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-[#969183] md:hidden">
                Sisa waktu
              </span>
              <span
                className={`block break-words text-left font-mono text-[10px] font-bold tabular-nums md:text-right ${
                  isUrgent
                    ? "text-[#E06B42]"
                    : isClosed
                      ? "text-[#969183]"
                      : "text-[#777568] dark:text-[#9CA392]"
                }`}
              >
                {getDaysLabel(daysLeft)}
              </span>
            </div>
          </div>

          {/* Kolom 2 mobile: acara dan biaya. Kembali menjadi dua sel desktop. */}
          <div className="flex min-w-0 flex-col gap-3 md:contents">
            <div className="flex min-w-0 flex-col gap-1 md:flex-row md:items-baseline md:justify-end md:gap-2">
              <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-[#969183] md:hidden">
                Acara
              </span>
              <span className="block break-words text-left font-mono text-[10px] text-[#777568] dark:text-[#9CA392] md:text-right">
                {competition.eventDate ? formatDate(competition.eventDate) : "Belum diumumkan"}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1 md:flex-row md:items-baseline md:justify-end md:gap-2">
              <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-[#969183] md:hidden">
                Biaya
              </span>
              <span className="block break-words text-left font-mono text-[10px] font-bold tabular-nums text-[#34362F] dark:text-[#EAE8E0] md:text-right">
                {formatCurrency(competition.fee)}
              </span>
            </div>
          </div>
        </div>

        {/* Indikator accordion desktop */}
        <span
          className={`hidden h-7 w-7 items-center justify-center border border-[#D5D1C5] text-[#65745A] transition-all duration-200 group-hover:border-[#65745A] group-hover:bg-[#65745A] group-hover:text-white dark:border-[#3E4A35] dark:text-[#A8B79A] dark:group-hover:border-[#65745A] md:flex ${
            isExpanded ? "rotate-180 bg-[#65745A] text-white" : "rotate-0"
          }`}
        >
          <ChevronDownIcon />
        </span>
      </button>

      {/* Expanded detail */}
      <div
        id={`competition-details-${competition.id}`}
        hidden={!isExpanded}
        className="border-t border-[#DCD8CC] bg-[#F0EEE5] dark:border-[#30382D] dark:bg-[#1A1A18]"
      >
        <div className="flex flex-col gap-6 px-4 py-5 md:grid md:grid-cols-2 md:gap-8 md:px-5 md:py-5">
          <div>
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#65745A] dark:text-[#A8B79A]">
              Ringkasan peluang
            </span>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#55564D] dark:text-[#9CA392]">
              {competition.summary}
            </p>
          </div>

          <div className="border-t border-[#DCD8CC] pt-4 dark:border-[#30382D] md:border-l md:border-t-0 md:pl-5 md:pt-0">
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#65745A] dark:text-[#A8B79A]">
              Timeline penting
            </span>
            {competition.timeline.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {competition.timeline.map((item, index) => (
                  <li
                    key={`${competition.id}-timeline-${index}`}
                    className="flex items-baseline justify-between gap-3 border-b border-[#E2DED3] pb-2 text-[10px] dark:border-[#30382D]"
                  >
                    <span className="text-[#777568] dark:text-[#9CA392]">{item.label}</span>
                    <span className="shrink-0 font-mono font-bold text-[#34362F] dark:text-[#EAE8E0]">
                      {formatDate(item.date)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[10px] leading-5 text-[#898679] dark:text-[#9CA392]">
                Tahapan dan jadwal pelaksanaan belum dicantumkan pada data ini.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#DCD8CC] pt-4 dark:border-[#30382D] md:col-span-2 md:flex-row md:items-center md:justify-between">
            <Link
              href={detailHref}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 bg-[#2C2C2C] px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-[#F5F5F0] transition-colors hover:bg-[#65745A] dark:bg-[#2A3324] dark:text-[#EAE8E0] dark:hover:bg-[#3E4A35] dark:hover:text-[#EAE8E0] md:w-auto"
            >
              Baca Spesifikasi Lengkap <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>

            {competition.sourceUrl ? (
              <a
                href={competition.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-10 items-center justify-center gap-2 text-center text-[10px] font-semibold text-[#65745A] transition-colors hover:text-[#43543B] dark:text-[#A8B79A] dark:hover:text-[#EAE8E0] md:justify-end md:text-right"
              >
                Kunjungi Situs Resmi Penyelenggara <ArrowRightIcon className="h-3 w-3" />
              </a>
            ) : (
              <span className="flex min-h-10 items-center justify-center text-center text-[10px] text-[#999587] dark:text-[#9CA392] md:justify-end md:text-right">
                Tautan resmi belum ditambahkan
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// ============================================================
// 5. BERANDA / LOBI UTAMA
// ============================================================

export default function Home() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [todayString, setTodayString] = useState<string | null>(null);
  const [expandedCompetitionId, setExpandedCompetitionId] = useState<number | null>(null);

  // Theme dan tanggal hanya dibaca setelah komponen tampil di browser.
  // Ini menghindari penggunaan nilai waktu saat prerender Next.js.
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("jejakarsa-theme");
      const systemPrefersDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)"
      ).matches ?? false;

      const shouldUseDark =
        savedTheme === "dark" ||
        (savedTheme === null && systemPrefersDark);

      setIsDarkMode(shouldUseDark);
      document.documentElement.classList.toggle("dark", shouldUseDark);
    } catch {
      // Jika penyimpanan tidak tersedia, halaman tetap memakai tema terang.
    }

    const now = new Date();
    const localDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    setTodayString(localDate);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);

    try {
      window.localStorage.setItem(
        "jejakarsa-theme",
        nextTheme ? "dark" : "light"
      );
    } catch {
      // Perubahan tema tetap berlaku selama halaman terbuka.
    }
  };

  const handleCompetitionToggle = (id: number) => {
    setExpandedCompetitionId((currentId) => (currentId === id ? null : id));
  };

  // Omnibox mengarahkan pencarian ke halaman katalog.
  // Tidak ada state pencarian atau filter yang mengubah daftar di beranda.
  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") ?? "").trim();

    if (!query) {
      router.push("/katalog");
      return;
    }

    router.push(`/katalog?q=${encodeURIComponent(query)}`);
  };

  const currentYear = todayString ? todayString.slice(0, 4) : "";

  return (
    <div className="min-h-screen bg-[#F2EFE6] font-sans text-[#2C2C2C] transition-colors duration-300 dark:bg-[#161816] dark:text-[#EAE8E0]">
      {/* ======================================================
          NAVBAR
      ====================================================== */}
      <nav className="sticky top-0 z-50 border-b border-[#DCD8CC] bg-[#F2EFE6]/95 backdrop-blur-md dark:border-[#30382D] dark:bg-[#161816]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/" className="flex shrink-0 flex-col" aria-label="Jejakarsa Beranda">
            <span className="font-serif text-[25px] font-bold leading-none tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0]">
              jejakarsa<span className="text-[#65745A]">.</span>
            </span>
            <span className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#858174] dark:text-[#9CA392]">
              Direktori kompetisi mahasiswa
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <Link
              href="/katalog"
              className="text-xs font-semibold text-[#5E5E55] transition-colors hover:text-[#65745A] dark:text-[#9CA392] dark:hover:text-[#A8B79A]"
            >
              Katalog
            </Link>
            <Link
              href="/arsip-juara"
              className="text-xs font-semibold text-[#5E5E55] transition-colors hover:text-[#65745A] dark:text-[#9CA392] dark:hover:text-[#A8B79A]"
            >
              Kisah Juara
            </Link>
            <Link
              href="/tentang"
              className="text-xs font-semibold text-[#5E5E55] transition-colors hover:text-[#65745A] dark:text-[#9CA392] dark:hover:text-[#A8B79A]"
            >
              Tentang
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDarkMode
                  ? "Mode gelap aktif, ganti ke mode terang"
                  : "Mode terang aktif, ganti ke mode gelap"
              }
              title={isDarkMode ? "Mode gelap" : "Mode terang"}
              className="flex h-9 w-9 items-center justify-center border border-[#D2CEC2] text-[#65745A] transition-colors hover:border-[#65745A] hover:bg-[#E8E5DA] dark:border-[#3E4A35] dark:text-[#EAE8E0] dark:hover:border-[#65745A] dark:hover:bg-[#263022]"
            >
              {isDarkMode ? <MoonIcon /> : <SunIcon />}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className="flex h-9 w-9 items-center justify-center border border-[#D2CEC2] text-[#65745A] transition-colors hover:border-[#65745A] hover:bg-[#E8E5DA] dark:border-[#3E4A35] dark:text-[#EAE8E0] dark:hover:border-[#65745A] dark:hover:bg-[#263022] md:hidden"
            >
              <MenuToggleIcon isOpen={isMobileMenuOpen} />
            </button>

            <Link
              href="/bagikan-peluang"
              className="hidden min-h-9 items-center justify-center gap-2 bg-[#2C2C2C] px-3.5 text-[10px] font-bold uppercase tracking-wide text-[#F5F5F0] transition-colors hover:bg-[#65745A] dark:bg-[#2A3324] dark:text-[#EAE8E0] dark:hover:bg-[#3E4A35] dark:hover:text-[#EAE8E0] sm:px-4 md:inline-flex"
            >
              Bagikan Peluang
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div
          id="mobile-navigation"
          role="region"
          aria-label="Menu navigasi mobile"
          aria-hidden={!isMobileMenuOpen}
          className={`overflow-hidden border-b transition-[max-height,opacity,transform,border-color] duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen
              ? "max-h-80 translate-y-0 border-[#E2E0D5] opacity-100 dark:border-[#3E4A35]"
              : "max-h-0 -translate-y-1 border-transparent opacity-0 pointer-events-none"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 bg-[#F5F5F0] px-5 py-3 dark:bg-[#161816] sm:px-8">
            <Link
              href="/katalog"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className="flex min-h-11 items-center px-3 text-sm font-semibold text-[#3F4038] transition-colors hover:bg-[#EAE8DE] dark:text-[#EAE8E0] dark:hover:bg-[#263022]"
            >
              Katalog
            </Link>
            <Link
              href="/arsip-juara"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className="flex min-h-11 items-center px-3 text-sm font-semibold text-[#3F4038] transition-colors hover:bg-[#EAE8DE] dark:text-[#EAE8E0] dark:hover:bg-[#263022]"
            >
              Kisah Juara
            </Link>
            <Link
              href="/tentang"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className="flex min-h-11 items-center px-3 text-sm font-semibold text-[#3F4038] transition-colors hover:bg-[#EAE8DE] dark:text-[#EAE8E0] dark:hover:bg-[#263022]"
            >
              Tentang
            </Link>
            <Link
              href="/bagikan-peluang"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 bg-[#2C2C2C] px-4 text-[10px] font-bold uppercase tracking-wide text-[#F5F5F0] transition-colors hover:bg-[#65745A] dark:bg-[#2A3324] dark:text-[#EAE8E0] dark:hover:bg-[#3E4A35] dark:hover:text-[#EAE8E0]"
            >
              Bagikan Peluang
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        {/* HERO */}
        <section className="border-b border-[#DCD8CC] py-12 dark:border-[#30382D] sm:py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h1 className="max-w-3xl font-serif text-[2.8rem] font-medium leading-[0.99] tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0] sm:text-6xl md:text-[4.25rem]">
              Temukan kompetisi.
              <br />
              <span className="italic text-[#65745A] dark:text-[#A8B79A]">
                Siapkan langkahmu.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-[#6F6D62] dark:text-[#9CA392] sm:text-[15px] sm:leading-7">
              Cari informasi lomba mahasiswa dari berbagai bidang dan
              penyelenggara. Periksa persyaratan, biaya, serta tenggat sebelum
              menentukan pilihan.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              role="search"
              className="mt-6 flex max-w-2xl items-center border border-[#BDB9AC] bg-[#FAF9F5] p-1 transition-colors focus-within:border-[#65745A] focus-within:ring-1 focus-within:ring-[#65745A] dark:border-[#3E4A35] dark:bg-[#1D241B]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <SearchIcon className="h-[18px] w-[18px] shrink-0 text-[#898679] dark:text-[#9CA392]" />
                <input
                  type="search"
                  name="q"
                  placeholder="Cari lomba, bidang, atau penyelenggara..."
                  aria-label="Cari lomba di katalog"
                  className="min-w-0 flex-1 border-none bg-transparent py-3 text-sm text-[#2C2C2C] outline-none placeholder:text-[#969184] focus:ring-0 dark:text-[#EAE8E0] dark:placeholder:text-[#9CA392]"
                />
              </div>
              <button
                type="submit"
                className="flex h-11 w-12 shrink-0 items-center justify-center bg-[#65745A] text-white transition-colors hover:bg-[#526249] dark:bg-[#2A3324] dark:text-[#EAE8E0] dark:hover:bg-[#3E4A35]"
                aria-label="Cari di katalog"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </form>

          </div>
        </section>

        {/* ====================================================
            CURATED TEASER / T-MINUS
        ==================================================== */}
        <section className="pt-10 sm:pt-12">
          <div className="mb-5 border-b border-[#DCD8CC] pb-4 dark:border-[#30382D]">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0] sm:text-[2.1rem]">
              Sorotan Lomba
            </h2>
          </div>

          {/* Header tabel desktop */}
          <div className="hidden grid-cols-[180px_minmax(0,1fr)_245px_22px] gap-5 border-b border-[#CFCBBC] px-5 pb-2 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#8B887C] dark:border-[#3E4A35] dark:text-[#9CA392] md:grid">
            <span>Bidang / Penyelenggara</span>
            <span>Kompetisi / Kualifikasi</span>
            <span className="text-right">Daftar / Acara / Biaya</span>
            <span />
          </div>

          <div className="border-t border-[#DCD8CC] dark:border-[#30382D]">
            {featuredCompetitions.map((competition) => (
              <CompetitionRow
                key={competition.id}
                competition={competition}
                todayString={todayString}
                isExpanded={expandedCompetitionId === competition.id}
                onToggle={handleCompetitionToggle}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-2 border-b border-[#DCD8CC] pb-6 dark:border-[#30382D]">
            <Link
              href="/katalog"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#2C2C2C] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#F5F5F0] transition-colors hover:bg-[#65745A] dark:bg-[#2A3324] dark:text-[#EAE8E0] dark:hover:bg-[#3E4A35] dark:hover:text-[#EAE8E0] sm:w-auto"
            >
              Buka Indeks Katalog Penuh
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* KISAH JUARA */}
        <section className="pt-10 sm:pt-12" id="kisah-juara">
          <div className="mb-5 border-b border-[#DCD8CC] pb-3 dark:border-[#30382D]">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0] sm:text-[2.1rem]">
              Kisah Juara
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <article className="flex min-h-[190px] flex-col justify-between border border-[#D8D3C6] bg-[#EAE7DC] p-5 dark:border-[#3E4A35] dark:bg-[#1D241B] sm:p-7">
              <blockquote className="font-serif text-xl leading-relaxed text-[#34362F] dark:text-[#EAE8E0] sm:text-2xl">
                “Persiapan yang baik dimulai dari pembagian tugas yang jelas dan
                target yang realistis.”
              </blockquote>
              <p className="mt-6 border-t border-[#D2CDBF] pt-3 text-xs font-semibold text-[#65745A] dark:border-[#3E4A35] dark:text-[#A8B79A]">
                Dian · Gold Medal International Competition 2025
              </p>
            </article>

            <article className="flex min-h-[190px] flex-col justify-between border border-[#D8D3C6] bg-[#F8F7F1] p-5 dark:border-[#3E4A35] dark:bg-[#1A1D19] sm:p-7">
              <blockquote className="font-serif text-xl leading-relaxed text-[#34362F] dark:text-[#EAE8E0] sm:text-2xl">
                “2-3 Kucing Berlari, Haa nak makan lagi.”
              </blockquote>
              <p className="mt-6 border-t border-[#E1DDD2] pt-3 text-xs font-semibold text-[#65745A] dark:border-[#3E4A35] dark:text-[#A8B79A]">
                Luqman · Juara 2 Pantun Jarjit 2025
              </p>
            </article>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-0 border-t border-[#DCD8CC] bg-[#EAE7DC] dark:border-[#30382D] dark:bg-[#1A1D19]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-6 sm:px-8 md:flex-row md:items-center">
          <div>
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0]"
            >
              jejakarsa<span className="text-[#65745A]">.</span>
            </Link>
            <p className="mt-1 text-[10px] text-[#858174] dark:text-[#9CA392]">
              Direktori lomba dan kompetisi mahasiswa Indonesia.
            </p>
          </div>

          <div className="font-mono text-[9px] text-[#858174] dark:text-[#9CA392] md:text-right">
            {currentYear ? `© ${currentYear} ` : "© "}Jejakarsa
          </div>
        </div>
      </footer>

    </div>
  );
}
