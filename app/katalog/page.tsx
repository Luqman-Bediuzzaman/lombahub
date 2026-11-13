"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { BRAND_DESCRIPTOR, JEJAKARSA_STYLES, VerificationStatus } from "../design-system";

// ============================================================
// TYPES
// ============================================================

type Competition = {
  id: number;
  title: string;
  organizer: string;
  category: string;
  level: "Lokal" | "Regional" | "Nasional" | "Internasional";
  format: string;
  fee: number;
  deadline: string;
  eventStartDate: string | null;
  eventEndDate: string | null;
  eligibility: string;
  summary: string;
  posterUrl: string | null;
  isVerified: boolean;
};

type ViewMode = "grid" | "list";
type FeeFilter = "gratis" | "berbayar";
type StatusFilter = "dibuka" | "segera-ditutup" | "ditutup";

// ============================================================
// SAMPLE DATA
// Ganti data contoh ini dengan data dari database/API katalog.
// posterUrl diisi URL poster resmi ketika asetnya tersedia.
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
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi pengembangan solusi teknologi untuk mahasiswa. Periksa panduan resmi untuk mengetahui bidang dan persyaratan pendaftaran.",
    posterUrl: null,
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
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi penyusunan rencana bisnis untuk mengembangkan ide dan model usaha.",
    posterUrl: null,
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
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa dan umum",
    summary:
      "Kompetisi desain antarmuka dan pengalaman pengguna dalam pengembangan produk digital.",
    posterUrl: null,
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
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi penulisan esai dengan tema dan ketentuan sesuai panduan penyelenggara.",
    posterUrl: null,
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
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi bidang sains dan penerapan teknologi bagi mahasiswa perguruan tinggi.",
    posterUrl: null,
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
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi debat bahasa Inggris untuk menguji kemampuan argumentasi dan komunikasi peserta.",
    posterUrl: null,
    isVerified: false,
  },
  {
    id: 7,
    title: "Kompetisi Inovasi Mahasiswa Kalimantan",
    organizer: "Forum Inovasi Daerah",
    category: "Teknologi",
    level: "Regional",
    format: "Tim",
    fee: 25000,
    deadline: "2026-12-08",
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa wilayah Kalimantan",
    summary:
      "Kompetisi regional untuk solusi inovasi yang menjawab kebutuhan masyarakat dan lingkungan.",
    posterUrl: null,
    isVerified: false,
  },
  {
    id: 8,
    title: "Lomba Karya Tulis Ilmiah Tingkat Kota",
    organizer: "Dinas Pendidikan Kota",
    category: "Karya Tulis",
    level: "Lokal",
    format: "Individu / Tim",
    fee: 0,
    deadline: "2026-10-28",
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa perguruan tinggi setempat",
    summary:
      "Ajang karya tulis ilmiah untuk mahasiswa dengan topik pembangunan dan potensi daerah.",
    posterUrl: null,
    isVerified: false,
  },
];

const LEVEL_OPTIONS: Competition["level"][] = [
  "Lokal",
  "Regional",
  "Nasional",
  "Internasional",
];
const FEE_OPTIONS: { value: FeeFilter; label: string }[] = [
  { value: "gratis", label: "Gratis" },
  { value: "berbayar", label: "Berbayar" },
];
const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "dibuka", label: "Pendaftaran dibuka" },
  { value: "segera-ditutup", label: "Segera ditutup" },
  { value: "ditutup", label: "Pendaftaran ditutup" },
];

// ============================================================
// HELPERS
// ============================================================

