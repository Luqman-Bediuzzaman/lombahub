
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Competition = {
  id: number;
  title: string;
  organizer: string;
  category: string;
  level: string;
  format: string;
  fee: number;
  deadline: string;
  eligibility: string;
  summary: string;
  posterUrl: string | null;
  sourceUrl: string | null;
  isVerified: boolean;
  featured: boolean;
};

// ============================================================
// 1. DATA DEMO
// Ganti data ini dengan data kompetisi yang sudah diperiksa.
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
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi pengembangan solusi teknologi untuk mahasiswa. Periksa panduan resmi untuk mengetahui bidang dan persyaratan pendaftaran.",
    posterUrl: null,
    sourceUrl: null,
    isVerified: false,
    featured: true,
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
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi penyusunan rencana bisnis untuk mengembangkan ide dan model usaha.",
    posterUrl: null,
    sourceUrl: null,
    isVerified: false,
    featured: false,
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
    eligibility: "Mahasiswa dan umum",
    summary:
      "Kompetisi desain antarmuka dan pengalaman pengguna dalam pengembangan produk digital.",
    posterUrl: null,
    sourceUrl: null,
    isVerified: false,
    featured: false,
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
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi penulisan esai dengan tema dan ketentuan sesuai panduan penyelenggara.",
    posterUrl: null,
    sourceUrl: null,
    isVerified: false,
    featured: false,
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
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi bidang sains dan penerapan teknologi bagi mahasiswa perguruan tinggi.",
    posterUrl: null,
    sourceUrl: null,
    isVerified: false,
    featured: false,
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
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi debat bahasa Inggris untuk menguji kemampuan argumentasi dan komunikasi peserta.",
    posterUrl: null,
    sourceUrl: null,
    isVerified: false,
    featured: false,
  },
];

const categories = [
  "Semua",
  "Teknologi",
  "Bisnis",
  "Desain",
  "Karya Tulis",
  "Sains",
  "Bahasa",
];

// ============================================================
// 2. FUNGSI BANTU
// ============================================================

function formatCurrency(amount: number) {
  if (amount === 0) return "Gratis";

  return `Rp${new Intl.NumberFormat("id-ID").format(amount)}`;
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${day} ${monthNames[month - 1]} ${year}`;
}

function getDaysLeft(dateString: string, todayString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = todayString
    .split("-")
    .map(Number);

  const deadline = Date.UTC(year, month - 1, day);
  const today = Date.UTC(todayYear, todayMonth - 1, todayDay);

  return Math.round((deadline - today) / 86400000);
}

function getDeadlineLabel(dateString: string, todayString: string | null) {
  if (!todayString) return formatDate(dateString);

  const days = getDaysLeft(dateString, todayString);

  if (days < 0) return "Pendaftaran ditutup";
  if (days === 0) return "Tenggat hari ini";
  if (days === 1) return "1 hari lagi";

  return `${days} hari lagi`;
}

// ============================================================
// 3. IKON
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

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
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
// 4. POSTER KOMPETISI
// ============================================================

function CompetitionPoster({
  competition,
  featured = false,
}: {
  competition: Competition;
  featured?: boolean;
}) {
  if (competition.posterUrl) {
    return (
      <img
        src={competition.posterUrl}
        alt={`Poster ${competition.title}`}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      className={`relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden bg-[#E7E3D7] p-5 text-[#30382D] dark:bg-[#303A30] dark:text-[#F0EDE2] ${
        featured ? "md:min-h-[350px]" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-widest opacity-60">
          JEJAKARSA
        </span>

        <span className="font-mono text-[10px] opacity-60">
          {String(competition.id).padStart(3, "0")}
        </span>
      </div>

      <div className="relative z-10">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest opacity-60">
          {competition.category}
        </p>

        <h3
          className={`max-w-sm font-serif font-medium leading-tight ${
            featured ? "text-4xl md:text-5xl" : "text-3xl"
          }`}
        >
          {competition.category}
        </h3>

        <div className="mt-4 h-px w-10 bg-current opacity-40" />

        <p className="mt-3 font-mono text-[9px] uppercase tracking-wider opacity-60">
          Poster belum tersedia
        </p>
      </div>

      <div className="pointer-events-none absolute -bottom-12 -right-3 font-serif text-[150px] leading-none opacity-[0.05]">
        {competition.category.charAt(0)}
      </div>
    </div>
  );
}

