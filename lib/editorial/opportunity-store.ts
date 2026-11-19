import "server-only";
import {cache} from "react";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { competitions as demo } from "../demo-data";
import type { Competition } from "../types";
import { emptyOpportunity, editorialIssues, toPublishedCompetition, type OpportunityDraft, type OpportunityRow, type OpportunitySummary } from "./opportunity-model";

const uuid=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const conflict="Versi server sudah berubah. Salin perubahan Anda sebelum memuat ulang halaman.";

function remote(){
  const base=process.env.JEJAKARSA_DB_URL?.replace(/\/$/,""),key=process.env.JEJAKARSA_DB_KEY;
  if (base && key) return {base,key};
  if (base || key || process.env.NODE_ENV==="production") throw new Error("Penyimpanan editorial belum dikonfigurasi. Periksa JEJAKARSA_DB_URL dan JEJAKARSA_DB_KEY.");
  return null;
}
async function rest(table:string,query:string,method:"GET"|"POST"|"PATCH"|"DELETE"="GET",data?:unknown):Promise<unknown> {
  const r=remote();if (!r) throw new Error("Konfigurasi server tidak tersedia.");
  const headers:Record<string,string>={apikey:r.key,"Content-Type":"application/json",Prefer:"return=representation"};
  if (!r.key.startsWith("sb_secret_")) headers.Authorization="Bearer "+r.key;
  const res=await fetch(r.base+"/rest/v1/"+table+"?"+query,{method,headers,cache:"no-store",body:data===undefined?undefined:JSON.stringify(data)});
  if (!res.ok) throw new Error(`Basis data lomba tidak dapat diakses (${res.status}). Pastikan migrasi editorial/cari-lomba.sql telah dijalankan.`);
  return res.json();
}
let local:DatabaseSync|undefined;
async function db():Promise<DatabaseSync> {
  if(local) return local;
  const { DatabaseSync }=await import("node:sqlite");
  if(local) return local;
  const dir=path.resolve(".jejakarsa-local");mkdirSync(dir,{recursive:true});
  const conn=new DatabaseSync(path.join(dir,"editor.sqlite"));
  conn.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=4000;
    CREATE TABLE IF NOT EXISTS opportunities (id TEXT PRIMARY KEY, version INTEGER NOT NULL, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS opportunity_state (name TEXT PRIMARY KEY);
    CREATE TRIGGER IF NOT EXISTS remember_opportunity_publication AFTER UPDATE ON opportunities
    WHEN json_extract(new.data,'$.live') IS NOT NULL BEGIN
      INSERT OR IGNORE INTO opportunity_state VALUES('published');
    END;`);
  local=conn;return conn;
}

export async function readOpportunity(id:string):Promise<OpportunityRow|null> {
  if(!uuid.test(id)) return null;
  if(remote()) return ((await rest("jk_opportunities","id=eq."+id)) as OpportunityRow[])[0]||null;
  const row=(await db()).prepare("SELECT data FROM opportunities WHERE id=?").get(id);
  return row?JSON.parse(String(row.data)) as OpportunityRow:null;
}
export async function opportunitySummaries():Promise<OpportunitySummary[]> {
  const rows:OpportunitySummary[]=[];
  function add(row:OpportunityRow){
    const checks=editorialIssues(row.draft);
    rows.push({id:row.id,title:row.draft.title||"Lomba tanpa judul",organizer:row.draft.organizer,
      updated:row.updated,published:!!row.live,status:row.live?"published":row.first_published?"withdrawn":"draft",
      sourceCount:row.draft.sources.length,attention:checks.blocking.length+checks.warnings.length});
  }
  if(remote()){
    // Read only the fields needed by the queue. In particular, leave poster binaries on the server.
    const fields=Object.keys(emptyOpportunity()).filter(k=>k!=="posterUpload");
    const select=["id","updated","first_published","published:live->>slug",...fields.map(k=>k+":draft->"+k)].join(",");
    for(let offset=0;;){
      const chunk=await rest("jk_opportunities", "select="+select+"&order=updated.desc,id&limit=50&offset="+offset) as (OpportunityDraft & {id:string;updated:string;first_published:string|null;published:string|null})[];
      for(const record of chunk){
        const checks=editorialIssues(record);
        rows.push({id:record.id,title:record.title||"Lomba tanpa judul",organizer:record.organizer,updated:record.updated,
          published:!!record.published,status:record.published?"published":record.first_published?"withdrawn":"draft",
          sourceCount:record.sources.length,attention:checks.blocking.length+checks.warnings.length});
      }
      if(chunk.length<50)break;
      offset+=chunk.length;
    }
  } else {
    const result=(await db()).prepare("SELECT json_remove(data,'$.draft.posterUpload','$.poster_live') AS data FROM opportunities ORDER BY json_extract(data,'$.updated') DESC").all();
    for(const row of result)add(JSON.parse(String(row.data)));
  }
  return rows;
}
export async function createOpportunity(id:string,draft:OpportunityDraft) {
  if(!uuid.test(id)) throw new Error("ID lomba tidak valid.");
  const row:OpportunityRow={id,version:1,draft,live:null,updated:new Date().toISOString(),first_slug:null,first_published:null};
  if(remote()) await rest("jk_opportunities","select=id","POST",row);
  else (await db()).prepare("INSERT INTO opportunities (id,version,data) VALUES (?,?,?)").run(id,1,JSON.stringify(row));
}
export async function changeOpportunity(row:OpportunityRow,version:number,action:"save"|"publish"|"withdraw"|"delete",draft?:OpportunityDraft):Promise<OpportunityRow> {
  if(row.version!==version) throw new Error(conflict);
  if(action==="save"||action==="publish") {
    if(!draft) throw new Error("Isi draf belum tersedia.");
    row.draft=draft;
    if(action==="publish") {
      const {blocking}=editorialIssues(draft);
      if(blocking.length) throw new Error(blocking.join(" "));
      const now=new Date().toISOString();
      row.live=toPublishedCompetition(draft,row.id,row.live,now);
      // A withdrawn record keeps its original permalink and first publication date.
      row.poster_live=draft.posterUpload || null;
      if(row.poster_live)row.live.posterUrl="/api/poster-lomba/"+row.id+"?v="+(version+1);
      row.live.slug=row.first_slug||row.live.slug;
      row.live.publishedAt=row.first_published||row.live.publishedAt;
      row.first_slug=row.live.slug;row.first_published=row.live.publishedAt;
    }
  } else if(action==="withdraw") {row.live=null;row.poster_live=null;}
  else if(action==="delete") {
    if(row.first_published) throw new Error("Lomba yang pernah terbit tidak dapat dihapus agar riwayat tautannya stabil. Gunakan Tarik terbitan.");
  } else throw new Error("Tindakan tidak dikenali.");
  const previous=row.version;row.version++;row.updated=new Date().toISOString();
  if(remote()) {
    const rows=await rest("jk_opportunities",`id=eq.${row.id}&version=eq.${previous}&select=id`,action==="delete"?"DELETE":"PATCH",action==="delete"?undefined:row) as {id:string}[];
    if(!rows.length) throw new Error(conflict);
  } else {
    const conn=await db();
    const result=action==="delete" ? conn.prepare("DELETE FROM opportunities WHERE id=? AND version=?").run(row.id,previous):
      conn.prepare("UPDATE opportunities SET version=?,data=? WHERE id=? AND version=?").run(row.version,JSON.stringify(row),row.id,previous);
    if(!result.changes) throw new Error(conflict);
    if(action==="publish") conn.prepare("INSERT OR IGNORE INTO opportunity_state VALUES ('published')").run();
  }
  return row;
}

export type PublicCatalog={items:Competition[];mode:"demo"|"live"};
export const publicCatalog=cache(async ():Promise<PublicCatalog>=>{
  if(process.env.JEJAKARSA_KATALOG_LIVE!=="1") return {items:demo,mode:"demo"};
  if(!process.env.JEJAKARSA_DB_URL && !process.env.JEJAKARSA_DB_KEY && process.env.NODE_ENV==="production") {
    throw new Error("Katalog editorial memerlukan penyimpanan server.");
  }
  if(remote()) {
    const records:Competition[]=[];
    for(let offset=0;;) {
      const chunk=await rest("jk_opportunities",`select=live&live=not.is.null&order=id&limit=100&offset=${offset}`) as {live:Competition}[];
      records.push(...chunk.map(r=>r.live));
      if(chunk.length<100) break;offset+=chunk.length;
    }
    if(records.length) return {items:records.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)),mode:"live"};
    const state=await rest("jk_opportunity_state","select=launched&id=eq.1") as {launched:boolean}[];
    return state[0]?.launched?{items:[],mode:"live"}:{items:demo,mode:"demo"};
  }
  const conn=await db();
  const live=conn.prepare("SELECT json_extract(data,'$.live') AS live FROM opportunities WHERE json_extract(data,'$.live') IS NOT NULL").all()
    .map(r=>JSON.parse(String(r.live)) as Competition);
  if(live.length) return {items:live.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)),mode:"live"};
  const launched=!!conn.prepare("SELECT 1 FROM opportunity_state WHERE name='published'").get();
  return launched?{items:[],mode:"live"}:{items:demo,mode:"demo"};
});

export async function publishedPoster(id:string):Promise<string|null> {
  if(process.env.JEJAKARSA_KATALOG_LIVE!=="1" || !uuid.test(id))return null;
  if(remote()){
    const rows=await rest("jk_opportunities","select=poster_live&live=not.is.null&id=eq."+id) as {poster_live:string|null}[];
    return rows[0]?.poster_live??null;
  }
  const row=(await db()).prepare("SELECT json_extract(data,'$.poster_live') AS image FROM opportunities WHERE id=? AND json_extract(data,'$.live') IS NOT NULL").get(id);
  return typeof row?.image==="string"?row.image:null;
}
