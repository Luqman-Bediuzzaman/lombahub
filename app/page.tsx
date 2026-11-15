"use client";

import Link from "next/link";
import { useMemo } from "react";
import { competitions, playbooks } from "@/lib/demo-data";
import { useApp } from "@/components/app-provider";
import { OpportunityCard } from "@/components/opportunity-card";
import { Badge, LinkButton, Metric, SectionTitle } from "@/components/ui";
import { Icon } from "@/components/icons";
import { formatDate } from "@/lib/eligibility";
import { rankByFit } from "@/lib/recommendations";

export default function HomePage() {
  const { profile, workspace, compareIds } = useApp();
  const profileReady = Boolean(profile.educationLevel && profile.studyProgram);
  const hasPreferences = Boolean(profile.educationLevel || profile.preferredCategories.length || profile.preferredMode);
  const featured = useMemo(() => (hasPreferences ? rankByFit(competitions, profile) : [...competitions].sort((a, b) => a.deadline.localeCompare(b.deadline))).slice(0, 3), [hasPreferences, profile]);
  const nearest = competitions.slice().sort((a, b) => a.deadline.localeCompare(b.deadline))[0];

  return (
    <div className="dashboard-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-eyebrow"><span className="eyebrow-line"/> INFORMASI LOMBA MAHASISWA</div>
          <h1>Temukan Kompetisi.<br/><em>Raih Prestasi.</em></h1>
          <p>Cari kompetisi berdasarkan bidang dan jenjangmu. Periksa persyaratan, biaya, serta tenggat sebelum menentukan pilihan.</p>
          <div className="hero-actions"><LinkButton href="/explore" size="lg">Cari Kompetisi <Icon name="arrow" size={16}/></LinkButton><Link href="/playbook" className="hero-text-link">Baca Panduan <Icon name="arrowUpRight" size={14}/></Link></div>
          <div className="hero-proof"><span><Icon name="checkCircle" size={14}/> Sumber persyaratan tersedia</span><span><Icon name="scale" size={14}/> Bandingkan beberapa kompetisi</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="orbit-center"><div className="orbit-center-inner"><span>j.</span><small>JEJAKARSA</small></div></div>
          <div className="orbit-node node-a"><span className="orbit-node-icon">◎</span><small>TEMUKAN</small></div>
          <div className="orbit-node node-b"><span className="orbit-node-icon">↗</span><small>PILIH</small></div>
          <div className="orbit-node node-c"><span className="orbit-node-icon">✓</span><small>SIAPKAN</small></div>
          <div className="hero-art-caption">DARI PENGUMUMAN<br/>KE PERSIAPAN</div>
        </div>
        <div className="hero-index">01 <span>/</span> 05</div>
      </section>

      <section className="overview-metrics">
        <Metric label="JUMLAH KOMPETISI" value={competitions.length.toString().padStart(2, "0")} note="Data contoh" icon="compass"/>
        <Metric label="KOMPETISI DISIMPAN" value={workspace.length.toString().padStart(2, "0")} note="Tersimpan di perangkat ini" icon="bookmark"/>
        <Metric label="DIBANDINGKAN" value={compareIds.length.toString().padStart(2, "0")} note="Pilih hingga 3 kompetisi" icon="scale"/>
        <Metric label="TENGGAT TERDEKAT" value={formatDate(nearest.deadline)} note="Tenggat pada data contoh" icon="clock"/>
      </section>

      <section className="profile-nudge panel panel-horizontal">
        <div className="profile-nudge-symbol"><Icon name="target" size={21}/></div>
        <div className="profile-nudge-copy"><div className="eyebrow">PROFIL PESERTA</div><h2>{profileReady ? `${profile.educationLevel} · ${profile.studyProgram}` : "Lengkapi profil singkatmu."}</h2><p>{profileReady ? "Profilmu sudah terisi. Informasi ini akan digunakan dalam pemeriksaan persyaratan." : "Informasi ini membantu memeriksa persyaratan lomba berdasarkan jenjang dan program studimu."}</p></div>
        <div className="profile-nudge-action"><Badge tone={profileReady ? "green" : "amber"} dot>{profileReady ? "Profil terisi" : "Belum diisi"}</Badge><LinkButton href="/profile" variant="secondary" size="sm">{profileReady ? "Ubah profil" : "Lengkapi profil"} <Icon name="arrowUpRight" size={13}/></LinkButton></div>
      </section>

      <section className="content-section">
        <SectionTitle title={hasPreferences ? "Lomba untukmu" : "Lomba dengan tenggat terdekat"} subtitle={hasPreferences ? "Urutan lomba disesuaikan dengan bidang pilihan dan hasil pemeriksaan profil." : "Lomba dengan batas pendaftaran paling dekat."} action={<Link href="/explore" className="section-link">Lihat semua lomba <Icon name="arrow" size={14}/></Link>}/>
        <div className="opportunity-grid">{featured.map((competition) => <OpportunityCard key={competition.id} competition={competition}/>)}</div>
      </section>

      <section className="split-feature-grid">
        <div className="deadline-feature panel-dark">
          <div className="feature-overline"><span className="live-dot"/> PANTAU TENGGAT</div>
          <div className="deadline-big">{new Date(nearest.deadline + "T12:00:00").getDate().toString().padStart(2, "0")}</div>
          <div className="deadline-month">{new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(nearest.deadline + "T12:00:00"))}</div>
          <div className="deadline-rule"/>
          <div className="deadline-label">PENDAFTARAN TERDEKAT</div>
          <h3>{nearest.title}</h3>
          <p>{nearest.summary}</p>
          <Link href={`/opportunities/${nearest.slug}`} className="feature-link">Lihat detail <Icon name="arrowUpRight" size={14}/></Link>
          <div className="deadline-watermark">J.</div>
        </div>
        <div className="playbook-feature panel">
          <div className="playbook-feature-top"><div className="eyebrow">PANDUAN / CATATAN PRAKTIS</div><Badge tone="blue">PANDUAN</Badge></div>
          <div className="playbook-graphic"><div className="playbook-graphic-paper"><span>CATATAN 001</span><strong>PANDUAN<br/>KOMPETISI</strong><i>BACA · PAHAMI · SIAPKAN</i></div><div className="playbook-graphic-stamp">J<br/><small>CATATAN</small></div></div>
          <h3>{playbooks[0].title}</h3><p>{playbooks[0].excerpt}</p>
          <Link href={`/playbook/${playbooks[0].slug}`} className="section-link">Baca panduan <Icon name="arrow" size={14}/></Link>
        </div>
      </section>

      <section className="content-section pathway-section">
        <div className="section-heading-inline"><div><div className="eyebrow">LANGKAH MENGIKUTI LOMBA</div><h2>Dari mencari hingga menyiapkan pendaftaran.</h2><p>Ikuti empat tahap ini saat memilih dan menyiapkan lomba.</p></div></div>
        <div className="pathway-grid">
          {[{n:"01",title:"Temukan",desc:"Cari lomba berdasarkan bidang dan minatmu.",icon:"compass" as const},{n:"02",title:"Periksa",desc:"Baca persyaratan dan lihat sumber informasinya.",icon:"file" as const},{n:"03",title:"Pilih",desc:"Bandingkan biaya, tenggat, dan kebutuhan peserta.",icon:"scale" as const},{n:"04",title:"Siapkan",desc:"Simpan lomba dan catat persiapan pendaftarannya.",icon:"flag" as const}].map((item) => <div className="pathway-step" key={item.n}><div className="pathway-step-top"><span>{item.n}</span><Icon name={item.icon} size={19}/></div><h3>{item.title}</h3><p>{item.desc}</p></div>)}
        </div>
      </section>

      <section className="closing-cta"><div><div className="eyebrow">MULAI DARI SATU PILIHAN</div><h2>Simpan lomba pilihanmu.<br/><em>Catat persiapan sebelum mendaftar.</em></h2></div><LinkButton href="/workspace" variant="dark">Buka Tersimpan <Icon name="arrow" size={15}/></LinkButton></section>
    </div>
  );
}
