"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApp } from "@/components/app-provider";
import { competitions } from "@/lib/demo-data";
import { Badge, EmptyState, PageHeading } from "@/components/ui";
import { Icon } from "@/components/icons";
import type { WorkspaceStatus } from "@/lib/types";

const statusLabels: Record<WorkspaceStatus, string> = { saved: "Disimpan", evaluating: "Dipertimbangkan", preparing: "Dalam persiapan", submitted: "Sudah dikirim", completed: "Selesai" };
const statusOrder: WorkspaceStatus[] = ["saved", "evaluating", "preparing", "submitted", "completed"];

export default function WorkspacePage() {
  const { workspace, updateStatus, toggleChecklist, updateNotes, removeFromWorkspace, hydrated } = useApp();
  const [filter, setFilter] = useState<WorkspaceStatus | "all">("all");
  const enriched = useMemo(() => workspace.map((entry) => ({ entry, competition: competitions.find((item) => item.id === entry.competitionId) })).filter((item) => item.competition), [workspace]);
  const visible = enriched.filter(({ entry }) => filter === "all" || entry.status === filter);
  const completedTasks = enriched.reduce((total, item) => total + Object.values(item.entry.checklist).filter(Boolean).length, 0);
  const allTasks = enriched.reduce((total, item) => total + Object.keys(item.entry.checklist).length, 0);

  return <div className="page-stack page-compact workspace-page"><PageHeading title="Tersimpan" description="Kelola pilihan lomba dan persiapan pendaftaranmu." action={<Link href="/explore" className="button button-primary button-md"><Icon name="plus" size={15}/> Tambah lomba</Link>}/>
    {!hydrated ? <p className="small-muted" role="status">Memuat lomba tersimpan...</p> : <>
    {enriched.length > 0 && <>
      <div className="workspace-overview"><div className="workspace-overview-main"><h2>{enriched.length} lomba tersimpan</h2></div><div className="workspace-progress"><div className="progress-ring" style={{ background: `conic-gradient(#687f57 ${allTasks ? (completedTasks / allTasks) * 100 : 0}%, #d8e1d1 0)` }}><div><strong>{allTasks ? Math.round(completedTasks / allTasks * 100) : 0}%</strong><span>Proses</span></div></div><div><strong>{completedTasks} / {allTasks}</strong><span>Selesai</span></div></div></div>
      <div className="workspace-tabs"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Semua <span>{workspace.length}</span></button>{statusOrder.map((status) => <button key={status} className={filter === status ? "active" : ""} onClick={() => setFilter(status)}>{statusLabels[status]} <span>{workspace.filter((item) => item.status === status).length}</span></button>)}</div>
    </>}
    {visible.length === 0 ? <EmptyState icon="bookmark" title={enriched.length === 0 ? "Belum ada lomba yang disimpan" : "Tidak ada lomba pada status ini"} description={enriched.length === 0 ? "Simpan lomba dari katalog atau halaman detail untuk mulai menyiapkan pendaftaran." : "Pilih status lain untuk melihat lomba tersimpan."} action={enriched.length === 0 ? <Link href="/explore" className="button button-primary button-sm">Cari Lomba <Icon name="arrow" size={14}/></Link> : <button type="button" className="button button-secondary button-sm" onClick={() => setFilter("all")}>Lihat semua tersimpan</button>}/> : <div className="workspace-list">{visible.map(({ entry, competition }) => {
      if (!competition) return null;
      const tasks = competition.checklist;
      const done = tasks.filter((task) => entry.checklist[task]).length;
      return <article className="workspace-item panel" key={entry.competitionId}><div className="workspace-item-head"><div className="workspace-item-category"><span className="category-marker category-sage">{competition.discipline.slice(0, 1)}</span><div><div className="eyebrow">{competition.category}</div><Link href={`/opportunities/${competition.slug}`}><h3>{competition.title}</h3></Link><span className="small-muted">Batas pendaftaran {new Date(competition.deadline + "T12:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span></div></div><div className="workspace-item-controls"><Badge tone={entry.status === "completed" ? "green" : entry.status === "preparing" ? "blue" : "neutral"}>{statusLabels[entry.status]}</Badge><select aria-label="Ubah status persiapan" value={entry.status} onChange={(e) => updateStatus(entry.competitionId, e.target.value as WorkspaceStatus)}>{statusOrder.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select><button className="mini-icon-button" onClick={() => removeFromWorkspace(entry.competitionId)} aria-label="Hapus dari Tersimpan"><Icon name="trash" size={15}/></button></div></div>
        <div className="workspace-item-body"><div className="workspace-checklist"><div className="workspace-subheading"><strong>Daftar persiapan</strong><span>{done}/{tasks.length} selesai</span></div><div className="progress-line"><span style={{ width: `${tasks.length ? done / tasks.length * 100 : 0}%` }}/></div><div className="task-grid">{tasks.map((task) => <label key={task} className={`task-check ${entry.checklist[task] ? "done" : ""}`}><input type="checkbox" checked={Boolean(entry.checklist[task])} onChange={() => toggleChecklist(entry.competitionId, task)}/><span className="custom-check"><Icon name="check" size={11}/></span>{task}</label>)}</div></div><div className="workspace-notes"><label htmlFor={`notes-${entry.competitionId}`}>Catatan pribadi</label><textarea id={`notes-${entry.competitionId}`} value={entry.notes} onChange={(e) => updateNotes(entry.competitionId, e.target.value)} placeholder="Catatan, ide, atau hal yang perlu dikonfirmasi..."/><span>Catatan tersimpan di browser ini.</span></div></div>
      </article>;
    })}</div>}
    </>}
  </div>;
}
