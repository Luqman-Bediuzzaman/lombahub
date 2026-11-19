import type { Competition, UserProfile } from "./types";
import { assessEligibility } from "./eligibility";
import { hasBudgetAnswer, hasPrimaryProfile, hasTeamAnswer } from "./profile-context";

// Starting editorial policy; this is not an estimate of preparation duration.
export const HOME_MIN_DAYS = 21;

function daysRemaining(value: string, now: Date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return -1;
  const [year, month, day] = value.split("-").map(Number);
  const target = Date.UTC(year, month - 1, day);
  const date = new Date(target);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return -1;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

function informationQuality(item: Competition) {
  const checked = item.requirements.filter(r => r.evidence.status === "verified").length;
  return (item.verificationStatus === "verified" ? 4 : 0)
    + (/^https?:\/\//i.test(item.sourceUrl) ? 3 : 0)
    + (item.requirements.length ? checked / item.requirements.length : 0)
    + (item.feeStatus !== "Belum diketahui" ? 1 : 0);
}

function knownFit(item: Competition, profile: UserProfile) {
  let score = 0;
  if (profile.preferredCategories.includes(item.category)) score += 4;
  if (profile.preferredMode && profile.preferredMode === item.mode) score += 2;
  if (profile.educationLevel && item.level.includes(profile.educationLevel)) score += 1;
  if (hasBudgetAnswer(profile) && (!item.feeCurrency || item.feeCurrency==="IDR") && (!item.feeUnit || item.feeUnit==="Per orang") && item.feeAmount !== null) score += item.feeAmount <= profile.budget ? 1 : -2;
  if (hasTeamAnswer(profile) && item.participation === "Tim") {
    if (!profile.canJoinTeam) score -= 1;
    else if (item.minTeamSize && profile.availableTeamMembers >= item.minTeamSize) score += 1;
  }
  return score;
}

export function getHomeDiscovery(items: Competition[], profile: UserProfile, now: Date, limit = 3) {
  const remaining = items.filter(item => item.title.trim() && item.organizer.trim()
    && item.requirements.length > 0
    && daysRemaining(item.deadline, now) >= HOME_MIN_DAYS
    && assessEligibility(item, profile).state !== "not-eligible");
  const chosen: Competition[] = [];
  const categories = new Set<string>();
  while (remaining.length && chosen.length < limit) {
    remaining.sort((a, b) => knownFit(b, profile) - knownFit(a, profile)
      || Number(categories.has(a.category)) - Number(categories.has(b.category))
      || informationQuality(b) - informationQuality(a)
      || b.publishedAt.localeCompare(a.publishedAt)
      || a.id.localeCompare(b.id));
    const next = remaining.shift()!;
    chosen.push(next);
    categories.add(next.category);
  }

  let title = "Jelajahi Lomba";
  let subtitle = "Telusuri semua pilihan lomba yang tersedia";
  if (hasPrimaryProfile(profile)) {
    title = "Lomba untukmu";
    subtitle = "Rekomendasi pilihan lomba";
  } else if (profile.preferredCategories.length) {
    title = "Pilihan di Bidang Minatmu";
    subtitle = "Mengutamakan bidang pilihanmu";
  } else if (profile.educationLevel) {
    title = "Pilihan Sesuai Jenjangmu";
    subtitle = "Pilihan awal berdasarkan jenjang pendidikanmu";
  } else if (profile.preferredMode) {
    title = "Pilihan Sesuai Formatmu";
    subtitle = "Mengutamakan format pelaksanaan yang kamu pilih.";
  }
  return { items: chosen, title, subtitle };
}
