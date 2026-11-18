import { requireOwner } from "@/lib/editorial/owner";
import { logout } from "./actions";
import "../redaksi.css";
export const dynamic="force-dynamic";
export const metadata={title:"Ruang redaksi — Jejakarsa",robots:{index:false,follow:false}};
export default async function DeskLayout({children}:{children:React.ReactNode}) {
  await requireOwner();
  return <div className="redaksi"><div className="red-session"><span>Redaksi pribadi</span><form action={logout}><button>Keluar</button></form></div>{children}</div>;
}
