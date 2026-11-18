import Link from "next/link";
import { Icon } from "@/components/icons";

export default function Desk() {
  return <><h1>Ruang redaksi</h1><div className="red-rooms">
    <Link href="/admin/review/kisah-juara"><Icon name="book"/><h2>Kisah Juara</h2><p>Tulis wawancara, periksa draf, dan terbitkan kisah.</p><b>Buka editor <Icon name="arrow" size={16}/></b></Link>
    <Link href="/admin/review/cari-lomba"><Icon name="compass"/><h2>Cari Lomba</h2><p>Periksa sumber dan persyaratan pada data lomba contoh.</p><b>Buka kurasi <Icon name="arrow" size={16}/></b></Link>
  </div></>;
}
