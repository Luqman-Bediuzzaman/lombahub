"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { OpportunitySummary } from "@/lib/editorial/opportunity-model";

export function OpportunityQueue({rows}:{rows:OpportunitySummary[]}) {
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState<"all"|"attention"|"published"|"draft">("all");
  const visible=useMemo(()=>rows.filter(r=>{
    const search=!query.trim() || `${r.title} ${r.organizer}`.toLowerCase().includes(query.toLowerCase().trim());
    return search && (filter==="all" || filter==="attention"&&r.attention>0 || filter==="published"&&r.published || filter==="draft"&&!r.published);
  }),[rows,filter,query]);
  return <>
    <div className="red-queue-controls"><input type="search" aria-label="Cari berkas lomba" placeholder="Cari nama lomba atau penyelenggara…" value={query} onChange={e=>setQuery(e.target.value)}/>
      <div className="red-queue-tabs" aria-label="Filter status editorial">{([
        ["all","Semua"],["attention","Perlu diperiksa"],["published","Terbit"],["draft","Belum terbit"],
      ] as const).map(([v,l])=><button key={v} type="button" className={filter===v?"active":""} aria-pressed={filter===v} onClick={()=>setFilter(v)}>{l}</button>)}</div>
    </div>
    {visible.length ? <div className="red-opportunity-list">{visible.map(r=><Link key={r.id} href={`/admin/review/cari-lomba/${r.id}`}>
      <div><strong>{r.title}</strong><small>{r.organizer||"Penyelenggara belum diisi"} · Disunting {new Date(r.updated).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</small></div>
      <div className="red-opportunity-chips"><span className={r.status==="published"?"red-good":r.status==="withdrawn"?"red-warn":"red-muted"}>{r.status==="published"?"Terbit":r.status==="withdrawn"?"Ditarik":"Draf"}</span>{r.attention>0&&<span className="red-warn">{r.attention} perhatian</span>}<span>→ Sunting</span></div></Link>)}</div>
      : <div className="red-empty">Tidak ada lomba pada pencarian atau filter ini.</div>}
    <p className="red-note">Menampilkan {visible.length} dari {rows.length} berkas editorial. Perubahan hanya tampil ke publik setelah tombol Terbitkan ditekan.</p>
  </>;
}
