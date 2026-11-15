import { notFound } from "next/navigation";
import Link from "next/link";
import { competitions } from "@/lib/demo-data";
import { OpportunityDetailClient } from "@/components/opportunity-detail-client";
import { Icon } from "@/components/icons";

export function generateStaticParams() {
  return competitions.map((item) => ({ slug: item.slug }));
}

export default async function OpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const competition = competitions.find((item) => item.slug === slug);
  if (!competition) notFound();
  const related = competitions.filter((item) => item.id !== competition.id && (item.discipline === competition.discipline || item.category === competition.category)).slice(0, 2);
  return (
    <div className="page-stack">
      <div className="back-link-row"><Link href="/explore"><Icon name="arrow" size={14}/> Kembali ke katalog</Link><span>LOMBA / DETAIL</span></div>
      <OpportunityDetailClient competition={competition} related={related}/>
    </div>
  );
}
