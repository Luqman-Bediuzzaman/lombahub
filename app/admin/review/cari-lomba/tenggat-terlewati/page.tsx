import Link from "next/link";
import { requireOwner } from "@/lib/editorial/owner";
import { opportunitySummaries } from "@/lib/editorial/opportunity-store";
import { OpportunityQueue } from "../opportunity-queue";

export const dynamic="force-dynamic";
export const metadata={title:"Tenggat terlewati — Editorial Cari Lomba",robots:{index:false,follow:false}};

export default async function OverdueOpportunities() {
  await requireOwner();
  let rows: Awaited<ReturnType<typeof opportunitySummaries>>=[];
  let unavailable=false;
  try {rows=(await opportunitySummaries()).filter(row=>row.status==="expired");}
  catch(error){console.error("Tenggat terlewati:",error);unavailable=true;}
  return <div className="red-opportunity-page">
    <div className="red-bar"><div>
      <Link href="/admin/review/cari-lomba">← Editorial Cari Lomba</Link>
      <h1>Tenggat terlewati</h1>
      <p className="red-subtitle">Berkas lomba yang sudah melewati tanggal penutupan pendaftaran menurut WIB. Tidak ditampilkan di katalog atau detail publik, tetapi draf tetap tersedia untuk pemeriksaan.</p>
    </div></div>
    {unavailable?<p className="red-flash red-flash-error" role="alert">Daftar tenggat terlewati belum dapat dimuat. Periksa koneksi Supabase dan migrasi database, tanpa mengubah berkas Anda.</p>:
    <section className="red-panel">
      <div className="red-section-heading"><div><h2>{rows.length} berkas untuk diperiksa</h2><p>Perbarui tanggal dan terbitkan ulang jika periode pendaftaran diperpanjang, atau hapus permanen jika tidak lagi diperlukan.</p></div></div>
      <OpportunityQueue rows={rows} mode="expired"/>
    </section>}
  </div>;
}
