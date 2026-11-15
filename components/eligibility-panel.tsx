import Link from "next/link";
import { assessEligibility } from "@/lib/eligibility";
import type { Competition, UserProfile } from "@/lib/types";
import { Badge } from "@/components/ui";
import { Icon } from "@/components/icons";

const evidenceLabel = (status: string) => status === "verified" ? "Terverifikasi" : status === "ambiguous" ? "Perlu klarifikasi" : "Belum diperiksa";

export function EligibilityPanel({ competition, profile }: { competition: Competition; profile: UserProfile }) {
  const result = assessEligibility(competition, profile);
  const state = {
    eligible: { label: "Syarat terpenuhi", tone: "green" as const, icon: "checkCircle" as const },
    "needs-review": { label: "Perlu pemeriksaan", tone: "amber" as const, icon: "alert" as const },
    "not-eligible": { label: "Belum sesuai", tone: "red" as const, icon: "xCircle" as const },
    incomplete: { label: "Profil belum lengkap", tone: "neutral" as const, icon: "user" as const },
  }[result.state];

  return (
    <section className="panel eligibility-panel">
      <div className="panel-heading-row">
        <div><div className="eyebrow">PEMERIKSAAN PROFIL</div><h3>Pemeriksaan Persyaratan</h3></div>
        <Badge tone={state.tone} dot>{state.label}</Badge>
      </div>
      <p className="assessment-summary">{result.summary}</p>
      {!profile.educationLevel && <div className="inline-callout"><Icon name="info" size={16}/><span>Tambahkan jenjang pendidikan di <Link href="/profile">profilmu</Link> untuk memeriksa kecocokan persyaratan.</span></div>}
      <div className="check-list">
        {result.checks.map((check) => {
          const icon = check.state === "match" ? "checkCircle" : check.state === "mismatch" ? "xCircle" : "alert";
          const tone = check.state === "match" ? "success" : check.state === "mismatch" ? "danger" : check.state === "preference-conflict" ? "warning" : "muted";
          const label = check.state === "match" ? "Sesuai" : check.state === "mismatch" ? "Tidak sesuai" : check.state === "preference-conflict" ? "Kesiapan" : "Belum terverifikasi";
          return (
            <div key={check.requirement.id} className="check-item">
              <div className={`check-symbol ${tone}`}><Icon name={icon} size={16}/></div>
              <div className="check-item-copy"><div className="check-item-title"><strong>{check.requirement.label}</strong><span>{check.requirement.value}</span></div><p>{check.explanation}</p>
                <details className="evidence-details"><summary><Icon name="file" size={13}/> Bukti dan sumber</summary><div className="evidence-box"><div className="evidence-source"><strong>{check.requirement.evidence.sourceTitle}</strong><span>{check.requirement.evidence.location}</span></div><blockquote>“{check.requirement.evidence.excerpt}”</blockquote><div className="evidence-foot"><span>Contoh bukti · diperiksa {check.requirement.evidence.checkedAt}</span><Badge tone={check.requirement.evidence.status === "verified" ? "green" : "amber"}>{evidenceLabel(check.requirement.evidence.status)}</Badge></div></div></details>
              </div>
              <span className={`check-state state-${tone}`}>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="panel-footnote"><Icon name="shield" size={14}/> Hasil ini membantu membaca ketentuan, bukan keputusan resmi penyelenggara.</div>
    </section>
  );
}
