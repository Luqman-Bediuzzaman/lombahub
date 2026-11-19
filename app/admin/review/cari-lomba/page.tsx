import { requireOwner } from "@/lib/editorial/owner";
import Link from "next/link";
import { opportunitySummaries } from "@/lib/editorial/opportunity-store";
import { startOpportunity } from "./actions";
import { OpportunityQueue } from "./opportunity-queue";

export const dynamic="force-dynamic";
export default async function OpportunityDesk() {
  await requireOwner();
  let rows: Awaited<ReturnType<typeof opportunitySummaries>> = [];
  let unavailable=false;
  try { rows=await opportunitySummaries(); } catch(err) {console.error("Cari Lomba editorial queue:",err);unavailable=true;}
  const published=rows.filter(r=>r.published).length;
  const needReview=rows.filter(r=>r.attention>0).length;
  return <div className="red-opportunity-page">
    <div className="red-bar"><div><Link href="/admin/review">← Ruang redaksi</Link><h1>Editorial Cari Lomba</h1><p className="red-subtitle">Satu berkas untuk satu lomba. Draf pribadi dan versi terbit terpisah.</p></div>
      {!unavailable&&<form action={startOpportunity}><button className="red-primary" type="submit">+ Buat lomba</button></form>}</div>
    {unavailable&&<div className="red-flash red-flash-error" role="alert">Penyimpanan redaksi Cari Lomba belum dapat diakses. Jika pertama kali memasang di Vercel, jalankan <code>editorial/cari-lomba.sql</code> di SQL Editor Supabase, lalu periksa variabel server <code>JEJAKARSA_DB_URL</code> dan <code>JEJAKARSA_DB_KEY</code>. Tidak ada data yang diubah.</div>}
    {!unavailable&&<><div className="red-dashboard">
      <div><span>SELURUH BERKAS</span><strong>{rows.length}</strong></div>
      <div><span>SUDAH TERBIT</span><strong>{published}</strong></div>
      <div><span>MEMBUTUHKAN PERHATIAN</span><strong>{needReview}</strong></div>
    </div>
    <section className="red-panel"><h2>Daftar lomba</h2><p>Pemeriksaan dan publikasi disimpan di server. Data demo lama tidak diubah.</p>
      {rows.length ? <OpportunityQueue rows={rows}/> : <div className="red-empty">Belum ada lomba editorial. Pilih <strong>Buat lomba</strong> untuk memulai berkas pertama.</div>}
    </section><Link href="/admin/review/cari-lomba/contoh">Arsip kurasi contoh →</Link></>}
  </div>;
}
