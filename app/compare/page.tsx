"use client";

import Link from "next/link";
import { useApp } from "@/components/app-provider";
import { competitions } from "@/lib/demo-data";
import { assessEligibility, formatCurrency, formatDate } from "@/lib/eligibility";
import { Badge, EmptyState, PageHeading } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function ComparePage() {
  const { compareIds, toggleCompare, profile } = useApp();
  const selected = compareIds.map((id) => competitions.find((item) => item.id === id)).filter((item): item is (typeof competitions)[number] => Boolean(item));
  const rows = [
    { label: "Pemeriksaan persyaratan", get: (item: (typeof competitions)[number]) => { const result = assessEligibility(item, profile); return result.state === "eligible" ? "Berpotensi memenuhi syarat" : result.state === "not-eligible" ? "Ada syarat tidak sesuai" : result.state === "incomplete" ? "Profil belum lengkap" : "Perlu pemeriksaan"; } },
    { label: "Bidang", get: (item: (typeof competitions)[number]) => item.category },
    { label: "Jenjang pendidikan", get: (item: (typeof competitions)[number]) => item.level.join(", ") },
    { label: "Bentuk partisipasi", get: (item: (typeof competitions)[number]) => item.participation },
    { label: "Jumlah anggota tim", get: (item: (typeof competitions)[number]) => item.minTeamSize ? `${item.minTeamSize}–${item.maxTeamSize} orang` : "Individu" },
    { label: "Biaya pendaftaran", get: (item: (typeof competitions)[number]) => item.feeStatus === "Berbayar" ? formatCurrency(item.feeAmount ?? 0) : item.feeStatus },
    { label: "Format pelaksanaan", get: (item: (typeof competitions)[number]) => item.mode },
    { label: "Lokasi", get: (item: (typeof competitions)[number]) => item.location },
    { label: "Batas pendaftaran", get: (item: (typeof competitions)[number]) => formatDate(item.deadline) },
    { label: "Tema", get: (item: (typeof competitions)[number]) => item.theme },
  ];

  return <div className="page-stack"><PageHeading eyebrow="PERBANDINGAN LOMBA" title="Bandingkan Lomba" description="Lihat perbedaan persyaratan, biaya, format, dan tenggat dari beberapa lomba." action={<Badge tone="blue">{selected.length} / 3 dipilih</Badge>}/>
    {selected.length === 0 ? <EmptyState icon="layers" title="Belum ada lomba yang dipilih" description="Pilih maksimal tiga lomba melalui kartu atau halaman detail." action={<Link href="/explore" className="button button-primary button-sm">Cari Lomba <Icon name="arrow" size={14}/></Link>}/> : <>
      <div className="compare-toolbar"><div><strong>{selected.length} lomba dipilih</strong><span>Tabel ini menggunakan informasi dari data contoh.</span></div><Link href="/explore" className="text-link">Tambah pilihan <Icon name="plus" size={14}/></Link></div>
      <div className="compare-table-wrap panel"><table className="compare-table"><thead><tr><th className="compare-label-column">Aspek perbandingan</th>{selected.map((item) => <th key={item.id}><div className="compare-column-head"><div className="eyebrow">{item.category}</div><strong>{item.title}</strong><button onClick={() => toggleCompare(item.id)}><Icon name="close" size={13}/> Hapus</button></div></th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.label}><th>{row.label}</th>{selected.map((item) => <td key={`${item.id}-${row.label}`} className={index === 0 ? "compare-highlight" : ""}>{row.get(item)}</td>)}</tr>)}</tbody></table></div>
      <div className="compare-insight"><div className="compare-insight-icon"><Icon name="lightbulb" size={18}/></div><div><strong>Periksa hal-hal yang perlu disiapkan sebelum memilih.</strong><p>Bandingkan syarat pendidikan, jumlah anggota tim, biaya, tenggat, dan waktu persiapan.</p></div></div>
    </>}
  </div>;
}
