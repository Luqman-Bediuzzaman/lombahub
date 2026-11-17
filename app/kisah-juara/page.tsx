import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui";
import { StoryCover } from "@/components/stories/story-cover";
import { StoryArchive } from "@/components/stories/story-archive";
import { formatStoryDate, getFeaturedStory, getPublicStories, isSampleCollection } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Kisah Juara — Jejakarsa",
  description: "Kumpulan pengalaman mahasiswa mengikuti kompetisi: proses, tantangan, dan pelajaran yang bisa dibawa pulang.",
};

export default function KisahJuaraPage() {
  const stories = getPublicStories();
  const featured = getFeaturedStory(stories);
  return <div className="page-stack kj-page">
    <header className="kj-page-heading"><div className="eyebrow">CERITA & PENGALAMAN</div><h1>Kisah Juara<span>.</span></h1><p>Prestasi layak diapresiasi. Perjalanan di baliknya juga layak didengar—dari persiapan, kesulitan, sampai hal-hal yang ingin dilakukan berbeda.</p></header>
    {isSampleCollection(stories) && <div className="kj-notice"><Icon name="info" size={17}/><div><strong>Ruang ini masih menggunakan cerita simulasi.</strong><span>Nama tim, perlombaan, dan pencapaian belum berasal dari wawancara mahasiswa. Ganti dengan data terverifikasi setelah memperoleh izin publikasi.</span></div></div>}
    {featured ? <>
      <section className="kj-feature" aria-labelledby="kj-feature-title">
        <Link className="kj-feature-image" href={`/kisah-juara/${featured.slug}`} aria-label={`Baca ${featured.title}`}><StoryCover story={featured} size="feature"/></Link>
        <div className="kj-feature-copy"><span className="eyebrow">PILIHAN REDAKSI / {featured.category.toUpperCase()}</span><h2 id="kj-feature-title"><Link href={`/kisah-juara/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><div className="kj-feature-facts"><span>{featured.participants}</span><span>·</span><span>{featured.achievement}</span><span>·</span><span>{formatStoryDate(featured.publishedAt)}</span></div><Link href={`/kisah-juara/${featured.slug}`} className="button button-primary button-sm">Baca kisah <Icon name="arrow" size={14}/></Link></div>
      </section>
      {stories.length > 1 && <StoryArchive stories={stories} featuredSlug={featured.slug}/>}
    </> : <div className="kj-empty panel"><Icon name="book" size={25}/><h3>Belum ada kisah yang diterbitkan</h3><p>Setelah wawancara selesai, pencapaian diperiksa, dan narasumber memberi izin, cerita pertama dapat muncul di sini.</p></div>}
    <aside className="kj-editorial-note panel"><div className="kj-editorial-icon"><Icon name="shield" size={20}/></div><div><h3>Cerita yang menghargai narasumber</h3><p>Kisah Juara disusun dari pengalaman peserta, bukan rumus pasti untuk menang. Kami memisahkan fakta pencapaian dari pandangan pribadi, dan meminta persetujuan sebelum cerita diterbitkan.</p></div><Badge tone="green">Catatan redaksi</Badge></aside>
  </div>;
}
