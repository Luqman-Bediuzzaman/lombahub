import type { WinnerStory, StoryCategory, StoryAccent } from "../stories";
import type { StoryCredit } from "../story-credits";

export interface Span { text: string; bold?: boolean; italic?: boolean }
export type Block = { kind: "p" | "h2" | "h3" | "quote"; spans: Span[] }
  | { kind: "ol" | "ul"; items: Span[][] }
  | { kind: "highlight"; spans: Span[] }
  | { kind: "divider" }
  | { kind: "table"; rows: Span[][][] }
  | { kind: "photo"; src: string; caption: string };

export interface Draft {
  title: string; cardTitle: string; category: StoryCategory; coverLabel: string;
  accent: StoryAccent; photo: string; caption: string; participants: string;
  participantType: "Tim" | "Individu"; competition: string; achievement: string;
  campus: string; level: string; year: string; body: Block[]; credits: StoryCredit[];
  achievementChecked: boolean; publicationApproved: boolean; featured: boolean;
}
export interface StoryRow {
  id: string; version: number; draft: Draft; live: WinnerStory | null; updated: string;
}
export const categories: StoryCategory[] = ["Bisnis & Kewirausahaan","Riset & Karya Tulis","Inovasi & Teknologi","Desain & Kreatif","Lainnya"];
export const emptyDraft = (): Draft => ({
  title:"", cardTitle:"", category:"Lainnya", coverLabel:"", accent:"moss", photo:"", caption:"",
  participants:"", participantType:"Individu", competition:"", achievement:"", campus:"", level:"",
  year:"", body:[], credits:[], achievementChecked:false, publicationApproved:false, featured:false,
});
export function blockText(b: Block): string {
  if ("spans" in b) return b.spans.map(s=>s.text).join("");
  if ("items" in b) return b.items.map(row=>row.map(s=>s.text).join("")).join(" ");
  if (b.kind === "table") return b.rows.flatMap(row => row.map(cell => cell.map(span => span.text).join(""))).join(" ");
  return b.kind === "photo" ? b.caption : "";
}
export function makeStory(d: Draft, id: string, previous: WinnerStory | null): WinnerStory {
  const text = d.body.map(blockText).join(" ").trim();
  const slugBase = d.title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").slice(0,75).replace(/^-|-$/g,"") || "kisah";
  return {
    slug:previous?.slug ?? slugBase+"-"+id, title:d.title, cardTitle:d.cardTitle,
    category:d.category, coverLabel:d.coverLabel || d.cardTitle || d.title, accent:d.accent,
    photo:d.photo ? {src:d.photo,alt:d.caption || "Dokumentasi "+d.participants} : undefined,
    participants:d.participants, participantType:d.participantType, competition:d.competition,
    achievement:d.achievement, campus:d.campus, level:d.level, year:Number(d.year),
    publishedAt:previous?.publishedAt ?? new Date().toISOString().slice(0,10),
    readMinutes:Math.max(1,Math.ceil(text.split(/\s+/).length/200)), featured:d.featured,
    status:"published", publicationApproved:d.publicationApproved, achievementChecked:d.achievementChecked,
    excerpt:text.slice(0,180), subtitle:"", opening:[], sections:[], lessons:[], hindsight:"",
    editorialBody:d.body, credits:d.credits,
  };
}
export function mediaIds(d: Draft) {
  return [d.photo,...d.body.flatMap(b=>b.kind==="photo"?[b.src]:[])].filter(Boolean).map(src=>src.split("/").pop()!);
}
export function publicationIssue(d: Draft) {
  if (!d.title.trim() || d.title.trim() === "Kisah tanpa judul") return "Beri judul kisah sebelum menerbitkan.";
  if (!d.participants.trim() || !d.competition.trim() || !d.achievement.trim() || !/^\d{4}$/.test(d.year))
    return "Lengkapi nama peserta atau tim, lomba, pencapaian, dan tahun.";
  if (!d.body.some(b=>b.kind!=="photo" && blockText(b).trim())) return "Tambahkan isi wawancara.";
  if (d.credits.some(c=>!c.name.trim() || c.profiles?.some(p=>!/^https?:\/\//i.test(p.url)))) return "Lengkapi nama kredit dan tautan akun, atau hapus baris kosong.";
  if (!d.achievementChecked || !d.publicationApproved) return "Periksa pencapaian dan catat izin publikasi terlebih dahulu.";
  return "";
}
