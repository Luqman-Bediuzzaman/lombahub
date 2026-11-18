import Link from "next/link";
import { Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { StoryCover } from "./story-cover";
import { StoryCredits } from "./story-credits";
import { creditsByStory } from "@/lib/story-credits";
import { formatStoryDate, isSafeHttpUrl, type WinnerStory } from "@/lib/stories";
import { StoryBody } from "@/components/editorial/story-body";
import styles from "./article-body.module.css";

export function StoryArticle({story}:{story:WinnerStory}) {
  const source = story.source && isSafeHttpUrl(story.source.url) ? story.source : null;
  return <>
    {story.status === "sample" && <div className="kj-notice"><Icon name="info" size={17}/><div><strong>Cerita simulasi.</strong><span>Tokoh, percakapan, kompetisi, dan pencapaian fiktif, bukan hasil wawancara.</span></div></div>}
    <article className="kj-article">
      <header className="kj-article-header"><div className="kj-article-category"><Badge tone="green">{story.category}</Badge><span>{[story.participantType,story.level].filter(Boolean).join(" · ")}</span></div><h1>{story.title}</h1><div className="kj-article-byline"><span>{story.participants}</span><span>·</span><span>{formatStoryDate(story.publishedAt)}</span><span>·</span><span>{story.readMinutes} menit baca</span></div></header>
      <figure className="kj-article-figure"><StoryCover story={story} size="detail"/><figcaption>{story.photo?.src ? (story.photo.alt || `Dokumentasi ${story.participants}`) : "Sampul editorial otomatis; belum ada foto narasumber."}</figcaption></figure>
      <div className="kj-article-grid">
        <div className="kj-article-main">
          {story.editorialBody ? <div className={styles.body}><StoryBody body={story.editorialBody}/></div> : <>
          <div className="kj-article-lead">{story.opening.map((paragraph,i) => <p key={i}>{paragraph}</p>)}</div>
          {story.sections.map((section, i) => <section className="kj-story-section" key={i} id={`bagian-${i+1}`}><span className="kj-chapter-number">{String(i+1).padStart(2,"0")}</span><h2>{section.heading}</h2>{section.paragraphs.map((p,j) => <p key={j}>{p}</p>)}{section.quote && <blockquote>“{section.quote}”<cite>— Kutipan wawancara {story.status === "sample" ? "simulasi" : "narasumber"}</cite></blockquote>}</section>)}
          <section className="kj-takeaways" aria-labelledby="kj-lessons"><div className="eyebrow">YANG BISA DIPELAJARI</div><h2 id="kj-lessons">Pelajaran dari pengalaman ini</h2><ul>{story.lessons.map((item,i) => <li key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ul></section>
          <section className="kj-hindsight"><div className="eyebrow">JIKA BISA DIULANG</div><h2>Apa yang akan dilakukan berbeda?</h2><p>{story.hindsight}</p></section>
          </>}
          <StoryCredits credits={story.credits ?? creditsByStory[story.slug]} sample={story.status === "sample"} />
          <div className="kj-story-disclaimer"><Icon name="info" size={16}/><p>{story.status === "sample" ? "Cerita fiktif untuk menilai desain dan struktur editorial. Jangan mengutipnya sebagai pengalaman atau prestasi nyata." : "Saran dalam kisah ini merupakan pengalaman narasumber, bukan jaminan hasil yang sama pada setiap kompetisi."}</p></div>
          <div className="kj-next-steps"><div><span className="eyebrow">LANJUTKAN EKSPLORASI</span><h3>Dari pengalaman ke persiapan</h3><p>Gunakan cerita ini sebagai bahan pertimbangan. Periksa kembali ketentuan dan kebutuhan lomba yang ingin kamu ikuti.</p></div><div className="kj-next-actions">{story.relatedPlaybookSlug && <Link href={`/playbook/${story.relatedPlaybookSlug}`} className="button button-secondary button-sm"><Icon name="book" size={14}/> Baca panduan terkait</Link>}<Link href={story.relatedSearch ? `/explore?q=${encodeURIComponent(story.relatedSearch)}` : "/explore"} className="button button-primary button-sm">Cari lomba sejenis <Icon name="arrow" size={14}/></Link></div></div>
        </div>
        <aside className="kj-article-aside" aria-label="Informasi pencapaian"><div className="kj-profile-panel panel"><span className="eyebrow">PROFIL PENCAPAIAN</span><h3>{story.participants}</h3><dl><div><dt>Kompetisi</dt><dd>{story.competition}</dd></div><div><dt>Pencapaian</dt><dd>{story.achievement}</dd></div>{story.campus && <div><dt>Institusi</dt><dd>{story.campus}</dd></div>}<div><dt>Tahun</dt><dd>{story.year}</dd></div><div><dt>Bentuk peserta</dt><dd>{story.participantType}</dd></div></dl>{source && <a href={source.url} target="_blank" rel="noopener noreferrer" className="kj-source-link">{source.label} <Icon name="arrowUpRight" size={14}/></a>}{story.achievementChecked && story.status !== "sample" && <div className="kj-checked"><Icon name="checkCircle" size={15}/> Pencapaian diperiksa redaksi</div>}{story.status === "sample" && <div className="kj-checked kj-unverified"><Icon name="info" size={15}/> Informasi simulasi</div>}</div></aside>
      </div>
    </article>
  </>;
}