// ============================================================
// 5. KARTU KOMPETISI
// ============================================================

function OpportunityCard({
  competition,
  todayString,
}: {
  competition: Competition;
  todayString: string | null;
}) {
  const daysLeft = todayString
    ? getDaysLeft(competition.deadline, todayString)
    : null;

  return (
    <article className="group grid grid-cols-1 overflow-hidden border border-[#DCD8CC] bg-[#FAF9F5] transition-colors hover:border-[#76816C] dark:border-[#3A4137] dark:bg-[#242B24] dark:hover:border-[#849475] sm:grid-cols-[116px_1fr]">

      {/* Poster */}

      <div className="h-36 overflow-hidden sm:h-full">
        <CompetitionPoster competition={competition} />
      </div>

      {/* Informasi kompetisi */}

      <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#65745A] dark:text-[#A1B395]">
              {competition.category}
            </span>

            <span className="text-[#AAA496]">/</span>

            <span className="text-xs text-[#777568] dark:text-[#AAA99B]">
              {competition.organizer}
            </span>

            {competition.isVerified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#65745A] dark:text-[#A1B395]">
                <CheckIcon />
                Sumber diperiksa
              </span>
            )}
          </div>

          <h3 className="font-serif text-xl font-semibold leading-tight text-[#292D26] transition-colors group-hover:text-[#65745A] dark:text-[#F0EDE2] dark:group-hover:text-[#A8B89A]">
            {competition.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#777568] dark:text-[#B4B3A7]">
            {competition.summary}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E5DC] pt-3 dark:border-[#3B4238]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono text-[10px] text-[#68685D] dark:text-[#B8B7AA]">
              {formatCurrency(competition.fee)}
            </span>

            <span className="font-mono text-[10px] text-[#68685D] dark:text-[#B8B7AA]">
              {competition.format}
            </span>

            <span className="font-mono text-[10px] text-[#68685D] dark:text-[#B8B7AA]">
              {competition.level}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <CalendarIcon />

            <span
              className={`font-mono font-bold ${
                daysLeft === null || daysLeft < 0
                  ? "text-[#929083]"
                  : daysLeft <= 3
                    ? "text-[#A7654B] dark:text-[#D09070]"
                    : "text-[#65745A] dark:text-[#A1B395]"
              }`}
            >
              {getDeadlineLabel(competition.deadline, todayString)}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-[#979385] dark:text-[#85877D]">
            {competition.isVerified
              ? "Informasi telah diperiksa"
              : "Belum diverifikasi"}
          </span>

          {competition.sourceUrl ? (
            <a
              href={competition.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#65745A] hover:underline dark:text-[#A1B395]"
            >
              Lihat sumber <ArrowIcon />
            </a>
          ) : (
            <span className="text-[10px] text-[#A09C90]">
              Sumber belum tersedia
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ============================================================
// 6. HALAMAN UTAMA
// ============================================================

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [feeFilter, setFeeFilter] = useState("Semua");
  const [deadlineFilter, setDeadlineFilter] = useState(false);
  const [sortBy, setSortBy] = useState("deadline");
  const [visibleCount, setVisibleCount] = useState(6);
  const [todayString, setTodayString] = useState<string | null>(null);

  // ----------------------------------------------------------
  // TANGGAL HARI INI
  // Dibaca setelah komponen dipasang di browser agar aman untuk
  // prerendering Next.js.
  // ----------------------------------------------------------

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    setTodayString(`${year}-${month}-${day}`);
  }, []);

  // ----------------------------------------------------------
  // TEMA
  // ----------------------------------------------------------

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("jejakarsa-theme");

      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const shouldUseDark =
        savedTheme === "dark" ||
        (savedTheme === null && prefersDark);

      setIsDarkMode(shouldUseDark);

      document.documentElement.classList.toggle(
        "dark",
        shouldUseDark
      );
    } catch {
      // Gunakan tema terang jika penyimpanan tidak tersedia.
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;

    setIsDarkMode(nextTheme);

    document.documentElement.classList.toggle(
      "dark",
      nextTheme
    );

    try {
      localStorage.setItem(
        "jejakarsa-theme",
        nextTheme ? "dark" : "light"
      );
    } catch {
      // Perubahan tema tetap berlaku selama halaman terbuka.
    }
  };

  // ----------------------------------------------------------
  // PENCARIAN DAN FILTER
  // ----------------------------------------------------------

  const filteredCompetitions = useMemo(() => {
    let result = [...competitions];

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((item) => {
        const searchableText = [
          item.title,
          item.organizer,
          item.category,
          item.level,
          item.format,
          item.eligibility,
          item.summary,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    if (selectedCategory !== "Semua") {
      result = result.filter(
        (item) => item.category === selectedCategory
      );
    }

    if (feeFilter === "Gratis") {
      result = result.filter((item) => item.fee === 0);
    }

    if (feeFilter === "Berbayar") {
      result = result.filter((item) => item.fee > 0);
    }

    if (deadlineFilter && todayString) {
      result = result.filter((item) => {
        const daysLeft = getDaysLeft(item.deadline, todayString);
        return daysLeft >= 0 && daysLeft <= 7;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "deadline") {
        return a.deadline.localeCompare(b.deadline);
      }

      if (sortBy === "deadline-desc") {
        return b.deadline.localeCompare(a.deadline);
      }

      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

    return result;
  }, [
    searchQuery,
    selectedCategory,
    feeFilter,
    deadlineFilter,
    sortBy,
    todayString,
  ]);

  useEffect(() => {
    setVisibleCount(6);
  }, [
    searchQuery,
    selectedCategory,
    feeFilter,
    deadlineFilter,
    sortBy,
  ]);

  const featuredCompetition = competitions.find(
    (item) => item.featured
  );

  const displayedCompetitions = filteredCompetitions.slice(
    0,
    visibleCount
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    setFeeFilter("Semua");
    setDeadlineFilter(false);
    setSortBy("deadline");
  };

  // ----------------------------------------------------------
  // TAMPILAN
  // ----------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F2EFE6] font-sans text-[#292D26] transition-colors duration-300 dark:bg-[#202820] dark:text-[#F0EDE2]">

      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b border-[#DEDACF] bg-[#F2EFE6]/95 backdrop-blur-sm dark:border-[#3C4439] dark:bg-[#202820]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <Link href="/" className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#293027] dark:text-[#F0EDE2]">
              jejakarsa<span className="text-[#718267]">.</span>
            </span>

            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#898577] dark:text-[#A4A596]">
              Direktori lomba mahasiswa
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#katalog"
              className="text-xs font-semibold text-[#68685D] transition-colors hover:text-[#65745A] dark:text-[#B8B7AA] dark:hover:text-white"
            >
              Daftar Lomba
            </Link>

            <Link
              href="#arsip"
              className="text-xs font-semibold text-[#68685D] transition-colors hover:text-[#65745A] dark:text-[#B8B7AA] dark:hover:text-white"
            >
              Cerita Peserta
            </Link>

            <Link
              href="#tentang"
              className="text-xs font-semibold text-[#68685D] transition-colors hover:text-[#65745A] dark:text-[#B8B7AA] dark:hover:text-white"
            >
              Tentang
            </Link>
          </div>

          <div className="flex items-center gap-3">

            {/* 
              IKON MENUNJUKKAN TEMA YANG SEDANG AKTIF:
              - Matahari = Light Mode
              - Bulan = Dark Mode
            */}

            <button
              onClick={toggleTheme}
              type="button"
              aria-label={
                isDarkMode
                  ? "Mode gelap aktif, ganti ke mode terang"
                  : "Mode terang aktif, ganti ke mode gelap"
              }
              title={
                isDarkMode
                  ? "Ganti ke mode terang"
                  : "Ganti ke mode gelap"
              }
              className="flex h-9 w-9 items-center justify-center border border-[#DCD8CC] text-[#65745A] transition-colors hover:bg-[#E7E3D7] dark:border-[#434A40] dark:text-[#F0EDE2] dark:hover:bg-[#303A30]"
            >
              {isDarkMode ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">

        {/* HERO */}

        <section className="grid grid-cols-1 gap-10 border-b border-[#DCD8CC] py-16 dark:border-[#3C4439] md:grid-cols-[1.5fr_0.7fr] md:items-end md:py-24">

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#718267]" />

              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#718267] dark:text-[#A1B395]">
                Referensi kompetisi mahasiswa
              </span>
            </div>

            <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[0.98] tracking-tight text-[#292D26] dark:text-[#F0EDE2] sm:text-6xl md:text-7xl">
              Temukan kompetisi.
              <br />
              <span className="italic text-[#718267] dark:text-[#A1B395]">
                Siapkan langkahmu.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-[#747265] dark:text-[#B9B8AB] sm:text-base">
              Setiap kompetisi meninggalkan jejak, pahami persyaratannya,
              dan temukan langkah yang tepat untukmu.
            </p>

            {/* SEARCH */}

            <form
              onSubmit={(event) => event.preventDefault()}
              className="mt-9 flex max-w-2xl items-center border border-[#CFCBBC] bg-[#FAF9F5] p-1 transition-colors focus-within:border-[#718267] dark:border-[#4A5147] dark:bg-[#293229]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <SearchIcon className="h-5 w-5 shrink-0 text-[#8C897D]" />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Cari nama lomba, bidang, atau penyelenggara..."
                  className="w-full min-w-0 border-none bg-transparent py-3 text-sm text-[#292D26] outline-none placeholder:text-[#A7A294] focus:ring-0 dark:text-[#F0EDE2] dark:placeholder:text-[#85877D]"
                  aria-label="Cari lomba"
                />
              </div>

              <button
                type="submit"
                className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#65745A] text-white transition-colors hover:bg-[#526249]"
                aria-label="Cari lomba"
              >
                <SearchIcon />
              </button>
            </form>

            {/* QUICK FILTER */}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[9px] uppercase tracking-widest text-[#969183]">
                Filter cepat:
              </span>

              <button
                type="button"
                onClick={() => {
                  setFeeFilter("Semua");
                  setDeadlineFilter(false);
                }}
                className={`border px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  feeFilter === "Semua" && !deadlineFilter
                    ? "border-[#65745A] bg-[#65745A] text-white"
                    : "border-[#D8D4C9] text-[#68685D] hover:border-[#65745A] dark:border-[#454D43] dark:text-[#C0BFB2]"
                }`}
              >
                Semua lomba
              </button>

              <button
                type="button"
                onClick={() => {
                  setFeeFilter("Gratis");
                  setDeadlineFilter(false);
                }}
                className={`border px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  feeFilter === "Gratis"
                    ? "border-[#65745A] bg-[#65745A] text-white"
                    : "border-[#D8D4C9] text-[#68685D] hover:border-[#65745A] dark:border-[#454D43] dark:text-[#C0BFB2]"
                }`}
              >
                Gratis
              </button>

              <button
                type="button"
                onClick={() => {
                  setFeeFilter("Semua");
                  setDeadlineFilter(!deadlineFilter);
                }}
                className={`border px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  deadlineFilter
                    ? "border-[#65745A] bg-[#65745A] text-white"
                    : "border-[#D8D4C9] text-[#68685D] hover:border-[#65745A] dark:border-[#454D43] dark:text-[#C0BFB2]"
                }`}
              >
                Segera ditutup
              </button>
            </div>
          </div>

          {/* INFORMASI SAMPING */}

          <aside className="border-l border-[#DCD8CC] pl-6 dark:border-[#3C4439]">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#918C7D] dark:text-[#A4A596]">
              Sebelum mendaftar
            </span>

            <h2 className="mt-4 font-serif text-2xl font-medium leading-tight text-[#353B31] dark:text-[#F0EDE2]">
              Sesuaikan lomba dengan kemampuan dan waktumu.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#777568] dark:text-[#B9B8AB]">
              Periksa persyaratan, biaya, tenggat, dan kebutuhan
              tim sebelum memutuskan untuk ikut.
            </p>

            <Link
              href="#tentang"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#65745A] transition-colors hover:text-[#3E5135] dark:text-[#A1B395] dark:hover:text-white"
            >
              Tentang Jejakarsa <ArrowIcon />
            </Link>
          </aside>
        </section>

        {/* LOMBA PILIHAN */}

        {featuredCompetition && (
          <section className="pt-16">
            <div className="mb-6 flex items-end justify-between border-b-2 border-[#30382D] pb-3 dark:border-[#A1A995]">
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#718267] dark:text-[#A1B395]">
                  PILIHAN / 01
                </span>

                <h2 className="mt-1 font-serif text-3xl font-medium text-[#292D26] dark:text-[#F0EDE2]">
                  Lomba pilihan
                </h2>
              </div>

              <span className="hidden font-mono text-[9px] uppercase tracking-wider text-[#969183] sm:block">
                Kompetisi yang ditampilkan
              </span>
            </div>

            <article className="grid grid-cols-1 overflow-hidden border border-[#DCD8CC] bg-[#FAF9F5] dark:border-[#41483D] dark:bg-[#252D25] md:grid-cols-[0.85fr_1.15fr]">

              <div className="min-h-[250px] md:min-h-[370px]">
                <CompetitionPoster
                  competition={featuredCompetition}
                  featured
                />
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-9">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-[#C9D0BF] px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-[#65745A] dark:border-[#586750] dark:text-[#B3C1A6]">
                      {featuredCompetition.level}
                    </span>

                    <span className="border border-[#DEDACF] px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-[#777568] dark:border-[#454D43] dark:text-[#B8B7AA]">
                      {featuredCompetition.format}
                    </span>

                    {!featuredCompetition.isVerified && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#A7654B] dark:text-[#D09070]">
                        Belum diverifikasi
                      </span>
                    )}
                  </div>

                  <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-[#8C897D] dark:text-[#A4A596]">
                    {featuredCompetition.organizer}
                  </p>

                  <h3 className="mt-3 max-w-xl font-serif text-3xl font-semibold leading-tight tracking-tight text-[#292D26] dark:text-[#F0EDE2] sm:text-4xl">
                    {featuredCompetition.title}
                  </h3>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-[#777568] dark:text-[#B8B7AA]">
                    {featuredCompetition.summary}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 border-y border-[#E4E0D6] dark:border-[#41483D]">
                  <div className="py-4 pr-4">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#929083]">
                      Biaya pendaftaran
                    </span>

                    <p className="mt-2 font-mono text-lg font-bold text-[#65745A] dark:text-[#A1B395]">
                      {formatCurrency(featuredCompetition.fee)}
                    </p>
                  </div>

                  <div className="border-l border-[#E4E0D6] py-4 pl-5 dark:border-[#41483D]">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#929083]">
                      Batas pendaftaran
                    </span>

                    <p className="mt-2 font-mono text-base font-bold text-[#292D26] dark:text-[#F0EDE2] sm:text-lg">
                      {formatDate(featuredCompetition.deadline)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] leading-relaxed text-[#928E82] dark:text-[#97988B]">
                    {featuredCompetition.sourceUrl
                      ? "Tautan sumber tersedia."
                      : "Tautan sumber belum tersedia."}
                  </span>

                  <Link
                    href="#katalog"
                    className="inline-flex items-center gap-2 bg-[#65745A] px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#526249]"
                  >
                    Lihat daftar lomba <ArrowIcon />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* DAFTAR LOMBA */}

        <section id="katalog" className="scroll-mt-24 pt-20">

          <div className="flex flex-col justify-between gap-5 border-b-2 border-[#30382D] pb-4 dark:border-[#A1A995] sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#718267] dark:text-[#A1B395]">
                KATALOG / 02
              </span>

              <h2 className="mt-2 font-serif text-3xl font-medium text-[#292D26] dark:text-[#F0EDE2] sm:text-4xl">
                Daftar lomba
              </h2>

              <p className="mt-2 text-sm text-[#777568] dark:text-[#B8B7AA]">
                Cari kompetisi sesuai bidang dan ketentuanmu.
              </p>
            </div>

            <span className="font-mono text-[10px] text-[#898577]">
              {filteredCompetitions.length} lomba ditemukan
            </span>
          </div>

          {/* FILTER */}

          <div className="flex flex-col gap-5 border-b border-[#DCD8CC] py-5 dark:border-[#3C4439]">

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-[9px] font-bold uppercase tracking-widest text-[#969183]">
                Bidang
              </span>

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`border px-3 py-1.5 text-[10px] font-medium transition-colors ${
                    selectedCategory === category
                      ? "border-[#65745A] bg-[#65745A] text-white"
                      : "border-[#DCD8CC] text-[#68685D] hover:border-[#65745A] dark:border-[#454D43] dark:text-[#B8B7AA] dark:hover:border-[#849475]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-2 font-mono text-[9px] font-bold uppercase tracking-widest text-[#969183]">
                  Biaya
                </span>

                {["Semua", "Gratis", "Berbayar"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setFeeFilter(filter)}
                    className={`px-2 py-1 text-[10px] transition-colors ${
                      feeFilter === filter
                        ? "font-bold text-[#65745A] underline underline-offset-4 dark:text-[#A1B395]"
                        : "text-[#898577] hover:text-[#65745A] dark:text-[#A6A597]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}

                <span className="mx-2 h-4 w-px bg-[#DCD8CC] dark:bg-[#454D43]" />

                <button
                  type="button"
                  onClick={() => setDeadlineFilter(!deadlineFilter)}
                  className={`px-2 py-1 text-[10px] transition-colors ${
                    deadlineFilter
                      ? "font-bold text-[#65745A] underline underline-offset-4 dark:text-[#A1B395]"
                      : "text-[#898577] hover:text-[#65745A] dark:text-[#A6A597]"
                  }`}
                >
                  Segera ditutup
                </button>

                {(searchQuery ||
                  selectedCategory !== "Semua" ||
                  feeFilter !== "Semua" ||
                  deadlineFilter) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="ml-2 text-[10px] text-[#A7654B] hover:underline dark:text-[#D09070]"
                  >
                    Hapus filter
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="sort-competitions"
                  className="font-mono text-[9px] uppercase tracking-widest text-[#969183]"
                >
                  Urutkan
                </label>

                <select
                  id="sort-competitions"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="max-w-[190px] border border-[#DCD8CC] bg-[#FAF9F5] px-3 py-2 text-xs text-[#68685D] outline-none focus:border-[#65745A] dark:border-[#454D43] dark:bg-[#293229] dark:text-[#D6D3C7]"
                >
                  <option value="deadline">Tenggat terdekat</option>
                  <option value="deadline-desc">Tenggat terjauh</option>
                  <option value="name">Nama lomba</option>
                </select>
              </div>
            </div>
          </div>

          {/* HASIL PENCARIAN */}

          <div className="mt-5 flex flex-col gap-3">
            {displayedCompetitions.length > 0 ? (
              displayedCompetitions.map((competition) => (
                <OpportunityCard
                  key={competition.id}
                  competition={competition}
                  todayString={todayString}
                />
              ))
            ) : (
              <div className="border border-dashed border-[#CFCBBC] px-5 py-16 text-center dark:border-[#454D43]">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#929083]">
                  HASIL PENCARIAN
                </span>

                <h3 className="mt-4 font-serif text-2xl text-[#353B31] dark:text-[#F0EDE2]">
                  Lomba belum ditemukan.
                </h3>

                <p className="mt-2 text-sm text-[#898577] dark:text-[#A6A597]">
                  Coba kata kunci atau bidang yang berbeda.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 border border-[#65745A] px-5 py-2.5 text-xs font-bold text-[#65745A] transition-colors hover:bg-[#65745A] hover:text-white dark:text-[#A1B395]"
                >
                  Hapus pencarian
                </button>
              </div>
            )}
          </div>

          {/* MUAT LEBIH BANYAK */}

          {filteredCompetitions.length > visibleCount && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 6)}
                className="border border-[#CFCBBC] px-7 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#68685D] transition-colors hover:border-[#65745A] hover:bg-[#65745A] hover:text-white dark:border-[#454D43] dark:text-[#C0BFB2] dark:hover:border-[#65745A]"
              >
                Tampilkan lebih banyak
              </button>
            </div>
          )}
        </section>

        {/* ARSIP PENGALAMAN */}

        <section id="arsip" className="scroll-mt-24 pt-20">
          <div className="grid grid-cols-1 gap-8 border-t border-[#DCD8CC] pt-8 dark:border-[#3C4439] md:grid-cols-[1fr_1fr]">

            <div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#718267] dark:text-[#A1B395]">
                PENGALAMAN PESERTA / 03
              </span>

              <h2 className="mt-4 max-w-md font-serif text-4xl font-medium leading-tight text-[#292D26] dark:text-[#F0EDE2]">
                Belajar dari pengalaman peserta lain.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#777568] dark:text-[#B8B7AA]">
                Pengalaman mengikuti lomba bisa menjadi bahan
                pertimbangan bagi peserta berikutnya. Bagian ini
                nantinya memuat cerita, proses persiapan, dan
                pengalaman para pemenang.
              </p>
            </div>

            <div className="flex min-h-[240px] flex-col justify-between border border-[#DCD8CC] bg-[#EAE7DC] p-6 dark:border-[#454D43] dark:bg-[#293229] sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#718267] dark:text-[#A1B395]">
                  ARSIP PENGALAMAN
                </span>

                <span className="border border-[#C7C2B5] px-2 py-1 font-mono text-[9px] text-[#858174] dark:border-[#596252] dark:text-[#AFB4A5]">
                  Segera hadir
                </span>
              </div>

              <div>
                <h3 className="font-serif text-3xl text-[#30382D] dark:text-[#F0EDE2]">
                  Cerita peserta.
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-[#777568] dark:text-[#B8B7AA]">
                  Kami sedang menyiapkan bagian ini. Informasi
                  pengalaman peserta akan ditampilkan setelah
                  dikumpulkan dan diperiksa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TENTANG JEJAKARSA */}

        <section
          id="tentang"
          className="scroll-mt-24 pt-20"
        >
          <div className="border-t-2 border-[#30382D] pt-7 dark:border-[#A1A995]">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#718267] dark:text-[#A1B395]">
              TENTANG JEJAKARSA / 04
            </span>

            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-medium text-[#292D26] dark:text-[#F0EDE2]">
              Membantu mahasiswa menemukan lomba yang sesuai.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#777568] dark:text-[#B8B7AA]">
              Jejakarsa merupakan direktori kompetisi mahasiswa
              yang mengumpulkan informasi lomba dari berbagai
              penyelenggara. Informasi disusun agar lebih mudah
              dicari dan dibandingkan sebelum mahasiswa mendaftar.
            </p>

            <div className="mt-9 grid grid-cols-1 gap-6 border-t border-[#DCD8CC] pt-6 dark:border-[#3C4439] sm:grid-cols-2 lg:grid-cols-4">

              <div>
                <span className="font-mono text-[10px] text-[#718267] dark:text-[#A1B395]">
                  01 / SUMBER
                </span>

                <h3 className="mt-3 font-serif text-xl text-[#30382D] dark:text-[#F0EDE2]">
                  Sumber informasi
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#898577] dark:text-[#AAA99B]">
                  Tautan penyelenggara atau dokumen resmi dicantumkan
                  bila tersedia.
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#718267] dark:text-[#A1B395]">
                  02 / PERSYARATAN
                </span>

                <h3 className="mt-3 font-serif text-xl text-[#30382D] dark:text-[#F0EDE2]">
                  Ketentuan peserta
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#898577] dark:text-[#AAA99B]">
                  Periksa jenjang pendidikan, bidang, dan ketentuan
                  peserta sebelum mendaftar.
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#718267] dark:text-[#A1B395]">
                  03 / BIAYA
                </span>

                <h3 className="mt-3 font-serif text-xl text-[#30382D] dark:text-[#F0EDE2]">
                  Biaya pendaftaran
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#898577] dark:text-[#AAA99B]">
                  Informasi biaya dibedakan antara lomba gratis
                  dan lomba berbayar.
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#718267] dark:text-[#A1B395]">
                  04 / TENGGAT
                </span>

                <h3 className="mt-3 font-serif text-xl text-[#30382D] dark:text-[#F0EDE2]">
                  Jadwal pendaftaran
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#898577] dark:text-[#AAA99B]">
                  Tanggal pendaftaran perlu diperiksa dan diperbarui
                  sesuai informasi penyelenggara.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer className="mt-20 border-t border-[#DCD8CC] bg-[#EAE7DC] dark:border-[#3C4439] dark:bg-[#1B221C]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-end">

          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-[#30382D] dark:text-[#F0EDE2]"
            >
              jejakarsa<span className="text-[#718267]">.</span>
            </Link>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#858174] dark:text-[#A4A596]">
              Direktori lomba dan kompetisi untuk mahasiswa Indonesia.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#929083]">
              JEJAKARSA
            </span>

            <span className="text-[10px] text-[#929083]">
              © {todayString ? todayString.slice(0, 4) : "2026"} Jejakarsa.
            </span>
          </div>
        </div>
      </footer>

      {/* PEMBERITAHUAN DATA DEMO */}

      <div className="border-t border-[#DCD8CC] bg-[#F2EFE6] px-5 py-3 text-center dark:border-[#3C4439] dark:bg-[#202820]">
        <p className="font-mono text-[9px] uppercase tracking-wider text-[#A7654B] dark:text-[#D09070]">
          Versi demonstrasi — data lomba belum diverifikasi.
        </p>
      </div>
    </div>
  );
}