function getLocalDateString(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function getDaysLeft(deadline: string, today: string): number {
  const [year, month, day] = deadline.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = today.split("-").map(Number);
  return Math.round(
    (Date.UTC(year, month - 1, day) -
      Date.UTC(todayYear, todayMonth - 1, todayDay)) /
      86400000
  );
}

function getStatus(deadline: string, today: string): StatusFilter {
  const daysLeft = getDaysLeft(deadline, today);
  if (daysLeft < 0) return "ditutup";
  if (daysLeft <= 7) return "segera-ditutup";
  return "dibuka";
}

function getStatusLabel(status: StatusFilter): string {
  if (status === "ditutup") return "Ditutup";
  if (status === "segera-ditutup") return "Segera ditutup";
  return "Pendaftaran dibuka";
}

function getDeadlineCountdownLabel(deadline: string, today: string): string {
  const daysLeft = getDaysLeft(deadline, today);
  if (daysLeft < 0) return "Pendaftaran ditutup";
  if (daysLeft === 0) return "Tutup hari ini";
  if (daysLeft <= 7) return `Tutup ${daysLeft} hari lagi`;
  return "Pendaftaran dibuka";
}

function formatEventRange(startDate: string | null, endDate: string | null): string {
  if (startDate && endDate) {
    if (startDate === endDate) return formatDate(startDate);

    const startYear = startDate.split("-")[0];
    const endYear = endDate.split("-")[0];
    const formattedStart =
      startYear === endYear
        ? formatDate(startDate).replace(/ \d{4}$/, "")
        : formatDate(startDate);

    return `${formattedStart} – ${formatDate(endDate)}`;
  }
  if (startDate) return `Mulai ${formatDate(startDate)}`;
  if (endDate) return `Sampai ${formatDate(endDate)}`;
  return "Belum diumumkan";
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  return `${String(day).padStart(2, "0")} ${monthNames[month - 1]} ${year}`;
}

function formatCurrency(amount: number): string {
  if (amount === 0) return "Gratis";
  return `Rp${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}


function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeWidth="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

// ============================================================
// FILTER CONTROL
// ============================================================

type CheckOptionProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

function CheckOption({ checked, label, onChange }: CheckOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-xs text-[#626156] transition-colors hover:text-[#2C2C2C] dark:text-[#A8AD9F] dark:hover:text-[#EAE8E0]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-3.5 w-3.5 shrink-0 accent-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F7F1] dark:focus-visible:ring-offset-[#1A1D19]"
      />
      <span>{label}</span>
    </label>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" />
      <circle cx="8" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

type FilterFieldsProps = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLevels: string[];
  onLevelChange: (level: Competition["level"], checked: boolean) => void;
  selectedFees: FeeFilter[];
  onFeeChange: (fee: FeeFilter, checked: boolean) => void;
  selectedStatuses: StatusFilter[];
  onStatusChange: (status: StatusFilter, checked: boolean) => void;
};

function FilterFields({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedLevels,
  onLevelChange,
  selectedFees,
  onFeeChange,
  selectedStatuses,
  onStatusChange,
}: FilterFieldsProps) {
  return (
    <>
      <div className="border-b border-[#DEDACF] py-4 dark:border-[#343B30]">
        <h3 className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#858174] dark:text-[#9CA392]">
          Tingkat kompetisi
        </h3>
        <div className="mt-2">
          {LEVEL_OPTIONS.map((level) => (
            <CheckOption
              key={level}
              label={level}
              checked={selectedLevels.includes(level)}
              onChange={(checked) => onLevelChange(level, checked)}
            />
          ))}
        </div>
      </div>

      <div className="border-b border-[#DEDACF] py-4 dark:border-[#343B30]">
        <h3 className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#858174] dark:text-[#9CA392]">
          Biaya pendaftaran
        </h3>
        <div className="mt-2">
          {FEE_OPTIONS.map((option) => (
            <CheckOption
              key={option.value}
              label={option.label}
              checked={selectedFees.includes(option.value)}
              onChange={(checked) => onFeeChange(option.value, checked)}
            />
          ))}
        </div>
      </div>

      <div className="border-b border-[#DEDACF] py-4 dark:border-[#343B30]">
        <label htmlFor="category-filter" className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#858174] dark:text-[#9CA392]">
          Kategori
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="mt-2 w-full border border-[#D2CEC2] bg-transparent px-2.5 py-2 text-xs text-[#55574E] outline-none transition-colors focus:border-[#65745A] dark:border-[#3E4A35] dark:text-[#EAE8E0] dark:focus:border-[#829374]"
        >
          <option value="Semua" className="bg-[#F5F3EB] text-[#2C2C2C] dark:bg-[#1A1D19] dark:text-[#EAE8E0]">Semua kategori</option>
          {categories.map((category) => (
            <option key={category} value={category} className="bg-[#F5F3EB] text-[#2C2C2C] dark:bg-[#1A1D19] dark:text-[#EAE8E0]">
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-4">
        <h3 className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#858174] dark:text-[#9CA392]">
          Status pendaftaran
        </h3>
        <div className="mt-2">
          {STATUS_OPTIONS.map((option) => (
            <CheckOption
              key={option.value}
              label={option.label}
              checked={selectedStatuses.includes(option.value)}
              onChange={(checked) => onStatusChange(option.value, checked)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Shared visual tokens: Grid and List use the same typography hierarchy.
const competitionCategoryClass =
  "inline-flex w-fit border border-[#CBC7BA] px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-[#626156] dark:border-[#46503D] dark:text-[#9CA392]";
const competitionOrganizerClass =
  "truncate text-[10px] text-[#858174] dark:text-[#9CA392]";
const competitionTitleClass =
  "mt-1 line-clamp-2 min-h-[2.8rem] font-sans text-[15px] font-bold leading-[1.4] text-[#2C2C2C] dark:text-[#EAE8E0]";
const competitionQualificationClass =
  "mt-1.5 flex min-w-0 items-center gap-1 overflow-hidden whitespace-nowrap pb-2 text-[10px] leading-4 text-[#777568] dark:text-[#9CA392] lg:pb-3";


type CompetitionMetricsProps = {
  competition: Competition;
  today: string;
  className: string;
};

function CompetitionMetrics({ competition, today, className }: CompetitionMetricsProps) {
  const status = getStatus(competition.deadline, today);

  return (
    <div className={className}>
      <div className="min-w-0">
        <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-2 border-b border-[#E7E4DA] pb-2 dark:border-[#30382D]">
          <span className="pt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#969183] dark:text-[#858D7C]">
            Daftar
          </span>
          <div className="min-w-0 text-right">
            <div className="whitespace-nowrap font-mono text-[10px] font-semibold tabular-nums text-[#34362F] dark:text-[#EAE8E0]">
              {formatDate(competition.deadline)}
            </div>
            <div className={`mt-0.5 break-words font-mono text-[10px] font-semibold leading-tight tabular-nums ${
              status === "ditutup"
                ? "text-[#969183] dark:text-[#858D7C]"
                : status === "segera-ditutup"
                  ? "text-[#C45F3D] dark:text-[#E18B68]"
                  : "text-[#65745A] dark:text-[#A8B79A]"
            }`}>
              {getDeadlineCountdownLabel(competition.deadline, today)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[48px_minmax(0,1fr)] items-start gap-x-2 pt-2">
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#969183] dark:text-[#858D7C]">
            Acara
          </span>
          <span className="break-words text-right font-mono text-[10px] leading-tight tabular-nums text-[#777568] dark:text-[#9CA392]">
            {formatEventRange(competition.eventStartDate, competition.eventEndDate)}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-col border-l border-[#DEDACF] pl-4 dark:border-[#343B30]">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#969183] dark:text-[#858D7C]">
          Biaya
        </span>
        <span className="mt-1 break-words font-mono text-[11px] font-semibold tabular-nums text-[#34362F] dark:text-[#EAE8E0]">
          {formatCurrency(competition.fee)}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// GRID CARD
// ============================================================

type CompetitionCardProps = {
  competition: Competition;
  today: string;
  onOpenPoster: (competition: Competition) => void;
  selected: boolean;
  onSelect: (id: number) => void;
};

function CompetitionCard({
  competition,
  today,
  onOpenPoster,
  selected,
  onSelect,
}: CompetitionCardProps) {
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(competition.id);
    }
  };

  return (
    <article
      tabIndex={0}
      aria-label={`Pilih kompetisi ${competition.title}`}
      onClick={() => onSelect(competition.id)}
      onKeyDown={handleKeyDown}
      className={`group flex h-full min-w-0 cursor-pointer flex-col border outline-none transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] active:scale-[0.995] ${
        selected
          ? "-translate-y-0.5 border-[#65745A] bg-[#F2F1E8] shadow-[0_12px_28px_rgba(44,44,44,0.12)] ring-1 ring-inset ring-[#65745A]/45 dark:border-[#829374] dark:bg-[#20271E] dark:shadow-[0_14px_30px_rgba(0,0,0,0.28)] dark:ring-[#829374]/45"
          : "border-[#D8D3C6] bg-[#F8F7F1] hover:-translate-y-1 hover:border-[#A9A593] hover:shadow-[0_12px_28px_rgba(44,44,44,0.10)] dark:border-[#343B30] dark:bg-[#1A1D19] dark:hover:border-[#59664E] dark:hover:bg-[#1D241B] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)]"
      }`}
    >
      <div className={`relative w-full shrink-0 overflow-hidden ${competition.posterUrl ? "aspect-[4/5]" : "aspect-[5/4] sm:aspect-[4/5]"}  border-b border-[#D8D3C6] bg-[#EAE7DC] dark:border-[#343B30] dark:bg-[#1A1A18]`}>
        {competition.posterUrl ? (
          <button
            type="button"
            onClick={() => onOpenPoster(competition)}
            aria-label={`Perbesar poster ${competition.title}`}
            className="group/poster relative block h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A]"
          >
            <img
              src={competition.posterUrl}
              alt={`Poster ${competition.title}`}
              loading="lazy"
              className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover/poster:scale-[1.025] motion-reduce:transition-none"
            />
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-[#D8D3C6] bg-[#F5F3EB]/95 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-[#45483E] opacity-100 transition-opacity duration-200 dark:border-[#46503D] dark:bg-[#1D241B]/95 dark:text-[#EAE8E0] md:opacity-0 md:group-hover/poster:opacity-100 md:group-focus-visible/poster:opacity-100">
              <SearchIcon className="h-3 w-3" /> Perbesar
            </span>
          </button>
        ) : (
          <div className="relative h-full w-full overflow-hidden bg-[#EAE7DC] transition-colors duration-300 group-hover:bg-[#E5E2D7] dark:bg-[#1A1D19] dark:group-hover:bg-[#20271E] motion-reduce:transition-none">
            <svg
              aria-hidden="true"
              viewBox="0 0 400 500"
              preserveAspectRatio="xMidYMid slice"
              className="pointer-events-none absolute inset-0 h-full w-full text-[#AAA58F] opacity-45 dark:text-[#65745A] dark:opacity-35"
              fill="none"
            >
              <path d="M-35 95C35 28 111 39 158 92s101 74 161 36 94-23 125 10" stroke="currentColor" strokeWidth="1" />
              <path d="M-42 125C31 55 114 69 164 120s103 71 161 35 95-20 130 13" stroke="currentColor" strokeWidth="1" />
              <path d="M-48 157C29 87 117 101 171 149s105 68 164 33 96-18 133 16" stroke="currentColor" strokeWidth="1" />
              <path d="M-50 350C18 285 91 290 145 338s106 70 165 42 104-12 145 24" stroke="currentColor" strokeWidth="1" />
              <path d="M-48 382C22 316 99 322 153 370s107 68 168 40 104-10 144 25" stroke="currentColor" strokeWidth="1" />
              <path d="M-45 414C27 348 107 354 161 402s109 66 171 39 103-7 140 27" stroke="currentColor" strokeWidth="1" />
              <path d="M316 62v28m-14-14h28" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="316" cy="76" r="24" stroke="currentColor" strokeWidth="1" />
              <circle cx="316" cy="76" r="3" fill="currentColor" />
              <path d="M28 250h344M200 160v180" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 7" opacity="0.6" />
            </svg>

            <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-[#C9C4B6]/80 pb-3 dark:border-[#46503D]">
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#67695D] dark:text-[#A8B79A]">
                  Jejakarsa / Opportunity file
                </span>
                <span className="shrink-0 font-mono text-[8px] font-semibold tabular-nums text-[#858174] dark:text-[#9CA392]">
                  No. {String(competition.id).padStart(3, "0")}
                </span>
              </div>

              <div className="my-auto py-6">
                <span className="inline-flex border border-[#BDB9AC] bg-[#F5F3EB]/70 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-[#55574E] dark:border-[#46503D] dark:bg-[#1A1D19]/70 dark:text-[#B7BBAE]">
                  {competition.category}
                </span>
                <h3 className="mt-4 max-w-[260px] break-words font-serif text-[clamp(1.25rem,2.2vw,1.8rem)] leading-[1.12] text-[#34362F] dark:text-[#EAE8E0]">
                  {competition.title}
                </h3>
                <p className="mt-3 max-w-[240px] text-[10px] leading-5 text-[#777568] dark:text-[#9CA392]">
                  {competition.organizer}
                </p>
              </div>

              <div className="flex items-end justify-between gap-3 border-t border-[#C9C4B6]/80 pt-3 dark:border-[#46503D]">
                <div>
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#858174] dark:text-[#858D7C]">
                    Tingkat
                  </span>
                  <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#55574E] dark:text-[#D0D3C7]">
                    {competition.level}
                  </p>
                </div>
                <span className="max-w-[135px] text-right text-[9px] leading-4 text-[#858174] dark:text-[#9CA392]">
                  Poster resmi belum tersedia
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Identitas lomba: bidang, penyelenggara, lalu status sumber — konsisten dengan Base. */}
        <div className="flex min-w-0 flex-col items-start gap-y-1">
          <span className={competitionCategoryClass}>
            {competition.category}
          </span>
          <p className={`max-w-full ${competitionOrganizerClass}`}>
            {competition.organizer}
          </p>
          <VerificationStatus isVerified={competition.isVerified} />
        </div>
        <h2 className={competitionTitleClass}>
          {competition.title}
        </h2>
        <p className={competitionQualificationClass}>
          <span className="shrink-0">{competition.level}</span>
          <span aria-hidden="true" className="shrink-0">·</span>
          <span className="shrink-0">{competition.format}</span>
          <span aria-hidden="true" className="shrink-0">·</span>
          <span className="min-w-0 truncate">{competition.eligibility}</span>
        </p>

        <CompetitionMetrics
          competition={competition}
          today={today}
          className="mt-auto grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(76px,0.42fr)] gap-4 border-t border-[#DEDACF] pt-4 dark:border-[#343B30]"
        />
      </div>
    </article>
  );
}

// ============================================================
// LIST ROW
// ============================================================

function CompetitionListRow({
  competition,
  today,
  selected,
  onSelect,
}: {
  competition: Competition;
  today: string;
  selected: boolean;
  onSelect: (id: number) => void;
}) {
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(competition.id);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Pilih kompetisi ${competition.title}`}
      aria-pressed={selected}
      onClick={() => onSelect(competition.id)}
      onKeyDown={handleKeyDown}
      className={`group grid min-w-0 cursor-pointer grid-cols-1 gap-3 border-b px-4 py-4 outline-none transition-[transform,background-color,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] active:scale-[0.998] md:grid-cols-[minmax(0,1fr)_minmax(250px,0.9fr)] md:items-center md:gap-5 md:px-5 lg:grid-cols-[180px_minmax(0,1fr)_270px] lg:gap-5 lg:py-5 xl:grid-cols-[180px_minmax(0,1fr)_300px] ${
        selected
          ? "border-[#DCD8CC] bg-[#F0EFE5] shadow-[inset_3px_0_0_0_#65745A] ring-1 ring-inset ring-[#65745A]/35 dark:border-[#343B30] dark:bg-[#20271E] dark:shadow-[inset_3px_0_0_0_#829374] dark:ring-[#829374]/35"
          : "border-[#DCD8CC] hover:bg-[#F8F7F1] hover:shadow-[inset_3px_0_0_0_#65745A] dark:border-[#343B30] dark:hover:bg-[#1D241B] dark:hover:shadow-[inset_3px_0_0_0_#65745A]"
      }`}
    >
      <div className="grid min-w-0 grid-cols-1 gap-3 md:gap-2 lg:contents">
        <div className="flex min-w-0 flex-col items-start gap-y-1">
          <span className={competitionCategoryClass}>
            {competition.category}
          </span>
          <p className={`max-w-full ${competitionOrganizerClass}`}>
            {competition.organizer}
          </p>
          <VerificationStatus isVerified={competition.isVerified} />
        </div>

        <div className="min-w-0">
          <h2 className={competitionTitleClass}>
            {competition.title}
          </h2>
          <p className={competitionQualificationClass}>
            <span className="shrink-0">{competition.level}</span>
            <span aria-hidden="true" className="shrink-0">·</span>
            <span className="shrink-0">{competition.format}</span>
            <span aria-hidden="true" className="shrink-0">·</span>
            <span className="min-w-0 truncate">{competition.eligibility}</span>
          </p>
        </div>
      </div>

      <CompetitionMetrics
        competition={competition}
        today={today}
        className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(76px,0.42fr)] gap-4 border-t border-[#DEDACF] pt-4 dark:border-[#343B30] md:border-l md:border-t-0 md:pl-4 md:pt-0"
      />
    </article>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function KatalogPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [today, setToday] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedFees, setSelectedFees] = useState<FeeFilter[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<StatusFilter[]>([]);
  const [lightboxCompetition, setLightboxCompetition] = useState<Competition | null>(null);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("jejakarsa-theme");
      const systemPrefersDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)"
      ).matches ?? false;
      const shouldUseDark = savedTheme === "dark" || (savedTheme === null && systemPrefersDark);
      setIsDarkMode(shouldUseDark);
      document.documentElement.classList.toggle("dark", shouldUseDark);
    } catch {
      // Tema terang tetap digunakan jika localStorage tidak tersedia.
    }

    setToday(getLocalDateString());

    // Sinkronkan parameter dari pencarian/chips Base ke filter Katalog.
    // Dibaca setelah mount agar prerender Next.js tetap deterministik.
    const params = new URLSearchParams(window.location.search);
    const queryFromUrl = params.get("q")?.trim();
    if (queryFromUrl) setSearchQuery(queryFromUrl);

    const categoryFromUrl = params.get("kategori")?.trim();
    if (categoryFromUrl) {
      const matching = competitions.find(
        (item) => item.category.toLocaleLowerCase("id-ID") === categoryFromUrl.toLocaleLowerCase("id-ID")
      );
      if (matching) setSelectedCategory(matching.category);
    }

    const feeFromUrl = params.get("biaya");
    if (feeFromUrl === "gratis" || feeFromUrl === "berbayar") {
      setSelectedFees([feeFromUrl]);
    }
  }, []);

  useEffect(() => {
    if (!lightboxCompetition) return;
    const handleKeyDown = (event: WindowEventMap["keydown"]) => {
      if (event.key === "Escape") setLightboxCompetition(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxCompetition]);

  useEffect(() => {
    if (!isMobileFilterOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: WindowEventMap["keydown"]) => {
      if (event.key === "Escape") setIsMobileFilterOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileFilterOpen]);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    try {
      window.localStorage.setItem("jejakarsa-theme", nextTheme ? "dark" : "light");
    } catch {
      // Perubahan tema tetap berlaku selama halaman terbuka.
    }
  };

  const categories = useMemo(
    () => Array.from(new Set(competitions.map((competition) => competition.category))).sort(),
    []
  );

  const filteredCompetitions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("id-ID");

    return competitions
      .filter((competition) => {
        const matchesQuery =
          !normalizedQuery ||
          [competition.title, competition.organizer, competition.category, competition.eligibility]
            .some((value) => value.toLocaleLowerCase("id-ID").includes(normalizedQuery));
        const matchesCategory = selectedCategory === "Semua" || competition.category === selectedCategory;
        const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(competition.level);
        const feeType: FeeFilter = competition.fee === 0 ? "gratis" : "berbayar";
        const matchesFee = selectedFees.length === 0 || selectedFees.includes(feeType);
        const status = today ? getStatus(competition.deadline, today) : "dibuka";
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(status);

        return matchesQuery && matchesCategory && matchesLevel && matchesFee && matchesStatus;
      })
      .sort((a, b) => a.deadline.localeCompare(b.deadline));
  }, [searchQuery, selectedCategory, selectedLevels, selectedFees, selectedStatuses, today]);

  const activeFilterCount =
    selectedLevels.length + selectedFees.length + selectedStatuses.length +
    (selectedCategory !== "Semua" ? 1 : 0);

  const activeFilterChips = [
    ...selectedLevels.map((level) => ({
      key: `level-${level}`,
      label: `Tingkat: ${level}`,
      remove: () => setSelectedLevels((current) => current.filter((item) => item !== level)),
    })),
    ...selectedFees.map((fee) => ({
      key: `fee-${fee}`,
      label: `Biaya: ${FEE_OPTIONS.find((option) => option.value === fee)?.label ?? fee}`,
      remove: () => setSelectedFees((current) => current.filter((item) => item !== fee)),
    })),
    ...selectedStatuses.map((status) => ({
      key: `status-${status}`,
      label: `Status: ${getStatusLabel(status)}`,
      remove: () => setSelectedStatuses((current) => current.filter((item) => item !== status)),
    })),
    ...(selectedCategory !== "Semua"
      ? [{
          key: "category",
          label: `Bidang: ${selectedCategory}`,
          remove: () => setSelectedCategory("Semua"),
        }]
      : []),
  ];

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    setSelectedLevels([]);
    setSelectedFees([]);
    setSelectedStatuses([]);
  };

  const toggleArrayValue = <T extends string>(values: T[], value: T, checked: boolean, setter: (next: T[]) => void) => {
    setter(checked ? [...values, value] : values.filter((item) => item !== value));
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className={JEJAKARSA_STYLES.pageShell}>
      {/* NAVBAR */}
      <nav className={JEJAKARSA_STYLES.navbar}>
        <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-8">
          <Link href="/" className="flex min-w-0 flex-col" aria-label="Jejakarsa Beranda">
            <span className={JEJAKARSA_STYLES.wordmark}>
              jejakarsa<span className="text-[#65745A] dark:text-[#A8B79A]">.</span>
            </span>
            <span className={JEJAKARSA_STYLES.brandDescriptor}>
              {BRAND_DESCRIPTOR}
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <Link href="/katalog" aria-current="page" className={JEJAKARSA_STYLES.navigationLinkActive}>
              Katalog
            </Link>
            <Link href="/arsip-juara" className={JEJAKARSA_STYLES.navigationLink}>
              Kisah Juara
            </Link>
            <Link href="/tentang" className={JEJAKARSA_STYLES.navigationLink}>
              Tentang
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
              title={isDarkMode ? "Mode gelap" : "Mode terang"}
              className="flex h-9 w-9 items-center justify-center border border-[#D2CEC2] text-[#65745A] transition-colors hover:border-[#65745A] hover:bg-[#E8E5DA] dark:border-[#3E4A35] dark:text-[#EAE8E0] dark:hover:bg-[#2A3324]"
            >
              {isDarkMode ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className="flex h-9 w-9 items-center justify-center border border-[#D2CEC2] text-[#65745A] dark:border-[#3E4A35] dark:text-[#EAE8E0] lg:hidden"
            >
              <MenuIcon open={isMobileMenuOpen} />
            </button>
            <div className="hidden lg:block">
              <Link href="/bagikan-peluang" className={JEJAKARSA_STYLES.primaryAction}>
                Bagikan Peluang
              </Link>
            </div>
          </div>
        </div>

        <div id="mobile-navigation" role="region" aria-label="Menu navigasi mobile" aria-hidden={!isMobileMenuOpen} className={`grid overflow-hidden border-t border-[#E2DED2] bg-[#F5F3EB] transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none dark:border-[#30382D] dark:bg-[#161816] lg:hidden ${isMobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="flex flex-col px-5 py-2">
              <Link href="/katalog" onClick={() => setIsMobileMenuOpen(false)} tabIndex={isMobileMenuOpen ? 0 : -1} className="border-b border-[#E2DED2] py-3 text-sm font-semibold text-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] dark:border-[#30382D] dark:text-[#A8B79A]">
                Katalog
              </Link>
              <Link href="/arsip-juara" onClick={() => setIsMobileMenuOpen(false)} tabIndex={isMobileMenuOpen ? 0 : -1} className="border-b border-[#E2DED2] py-3 text-sm font-medium text-[#55574E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] dark:border-[#30382D] dark:text-[#9CA392]">
                Kisah Juara
              </Link>
              <Link href="/tentang" onClick={() => setIsMobileMenuOpen(false)} tabIndex={isMobileMenuOpen ? 0 : -1} className="py-3 text-sm font-medium text-[#55574E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] dark:text-[#9CA392]">
                Tentang
              </Link>
              <Link href="/bagikan-peluang" onClick={() => setIsMobileMenuOpen(false)} tabIndex={isMobileMenuOpen ? 0 : -1} className={`mt-2 !min-h-11 ${JEJAKARSA_STYLES.primaryAction}`}>
                Bagikan Peluang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        {/* PAGE INTRO */}
        <header className="border-b border-[#DCD8CC] py-6 sm:py-8 dark:border-[#30382D]">
          <div className="max-w-3xl">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#65745A] dark:text-[#A8B79A]">
              Jejakarsa / Indeks kompetisi
            </span>
            <h1 className="mt-2 font-serif text-[32px] font-medium leading-[1.08] tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0] sm:text-[44px]">
              Katalog kompetisi.
            </h1>
            <p className="mt-2 max-w-2xl text-[13px] leading-[1.65] sm:text-sm sm:leading-6 text-[#777568] dark:text-[#9CA392]">
              Telusuri peluang berdasarkan tingkat, bidang, biaya, dan status pendaftaran. Bandingkan informasi penting sebelum menentukan pilihan.
            </p>
          </div>
        </header>

        {/* CATALOG WORKSPACE */}
        <div className="grid min-w-0 grid-cols-1 gap-5 pt-4 sm:pt-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 lg:pt-8">
          {/* FILTER SIDEBAR — DESKTOP */}
          <aside className="hidden h-fit border border-[#D8D3C6] bg-[#F8F7F1] p-4 sm:p-5 dark:border-[#343B30] dark:bg-[#1A1D19] lg:sticky lg:top-24 lg:block">
            <div className="flex items-center justify-between gap-3 border-b border-[#DEDACF] pb-3 dark:border-[#343B30]">
              <h2 className="font-serif text-xl text-[#2C2C2C] dark:text-[#EAE8E0]">Filter katalog</h2>
              <button
                type="button"
                onClick={resetFilters}
                className="font-mono text-[9px] font-bold uppercase tracking-wide text-[#65745A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] motion-reduce:transition-none dark:text-[#A8B79A]"
              >
                Reset{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
            </div>
            <FilterFields
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLevels={selectedLevels}
              onLevelChange={(level, checked) => toggleArrayValue(selectedLevels, level, checked, setSelectedLevels)}
              selectedFees={selectedFees}
              onFeeChange={(fee, checked) => toggleArrayValue(selectedFees, fee, checked, setSelectedFees)}
              selectedStatuses={selectedStatuses}
              onStatusChange={(status, checked) => toggleArrayValue(selectedStatuses, status, checked, setSelectedStatuses)}
            />
          </aside>

          {/* FILTER BOTTOM SHEET — MOBILE */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-[80] lg:hidden">
              <button
                type="button"
                aria-label="Tutup filter"
                onClick={() => setIsMobileFilterOpen(false)}
                className="absolute inset-0 bg-[#11130F]/60 backdrop-blur-[1px]"
              />
              <section
                id="mobile-filter-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-filter-title"
                className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-2xl border-t border-[#D8D3C6] bg-[#F8F7F1] shadow-2xl dark:border-[#343B30] dark:bg-[#1A1D19]"
              >
                <div className="flex shrink-0 items-center justify-between border-b border-[#DEDACF] px-5 py-4 dark:border-[#343B30]">
                  <div>
                    <h2 id="mobile-filter-title" className="font-serif text-xl text-[#2C2C2C] dark:text-[#EAE8E0]">
                      Filter & Urutkan Data
                    </h2>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#858174] dark:text-[#9CA392]">
                      {activeFilterCount} filter aktif
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    aria-label="Tutup panel filter"
                    className="flex h-9 w-9 items-center justify-center border border-[#D2CEC2] text-[#65745A] dark:border-[#3E4A35] dark:text-[#EAE8E0]"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                  <FilterFields
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedLevels={selectedLevels}
                    onLevelChange={(level, checked) => toggleArrayValue(selectedLevels, level, checked, setSelectedLevels)}
                    selectedFees={selectedFees}
                    onFeeChange={(fee, checked) => toggleArrayValue(selectedFees, fee, checked, setSelectedFees)}
                    selectedStatuses={selectedStatuses}
                    onStatusChange={(status, checked) => toggleArrayValue(selectedStatuses, status, checked, setSelectedStatuses)}
                  />
                </div>

                <div className="flex shrink-0 items-center gap-3 border-t border-[#DEDACF] bg-[#F8F7F1] px-5 py-4 dark:border-[#343B30] dark:bg-[#1A1D19]">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="min-h-11 flex-1 border border-[#D2CEC2] px-4 text-[10px] font-bold uppercase tracking-wide text-[#65745A] dark:border-[#3E4A35] dark:text-[#A8B79A]"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="min-h-11 flex-[1.5] bg-[#2C2C2C] px-4 text-[10px] font-bold uppercase tracking-wide text-[#F5F5F0] dark:bg-[#2A3324] dark:text-[#EAE8E0]"
                  >
                    Tampilkan {filteredCompetitions.length} hasil
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* RESULTS */}
          <section className="min-w-0">
            <form onSubmit={handleSearchSubmit} role="search" className="flex min-w-0 items-center border border-[#BDB9AC] bg-[#FAF9F5] p-1 transition-colors focus-within:border-[#65745A] focus-within:ring-1 focus-within:ring-[#65745A] dark:border-[#3E4A35] dark:bg-[#1D241B] dark:focus-within:border-[#829374] dark:focus-within:ring-[#3E4A35]">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <SearchIcon className="h-[18px] w-[18px] shrink-0 text-[#898679] dark:text-[#9CA392]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari nama lomba, bidang, atau penyelenggara..."
                  aria-label="Cari kompetisi"
                  className="min-w-0 flex-1 border-none bg-transparent py-3 text-sm text-[#2C2C2C] outline-none placeholder:text-[#969184] focus:ring-0 dark:text-[#EAE8E0] dark:placeholder:text-[#858D7C]"
                />
              </div>
              <button type="submit" aria-label="Cari kompetisi" className="flex h-10 w-11 shrink-0 items-center justify-center bg-[#65745A] text-white transition-colors hover:bg-[#526249] dark:bg-[#2A3324] dark:text-[#EAE8E0] dark:hover:bg-[#3E4A35]">
                <SearchIcon className="h-4 w-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              aria-expanded={isMobileFilterOpen}
              aria-controls="mobile-filter-panel"
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#D2CEC2] bg-transparent px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#55574E] transition-colors hover:border-[#65745A] hover:bg-[#EFEEE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] motion-reduce:transition-none dark:border-[#3E4A35] dark:text-[#EAE8E0] dark:hover:bg-[#20251D] lg:hidden"
            >
              <FilterIcon />
              Filter & Urutkan Data
              {activeFilterCount > 0 && (
                <span className="ml-1 font-mono text-[9px] text-[#65745A] dark:text-[#A8B79A]">
                  ({activeFilterCount})
                </span>
              )}
            </button>

            <div className="mt-4 flex flex-col justify-between gap-3 border-b border-[#DCD8CC] pb-3 sm:flex-row sm:items-center dark:border-[#30382D]">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#858174] dark:text-[#9CA392]">
                  Hasil pencarian
                </p>
                <p className="mt-1 text-xs text-[#777568] dark:text-[#9CA392]" aria-live="polite">
                  <span className="font-bold text-[#2C2C2C] dark:text-[#EAE8E0]">{filteredCompetitions.length}</span> kompetisi ditemukan
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#969183] dark:text-[#858D7C]">
                  Tampilan
                </span>
                <div className="inline-flex border border-[#D2CEC2] dark:border-[#3E4A35]" role="group" aria-label="Pilih tampilan katalog">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-pressed={viewMode === "grid"}
                    className={`inline-flex h-9 items-center gap-2 px-3 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] motion-reduce:transition-none ${viewMode === "grid" ? "bg-[#E6E4D9] text-[#34362F] dark:bg-[#2A3324] dark:text-[#EAE8E0]" : "text-[#777568] hover:bg-[#EFEEE7] dark:text-[#9CA392] dark:hover:bg-[#20251D]"}`}
                  >
                    <GridIcon /> Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-pressed={viewMode === "list"}
                    className={`inline-flex h-9 items-center gap-2 border-l border-[#D2CEC2] px-3 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] motion-reduce:transition-none dark:border-[#3E4A35] ${viewMode === "list" ? "bg-[#E6E4D9] text-[#34362F] dark:bg-[#2A3324] dark:text-[#EAE8E0]" : "text-[#777568] hover:bg-[#EFEEE7] dark:text-[#9CA392] dark:hover:bg-[#20251D]"}`}
                  >
                    <ListIcon /> List
                  </button>
                </div>
              </div>
            </div>

            {activeFilterChips.length > 0 && (
              <div role="group" aria-label="Filter aktif" className="flex flex-wrap items-center gap-2 border-b border-[#DCD8CC] py-3 dark:border-[#30382D]">
                <span className="mr-1 font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#858174] dark:text-[#9CA392]">
                  Filter aktif
                </span>
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.remove}
                    aria-label={`Hapus ${chip.label}`}
                    className="inline-flex min-h-7 items-center gap-2 border border-[#D2CEC2] px-2.5 py-1 text-[10px] text-[#55574E] transition-colors hover:border-[#65745A] hover:bg-[#EFEEE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] motion-reduce:transition-none dark:border-[#3E4A35] dark:text-[#C6C9BE] dark:hover:bg-[#20271E]"
                  >
                    {chip.label}
                    <span aria-hidden="true" className="font-mono text-[12px] leading-none text-[#65745A] dark:text-[#A8B79A]">×</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-auto min-h-7 px-1 text-[10px] font-semibold text-[#65745A] underline underline-offset-2 transition-colors hover:text-[#43543B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] motion-reduce:transition-none dark:text-[#A8B79A] dark:hover:text-[#EAE8E0]"
                >
                  Hapus semua
                </button>
              </div>
            )}

            {filteredCompetitions.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCompetitions.map((competition) => (
                    <CompetitionCard
                      key={competition.id}
                      competition={competition}
                      today={today}
                      onOpenPoster={setLightboxCompetition}
                      selected={selectedCompetitionId === competition.id}
                      onSelect={setSelectedCompetitionId}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-4 border-t border-[#DCD8CC] dark:border-[#343B30]">
                  <div className="hidden grid-cols-[180px_minmax(0,1fr)_270px] gap-5 border-b border-[#CFCBBC] px-5 pb-2 pt-3 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#8B887C] dark:border-[#30382D] dark:text-[#9CA392] lg:grid xl:grid-cols-[180px_minmax(0,1fr)_300px]">
                    <span>Bidang / Penyelenggara</span>
                    <span>Kompetisi / Kualifikasi</span>
                    <span>Daftar / Acara / Biaya</span>
                  </div>
                  {filteredCompetitions.map((competition) => (
                    <CompetitionListRow
                      key={competition.id}
                      competition={competition}
                      today={today}
                      selected={selectedCompetitionId === competition.id}
                      onSelect={setSelectedCompetitionId}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="mt-4 border border-dashed border-[#CFCBBC] px-5 py-12 text-center dark:border-[#3E4A35]">
                <p className="font-serif text-xl text-[#55574E] dark:text-[#DAD8CE]">
                  Tidak ada kompetisi yang cocok.
                </p>
                <p className="mt-2 text-xs text-[#858174] dark:text-[#9CA392]">
                  Coba ubah kata kunci atau kurangi filter yang dipilih.
                </p>
                <button type="button" onClick={resetFilters} className="mt-4 border-b border-[#65745A] pb-1 text-[10px] font-bold uppercase tracking-wide text-[#65745A] dark:border-[#A8B79A] dark:text-[#A8B79A]">
                  Hapus semua filter
                </button>
              </div>
            )}

            <p className="mt-5 border-t border-[#DCD8CC] pt-3 font-mono text-[8px] leading-5 text-[#969183] dark:border-[#30382D] dark:text-[#858D7C]">
              Data yang tampil merupakan contoh struktur katalog. Pastikan tenggat, biaya, persyaratan, dan poster diperiksa melalui sumber resmi sebelum dipublikasikan.
            </p>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`mt-8 ${JEJAKARSA_STYLES.footer}`}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-7 sm:px-8 md:flex-row md:items-center">
          <div>
            <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0]">
              jejakarsa<span className="text-[#65745A] dark:text-[#A8B79A]">.</span>
            </Link>
            <p className="mt-1 text-[10px] text-[#858174] dark:text-[#9CA392]">
              {BRAND_DESCRIPTOR} Indonesia.
            </p>
          </div>
          <Link href="/" className="font-mono text-[9px] uppercase tracking-wide text-[#777568] hover:text-[#65745A] dark:text-[#9CA392] dark:hover:text-[#EAE8E0]">
            Kembali ke beranda
          </Link>
        </div>
      </footer>

      {/* POSTER LIGHTBOX */}
      {lightboxCompetition?.posterUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Poster ${lightboxCompetition.title}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxCompetition(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#11130F]/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <div className="relative flex max-h-full w-full max-w-4xl flex-col items-center">
            <button
              type="button"
              onClick={() => setLightboxCompetition(null)}
              aria-label="Tutup poster"
              className="absolute -right-1 -top-12 flex h-9 w-9 items-center justify-center border border-white/25 text-[#EAE8E0] transition-colors hover:bg-white/10 sm:right-0"
            >
              <CloseIcon />
            </button>
            <div className="flex max-h-[78vh] w-full items-center justify-center bg-[#1A1A18] p-3 sm:p-5">
              <img
                src={lightboxCompetition.posterUrl}
                alt={`Poster ${lightboxCompetition.title}`}
                className="max-h-[72vh] max-w-full object-contain"
              />
            </div>
            <p className="mt-3 text-center text-xs font-semibold text-[#EAE8E0]">
              {lightboxCompetition.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
