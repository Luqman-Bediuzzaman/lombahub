import {
  emptyOpportunity, educationLevels, ruleFields, ruleKinds, scopes, sourceKinds,
  type OpportunityDraft, type OpportunityRule,
} from "./opportunity-model";

function obj(v:unknown):Record<string,unknown> {
  if (!v || typeof v!=="object" || Array.isArray(v)) throw new Error("Format masukan tidak dikenali.");
  return v as Record<string,unknown>;
}
function str(v:unknown,limit=500):string {
  if (typeof v!=="string" || v.length>limit) throw new Error(`Kolom teks tidak valid (maksimal ${limit} karakter).`);
  return v.trim();
}
function arr(v:unknown,max=100):unknown[] {
  if (!Array.isArray(v)||v.length>max) throw new Error("Jumlah baris melebihi batas editorial.");
  return v;
}
function choice<T extends string>(v:unknown,choices:readonly T[]):T {
  if (!choices.includes(v as T)) throw new Error("Salah satu pilihan editor tidak dikenali.");
  return v as T;
}
function integer(v:unknown,allowNull=true,max=10000000000):number|null {
  if (v===null && allowNull) return null;
  if (typeof v!=="number" || !Number.isSafeInteger(v)||v<0||v>max) throw new Error("Nominal atau jumlah peserta tidak valid.");
  return v;
}
function url(v:unknown) {
  const s=str(v,2048); if (!s) return "";
  let parsed:URL;
  try {parsed=new URL(s);}catch {throw new Error("Tautan sumber, poster, atau pendaftaran tidak valid.");}
  if (parsed.protocol!=="https:" || parsed.username || parsed.password || !parsed.hostname.includes(".")) throw new Error("Gunakan alamat https:// resmi tanpa username/password.");
  return s;
}
function date(v:unknown) {
  const value=str(v,10);
  if (value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Tanggal harus valid (YYYY-MM-DD).");
    const parsed=new Date(value+"T12:00:00Z");
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10)!==value) throw new Error("Tanggal yang dimasukkan tidak ada di kalender.");
  }
  return value;
}
function stableId(v:unknown) {
  const s=str(v,60);
  if (!/^[a-zA-Z0-9_-]{6,60}$/.test(s)) throw new Error("ID baris tidak valid. Coba tambahkan kembali baris tersebut.");
  return s;
}
function unique<T>(xs:T[],id:(x:T)=>string,label:string) {
  if (new Set(xs.map(id)).size!==xs.length) throw new Error(`Ada ID ${label} yang berulang.`);
  return xs;
}
export function validateOpportunity(input:unknown):OpportunityDraft {
  if (JSON.stringify(input ?? {}).length>600000) throw new Error("Draf terlalu besar (maksimal 600 KB termasuk poster). Pisahkan materi atau lampiran.");
  const r=obj(input),d=emptyOpportunity();
  for (const k of ["title","edition","organizer","submitter","category","discipline","theme","prize","location","feeNote","institutionRules","regionRules","verificationNote"] as const) d[k]=str(r[k],k==="regionRules"||k==="institutionRules"||k==="verificationNote"?3000:500);
  d.summary=str(r.summary,800);d.description=str(r.description,20000);
  d.scope=choice(r.scope,scopes);
  d.level=unique(arr(r.level,5).map(x=>choice(x,educationLevels)),x=>x,"jenjang");
  d.eligibilityIndonesia=choice(r.eligibilityIndonesia,["Ya","Tidak","Belum dipastikan"] as const);
  d.participation=choice(r.participation,["Individu","Tim","Individu atau Tim"] as const);
  d.minTeamSize=integer(r.minTeamSize,true,1000);d.maxTeamSize=integer(r.maxTeamSize,true,1000);
  if (d.minTeamSize!==null && d.minTeamSize<1 || d.maxTeamSize!==null && d.maxTeamSize<1 || d.minTeamSize!==null && d.maxTeamSize!==null && d.maxTeamSize<d.minTeamSize) throw new Error("Rentang anggota tim tidak konsisten.");
  d.feeStatus=choice(r.feeStatus,["Gratis","Berbayar","Belum diketahui"] as const);
  const amount=r.feeAmount;
  if(amount!==null && (typeof amount!=="number" || !Number.isFinite(amount) || amount<0 || amount>1e10 || Math.abs(Math.round(amount*100)-amount*100)>0.0001))throw new Error("Nominal biaya harus angka positif dengan maksimal dua desimal.");
  d.feeAmount=amount;
  if (d.feeStatus==="Gratis") d.feeAmount=0;
  if (d.feeStatus==="Belum diketahui") d.feeAmount=null;
  if (d.feeStatus==="Berbayar" && d.feeAmount===0) throw new Error("Jika gratis, pilih status Gratis. Jika nominal belum diumumkan, biarkan nominal kosong.");
  d.currency=choice(r.currency,["IDR","USD","Lainnya"] as const);
  d.feeUnit=choice(r.feeUnit,["Per orang","Per tim","Per karya","Belum disebutkan"] as const);
  d.mode=choice(r.mode,["Online","Offline","Hybrid"] as const);
  d.deadline=date(r.deadline);d.submissionDeadline=date(r.submissionDeadline);
  d.deadlineTime=str(r.deadlineTime,5);
  if (d.deadlineTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(d.deadlineTime)) throw new Error("Jam tenggat tidak valid.");
  d.timezone=choice(r.timezone,["WIB","WITA","WIT","UTC","Lainnya","Belum disebutkan"] as const);
  d.registrationUrl=url(r.registrationUrl);d.guideUrl=url(r.guideUrl);d.posterUrl=url(r.posterUrl);
  if(r.posterUpload){
    const image=str(r.posterUpload,350000);
    if(!/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]+=*$/.test(image)) throw new Error("Pilih ulang berkas poster JPEG.");
    d.posterUpload=image;
  }
  d.sources=unique(arr(r.sources,60).map(x=>{const s=obj(x);return {
    id:stableId(s.id),title:str(s.title,180),url:url(s.url),kind:choice(s.kind,sourceKinds),checkedAt:date(s.checkedAt),note:str(s.note,1000),
  };}),x=>x.id,"sumber");
  const knownSources=new Set(d.sources.map(s=>s.id));
  d.requirements=unique(arr(r.requirements,100).map(x=>{const s=obj(x);const v:OpportunityRule={
    id:stableId(s.id),label:str(s.label,180),field:choice(s.field,ruleFields.map(f=>f.value)),
    value:str(s.value,500),rule:choice(s.rule,ruleKinds),
    allowedPrograms:str(s.allowedPrograms,5000),sourceId:str(s.sourceId,60),location:str(s.location,400),
    quote:str(s.quote,3000),review:choice(s.review,["verified","ambiguous","unverified"] as const),note:str(s.note,1500),
  };if (v.sourceId && !knownSources.has(v.sourceId)) throw new Error(`Sumber untuk ketentuan “${v.label}” tidak ditemukan.`);
  const allowed:Record<OpportunityRule["field"],OpportunityRule["rule"][]>={
    educationLevel:["levels","manual","unknown"],studyProgram:["all","programs","manual","unknown"],
    teamSize:["team","individual","manual","unknown"],fee:["free","paid","manual","unknown"],
    region:["manual","unknown"],submission:["manual","unknown"],
  };
  if (!allowed[v.field].includes(v.rule)) throw new Error(`Jenis aturan untuk “${v.label}” tidak sesuai dengan bidang pemeriksaan.`);
  if (v.rule==="programs" && !v.allowedPrograms.trim() && v.review==="verified") throw new Error(`Masukkan daftar program studi untuk “${v.label}”.`);
  if (v.rule==="free" && d.feeStatus!=="Gratis" || v.rule==="paid" && d.feeStatus!=="Berbayar" || v.rule==="individual" && d.participation==="Tim" || v.rule==="team" && d.participation==="Individu") throw new Error(`Aturan “${v.label}” bertentangan dengan data biaya atau bentuk peserta.`);
  if (v.review==="verified" && (!d.sources.find(y=>y.id===v.sourceId)?.url || !v.sourceId || !v.location || !v.quote || !(d.sources.find(y=>y.id===v.sourceId)?.title||"").trim() || !d.sources.find(y=>y.id===v.sourceId)?.checkedAt || d.sources.find(y=>y.id===v.sourceId)?.kind==="Lainnya")) throw new Error(`Ketentuan “${v.label}” baru boleh ditandai diperiksa setelah sumber resmi, tanggal, lokasi, dan kutipan diisi.`);
  return v;}),x=>x.id,"persyaratan");
  d.preparation=unique(arr(r.preparation,100).map(x=>{const s=obj(x);const v={
    id:stableId(s.id),title:str(s.title,400),detail:str(s.detail,1500),mandatory:s.mandatory===true,sourceId:str(s.sourceId,60),
  }; if (v.sourceId&&!knownSources.has(v.sourceId)) throw new Error(`Sumber pada langkah “${v.title}” tidak ditemukan.`);
  // Draf boleh belum lengkap. Kewajiban tanpa sumber menjadi peringatan pemeriksaan pra-terbit.
  return v;}),x=>x.id,"persiapan");
  d.stages=unique(arr(r.stages,30).map(x=>{const s=obj(x);return {
    id:stableId(s.id),title:str(s.title,200),date:date(s.date),
    mode:choice(s.mode,["Online","Offline","Hybrid"] as const),location:str(s.location,500),
  };}),x=>x.id,"tahap acara");
  return d;
}
