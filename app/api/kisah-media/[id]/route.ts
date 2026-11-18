import { isOwner } from "@/lib/editorial/owner";
import { readMedia } from "@/lib/editorial/store";
export const dynamic="force-dynamic";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}) {
  const data=await readMedia((await params).id,await isOwner());
  const headers={"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"};
  if (!data) return new Response(null,{status:404,headers});
  return new Response(new Uint8Array(Buffer.from(data,"base64")),{headers:{...headers,"Content-Type":"image/jpeg"}});
}
