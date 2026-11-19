import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import type { WinnerStory } from "../stories";
import { getPublicStories } from "../stories";
import type { Draft, StoryRow } from "./model";

export const uuid = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;
type Row = StoryRow & { live_media:string[]; first_slug:string|null; first_published:string|null };
const conflict = "Perubahan belum disimpan. Versi di server sudah berubah. Salin tulisan Anda sebelum memuat ulang.";
function remote() {
  const base=process.env.JEJAKARSA_DB_URL?.replace(/\/$/,""), key=process.env.JEJAKARSA_DB_KEY;
  if (base && key) return {base,key};
  if (base || key || process.env.NODE_ENV==="production") throw new Error("Penyimpanan redaksi belum dikonfigurasi.");
  return null;
}
async function rest(table:string,query:string,method="GET",data?:unknown) {
  const r=remote()!;
  const headers:Record<string,string>={apikey:r.key,"Content-Type":"application/json",Prefer:"return=representation"};
  if (!r.key.startsWith("sb_secret_")) headers.Authorization="Bearer "+r.key;
  const res=await fetch(r.base+"/rest/v1/"+table+"?"+query,{method,headers,cache:"no-store",body:data===undefined?undefined:JSON.stringify(data)});
  if (!res.ok) throw new Error("Penyimpanan redaksi tidak dapat diakses. Periksa koneksi dan konfigurasi.");
  return res.json();
}
let local:DatabaseSync|undefined;
async function db() {
  if (local) return local;
  const {DatabaseSync}=await import("node:sqlite");
  if (local) return local;
  const dir=path.resolve(".jejakarsa-local");
  mkdirSync(dir,{recursive:true});
  local=new DatabaseSync(path.join(dir,"editor.sqlite"));
  local.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=4000; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS stories (id TEXT PRIMARY KEY, version INTEGER NOT NULL,data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY,story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,jpeg TEXT NOT NULL)");
  local.exec(`CREATE TABLE IF NOT EXISTS state (name TEXT PRIMARY KEY);
    CREATE TRIGGER IF NOT EXISTS remember_publication AFTER UPDATE ON stories
    WHEN json_extract(new.data,'$.live') IS NOT NULL BEGIN
    INSERT OR IGNORE INTO state VALUES('published'); END;`);
  return local;
}
export async function readRow(id:string):Promise<Row|null> {
  if (!uuid.test(id)) return null;
  if (remote()) return (await rest("jk_stories","id=eq."+id))[0]??null;
  const row=(await db()).prepare("SELECT data FROM stories WHERE id=?").get(id);
  return row?JSON.parse(String(row.data)):null;
}
interface StorySummary {
  id: string;
  title: string | null;
  participants: string | null;
  competition: string | null;
  campus: string | null;
  category: string | null;
  updated: string;
  slug: string | null;
  first_slug: string | null;
}

export async function summaries(): Promise<StorySummary[]> {
  if (remote()) {
    const fields = "id,title:draft->>title,participants:draft->>participants,competition:draft->>competition,campus:draft->>campus,category:draft->>category,updated,slug:live->>slug,first_slug";
    const list: StorySummary[] = [];
    for (;;) {
      const page: StorySummary[] = await rest("jk_stories", `select=${fields}&order=updated.desc,id.asc&limit=100&offset=${list.length}`);
      if (!page.length) return list;
      list.push(...page);
    }
  }
  return (await db()).prepare(`
    SELECT id, json_extract(data,'$.draft.title') AS title,
      json_extract(data,'$.draft.participants') AS participants,
      json_extract(data,'$.draft.competition') AS competition,
      json_extract(data,'$.draft.campus') AS campus,
      json_extract(data,'$.draft.category') AS category,
      json_extract(data,'$.updated') AS updated,
      json_extract(data,'$.live.slug') AS slug,
      json_extract(data,'$.first_slug') AS first_slug
    FROM stories ORDER BY updated DESC, id ASC
  `).all() as unknown as StorySummary[];
}
export async function publicStories():Promise<WinnerStory[]> {
  // An unconfigured deployment can still serve the original prototype.
  if (!process.env.JEJAKARSA_DB_URL && !process.env.JEJAKARSA_DB_KEY && (!process.env.JEJAKARSA_OWNER_KEY || process.env.NODE_ENV==="production")) return getPublicStories();
  const stories:WinnerStory[]=[];
  if (remote()) {
    for (let offset=0;;) {
      const rows:{live:WinnerStory}[]=await rest("jk_stories","select=live&live=not.is.null&order=id&limit=100&offset="+offset);
      stories.push(...rows.map(r=>r.live));
      if (rows.length<100) break;
      offset+=rows.length;
    }
  } else {
    for (const row of (await db()).prepare("SELECT json_extract(data,'$.live') AS live FROM stories WHERE live IS NOT NULL").all()) stories.push(JSON.parse(String(row.live)));
  }
  if (!stories.length) {
    const launched=remote() ? (await rest("jk_editor_state","select=launched&id=eq.1"))[0]?.launched :
      !!(await db()).prepare("SELECT 1 FROM state WHERE name='published'").get();
    if (!launched) return getPublicStories();
  }
  return stories.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)||a.slug.localeCompare(b.slug));
}
export async function createRow(id:string,draft:Draft) {
  const row:Row={id,draft,version:1,live:null,live_media:[],updated:new Date().toISOString(),first_slug:null,first_published:null};
  if (remote()) await rest("jk_stories","select=id","POST",row);
  else (await db()).prepare("INSERT INTO stories VALUES (?,?,?)").run(id,1,JSON.stringify(row));
}
export async function changeRow(row:Row,remove=false) {
  const old=row.version;row.version++;row.updated=new Date().toISOString();
  if (remote()) {
    const rows=await rest("jk_stories",`id=eq.${row.id}&version=eq.${old}&select=id`,remove?"DELETE":"PATCH",remove?undefined:row);
    if (!rows.length) throw new Error(conflict);
  } else {
    const conn=await db();
    const result=remove?conn.prepare("DELETE FROM stories WHERE id=? AND version=?").run(row.id,old):
      conn.prepare("UPDATE stories SET version=?,data=? WHERE id=? AND version=?").run(row.version,JSON.stringify(row),row.id,old);
    if (!result.changes) throw new Error(conflict);
  }
}
export async function addMedia(id:string,story_id:string,jpeg:string) {
  if (remote()) await rest("jk_media","select=id","POST",{id,story_id,jpeg});
  else (await db()).prepare("INSERT INTO media VALUES(?,?,?)").run(id,story_id,jpeg);
}
export async function mediaOwner(id:string):Promise<string|null> {
  if (remote()) return (await rest("jk_media","select=story_id&id=eq."+id))[0]?.story_id??null;
  return (await db()).prepare("SELECT story_id FROM media WHERE id=?").get(id)?.story_id as string??null;
}
export async function readMedia(id:string,owner:boolean) {
  if (!uuid.test(id)) return null;
  if (remote()) {
    // Join applies the published-media condition at the same snapshot as the bytes.
    const filter=owner?"select=jpeg":"select=jpeg,jk_stories!inner(id)&jk_stories.live_media=cs.{"+id+"}";
    return (await rest("jk_media","id=eq."+id+"&"+filter))[0]?.jpeg as string??null;
  }
  const conn=await db();
  return conn.prepare("SELECT jpeg FROM media JOIN stories ON stories.id=media.story_id WHERE media.id=? AND (?=1 OR media.id IN (SELECT value FROM json_each(stories.data,'$.live_media')))").get(id,Number(owner))?.jpeg as string??null;
}
