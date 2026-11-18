import Link from "next/link";
import { Icon } from "@/components/icons";
import { StoryCover } from "./story-cover";
import type { WinnerStory } from "@/lib/stories";
import { getStoryCardTitle } from "@/lib/stories";

export function StoryCard({ story, compact = false, archive = false }: { story: WinnerStory; compact?: boolean; archive?: boolean }) {
  return (
    <Link href={`/kisah-juara/${story.slug}`} className={`kj-card ${compact ? "kj-card-compact" : ""}${archive ? " kj-card-archive" : ""}`}>
      <StoryCover story={story} size={compact ? "mini" : "card"}/>
      <div className="kj-card-content">
        <div className="kj-card-category">{story.category}{!archive && <><span aria-hidden="true">·</span>{story.year}</>}</div>
        <h3>{archive ? getStoryCardTitle(story) : story.title}</h3>
        {!compact && !archive && <p>{story.excerpt}</p>}
        <div className="kj-card-footer"><span>{story.participants}</span>{!archive && <Icon name="arrowUpRight" size={15}/>}</div>
        {story.status === "sample" && <span className="kj-sample-label">{archive ? "Simulasi" : "Ilustrasi · bukan wawancara nyata"}</span>}
      </div>
    </Link>
  );
}
