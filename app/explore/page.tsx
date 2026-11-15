"use client";

import { useEffect, useMemo, useState } from "react";
import { competitions, categories } from "@/lib/demo-data";
import { useApp } from "@/components/app-provider";
import { rankByFit } from "@/lib/recommendations";
import { OpportunityCard } from "@/components/opportunity-card";
import { PageHeading, Badge, EmptyState } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function ExplorePage() {
  const { profile } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [fee, setFee] = useState("Semua biaya");
  const [participation, setParticipation] = useState("Semua peserta");
  const [mode, setMode] = useState("Semua format");
  const [sort, setSort] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => { setQuery(new URLSearchParams(window.location.search).get("q") ?? ""); }, []);

  const results = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    const filtered = competitions.filter((item) => {
      const matchesQuery = !normalized || [item.title, item.organizer, item.category, item.discipline, item.summary, item.theme].join(" ").toLowerCase().includes(normalized);
      const matchesCategory = category === "Semua" || item.category === category;
      const matchesFee = fee === "Semua biaya" || item.feeStatus === fee;
      const matchesParticipation = participation === "Semua peserta" || (participation === "Individu" ? item.participation !== "Tim" : item.participation !== "Individu");
      const matchesMode = mode === "Semua format" || item.mode === mode;
      return matchesQuery && matchesCategory && matchesFee && matchesParticipation && matchesMode;
    });
    if (sort === "deadline") filtered.sort((a, b) => a.deadline.localeCompare(b.deadline));
    if (sort === "newest") filtered.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    if (sort === "title") filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "fit") return rankByFit(filtered, profile);
    return filtered;
  }, [query, category, fee, participation, mode, sort, profile]);

  const resetFilters = () => { setCategory("Semua"); setFee("Semua biaya"); setParticipation("Semua peserta"); setMode("Semua format"); setQuery(""); };

  return (
    <div className="page-stack">
      <PageHeading eyebrow="KATALOG LOMBA" title="Cari Lomba" description="Temukan lomba berdasarkan bidang, biaya, format, dan kategori peserta. Buka detail untuk melihat persyaratan serta sumber informasinya." action={<Badge tone="blue">{competitions.length} lomba contoh</Badge>}/>
      <section className="explore-search-panel">
        <div className="explore-search-icon"><Icon name="search" size={20}/></div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama lomba, bidang, penyelenggara, atau tema..." aria-label="Cari lomba"/>
        <kbd>ENTER</kbd>
        <button className={`button button-secondary button-md filter-toggle ${showFilters ? "selected" : ""}`} onClick={() => setShowFilters(!showFilters)}><Icon name="sliders" size={15}/> Filter</button>
      </section>
      {showFilters && <section className="filter-drawer panel"><div className="filter-grid">
        <label>Bidang<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item, index) => <option key={`${item}-${index}`} value={item}>{item}</option>)}</select></label>
        <label>Biaya pendaftaran<select value={fee} onChange={(event) => setFee(event.target.value)}><option>Semua biaya</option><option>Gratis</option><option>Berbayar</option><option>Belum diketahui</option></select></label>
        <label>Bentuk partisipasi<select value={participation} onChange={(event) => setParticipation(event.target.value)}><option>Semua peserta</option><option>Individu</option><option>Tim</option></select></label>
        <label>Format pelaksanaan<select value={mode} onChange={(event) => setMode(event.target.value)}><option>Semua format</option><option>Online</option><option>Offline</option><option>Hybrid</option></select></label>
      </div><div className="filter-drawer-footer"><span>Pilih filter untuk mempersempit hasil pencarian.</span><button className="text-button" onClick={resetFilters}>Hapus pilihan <Icon name="close" size={13}/></button></div></section>}
      <div className="explore-toolbar"><div className="result-count"><strong>{results.length}</strong> lomba ditemukan <span>·</span> <span>{query ? `untuk “${query}”` : "di semua bidang"}</span></div><div className="toolbar-controls"><label className="sort-control">Urutkan <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevance">Paling relevan</option><option value="fit">Kecocokan profil</option><option value="deadline">Tenggat terdekat</option><option value="newest">Terbaru ditambahkan</option><option value="title">Nama A–Z</option></select></label><div className="view-switch"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Tampilan kotak"><Icon name="grid" size={16}/></button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="Tampilan daftar"><Icon name="list" size={16}/></button></div></div></div>
      {results.length > 0 ? <div className={view === "grid" ? "opportunity-grid" : "opportunity-list"}>{results.map((item) => <OpportunityCard key={item.id} competition={item} compact={view === "list"}/>)}</div> : <EmptyState icon="search" title="Lomba tidak ditemukan" description="Coba kata kunci lain atau kurangi filter pencarian." action={<button className="button button-secondary button-sm" onClick={resetFilters}>Hapus filter</button>}/>}
    </div>
  );
}
