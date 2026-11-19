import type { Block, Span } from "@/lib/editorial/model";

function runs(spans: Span[]) {
  return spans.map((s, i) => {
    const content = s.italic ? <em>{s.text}</em> : s.text;
    return s.bold ? <strong key={i}>{content}</strong> : <span key={i}>{content}</span>;
  });
}

export function StoryBody({ body }: { body: Block[] }) {
  return <>{body.map((b, i) => {
    if (b.kind === "ol") return <ol key={i}>{b.items.map((item, j) => <li key={j}>{runs(item)}</li>)}</ol>;
    if (b.kind === "ul") return <ul key={i}>{b.items.map((item, j) => <li key={j}>{runs(item)}</li>)}</ul>;
    if (b.kind === "photo") return <figure key={i}><img src={b.src} alt={b.caption || "Dokumentasi wawancara"}/><figcaption>{b.caption}</figcaption></figure>;
    if (b.kind === "divider") return <hr key={i}/>;
    if (b.kind === "highlight") return <aside key={i}>{runs(b.spans)}</aside>;
    if (b.kind === "table") return <div key={i} style={{overflowX:"auto"}}><table><tbody>{b.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{runs(cell)}</td>)}</tr>)}</tbody></table></div>;
    if (b.kind === "quote") return <blockquote key={i}>{runs(b.spans)}</blockquote>;
    if (b.kind === "h2") return <h2 key={i}>{runs(b.spans)}</h2>;
    if (b.kind === "h3") return <h3 key={i}>{runs(b.spans)}</h3>;
    if ("spans" in b) return <p key={i}>{runs(b.spans)}</p>;
    return null;
  })}</>;
}
