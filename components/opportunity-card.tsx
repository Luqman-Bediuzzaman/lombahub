"use client";

import Link from "next/link";
import { useApp } from "@/components/app-provider";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui";
import { assessEligibility, formatCurrency, formatDate } from "@/lib/eligibility";
import { getFitSignals } from "@/lib/recommendations";
import type { Competition } from "@/lib/types";

const categoryClass: Record<string, string> = {
  "Inovasi & Teknologi": "category-sage",
  "Riset & Karya Tulis": "category-blue",
  "Desain & UI/UX": "category-lilac",
  "Bisnis & Kewirausahaan": "category-orange",
  "Pemrograman": "category-blue",
  "Esai & Karya Tulis": "category-sage",
};

export function OpportunityCard({ competition, compact = false }: { competition: Competition; compact?: boolean }) {
  const { profile, isSaved, toggleSaved, compareIds, toggleCompare } = useApp();
  const assessment = assessEligibility(competition, profile);
  const fit = getFitSignals(competition, profile);
  const hasProfile = Boolean(profile.educationLevel);
  const saved = isSaved(competition.id);
  const compared = compareIds.includes(competition.id);
  const stateTone = assessment.state === "eligible" ? "green" : assessment.state === "not-eligible" ? "red" : "amber";
  const stateLabel = !hasProfile ? "Lengkapi profil" : assessment.state === "eligible" ? "Syarat terpenuhi" : assessment.state === "not-eligible" ? "Belum sesuai" : "Perlu pemeriksaan";

  return (
    <article className={`opportunity-card ${compact ? "opportunity-card-compact" : ""}`}>
      <div className="opportunity-card-top">
        <span className={`category-marker ${categoryClass[competition.category] ?? "category-sage"}`}>{competition.discipline.slice(0, 1)}</span>
        <div className="opportunity-card-actions">
          <button className={`mini-icon-button ${saved ? "is-active" : ""}`} onClick={() => toggleSaved(competition.id)} aria-label={saved ? "Hapus dari Tersimpan" : "Simpan lomba"}><Icon name="bookmark" size={16}/></button>
          <button className={`mini-icon-button ${compared ? "is-active" : ""}`} onClick={() => toggleCompare(competition.id)} aria-label={compared ? "Hapus dari perbandingan" : "Bandingkan lomba"}><Icon name="scale" size={16}/></button>
        </div>
      </div>
      <div className="opportunity-card-body">
        <div className="opportunity-meta-line"><span>{competition.category}</span><span className="meta-dot">·</span><span>{competition.mode}</span></div>
        <Link href={`/opportunities/${competition.slug}`} className="opportunity-title-link"><h3>{competition.title}</h3></Link>
        <p className="opportunity-organizer">{competition.organizer}</p>
        {!compact && <p className="opportunity-summary">{competition.summary}</p>}
        {hasProfile && (fit.reasons.length > 0 || fit.tradeoffs.length > 0) && <div className="fit-signal-row"><Icon name={fit.reasons.length > 0 ? "sparkles" : "alert"} size={12}/><span>{fit.reasons[0] ?? fit.tradeoffs[0]}</span></div>}
      </div>
      <div className="opportunity-facts">
        <div><Icon name="calendar" size={14}/><span>Batas daftar {formatDate(competition.deadline)}</span></div>
        <div><Icon name="wallet" size={14}/><span>{competition.feeStatus === "Berbayar" ? formatCurrency(competition.feeAmount ?? 0) : competition.feeStatus}</span></div>
        <div><Icon name="users" size={14}/><span>{competition.participation === "Tim" ? `${competition.minTeamSize}–${competition.maxTeamSize} orang` : competition.participation}</span></div>
      </div>
      <div className="eligibility-strip">
        <div className="eligibility-strip-main">
          <Badge tone={stateTone} dot>{stateLabel}</Badge>
          {hasProfile && <span className="eligibility-mini-copy">{assessment.matched}/{assessment.checks.length} syarat sesuai</span>}
        </div>
        <Link href={`/opportunities/${competition.slug}`} className="text-link">Lihat detail <Icon name="arrowUpRight" size={13}/></Link>
      </div>
    </article>
  );
}
