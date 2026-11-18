"use server";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { endSession, isOwner, requireOwner } from "@/lib/editorial/owner";
import { addMedia, changeRow, createRow, mediaOwner, readRow, uuid } from "@/lib/editorial/store";
import { emptyDraft, makeStory, mediaIds, publicationIssue, type Draft } from "@/lib/editorial/model";
import { validateDraft } from "@/lib/editorial/validate";

export async function logout() { await endSession(); redirect("/admin/masuk"); }
export async function startStory() {
  await requireOwner();
  const id=randomUUID();
  await createRow(id,{...emptyDraft(),title:"Kisah tanpa judul"});
  redirect("/admin/review/kisah-juara/"+id);
}
export async function writeStory(id:string,version:number,action:"save"|"publish"|"withdraw"|"delete",input?:Draft) {
  if (!(await isOwner())) return {error:"Sesi berakhir. Masuk lagi di tab baru, lalu ulangi penyimpanan."};
  try {
    const row=await readRow(id);
    if (!row || row.version!==version) throw new Error("Versi berubah atau kisah telah dihapus. Salin tulisan Anda sebelum memuat ulang.");
    if (action==="save" || action==="publish") {
      const d=validateDraft(input);
      const ids=[...new Set(mediaIds(d))];
      for (const photo of ids) if (!uuid.test(photo) || await mediaOwner(photo)!==id) throw new Error("Foto tidak terdaftar pada kisah ini.");
      row.draft=d;
      if (action==="publish") {
        const issue=publicationIssue(d);
        if (issue) throw new Error(issue);
        const live=makeStory(d,id,row.live);
        live.slug=row.first_slug??live.slug;live.publishedAt=row.first_published??live.publishedAt;
        row.live=live;row.live_media=ids;row.first_slug=live.slug;row.first_published=live.publishedAt;
      }
    } else if (action==="withdraw") {row.live=null;row.live_media=[];}
    else if (action!=="delete") throw new Error("Tindakan tidak tersedia.");
    await changeRow(row,action==="delete");
    return {version:row.version,live:row.live};
  } catch (err) { return {error:err instanceof Error ? err.message : "Gagal menyimpan kisah."}; }
}
export async function uploadPhoto(storyId:string,data:FormData) {
  if (!(await isOwner())) return {error:"Masuk kembali untuk mengunggah foto."};
  try {
    if (!uuid.test(storyId) || !await readRow(storyId)) throw new Error("Draf tidak ditemukan.");
    const f=data.get("foto");
    if (!(f instanceof File)||f.size>700000||f.size<4) throw new Error("Ukuran foto tidak sesuai.");
    const bytes=Buffer.from(await f.arrayBuffer());
    if (bytes[0]!==255||bytes[1]!==216||bytes[2]!==255) throw new Error("Foto harus berupa JPEG.");
    const id=randomUUID();await addMedia(id,storyId,bytes.toString("base64"));
    return {src:"/api/kisah-media/"+id};
  } catch (err) { return {error:err instanceof Error?err.message:"Unggahan gagal."}; }
}
