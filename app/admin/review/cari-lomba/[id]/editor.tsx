"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readPoster } from "./read-poster";
import { OpportunityDescription } from "@/components/opportunity-description";
import { writeOpportunity } from "../actions";
import {
  editorialIssues, toPublishedCompetition, resolvedRuleValue, educationLevels, ruleFields, ruleKinds, scopes, sourceKinds,
  type OpportunityDraft, type OpportunityRow, type SourceEntry, type OpportunityRule, type PreparationItem, type EventStage,
} from "@/lib/editorial/opportunity-model";
import { formatCurrency } from "@/lib/eligibility";
import { importOpportunityProposal } from "@/lib/editorial/opportunity-import";
import { isPastDeadlineWib } from "@/lib/editorial/opportunity-deadline";

function newId(){return crypto.randomUUID();}
function dateToday(){const d=new Date();const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,10);}
const docHint="Cocokkan angka dan kutipan dengan sumber asli sebelum menyimpan.";

function Input({title,value,onChange,placeholder,type="text",hint,required,disabled}: {title:string;value:string;onChange:(v:string)=>void;placeholder?:string;type?:string;hint?:string;required?:boolean;disabled?:boolean}){
  return <label className="red-input-label">{title}{required&&<span aria-label="Wajib diisi"> *</span>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}/>{hint&&<small>{hint}</small>}</label>;
}
function Multi({title,value,onChange,rows=3,placeholder,hint}: {title:string;value:string;onChange:(v:string)=>void;rows?:number;placeholder?:string;hint?:string}) {
  return <label className="red-input-label">{title}<textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>{hint&&<small>{hint}</small>}</label>;
}
const optionLabels:Record<string,string>={
  "":"— Pilih sumber —",manual:"Periksa manual",unknown:"Belum dapat disimpulkan",
  levels:"Ikuti daftar jenjang",all:"Semua program studi",programs:"Daftar prodi persis",team:"Batas jumlah tim",
  individual:"Pendaftaran individu",free:"Gratis",paid:"Berbayar",
  educationLevel:"Jenjang pendidikan",studyProgram:"Program studi",teamSize:"Ukuran tim",fee:"Biaya",
  region:"Wilayah / kampus",submission:"Ketentuan karya / pengumpulan",
  unverified:"Belum diperiksa",ambiguous:"Perlu klarifikasi",verified:"Sudah diperiksa",
};
function Select({title,value,onChange,options,labels}: {title:string;value:string;onChange:(v:string)=>void;options:readonly string[];labels?:Record<string,string>}) {
  return <label className="red-input-label">{title}<select value={value} onChange={e=>onChange(e.target.value)}>{options.map(x=><option key={x} value={x}>{labels?.[x]||optionLabels[x]||x}</option>)}</select></label>;
}
const integerInput=(v:number|null)=>v===null?"":String(v);
const interpretInteger=(s:string)=>s.trim()===""?null:Number(s);
const prepareLabel=(p:PreparationItem)=>p.mandatory?"Wajib dari panduan":"Saran redaksi";

