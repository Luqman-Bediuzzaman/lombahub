"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { BRAND_DESCRIPTOR, JEJAKARSA_STYLES } from "./design-system";
import { CompetitionListItem } from "./components/competition-list-item";
import { competitions, daysToDeadline, formatDate, formatEventRange, type Competition } from "./data/competitions";
import { STORIES } from "./data/stories";

// Competition records and formatting utilities are shared with /katalog.
// Base chooses relevant current highlights after the browser supplies local date.

type CompetitionRowProps = {
  competition: Competition;
  todayString: string | null;
  isExpanded: boolean;
  onToggle: (id: number) => void;
};

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

// ============================================================
// 4. BARIS KOMPETISI
// ============================================================

function CompetitionRow({ competition, todayString, isExpanded, onToggle }: CompetitionRowProps) {
  const eventRange = formatEventRange(competition.eventStartDate, competition.eventEndDate);
  const hasTimeline = competition.timeline.length > 0;
  return (
    <CompetitionListItem competition={competition} today={todayString} variant="accordion" isExpanded={isExpanded} onToggle={onToggle}>
      <div className={(hasTimeline || eventRange) ? "grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(190px,0.75fr)]" : "block"}>
        {competition.summary && (
          <div>
            <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#526249] dark:text-[#B5C4A5]">Ringkasan peluang</h4>
            <p className="mt-1 text-[12px] leading-[1.65] text-[#55574E] dark:text-[#CED2C6]">{competition.summary}</p>
          </div>
        )}
        {(hasTimeline || eventRange) && (
          <div className="border-t border-[#DCD8CC] pt-3 dark:border-[#343B30] lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
            <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#526249] dark:text-[#B5C4A5]">Jadwal yang tercatat</h4>
            {eventRange && <p className="mt-1 text-[12px] leading-5 text-[#55574E] dark:text-[#CED2C6]">Pelaksanaan: {eventRange}</p>}
            {hasTimeline && (
              <ul className="mt-1 space-y-1.5">
                {competition.timeline.map((item, index) => (
                  <li key={`${competition.id}-timeline-${index}`} className="flex flex-wrap justify-between gap-x-3 text-[12px] leading-5 text-[#55574E] dark:text-[#CED2C6]">
                    <span>{item.label}</span><span className="font-medium tabular-nums">{formatDate(item.date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#DCD8CC] pt-3 dark:border-[#343B30]">
        <Link href={`/katalog?q=${encodeURIComponent(competition.title)}`} className="inline-flex min-h-10 items-center gap-2 bg-[#2C2C2C] px-4 text-[11px] font-semibold text-[#F5F5F0] transition-colors hover:bg-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:bg-[#2A3324] dark:text-[#EAE8E0] dark:hover:bg-[#3E4A35]">
          Temukan di Katalog <ArrowRightIcon className="h-4 w-4" />
        </Link>
        {competition.sourceUrl && competition.isVerified && (
          <a href={competition.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 text-[11px] font-semibold text-[#526249] underline underline-offset-4 hover:text-[#34492E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:text-[#B5C4A5]">
            Sumber resmi <ArrowRightIcon className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </CompetitionListItem>
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
  const featuredCompetitions = todayString
    ? competitions.filter((item) => {
        const days = daysToDeadline(item.deadline, todayString);
        return days !== null && days >= 0;
      }).sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 4)
    : [];

  return (
    <div className={JEJAKARSA_STYLES.pageShell}>
      {/* ======================================================
          NAVBAR
      ====================================================== */}
      <nav className={JEJAKARSA_STYLES.navbar}>
        <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:px-8">
          <Link href="/" aria-current="page" className="flex min-w-0 flex-col" aria-label="Jejakarsa Beranda">
            <span className={JEJAKARSA_STYLES.wordmark}>
              jejakarsa<span className="text-[#65745A]">.</span>
            </span>
            <span className={JEJAKARSA_STYLES.brandDescriptor}>
              {BRAND_DESCRIPTOR}
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <Link
              href="/katalog"
              className={JEJAKARSA_STYLES.navigationLink}
            >
              Katalog
            </Link>
            <Link
              href="/arsip-juara"
              className={JEJAKARSA_STYLES.navigationLink}
            >
              Kisah Juara
            </Link>
            <Link
              href="/tentang"
              className={JEJAKARSA_STYLES.navigationLink}
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
              className="flex h-11 w-11 items-center justify-center border border-[#D2CEC2] text-[#65745A] transition-colors hover:border-[#65745A] hover:bg-[#E8E5DA] dark:border-[#3E4A35] dark:text-[#EAE8E0] dark:hover:border-[#65745A] dark:hover:bg-[#263022]"
            >
              {isDarkMode ? <MoonIcon /> : <SunIcon />}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 items-center justify-center border border-[#D2CEC2] text-[#65745A] transition-colors hover:border-[#65745A] hover:bg-[#E8E5DA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] motion-reduce:transition-none dark:border-[#3E4A35] dark:text-[#EAE8E0] dark:hover:border-[#65745A] dark:hover:bg-[#263022] lg:hidden"
            >
              <MenuToggleIcon isOpen={isMobileMenuOpen} />
            </button>

            <div className="hidden lg:block">
              <Link href="/bagikan-peluang" className={JEJAKARSA_STYLES.primaryAction}>
                Bagikan Peluang
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div
          id="mobile-navigation"
          role="region"
          aria-label="Menu navigasi mobile"
          aria-hidden={!isMobileMenuOpen}
          className={`overflow-hidden border-b transition-[max-height,opacity,transform,border-color] duration-300 ease-in-out motion-reduce:transition-none lg:hidden ${
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
              className="flex min-h-11 items-center px-3 text-sm font-semibold text-[#3F4038] transition-colors hover:bg-[#EAE8DE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] motion-reduce:transition-none dark:text-[#EAE8E0] dark:hover:bg-[#263022]"
            >
              Katalog
            </Link>
            <Link
              href="/arsip-juara"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className="flex min-h-11 items-center px-3 text-sm font-semibold text-[#3F4038] transition-colors hover:bg-[#EAE8DE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] motion-reduce:transition-none dark:text-[#EAE8E0] dark:hover:bg-[#263022]"
            >
              Kisah Juara
            </Link>
            <Link
              href="/tentang"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className="flex min-h-11 items-center px-3 text-sm font-semibold text-[#3F4038] transition-colors hover:bg-[#EAE8DE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] motion-reduce:transition-none dark:text-[#EAE8E0] dark:hover:bg-[#263022]"
            >
              Tentang
            </Link>
            <Link
              href="/bagikan-peluang"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className={`mt-2 !min-h-11 ${JEJAKARSA_STYLES.primaryAction}`}
            >
              Bagikan Peluang
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        {/* HERO */}
        <section className="border-b border-[#DCD8CC] py-5 dark:border-[#30382D] sm:py-8 lg:py-11">
          <div className="mx-auto max-w-4xl">
            <div className="mb-2 flex min-w-0 items-center gap-3">
              <span className="h-px w-8 shrink-0 bg-[#65745A] dark:bg-[#A8B79A]" aria-hidden="true" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#65745A] dark:text-[#A8B79A]">
                Jejakarsa / Peta peluang
              </span>
              <span className="ml-auto hidden font-mono text-[8px] uppercase tracking-[0.16em] text-[#9A978B] dark:text-[#737D6B] sm:inline">
                Discover — Understand — Pursue
              </span>
            </div>
            <h1 className="max-w-3xl font-serif text-[clamp(2.05rem,8.5vw,2.5rem)] font-medium leading-[1.03] tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0] sm:text-6xl lg:text-[4.25rem]">
              Temukan kompetisi.
              <br />
              <span className="italic text-[#65745A] dark:text-[#A8B79A]">
                Siapkan langkahmu.
              </span>
            </h1>

            <p className="mt-2.5 max-w-2xl text-[13px] leading-[1.55] sm:mt-4 sm:text-[15px] sm:leading-7 text-[#6F6D62] dark:text-[#9CA392]">
              Cari informasi lomba mahasiswa dari berbagai bidang dan
              penyelenggara. Periksa persyaratan, biaya, serta tenggat sebelum
              menentukan pilihan.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              role="search"
              className="mt-4 flex max-w-2xl min-w-0 items-center border border-[#BDB9AC] bg-[#FAF9F5] p-1 transition-colors focus-within:border-[#65745A] focus-within:ring-1 focus-within:ring-[#65745A] dark:border-[#3E4A35] dark:bg-[#1D241B]"
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
            <nav aria-label="Jelajahi kategori lomba" className="mt-2.5 flex max-w-2xl items-center gap-2 overflow-x-auto pb-1">
              <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#68665B] dark:text-[#B7BBAE]">Bidang</span>
              {["Teknologi", "Bisnis", "Karya Tulis", "Desain", "Sains"].map((category) => (
                <Link key={category} href={`/katalog?kategori=${encodeURIComponent(category)}`} className="inline-flex min-h-9 shrink-0 items-center border border-[#D2CEC2] px-3 text-[11px] font-medium text-[#526249] transition-colors hover:border-[#65745A] hover:bg-[#EAE7DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:border-[#3E4A35] dark:text-[#B5C4A5] dark:hover:bg-[#263022]">{category}</Link>
              ))}
            </nav>
          </div>
        </section>

        {/* ====================================================
            CURATED TEASER / T-MINUS
        ==================================================== */}
        <section className="pt-5 sm:pt-7">
          <div className="mb-2 border-b border-[#DCD8CC] pb-2 dark:border-[#30382D]">
            <h2 className="font-serif text-[25px] font-medium tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0] sm:text-[2.1rem]">
              Sorotan Lomba
            </h2>
          </div>

          {/* Header and list geometry match /katalog; Base alone has chevrons. */}
          <div className="hidden grid-cols-[160px_minmax(0,1fr)_245px_32px] gap-4 px-4 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#646458] dark:text-[#B7BBAE] lg:grid xl:grid-cols-[180px_minmax(0,1fr)_260px_32px] xl:gap-5">
            <span>Bidang / Penyelenggara</span><span>Kompetisi / Kualifikasi</span><span>Tenggat / Biaya</span><span />
          </div>
          <div className="space-y-2">
            {todayString === null ? (
              <p className="border border-[#D8D3C6] px-4 py-4 text-[12px] text-[#656357] dark:border-[#343B30] dark:text-[#BFC4B7]">Memeriksa tenggat peluang…</p>
            ) : featuredCompetitions.length > 0 ? (
              featuredCompetitions.map((competition) => (
                <CompetitionRow key={competition.id} competition={competition} todayString={todayString} isExpanded={expandedCompetitionId === competition.id} onToggle={handleCompetitionToggle} />
              ))
            ) : (
              <p className="border border-[#D8D3C6] px-4 py-4 text-[12px] leading-5 text-[#656357] dark:border-[#343B30] dark:text-[#BFC4B7]">Belum ada sorotan dengan tenggat yang masih berlaku. Jelajahi arsip kompetisi di Katalog untuk melihat data lain.</p>
            )}
          </div>

          <div className="mt-3 flex flex-col items-center gap-2 border-b border-[#DCD8CC] pb-4 dark:border-[#30382D]">
            <Link
              href="/katalog"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#2C2C2C] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#F5F5F0] transition-colors hover:bg-[#65745A] dark:bg-[#2A3324] dark:text-[#EAE8E0] dark:hover:bg-[#3E4A35] dark:hover:text-[#EAE8E0] sm:w-auto"
            >
              Buka Indeks Katalog Penuh
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* KISAH JUARA — preview editorial terhubung ke arsip. */}
        <section className="pt-6 sm:pt-8" id="kisah-juara" aria-labelledby="home-stories-title">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3 border-b border-[#DCD8CC] pb-3 dark:border-[#30382D]">
            <div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-[#65745A] dark:text-[#A8B79A]">Editorial / Catatan perjalanan</span>
              <h2 id="home-stories-title" className="mt-1 font-serif text-3xl font-medium tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0] sm:text-[2.1rem]">Kisah Juara<span className="text-[#65745A]">.</span></h2>
            </div>
            <span className="max-w-sm text-xs leading-5 text-[#858174] dark:text-[#9CA392]">Proses, strategi, dan pelajaran dari perjalanan kompetisi.</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {STORIES.slice(0, 2).map((story, index) => (
              <Link key={story.slug} href={`/arsip-juara/${story.slug}`} className={`group flex min-h-[150px] flex-col justify-between border border-[#D8D3C6] p-4 transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#65745A] hover:shadow-[inset_3px_0_0_0_#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] motion-reduce:transition-none dark:border-[#3E4A35] dark:hover:border-[#65745A] sm:min-h-[170px] sm:p-5 ${index === 0 ? "bg-[#EAE7DC] hover:bg-[#F2F0E8] dark:bg-[#1D241B] dark:hover:bg-[#263022]" : "bg-[#F8F7F1] hover:bg-[#FCFAF4] dark:bg-[#1A1D19] dark:hover:bg-[#20261E]"}`}>
                <div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#65745A] dark:text-[#A8B79A]">{story.category} / {story.experience} · Contoh editorial</span>
                  <blockquote className="mt-2.5 font-serif text-lg leading-[1.5] text-[#34362F] transition-colors group-hover:text-[#526249] dark:text-[#EAE8E0] dark:group-hover:text-[#A8B79A] sm:text-2xl">“{story.quote}”</blockquote>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#D2CDBF] pt-3 dark:border-[#3E4A35]">
                  <span className="text-[11px] font-semibold text-[#777568] dark:text-[#9CA392]">{story.participant} · {story.year}</span>
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#526249] dark:text-[#A8B79A]">Baca kisah <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"/></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] leading-5 text-[#898679] dark:text-[#9CA392]">Kisah saat ini merupakan simulasi tampilan; belum ada wawancara atau prestasi yang dikonfirmasi.</p>
            <Link href="/arsip-juara" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[#65745A] px-4 text-[10px] font-bold uppercase tracking-wide text-[#526249] transition-colors hover:bg-[#65745A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:text-[#A8B79A] dark:hover:text-white">Jelajahi seluruh arsip <ArrowRightIcon className="h-3.5 w-3.5"/></Link>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className={JEJAKARSA_STYLES.footer}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-6 sm:px-8 md:flex-row md:items-center">
          <div>
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-tight text-[#2C2C2C] dark:text-[#EAE8E0]"
            >
              jejakarsa<span className="text-[#65745A]">.</span>
            </Link>
            <p className="mt-1 text-[10px] text-[#858174] dark:text-[#9CA392]">
              {BRAND_DESCRIPTOR} Indonesia.
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
