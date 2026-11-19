import { useMemo, useRef, useState } from "react";
import type { Block } from "@/lib/editorial/model";
import { parseManuscript } from "@/lib/editorial/manuscript";
import { StoryBody } from "./story-body";
import article from "../stories/article-body.module.css";
import styles from "./manuscript-import.module.css";

const masterPrompt = `Olah transkrip di bawah menjadi isi artikel Kisah Juara untuk Jejakarsa. Tulis dalam bahasa Indonesia yang alami. Pilih kejadian konkret yang menjelaskan pengalaman peserta. Jaga sudut pandang dan urutan kejadian sesuai wawancara.

Gunakan hanya informasi dalam transkrip. Kutipan langsung harus sama dengan ucapan narasumber. Jika ucapan perlu dirapikan, gunakan parafrasa di dalam paragraf. Jika fakta belum jelas, lewatkan. Jangan menambahkan nama, kontak, kredit, judul utama, atau profil pencapaian sebagai kolom. Bagian tersebut diisi redaksi secara terpisah.

Kembalikan hanya isi artikel dalam Markdown, dimulai dengan paragraf pembuka. Pisahkan paragraf dengan baris kosong. Gunakan format berikut hanya ketika membantu pembaca.
- ## untuk subjudul, ### untuk subjudul kecil.
- **tebal** atau *miring* untuk penekanan seperlunya.
- > untuk kutipan langsung.
- > [!NOTE] diikuti satu baris baru berawalan > untuk sorotan redaksi.
- Tanda - atau angka 1. untuk daftar satu tingkat, satu butir per baris.
- --- pada baris tersendiri untuk memisahkan dua bagian.
- Saat membandingkan informasi sejenis, boleh gunakan tabel Markdown dengan kepala kolom dan baris | --- | --- |. Utamakan dua atau tiga kolom agar mudah dibaca di HP.

Biarkan kisah yang singkat tetap singkat. Hindari pengantar tentang proses penulisan, blok kode, HTML, tautan, dan diagram.

Transkrip wawancara:
[tempel transkrip di sini]`;

const example = `## Saat latihan berubah arah

Tim mulai mencatat **pertanyaan yang sulit dijawab** setiap selesai latihan.

| Sebelum latihan | Setelah latihan |
| --- | --- |
| Membaca ulang slide | Menjelaskan alasan di balik satu keputusan |

---

> [!NOTE]
> Catatan singkat ini menjadi pengingat pada latihan berikutnya.`;

type Props = {
  hasBody: boolean;
  onApply: (blocks: Block[], append: boolean) => void;
};

export function ManuscriptImport({hasBody, onApply}: Props) {
  const panel = useRef<HTMLDetailsElement>(null);
  const promptField = useRef<HTMLTextAreaElement>(null);
  const [source, setSource] = useState("");
  const [feedback, setFeedback] = useState("");
  const [applied, setApplied] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const parsed = useMemo(() => {
    try { return {blocks: parseManuscript(source), error: ""}; }
    catch (err) { return {blocks: [], error: err instanceof Error ? err.message : "Periksa format naskah."}; }
  }, [source]);

  function apply(append: boolean) {
    if (!parsed.blocks.length) return;
    if (!append && hasBody && !window.confirm("Ganti seluruh isi wawancara, termasuk foto di dalam naskah? Judul, sampul, profil, dan kredit tetap tersimpan di formulir.")) return;
    try {
      onApply(parsed.blocks, append);
      setSource(""); setFeedback(""); setApplied("Naskah sudah masuk ke editor. Anda bisa menyuntingnya di bawah, lalu menyimpan draf.");
      if (panel.current) {
        panel.current.open = false;
        panel.current.querySelector("summary")?.focus();
      }
    } catch (err) { setFeedback(err instanceof Error ? err.message : "Naskah belum bisa diterapkan."); }
  }
  async function copyPrompt() {
    try { await navigator.clipboard.writeText(masterPrompt); setCopyStatus("Prompt tersalin."); }
    catch { promptField.current?.select(); setCopyStatus("Teks sudah dipilih. Gunakan perintah Salin di perangkat Anda."); }
  }
  return <div>
    <details className={styles.panel} ref={panel} onToggle={e => { if (e.currentTarget.open) setApplied(""); }}>
      <summary className={styles.toggle}>Impor naskah</summary>
      <div className={styles.inside}>
        <div className={styles.intro}>Tempel hasil wawancara dalam Markdown. Periksa tampilannya sebelum memasukkannya ke editor.</div>
        <details className={styles.help}><summary>Prompt untuk AI pribadi</summary>
          <textarea aria-label="Prompt untuk AI pribadi" readOnly value={masterPrompt} ref={promptField} rows={6}/>
          <div className={styles.actions}><button type="button" onClick={copyPrompt}>Salin prompt</button><small role="status">{copyStatus}</small></div>
        </details>
        <div className={styles.workspace}>
          <div className={styles.column}>
            <div className={styles.labelRow}><label htmlFor="jk-manuscript">Naskah Markdown</label>
              {!source && <button className={styles.example} type="button" onClick={() => setSource(example)}>Coba contoh</button>}</div>
            <textarea id="jk-manuscript" value={source} placeholder="Tempel teks dari AI atau tulis di sini…" rows={8}
              onChange={e => {setSource(e.target.value); setFeedback("");}} spellCheck={false}/>
          </div>
          <section className={styles.column} aria-label="Pratinjau naskah">
            <strong className={styles.labelRow}>Pratinjau naskah</strong>
            <div className={styles.paper} tabIndex={0}>
              {parsed.error ? <p className={styles.error} role="status">{parsed.error}</p> :
                parsed.blocks.length ? <div className={article.body}><StoryBody body={parsed.blocks}/></div> :
                <p className={styles.empty}>Hasil format akan terlihat di sini saat Anda menulis.</p>}
            </div>
          </section>
        </div>
        <div className={styles.actions}>
          <button type="button" className="button button-primary" disabled={!parsed.blocks.length} onClick={() => apply(hasBody)}>{hasBody ? "Tambahkan ke akhir naskah" : "Masukkan ke editor"}</button>
          {hasBody && <button type="button" disabled={!parsed.blocks.length} onClick={() => apply(false)}>Ganti isi wawancara…</button>}
        </div>
        {feedback && <p role="alert" className={styles.error}>{feedback}</p>}
      </div>
    </details>
    <div role="status">{applied && <p className={styles.result}>{applied}</p>}</div>
  </div>;
}