export function OpportunityEditor({row,publicEnabled}:{row:OpportunityRow;publicEnabled:boolean}) {
  const router=useRouter();
  const [everPublished,setEverPublished]=useState(Boolean(row.first_published));
  const [draft,setDraft]=useState<OpportunityDraft>(row.draft);
  const [version,setVersion]=useState(row.version);
  const [live,setLive]=useState(row.live);
  const [expiredAt,setExpiredAt]=useState(row.expired_at??null);
  const deadlineExpired=Boolean(expiredAt) || Boolean(live&&isPastDeadlineWib(live.deadline));
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");
  const [error,setError]=useState("");
  const [dirty,setDirty]=useState(false);
  const [importOpen,setImportOpen]=useState(false);
  const [manuscript,setManuscript]=useState("");
  const [proposal,setProposal]=useState("");
  const [openRule,setOpenRule]=useState<string|null>(null);
  const [openSource,setOpenSource]=useState<string|null>(null);
  const [openStep,setOpenStep]=useState<string|null>(null);
  const issues=useMemo(()=>editorialIssues(draft),[draft]);
  const preview=useMemo(()=>toPublishedCompetition(draft,row.id,live,new Date().toISOString()),[draft,row.id,live]);
  const sources=draft.sources;
  const sourceName=(id:string)=>sources.find(s=>s.id===id)?.title||"Pilih sumber";

  useEffect(()=>{
    const confirmUnload=(e:BeforeUnloadEvent)=>{if(!dirty)return;e.preventDefault();e.returnValue="";};
    window.addEventListener("beforeunload",confirmUnload);
    return ()=>window.removeEventListener("beforeunload",confirmUnload);
  },[dirty]);

  function change(next:OpportunityDraft) {setDraft(next);setDirty(true);setError("");setStatus("");}
  function set<K extends keyof OpportunityDraft>(key:K,value:OpportunityDraft[K]) {
    const affects:Record<string,OpportunityRule["field"][]>={
      level:["educationLevel"],participation:["teamSize"],minTeamSize:["teamSize"],maxTeamSize:["teamSize"],
      feeStatus:["fee"],feeAmount:["fee"],currency:["fee"],feeUnit:["fee"],feeNote:["fee"],regionRules:["region"],institutionRules:["region"],scope:["region"],eligibilityIndonesia:["region"],
    };
    const changed=draft[key]!==value;
    const adjusted={...draft,[key]:value};
    if(key==="feeStatus"){
      if(value==="Gratis")adjusted.feeAmount=0;
      if(value==="Belum diketahui"||value==="Berbayar"&&draft.feeStatus==="Gratis")adjusted.feeAmount=null;
    }
    if(key==="participation"&&value==="Individu") {adjusted.minTeamSize=null;adjusted.maxTeamSize=null;}
    if(changed&&affects[key])adjusted.requirements=draft.requirements.map(r=>affects[key].includes(r.field)?{...r,review:"unverified"}:r);
    change(adjusted);
  }
  function editSource(id:string,key:keyof SourceEntry,value:string){
    const old=draft.sources.find(s=>s.id===id);
    const invalidate=["url","kind","title"].includes(key) && value!==old?.[key];
    change({...draft,
      sources:draft.sources.map(s=>s.id===id?{...s,[key]:value,...(invalidate?{checkedAt:""}:{})}:s),
      requirements:invalidate?draft.requirements.map(r=>r.sourceId===id?{...r,review:"unverified"}:r):draft.requirements,
    });
  }
  function addSource(){const id=newId();change({...draft,sources:[...draft.sources,{id,title:"",url:"",kind:"Pengumuman resmi",checkedAt:"",note:""}]});setOpenSource(id);}
  function removeSource(id:string){
    if(draft.requirements.some(r=>r.sourceId===id)||draft.preparation.some(p=>p.sourceId===id)){
      setError("Sumber masih dipakai oleh ketentuan atau langkah persiapan. Pindahkan rujukannya sebelum menghapus.");return;
    }
    change({...draft,sources:sources.filter(s=>s.id!==id)});
  }
  function editRule(id:string,key:keyof OpportunityRule,value:string){
    const prior=draft.requirements.find(r=>r.id===id);
    const invalidate=["quote","location","sourceId","rule","value","field","allowedPrograms"].includes(key) && prior?.[key]!==value;
    change({...draft,requirements:draft.requirements.map(r=>r.id===id?{
      ...r,[key]:value,...(key==="field"?{rule:"manual" as const,value:""}:{}),...(invalidate?{review:"unverified" as const}:{})
    }:r)});
  }
  function addRule(copy?:OpportunityRule){
    const id=newId();const entry:OpportunityRule=copy?{...copy,id,label:"",value:"",rule:"manual",review:"unverified"}:{
      id,label:"",field:"submission",value:"",rule:"manual",allowedPrograms:"",sourceId:"",location:"",quote:"",review:"unverified",note:"",
    };
    change({...draft,requirements:[...draft.requirements,entry]});setOpenRule(id);
  }
  function addStep(){const id=newId();change({...draft,preparation:[...draft.preparation,{id,title:"",detail:"",mandatory:false,sourceId:""}]});setOpenStep(id);}
  function editStep(id:string,key:keyof PreparationItem,value:string|boolean){change({...draft,preparation:draft.preparation.map(p=>p.id===id?{...p,[key]:value}:p)});}
  function moveStep(index:number,by:number){const xs=[...draft.preparation];const other=index+by;if(other<0||other>=xs.length)return;[xs[index],xs[other]]=[xs[other],xs[index]];change({...draft,preparation:xs});}
  function addStage(){change({...draft,stages:[...draft.stages,{id:newId(),title:"",date:"",mode:"Online",location:""}]});}
  function editStage(id:string,key:keyof EventStage,value:string){change({...draft,stages:draft.stages.map(s=>s.id===id?{...s,[key]:value}:s)});}

  async function commit(action:"save"|"publish"|"withdraw"|"delete"){
    if(busy)return;
    if(action==="publish" && isPastDeadlineWib(draft.deadline)){setError("Tenggat pendaftaran sudah berlalu menurut waktu WIB. Perbarui tanggal terlebih dahulu sebelum menerbitkan ulang.");return;}
    if(action==="publish" && issues.blocking.length){setError("Sebelum terbit: "+issues.blocking.join(" "));document.getElementById("publication")?.scrollIntoView({behavior:"smooth"});return;}
    if(action==="publish" && issues.warnings.length && !window.confirm(`Ada ${issues.warnings.length} catatan yang perlu diperhatikan. Terbitkan dengan penanda informasi belum sepenuhnya terverifikasi?`)) return;
    if(action==="withdraw" && !window.confirm("Tarik versi terbit? Draf tidak terhapus, tetapi lomba tidak lagi tampil pada katalog publik."))return;
    if(action==="delete" && !window.confirm(deadlineExpired?"HAPUS PERMANEN lomba yang tenggatnya telah terlewati? Berkas redaksi, sumber, bukti pemeriksaan, dan terbitan lama tidak dapat dipulihkan.":"Hapus draf yang belum pernah terbit secara permanen?"))return;
    if(action==="delete" && dirty && !window.confirm("Hapus juga perubahan yang belum disimpan?"))return;
    setBusy(true);setError("");setStatus("");
    try {
      const result=await writeOpportunity(row.id,version,action,(action==="save"||action==="publish")?draft:undefined);
      if("error" in result && result.error){setError(result.error);return;}
      if("deleted" in result && result.deleted){setDirty(false);router.push("/admin/review/cari-lomba");router.refresh();return;}
      if("version" in result && typeof result.version==="number")setVersion(result.version);
      if("live" in result && result.live!==undefined)setLive(result.live);
      if("expiredAt" in result && result.expiredAt!==undefined)setExpiredAt(result.expiredAt);
      if(action==="publish")setEverPublished(true);
      if(action!=="withdraw")setDirty(false);setStatus(action==="save"?"Draf tersimpan di server. Versi yang sedang tayang tidak berubah.":action==="publish"?"Versi terbaru telah diterbitkan.":"Terbitan telah ditarik; draf tetap tersimpan.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error?err.message:"Koneksi gagal. Perubahan Anda masih ada di formulir; coba simpan kembali.");
    } finally {setBusy(false);}
  }

  return <div className="red-opportunity-page red-opportunity-editor">
    <div className="red-bar"><div><Link href={deadlineExpired?"/admin/review/cari-lomba/tenggat-terlewati":"/admin/review/cari-lomba"} onClick={e=>{if(dirty&&!window.confirm("Tinggalkan editor tanpa menyimpan perubahan?"))e.preventDefault();}}>← {deadlineExpired?"Tenggat terlewati":"Daftar lomba"}</Link><h1>{draft.title||"Lomba baru"}</h1><p className="red-subtitle">Satu berkas · versi {version} · {deadlineExpired?"Tenggat terlewati / tidak dapat diakses publik":live?"Sudah terbit":"Belum tayang"} {dirty&&"· Perubahan belum disimpan"}</p>{!publicEnabled&&<p className="red-note">Mode editorial. Versi yang diterbitkan di sini baru tampil ke pembaca setelah katalog publik diaktifkan.</p>}</div>
      <div className="red-actions"><button type="button" onClick={()=>commit("save")} disabled={busy}>{busy?"Menyimpan…":"Simpan draf"}</button><button type="button" className="red-primary" onClick={()=>commit("publish")} disabled={busy}>{live?"Terbitkan revisi":"Terbitkan lomba"}</button></div></div>
    {deadlineExpired&&<div className="red-flash red-expired-alert" role="status">Tenggat pendaftaran terlewati. Lomba otomatis disembunyikan dari katalog publik mulai pukul 00.00 WIB pada hari berikutnya. Anda dapat menyimpan revisi draf, menerbitkan ulang dengan tenggat baru, atau menghapus berkas secara permanen.</div>}
    {error&&<p className="red-flash red-flash-error" role="alert">{error}</p>}{status&&<p className="red-flash" role="status">{status}</p>}
    <fieldset disabled={busy} className="red-editor-fieldset"><nav className="red-section-nav" aria-label="Bagian editor"><a href="#sources">01 Sumber</a><a href="#identity">02 Informasi</a><a href="#rules">03 Persyaratan</a><a href="#steps">04 Persiapan</a><a href="#publication">05 Publikasi</a></nav>

    <section className="red-panel" id="sources"><div className="red-section-heading"><div><h2>Sumber informasi</h2><p>Catat sumber lebih dahulu. Satu sumber boleh dipakai untuk beberapa syarat atau langkah.</p></div><button type="button" onClick={addSource}>+ Tambah sumber</button></div>
      {!sources.length&&<p className="red-empty">Belum ada sumber. Tambahkan pengumuman, panduan, atau poster resmi.</p>}
      <div className="red-repeat-list">{sources.map((source,i)=><div className="red-repeat-item" key={source.id}>
        <div className="red-repeat-header"><button type="button" className="red-row-toggle" onClick={()=>setOpenSource(openSource===source.id?null:source.id)}><strong>{i+1}. {source.title||"Sumber tanpa nama"}</strong><small>{source.kind} · {source.checkedAt?`Diperiksa ${source.checkedAt}`:"Belum diperiksa"}</small></button><button type="button" className="red-danger" onClick={()=>removeSource(source.id)}>Hapus</button></div>
        {openSource===source.id&&<div className="red-fields"><Input title="Nama sumber" value={source.title} onChange={v=>editSource(source.id,"title",v)} placeholder="Panduan lomba 2026"/><Select title="Jenis sumber" value={source.kind} onChange={v=>editSource(source.id,"kind",v)} options={sourceKinds}/>
          <div className="red-span"><Input title="Tautan sumber (https://)" value={source.url} onChange={v=>editSource(source.id,"url",v)} placeholder="https://..." hint="Mengubah URL membatalkan tanggal pemeriksaan dan verifikasi syarat yang merujuknya."/></div>
          <Input title="Tanggal benar-benar diperiksa" value={source.checkedAt} onChange={v=>editSource(source.id,"checkedAt",v)} type="date"/>
          <div className="red-field-footer"><button type="button" onClick={()=>editSource(source.id,"checkedAt",dateToday())}>Saya sudah periksa sumber ini hari ini</button></div>
          <div className="red-span"><Multi title="Catatan, perbedaan versi, atau hal yang dikonfirmasi" value={source.note} onChange={v=>editSource(source.id,"note",v)} rows={2}/></div>
          {/^https:\/\//i.test(source.url)&&<a href={source.url} rel="noreferrer noopener" target="_blank" className="red-external-link">Buka sumber asli ↗</a>}
        </div>}
      </div>)}</div>
    </section>

    <section className="red-panel" id="identity"><div className="red-section-heading"><div><h2>Informasi lomba</h2><p>Angka inti diisi satu kali dan diteruskan ke katalog, detail, dan perbandingan.</p></div></div>
      <h3 className="red-mini-heading">Identitas dan deskripsi</h3>
      <div className="red-fields">
        <Input title="Nama resmi lomba" value={draft.title} onChange={v=>set("title",v)} required/>
        <Input title="Edisi / tahun" value={draft.edition} onChange={v=>set("edition",v)} placeholder="2026 / Gelombang II"/>
        <Input title="Penyelenggara yang tercantum pada pengumuman" value={draft.organizer} onChange={v=>set("organizer",v)} required/>
        <Input title="Pengirim informasi / mitra (bukan otomatis penyelenggara)" value={draft.submitter} onChange={v=>set("submitter",v)}/>
        <Input title="Kategori" value={draft.category} onChange={v=>set("category",v)} placeholder="Riset & Karya Tulis"/>
        <Input title="Disiplin utama" value={draft.discipline} onChange={v=>set("discipline",v)} placeholder="Riset"/>
        <div className="red-span"><Multi title="Ringkasan kartu (maksimal 800 karakter)" value={draft.summary} onChange={v=>set("summary",v)} rows={2} placeholder="Jelaskan dengan spesifik karya dan kegiatannya, bukan slogan umum."/></div>
        <div className="red-span"><label className="red-input-label">Tentang lomba ini<textarea rows={6} value={draft.description} onChange={e=>set("description",e.target.value)} placeholder="Apa yang dilakukan peserta, karya yang dikumpulkan, dan tahapan kegiatannya..."/><small>Gunakan teks biasa atau Markdown. Periksa subjudul, kutipan, dan tabel di bagian Publikasi.</small></label>
          <button type="button" className="red-import-toggle" onClick={()=>setImportOpen(!importOpen)}>{importOpen?"Tutup impor naskah":"Impor naskah dari hasil olahan AI"}</button>
          {importOpen&&<div className="red-import"><p>{docHint}</p><textarea rows={6} value={manuscript} onChange={e=>setManuscript(e.target.value)} placeholder="Tempel naskah singkat, lalu tinjau hasilnya sebelum menyimpan."/><button type="button" onClick={()=>{if(manuscript.length>20000){setError("Naskah terlalu panjang (maksimal 20.000 karakter).");return;}set("description",manuscript.trim());setImportOpen(false);}}>Gunakan naskah pada deskripsi</button></div>}
          <details className="red-proposal-import"><summary>Impor data terstruktur dari AI extension (JSON)</summary>
            <p>Opsional. Tempel satu objek JSON berisi field lomba, <code>sources</code>, <code>requirements</code>, atau <code>preparation</code>. Pencocokan sumber mendukung <code>sourceId</code> atau <code>sourceIndex</code> (mulai dari 0). Semua usulan bukti otomatis kembali ke status <b>Belum diperiksa</b>.</p>
            <textarea rows={7} value={proposal} onChange={e=>setProposal(e.target.value)} placeholder={'{"title":"Nama lomba", "sources":[{"id":"s1","title":"Panduan resmi","url":"https://contoh.id/panduan","kind":"Panduan"}],"requirements":[{"label":"Jumlah anggota","field":"teamSize","rule":"team","sourceId":"s1","quote":"Kutipan asli dari sumber","location":"hlm. 3"}]}'} />
            <button type="button" onClick={()=>{
              if(!proposal.trim())return;
              if(!window.confirm("Terapkan usulan JSON pada draf saat ini? Bagian yang disertakan dalam usulan akan menggantikan isian terkait. Data belum dipublikasikan."))return;
              try {change(importOpportunityProposal(proposal,draft));setStatus("Usulan telah masuk ke draf. Periksa ulang kutipan dan data sebelum menyimpan.");}
              catch(err){setError(err instanceof Error?err.message:"Gagal membaca usulan JSON.");}
            }}>Terapkan usulan ke draf (belum menyimpan)</button>
          </details>
        </div>
        <Input title="Tema (jika diumumkan)" value={draft.theme} onChange={v=>set("theme",v)}/>
        <Input title="Hadiah / keluaran (jika diumumkan)" value={draft.prize} onChange={v=>set("prize",v)}/>
      </div>
      <h3 className="red-mini-heading">Peserta dan jangkauan</h3>
      <div className="red-fields">
        <Select title="Lingkup perlombaan" value={draft.scope} onChange={v=>set("scope",v as OpportunityDraft["scope"])} options={scopes}/>
        <Select title="Mahasiswa Indonesia boleh ikut?" value={draft.eligibilityIndonesia} onChange={v=>set("eligibilityIndonesia",v as OpportunityDraft["eligibilityIndonesia"])} options={["Belum dipastikan","Ya","Tidak"]}/>
        <div className="red-span"><fieldset className="red-fieldset"><legend>Jenjang yang disebut menerima peserta</legend><div className="red-options">{educationLevels.map(level=><label key={level} className="red-check"><input type="checkbox" checked={draft.level.includes(level)} onChange={e=>set("level",e.target.checked?[...draft.level,level]:draft.level.filter(x=>x!==level))}/>{level}</label>)}</div></fieldset></div>
        <Multi title="Pembatasan kampus / asal institusi" value={draft.institutionRules} onChange={v=>set("institutionRules",v)} rows={2} placeholder="Misal: seluruh anggota satu perguruan tinggi"/>
        <Multi title="Pembatasan wilayah / kewarganegaraan" value={draft.regionRules} onChange={v=>set("regionRules",v)} rows={2}/>
        <Select title="Bentuk partisipasi" value={draft.participation} onChange={v=>set("participation",v as OpportunityDraft["participation"])} options={["Individu","Tim","Individu atau Tim"]}/>
        <Input title="Minimum orang dalam tim" type="number" value={integerInput(draft.minTeamSize)} onChange={v=>set("minTeamSize",interpretInteger(v))} disabled={draft.participation==="Individu"} hint="Kosongkan jika belum disebut"/>
        <Input title="Maksimum orang dalam tim" type="number" disabled={draft.participation==="Individu"} value={integerInput(draft.maxTeamSize)} onChange={v=>set("maxTeamSize",interpretInteger(v))}/>
      </div>
      <h3 className="red-mini-heading">Biaya dan pelaksanaan</h3>
      <div className="red-fields">
        <Select title="Status biaya pendaftaran" value={draft.feeStatus} onChange={v=>set("feeStatus",v as OpportunityDraft["feeStatus"])} options={["Belum diketahui","Gratis","Berbayar"]}/>
        <Input title="Nominal biaya (kosong = belum diumumkan)" type="number" value={integerInput(draft.feeStatus==="Gratis"?0:draft.feeAmount)} onChange={v=>set("feeAmount",interpretInteger(v))} />
        <Select title="Mata uang" value={draft.currency} onChange={v=>set("currency",v as OpportunityDraft["currency"])} options={["IDR","USD","Lainnya"]}/>
        <Select title="Satuan biaya" value={draft.feeUnit} onChange={v=>set("feeUnit",v as OpportunityDraft["feeUnit"])} options={["Belum disebutkan","Per orang","Per tim","Per karya"]}/>
        <div className="red-span"><Input title="Catatan biaya tambahan (jika perlu)" value={draft.feeNote} onChange={v=>set("feeNote",v)}/></div>
        <Select title="Format acara" value={draft.mode} onChange={v=>set("mode",v as OpportunityDraft["mode"])} options={["Online","Offline","Hybrid"]}/>
        <Input title="Lokasi atau kota tahap yang perlu dihadiri" value={draft.location} onChange={v=>set("location",v)} placeholder="Final: Surabaya; penyisihan: daring"/>
        <Input title="Tenggat pendaftaran" type="date" value={draft.deadline} onChange={v=>set("deadline",v)} required hint="Setelah tanggal ini berakhir, informasi otomatis disembunyikan mulai 00.00 WIB pada hari berikutnya. Jam resmi tetap dicatat di kolom terpisah."/>
        <Input title="Jam tenggat (jika disebut)" type="time" value={draft.deadlineTime} onChange={v=>set("deadlineTime",v)}/>
        <Select title="Zona waktu sumber" value={draft.timezone} onChange={v=>set("timezone",v as OpportunityDraft["timezone"])} options={["Belum disebutkan","WIB","WITA","WIT","UTC","Lainnya"]}/>
        <Input title="Tenggat pengumpulan karya (jika berbeda)" type="date" value={draft.submissionDeadline} onChange={v=>set("submissionDeadline",v)}/>
        <Input title="Tautan pendaftaran" value={draft.registrationUrl} onChange={v=>set("registrationUrl",v)} placeholder="https://..."/>
        <Input title="Tautan panduan" value={draft.guideUrl} onChange={v=>set("guideUrl",v)} placeholder="https://..."/>
        <div className="red-span"><label>Unggah poster<input type="file" accept="image/jpeg,image/png,image/webp" onChange={async e=>{
          const f=e.target.files?.[0];if(!f)return;e.target.value="";setBusy(true);setError("");
          try{set("posterUpload",await readPoster(f));}catch(err){setError(err instanceof Error?err.message:"Gambar gagal dibuka.");}finally{setBusy(false);}
        }}/><small>JPG, PNG, atau WebP hingga 10 MB. Gambar diperkecil di perangkat Anda.</small></label>
        {draft.posterUpload&&<><img alt="Poster dalam draf" src={draft.posterUpload} style={{maxHeight:180,maxWidth:"100%",objectFit:"contain"}}/><button onClick={()=>set("posterUpload","")}>Lepas poster</button></>}</div>
        <div className="red-span"><Input title="Alternatif tautan gambar poster" value={draft.posterUrl} onChange={v=>set("posterUrl",v)} placeholder="https://...jpg"/></div>
      </div>
      <div className="red-section-heading red-sub-section"><div><h3>Tahap pelaksanaan</h3><p>Catat jika penyisihan, semifinal, atau final berbeda tempat atau format.</p></div><button type="button" onClick={addStage}>+ Tambah tahap</button></div>
      <div className="red-repeat-list">{draft.stages.map((stage,i)=><div className="red-repeat-item" key={stage.id}><div className="red-repeat-header"><strong>{i+1}. {stage.title||"Tahap belum diberi nama"}</strong><button type="button" className="red-danger" onClick={()=>set("stages",draft.stages.filter(s=>s.id!==stage.id))}>Hapus</button></div><div className="red-fields">
        <Input title="Nama tahap" value={stage.title} onChange={v=>editStage(stage.id,"title",v)}/><Input title="Tanggal (bila diumumkan)" type="date" value={stage.date} onChange={v=>editStage(stage.id,"date",v)}/>
        <Select title="Format tahap" value={stage.mode} onChange={v=>editStage(stage.id,"mode",v)} options={["Online","Offline","Hybrid"]}/><Input title="Lokasi" value={stage.location} onChange={v=>editStage(stage.id,"location",v)}/>
      </div></div>)}</div>
    </section>

    <section className="red-panel" id="rules"><div className="red-section-heading"><div><h2>Pemeriksaan persyaratan</h2><p>Setiap ketentuan punya nilainya sendiri, kutipan asli, dan rujukan yang dapat ditelusuri.</p></div><button type="button" onClick={()=>addRule()}>+ Tambah syarat</button></div>
      {!draft.requirements.length&&<p className="red-empty">Belum ada syarat. Tambahkan jenjang, prodi, ukuran tim, atau ketentuan manual dari panduan.</p>}
      <div className="red-repeat-list">{draft.requirements.map((r,i)=><div className="red-repeat-item" key={r.id}>
        <div className="red-repeat-header"><button type="button" className="red-row-toggle" onClick={()=>setOpenRule(openRule===r.id?null:r.id)}><strong>{i+1}. {r.label||"Persyaratan baru"} · {resolvedRuleValue(r,draft)||"Belum diisi"}</strong><small>{sourceName(r.sourceId)} · {r.review==="verified"?"Sudah diperiksa":r.review==="ambiguous"?"Perlu klarifikasi":"Belum diperiksa"}</small></button><button type="button" className="red-danger" onClick={()=>set("requirements",draft.requirements.filter(x=>x.id!==r.id))}>Hapus</button></div>
        {openRule===r.id&&<div className="red-fields">
          <Input title="Apa yang diperiksa?" value={r.label} onChange={v=>editRule(r.id,"label",v)} placeholder="Jumlah anggota tim"/>
          <Select title="Bidang profil / pemeriksaan" value={r.field} onChange={v=>editRule(r.id,"field",v)} options={ruleFields.map(f=>f.value)}/>
          <Input title="Nilai ketentuan (untuk aturan manual)" value={r.rule==="manual"||r.rule==="unknown"?r.value:resolvedRuleValue(r,draft)} onChange={v=>editRule(r.id,"value",v)} placeholder="2–4 orang" disabled={r.rule!=="manual"&&r.rule!=="unknown"} hint={r.rule==="manual"||r.rule==="unknown"?"Tulis sesuai isi panduan.":"Nilai publik dihitung otomatis dari data di bagian Informasi lomba."}/>
          <Select title="Aturan pemeriksaan" value={r.rule} onChange={v=>editRule(r.id,"rule",v)} options={ruleKinds.filter(kind=>kind==="manual" || kind==="unknown" || ({educationLevel:["levels"],studyProgram:["all","programs"],teamSize:["team","individual"],fee:["paid","free"],region:[],submission:[]} as Record<string,string[]>)[r.field].includes(kind))}/>
          {r.rule==="programs"&&<div className="red-span"><Multi title="Daftar program studi persis yang diterima (satu per baris)" value={r.allowedPrograms} onChange={v=>editRule(r.id,"allowedPrograms",v)} placeholder="Teknik Elektro\nTeknik Informatika" hint="Salin ejaan nama prodi dari panduan."/></div>}
          <div className="red-span"><Select title="Diambil dari" value={r.sourceId} onChange={v=>editRule(r.id,"sourceId",v)} options={["",...sources.map(x=>x.id)]} labels={Object.fromEntries(sources.map(s=>[s.id,s.title||"Sumber tanpa nama"]))}/>{r.sourceId&&<small>Sumber: {sourceName(r.sourceId)}</small>}</div>
          <Input title="Lokasi dalam sumber" value={r.location} onChange={v=>editRule(r.id,"location",v)} placeholder="Halaman 3 · bagian Peserta"/>
          <Select title="Pemeriksaan redaksi" value={r.review} onChange={v=>editRule(r.id,"review",v)} options={["unverified","ambiguous","verified"]}/>
          <div className="red-span"><Multi title="Kutipan asli (jangan diganti parafrasa AI)" value={r.quote} onChange={v=>editRule(r.id,"quote",v)} rows={3}/></div>
          <div className="red-span"><Multi title="Catatan verifikasi / klarifikasi" value={r.note} onChange={v=>editRule(r.id,"note",v)} rows={2}/></div>
          <div className="red-span red-split-actions"><button type="button" onClick={()=>addRule(r)}>+ Tambah syarat dari kutipan yang sama</button><span>Kondisi yang belum bisa diperiksa otomatis pilih aturan <b>manual</b>.</span></div>
        </div>}
      </div>)}</div>
    </section>

    <section className="red-panel" id="steps"><div className="red-section-heading"><div><h2>Apa yang perlu disiapkan?</h2><p>Setiap langkah memiliki ID tetap. Urutan dan koreksi ejaan tidak mereset centang peserta.</p></div><button type="button" onClick={addStep}>+ Tambah langkah</button></div>
      {!draft.preparation.length&&<p className="red-empty">Belum ada langkah. Masukkan tindakan ringkas yang benar-benar dibutuhkan peserta.</p>}
      <div className="red-repeat-list">{draft.preparation.map((s,i)=><div className="red-repeat-item" key={s.id}>
        <div className="red-repeat-header"><button type="button" className="red-row-toggle" onClick={()=>setOpenStep(openStep===s.id?null:s.id)}><strong>{String(i+1).padStart(2,"0")}. {s.title||"Langkah baru"}</strong><small>{prepareLabel(s)}</small></button><div className="red-step-actions"><button type="button" onClick={()=>moveStep(i,-1)} disabled={i===0} aria-label="Pindah ke atas">↑</button><button type="button" onClick={()=>moveStep(i,1)} disabled={i===draft.preparation.length-1} aria-label="Pindah ke bawah">↓</button><button type="button" className="red-danger" onClick={()=>set("preparation",draft.preparation.filter(x=>x.id!==s.id))}>Hapus</button></div></div>
        {openStep===s.id&&<div className="red-fields">
          <div className="red-span"><Input title="Tindakan peserta" value={s.title} onChange={v=>editStep(s.id,"title",v)} placeholder="Unggah esai dalam format PDF"/></div>
          <div className="red-span"><Multi title="Keterangan tambahan (opsional)" value={s.detail} onChange={v=>editStep(s.id,"detail",v)} rows={2}/></div>
          <label className="red-check red-span"><input type="checkbox" checked={s.mandatory} onChange={e=>editStep(s.id,"mandatory",e.target.checked)}/>Wajib menurut sumber penyelenggara (jika tidak, ini saran redaksi)</label>
          <div className="red-span"><Select title="Sumber langkah wajib (bisa sama dengan sumber persyaratan)" value={s.sourceId} onChange={v=>editStep(s.id,"sourceId",v)} options={["",...sources.map(x=>x.id)]} labels={Object.fromEntries(sources.map(s=>[s.id,s.title||"Sumber tanpa nama"]))}/>{s.sourceId&&<small>{sourceName(s.sourceId)}</small>}</div>
        </div>}
      </div>)}</div>
    </section>

    <section className="red-panel" id="publication"><div className="red-section-heading"><div><h2>Pratinjau & publikasi</h2><p>Pratinjau ini memakai draf yang sedang Anda tulis. Katalog publik hanya berubah setelah diterbitkan.</p></div></div>
      <div className="red-preview-columns"><div className="red-preview-opportunity"><span className="red-kicker">KARTU / CARI LOMBA</span><strong>{preview.title||"Nama lomba belum diisi"}</strong><span>{preview.organizer||"Penyelenggara"}</span><p>{preview.summary||"Ringkasan kartu akan terlihat di sini."}</p><div><span>DAFTAR {preview.deadline||"Belum diisi"}</span><span>{preview.feeStatus==="Gratis"?"Gratis":preview.feeStatus==="Berbayar"?preview.feeAmount===null?"Berbayar · nominal belum diumumkan":preview.feeCurrency==="IDR"?formatCurrency(preview.feeAmount):`${preview.feeCurrency} ${preview.feeAmount}`:"Belum diketahui"}</span><span>{preview.participation}</span></div></div>
        <div className="red-preview-opportunity"><span className="red-kicker">DETAIL & BANDINGKAN</span><dl><dt>Jenjang</dt><dd>{preview.level.join(", ")||"Belum disebutkan"}</dd><dt>Jumlah anggota</dt><dd>{preview.minTeamSize===null?preview.participation:`${preview.minTeamSize}–${preview.maxTeamSize??"?"} orang`}</dd><dt>Tema</dt><dd>{preview.theme||"Belum diumumkan"}</dd><dt>Persyaratan</dt><dd>{preview.requirements.length} butir · {preview.requirements.filter(r=>r.evidence.status!=="verified").length} perlu perhatian</dd><dt>Persiapan</dt><dd>{preview.checklistItems?.length||0} langkah</dd></dl></div></div>
      {draft.description && <details className="red-preview-opportunity"><summary>Baca pratinjau deskripsi</summary><OpportunityDescription text={draft.description}/></details>}
      <div className="red-publication-status"><h3>Pemeriksaan sebelum terbit</h3><div className="red-check-results">
        {issues.blocking.length>0&&<div><strong>Harus dilengkapi ({issues.blocking.length})</strong>{issues.blocking.map((s,i)=><p key={i}>• {s}</p>)}</div>}
        {issues.warnings.length>0&&<div><strong>Perlu perhatian ({issues.warnings.length})</strong>{issues.warnings.map((s,i)=><p key={i}>• {s}</p>)}</div>}
        {!issues.blocking.length&&!issues.warnings.length&&<p>Kolom inti lengkap dan tidak ada peringatan editorial yang terdeteksi.</p>}
      </div></div>
      <Multi title="Catatan kondisi pemeriksaan untuk publik" value={draft.verificationNote} onChange={v=>set("verificationNote",v)} rows={2} placeholder="Sebutkan informasi yang masih menunggu klarifikasi."/>
      <div className="red-publication-actions"><button type="button" onClick={()=>commit("save")} disabled={busy}>Simpan draf</button><button type="button" className="red-primary" onClick={()=>commit("publish")} disabled={busy}>{live?"Terbitkan revisi":"Terbitkan"}</button>{live&&<button type="button" className="red-danger" onClick={()=>commit("withdraw")} disabled={busy}>Tarik terbitan</button>}{(deadlineExpired||!live&&!everPublished)&&<button type="button" className="red-danger" onClick={()=>commit("delete")} disabled={busy}>{deadlineExpired?"Hapus permanen":"Hapus draf"}</button>}</div>
      {live&&!deadlineExpired&&publicEnabled&&<p className="red-public-link">Tautan versi terakhir: <Link href={`/opportunities/${live.slug}`} target="_blank">/opportunities/{live.slug} ↗</Link></p>}
      <p className="red-note">Tautan tidak berubah saat judul direvisi. Menarik terbitan tidak menghapus isi draf. {publicEnabled?"Katalog publik sudah terhubung ke redaksi.":"Katalog publik masih menampilkan contoh. Versi terbit ini dapat diperiksa di redaksi sebelum katalog diaktifkan."}</p>
    </section></fieldset>
  </div>;
}
