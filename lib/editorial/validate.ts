import { categories, emptyDraft, type Block, type Draft, type Span } from "./model";
import type { StoryCredit } from "../story-credits";

function object(v:unknown):Record<string,unknown> {
  if (typeof v!=="object" || v===null || Array.isArray(v)) throw new Error("Format data tidak dikenali.");
  return v as Record<string,unknown>;
}
function text(v:unknown,max=300) {
  if (typeof v!=="string" || v.length>max) throw new Error("Teks kosong atau terlalu panjang untuk kolom ini.");
  return v;
}
function list(v:unknown,max:number):unknown[] {
  if (!Array.isArray(v)||v.length>max) throw new Error("Jumlah bagian melebihi batas editor.");
  return v;
}
function choice<T extends string>(v:unknown,values:readonly T[]):T {
  if (!values.includes(v as T)) throw new Error("Pilihan tidak dikenali.");
  return v as T;
}
function media(v:unknown) {
  const s=text(v);
  if (s && !/^\/api\/kisah-media\/[0-9a-f-]{36}$/.test(s)) throw new Error("Foto harus diunggah melalui editor.");
  return s;
}
function spans(v:unknown):Span[] {
  return list(v,2000).map(item=>{const s=object(item);return {text:text(s.text,50000),bold:s.bold===true,italic:s.italic===true};});
}
function block(v:unknown):Block {
  const b=object(v);
  const kind=choice(b.kind,["p","h2","h3","quote","ol","ul","photo","divider","highlight","table"] as const);
  if (kind === "divider") return { kind };
  if (kind === "table") {
    const rows = list(b.rows, 80).map(row => list(row, 6).map(spans));
    const columns = rows[0]?.length;
    if (!columns || rows.length < 2 || rows.some(row => row.length !== columns)) {
      throw new Error("Tabel memerlukan kepala kolom dan baris isi dengan jumlah sel yang sama.");
    }
    return { kind, rows };
  }
  if (kind==="photo") { const src=media(b.src);if (!src) throw new Error("Foto artikel belum tersedia.");return {kind,src,caption:text(b.caption,500)}; }
  if (kind==="ol"||kind==="ul") return {kind,items:list(b.items,500).map(spans)};
  return {kind,spans:spans(b.spans)};
}
export function validateBody(input: unknown): Block[] {
  return list(input, 1000).map(block);
}

function credit(v:unknown):StoryCredit {
  const c=object(v);
  return {role:choice(c.role,["Narasumber","Mitra pengusul","Penulis"] as const),name:text(c.name),profiles:list(c.profiles??[],10).map(item=>{
    const p=object(item),url=text(p.url,2000).trim();
    if (url) {
      let parsed:URL;try {parsed=new URL(url);} catch {throw new Error("Periksa alamat profil sosial.");}
      if (!["https:","http:"].includes(parsed.protocol)||parsed.username||parsed.password) throw new Error("Gunakan tautan profil https://.");
    }
    return {platform:text(p.platform,80).trim(),url};
  })};
}
export function validateDraft(input:unknown):Draft {
  if (JSON.stringify(input).length>360000) throw new Error("Artikel terlalu panjang untuk satu kisah.");
  const r=object(input),d=emptyDraft();
  for (const k of ["title","cardTitle","coverLabel","caption","participants","competition","achievement","campus","level","year"] as const) d[k]=text(r[k],500).trim();
  if (!d.title) throw new Error("Isi judul terlebih dahulu.");
  d.category=choice(r.category,categories);
  d.accent=choice(r.accent,["moss","clay","slate"] as const);
  d.participantType=choice(r.participantType,["Tim","Individu"] as const);
  d.photo=media(r.photo);d.body=validateBody(r.body);d.credits=list(r.credits,80).map(credit);
  d.achievementChecked=r.achievementChecked===true;d.publicationApproved=r.publicationApproved===true;d.featured=r.featured===true;
  return d;
}
