import Link from "next/link";
import { requireOwner } from "@/lib/editorial/owner";
import { summaries } from "@/lib/editorial/store";
import { startStory } from "../actions";
import styles from "./daftar.module.css";

const path = "/admin/review/kisah-juara";
const labels = { semua: "Semua", draf: "Draf", terbit: "Terbit", ditarik: "Ditarik" };
type Status = keyof typeof labels;
const statuses = Object.keys(labels) as Status[];
const pageSize = 15;
const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Makassar" });

function normalize(text: string) {
  return text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

function deskUrl(q: string, status: Status, page = 1) {
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (status !== "semua") query.set("status", status);
  if (page > 1) query.set("hal", String(page));
  return query.size ? path + "?" + query : path;
}

type Params = Record<string, string | string[] | undefined>;

export default async function StoryDesk({ searchParams }: { searchParams: Promise<Params> }) {
  await requireOwner();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const status = statuses.find(key => key === params.status) ?? "semua";
  let rows: Awaited<ReturnType<typeof summaries>>;
  try {
    rows = await summaries();
  } catch {
    return <><Link href="/admin/review">← Ruang redaksi</Link><h1>Kisah Juara</h1>
      <p role="alert">Daftar kisah belum bisa dimuat. Periksa koneksi penyimpanan lalu muat ulang halaman.</p></>;
  }
  const words = normalize(q).split(/\s+/).filter(Boolean);
  const all = rows.map(row => ({
    ...row,
    state: row.slug ? "terbit" as const : row.first_slug ? "ditarik" as const : "draf" as const,
  }));
  const matches = all.filter(row => {
    const text = normalize([row.title || "Kisah tanpa judul", row.participants, row.competition, row.campus, row.category].join(" "));
    return words.every(word => text.includes(word));
  });
  const counts = { semua: matches.length, draf: 0, terbit: 0, ditarik: 0 };
  for (const row of matches) counts[row.state]++;
  const filtered = status === "semua" ? matches : matches.filter(row => row.state === status);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const requestedPage = typeof params.hal === "string" ? Number(params.hal) : 1;
  const page = Number.isSafeInteger(requestedPage) ? Math.max(1, Math.min(pages, requestedPage)) : 1;
  const start = (page - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  return <section className={styles.desk}>
    <Link href="/admin/review" className={styles.back}>← Ruang redaksi</Link>
    <header className={styles.heading}><h1>Kisah Juara</h1>
      <form action={startStory}><button className="button button-primary">Buat kisah</button></form>
    </header>
    {all.length === 0 ? <div className={styles.empty}><h2>Belum ada kisah</h2><p>Pilih “Buat kisah” untuk mulai menulis hasil wawancara pertama.</p></div> :
      <section className={styles.panel} aria-label="Daftar naskah">
        <form key={q} action={path} className={styles.search} role="search" aria-label="Cari kisah redaksi">
          <label htmlFor="story-query">Cari naskah</label>
          <div><input id="story-query" type="search" name="q" defaultValue={q} placeholder="Judul, peserta, tim, atau kompetisi" />
            {status !== "semua" && <input type="hidden" name="status" value={status}/>}
            <button type="submit">Cari</button></div>
        </form>
        <nav className={styles.filters} aria-label="Status naskah">{statuses.map(key =>
          <Link key={key} href={deskUrl(q, key)} scroll={false} aria-current={key === status ? "page" : undefined}>
            {labels[key]} <span>{counts[key]}</span>
          </Link>)}</nav>
        {visible.length > 0 ? <ul className={styles.list}>{visible.map(row =>
          <li key={row.id}>
            <div className={styles.info}>
              <span className={styles.badge} data-state={row.state}>{labels[row.state]}</span>
              <h2><Link href={path + "/" + row.id}>{row.title || "Kisah tanpa judul"}</Link></h2>
              {(row.participants || row.competition) && <p>{[row.participants, row.competition].filter(Boolean).join(" · ")}</p>}
              <small>Disunting <time dateTime={row.updated}>{dateFormat.format(new Date(row.updated))}</time></small>
            </div>
            <div className={styles.actions}><Link href={path + "/" + row.id} aria-label={"Sunting " + (row.title || "kisah tanpa judul")}>Sunting</Link>
              {row.slug && <Link href={"/kisah-juara/" + encodeURIComponent(row.slug)}>Lihat terbitan ↗</Link>}
            </div>
          </li>)}</ul> :
          <div className={styles.noResults}><h2>{q ? "Kisah tidak ditemukan" : "Belum ada kisah dengan status ini"}</h2>
            <p>{q ? "Coba kata lain atau tampilkan semua naskah." : "Naskah akan muncul di sini ketika statusnya berubah."}</p>
          </div>}
        <footer className={styles.footer}>
          <span>{filtered.length ? `${start + 1}–${start + visible.length} dari ${filtered.length} naskah` : "0 naskah"}</span>
          {(q || status !== "semua") && <Link href={path} scroll={false}>Tampilkan semua</Link>}
          {pages > 1 && <nav aria-label="Halaman daftar kisah">
            {page > 1 && <Link href={deskUrl(q, status, page - 1)} scroll={false}>← Sebelumnya</Link>}
            {page < pages && <Link href={deskUrl(q, status, page + 1)} scroll={false}>Berikutnya →</Link>}
          </nav>}
        </footer>
      </section>}
  </section>;
}
