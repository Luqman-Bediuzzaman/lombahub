import type { Competition, UserProfile } from "./types";
import { assessEligibility } from "./eligibility";
import { hasBudgetAnswer, hasTeamAnswer } from "./profile-context";

export interface FitSignals {
  score: number;
  reasons: string[];
  tradeoffs: string[];
}

/**
 * Transparent preference/readiness ranking. This score is only used to order
 * discovery results; it is not an eligibility decision and is not shown as a
 * probability or quality rating.
 */
export function getFitSignals(competition: Competition, profile: UserProfile): FitSignals {
  let score = 0;
  const reasons: string[] = [];
  const tradeoffs: string[] = [];

  if (profile.preferredCategories.length > 0 && profile.preferredCategories.includes(competition.category)) {
    score += 4;
    reasons.push("Sesuai dengan bidang yang kamu minati");
  }

  if (profile.preferredMode) {
    if (competition.mode === profile.preferredMode) {
      score += 2;
      reasons.push(`Sesuai dengan pilihan format ${profile.preferredMode.toLowerCase()}`);
    } else {
      score -= 1;
      tradeoffs.push(`Format pelaksanaannya ${competition.mode.toLowerCase()}, berbeda dari pilihanmu`);
    }
  }

  if (competition.feeStatus === "Gratis") {
    if (hasBudgetAnswer(profile)) score += profile.budget === 0 ? 2 : 1;
    reasons.push("Tidak ada biaya pendaftaran");
  } else if (competition.feeAmount !== null && hasBudgetAnswer(profile)) {
    if (competition.feeAmount <= profile.budget) {
      score += 1;
      reasons.push("Biaya pendaftaran sesuai anggaranmu");
    } else {
      score -= 2;
      tradeoffs.push("Biaya pendaftaran melebihi anggaranmu");
    }
  }

  const eligibility = assessEligibility(competition, profile);
  if (eligibility.state === "eligible") {
    score += 3;
    reasons.push("Persyaratan sesuai dengan profilmu");
  } else if (eligibility.state === "not-eligible") {
    score -= 8;
    tradeoffs.push("Ada persyaratan yang tidak sesuai dengan profilmu");
  } else if (eligibility.state === "needs-review") {
    score -= 1;
    tradeoffs.push("Ada persyaratan yang masih perlu diperiksa");
  } else {
    tradeoffs.push("Lengkapi profil untuk memeriksa persyaratan");
  }

  if (competition.participation === "Tim" && competition.minTeamSize && hasTeamAnswer(profile)) {
    if (!profile.canJoinTeam) {
      score -= 1;
      tradeoffs.push("Lomba ini memerlukan tim");
    } else if (profile.availableTeamMembers < competition.minTeamSize) {
      tradeoffs.push(`Tim perlu beranggotakan minimal ${competition.minTeamSize} orang`);
    } else {
      score += 1;
      reasons.push("Jumlah anggota tim saat ini memenuhi batas minimum");
    }
  }

  return { score, reasons: reasons.slice(0, 3), tradeoffs: tradeoffs.slice(0, 3) };
}

export function rankByFit(items: Competition[], profile: UserProfile) {
  const eligibilityRank = (item: Competition) => {
    const state = assessEligibility(item, profile).state;
    if (state === "eligible") return 3;
    if (state === "needs-review") return 2;
    if (state === "incomplete") return 1;
    return 0;
  };
  return [...items].sort((a, b) =>
    eligibilityRank(b) - eligibilityRank(a)
    || getFitSignals(b, profile).score - getFitSignals(a, profile).score
    || a.deadline.localeCompare(b.deadline)
  );
}
