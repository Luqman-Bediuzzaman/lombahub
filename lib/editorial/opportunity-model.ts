import type { Competition, EvidenceStatus, FeeStatus, Level, Participation, DeliveryMode, RequirementField } from "../types";

export type SourceKind = "Pengumuman resmi" | "Panduan" | "Poster resmi" | "Pendaftaran" | "Lainnya";
export type ReviewStatus = "verified" | "ambiguous" | "unverified";
export type Scope = "Belum disebutkan" | "Kampus" | "Lokal" | "Regional" | "Nasional" | "Internasional";
export type FeeUnit = "Per orang" | "Per tim" | "Per karya" | "Belum disebutkan";

export interface SourceEntry { id: string; title: string; url: string; kind: SourceKind; checkedAt: string; note: string }
export interface OpportunityRule {
  id: string; label: string; field: RequirementField; value: string;
  rule: "levels" | "all" | "programs" | "team" | "individual" | "free" | "paid" | "manual" | "unknown";
  allowedPrograms: string; sourceId: string; location: string; quote: string;
  review: ReviewStatus; note: string;
}
export interface PreparationItem { id: string; title: string; detail: string; mandatory: boolean; sourceId: string }
export interface EventStage { id: string; title: string; date: string; mode: DeliveryMode; location: string }

export interface OpportunityDraft {
  title: string; edition: string; organizer: string; submitter: string;
  category: string; discipline: string; summary: string; description: string;
  theme: string; prize: string; scope: Scope; level: Level[];
  eligibilityIndonesia: "Ya" | "Tidak" | "Belum dipastikan";
  institutionRules: string; regionRules: string;
  participation: Participation; minTeamSize: number | null; maxTeamSize: number | null;
  feeStatus: FeeStatus; feeAmount: number | null; currency: "IDR" | "USD" | "Lainnya";
  feeUnit: FeeUnit; feeNote: string;
  mode: DeliveryMode; location: string;
  deadline: string; deadlineTime: string; timezone: "WIB" | "WITA" | "WIT" | "UTC" | "Lainnya" | "Belum disebutkan";
  submissionDeadline: string;
  stages: EventStage[];
  registrationUrl: string; guideUrl: string; posterUrl: string; posterUpload?: string;
  sources: SourceEntry[]; requirements: OpportunityRule[]; preparation: PreparationItem[];
  verificationNote: string;
}

export interface OpportunityRow {
  poster_live?:string|null; id: string; version: number; draft: OpportunityDraft; live: Competition | null;
  updated: string; first_slug: string | null; first_published: string | null;
  /** Diisi ketika versi terbit ditarik karena melewati tanggal tenggat (WIB). */
  expired_at?: string | null;
}
export interface OpportunitySummary {
  id: string; title: string; organizer: string; updated: string; published: boolean;
  status: "draft" | "published" | "withdrawn" | "expired"; sourceCount: number; attention: number;
  version: number; deadline: string; expiredAt: string | null;
}

export const sourceKinds: SourceKind[] = ["Pengumuman resmi","Panduan","Poster resmi","Pendaftaran","Lainnya"];
export const scopes: Scope[] = ["Belum disebutkan","Kampus","Lokal","Regional","Nasional","Internasional"];
export const educationLevels: Level[] = ["SMA","D3","S1","S2","Umum"];
export const ruleFields: {value:RequirementField; label:string}[] = [
  {value:"educationLevel",label:"Jenjang pendidikan"}, {value:"studyProgram",label:"Program studi"},
  {value:"teamSize",label:"Jumlah anggota tim"}, {value:"fee",label:"Biaya pendaftaran"},
  {value:"region",label:"Wilayah / asal kampus"}, {value:"submission",label:"Ketentuan karya / pengumpulan"},
];
export const ruleKinds: OpportunityRule["rule"][] = ["manual","levels","all","programs","team","individual","free","paid","unknown"];
export const emptyOpportunity = ():OpportunityDraft => ({
  title:"",edition:"",organizer:"",submitter:"",category:"",discipline:"",summary:"",description:"",
  theme:"",prize:"",scope:"Belum disebutkan",level:[],eligibilityIndonesia:"Belum dipastikan",
  institutionRules:"",regionRules:"",participation:"Individu",minTeamSize:null,maxTeamSize:null,
  feeStatus:"Belum diketahui",feeAmount:null,currency:"IDR",feeUnit:"Belum disebutkan",feeNote:"",
  mode:"Online",location:"",deadline:"",deadlineTime:"",timezone:"Belum disebutkan",
  submissionDeadline:"",stages:[],registrationUrl:"",guideUrl:"",posterUrl:"",
  sources:[],requirements:[],preparation:[],verificationNote:"",
});

