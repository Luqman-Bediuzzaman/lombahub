import { redirect } from "next/navigation";
import { isOwner, ownerConfigured, signIn } from "@/lib/editorial/owner";
import "../redaksi.css";
export const dynamic="force-dynamic";
export const metadata={title:"Masuk redaksi — Jejakarsa",robots:{index:false,follow:false}};
export default async function Login({searchParams}:{searchParams:Promise<{gagal?:string}>}) {
  if (await isOwner()) redirect("/admin/review");
  async function enter(data:FormData) {
    "use server";
    if (await signIn(String(data.get("key")??""))) redirect("/admin/review");
    redirect("/admin/masuk?gagal=1");
  }
  return <section className="redaksi red-login panel"><h1>Masuk redaksi</h1>
    {ownerConfigured()?<form action={enter}><label>Kunci pemilik<input name="key" type="password" autoComplete="current-password" required/></label>
    {(await searchParams).gagal && <p role="alert">Kunci belum cocok. Coba lagi.</p>}<button className="button button-primary">Masuk</button></form>:
    <p>Akses redaksi belum diaktifkan. Ikuti panduan pemasangan yang disertakan bersama editor.</p>}</section>;
}
