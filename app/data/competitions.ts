/**
 * Shared Competition data contract for Base and /katalog.
 * The records below are DEMONSTRATION DATA, not verified events.
 * Keep unknown values null; do not infer registration status from a future deadline.
 */
export type Competition = {
  id: number;
  title: string;
  organizer: string;
  category: string;
  level: "Lokal" | "Regional" | "Nasional" | "Internasional";
  format: string;
  fee: number;
  deadline: string;
  /** Do not assume a future deadline is necessarily a registration deadline. */
  deadlineType: "pendaftaran" | "pengumpulan" | "lainnya" | "belum-dikonfirmasi";
  registrationStartDate: string | null;
  eventStartDate: string | null;
  eventEndDate: string | null;
  eligibility: string;
  summary: string;
  posterUrl: string | null;
  isVerified: boolean;
  sourceUrl: string | null;
  /** Only supply this when the actual internal competition detail route exists. */
  detailPath: string | null;
  timeline: { label: string; date: string }[];
};

export const competitions: Competition[] = [
  {
    id: 1,
    title: "Hackathon Nasional Gemastik 2026",
    organizer: "Puspresnas / BPTI",
    category: "Teknologi",
    level: "Nasional",
    format: "Tim",
    fee: 0,
    deadline: "2026-11-12",
    deadlineType: "belum-dikonfirmasi",
    registrationStartDate: null,
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi pengembangan solusi teknologi untuk mahasiswa. Periksa panduan resmi untuk mengetahui bidang dan persyaratan pendaftaran.",
    posterUrl: null,
    sourceUrl: null,
    detailPath: null,
    timeline: [],
    isVerified: false,
  },
  {
    id: 2,
    title: "National Business Plan Competition",
    organizer: "Universitas Indonesia",
    category: "Bisnis",
    level: "Nasional",
    format: "Tim",
    fee: 0,
    deadline: "2026-11-15",
    deadlineType: "belum-dikonfirmasi",
    registrationStartDate: null,
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi penyusunan rencana bisnis untuk mengembangkan ide dan model usaha.",
    posterUrl: null,
    sourceUrl: null,
    detailPath: null,
    timeline: [],
    isVerified: false,
  },
  {
    id: 3,
    title: "UI/UX Design Challenge Nusantara",
    organizer: "Tech Startup JKT",
    category: "Desain",
    level: "Nasional",
    format: "Individu / Tim",
    fee: 50000,
    deadline: "2026-11-18",
    deadlineType: "belum-dikonfirmasi",
    registrationStartDate: null,
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa dan umum",
    summary:
      "Kompetisi desain antarmuka dan pengalaman pengguna dalam pengembangan produk digital.",
    posterUrl: null,
    sourceUrl: null,
    detailPath: null,
    timeline: [],
    isVerified: false,
  },
  {
    id: 4,
    title: "Lomba Esai Mahasiswa Nasional",
    organizer: "Kementerian Pendidikan",
    category: "Karya Tulis",
    level: "Nasional",
    format: "Individu",
    fee: 0,
    deadline: "2026-11-20",
    deadlineType: "belum-dikonfirmasi",
    registrationStartDate: null,
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi penulisan esai dengan tema dan ketentuan sesuai panduan penyelenggara.",
    posterUrl: null,
    sourceUrl: null,
    detailPath: null,
    timeline: [],
    isVerified: false,
  },
  {
    id: 5,
    title: "Olimpiade Sains dan Teknologi Terapan",
    organizer: "Institut Teknologi Bandung",
    category: "Sains",
    level: "Nasional",
    format: "Individu",
    fee: 75000,
    deadline: "2026-11-25",
    deadlineType: "belum-dikonfirmasi",
    registrationStartDate: null,
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi bidang sains dan penerapan teknologi bagi mahasiswa perguruan tinggi.",
    posterUrl: null,
    sourceUrl: null,
    detailPath: null,
    timeline: [],
    isVerified: false,
  },
  {
    id: 6,
    title: "Debat Bahasa Inggris Mahasiswa",
    organizer: "UGM English Club",
    category: "Bahasa",
    level: "Nasional",
    format: "Tim",
    fee: 100000,
    deadline: "2026-12-01",
    deadlineType: "belum-dikonfirmasi",
    registrationStartDate: null,
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa aktif",
    summary:
      "Kompetisi debat bahasa Inggris untuk menguji kemampuan argumentasi dan komunikasi peserta.",
    posterUrl: null,
    sourceUrl: null,
    detailPath: null,
    timeline: [],
    isVerified: false,
  },
  {
    id: 7,
    title: "Kompetisi Inovasi Mahasiswa Kalimantan",
    organizer: "Forum Inovasi Daerah",
    category: "Teknologi",
    level: "Regional",
    format: "Tim",
    fee: 25000,
    deadline: "2026-12-08",
    deadlineType: "belum-dikonfirmasi",
    registrationStartDate: null,
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa wilayah Kalimantan",
    summary:
      "Kompetisi regional untuk solusi inovasi yang menjawab kebutuhan masyarakat dan lingkungan.",
    posterUrl: null,
    sourceUrl: null,
    detailPath: null,
    timeline: [],
    isVerified: false,
  },
  {
    id: 8,
    title: "Lomba Karya Tulis Ilmiah Tingkat Kota",
    organizer: "Dinas Pendidikan Kota",
    category: "Karya Tulis",
    level: "Lokal",
    format: "Individu / Tim",
    fee: 0,
    deadline: "2026-10-28",
    deadlineType: "belum-dikonfirmasi",
    registrationStartDate: null,
    eventStartDate: null,
    eventEndDate: null,
    eligibility: "Mahasiswa perguruan tinggi setempat",
    summary:
      "Ajang karya tulis ilmiah untuk mahasiswa dengan topik pembangunan dan potensi daerah.",
    posterUrl: null,
    sourceUrl: null,
    detailPath: null,
    timeline: [],
    isVerified: false,
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]} ${year}`;
}

export function formatRegistrationPeriod(start: string | null, end: string): string {
  if (!start) return `Batas ${formatDate(end)}`;
  if (start === end) return formatDate(end);
  const [startYear, startMonth] = start.split("-");
  const [endYear, endMonth] = end.split("-");
  const startLabel = startYear !== endYear
    ? formatDate(start)
    : startMonth === endMonth
      ? start.slice(8)
      : formatDate(start).replace(/ \d{4}$/, "");
  return `${startLabel}–${formatDate(end)}`;
}

export function deadlineFieldLabel(competition: Competition): string {
  if (competition.deadlineType === "pendaftaran") return "Pendaftaran";
  if (competition.deadlineType === "pengumpulan") return "Pengumpulan";
  return "Tenggat";
}

export function formatPrimaryDeadline(competition: Competition): string {
  if (competition.deadlineType === "pendaftaran") {
    return formatRegistrationPeriod(competition.registrationStartDate, competition.deadline);
  }
  return `Batas ${formatDate(competition.deadline)}`;
}

export function formatCurrency(amount: number): string {
  return amount === 0 ? "Gratis" : `Rp${new Intl.NumberFormat("id-ID", {maximumFractionDigits: 0}).format(amount)}`;
}

/** Local civil dates, using UTC ONLY for arithmetic; no date parsing ambiguity. */
export function daysToDeadline(deadline: string, today: string | null): number | null {
  if (!today) return null;
  const [y, m, d] = deadline.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86400000);
}

/** Only show actionable timing. Never claim registration is open from the date alone. */
export function deadlineSignal(deadline: string, today: string | null): string | null {
  const left = daysToDeadline(deadline, today);
  if (left === null || left > 7) return null;
  if (left < 0) return "Tenggat lewat";
  if (left === 0) return "Batas hari ini";
  return `${left} hari lagi`;
}

export function formatEventRange(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  if (start && end) {
    if (start === end) return formatDate(start);
    const from = start.slice(0,4) === end.slice(0,4) ? formatDate(start).replace(/ \d{4}$/, "") : formatDate(start);
    return `${from}–${formatDate(end)}`;
  }
  return start ? `Mulai ${formatDate(start)}` : `Sampai ${formatDate(end!)}`;
}
