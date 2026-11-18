import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { LinkButton } from "@/components/ui";
import { StoryCover } from "@/components/stories/story-cover";
import { StoryArchive } from "@/components/stories/story-archive";
import { getFeaturedStory, getPublicStories, getStoryCardTitle, isSampleCollection } from "@/lib/stories";
import prestigeStyles from "../bagikan-prestasi/prestasi.module.css";

export const metadata: Metadata = {
  title: "Kisah Juara — Jejakarsa",
  description: "Kumpulan pengalaman mahasiswa mengikuti kompetisi: proses, tantangan, dan pelajaran yang bisa dibawa pulang.",
};

export default function KisahJuaraPage() {
  const stories = getPublicStories();
  const featured = getFeaturedStory(stories);
  return <div className="page-stack page-compact kj-page">
    <header className={`kj-page-heading ${prestigeStyles.storyHeading}`}>
      <h1>Kisah Juara<span>.</span></h1>
      <LinkButton href="/bagikan-prestasi" variant="secondary" className={prestigeStyles.action}>
        Bagikan Prestasi <Icon name="arrow" size={16}/>
      </LinkButton>
    </header>
    {isSampleCollection(stories) && <div className="kj-notice"><Icon name="info" size={17}/><div><strong>Cerita simulasi.</strong><span>Tokoh dan pencapaian fiktif, belum berdasarkan wawancara.</span></div></div>}
    {featured ? <>
      <section className="kj-feature" aria-labelledby="kj-feature-title">
        <Link className="kj-feature-image" href={`/kisah-juara/${featured.slug}`} aria-label={`Baca ${featured.title}`}><StoryCover story={featured} size="feature"/></Link>
        <div className="kj-feature-copy"><span className="eyebrow">PILIHAN REDAKSI / {featured.category.toUpperCase()}</span><h2 id="kj-feature-title"><Link href={`/kisah-juara/${featured.slug}`}>{getStoryCardTitle(featured)}</Link></h2><div className="kj-feature-facts"><span>{featured.participants}</span><span>·</span><span>{featured.achievement}</span></div><Link href={`/kisah-juara/${featured.slug}`} className="button button-primary button-sm">Baca kisah <Icon name="arrow" size={14}/></Link></div>
      </section>
      {stories.length > 1 && <StoryArchive stories={stories} featuredSlug={featured.slug}/>}
    </> : <div className="kj-empty panel"><Icon name="book" size={25}/><h3>Belum ada kisah yang diterbitkan</h3><p>Setelah wawancara selesai, pencapaian diperiksa, dan narasumber memberi izin, cerita pertama dapat muncul di sini.</p></div>}
    <aside className="kj-editorial-note panel" aria-label="Catatan redaksi"><Icon name="shield" size={17}/><p>Kisah nyata diterbitkan setelah pemeriksaan pencapaian dan persetujuan narasumber.</p></aside>
  </div>;
}
