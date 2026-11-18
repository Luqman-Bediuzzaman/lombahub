"use client";
import { useRef } from "react";
import { type Block, type Span } from "@/lib/editorial/model";
import { StoryBody } from "./story-body";

function inline(node:Node,bold=false,italic=false):Span[] {
  if (node.nodeType===Node.TEXT_NODE) return [{text:node.textContent || "",bold,italic}];
  if (!(node instanceof HTMLElement)) return [];
  if (node.tagName==="BR") return [{text:"\n"}];
  return Array.from(node.childNodes).flatMap(n=>inline(n,bold||["STRONG","B"].includes(node.tagName),italic||["EM","I"].includes(node.tagName)));
}
function content(root:HTMLElement):Block[] {
  const blocks:Block[]=[];
  let text:Span[]=[];
  function flush() {if (text.length) blocks.push({kind:"p",spans:text});text=[];}
  function visit(node:Node) {
    if (!(node instanceof HTMLElement)) {text.push(...inline(node));return;}
    const tag=node.tagName.toLowerCase();
    if (tag==="div" && node.querySelector("div,p,h2,h3,ul,ol,figure,blockquote")) {flush();node.childNodes.forEach(visit);flush();return;}
    if (["p","div","h2","h3","blockquote"].includes(tag)) {
      flush();blocks.push({kind:tag==="h2"||tag==="h3"?tag:tag==="blockquote"?"quote":"p",spans:inline(node)});return;
    }
    if (tag==="ul"||tag==="ol") {flush();blocks.push({kind:tag,items:Array.from(node.children).map(n=>inline(n))});return;}
    if (tag==="figure") {flush();const src=node.querySelector("img")?.getAttribute("src");if(src) blocks.push({kind:"photo",src,caption:node.querySelector("figcaption")?.textContent||""});return;}
    text.push(...inline(node));
  }
  root.childNodes.forEach(visit);flush();return blocks;
}
export function RichText({initial,onChange,upload}:{initial:Block[];onChange:(b:Block[])=>void;upload:(f:File)=>Promise<string|undefined>}) {
  const editable=useRef<HTMLDivElement>(null), snapshot=useRef(initial), selection=useRef<Range|null>(null);
  function remember() {
    const s=window.getSelection();
    if (s?.rangeCount && editable.current?.contains(s.anchorNode)) selection.current=s.getRangeAt(0).cloneRange();
  }
  function focus() {
    const el=editable.current;if (!el)return;
    el.focus();const s=window.getSelection();
    if (s && selection.current && el.contains(selection.current.commonAncestorContainer)) {s.removeAllRanges();s.addRange(selection.current);}
  }
  function changed() {if(editable.current)onChange(content(editable.current));remember();}
  function command(cmd:string,arg?:string) {focus();document.execCommand(cmd,false,arg);changed();}
  async function insertPhoto(f:File) {
    const src=await upload(f);if (!src)return;
    focus();
    const figure=document.createElement("figure"),img=document.createElement("img"),caption=document.createElement("figcaption");
    img.src=src;caption.textContent="Keterangan foto";figure.append(img,caption);
    const root=editable.current!;
    let anchor=window.getSelection()?.anchorNode;
    while(anchor?.parentNode && anchor.parentNode!==root) anchor=anchor.parentNode;
    if(anchor?.parentNode===root) root.insertBefore(figure,anchor.nextSibling);else root.append(figure);
    const p=document.createElement("p");p.append(document.createElement("br"));figure.after(p);
    const r=document.createRange();r.selectNodeContents(p);r.collapse(true);
    const sel=window.getSelection();sel?.removeAllRanges();sel?.addRange(r);changed();
  }
  return <div className="red-writing"><div className="red-toolbar" role="group" aria-label="Format tulisan">
    {([["Paragraf","formatBlock","p"],["Subjudul","formatBlock","h2"],["Subjudul kecil","formatBlock","h3"],["Tebal","bold"],["Miring","italic"],["Kutipan","formatBlock","blockquote"],["Poin","insertUnorderedList"],["Nomor","insertOrderedList"]] as const).map(([label,cmd,...args])=>
      <button type="button" key={label} onMouseDown={e=>e.preventDefault()} onClick={()=>command(cmd,args[0])}>{label}</button>)}
    <label className="red-file">Sisipkan foto<input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)void insertPhoto(f);e.target.value="";}}/></label>
    </div><div ref={editable} className="red-prose" aria-label="Isi wawancara" aria-multiline="true" role="textbox"
      contentEditable suppressContentEditableWarning onInput={changed} onBlur={remember} onKeyUp={remember} onMouseUp={remember}
      onDrop={e=>e.preventDefault()} onPaste={e=>{e.preventDefault();remember();command("insertText",e.clipboardData.getData("text/plain"));}}>
      <StoryBody body={snapshot.current}/>
    </div></div>;
}
