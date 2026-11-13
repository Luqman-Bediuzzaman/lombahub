"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { BRAND_DESCRIPTOR, JEJAKARSA_STYLES } from "../design-system";

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]" aria-hidden="true"><path d="M20.2 15.5A8.7 8.7 0 0 1 8.5 3.8 8.7 8.7 0 1 0 20.2 15.5Z" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[18px] w-[18px]" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M4 12h15m-7-7 7 7-7 7"/></svg>;
}

export function ImagePlaceholder({ className = "", label = "Dokumentasi belum tersedia" }: { className?: string; label?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden border border-[#DCD8CC] bg-[#EAE7DC] dark:border-[#30382D] dark:bg-[#20261E] ${className}`} role="img" aria-label={label}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(to right, #A8AE9B33 1px, transparent 1px), linear-gradient(to bottom, #A8AE9B33 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
      <div className="relative flex flex-col items-center gap-3 text-[#858174] dark:text-[#9CA392]">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" className="h-9 w-9" aria-hidden="true"><rect x="5" y="8" width="38" height="32"/><circle cx="17" cy="18" r="4"/><path d="m7 35 13-13 8 8 6-6 8 9"/></svg>
        <span className="px-3 text-center font-mono text-[9px] uppercase tracking-[0.12em]">{label}</span>
      </div>
    </div>
  );
}

export function StoryChrome({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("jejakarsa-theme");
      const desired = saved === "dark" || (saved === null && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
      setDark(desired);
      document.documentElement.classList.toggle("dark", desired);
    } catch { /* Fallback: light mode */ }
    setYear(new Date().getFullYear());
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { window.localStorage.setItem("jejakarsa-theme", next ? "dark" : "light"); } catch { /* theme works in current tab */ }
  };

  return (
    <div className={JEJAKARSA_STYLES.pageShell}>
      <nav className={JEJAKARSA_STYLES.navbar} aria-label="Navigasi utama">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/" aria-label="Jejakarsa Beranda" className="flex shrink-0 flex-col">
            <span className={JEJAKARSA_STYLES.wordmark}>jejakarsa<span className="text-[#65745A]">.</span></span>
            <span className={JEJAKARSA_STYLES.brandDescriptor}>{BRAND_DESCRIPTOR}</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            <Link href="/katalog" className={JEJAKARSA_STYLES.navigationLink}>Katalog</Link>
            <Link href="/arsip-juara" aria-current="page" className={JEJAKARSA_STYLES.navigationLinkActive}>Kisah Juara</Link>
            <Link href="/tentang" className={JEJAKARSA_STYLES.navigationLink}>Tentang</Link>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={toggleTheme} aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"} title={dark ? "Mode gelap" : "Mode terang"} className="flex h-9 w-9 items-center justify-center border border-[#D2CEC2] text-[#65745A] transition-colors hover:border-[#65745A] hover:bg-[#E8E5DA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:border-[#3E4A35] dark:text-[#EAE8E0] dark:hover:bg-[#2A3324] motion-reduce:transition-none"><ThemeIcon dark={dark}/></button>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="stories-mobile-nav" aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"} className="flex h-9 w-9 items-center justify-center border border-[#D2CEC2] text-[#65745A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65745A] dark:border-[#3E4A35] dark:text-[#EAE8E0] md:hidden">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">{menuOpen ? <path d="M6 6l12 12M18 6 6 18"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}</svg>
            </button>
            <Link href="/bagikan-peluang" className={`hidden md:inline-flex ${JEJAKARSA_STYLES.primaryAction}`}>Bagikan Peluang <ArrowIcon className="h-3.5 w-3.5"/></Link>
          </div>
        </div>
        <div id="stories-mobile-nav" aria-hidden={!menuOpen} className={`grid overflow-hidden border-t border-[#DCD8CC] bg-[#F5F3EB] transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none dark:border-[#30382D] dark:bg-[#161816] md:hidden ${menuOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}>
          <div className="min-h-0 overflow-hidden"><div className="flex flex-col gap-1 px-5 py-3 sm:px-8">
            {[["/katalog", "Katalog"], ["/arsip-juara", "Kisah Juara"], ["/tentang", "Tentang"], ["/bagikan-peluang", "Bagikan Peluang"]].map(([href, label]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1} className="flex min-h-11 items-center border-b border-[#DCD8CC] px-3 text-sm font-semibold text-[#55574E] hover:bg-[#EAE7DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#65745A] dark:border-[#30382D] dark:text-[#EAE8E0] dark:hover:bg-[#263022]">{label}</Link>)}
          </div></div>
        </div>
      </nav>
      {children}
      <footer className={`mt-12 ${JEJAKARSA_STYLES.footer}`}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-6 sm:px-8 md:flex-row md:items-center">
          <div><Link href="/" className="font-serif text-xl font-bold tracking-tight">jejakarsa<span className="text-[#65745A]">.</span></Link><p className="mt-1 text-[10px] text-[#858174] dark:text-[#9CA392]">{BRAND_DESCRIPTOR} Indonesia.</p></div>
          <div className="font-mono text-[9px] text-[#858174] dark:text-[#9CA392]">© {year ?? ""} Jejakarsa</div>
        </div>
      </footer>
    </div>
  );
}