export function reviewedEvidence(rule:OpportunityRule, draft:OpportunityDraft): {status:EvidenceStatus;checkedAt:string;sourceTitle:string;sourceUrl:string} {
  const s=draft.sources.find(source=>source.id===rule.sourceId);
  const valid=!!s?.title.trim() && !!s?.url && !!s?.checkedAt && s.kind!=="Lainnya" && !!rule.quote.trim() && !!rule.location.trim();
  return { status: valid ? rule.review : "unverified", checkedAt:s?.checkedAt || "", sourceTitle:s?.title || "Sumber belum dipilih",sourceUrl:s?.url || "" };
}

export function resolvedRuleValue(r:OpportunityRule,d:OpportunityDraft):string {
  switch(r.rule) {
    case "levels":return d.level.length?d.level.join(" atau "):"Jenjang belum disebutkan";
    case "all":return "Seluruh program studi";
    case "programs":return r.allowedPrograms.split("\n").map(x=>x.trim()).filter(Boolean).join(", ")||"Daftar prodi belum diisi";
    case "team":return d.minTeamSize===null || d.maxTeamSize===null ? "Ukuran tim belum lengkap" : `${d.minTeamSize}–${d.maxTeamSize} orang`;
    case "individual":return "Individu";
    case "free":return "Gratis";
    case "paid":return d.feeAmount===null ? "Berbayar · nominal belum diumumkan" : `${d.currency} ${d.feeAmount.toLocaleString("id-ID")} ${d.feeUnit!=="Belum disebutkan"?d.feeUnit.toLowerCase():""}`.trim();
    default:return r.value;
  }
}

