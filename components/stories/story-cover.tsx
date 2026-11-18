import Image from "next/image";
import type { WinnerStory } from "@/lib/stories";

export function StoryCover({ story, size = "card" }: { story: WinnerStory; size?: "card" | "feature" | "detail" | "mini" }) {
  const photo = story.photo?.src;
  return (
    <div className={`kj-cover kj-cover-${size} kj-cover-${story.accent} ${photo ? "kj-cover-photo" : "kj-cover-typographic"}`}>
      {photo ? (
        <Image
          unoptimized={photo.startsWith("/api/kisah-media/")}
          src={photo} alt={story.photo?.alt ?? `Dokumentasi ${story.participants}`}
          fill sizes={size === "detail" ? "(max-width: 900px) 95vw, 980px" : "(max-width: 680px) 85vw, (max-width: 1100px) 45vw, 36vw"}
          style={{ objectFit: size === "detail" ? "contain" : "cover", objectPosition: story.photo?.objectPosition || "center" }}
        />
      ) : (
        <>
          <div className="kj-cover-geometry" aria-hidden="true"><span/><span/></div>
          <div className="kj-cover-top"><span>KISAH JUARA</span><span>J.</span></div>
          <div className="kj-cover-middle"><small>JEJAKARSA / ARSIP CERITA</small><strong>{story.coverLabel}</strong><em>{story.category}</em></div>
          <div className="kj-cover-bottom"><span>CATATAN PENGALAMAN</span><span>{story.year}</span></div>
        </>
      )}
    </div>
  );
}
