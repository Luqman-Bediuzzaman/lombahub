import type { Competition, EligibilityCheck, EligibilityResult, UserProfile } from "./types";

function programMatches(program: string, rule: string) {
  const normalized = program.toLowerCase();
  if (rule === "all") return true;
  if (rule === "programs") {
    return ["teknik", "informatika", "komputer", "sistem informasi", "teknologi", "rekayasa"].some((word) => normalized.includes(word));
  }
  return false;
}

export function assessEligibility(competition: Competition, profile: UserProfile): EligibilityResult {
  const checks: EligibilityCheck[] = competition.requirements.map((requirement) => {
    const { field, rule } = requirement;
    if (requirement.evidence.status !== "verified" || rule === "unknown") {
      return { requirement, state: "unknown", explanation: "Ketentuan pada sumber belum cukup jelas atau belum terverifikasi." };
    }

    if (field === "educationLevel") {
      if (!profile.educationLevel) return { requirement, state: "unknown", explanation: "Lengkapi jenjang pendidikan pada profil untuk memeriksa syarat ini." };
      const allowed = competition.level;
      const matched = allowed.includes(profile.educationLevel as never);
      return {
        requirement,
        state: matched ? "match" : "mismatch",
        explanation: matched ? `Jenjang ${profile.educationLevel} termasuk jenjang yang diterima.` : `Jenjang ${profile.educationLevel} tidak tercantum dalam jenjang yang diterima (${allowed.join(", ")}).`,
      };
    }

    if (field === "studyProgram") {
      if (rule === "all") return { requirement, state: "match", explanation: "Sumber menyatakan kompetisi terbuka untuk seluruh program studi." };
      if (!profile.studyProgram.trim()) return { requirement, state: "unknown", explanation: "Program studi belum diisi pada profil." };
      const matched = programMatches(profile.studyProgram, rule);
      return {
        requirement,
        state: matched ? "match" : "unknown",
        explanation: matched ? "Program studi memiliki keterkaitan dengan bidang yang tercantum dalam persyaratan." : "Kecocokan program studi belum dapat dipastikan dari informasi yang tersedia. Hubungi penyelenggara untuk memastikannya.",
      };
    }

    if (field === "teamSize") {
      if (rule === "individual") return { requirement, state: "match", explanation: "Kompetisi menerima pendaftaran individu." };
      if (!profile.canJoinTeam && competition.participation === "Tim") {
        return { requirement, state: "preference-conflict", explanation: "Kompetisi mensyaratkan tim, sedangkan profil menyatakan belum dapat bergabung atau membentuk tim." };
      }
      if (rule === "team" && competition.minTeamSize && profile.availableTeamMembers < competition.minTeamSize) {
        return { requirement, state: "preference-conflict", explanation: `Tim saat ini tercatat ${profile.availableTeamMembers} orang; minimum ${competition.minTeamSize}. Ini hambatan kesiapan, bukan otomatis ketidaklayakan peserta.` };
      }
      return { requirement, state: "match", explanation: "Format partisipasi tersedia; pastikan jumlah anggota final sesuai panduan." };
    }

    if (field === "fee") {
      if (competition.feeStatus === "Belum diketahui") return { requirement, state: "unknown", explanation: "Biaya pendaftaran belum tercantum secara jelas." };
      if (competition.feeAmount !== null && competition.feeAmount > profile.budget) {
        return { requirement, state: "preference-conflict", explanation: `Biaya ${formatCurrency(competition.feeAmount)} melampaui batas anggaran profil ${formatCurrency(profile.budget)}. Ini konflik preferensi/anggaran, bukan syarat akademik.` };
      }
      return { requirement, state: "match", explanation: competition.feeStatus === "Gratis" ? "Tidak ada biaya pendaftaran yang tercatat." : "Biaya masih berada dalam batas anggaran yang diatur pada profil." };
    }

    return { requirement, state: "not-applicable", explanation: "Pemeriksaan ini belum didukung oleh profil saat ini." };
  });

  const matched = checks.filter((check) => check.state === "match").length;
  const mismatched = checks.filter((check) => check.state === "mismatch").length;
  const unknown = checks.filter((check) => check.state === "unknown").length;
  const incompleteProfile = !profile.educationLevel;
  const hasUnknown = unknown > 0 || incompleteProfile;
  const hasPreferenceConflict = checks.some((check) => check.state === "preference-conflict");

  let state: EligibilityResult["state"] = "eligible";
  let summary = "Persyaratan wajib yang tersedia sesuai dengan profil yang diisi.";
  if (mismatched > 0) {
    state = "not-eligible";
    summary = "Ada persyaratan wajib yang tidak sesuai dengan profil. Periksa bukti sebelum mengambil keputusan.";
  } else if (hasUnknown) {
    state = incompleteProfile && matched === 0 ? "incomplete" : "needs-review";
    summary = "Informasi persyaratan atau profil belum cukup untuk memastikan kecocokan.";
  } else if (hasPreferenceConflict) {
    state = "needs-review";
    summary = "Persyaratan peserta yang tercatat sesuai, tetapi masih ada hal terkait kesiapan atau biaya yang perlu dipertimbangkan.";
  }

  return { state, checks, matched, unknown, mismatched, summary };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function daysUntil(date: string) {
  const now = new Date();
  const target = new Date(`${date}T23:59:59`);
  return Math.ceil((target.getTime() - now.setHours(0, 0, 0, 0)) / 86400000);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}
