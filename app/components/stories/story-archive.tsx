"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { StoryCard } from "./story-card";
import type { WinnerStory } from "@/lib/stories";
import { getStoryCardTitle } from "@/lib/stories";

export function StoryArchive({ stories, featuredSlug }: { stories: WinnerStory[]; featuredSlug?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [order, setOrder] = useState("newest");
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(stories.map((s) => s.category)))], [stories]);
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("id-ID");
    const selected = stories.filter((s) =>
      (category === "Semua" || s.category === category) &&
      (!q || [s.title, getStoryCardTitle(s), s.excerpt, s.category, s.competition, s.participants, s.campus, s.achievement].join(" ").toLocaleLowerCase("id-ID").includes(q))
    );
    if (order === "oldest") selected.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    else if (order === "title") selected.sort((a, b) => getStoryCardTitle(a).localeCompare(getStoryCardTitle(b), "id-ID"));
    else selected.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    // Saat pertama masuk, cerita unggulan tidak perlu muncul lagi tepat di bawahnya.
    return !q && category === "Semua" && order === "newest" && featuredSlug
      ? selected.filter((s) => s.slug !== featuredSlug)
      : selected;
  }, [stories, featuredSlug, query, category, order]);
  const clear = () => { setQuery(""); setCategory("Semua"); setOrder("newest"); };
  return (
    <section className="kj-archive" aria-labelledby="kj-archive-title">
      <div className="kj-archive-heading"><div><span className="eyebrow">ARSIP PENGALAMAN</span><h2 id="kj-archive-title">Jelajahi kisah lainnya</h2><p>Cari cerita berdasarkan bidang, tim, atau kompetisi yang pernah diikuti.</p></div></div>
      <div className="kj-archive-tools">
        <label className="kj-search"><Icon name="search" size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari judul, tim, atau bidang..." aria-label="Cari Kisah Juara"/></label>
        <label className="kj-sort"><span>Urutkan</span><select value={order} onChange={(e) => setOrder(e.target.value)}><option value="newest">Terbaru diterbitkan</option><option value="oldest">Terlama</option><option value="title">Judul A–Z</option></select></label>
      </div>
      <div className="kj-category-tabs" aria-label="Filter bidang">
        {categories.map((name) => <button key={name} type="button" className={category === name ? "selected" : ""} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}
      </div>
      <div className="kj-results-line"><span>{filtered.length} cerita ditampilkan</span>{(query || category !== "Semua" || order !== "newest") && <button type="button" onClick={clear}>Hapus filter <Icon name="close" size={12}/></button>}</div>
      {filtered.length ? <div className="kj-story-grid">{filtered.map((story) => <StoryCard story={story} key={story.slug} archive/>)}</div>
        : <div className="kj-empty panel"><Icon name="search" size={24}/><h3>Belum ada kisah yang sesuai</h3><p>Coba kata kunci atau kategori lain. Arsip ini akan bertambah seiring wawancara yang sudah mendapat izin terbit.</p><button onClick={clear} className="button button-secondary button-sm">Lihat seluruh kisah</button></div>}
    </section>
  );
}
