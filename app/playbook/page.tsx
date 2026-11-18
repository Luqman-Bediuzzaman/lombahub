import Link from "next/link";
import { playbooks } from "@/lib/demo-data";
import { Badge, PageHeading } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function PlaybookPage() {
  return <div className="page-stack page-compact playbook-page"><PageHeading title="Panduan Lomba" action={<Badge tone="blue">Materi panduan</Badge>}/>
    <section className="playbook-intro panel-dark"><div className="playbook-intro-copy"><h2>Periksa ketentuannya.<br/><em>Susun persiapannya.</em></h2></div><div className="playbook-intro-stamp" aria-hidden="true">CATATAN<span>J.</span></div></section>
    <div className="playbook-grid">{playbooks.map((item, index) => <Link href={`/playbook/${item.slug}`} key={item.slug} className={`playbook-card playbook-card-${item.accent}`}><div className="playbook-card-art"><div className="playbook-art-index">0{index + 1} / CATATAN</div><div className="playbook-art-shape"><span>{item.coverLabel?.trim() || "PANDUAN"}</span></div><div className="playbook-art-footer">PANDUAN JEJAKARSA</div></div><div className="playbook-card-copy"><div className="playbook-card-meta"><span>{item.category}</span><span>{item.readTime}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><span className="section-link">Baca panduan <Icon name="arrowUpRight" size={14}/></span></div></Link>)}</div>
    <div className="knowledge-principle"><Icon name="shield" size={18}/><div><strong>Periksa panduan resmi.</strong><p>Ketentuan lomba mengikuti informasi dari penyelenggara.</p></div></div>
  </div>;
}
