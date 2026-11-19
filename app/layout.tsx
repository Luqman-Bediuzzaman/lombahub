import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { AppFrame } from "@/components/app-frame";
import { publicCatalog } from "@/lib/editorial/opportunity-store";


export const metadata: Metadata = {
  title: "Jejakarsa — Informasi Lomba Mahasiswa",
  description: "Cari lomba, periksa persyaratan, bandingkan pilihan, dan siapkan pendaftaran.",
};

import {connection} from "next/server";
export default async function RootLayout({ children }: { children: ReactNode }) {
  // Availability failure must be labeled; do not silently pretend fallback data is published.
  let catalog: Awaited<ReturnType<typeof publicCatalog>> = {items:[],mode:"live"};
  if(process.env.JEJAKARSA_KATALOG_LIVE==="1") await connection();
  let unavailable=false;
  try { catalog=await publicCatalog(); } catch (err) { console.error("Cari Lomba editorial unavailable:",err);unavailable=true; }
  return <html lang="id"><body><AppProvider competitions={catalog.items} catalogMode={unavailable?"unavailable":catalog.mode}><AppFrame>{children}</AppFrame></AppProvider></body></html>;
}
