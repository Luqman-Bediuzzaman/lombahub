"use client";

import Link from "next/link";
import { useMemo } from "react";
import { competitions, playbooks } from "@/lib/demo-data";
import { useApp } from "@/components/app-provider";
import { OpportunityCard } from "@/components/opportunity-card";
import { LinkButton, SectionTitle } from "@/components/ui";
import { Icon } from "@/components/icons";
import { rankByFit } from "@/lib/recommendations";
import { StoryHome } from "@/components/stories/story-home";

export default function HomePage() {
  const { profile } = useApp();
  const profileReady = Boolean(profile.educationLevel && profile.studyProgram);
  const hasPreferences = Boolean(profile.educationLevel || profile.preferredCategories.length || profile.preferredMode);
  const featured = useMemo(() => (hasPreferences ? rankByFit(competitions, profile) : [...competitions].sort((a, b) => a.deadline.localeCompare(b.deadline))).slice(0, 3), [hasPreferences, profile]);

  return (
    <div className="dashboard-page">
      <StoryHome/>

      <section className="hero-panel home-hero">
        <div className="hero-copy">
          <div className="hero-eyebrow"><span className="eyebrow-line"/> INFORMASI LOMBA MAHASISWA</div>
          <h1>Temukan Lomba.<br/><em>Raih Prestasi.</em></h1>
          <div className="hero-actions"><LinkButton href="/explore" size="lg">Cari Lomba <Icon name="arrow" size={16}/></LinkButton><Link href="/playbook" className="hero-text-link">Baca Panduan <Icon name="arrowUpRight" size={14}/></Link></div>
        </div>
        <span className="hero-watermark" aria-hidden="true">j.</span>
      </section>

      {!profileReady && (
        <section className="profile-nudge home-profile-nudge panel" aria-label="Lengkapi profil peserta">
          <div className="profile-nudge-symbol"><Icon name="target" size={19}/></div>
          <div className="profile-nudge-copy">
            <h2>Lengkapi profil untuk cek kelayakan lomba.</h2>
          </div>
          <LinkButton href="/profile" variant="secondary" size="sm" className="home-profile-link">Lengkapi <Icon name="arrowUpRight" size={13}/></LinkButton>
        </section>
      )}

      <section className="content-section">
        <SectionTitle title={hasPreferences ? "Lomba untukmu" : "Lomba dengan tenggat terdekat"} subtitle={hasPreferences ? "Urutan lomba disesuaikan dengan bidang pilihan dan hasil pemeriksaan profil." : "Lomba dengan batas pendaftaran paling dekat."} action={<Link href="/explore" className="section-link">Lihat semua lomba <Icon name="arrow" size={14}/></Link>}/>
        <div className="opportunity-grid">{featured.map((competition) => <OpportunityCard key={competition.id} competition={competition}/>)}</div>
      </section>

      <section className="home-guide-panel" aria-label="Panduan dan catatan lomba">
        <div className="home-guide-art" aria-hidden="true">
          <div className="home-guide-book">
            <div className="home-guide-book-head"><span>j.</span><span>CATATAN / 01</span></div>
            <div className="home-guide-book-content"><span className="home-guide-book-mark">01</span><strong>PANDUAN<br/>LOMBA</strong></div>
            <div className="home-guide-book-foot">BACA · PAHAMI · SIAPKAN</div>
          </div>
        </div>
        <div className="home-guide-content">
          <div className="home-guide-kicker"><span className="home-guide-kicker-dot"/> PANDUAN / CATATAN <span className="home-guide-kicker-index">EDISI 01</span></div>
          <h2>{playbooks[0].title}</h2>
          <Link href={`/playbook/${playbooks[0].slug}`} className="home-guide-action">Baca panduan <Icon name="arrowUpRight" size={15}/></Link>
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