export function editorialIssues(d: OpportunityDraft):{blocking:string[];warnings:string[]} {
  const blocking:string[]=[];const warnings:string[]=[];
  if(d.sources.some(s=>!s.title.trim()||!s.url)) blocking.push("Lengkapi nama dan tautan setiap sumber atau hapus baris kosong.");
  if(d.preparation.some(p=>!p.title.trim())) blocking.push("Isi judul tiap langkah persiapan.");
  if(d.stages.some(s=>!s.title.trim())) blocking.push("Beri nama pada setiap tahap acara.");
  if(d.requirements.some(r=>!r.label.trim())) blocking.push("Beri nama pada setiap persyaratan.");
  if (!d.title.trim()) blocking.push("Nama resmi lomba belum diisi.");
  if (!d.organizer.trim()) blocking.push("Penyelenggara belum diisi.");
  if (!d.category.trim() || !d.discipline.trim()) blocking.push("Bidang dan disiplin belum lengkap.");
  if (!d.summary.trim() || !d.description.trim()) blocking.push("Ringkasan kartu dan tentang lomba belum lengkap.");
  if (!d.deadline || !/^\d{4}-\d{2}-\d{2}$/.test(d.deadline)) blocking.push("Tanggal penutupan pendaftaran belum ditetapkan.");
  if (!d.sources.some(s=>s.title.trim() && s.url && (s.kind==="Pengumuman resmi" || s.kind==="Panduan" || s.kind==="Poster resmi"))) blocking.push("Tambahkan setidaknya satu tautan sumber resmi.");
  if (d.requirements.some(r=>r.review==="verified" && reviewedEvidence(r,d).status!=="verified")) blocking.push("Lengkapi tanggal periksa, tautan, letak, dan kutipan sebelum menandai syarat sudah diperiksa.");
  if (!d.level.length) warnings.push("Jenjang peserta belum dinyatakan; pemeriksaan profil akan terbatas.");
  if (!d.requirements.length) warnings.push("Belum ada persyaratan beserta bukti yang diperiksa.");
  const missing=unrepresentedFields(d);
  if (missing.length) warnings.push("Data yang belum mempunyai butir pemeriksaan: "+missing.map(x=>x.label).join(", ")+". Kelayakannya akan ditandai perlu pemeriksaan.");
  const unreviewed=d.requirements.filter(r=>reviewedEvidence(r,d).status!=="verified");
  const ungrounded=d.preparation.filter(p=>p.mandatory && !d.sources.some(s=>s.id===p.sourceId && s.title.trim() && s.url && s.checkedAt && s.kind!=="Lainnya"));
  if(ungrounded.length) blocking.push(`${ungrounded.length} langkah wajib belum ditautkan ke sumber resmi yang sudah diperiksa. Simpan sebagai draf, atau ubah menjadi Saran redaksi.`);
  if (unreviewed.length) warnings.push(`${unreviewed.length} persyaratan masih perlu diperiksa atau diklarifikasi.`);
  if (d.feeStatus==="Berbayar" && d.feeAmount===null) warnings.push("Biaya berbayar: nominal belum diumumkan.");
  if (d.feeStatus==="Belum diketahui") warnings.push("Status biaya pendaftaran belum diketahui.");
  if (d.participation!=="Individu" && (!d.minTeamSize || !d.maxTeamSize)) warnings.push("Rentang anggota tim belum lengkap.");
  if (d.scope==="Internasional" && d.eligibilityIndonesia==="Belum dipastikan") warnings.push("Keikutsertaan mahasiswa Indonesia belum dipastikan.");
  if ((d.institutionRules || d.regionRules || d.scope==="Internasional") && !d.requirements.some(r=>r.field==="region")) warnings.push("Pembatasan asal kampus / wilayah belum memiliki butir persyaratan manual beserta sumber.");
  if (!d.registrationUrl) warnings.push("Tautan pendaftaran belum tersedia.");
  if (!d.preparation.length) warnings.push("Daftar persiapan belum dibuat.");
  if (!d.deadlineTime || d.timezone==="Belum disebutkan") warnings.push("Jam atau zona waktu tenggat belum diumumkan.");
  return {blocking,warnings};
}

function unrepresentedFields(d:OpportunityDraft):{id:string;field:RequirementField;label:string;value:string}[] {
  const exists=(f:RequirementField)=>d.requirements.some(r=>r.field===f);
  const gaps:{id:string;field:RequirementField;label:string;value:string}[]=[];
  if(!exists("educationLevel")) gaps.push({id:"audit-level",field:"educationLevel",label:"Jenjang pendidikan",value:d.level.length?d.level.join(", "):"Jenjang belum diketahui"});
  if(!exists("studyProgram")) gaps.push({id:"audit-program",field:"studyProgram",label:"Ketentuan program studi",value:"Periksa apakah ada pembatasan program studi"});
  if(!exists("teamSize")) gaps.push({id:"audit-team",field:"teamSize",label:"Bentuk kepesertaan",value:d.participation==="Individu"?"Individu":d.minTeamSize&&d.maxTeamSize?`${d.minTeamSize}–${d.maxTeamSize} orang`:"Jumlah anggota perlu diperiksa"});
  if(!exists("fee")) gaps.push({id:"audit-fee",field:"fee",label:"Biaya pendaftaran",value:d.feeStatus==="Berbayar"&&d.feeAmount===null?"Berbayar · nominal belum diumumkan":d.feeStatus});
  if(Boolean(d.institutionRules||d.regionRules||d.scope==="Internasional")&&!exists("region")) gaps.push({id:"audit-region",field:"region",label:"Asal kampus / wilayah peserta",value:[d.institutionRules,d.regionRules,d.scope==="Internasional"?`Partisipasi mahasiswa Indonesia: ${d.eligibilityIndonesia}`:""].filter(Boolean).join(" · ")||"Periksa asal institusi / wilayah"});
  return gaps;
}

