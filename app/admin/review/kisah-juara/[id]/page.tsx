import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/editorial/owner";
import { readRow } from "@/lib/editorial/store";
import { StoryEditor } from "@/components/editorial/story-editor";
export default async function EditStory({params}:{params:Promise<{id:string}>}) {
  await requireOwner();
  const row=await readRow((await params).id);
  if (!row) notFound();
  return <StoryEditor key={row.id} row={row}/>;
}
