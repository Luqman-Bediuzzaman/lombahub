"use client";

import {OpportunityDescription} from "./opportunity-description";
import Link from "next/link";
import { useState } from "react";
import type { Competition } from "@/lib/types";
import { useApp } from "@/components/app-provider";
import { EligibilityPanel } from "@/components/eligibility-panel";
import { OpportunityCard } from "@/components/opportunity-card";
import { Badge, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { formatCompetitionFee, formatDate } from "@/lib/eligibility";

export function OpportunityDetailClient({ competition, related }: { competition: Competition; related: Competition[] }) {
  const { isSaved, toggleSaved, compareIds, toggleCompare, profile } = useApp();
  const [copied, setCopied] = useState(false);
  const saved = isSaved(competition.id);
  const compared = compareIds.includes(competition.id);
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  };

  return <>
    <section className="detail-hero panel-dark">
      <div className="detail-hero-top"><div className="detail-category-label"><span className="detail-category-mark">{competition.discipline.slice(0, 1)}</span><span>{competition.category}</span><span>·</span><span>{competition.mode}</span></div><Badge tone={competition.verificationStatus === "sample" ? "amber" : competition.verificationStatus === "verified" ? "green" : "amber"}>{competition.verificationStatus === "sample" ? "DEMO" : competition.verificationStatus === "verified" ? "Sumber diperiksa" : "Perlu pemeriksaan"}</Badge></div>
      <div className="detail-hero-content"><div><div className="eyebrow light-eyebrow">{competition.organizer}</div><h1>{competition.title}</h1><p>{competition.summary}</p></div><div className="detail-stamp"><span>J.</span><small>DATA<br/>LOMBA</small></div></div>
      <div className="detail-quickfacts"><div><span>BATAS PENDAFTARAN</span><strong>{formatDate(competition.deadline)}</strong></div><div><span>BIAYA PENDAFTARAN</span><strong>{formatCompetitionFee(competition)}</strong></div><div><span>BENTUK PARTISIPASI</span><strong>{competition.participation}</strong></div><div><span>JENJANG PENDIDIKAN</span><strong>{competition.level.join(" / ")}</strong></div></div>
      <div className="detail-actions"><Button variant={saved ? "secondary" : "primary"} onClick={() => toggleSaved(competition.id)}><Icon name="bookmark" size={15}/>{saved ? "Tersimpan di Tersimpan" : "Simpan lomba"}</Button><Button variant={compared ? "secondary" : "ghost"} onClick={() => toggleCompare(competition.id)}><Icon name="scale" size={15}/>{compared ? "Dibandingkan" : "Bandingkan"}</Button><button className="detail-share-button" onClick={copyLink}><Icon name="copy" size={15}/>{copied ? "Tersalin" : "Salin tautan"}</button></div>
    </section>

    <div className="detail-content-grid">
      <div className="detail-main-column">
        <section className="panel detail-section"><h2>Tentang lomba ini</h2><OpportunityDescription text={competition.description}/>{competition.theme&&<div className="theme-callout"><span>TEMA LOMBA</span><strong>{competition.theme}</strong></div>}<div className="detail-info-grid"><div><span>Penyelenggara</span><strong>{competition.organizer}</strong></div><div><span>Lokasi</span><strong>{competition.location}</strong></div><div><span>Hadiah</span><strong>{competition.prize}</strong></div><div><span>Terakhir diperbarui</span><strong>{formatDate(competition.updatedAt?.slice(0,10)||competition.publishedAt)}</strong></div>{competition.scope&&<div><span>Lingkup</span><strong>{competition.scope}</strong></div>}{competition.submissionDeadline&&<div><span>Tenggat pengumpulan</span><strong>{formatDate(competition.submissionDeadline)}</strong></div>}{competition.deadlineTime&&<div><span>Jam tenggat pendaftaran</span><strong>{competition.deadlineTime} {competition.deadlineTimezone||""}</strong></div>}{competition.eligibilityIndonesia&&<div><span>Mahasiswa Indonesia boleh ikut?</span><strong>{competition.eligibilityIndonesia}</strong></div>}{competition.institutionRules&&<div><span>Ketentuan asal kampus</span><strong>{competition.institutionRules}</strong></div>}{competition.regionRules&&<div><span>Ketentuan wilayah</span><strong>{competition.regionRules}</strong></div>}</div>{!!competition.eventStages?.length&&<div style={{marginTop:"1rem"}}><h3>Tahap pelaksanaan</h3><div className="requirements-list">{competition.eventStages.map(stage=><div className="requirement-row" key={stage.id}><span>•</span><p>{stage.title} {stage.date&&`· ${formatDate(stage.date)}`}{stage.location&&` · ${stage.location}`}</p><Badge>{stage.mode}</Badge></div>)}</div></div>}</section>
        <EligibilityPanel competition={competition} profile={profile}/>
        <section className="panel detail-section"><h2>Apa yang perlu disiapkan?</h2><div className="requirements-list">{(competition.checklistItems ?? competition.checklist.map(title=>({id:title,title,detail:"",mandatory:false}))).map((task,index) => <div key={task.id} className="requirement-row"><span>{String(index + 1).padStart(2, "0")}</span><p>{task.title}{task.detail&&<small style={{display:"block",marginTop:4}}>{task.detail}</small>}</p><Badge>{task.mandatory?"Wajib menurut panduan":"Saran persiapan"}</Badge></div>)}</div></section>
        <section className="panel detail-section"><h2>Sumber informasi</h2><div className="source-record"><div className="source-record-icon"><Icon name="file" size={19}/></div><div><strong>{competition.sourceName}</strong><p>{competition.verificationNote}</p><div className="source-meta"><Badge tone={competition.verificationStatus==="verified"?"green":"amber"}>{competition.verificationStatus==="sample"?"Data contoh · belum diverifikasi":competition.verificationStatus==="verified"?"Sumber diperiksa":"Sebagian ketentuan perlu pemeriksaan"}</Badge>{competition.sources?.some(s=>s.checkedAt) ? <span>Terakhir diperiksa {formatDate([...competition.sources].filter(s=>s.checkedAt).sort((a,b)=>b.checkedAt.localeCompare(a.checkedAt))[0].checkedAt)}</span> : <span>Belum ada tanggal pemeriksaan sumber</span>}</div>{competition.sources?.map(source=><div key={source.id} className="source-meta">{source.url?<a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a>:<span>{source.title}</span>} <span>{source.kind}</span></div>)}{competition.registrationUrl&&<div className="source-meta"><a href={competition.registrationUrl} target="_blank" rel="noopener noreferrer">Tautan pendaftaran ↗</a></div>}{competition.guideUrl&&<div className="source-meta"><a href={competition.guideUrl} target="_blank" rel="noopener noreferrer">Panduan / guidebook ↗</a></div>}</div></div></section>
      </div>
      <aside className="detail-side-column">
        <section className="panel sticky-panel"><div className="eyebrow">LANGKAH BERIKUTNYA</div><h3>Simpan lomba ini.</h3><p>Lomba yang disimpan dapat kamu lengkapi dengan daftar persiapan, catatan, dan status.</p><Button className="full-button" onClick={() => toggleSaved(competition.id)}>{saved ? "Hapus dari Tersimpan" : "Simpan ke Tersimpan"}<Icon name="arrow" size={15}/></Button><div className="side-divider"/><div className="side-data-row"><span><Icon name="clock" size={15}/> Batas pendaftaran</span><strong>{formatDate(competition.deadline)}</strong></div><div className="side-data-row"><span><Icon name="wallet" size={15}/> Biaya</span><strong>{formatCompetitionFee(competition)}</strong></div><div className="side-data-row"><span><Icon name="map" size={15}/> Format</span><strong>{competition.mode}</strong></div><Link href="/profile" className="side-profile-link">Ubah profil <Icon name="arrowUpRight" size={13}/></Link></section>
      </aside>
    </div>
    {related.length > 0 && <section className="content-section detail-related"><div className="section-title"><div><h2>Lomba serupa</h2><p>Lomba lain dalam bidang atau kategori yang sama.</p></div><Link href="/explore" className="section-link">Lihat semua <Icon name="arrow" size={14}/></Link></div><div className="opportunity-grid">{related.map((item) => <OpportunityCard key={item.id} competition={item} compact/>)}</div></section>}
  </>;
}
