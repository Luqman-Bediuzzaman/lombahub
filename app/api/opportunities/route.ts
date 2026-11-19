import { NextRequest, NextResponse } from "next/server";
import { publicCatalog } from "@/lib/editorial/opportunity-store";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest) {
  try {
    const catalog=await publicCatalog();
    const params=request.nextUrl.searchParams;
    const q=(params.get("q")||"").toLowerCase().trim();
    const category=params.get("category"),fee=params.get("fee"),mode=params.get("mode");
    const results=catalog.items.filter(item=>{
      const match=!q||[item.title,item.organizer,item.category,item.discipline,item.summary].join(" ").toLowerCase().includes(q);
      return match && (!category||category==="Semua"||item.category===category) && (!fee||item.feeStatus===fee) && (!mode||item.mode===mode);
    });
    return NextResponse.json({data:results,count:results.length,demo:catalog.mode==="demo",notice:catalog.mode==="demo"?"Data contoh fiktif untuk demonstrasi.":undefined},{headers:{"Cache-Control":"no-store"}});
  } catch {
    return NextResponse.json({error:"Katalog tidak tersedia saat ini."},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
