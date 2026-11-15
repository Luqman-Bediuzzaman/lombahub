import Link from "next/link";
import { playbooks } from "@/lib/demo-data";
import { Badge, PageHeading } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function PlaybookPage() {
  return <div className="page-stack"><PageHeading eyebrow="PANDUAN / CATATAN PRAKTIS" title="Panduan Lomba" description="Baca panduan untuk memahami persyaratan, menyiapkan karya, dan mengatur proses mengikuti lomba." action={<Badge tone="blue">Materi panduan</Badge>}/>
    <section className="playbook-intro panel-dark"><div className="playbook-intro-copy"><div className="eyebrow light-eyebrow">SEBELUM MENGIRIM KARYA</div><h2>Periksa ketentuannya.<br/><em>Susun persiapannya.</em></h2><p>Materi ini membahas langkah kerja, pertimbangan, dan hal yang perlu diperiksa saat mengikuti lomba.</p></div><div className="playbook-intro-stamp">CATATAN<br/>PRAKTIS<span>J.</span></div></section>
    <div className="playbook-grid">{playbooks.map((item, index) => <Link href={`/playbook/${item.slug}`} key={item.slug} className={`playbook-card playbook-card-${item.accent}`}><div className="playbook-card-art"><div className="playbook-art-index">0{index + 1} / CATATAN</div><div className="playbook-art-shape"><span>{index === 0 ? "PANDUAN" : index === 1 ? "TIM" : "KARYA"}</span></div><div className="playbook-art-footer">PANDUAN JEJAKARSA</div></div><div className="playbook-card-copy"><div className="playbook-card-meta"><span>{item.category}</span><span>{item.readTime}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><span className="section-link">Baca panduan <Icon name="arrowUpRight" size={14}/></span></div></Link>)}</div>
    <div className="knowledge-principle"><Icon name="shield" size={18}/><div><strong>Utamakan bukti, bukan asumsi.</strong><p>Setiap cerita peserta perlu mencantumkan sumber, konteks lomba, dan izin publikasi.</p></div></div>
  </div>;
}
