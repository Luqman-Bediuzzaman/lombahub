import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { expireOverdueOpportunities } from "@/lib/editorial/opportunity-store";

export const runtime="nodejs";
export const dynamic="force-dynamic";

/** Dipanggil Vercel Cron; bukan endpoint admin publik. */
export async function GET(request:Request){
  const secret=process.env.CRON_SECRET;
  if(!secret || request.headers.get("authorization")!==`Bearer ${secret}`){
    return NextResponse.json({error:"Tidak diizinkan."},{status:401,headers:{"Cache-Control":"no-store"}});
  }
  try {
    const result=await expireOverdueOpportunities();
    if(result.expired>0) revalidatePath("/","layout");
    return NextResponse.json({ok:true,...result},{headers:{"Cache-Control":"no-store"}});
  } catch(error){
    console.error("Cron tenggat Cari Lomba:",error);
    return NextResponse.json({error:"Penarikan tenggat belum berhasil; sistem publik tetap menyaring tanggal WIB saat dibaca."},
      {status:503,headers:{"Cache-Control":"no-store"}});
  }
}
