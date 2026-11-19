/**
 * Batas otomatis Jejakarsa menggunakan hari kalender WIB (UTC+07:00), bukan
 * zona waktu server ataupun jam yang disebut penyelenggara.
 *
 * Deadline 2026-11-20 masih dapat dilihat sepanjang 20 November WIB,
 * dan mulai disembunyikan pada 2026-11-21 00:00:00 WIB.
 */
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const WIB_OFFSET_MS=7*60*60*1000;

export function calendarDayWib(now:Date=new Date()):string {
  if(!Number.isFinite(now.getTime())) throw new Error("Waktu sistem tidak valid.");
  return new Date(now.getTime()+WIB_OFFSET_MS).toISOString().slice(0,10);
}

export function isPastDeadlineWib(deadline:string|null|undefined,now:Date=new Date()):boolean {
  // Tanggal kosong/tidak valid tidak boleh secara tidak sengaja dianggap kadaluarsa.
  if(!deadline || !DAY.test(deadline)) return false;
  const parsed=new Date(`${deadline}T12:00:00Z`);
  if(!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10)!==deadline) return false;
  return deadline<calendarDayWib(now);
}

export function expiryInstantWib(deadline:string):Date {
  // Tengah malam setelah hari deadline dalam WIB = 17.00 UTC pada tanggal deadline.
  if(!DAY.test(deadline) || !Number.isFinite(Date.parse(`${deadline}T12:00:00Z`)) ||
    new Date(`${deadline}T12:00:00Z`).toISOString().slice(0,10)!==deadline) {
    throw new Error("Tanggal tenggat tidak valid.");
  }
  return new Date(`${deadline}T17:00:00Z`);
}
