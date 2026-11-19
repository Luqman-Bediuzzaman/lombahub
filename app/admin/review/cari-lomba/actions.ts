"use server";
import {revalidatePath} from "next/cache";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { isOwner, requireOwner } from "@/lib/editorial/owner";
import { emptyOpportunity, type OpportunityDraft } from "@/lib/editorial/opportunity-model";
import { createOpportunity, readOpportunity, changeOpportunity } from "@/lib/editorial/opportunity-store";
import { validateOpportunity } from "@/lib/editorial/opportunity-validate";

export async function startOpportunity() {
  await requireOwner();
  const id=randomUUID();
  await createOpportunity(id,emptyOpportunity());
  redirect("/admin/review/cari-lomba/"+id);
}
export async function writeOpportunity(id:string,version:number,action:"save"|"publish"|"withdraw"|"delete",input?:OpportunityDraft) {
  if(!(await isOwner())) return {error:"Sesi redaksi berakhir. Masuk kembali sebelum menyimpan."};
  try {
    const row=await readOpportunity(id);
    if(!row) throw new Error("Draf lomba tidak ditemukan.");
    if(row.version!==version) throw new Error("Draf telah diperbarui di sesi lain. Salin naskah Anda sebelum memuat ulang.");
    const d=action==="save"||action==="publish" ? validateOpportunity(input) : undefined;
    const next=await changeOpportunity(row,version,action,d);
    if(action==="publish" || action==="withdraw")revalidatePath("/","layout");
    else revalidatePath("/admin/review/cari-lomba");
    return {version:next.version,live:next.live,updated:next.updated,deleted:action==="delete"};
  } catch(e) {return {error:e instanceof Error?e.message:"Penyimpanan gagal."};}
}