function slug(text:string) {
  return text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70).replace(/-$/g,"") || "lomba";
}

export function toPublishedCompetition(d:OpportunityDraft, id:string, old:Competition|null, now:string):Competition {
  const originalSlug=old?.slug || `${slug(d.title)}-${id}`;
  const primary=d.sources.find(s=>s.kind==="Pengumuman resmi" && s.url) || d.sources.find(s=>s.kind==="Panduan" && s.url) || d.sources.find(s=>s.kind==="Poster resmi" && s.url) || d.sources[0];
  const statuses=d.requirements.map(r=>reviewedEvidence(r,d).status);
  const coverageGaps=unrepresentedFields(d);
  const verified=statuses.length>0 && statuses.every(s=>s==="verified") && coverageGaps.length===0;
  return {
    id,slug:originalSlug,title:d.title,organizer:d.organizer,category:d.category,discipline:d.discipline,
    level:d.level,participation:d.participation,minTeamSize:d.minTeamSize,maxTeamSize:d.maxTeamSize,
    feeStatus:d.feeStatus,feeAmount:d.feeStatus==="Gratis"?0:d.feeStatus==="Berbayar"?d.feeAmount:null,
    feeCurrency:d.currency,feeUnit:d.feeUnit,feeNote:d.feeNote,mode:d.mode,location:d.location,
    deadline:d.deadline,deadlineTime:d.deadlineTime,deadlineTimezone:d.timezone,submissionDeadline:d.submissionDeadline,
    publishedAt:old?.publishedAt||now.slice(0,10),updatedAt:now,summary:d.summary,description:d.description,
    theme:d.theme,prize:d.prize,scope:d.scope,eligibilityIndonesia:d.eligibilityIndonesia,
    institutionRules:d.institutionRules,regionRules:d.regionRules,edition:d.edition,
    eventStages:d.stages,posterUrl:d.posterUrl,registrationUrl:d.registrationUrl,guideUrl:d.guideUrl,
    sources:d.sources.map(({id,title,url,kind,checkedAt})=>({id,title,url,kind,checkedAt,note:""})),
    checklistItems:d.preparation,checklist:d.preparation.map(p=>p.title),
    requirements:[...d.requirements.map(r=>{ const ev=reviewedEvidence(r,d);return {
      id:r.id,label:r.label,field:r.field,value:resolvedRuleValue(r,d),rule:r.rule,
      allowedPrograms:r.allowedPrograms.split("\n").map(s=>s.trim()).filter(Boolean),
      evidence:{sourceTitle:ev.sourceTitle,sourceUrl:ev.sourceUrl,sourceId:r.sourceId,location:r.location,
        excerpt:r.quote,checkedAt:ev.checkedAt,status:ev.status},
    }; }),...coverageGaps.map(gap=>({
      id:gap.id,label:gap.label,field:gap.field,value:gap.value,rule:"manual",
      evidence:{sourceTitle:"Belum ada butir pemeriksaan",location:"Data editorial",excerpt:"",checkedAt:"",status:"unverified" as const,note:"Pastikan ketentuan ini melalui sumber resmi sebelum menyatakan kesesuaian peserta."},
    }))],
    sourceName:primary?.title||"Sumber belum tersedia",sourceUrl:primary?.url||"",
    verificationStatus:verified?"verified":"needs-review",
    verificationNote:d.verificationNote || (verified?"Persyaratan yang dicatat telah diperiksa terhadap sumber.":"Sebagian informasi masih perlu dikonfirmasi pada sumber resmi."),
  };
}
