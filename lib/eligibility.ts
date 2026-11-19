import type { Competition, EligibilityCheck, EligibilityResult, UserProfile } from "./types";
import { hasBudgetAnswer, hasTeamAnswer } from "./profile-context";

function programMatches(program: string, rule: string, allowedPrograms: string[] = []) {
  if (rule === "all") return true;
  if (rule !== "programs" || allowedPrograms.length===0) return false;
  const normalize = (s:string) => s.toLowerCase().trim().replace(/\s+/g," ");
  return allowedPrograms.some(allowed => normalize(allowed) === normalize(program));
}

export function assessEligibility(competition: Competition, profile: UserProfile): EligibilityResult {
  const checks: EligibilityCheck[] = competition.requirements.map((requirement) => {
    const { field, rule } = requirement;
    if (requirement.evidence.status !== "verified" || rule === "unknown" || rule === "manual") {
      return { requirement, state: "unknown", explanation: "Ketentuan pada sumber belum cukup jelas atau belum terverifikasi." };
    }

    if (field === "educationLevel") {
      if (!profile.educationLevel) return { requirement, state: "unknown", explanation: "Lengkapi jenjang pendidikan pada profil untuk memeriksa syarat ini." };
      const allowed = competition.level;
      if (!allowed.length) return { requirement, state:"unknown", explanation:"Jenjang yang diterima belum dinyatakan dalam sumber." };
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
      if(competition.verificationStatus==="sample" && rule==="programs" && !requirement.allowedPrograms?.length) {
        const match=["teknik","informatika","komputer","sistem informasi","teknologi","rekayasa"].some(w=>profile.studyProgram.toLowerCase().includes(w));
        return {requirement,state:match?"match":"unknown",explanation:match?"Program studi berkaitan dengan bidang dalam contoh.":"Periksa kesetaraan nama program studi."};
      }
      if (rule === "programs" && !requirement.allowedPrograms?.length) return { requirement, state:"unknown", explanation:"Daftar program studi yang diterima belum diinput redaksi." };
      const matched = programMatches(profile.studyProgram, rule, requirement.allowedPrograms);
      return {
        requirement,
        state: matched ? "match" : "unknown",
        explanation: matched ? "Nama program studi sesuai dengan daftar dari panduan." : "Nama program studi tidak sama persis dengan daftar sumber. Periksa kesetaraan nama atau hubungi penyelenggara; penilaian otomatis belum final.",
      };
    }

    if (field === "teamSize") {
      if (competition.participation==="Individu atau Tim" && rule==="team" && (!hasTeamAnswer(profile) || !profile.canJoinTeam)) return {requirement,state:"match",explanation:"Peserta dapat mendaftar sendiri. Batas anggota berlaku jika mengikuti jalur tim."};
      if (rule === "team" && (competition.minTeamSize === null || competition.maxTeamSize === null)) return {requirement,state:"unknown",explanation:"Batas minimum atau maksimum anggota tim belum lengkap."};
      if (rule === "individual") return { requirement, state: "match", explanation: "Kompetisi menerima pendaftaran individu." };
      if (competition.verificationStatus==="sample" && competition.participation === "Individu atau Tim" && competition.minTeamSize === 1) {
        return { requirement, state: "match", explanation: "Kompetisi menerima peserta individu; periksa jumlah anggota jika mendaftar sebagai tim." };
      }
      if (!hasTeamAnswer(profile)) return { requirement, state: "unknown", explanation: "Kesiapan dan jumlah anggota tim belum dikonfirmasi pada profil." };
      if (!profile.canJoinTeam && competition.participation === "Tim") {
        return { requirement, state: "preference-conflict", explanation: "Kompetisi mensyaratkan tim, sedangkan profil menyatakan belum dapat bergabung atau membentuk tim." };
      }
      if (rule === "team" && competition.minTeamSize && profile.availableTeamMembers < competition.minTeamSize) {
        return { requirement, state: "preference-conflict", explanation: `Tim saat ini tercatat ${profile.availableTeamMembers} orang; minimum ${competition.minTeamSize}. Ini hambatan kesiapan, bukan otomatis ketidaklayakan peserta.` };
      }
      if (rule === "team" && competition.maxTeamSize!==null && profile.availableTeamMembers > competition.maxTeamSize) {
        return { requirement, state: "preference-conflict", explanation: `Tim saat ini beranggotakan ${profile.availableTeamMembers} orang, melebihi maksimum ${competition.maxTeamSize}. Sesuaikan komposisi tim sebelum mendaftar.` };
      }
      return { requirement, state: "match", explanation: "Jumlah anggota yang diketahui berada dalam batas yang dicatat; pastikan komposisi akhir sesuai panduan." };
    }

    if (field === "fee") {
      if (competition.feeStatus === "Belum diketahui") return { requirement, state: "unknown", explanation: "Biaya pendaftaran belum tercantum secara jelas." };
      if (competition.feeStatus === "Berbayar" && competition.feeAmount===null) return { requirement, state: "unknown", explanation: "Biaya berbayar tetapi nominal belum diumumkan. Tidak bisa dibandingkan dengan anggaran." };
      if (competition.feeStatus === "Berbayar" && competition.feeCurrency && competition.feeCurrency!=="IDR") return { requirement, state: "unknown", explanation: "Biaya memakai mata uang selain IDR. Kecocokan anggaran belum bisa dihitung tanpa kurs dan satuan yang pasti." };
      if (competition.feeStatus === "Berbayar" && competition.feeUnit && competition.feeUnit!=="Per orang") return { requirement, state:"unknown", explanation:`Biaya dicantumkan ${competition.feeUnit.toLowerCase()}; kecocokan dengan anggaran pribadi belum dapat dihitung otomatis tanpa mengetahui pembagian biaya.` };
      if (competition.feeStatus === "Berbayar" && !hasBudgetAnswer(profile)) return { requirement, state: "unknown", explanation: "Batas anggaran belum ditentukan pada profil; kecocokan biaya belum dapat diperiksa." };
      if (competition.feeAmount !== null && competition.feeAmount > profile.budget) {
        return { requirement, state: "preference-conflict", explanation: `Biaya ${formatCurrency(competition.feeAmount)} melampaui batas anggaran profil ${formatCurrency(profile.budget)}. Ini konflik preferensi/anggaran, bukan syarat akademik.` };
      }
      return { requirement, state: "match", explanation: competition.feeStatus === "Gratis" ? "Tidak ada biaya pendaftaran yang tercatat." : "Biaya masih berada dalam batas anggaran yang diatur pada profil." };
    }

    return { requirement, state: "unknown", explanation: "Ketentuan ini harus dicek manual bersama informasi dari penyelenggara; profil belum menyediakan data untuk memastikannya." };
  });

  const matched = checks.filter((check) => check.state === "match").length;
  const mismatched = checks.filter((check) => check.state === "mismatch").length;
  const unknown = checks.filter((check) => check.state === "unknown").length;
  const incompleteProfile = !profile.educationLevel;
  const hasUnknown = unknown > 0 || incompleteProfile || checks.length===0;
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

export function formatCompetitionFee(c: Pick<Competition,"feeStatus"|"feeAmount"|"feeCurrency"|"feeUnit">):string {
  if (c.feeStatus==="Gratis") return "Gratis";
  if (c.feeStatus==="Belum diketahui") return "Biaya belum diketahui";
  if (c.feeAmount===null) return "Berbayar · nominal belum diumumkan";
  let result:string;
  if (!c.feeCurrency || c.feeCurrency==="IDR") result=formatCurrency(c.feeAmount);
  else if (c.feeCurrency==="USD") result=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(c.feeAmount);
  else result=`${c.feeAmount.toLocaleString("id-ID")} (mata uang lain)`;
  return c.feeUnit && c.feeUnit!=="Belum disebutkan" ? `${result} / ${c.feeUnit.toLowerCase().replace(/^per /,"")}`:result;
}
