import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { AppFrame } from "@/components/app-frame";

export const metadata: Metadata = {
  title: "Jejakarsa — Informasi Lomba Mahasiswa",
  description: "Cari lomba, periksa persyaratan, bandingkan pilihan, dan siapkan pendaftaran.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="id"><body><AppProvider><AppFrame>{children}</AppFrame></AppProvider></body></html>;
}
