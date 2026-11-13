"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowIcon, StoryChrome } from "../components/story-chrome";
import { STORIES, STORY_CATEGORIES, STORY_EXPERIENCES, type Story, type StoryCategory, type Experience } from "../data/stories";

const inputClass = "min-w-0 flex-1 min-h-11 border border-[#D3CFC3] bg-[#F8F7F1] px-4 py-3 text-xs text-[#34362F] placeholder:text-[#929083] outline-none transition-colors focus:border-[#65745A] focus:ring-1 focus:ring-[#65745A] dark:border-[#3E4A35] dark:bg-[#1A1D19] dark:text-[#EAE8E0] dark:placeholder:text-[#858D7C] motion-reduce:transition-none";
const metaClass = "font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#65745A] dark:text-[#A8B79A]";

function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/arsip-juara/${story.slug}`} className="group flex h-full min-w-0 flex-col border border-[#D8D3C6] bg-[#F8F7F1] transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#65745A] hover:bg-[#FDFCF8] hover:shadow-[inset_0_-3px_0_0_#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:border-[#30382D] dark:bg-[#1A1D19] dark:hover:border-[#65745A] dark:hover:bg-[#20261E] motion-reduce:transition-none">
      {story.imageUrl && (
        <img src={story.imageUrl} alt={story.imageDescription ?? `Dokumentasi ${story.title}`} loading="lazy" className="aspect-[16/9] w-full border-b border-[#D8D3C6] object-cover dark:border-[#30382D]" />
      )}
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1"><span className={metaClass}>{story.category}</span><span className="text-[#ABA798]">/</span><span className="font-mono text-[9px] uppercase tracking-wider text-[#777568] dark:text-[#9CA392]">{story.experience}</span><span className="ml-auto font-mono text-[9px] tabular-nums text-[#969183] dark:text-[#858D7C]">{story.year}</span></div>
        <h3 className="font-serif text-[21px] leading-[1.18] tracking-tight text-[#2C2C2C] transition-colors group-hover:text-[#526249] dark:text-[#EAE8E0] dark:group-hover:text-[#A8B79A]">{story.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-[1.6] text-[#777568] dark:text-[#9CA392]">{story.excerpt}</p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#DCD8CC] pt-2.5 dark:border-[#30382D]" style={{ marginTop: "0.85rem" }}>
          <span className="min-w-0 text-[10px] text-[#898679] dark:text-[#9CA392]">{story.participant} · {story.readingMinutes} menit</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold text-[#526249] dark:text-[#A8B79A]">Baca kisah <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" /></span>
        </div>
      </div>
    </Link>
  );
}

export default function StoryArchivePage() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Semua" | StoryCategory>("Semua");
  const [experience, setExperience] = useState<"Semua" | Experience>("Semua");
  const [order, setOrder] = useState<"terbaru" | "terlama">("terbaru");
  const [showContributionInfo, setShowContributionInfo] = useState(false);

  const featured = STORIES[0];
  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase("id-ID").trim();
    return STORIES.filter((story) => {
      const searchable = [story.title, story.excerpt, story.category, story.experience, story.competition, story.participant, story.institution, story.fieldNotes.challenge, story.fieldNotes.lesson].join(" ").toLocaleLowerCase("id-ID");
      return (!q || searchable.includes(q)) && (category === "Semua" || story.category === category) && (experience === "Semua" || story.experience === experience);
    }).sort((a, b) => order === "terbaru" ? b.publishedAt.localeCompare(a.publishedAt) : a.publishedAt.localeCompare(b.publishedAt));
  }, [query, category, experience, order]);

  const onSearch = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setQuery(draft.trim()); };
  const reset = () => { setDraft(""); setQuery(""); setCategory("Semua"); setExperience("Semua"); setOrder("terbaru"); };
  const hasFilters = !!(query || category !== "Semua" || experience !== "Semua" || order !== "terbaru");

  return (
    <StoryChrome>
      <main className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <header className="border-b border-[#DCD8CC] py-4 dark:border-[#30382D] sm:py-6">
          <span className={metaClass}>Jejakarsa / Arsip pengalaman</span>
          <h1 className="mt-1.5 font-serif text-[29px] font-medium leading-[1.08] tracking-tight sm:text-[40px]">Kisah Juara<span className="text-[#65745A]">.</span></h1>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-[1.55] sm:text-sm text-[#777568] dark:text-[#9CA392]">Di balik pencapaian, ada keputusan, proses, dan pelajaran yang bisa dibagikan. Temukan catatan perjalanan mahasiswa dalam menghadapi kompetisi.</p>
          <div className="mt-2 inline-flex gap-2 border-l-2 border-[#C47B55] bg-[#EAE7DC] px-3 py-2 font-mono text-[10px] leading-5 text-[#6F6759] dark:bg-[#20261E] dark:text-[#B8B6A8]">DEMO KONTEN — Kisah pada halaman ini adalah ilustrasi struktur editorial, bukan pengalaman atau prestasi peserta nyata.</div>
        </header>

        <section aria-labelledby="featured-story" className="border-b border-[#DCD8CC] py-4 dark:border-[#30382D] sm:py-6">
          <div className="mb-3 flex items-center justify-between gap-3"><h2 id="featured-story" className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#65745A] dark:text-[#A8B79A]">Pilihan Editorial / 001</h2><span className="font-mono text-[9px] text-[#969183] dark:text-[#858D7C]">STORY SPOTLIGHT</span></div>
          <Link href={`/arsip-juara/${featured.slug}`} className={`group grid overflow-hidden border border-[#D8D3C6] bg-[#F8F7F1] transition-colors hover:border-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:border-[#30382D] dark:bg-[#1A1D19] dark:hover:border-[#65745A] motion-reduce:transition-none ${featured.imageUrl ? "md:grid-cols-[0.94fr_1.06fr]" : ""}`}>
            {featured.imageUrl && (
              <img src={featured.imageUrl} alt={featured.imageDescription ?? `Dokumentasi ${featured.title}`} loading="lazy" className="aspect-[16/9] w-full border-b border-[#D8D3C6] object-cover dark:border-[#30382D] md:aspect-auto md:h-full md:min-h-[240px] md:border-b-0 md:border-r" />
            )}
            <div className="flex min-w-0 flex-col justify-between gap-3 p-4 sm:gap-5 sm:p-6 lg:p-7">
              <div><span className={metaClass}>{featured.category} / {featured.experience} / {featured.year}</span><h3 className="mt-2 max-w-xl font-serif text-[25px] leading-[1.12] tracking-tight transition-colors group-hover:text-[#526249] dark:group-hover:text-[#A8B79A] sm:text-[33px]">{featured.title}</h3><p className="mt-2 line-clamp-2 max-w-lg text-[13px] leading-6 sm:line-clamp-3 sm:text-sm sm:leading-7 text-[#777568] dark:text-[#9CA392]">{featured.excerpt}</p></div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DCD8CC] pt-3 dark:border-[#30382D]"><span className="text-[10px] text-[#898679] dark:text-[#9CA392]">{featured.participant} · {featured.readingMinutes} menit baca</span><span className="inline-flex shrink-0 items-center gap-2 text-[11px] font-bold text-[#526249] dark:text-[#A8B79A]">Baca perjalanan <ArrowIcon className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"/></span></div>
            </div>
          </Link>
        </section>

        <section aria-labelledby="discover-stories" className="pt-5 sm:pt-7">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><h2 id="discover-stories" className="font-serif text-[26px] leading-tight tracking-tight sm:text-[34px]">Jelajahi Perjalanan<span className="text-[#65745A]">.</span></h2><p className="mt-1 text-xs leading-5 text-[#777568] dark:text-[#9CA392]">Cari pengalaman berdasarkan bidang, perjalanan, atau tantangan yang dibahas.</p></div><span className="font-mono text-[9px] uppercase tracking-wider text-[#898679] dark:text-[#9CA392]">Arsip / {String(filtered.length).padStart(2, "0")} cerita</span></div>
          <div className="mt-3 border-y border-[#DCD8CC] bg-[#EAE7DC]/50 py-3 dark:border-[#30382D] dark:bg-[#1A1D19]/50 sm:px-5">
            <form onSubmit={onSearch} role="search" className="flex gap-2"><label htmlFor="story-search" className="sr-only">Cari cerita, peserta, atau kompetisi</label><input id="story-search" type="search" value={draft} onChange={(event) => {setDraft(event.target.value); if (!event.target.value) setQuery("");}} placeholder="Cari cerita, peserta, kompetisi, atau pelajaran..." className={inputClass} /><button type="submit" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#2C2C2C] px-4 text-[11px] font-bold text-white transition-colors hover:bg-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:bg-[#2A3324] dark:hover:bg-[#3E4A35] motion-reduce:transition-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span className="hidden sm:inline">Cari</span></button></form>
            <div className="mt-3">
              <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#68665B] dark:text-[#B7BBAE]">Bidang</p>
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter bidang">
                {STORY_CATEGORIES.map((item) => (
                  <button type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item}
                    className={`min-h-10 shrink-0 border px-3 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] ${category === item ? "border-[#65745A] bg-[#65745A] text-white" : "border-[#D3CFC3] bg-[#F8F7F1] text-[#55574E] hover:border-[#65745A] dark:border-[#3E4A35] dark:bg-[#20261E] dark:text-[#D0D3C7]"}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div className="min-w-[140px] flex-1 sm:flex-none">
                <label htmlFor="story-experience" className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#68665B] dark:text-[#B7BBAE]">Pengalaman</label>
                <select id="story-experience" value={experience} onChange={(event) => setExperience(event.target.value as typeof experience)} className="min-h-11 w-full border border-[#D3CFC3] bg-[#F8F7F1] px-3 text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:border-[#3E4A35] dark:bg-[#20261E]">
                  {STORY_EXPERIENCES.map((item) => <option key={item} value={item}>{item === "Semua" ? "Semua pengalaman" : item}</option>)}
                </select>
              </div>
              <div className="min-w-[115px] flex-1 sm:flex-none">
                <label htmlFor="story-order" className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#68665B] dark:text-[#B7BBAE]">Urutan</label>
                <select id="story-order" value={order} onChange={(event) => setOrder(event.target.value as "terbaru" | "terlama")} className="min-h-11 w-full border border-[#D3CFC3] bg-[#F8F7F1] px-3 text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:border-[#3E4A35] dark:bg-[#20261E]"><option value="terbaru">Terbaru</option><option value="terlama">Terlama</option></select>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-4 border-b border-[#DCD8CC] pb-3 dark:border-[#30382D]"><div><h3 className="font-serif text-2xl">Arsip Cerita</h3><span className="font-mono text-[9px] text-[#898679] dark:text-[#9CA392]">{filtered.length} cerita ditemukan</span></div>{hasFilters && <button type="button" onClick={reset} className="min-h-9 text-xs font-semibold text-[#526249] underline underline-offset-4 hover:text-[#34422C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:text-[#A8B79A]">Atur ulang filter</button>}</div>
          {filtered.length ? <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:gap-4">{filtered.map((story) => <StoryCard key={story.slug} story={story} />)}</div> : <div className="my-5 border border-[#DCD8CC] bg-[#F8F7F1] px-6 py-14 text-center dark:border-[#30382D] dark:bg-[#1A1D19]"><h3 className="font-serif text-2xl">Belum ada cerita yang cocok.</h3><p className="mt-2 text-xs text-[#777568] dark:text-[#9CA392]">Coba kata kunci atau kategori lain. Beberapa bidang belum memiliki konten contoh.</p><button type="button" onClick={reset} className="mt-5 min-h-10 border border-[#65745A] px-5 text-xs font-semibold text-[#526249] hover:bg-[#EAE7DC] dark:text-[#A8B79A] dark:hover:bg-[#263022]">Tampilkan semua cerita</button></div>}
        </section>

        <section className="mt-6 border-y border-[#DCD8CC] bg-[#EAE7DC] px-4 py-5 dark:border-[#30382D] dark:bg-[#20261E] sm:px-7 sm:py-7" aria-labelledby="contribute-story">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="max-w-2xl"><p className={metaClass}>Kontribusi / Cerita mahasiswa</p><h2 id="contribute-story" className="mt-2 font-serif text-2xl sm:text-3xl">Punya pengalaman kompetisi?</h2><p className="mt-1 text-xs leading-5 text-[#777568] dark:text-[#9CA392]">Pengalaman saat menang, mencapai final, atau tidak lolos seleksi bisa menjadi bahan belajar orang lain.</p></div><button type="button" onClick={() => setShowContributionInfo(!showContributionInfo)} aria-expanded={showContributionInfo} aria-controls="contribute-details" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-[#65745A] px-5 text-[11px] font-bold uppercase tracking-wider text-[#526249] transition-colors hover:bg-[#65745A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:text-[#A8B79A] dark:hover:text-white">{showContributionInfo ? "Tutup informasi" : "Cara berkontribusi"} <ArrowIcon/></button></div>
          {showContributionInfo && <div id="contribute-details" className="mt-6 border-t border-[#CFCABC] pt-5 text-xs leading-7 text-[#626156] dark:border-[#3E4A35] dark:text-[#B7BBAE]"><p>Jejakarsa akan menerima pengalaman melalui wawancara atau kontribusi tertulis setelah kanal pengiriman diaktifkan. Siapkan nama kompetisi, tahun, hasil yang dapat diperiksa, tantangan utama, dan satu pelajaran konkret.</p><p className="mt-2">Belum ada sistem pengiriman langsung pada versi ini. Jangan mengunggah dokumen pribadi atau sertifikat sebelum tersedia kanal resmi dan persetujuan publikasi.</p></div>}
        </section>
      </main>
    </StoryChrome>
  );
}
