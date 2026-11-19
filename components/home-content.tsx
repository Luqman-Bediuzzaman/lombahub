"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { playbooks } from "@/lib/demo-data";
import { useApp } from "@/components/app-provider";
import { OpportunityCard } from "@/components/opportunity-card";
import { LinkButton, SectionTitle } from "@/components/ui";
import { Icon } from "@/components/icons";
import { getHomeDiscovery } from "@/lib/home-discovery";
import { hasPrimaryProfile } from "@/lib/profile-context";
import { StoryHome } from "@/components/stories/story-home";
import { ParticipationSteps } from "@/components/participation-steps";
import styles from "@/app/home.module.css";
import type { WinnerStory } from "@/lib/stories";

export default function HomeContent({stories, storiesUnavailable = false}: {stories: WinnerStory[]; storiesUnavailable?: boolean}) {
  const { profile, hydrated, competitions } = useApp();
  const profileReady = hasPrimaryProfile(profile);
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => { setToday(new Date()); }, []);
  const discovery = useMemo(() => today ? getHomeDiscovery(competitions, profile, today) : null, [today, profile, competitions]);

  return (
    <div className="dashboard-page">
      {storiesUnavailable ? (
        <p role="status" className="small-muted">Kisah Juara sementara belum dapat dimuat. <Link href="/kisah-juara">Buka arsip kisah</Link></p>
      ) : <StoryHome stories={stories}/>}

      <section className="hero-panel home-hero">
        <div className="hero-copy">
          <h1>Temukan Lomba.<br/><em>Raih Prestasi.</em></h1>
          <div className="hero-actions"><LinkButton href="/explore" size="lg">Cari Lomba <Icon name="arrow" size={16}/></LinkButton><Link href="/playbook" className="hero-text-link">Baca Panduan <Icon name="arrowUpRight" size={14}/></Link></div>
        </div>
        <span className="hero-watermark" aria-hidden="true">j.</span>
      </section>

      {hydrated && !profileReady && (
        <section className="profile-nudge home-profile-nudge panel" aria-label="Lengkapi profil peserta">
          <div className="profile-nudge-symbol"><Icon name="target" size={19}/></div>
          <div className="profile-nudge-copy">
            <h2>Lengkapi profil untuk cek kelayakan lomba.</h2>
          </div>
          <LinkButton href="/profile" variant="secondary" size="sm" className="home-profile-link">Lengkapi <Icon name="arrowUpRight" size={13}/></LinkButton>
        </section>
      )}

      <section className="content-section">
        <SectionTitle
          title={discovery?.title ?? "Jelajahi Lomba"}
          subtitle={discovery?.subtitle}
          action={hydrated && !!discovery?.items.length && (
            <Link href="/explore" className="section-link">Lihat semua lomba <Icon name="arrow" size={14}/></Link>
          )}
        />
        {!hydrated || !discovery ? (
          <p className="small-muted" role="status">Menyiapkan pilihan lomba...</p>
        ) : discovery.items.length > 0 ? (
          <div className="opportunity-grid">
            {discovery.items.map((competition) => (
              <OpportunityCard key={competition.id} competition={competition} compact listStyle/>
            ))}
          </div>
        ) : (
          <div className={styles.recommendationEmpty}>
            <p>{profileReady ? "Belum ada rekomendasi untuk profilmu saat ini." : "Belum ada rekomendasi lomba saat ini."}</p>
            <LinkButton href="/explore" variant="secondary">Jelajahi katalog <Icon name="arrow" size={15}/></LinkButton>
          </div>
        )}
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

      <section className={`content-section pathway-section ${styles.steps}`}>
        <div className="section-heading-inline"><div><div className="eyebrow">LANGKAH MENGIKUTI LOMBA</div><h2>Dari mencari hingga menyiapkan pendaftaran.</h2><p>Ikuti empat tahap ini saat memilih dan menyiapkan lomba.</p></div></div>
        <ParticipationSteps/>
      </section>

      <div className={styles.closingCards}>
        <section className={styles.closingCard} aria-labelledby="home-saved-title">
          <div>
            <h2 id="home-saved-title">Simpan lomba pilihanmu.</h2>
            <p>Catat persiapan sebelum mendaftar.</p>
          </div>
          <LinkButton href="/workspace" variant="dark">Buka Tersimpan <Icon name="arrow" size={15}/></LinkButton>
        </section>

        <section className={`${styles.closingCard} ${styles.prestasiCard}`} aria-labelledby="home-prestasi-title">
          <div>
            <h2 id="home-prestasi-title">Ajukan prestasi untuk Kisah Juara.</h2>
            <p>Kirim prestasimu atau usulkan teman.</p>
          </div>
          <LinkButton href="/bagikan-prestasi" variant="secondary">Bagikan Prestasi <Icon name="arrow" size={15}/></LinkButton>
        </section>
      </div>
    </div>
  );
}
