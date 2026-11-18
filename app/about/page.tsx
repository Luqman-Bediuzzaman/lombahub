import Link from "next/link";
import { PageHeading, Badge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { ParticipationSteps } from "@/components/participation-steps";

export default function AboutPage() {
  return <div className="page-stack page-compact about-page"><PageHeading title="Tentang Jejakarsa" action={<Badge tone="amber">Prototipe</Badge>}/>
    <section className="about-manifesto panel-dark"><h2>Informasi lomba.<br/><em>Lebih mudah diperiksa.</em></h2></section>
    <ParticipationSteps/>
    <section className="panel about-boundaries"><h2>Yang bisa kamu gunakan</h2><div className="boundaries-grid"><div><Badge tone="green">Fitur saat ini</Badge><ul><li>Mencari dan memfilter lomba</li><li>Memeriksa persyaratan berdasarkan profil</li><li>Menyimpan dan membandingkan pilihan</li><li>Mencatat persiapan dan membaca panduan</li><li>Membaca Kisah Juara</li></ul></div><div><Badge tone="amber">Batasan prototipe</Badge><ul><li>Data lomba dan cerita masih berupa contoh</li><li>Profil dan catatan tersimpan di browser ini</li><li>Belum ada akun atau sinkronisasi antarperangkat</li><li>Pendaftaran tetap melalui penyelenggara</li></ul></div></div></section>
    <section className="about-next-step"><h2>Mulai dari lomba yang kamu minati.</h2><Link href="/explore" className="button button-primary">Lihat katalog lomba <Icon name="arrow" size={14}/></Link></section>
  </div>;
}
