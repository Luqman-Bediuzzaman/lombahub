import HomeContent from "@/components/home-content";
import { publicStories } from "@/lib/editorial/store";

export const dynamic="force-dynamic";
export default async function HomePage() {
  try {
    const stories = await publicStories();
    return <HomeContent stories={stories.slice(0, 5)} />;
  } catch {
    return <HomeContent stories={[]} storiesUnavailable />;
  }
}
