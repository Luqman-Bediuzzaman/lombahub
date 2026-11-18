import { Icon } from "@/components/icons";
import type { StoryCredit } from "@/lib/story-credits";
import { isSafeHttpUrl } from "@/lib/stories";
import styles from "./story-credits.module.css";

export function StoryCredits({ credits = [], sample = false }: { credits?: StoryCredit[]; sample?: boolean }) {
  const contributors = credits.filter((credit) => credit.name.trim());
  if (!contributors.length) return null;

  return (
    <section className={styles.credits} aria-labelledby="story-credits-title">
      <h3 id="story-credits-title">Kredit wawancara{sample && " (contoh)"}</h3>
      <dl>
        {contributors.map(({ role, name, profiles }, index) => {
          const links = profiles?.filter(({ platform, url }) => platform.trim() && isSafeHttpUrl(url));
          return (
            <div key={index} className={styles.contributor}>
              <dt>{role}</dt>
              <dd>
                <strong>{name}</strong>
                {!!links?.length && (
                  <span className={styles.links}>
                    {links.map(({ platform, url, handle }) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                        aria-label={`${platform} — ${name}${handle ? ` (${handle})` : ""}`}
                        title={handle || undefined}>
                        {platform}<Icon name="arrowUpRight" size={12} />
                      </a>
                    ))}
                  </span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
