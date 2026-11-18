import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { StoryArticle } from "@/components/stories/story-article";
import { StoryCard } from "@/components/stories/story-card";
import { publicStories } from "@/lib/editorial/store";
import { cache } from "react";

export const dynamic="force-dynamic";
const loadStories=cache(publicStories);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = (await loadStories()).find((s) => s.slug === slug);
  if (!story) return { title: "Kisah tidak ditemukan — Jejakarsa" };
  return { title: `${story.title} — Kisah Juara | Jejakarsa`, description: story.excerpt,
    robots: story.status === "sample" ? { index: false, follow: false } : undefined };
}

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stories = await loadStories();
  const story = stories.find((s) => s.slug === slug);
  if (!story) notFound();
  const related = stories.filter((item) => item.slug !== story.slug && (item.category === story.category || item.participantType === story.participantType)).slice(0,2);
  return <div className="page-stack page-compact kj-detail-page">
    <div className="back-link-row"><Link href="/kisah-juara"><Icon name="arrow" size={14}/> Kembali ke Kisah Juara</Link><span>CATATAN PENGALAMAN</span></div>
    <StoryArticle story={story}/>
    {related.length > 0 && <section className="kj-related"><div className="kj-archive-heading"><span className="eyebrow">BACA JUGA</span><h2>Kisah lainnya</h2></div><div className="kj-story-grid">{related.map((item) => <StoryCard key={item.slug} story={item}/>)}</div></section>}
  </div>;
}
