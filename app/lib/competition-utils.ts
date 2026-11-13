import type { Competition } from "../data/competitions";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function formatDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]} ${year}`;
}

export function formatCurrency(amount: number): string {
  return amount === 0 ? "Gratis" : `Rp${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function getLocalDateString(): string {
  const today = new Date();
  return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
}

export function getDaysLeft(deadline: string, today: string | null): number | null {
  if (!today) return null;
  const [y, m, d] = deadline.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86400000);
}

/** Sinyal singkat saja. Deadline di masa depan ≠ pendaftaran dikonfirmasi buka. */
export function getDeadlineSignal(deadline: string, today: string | null): string | null {
  const days = getDaysLeft(deadline, today);
  if (days === null) return null;
  if (days < 0) return "Tenggat terlewati";
  if (days === 0) return "Batas hari ini";
  if (days <= 7) return `${days} hari tersisa`;
  return null;
}

export function isDeadlinePast(deadline: string, today: string | null): boolean {
  const days = getDaysLeft(deadline, today);
  return days !== null && days < 0;
}

export function formatDeadline(item: Competition): string {
  const label = item.deadlineType === "pendaftaran" ? "Daftar" : item.deadlineType === "pengumpulan" ? "Kumpul" : "Batas";
  if (item.deadlineType === "pendaftaran" && item.registrationStartDate) {
    const start = item.registrationStartDate;
    if (start === item.deadline) return `${label} ${formatDate(item.deadline)}`;
    const [sy, sm] = start.split("-");
    const [ey, em] = item.deadline.split("-");
    const short = sy !== ey ? formatDate(start) : sm === em ? start.slice(8) : formatDate(start).replace(/ \d{4}$/, "");
    return `${short}–${formatDate(item.deadline)}`;
  }
  return `${label} ${formatDate(item.deadline)}`;
}

/** Filter tenggat (bukan status pendaftaran dari penyelenggara). */
export type DeadlineFilter = "belum-lewat" | "mendekat" | "terlewati";
export function getDeadlineFilter(deadline: string, today: string | null): DeadlineFilter {
  const days = getDaysLeft(deadline, today);
  if (days === null || days > 7) return "belum-lewat";
  if (days < 0) return "terlewati";
  return "mendekat";
}
