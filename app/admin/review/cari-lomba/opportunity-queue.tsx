"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { OpportunitySummary } from "@/lib/editorial/opportunity-model";
import { writeOpportunity } from "./actions";

type QueueFilter="all"|"attention"|"published"|"draft";

export function OpportunityQueue({rows,mode="regular"}:{rows:OpportunitySummary[];mode?:"regular"|"expired"}) {
  const router=useRouter();
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState<QueueFilter>("all");
  const [deleting,setDeleting]=useState<string|null>(null);
  const [error,setError]=useState("");
  const visible=useMemo(()=>rows.filter(r=>{
    const search=!query.trim() || `${r.title} ${r.organizer}`.toLowerCase().includes(query.toLowerCase().trim());
    if(mode==="expired") return search && r.status==="expired";
    return search && (filter==="all" || filter==="attention"&&r.attention>0 || filter==="published"&&r.published || filter==="draft"&&!r.published);
  }),[rows,filter,query,mode]);

  async function deleteExpired(row:OpportunitySummary){
    if(deleting)return;
    if(!window.confirm(`HAPUS PERMANEN “${row.title}”?\n\nSeluruh draf, catatan sumber, dan data editorial tidak dapat dipulihkan. Tindakan ini hanya untuk lomba yang tenggatnya sudah lewat.`))return;
    setDeleting(row.id);setError("");
    try{
      const result=await writeOpportunity(row.id,row.version,"delete");
      if("error" in result && result.error){setError(result.error);return;}
      router.refresh();
    }catch(e){setError(e instanceof Error?e.message:"Penghapusan gagal. Coba lagi.");}
    finally{setDeleting(null);}
  }

  return <>
    <div className="red-queue-controls"><input type="search" aria-label="Cari berkas lomba" placeholder="Cari nama lomba atau penyelenggara…" value={query} onChange={e=>setQuery(e.target.value)}/>
      {mode==="regular"&&<div className="red-queue-tabs" aria-label="Filter status editorial">{([
        ["all","Semua"],["attention","Perlu diperiksa"],["published","Terbit"],["draft","Belum terbit"],
      ] as const).map(([v,l])=><button key={v} type="button" className={filter===v?"active":""} aria-pressed={filter===v} onClick={()=>setFilter(v)}>{l}</button>)}</div>}
    </div>
    {error&&<p className="red-flash red-flash-error" role="alert">{error}</p>}
    {visible.length ? <div className="red-opportunity-list">{visible.map(r=>mode==="expired"?
      <div className="red-expired-row" key={r.id}>
        <div><strong>{r.title}</strong><small>{r.organizer||"Penyelenggara belum diisi"} · Tenggat pada draf: {r.deadline||"Belum ditetapkan"}</small>
          <small>{r.expiredAt?`Ditarik otomatis ${new Date(r.expiredAt).toLocaleString("id-ID",{timeZone:"Asia/Jakarta",day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})} WIB`:
            "Penyaringan tanggal WIB sudah berlaku; penarikan arsip permanen menunggu penjadwal."}</small></div>
        <div className="red-expired-actions"><span className="red-warn">Tenggat terlewati</span>
          <Link href={`/admin/review/cari-lomba/${r.id}`}>Sunting / Terbitkan ulang</Link>
          <button type="button" className="red-danger" onClick={()=>deleteExpired(r)} disabled={deleting!==null}>{deleting===r.id?"Menghapus…":"Hapus permanen"}</button>
        </div>
      </div>
      :<Link key={r.id} href={`/admin/review/cari-lomba/${r.id}`}>
        <div><strong>{r.title}</strong><small>{r.organizer||"Penyelenggara belum diisi"} · Disunting {new Date(r.updated).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</small></div>
        <div className="red-opportunity-chips"><span className={r.status==="published"?"red-good":r.status==="withdrawn"?"red-warn":"red-muted"}>{r.status==="published"?"Terbit":r.status==="withdrawn"?"Ditarik":"Draf"}</span>{r.attention>0&&<span className="red-warn">{r.attention} perhatian</span>}<span>→ Sunting</span></div>
      </Link>)}</div>
      : <div className="red-empty">{mode==="expired"?"Belum ada lomba dengan tenggat terlewati.":"Tidak ada lomba pada pencarian atau filter ini."}</div>}
    <p className="red-note">Menampilkan {visible.length} dari {rows.length} berkas editorial. {mode==="expired"?"Berkas tetap tersimpan sampai dihapus secara sadar; tidak ada penghapusan otomatis.":"Perubahan hanya tampil ke publik setelah tombol Terbitkan ditekan."}</p>
  </>;
}
