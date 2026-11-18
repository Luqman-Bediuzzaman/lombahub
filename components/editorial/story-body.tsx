import type { Block, Span } from "@/lib/editorial/model";

function runs(spans:Span[]) {
  return spans.map((s,i)=>{
    const content=s.italic?<em>{s.text}</em>:s.text;
    return s.bold?<strong key={i}>{content}</strong>:<span key={i}>{content}</span>;
  });
}
export function StoryBody({body}:{body:Block[]}) {
  return <>{body.map((b,i)=>{
    if ("items" in b) {const List=b.kind;return <List key={i}>{b.items.map((item,j)=><li key={j}>{runs(item)}</li>)}</List>;}
    if (b.kind==="photo") return <figure key={i}><img src={b.src} alt={b.caption || "Dokumentasi wawancara"}/><figcaption>{b.caption}</figcaption></figure>;
    const Tag=b.kind==="quote"?"blockquote":b.kind;
    return <Tag key={i}>{runs(b.spans)}</Tag>;
  })}</>;
}
