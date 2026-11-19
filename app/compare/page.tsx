"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useApp } from "@/components/app-provider";
import type { Competition } from "@/lib/types";
import { assessEligibility, formatCompetitionFee, formatDate } from "@/lib/eligibility";
import { Badge, EmptyState, PageHeading } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function ComparePage() {
  const { compareIds, toggleCompare, profile, competitions, catalogMode } = useApp();
  const selected = compareIds.map((id) => competitions.find((item) => item.id === id)).filter((item): item is Competition => Boolean(item));
  const rows = [
    { label: "Pemeriksaan persyaratan", get: (item: Competition) => { const result = assessEligibility(item, profile); return result.state === "eligible" ? "Syarat terpenuhi" : result.state === "not-eligible" ? "Belum Sesuai" : result.state === "incomplete" ? "Profil belum lengkap" : "Perlu pemeriksaan"; } },
    { label: "Bidang", get: (item: Competition) => item.category },
    { label: "Jenjang pendidikan", get: (item: Competition) => item.level.join(", ") },
    { label: "Bentuk partisipasi", get: (item: Competition) => item.participation },
    { label: "Jumlah anggota tim", get: (item: Competition) => item.minTeamSize ? `${item.minTeamSize}–${item.maxTeamSize ?? "?"} orang` : "Individu" },
    { label: "Biaya pendaftaran", get: (item: Competition) => formatCompetitionFee(item) },
    { label: "Format pelaksanaan", get: (item: Competition) => item.mode },
    { label: "Lokasi", get: (item: Competition) => item.location },
    { label: "Batas pendaftaran", get: (item: Competition) => formatDate(item.deadline) },
    { label: "Tema", get: (item: Competition) => item.theme },
  ];

  return <div className="page-stack page-compact compare-page"><PageHeading title="Bandingkan Lomba" description="Lihat perbedaan persyaratan, biaya, format, dan tenggat dari beberapa lomba." action={<Badge tone="blue">{selected.length} / 3 dipilih</Badge>}/>
    {compareIds.length > selected.length && <p className="small-muted">Sebagian lomba yang pernah dibandingkan sudah tidak tersedia dalam katalog terbit. Pilih lomba aktif lainnya.</p>}
    {selected.length === 0 ? <EmptyState icon="layers" title="Belum ada lomba yang dipilih" description="Pilih maksimal tiga lomba melalui kartu atau halaman detail." action={<Link href="/explore" className="button button-primary button-sm">Cari Lomba <Icon name="arrow" size={14}/></Link>}/> : <>
      <div className="compare-toolbar"><div><strong>{selected.length} lomba dipilih</strong><span>{catalogMode === "live" ? "Data mengikuti edisi terakhir yang diterbitkan redaksi." : "Tabel ini menggunakan informasi dari data contoh."}</span></div><Link href="/explore" className="text-link">Tambah pilihan <Icon name="plus" size={14}/></Link></div>
      <div className="compare-table-wrap panel"><table className="compare-table" role="table" aria-label="Perbandingan lomba" style={{ "--compare-columns": selected.length } as CSSProperties}><thead role="rowgroup"><tr role="row"><th className="compare-label-column" scope="col" role="columnheader">Aspek perbandingan</th>{selected.map((item) => <th key={item.id} scope="col" role="columnheader"><div className="compare-column-head"><div className="eyebrow">{item.category}</div><strong>{item.title}</strong><button onClick={() => toggleCompare(item.id)}><Icon name="close" size={13}/> Hapus</button></div></th>)}</tr></thead><tbody role="rowgroup">{rows.map((row, index) => <tr key={row.label} role="row"><th scope="row" role="rowheader">{row.label}</th>{selected.map((item) => <td role="cell" key={`${item.id}-${row.label}`} className={index === 0 ? "compare-highlight" : ""}>{row.get(item)}</td>)}</tr>)}</tbody></table></div>
      <div className="compare-insight"><div className="compare-insight-icon"><Icon name="lightbulb" size={18}/></div><div><strong>Periksa hal-hal yang perlu disiapkan sebelum memilih.</strong><p>Bandingkan syarat pendidikan, jumlah anggota tim, biaya, tenggat, dan waktu persiapan.</p></div></div>
    </>}
  </div>;
}
