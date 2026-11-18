"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoryArticle } from "@/components/stories/story-article";
import { StoryCard } from "@/components/stories/story-card";
import { RichText } from "./rich-text";
import { categories, makeStory, publicationIssue, type Draft, type StoryRow } from "@/lib/editorial/model";
import type { StoryCredit } from "@/lib/story-credits";
import { uploadPhoto, writeStory } from "@/app/admin/review/actions";

async function jpeg(file:File) {
  const url=URL.createObjectURL(file);
  try {
    const img=new Image();img.src=url;await img.decode();
    const canvas=document.createElement("canvas");
    let scale=Math.min(1,1600/Math.max(img.width,img.height));
    for(let attempt=0;attempt<5;attempt++,scale*=0.75) {
      canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
      const ctx=canvas.getContext("2d");if(!ctx)break;
      ctx.fillStyle="white";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/jpeg",0.82));
      if(blob && blob.size<=700000) return new File([blob],"foto.jpg",{type:"image/jpeg"});
    }
    throw new Error("Foto terlalu besar.");
  } finally {URL.revokeObjectURL(url);}
}
export function StoryEditor({row}:{row:StoryRow}) {
  const router=useRouter();
  const [d,setDraft]=useState(row.draft),[version,setVersion]=useState(row.version),[live,setLive]=useState(row.live);
  const [preview,setPreview]=useState(false),[dirty,setDirty]=useState(false),[busy,setBusy]=useState(false);
  const [message,report]=useState(""),[confirm,setConfirm]=useState<"delete"|"withdraw"|null>(null);
  const lock=useRef(false);
  useEffect(()=>{
    if (!dirty)return;
    const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};
    const links=(e:MouseEvent)=>{const a=(e.target as Element)?.closest?.("a");if(a && !a.target && a.href!==location.href && !window.confirm("Tinggalkan perubahan yang belum disimpan?")){e.preventDefault();e.stopPropagation();}};
    window.addEventListener("beforeunload",warn);document.addEventListener("click",links,true);
    return ()=>{window.removeEventListener("beforeunload",warn);document.removeEventListener("click",links,true);};
  },[dirty]);
  function change<K extends keyof Draft>(key:K,v:Draft[K]) {
    setDirty(true);report("");setDraft(prev=>({...prev,[key]:v}));
  }
  async function upload(f:File) {
    if(lock.current)return;
    lock.current=true;setBusy(true);report("Mengunggah foto…");
    try {
      const data=new FormData();data.set("foto",await jpeg(f));
      const r=await uploadPhoto(row.id,data);
      if(!r.src) throw new Error(r.error);report("Foto diunggah. Simpan draf untuk menyertakannya.");return r.src;
    } catch(e) {report(e instanceof Error?e.message:"Foto gagal diunggah.");}
    finally {lock.current=false;setBusy(false);}
  }
  async function save(action:"save"|"publish"|"withdraw"|"delete") {
    if(lock.current)return;
    if(action==="publish") {const issue=publicationIssue(d);if(issue){report(issue);return;}}
    lock.current=true;setBusy(true);report("Memproses…");
    try {
      const r=await writeStory(row.id,version,action,d);
      if(!r.version) throw new Error(r.error || "Gagal menyimpan.");
      setVersion(r.version);setLive(r.live??null);setConfirm(null);
      if(action!=="withdraw")setDirty(false);
      if(action==="delete"){router.replace("/admin/review/kisah-juara");router.refresh();return;}
      report(action==="save"?"Draf tersimpan.":action==="withdraw"?"Kisah sudah ditarik dari halaman publik.":"Versi terbaru sudah terbit.");
    } catch(e) {report(e instanceof Error?e.message:"Periksa koneksi, lalu simpan lagi.");}
    finally {lock.current=false;setBusy(false);}
  }
  const field=(k:"title"|"cardTitle"|"coverLabel"|"caption"|"participants"|"competition"|"achievement"|"campus"|"level"|"year",label:string)=>
    <label>{label}<input maxLength={k==="year"?4:500} value={d[k]} onChange={e=>change(k,e.target.value)}/></label>;
  function editCredit(index:number,patch:Partial<StoryCredit>) {change("credits",d.credits.map((c,i)=>i===index?{...c,...patch}:c));}
  const previewStory=makeStory(d,row.id,live);
  return <>
    <Link href="/admin/review/kisah-juara">← Daftar kisah</Link>
    <div className="red-bar"><h1>Sunting kisah</h1><span>{live?"Terbit":"Draf"}{dirty?" · Belum disimpan":""}</span></div>
    <div className="red-actions"><button type="button" disabled={busy} aria-pressed={preview} onClick={()=>setPreview(!preview)}>{preview?"Kembali menyunting":"Pratinjau"}</button>
      <button type="button" disabled={busy} onClick={()=>save("save")}>Simpan draf</button>
      <button type="button" disabled={busy} className="button button-primary" onClick={()=>save("publish")}>{live?"Terbitkan perubahan":"Terbitkan"}</button></div>
    <p className="red-status" role="status">{message}{message.includes("Sesi berakhir") && <> <a target="_blank" href="/admin/masuk" rel="noreferrer">Masuk kembali ↗</a></>}</p>
    {preview && <div className="red-preview"><h2>Pratinjau kartu</h2><div className="red-preview-card" inert><StoryCard story={previewStory} archive/></div><h2>Pratinjau artikel</h2><div className="kj-detail-page"><StoryArticle story={previewStory}/></div></div>}
    <fieldset className="red-editor" disabled={busy} inert={busy} hidden={preview}>
      <section className="red-panel"><h2>Judul dan sampul</h2>{field("title","Judul cerita")}
        {field("cardTitle","Judul pendek untuk kartu (opsional)")}
        <div className="red-fields"><label>Bidang<select value={d.category} onChange={e=>change("category",e.target.value as Draft["category"])}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
        <label>Warna templat<select value={d.accent} onChange={e=>change("accent",e.target.value as Draft["accent"])}><option value="moss">Hijau lumut</option><option value="slate">Biru batu</option><option value="clay">Cokelat tanah</option></select></label></div>
        {field("coverLabel","Tulisan pada sampul templat")}
        <label>Foto sampul (opsional)<input type="file" accept="image/*" onChange={async e=>{const f=e.target.files?.[0];e.target.value="";if(f){const src=await upload(f);if(src)change("photo",src);}}}/></label>
        {d.photo && <><img className="red-thumb" src={d.photo} alt="Sampul draf"/>{field("caption","Keterangan foto")}<button type="button" onClick={()=>change("photo","")}>Gunakan sampul templat</button></>}
      </section>
      <section className="red-panel"><h2>Profil pencapaian</h2><div className="red-fields">
        <label>Bentuk peserta<select value={d.participantType} onChange={e=>change("participantType",e.target.value as Draft["participantType"])}><option>Individu</option><option>Tim</option></select></label>
        {field("participants",d.participantType==="Tim"?"Nama tim":"Nama peserta")}{field("competition","Nama kompetisi")}{field("achievement","Pencapaian")}{field("year","Tahun pencapaian")}{field("level","Tingkat lomba")}{field("campus","Institusi (opsional)")}
      </div></section>
      <section className="red-panel"><h2>Isi wawancara</h2><p>Tempel naskah di bawah. Pilih teks untuk memberi penekanan atau ubah satu paragraf menjadi subjudul.</p>
        <RichText initial={row.draft.body} onChange={b=>change("body",b)} upload={upload}/></section>
      <section className="red-panel"><h2>Kredit wawancara</h2>
        {d.credits.map((c,i)=><div className="red-credit" key={i}><div className="red-fields">
          <label>Peran<select value={c.role} onChange={e=>editCredit(i,{role:e.target.value as StoryCredit["role"]})}>{["Narasumber","Mitra pengusul","Penulis"].map(v=><option key={v}>{v}</option>)}</select></label>
          <label>Nama publik<input value={c.name} onChange={e=>editCredit(i,{name:e.target.value})}/></label></div>
          {(c.profiles||[]).map((p,j)=><div key={j} className="red-social">
            <label>Platform<select value={p.platform} onChange={e=>editCredit(i,{profiles:c.profiles?.map((v,n)=>n===j?{...v,platform:e.target.value}:v)})}>{["Instagram","LinkedIn","Facebook","Situs web","Lainnya"].map(v=><option key={v}>{v}</option>)}</select></label>
            <label>Alamat profil<input type="url" placeholder="https://" value={p.url} onChange={e=>editCredit(i,{profiles:c.profiles?.map((v,n)=>n===j?{...v,url:e.target.value}:v)})}/></label>
            <button type="button" onClick={()=>editCredit(i,{profiles:c.profiles?.filter((_,n)=>n!==j)})}>Hapus tautan</button></div>)}
          <div className="red-actions"><button type="button" onClick={()=>editCredit(i,{profiles:[...(c.profiles||[]),{platform:"Instagram",url:""}]})}>Tambah tautan</button>
          <button type="button" onClick={()=>change("credits",d.credits.filter((_,j)=>i!==j))}>Hapus kredit</button></div></div>)}
        <button type="button" onClick={()=>change("credits",[...d.credits,{role:d.credits.length?"Mitra pengusul":"Narasumber",name:"",profiles:[]}])}>Tambah kredit</button></section>
      <section className="red-panel"><h2>Publikasi</h2>
        <label className="red-check"><input type="checkbox" checked={d.achievementChecked} onChange={e=>change("achievementChecked",e.target.checked)}/>Saya sudah memeriksa pencapaian.</label>
        <label className="red-check"><input type="checkbox" checked={d.publicationApproved} onChange={e=>change("publicationApproved",e.target.checked)}/>Narasumber menyetujui naskah, foto, dan kredit yang akan tayang.</label>
        <label className="red-check"><input type="checkbox" checked={d.featured} onChange={e=>change("featured",e.target.checked)}/>Jadikan pilihan redaksi</label>
        <div className="red-actions"><button type="button" onClick={()=>save("save")}>Simpan draf</button><button type="button" className="button button-primary" onClick={()=>save("publish")}>{live?"Terbitkan perubahan":"Terbitkan kisah"}</button></div>
        {message && <p>{message}</p>}
      </section>
      <div className="red-actions">{live && <><a href={"/kisah-juara/"+live.slug} target="_blank" rel="noreferrer">Lihat versi terbit ↗</a><button onClick={()=>setConfirm("withdraw")}>Tarik dari publikasi</button></>}<button className="red-danger" onClick={()=>setConfirm("delete")}>Hapus kisah</button></div>
      {confirm && <div className="red-panel" role="group" aria-label="Konfirmasi"><strong>{confirm==="delete"?"Hapus permanen kisah dan semua fotonya?":"Tarik kisah dari Beranda, arsip, dan tautan artikel?"}</strong><div className="red-actions"><button onClick={()=>setConfirm(null)}>Batal</button><button className="red-danger" onClick={()=>save(confirm)}>{confirm==="delete"?"Ya, hapus permanen":"Ya, tarik kisah"}</button></div></div>}
    </fieldset>
  </>;
}
