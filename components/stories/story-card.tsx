import Link from "next/link";
import { Icon } from "@/components/icons";
import { StoryCover } from "./story-cover";
import type { WinnerStory } from "@/lib/stories";

export function StoryCard({ story, compact = false }: { story: WinnerStory; compact?: boolean }) {
  return (
    <Link href={`/kisah-juara/${story.slug}`} className={`kj-card ${compact ? "kj-card-compact" : ""}`}>
      <StoryCover story={story} size={compact ? "mini" : "card"}/>
      <div className="kj-card-content">
        <div className="kj-card-category">{story.category}<span aria-hidden="true">·</span>{story.year}</div>
        <h3>{story.title}</h3>
        {!compact && <p>{story.excerpt}</p>}
        <div className="kj-card-footer"><span>{story.participants}</span><Icon name="arrowUpRight" size={15}/></div>
        {story.status === "sample" && <span className="kj-sample-label">Ilustrasi · bukan wawancara nyata</span>}
      </div>
    </Link>
  );
}
