import { requireOwner } from "@/lib/editorial/owner";
import { notFound } from "next/navigation";
import { readOpportunity } from "@/lib/editorial/opportunity-store";
import { OpportunityEditor } from "./editor";
export const dynamic="force-dynamic";
export default async function EditOpportunity({params}:{params:Promise<{id:string}>}) {
  await requireOwner();
  const {id}=await params;
  let row;
  try {row=await readOpportunity(id);}catch{return <p role="alert">Draf belum dapat dibuka. Periksa koneksi penyimpanan lalu muat ulang halaman ini.</p>;}
  if(!row) notFound();
  return <OpportunityEditor row={row} publicEnabled={process.env.JEJAKARSA_KATALOG_LIVE==="1"}/>;
}
