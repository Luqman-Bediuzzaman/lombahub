import { NextResponse } from "next/server";
import { publicCatalog } from "@/lib/editorial/opportunity-store";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}) {
  try {
    const {slug}=await params;
    const catalog=await publicCatalog();
    const item=catalog.items.find(x=>x.slug===slug);
    if(!item)return NextResponse.json({error:"Lomba tidak ditemukan"},{status:404});
    return NextResponse.json({data:item,demo:catalog.mode==="demo"},{headers:{"Cache-Control":"no-store"}});
  } catch {return NextResponse.json({error:"Data lomba sedang tidak tersedia."},{status:503});}
}
