"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useApp } from "@/components/app-provider";
import { Badge, Button, PageHeading } from "@/components/ui";
import { Icon } from "@/components/icons";
import type { UserProfile, Level, DeliveryMode } from "@/lib/types";
import { categories } from "@/lib/demo-data";

const blank: UserProfile = { educationLevel: "", studyProgram: "", region: "", budget: 0, preferredCategories: [], preferredMode: "", canJoinTeam: true, availableTeamMembers: 1 };

export default function ProfilePage() {
  const { profile, updateProfile, resetProfile, hydrated } = useApp();
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);
  useEffect(() => { if (hydrated) setDraft(profile); }, [hydrated, profile]);

  const update = <K extends keyof UserProfile,>(key: K, value: UserProfile[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleCategory = (value: string) => setDraft((current) => ({ ...current, preferredCategories: current.preferredCategories.includes(value) ? current.preferredCategories.filter((item) => item !== value) : [...current.preferredCategories, value] }));
  const save = (event: FormEvent) => { event.preventDefault(); updateProfile(draft); setSaved(true); window.setTimeout(() => setSaved(false), 2200); };
  const useDemoProfile = () => setDraft({ educationLevel: "S1", studyProgram: "Teknik Elektro", region: "Kalimantan Selatan", budget: 100000, preferredCategories: ["Inovasi & Teknologi", "Pemrograman", "Riset & Karya Tulis"], preferredMode: "Online", canJoinTeam: true, availableTeamMembers: 1 });

  return <div className="page-stack"><PageHeading eyebrow="PROFIL PESERTA" title="Profil Peserta" description="Lengkapi informasi pendidikan dan preferensimu untuk membantu pemeriksaan persyaratan lomba." action={<Badge tone="green"><Icon name="shield" size={12}/> Tersimpan di browser</Badge>}/>
    <form onSubmit={save} className="profile-layout">
      <div className="profile-form-column">
        <section className="panel form-section"><div className="form-section-heading"><div><div className="eyebrow">01 / INFORMASI PENDIDIKAN</div><h2>Pendidikanmu</h2><p>Informasi ini digunakan untuk memeriksa persyaratan peserta.</p></div><span className="form-number">01</span></div>
          <div className="form-grid"><label>Jenjang pendidikan <select value={draft.educationLevel} onChange={(e) => update("educationLevel", e.target.value as Level | "")}><option value="">Pilih jenjang</option><option value="SMA">SMA / sederajat</option><option value="D3">Diploma (D3)</option><option value="S1">Sarjana (S1)</option><option value="S2">Magister (S2)</option><option value="Umum">Umum / tidak terikat</option></select></label><label>Program studi <input value={draft.studyProgram} onChange={(e) => update("studyProgram", e.target.value)} placeholder="Contoh: Teknik Elektro"/></label><label className="span-two">Wilayah <input value={draft.region} onChange={(e) => update("region", e.target.value)} placeholder="Contoh: Kalimantan Selatan"/><small>Isi jika lomba memiliki batasan wilayah atau domisili.</small></label></div>
        </section>
        <section className="panel form-section"><div className="form-section-heading"><div><div className="eyebrow">02 / MINAT DAN PREFERENSI</div><h2>Lomba seperti apa yang kamu cari?</h2><p>Preferensi membantu mengurutkan pilihan, bukan menentukan kelayakan peserta.</p></div><span className="form-number">02</span></div>
          <div className="form-label-block"><strong>Bidang yang diminati</strong><span>Pilih satu atau lebih bidang.</span></div><div className="choice-chip-grid">{categories.filter((item) => item !== "Semua").map((item) => <button type="button" key={item} className={`choice-chip ${draft.preferredCategories.includes(item) ? "selected" : ""}`} onClick={() => toggleCategory(item)}>{draft.preferredCategories.includes(item) && <Icon name="check" size={13}/>}{item}</button>)}</div>
          <div className="form-grid spaced"><label>Format pelaksanaan <select value={draft.preferredMode} onChange={(e) => update("preferredMode", e.target.value as DeliveryMode | "")}><option value="">Tidak ada preferensi</option><option value="Online">Online</option><option value="Offline">Offline</option><option value="Hybrid">Hybrid</option></select></label><label>Batas biaya pendaftaran <select value={draft.budget} onChange={(e) => update("budget", Number(e.target.value))}><option value={0}>Rp0 (gratis saja)</option><option value={50000}>Maks. Rp50.000</option><option value={100000}>Maks. Rp100.000</option><option value={250000}>Maks. Rp250.000</option><option value={500000}>Maks. Rp500.000</option><option value={1000000}>Maks. Rp1.000.000</option><option value={999999999}>Semua biaya</option></select></label></div>
        </section>
        <section className="panel form-section"><div className="form-section-heading"><div><div className="eyebrow">03 / KESIAPAN MENGIKUTI LOMBA</div><h2>Kesiapan bergabung dalam tim</h2><p>Informasi ini membantu melihat kebutuhan tim sebelum mendaftar.</p></div><span className="form-number">03</span></div>
          <div className="toggle-row"><div><strong>Bersedia mengikuti lomba tim</strong><span>Kamu bersedia membentuk atau bergabung dengan tim jika diperlukan.</span></div><button type="button" className={`toggle ${draft.canJoinTeam ? "on" : ""}`} onClick={() => update("canJoinTeam", !draft.canJoinTeam)} aria-label="Ubah kesiapan mengikuti lomba tim"><i/></button></div>
          <label className="team-size-field">Jumlah anggota tim saat ini <select value={draft.availableTeamMembers} onChange={(e) => update("availableTeamMembers", Number(e.target.value))}><option value={1}>1 — Saya sendiri</option><option value={2}>2 orang</option><option value={3}>3 orang</option><option value={4}>4 orang</option><option value={5}>5 orang</option></select><small>Jumlah ini dapat diperbarui setelah kamu menemukan anggota tim lain.</small></label>
        </section>
      </div>
      <aside className="profile-side-column"><section className="panel profile-summary-card"><div className="profile-summary-icon"><Icon name="target" size={22}/></div><div className="eyebrow">RINGKASAN PROFIL</div><h3>{draft.educationLevel || "Jenjang belum diisi"}</h3><p>{draft.studyProgram || "Tambahkan program studi"}</p><div className="profile-summary-line"/><div className="summary-stat"><span>Bidang diminati</span><strong>{draft.preferredCategories.length} dipilih</strong></div><div className="summary-stat"><span>Batas biaya</span><strong>{draft.budget >= 999999999 ? "Tidak dibatasi" : `Rp${draft.budget.toLocaleString("id-ID")}`}</strong></div><div className="summary-stat"><span>Kesiapan tim</span><strong>{draft.canJoinTeam ? `${draft.availableTeamMembers} orang` : "Tidak bersedia"}</strong></div><div className="privacy-note"><Icon name="shield" size={15}/><p>Profil tersimpan di browser perangkat ini.</p></div><Button type="submit" className="full-button">Simpan Profil <Icon name="check" size={15}/></Button>{saved && <div className="saved-feedback"><Icon name="checkCircle" size={14}/> Profil tersimpan di perangkat ini.</div>}</section>
        <div className="profile-quick-actions"><button type="button" onClick={useDemoProfile}><Icon name="sparkles" size={14}/> Isi contoh profil</button><button type="button" onClick={() => { resetProfile(); setDraft(blank); }}><Icon name="trash" size={14}/> Hapus profil</button></div></aside>
    </form>
  </div>;
}
