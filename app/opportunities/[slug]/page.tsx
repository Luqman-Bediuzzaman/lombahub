import { notFound } from "next/navigation";
import Link from "next/link";
import { publicCatalog } from "@/lib/editorial/opportunity-store";
import { OpportunityDetailClient } from "@/components/opportunity-detail-client";
import { Icon } from "@/components/icons";

export const dynamic="force-dynamic";

export default async function OpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result=await publicCatalog().catch(()=>null);
  if(!result)return <div role="status">Data lomba belum dapat dimuat. Coba muat ulang halaman ini.</div>;
  const competitions=result.items;
  const competition = competitions.find((item) => item.slug === slug);
  if (!competition) notFound();
  const officialSourceUrl = /^https?:\/\//i.test(competition.sourceUrl?.trim() ?? "") ? competition.sourceUrl.trim() : null;
  const related = competitions.filter((item) => item.id !== competition.id && (item.discipline === competition.discipline || item.category === competition.category)).slice(0, 2);
  return (
    <div className="page-stack page-compact opportunity-detail-page">
      <div className="detail-entrybar">
        <div className="back-link-row"><Link href="/explore"><Icon name="arrow" size={14}/> Kembali ke katalog</Link></div>
        <div className="detail-official-info-access">
        <span>INFORMASI DARI PENYELENGGARA</span>
        {officialSourceUrl ? (
          <a href={officialSourceUrl} target="_blank" rel="noopener noreferrer">
            Buka pengumuman / unggahan penyelenggara <Icon name="arrowUpRight" size={14}/>
          </a>
        ) : (
          <span className="detail-official-info-unavailable">Tautan pengumuman belum tersedia</span>
        )}
        </div>
      </div>
      <OpportunityDetailClient competition={competition} related={related}/>
    </div>
  );
}
