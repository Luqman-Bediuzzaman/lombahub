import {parseManuscript} from "@/lib/editorial/manuscript";
import {StoryBody} from "@/components/editorial/story-body";
export function OpportunityDescription({text}:{text:string}) {
  try {
    const blocks=parseManuscript(text);
    return <div className="detail-long-copy" style={{overflowWrap:"anywhere"}}><StoryBody body={blocks}/></div>;
  } catch {
    return <p className="detail-long-copy" style={{whiteSpace:"pre-line"}}>{text}</p>;
  }
}
