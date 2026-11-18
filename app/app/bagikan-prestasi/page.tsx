import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeading } from "@/components/ui";
import styles from "./prestasi.module.css";

export const metadata: Metadata = {
  title: "Bagikan Prestasi — Jejakarsa",
  description: "Usulkan prestasi mahasiswa untuk Kisah Juara atau kirim rekap dari organisasi.",
};

function responderUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;

    const shortLink = url.hostname === "forms.gle" && /^\/[\w-]+\/?$/.test(url.pathname);
    const responderLink = url.hostname === "docs.google.com" &&
      /^\/forms\/(?:u\/\d+\/)?d\/(?:e\/)?[\w-]+\/viewform\/?$/.test(url.pathname);

    return shortLink || responderLink ? url.href : null;
  } catch {
    return null;
  }
}

export default function BagikanPrestasiPage() {
  const individual = responderUrl(process.env.PRESTASI_FORM_PERORANGAN);
  const partner = responderUrl(process.env.PRESTASI_FORM_MITRA);

  return (
    <div className={`page-stack page-compact ${styles.page}`}>
      <PageHeading
        title="Bagikan Prestasi"
        description="Usulkan prestasi mahasiswa yang bisa kami angkat di Kisah Juara."
      />

      <div className={styles.options}>
        <section className={`panel ${styles.option}`} aria-labelledby="prestasi-perorangan">
          <div className={styles.marker}><Icon name="user" size={21}/></div>
          <h2 id="prestasi-perorangan">Ajukan satu prestasi</h2>
          <p>Untuk prestasi sendiri, tim, atau teman. Siapkan nama peserta, nama lomba, capaian, tahun, dan kontak pengirim. Tautan bukti boleh menyusul.</p>
          <div className={styles.optionAction}>
            {individual ? (
              <a href={individual} className={`button button-primary button-md ${styles.action}`}>
                Buka formulir perorangan <Icon name="arrowUpRight" size={16}/>
              </a>
            ) : <span className={styles.status}>Formulir perorangan belum dibuka.</span>}
          </div>
        </section>

        <section className={`panel ${styles.option} ${styles.partner}`} aria-labelledby="prestasi-mitra">
          <div className={styles.marker}><Icon name="users" size={21}/></div>
          <h2 id="prestasi-mitra">Kirim rekap organisasi</h2>
          <p>Untuk penanggung jawab fakultas, himpunan, atau komunitas yang mengirim beberapa prestasi dalam satu rekap.</p>
          <p className={styles.accessNote}>Akses untuk penanggung jawab yang sudah dikonfirmasi.</p>
          <div className={styles.optionAction}>
            {partner ? (
              <a href={partner} className={`button button-secondary button-md ${styles.action}`}>
                Buka formulir mitra <Icon name="arrowUpRight" size={16}/>
              </a>
            ) : <span className={styles.status}>Formulir mitra belum dibuka.</span>}
          </div>
        </section>
      </div>

      <aside className={styles.reviewNote} aria-label="Proses peninjauan">
        <Icon name="shield" size={15}/>
        <p>Tim Jejakarsa meninjau setiap usulan. Cerita diterbitkan setelah pencapaian diperiksa dan narasumber memberi izin.</p>
      </aside>
    </div>
  );
}
