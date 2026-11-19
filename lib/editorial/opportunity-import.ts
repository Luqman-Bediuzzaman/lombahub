/** Safe draft-only bridge for structured suggestions from a browser AI extension.
 * No API connection or automatic verification is involved.
 */
import type { OpportunityDraft } from "./opportunity-model";
import { validateOpportunity } from "./opportunity-validate";

function object(input:unknown):Record<string,unknown> {
  if (!input || typeof input!=="object" || Array.isArray(input)) throw new Error("Paket impor harus berupa objek JSON.");
  return input as Record<string,unknown>;
}
function rows(input:unknown,label:string):Record<string,unknown>[] {
  if (!Array.isArray(input)) throw new Error(`${label} harus berupa daftar (array JSON).`);
  return input.map(object);
}
const plainFields: (keyof OpportunityDraft)[] = [
  "title","edition","organizer","submitter","category","discipline","summary","description","theme","prize",
  "scope","level","eligibilityIndonesia","institutionRules","regionRules","participation","minTeamSize","maxTeamSize",
  "feeStatus","feeAmount","currency","feeUnit","feeNote","mode","location","deadline","deadlineTime","timezone",
  "submissionDeadline","registrationUrl","guideUrl","posterUrl","verificationNote",
];
export function importOpportunityProposal(input:string,current:OpportunityDraft):OpportunityDraft {
  if (input.length>120000) throw new Error("Usulan AI terlalu panjang; maksimal 120.000 karakter.");
  let parsed:unknown;
  try {parsed=JSON.parse(input);}catch {throw new Error("Format JSON belum benar. Periksa koma dan tanda kutip.");}
  const raw=object(parsed);
  const next:Record<string,unknown>={...current};
  for (const key of plainFields) if (Object.prototype.hasOwnProperty.call(raw,key)) next[key]=raw[key];
  const alias=new Map<string,string>();
  let sources=current.sources;
  if (raw.sources!==undefined) {
    sources=rows(raw.sources,"sources").map((s,i)=>{
      const id=crypto.randomUUID();
      if (typeof s.id==="string") alias.set(s.id,id);
      alias.set(String(i),id);
      return {id,title:s.title||"",url:s.url||"",kind:s.kind||"Pengumuman resmi",checkedAt:"",note:s.note||""};
    }) as OpportunityDraft["sources"];
    next.sources=sources;
  }
  const findSource=(v:unknown)=>{
    if(typeof v==="number")return alias.get(String(v))||"";
    if(typeof v!=="string")return "";
    if(alias.has(v))return alias.get(v)||"";
    if(sources.some(s=>s.id===v))return v;
    return sources.find(s=>s.title.toLowerCase()===v.toLowerCase())?.id||"";
  };
  if(raw.requirements!==undefined) next.requirements=rows(raw.requirements,"requirements").map(r=>({
    id:crypto.randomUUID(), label:r.label||"",field:r.field||"submission",value:r.value||"",rule:r.rule||"manual",
    allowedPrograms:Array.isArray(r.allowedPrograms)?r.allowedPrograms.join("\n"):r.allowedPrograms||"",
    sourceId:findSource(r.sourceId??r.sourceIndex??r.sourceTitle),location:r.location||"",quote:r.quote||"",
    review:"unverified",note:r.note||"",
  }));
  if(raw.preparation!==undefined) next.preparation=rows(raw.preparation,"preparation").map((p,i)=>({
    id: typeof p.id==="string" && current.preparation.some(x=>x.id===p.id) ? p.id :
      current.preparation.find(x=>x.title===p.title)?.id || crypto.randomUUID(),
    title:p.title||"",detail:p.detail||"",mandatory:p.mandatory===true,
    sourceId:findSource(p.sourceId??p.sourceIndex??p.sourceTitle),
  }));
  if(raw.stages!==undefined) next.stages=rows(raw.stages,"stages").map(x=>({
    id:crypto.randomUUID(),title:x.title||"",date:x.date||"",mode:x.mode||"Online",location:x.location||"",
  }));
  // AI may also change a scalar referenced by an existing checked rule.
  // Revoke every prior editorial assertion before accepting the imported draft.
  next.requirements=(next.requirements as OpportunityDraft["requirements"]).map(r=>({...r,review:"unverified"}));
  return validateOpportunity(next);
}
