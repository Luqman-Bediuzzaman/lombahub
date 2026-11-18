import Link from "next/link";
import { requireOwner } from "@/lib/editorial/owner";
import { summaries } from "@/lib/editorial/store";
import { startStory } from "../actions";
export default async function StoryDesk() {
  await requireOwner();
  let rows: Awaited<ReturnType<typeof summaries>>;
  try { rows=await summaries(); } catch {return <><Link href="/admin/review">← Ruang redaksi</Link><h1>Kisah Juara</h1><p role="alert">Penyimpanan redaksi belum tersedia. Periksa konfigurasi pada panduan pemasangan.</p></>;}
  return <><Link href="/admin/review">← Ruang redaksi</Link><div className="red-bar"><h1>Kisah Juara</h1><form action={startStory}><button className="button button-primary">Buat kisah</button></form></div>
    <div className="red-list panel">{rows.length?rows.map(r=><Link key={r.id} href={"/admin/review/kisah-juara/"+r.id}>
      <div><strong>{r.title}</strong><small>Disunting {new Intl.DateTimeFormat("id-ID",{dateStyle:"medium"}).format(new Date(r.updated))}</small></div><span>{r.published?"Terbit":"Draf"} ↗</span></Link>):
      <p>Belum ada kisah di ruang redaksi. Pilih <strong>Buat kisah</strong> untuk memulai wawancara pertama.</p>}</div></>;
}
