"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { competitions } from "@/lib/demo-data";
import { Badge, EmptyState, PageHeading } from "@/components/ui";
import { Icon } from "@/components/icons";

const KEY = "jejakarsa-curator-checks-v1";
type ReviewState = Record<string, string>;

const evidenceLabel = (status: string) => status === "verified" ? "Terverifikasi" : status === "ambiguous" ? "Perlu klarifikasi" : "Belum diperiksa";

export default function ReviewDeskPage() {
  const [reviewed, setReviewed] = useState<ReviewState>({});
  const [filter, setFilter] = useState<"all" | "attention" | "reviewed">("all");
  useEffect(() => { try { const raw = localStorage.getItem(KEY); if (raw) setReviewed(JSON.parse(raw)); } catch { /* local demo only */ } }, []);
  const saveReview = (id: string) => setReviewed((current) => {
    const next = { ...current, [id]: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* no-op */ }
    return next;
  });
  const attentionCount = competitions.filter((item) => item.requirements.some((req) => req.evidence.status !== "verified") || item.sourceUrl === "#").length;
  const visible = useMemo(() => competitions.filter((item) => filter === "all" || (filter === "reviewed" ? Boolean(reviewed[item.id]) : !reviewed[item.id] || item.sourceUrl === "#" || item.requirements.some((req) => req.evidence.status !== "verified"))), [filter, reviewed]);

  return <div className="page-stack"><Link href="/admin/review">← Ruang redaksi</Link><PageHeading eyebrow="PENGELOLAAN DATA" title="Kurasi Data" description="Periksa sumber dan persyaratan setiap lomba." action={<Badge tone="amber">DEMO</Badge>}/>
    <div className="review-summary-grid"><div className="review-summary-card"><span>SELURUH DATA</span><strong>{competitions.length.toString().padStart(2, "0")}</strong><small>Data contoh</small></div><div className="review-summary-card"><span>PERLU DIPERIKSA</span><strong>{attentionCount.toString().padStart(2, "0")}</strong><small>Sumber atau syarat belum lengkap</small></div><div className="review-summary-card"><span>SUDAH DITANDAI</span><strong>{Object.keys(reviewed).length.toString().padStart(2, "0")}</strong><small>Penanda pemeriksaan</small></div></div>
    <div className="review-controls"><div className="review-tabs"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Semua data</button><button className={filter === "attention" ? "active" : ""} onClick={() => setFilter("attention")}>Perlu diperiksa</button><button className={filter === "reviewed" ? "active" : ""} onClick={() => setFilter("reviewed")}>Sudah diperiksa</button></div><span className="small-muted">{visible.length} data ditampilkan</span></div>
    {visible.length === 0 ? <EmptyState icon="file" title="Tidak ada data pada daftar ini" description="Pilih tab lain untuk melihat data yang tersedia."/> : <div className="review-queue">{visible.map((item) => {
      const ambiguous = item.requirements.filter((req) => req.evidence.status !== "verified").length;
      const sourceMissing = item.sourceUrl === "#";
      return <article className="review-record panel" key={item.id}><div className="review-record-head"><div className="review-record-title"><span className="category-marker category-sage">{item.discipline.slice(0,1)}</span><div><div className="eyebrow">{item.category} · {item.id}</div><h3>{item.title}</h3><p>{item.organizer} · {item.sourceName}</p></div></div><div className="review-record-tools"><Badge tone={reviewed[item.id] ? "green" : "amber"} dot>{reviewed[item.id] ? "Ditandai" : "Belum diperiksa"}</Badge><Link href={`/opportunities/${item.slug}`}><Icon name="external" size={13}/> Lihat data</Link></div></div><div className="review-record-body"><div className="review-record-grid">{item.requirements.map((req) => <div className="review-requirement" key={req.id}><div><strong>{req.label}</strong><span>{req.value} · {req.evidence.location}</span></div><Badge tone={req.evidence.status === "verified" ? "green" : "amber"}>{evidenceLabel(req.evidence.status)}</Badge></div>)}</div><div className="review-record-foot"><p>{ambiguous} persyaratan belum terverifikasi. {sourceMissing ? "Tautan sumber belum tersedia." : "Tautan sumber tersedia."}</p><button onClick={() => saveReview(item.id)}>{reviewed[item.id] ? "Perbarui penanda" : "Tandai diperiksa"} <Icon name="check" size={12}/></button></div></div></article>;
    })}</div>}
  </div>;
}
