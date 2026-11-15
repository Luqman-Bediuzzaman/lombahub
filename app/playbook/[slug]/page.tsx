import { notFound } from "next/navigation";
import Link from "next/link";
import { playbooks } from "@/lib/demo-data";
import { Badge } from "@/components/ui";
import { Icon } from "@/components/icons";

export function generateStaticParams() { return playbooks.map((item) => ({ slug: item.slug })); }

export default async function PlaybookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = playbooks.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return <div className="page-stack"><div className="back-link-row"><Link href="/playbook"><Icon name="arrow" size={14}/> Kembali ke panduan</Link><span>PANDUAN / CATATAN</span></div>
    <article className="article-layout"><header className="article-header"><Badge tone="blue">{item.category}</Badge><h1>{item.title}</h1><p>{item.excerpt}</p><div className="article-meta"><span>REDAKSI JEJAKARSA</span><span>·</span><span>{item.readTime}</span><span>·</span><span>DEMO</span></div></header>
      <div className="article-cover"><div className="article-cover-label">CATATAN / 00{playbooks.findIndex((entry) => entry.slug === item.slug) + 1}</div><div className="article-cover-title">PAHAMI<br/><em>ALUR</em><br/>LOMBA<span>.</span></div><div className="article-cover-footer">TEMUKAN · PAHAMI · PILIH · SIAPKAN</div></div>
      <div className="article-body"><p className="article-lead">Sebelum mendaftar, baca panduan lomba sampai bagian pengumpulan. Catat siapa yang boleh ikut, apa yang harus dibuat, cara mengirim karya, dan tanggal penting. Jika ada informasi yang belum jelas, jangan menebak—konfirmasi kepada penyelenggara.</p>
        <h2>1. Bedakan syarat wajib dan arahan</h2><p>Syarat wajib menentukan siapa yang boleh ikut dan apa yang harus dipenuhi. Arahan memberi penjelasan tentang tema atau harapan penyelenggara. Jangan menganggap arahan sebagai syarat tambahan kecuali panduan menyatakannya secara jelas.</p>
        <div className="article-callout"><strong>Hal yang perlu diingat</strong><p>Setiap ketentuan yang dapat menggugurkan peserta harus merujuk pada sumber resmi, bukan hanya disimpulkan dari kebiasaan lomba lain.</p></div>
        <h2>2. Buat daftar persyaratan</h2><p>Catat empat hal: syarat peserta, bentuk karya, cara pengumpulan, dan jadwal. Tulis bagian atau halaman dokumen yang menjadi sumber setiap informasi.</p>
        <div className="article-table"><div><span>PERSYARATAN PESERTA</span><strong>Siapa yang boleh ikut?</strong><small>Jenjang, program studi, wilayah, dan status peserta</small></div><div><span>HASIL KARYA</span><strong>Apa yang harus dibuat?</strong><small>Proposal, prototipe, esai, atau presentasi</small></div><div><span>PENGUMPULAN</span><strong>Bagaimana karya dikirim?</strong><small>Format, ukuran berkas, platform, dan dokumen</small></div><div><span>JADWAL</span><strong>Kapan setiap tahap berlangsung?</strong><small>Pendaftaran, pengumpulan, seleksi, dan pengumuman</small></div></div>
        <h2>3. Ubah ketentuan menjadi daftar kerja</h2><p>Setelah syarat dipahami, susun pekerjaan dari awal sampai pengumpulan. Bagi tugas setiap anggota tim dan tentukan waktu untuk pemeriksaan akhir.</p>
        <h2>4. Konfirmasi informasi yang belum jelas</h2><p>Jika panduan tidak mencantumkan suatu ketentuan, tandai sebagai informasi yang belum diketahui. Baca bagian tanya jawab atau hubungi penyelenggara. Simpan jawaban dan tanggal konfirmasi agar informasinya mudah diperiksa kembali.</p>
        <div className="article-endnote"><Icon name="info" size={16}/><p>Materi contoh untuk fitur Panduan.</p></div>
      </div>
      <div className="article-next"><div><span className="eyebrow">LANJUTKAN KE LOMBA</span><strong>Gunakan daftar ini saat memeriksa lomba yang kamu minati.</strong></div><Link href="/explore" className="button button-primary">Cari Lomba <Icon name="arrow" size={14}/></Link></div>
    </article>
  </div>;
}
