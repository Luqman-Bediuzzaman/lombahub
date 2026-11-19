import type { Block, Span } from "./model";
import { validateBody } from "./validate";

export const manuscriptLimit = 60000;

// Pair emphasis markers before formatting. Unmatched markers remain legible as text.
function inline(text: string): Span[] {
  const tokens = text.split(/(\\[\\*_|]|[*]{1,3}|_{1,3})/);
  const stack: number[] = [];
  const paired = new Set<number>();
  for (let i = 1; i < tokens.length; i += 2) {
    const marker = tokens[i];
    if (marker.startsWith("\\")) continue;
    const before = tokens[i - 1].at(-1) || "";
    const after = tokens[i + 1]?.[0] || "";
    if (marker.startsWith("_") && /\w/.test(before) && /\w/.test(after)) continue;
    const open = stack.at(-1);
    if (open !== undefined && tokens[open] === marker && before.trim()) {
      paired.add(open);
      paired.add(i);
      stack.pop();
    } else if (after.trim()) {
      stack.push(i);
    }
  }

  let bold = false;
  let italic = false;
  const spans: Span[] = [];
  tokens.forEach((token, i) => {
    if (paired.has(i)) {
      if (token.length >= 2) bold = !bold;
      if (token.length !== 2) italic = !italic;
      return;
    }
    const value = i % 2 && token.startsWith("\\") ? token.slice(1) : token;
    if (!value) return;
    const last = spans.at(-1);
    if (last && !!last.bold === bold && !!last.italic === italic) last.text += value;
    else spans.push({ text: value, ...(bold && {bold}), ...(italic && {italic}) });
  });
  return spans;
}

function cells(line: string) {
  const parts = line.match(/(?:\\.|[^|\\]|\\$)+|[|]/g) ?? [];
  if (parts[0] === "|") parts.shift();
  if (parts.at(-1) === "|") parts.pop();
  const result = [""];
  for (const part of parts) {
    if (part === "|") result.push("");
    else result[result.length - 1] += part;
  }
  return result.map(cell => cell.trim());
}

const heading = /^(#{1,6})\s+(.+)$/;
const bullet = /^([-+*]|\d+[.)])\s+(.+)$/;
const divider = /^(?:-{3,}|\*{3,}|_{3,})$/;
const quote = /^>\s?/;
const fence = /^(?:```|~~~)/;
const ordered = /^\d/;

export function parseManuscript(input: string): Block[] {
  if (input.length > manuscriptLimit) throw new Error("Bagi naskah menjadi beberapa bagian, maksimal 60.000 karakter per impor.");
  let source = input.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  // Conversational AI often wraps its entire answer in one Markdown fence.
  source = source.replace(/^```(?:markdown|md|text)?[ \t]*\n([\s\S]*?)\n```$/i, "$1");
  const lines = source.split("\n").map(line => line.trim());
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  function flush() {
    if (paragraph.length) blocks.push({kind: "p", spans: inline(paragraph.join(" "))});
    paragraph = [];
  }
  function problem(index: number, detail: string): never {
    throw new Error("Baris " + (index + 1) + ". " + detail);
  }
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line) { flush(); i++; continue; }
    if (fence.test(line)) problem(i, "Tempel isi cerita dalam Markdown. Blok kode dan diagram belum didukung.");
    if (line.includes("|") && lines[i + 1]?.includes("|") && cells(lines[i + 1]).every(cell => /^:?-{3,}:?$/.test(cell))) {
      flush();
      const header = cells(line);
      if (header.length > 6 || header.some(cell => !cell) || cells(lines[i + 1]).length !== header.length) {
        problem(i, "Isi setiap kepala kolom dan gunakan jumlah sel yang sama pada garis pemisah. Maksimal enam kolom.");
      }
      const start = i;
      const rows = [header.map(inline)];
      i += 2;
      while (i < lines.length && lines[i].includes("|")) {
        const row = cells(lines[i]);
        if (row.length !== header.length) problem(i, "Jumlah sel berbeda dari kepala tabel. Tulis \\| jika tanda garis tegak merupakan bagian dari teks.");
        rows.push(row.map(inline));
        if (rows.length > 80) problem(i, "Pisahkan tabel yang melebihi 79 baris isi.");
        i++;
      }
      if (rows.length < 2) problem(start, "Tambahkan setidaknya satu baris isi di bawah kepala tabel.");
      blocks.push({kind: "table", rows});
      continue;
    }
    if (line.startsWith("|") && line.endsWith("|")) problem(i, "Periksa tabel. Letakkan satu baris seperti | --- | --- | tepat di bawah kepala kolom.");
    const title = heading.exec(line);
    if (title) {
      flush();
      if (title[1].length > 3 || title[1].length < 2) problem(i, "Gunakan ## untuk subjudul atau ### untuk subjudul kecil. Judul cerita diisi di kolom tersendiri.");
      blocks.push({kind: title[1].length === 2 ? "h2" : "h3", spans: inline(title[2])});
      i++; continue;
    }
    if (divider.test(line)) { flush(); blocks.push({kind: "divider"}); i++; continue; }
    if (quote.test(line)) {
      flush();
      const start = i;
      const parts: string[] = [];
      while (i < lines.length && quote.test(lines[i])) parts.push(lines[i++].replace(quote, ""));
      const note = /^\[!NOTE\](?:\s|$)/i.test(parts[0]);
      if (note) parts[0] = parts[0].replace(/^\[!NOTE\]\s*/i, "");
      const text = parts.join("\n").trim();
      if (!text) problem(start, "Isi teks kutipan atau sorotan.");
      blocks.push({kind: note ? "highlight" : "quote", spans: inline(text)});
      continue;
    }
    const first = bullet.exec(line);
    if (first) {
      flush();
      const isOrdered = ordered.test(first[1]);
      const items: Span[][] = [];
      while (i < lines.length) {
        const item = bullet.exec(lines[i]);
        if (!item || ordered.test(item[1]) !== isOrdered) break;
        items.push(inline(item[2])); i++;
      }
      blocks.push({kind: isOrdered ? "ol" : "ul", items});
      continue;
    }
    paragraph.push(line); i++;
  }
  flush();
  return validateBody(blocks);
}
