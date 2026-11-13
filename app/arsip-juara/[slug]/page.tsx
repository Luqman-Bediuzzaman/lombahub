import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, StoryChrome } from "../../components/story-chrome";
import { findStory, STORIES } from "../../data/stories";

export function generateStaticParams() {
  return STORIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = findStory(slug);
  return { title: story ? `${story.title} | Kisah Juara — Jejakarsa` : "Kisah tidak ditemukan | Jejakarsa", description: story?.excerpt };
}

const metaClass = "font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#65745A] dark:text-[#A8B79A]";

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = findStory(slug);
  if (!story) notFound();
  const related = STORIES.filter((item) => item.slug !== story.slug && (item.category === story.category || item.experience === story.experience)).slice(0, 2);
  const fallbacks = related.length ? related : STORIES.filter((item) => item.slug !== story.slug).slice(0, 2);

  return (
    <StoryChrome>
      <main className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 border-b border-[#DCD8CC] py-3 font-mono text-[10px] text-[#858174] dark:border-[#30382D] dark:text-[#9CA392]">
          <Link href="/" className="hover:text-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A]">Base</Link><span aria-hidden="true">/</span><Link href="/arsip-juara" className="hover:text-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A]">Kisah Juara</Link><span aria-hidden="true">/</span><span className="text-[#526249] dark:text-[#A8B79A]">Catatan {String(STORIES.findIndex((item) => item.slug === slug) + 1).padStart(3, "0")}</span>
        </nav>
        <article>
          <header className="mx-auto max-w-4xl py-6 sm:py-9">
            <div className="flex flex-wrap items-center gap-2"><span className={metaClass}>{story.category}</span><span className="text-[#A8A493]">/</span><span className={metaClass}>{story.experience}</span><span className="text-[#A8A493]">/</span><span className="font-mono text-[9px] text-[#777568] dark:text-[#9CA392]">{story.year}</span></div>
            <h1 className="mt-3 max-w-4xl font-serif text-[32px] font-medium leading-[1.12] tracking-tight sm:text-[44px] lg:text-[52px]">{story.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#777568] dark:text-[#9CA392] sm:text-base">{story.excerpt}</p>
            <div className="mt-5 flex flex-wrap justify-between gap-4 border-y border-[#DCD8CC] py-4 dark:border-[#30382D]"><div><span className="block font-mono text-[9px] uppercase tracking-wider text-[#858174] dark:text-[#9CA392]">Narasumber</span><span className="mt-1 block text-xs font-semibold">{story.participant}</span><span className="mt-1 block text-[11px] text-[#898679] dark:text-[#9CA392]">{story.institution}</span></div><div><span className="block font-mono text-[9px] uppercase tracking-wider text-[#858174] dark:text-[#9CA392]">Kompetisi</span><span className="mt-1 block max-w-[220px] text-xs font-semibold">{story.competition}</span></div><div><span className="block font-mono text-[9px] uppercase tracking-wider text-[#858174] dark:text-[#9CA392]">Waktu baca</span><span className="mt-1 block text-xs font-semibold">± {story.readingMinutes} menit</span></div></div>
          </header>
          <figure className="mx-auto max-w-5xl">{story.imageUrl ? <img src={story.imageUrl} alt={story.imageDescription ?? `Dokumentasi ${story.title}`} className="aspect-[16/9] w-full object-cover" /> : <div className="border-y border-[#DCD8CC] bg-[#EAE7DC]/55 px-4 py-3 text-[11px] text-[#656357] dark:border-[#30382D] dark:bg-[#20261E] dark:text-[#B7BBAE]">Dokumentasi narasumber belum tersedia pada contoh cerita ini.</div>}<figcaption className="mt-1.5 text-[11px] leading-5 text-[#656357] dark:text-[#B7BBAE]">{story.imageDescription ?? "Dokumentasi hanya ditampilkan setelah mendapat izin publikasi."}</figcaption></figure>
          <div className="mx-auto max-w-3xl pt-6 sm:pt-9">
            <div className="mb-8 border-l-[3px] border-[#C47B55] bg-[#EAE7DC] px-4 py-3 text-[11px] leading-6 text-[#6F6759] dark:bg-[#20261E] dark:text-[#B8B6A8]"><strong className="font-mono text-[9px] uppercase tracking-wider">Konten demonstrasi</strong><p>Seluruh identitas, rangkaian peristiwa, kutipan, dan pelajaran pada halaman ini adalah ilustrasi. Belum bersumber dari wawancara atau pencapaian yang diverifikasi.</p></div>
            <p className="font-serif text-xl leading-[1.7] text-[#34362F] dark:text-[#EAE8E0] sm:text-2xl">{story.lead}</p>
            <blockquote className="my-9 border-l-2 border-[#65745A] pl-5 font-serif text-[25px] italic leading-[1.5] text-[#526249] dark:text-[#A8B79A] sm:text-[29px]">“{story.quote}”</blockquote>
            {story.sections.map((section, index) => <section key={section.title} className="mb-10" aria-labelledby={`story-section-${index}`}><div className="mb-4 flex items-baseline gap-4 border-b border-[#DCD8CC] pb-3 dark:border-[#30382D]"><span className={metaClass}>{String(index + 1).padStart(2, "0")}</span><h2 id={`story-section-${index}`} className="font-serif text-[26px] leading-[1.2] sm:text-[31px]">{section.title}</h2></div>{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex} className="mt-4 text-sm leading-[1.95] text-[#55564D] dark:text-[#B7BBAE] sm:text-[15px]">{paragraph}</p>)}</section>)}
            <aside aria-label="Field Notes: catatan perjalanan" className="mt-12 border-y border-[#A8B29F] bg-[#EAE7DC] px-5 py-6 dark:border-[#4A5845] dark:bg-[#20261E] sm:p-8"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-serif text-[29px]">Field Notes<span className="text-[#65745A]">.</span></h2><span className={metaClass}>Ringkasan / 03 catatan</span></div><p className="mt-1 text-xs leading-6 text-[#777568] dark:text-[#9CA392]">Poin yang bisa dibawa ke persiapan kompetisi berikutnya.</p><dl className="mt-6 divide-y divide-[#CBC7BA] dark:divide-[#3E4A35]">{[{ label: "Tantangan", value: story.fieldNotes.challenge }, { label: "Pendekatan", value: story.fieldNotes.approach }, { label: "Pelajaran", value: story.fieldNotes.lesson }].map((item, index) => <div key={item.label} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[140px_1fr] sm:gap-5"><dt className={metaClass}>{String(index + 1).padStart(2, "0")} / {item.label}</dt><dd className="text-sm font-medium leading-7 text-[#34362F] dark:text-[#EAE8E0]">{item.value}</dd></div>)}</dl></aside>
            <div className="mt-10 border-t border-[#DCD8CC] pt-5 dark:border-[#30382D]"><h2 className={metaClass}>Sumber dan transparansi</h2><dl className="mt-3 grid gap-3 text-xs leading-6 text-[#777568] dark:text-[#9CA392]"><div className="flex flex-wrap justify-between gap-x-5 gap-y-1"><dt>Asal konten</dt><dd className="font-semibold">{story.sourceType}</dd></div><div className="flex flex-wrap justify-between gap-x-5 gap-y-1"><dt>Bukti pencapaian</dt><dd className="font-semibold">{story.isAchievementConfirmed ? "Dikonfirmasi" : "Belum dikonfirmasi"}</dd></div><div className="flex flex-wrap justify-between gap-x-5 gap-y-1"><dt>Dokumentasi</dt><dd className="font-semibold">{story.imageUrl ? "Tersedia" : "Belum tersedia"}</dd></div></dl></div>
            <div className="mt-8 border-y border-[#DCD8CC] py-5 dark:border-[#30382D]"><span className={metaClass}>Ingin mengikuti kompetisi sejenis?</span><p className="mt-2 text-sm leading-7 text-[#777568] dark:text-[#9CA392]">Jelajahi Katalog Jejakarsa untuk membandingkan informasi lomba dan sumber penyelenggara. Cerita ini belum ditautkan ke entri kompetisi tertentu.</p><Link href={story.catalogQuery ? `/katalog?q=${encodeURIComponent(story.catalogQuery)}` : "/katalog"} className="mt-4 inline-flex min-h-11 items-center gap-2 border border-[#65745A] px-4 text-xs font-bold text-[#526249] transition-colors hover:bg-[#65745A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:text-[#A8B79A] dark:hover:text-white">Buka Katalog <ArrowIcon/></Link></div>
          </div>
        </article>
        <section aria-labelledby="related-stories" className="mx-auto mt-9 max-w-5xl border-t border-[#DCD8CC] pt-8 dark:border-[#30382D]"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 id="related-stories" className="font-serif text-3xl">Cerita Lainnya<span className="text-[#65745A]">.</span></h2><Link href="/arsip-juara" className="inline-flex items-center gap-2 text-xs font-semibold text-[#526249] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:text-[#A8B79A]">Kembali ke arsip <ArrowIcon/></Link></div><div className="grid gap-4 sm:grid-cols-2">{fallbacks.map((item) => <Link href={`/arsip-juara/${item.slug}`} key={item.slug} className="group flex min-h-[160px] flex-col justify-between border border-[#D8D3C6] bg-[#F8F7F1] p-5 transition-colors hover:border-[#65745A] hover:bg-[#FDFCF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:border-[#30382D] dark:bg-[#1A1D19] dark:hover:border-[#65745A]"><div><span className={metaClass}>{item.category} / {item.experience}</span><h3 className="mt-3 font-serif text-[23px] leading-[1.24] transition-colors group-hover:text-[#526249] dark:group-hover:text-[#A8B79A]">{item.title}</h3></div><span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#526249] dark:text-[#A8B79A]">Baca cerita <ArrowIcon className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"/></span></Link>)}</div></section>
      </main>
    </StoryChrome>
  );
}
