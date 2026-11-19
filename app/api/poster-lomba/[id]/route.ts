import {publishedPoster} from "@/lib/editorial/opportunity-store";
export const dynamic="force-dynamic";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  let image;
  try{image=await publishedPoster(id);}catch{return new Response(null,{status:503});}
  if(!image)return new Response(null,{status:404});
  return new Response(Buffer.from(image.split(",")[1],"base64"),{headers:{"Content-Type":"image/jpeg","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
}
