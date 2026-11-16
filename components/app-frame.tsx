"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { useApp } from "@/components/app-provider";

const navigation = [
  { label: "Beranda", href: "/", icon: "home" as const },
  { label: "Cari Lomba", href: "/explore", icon: "compass" as const },
  { label: "Tersimpan", href: "/workspace", icon: "layers" as const, count: true },
  { label: "Bandingkan", href: "/compare", icon: "scale" as const, compare: true },
];
const knowledge = [
  { label: "Panduan", href: "/playbook", icon: "book" as const },
  { label: "Profil", href: "/profile", icon: "user" as const },
];
const curation = [{ label: "Kurasi Data", href: "/admin/review", icon: "settings" as const }];

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { workspace, compareIds } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const active = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/explore${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
    setMobileOpen(false);
  };

  const sidebar = (
    <>
      <div className="brand-lockup">
        <Link href="/" className="brand-mark" aria-label="Beranda Jejakarsa"><span>j.</span></Link>
        <div><div className="brand-name">jejakarsa<span>.</span></div><div className="brand-caption">INFORMASI & KELAYAKAN LOMBA</div></div>
      </div>
      <div className="sidebar-section-label">MENU UTAMA</div>
      <nav className="nav-group" aria-label="Navigasi utama">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`nav-link ${active(item.href) ? "active" : ""}`}>
            <Icon name={item.icon} size={17}/><span>{item.label}</span>
            {item.count && workspace.length > 0 && <span className="nav-count">{workspace.length}</span>}
            {item.compare && compareIds.length > 0 && <span className="nav-count">{compareIds.length}</span>}
          </Link>
        ))}
      </nav>
      <div className="sidebar-section-label second-label">PANDUAN & PROFIL</div>
      <nav className="nav-group" aria-label="Navigasi panduan dan profil">
        {knowledge.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`nav-link ${active(item.href) ? "active" : ""}`}><Icon name={item.icon} size={17}/><span>{item.label}</span></Link>)}
      </nav>
      <div className="sidebar-section-label second-label">PENGELOLAAN DATA</div>
      <nav className="nav-group" aria-label="Navigasi pengelolaan data">
        {curation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`nav-link ${active(item.href) ? "active" : ""}`}><Icon name={item.icon} size={17}/><span>{item.label}</span><span className="nav-caption">DEMO</span></Link>)}
      </nav>
      <div className="sidebar-bottom">
        <Link href="/about" className="sidebar-about" onClick={() => setMobileOpen(false)}>Tentang Jejakarsa <Icon name="arrowUpRight" size={13}/></Link>
        <div className="sidebar-foot"><span className="live-dot"/> MODE DEMO <span>v1.0</span></div>
      </div>
    </>
  );

  return (
    <div className="app-layout">
      <aside className="desktop-sidebar">{sidebar}</aside>
      {mobileOpen && <div className="mobile-scrim" onClick={() => setMobileOpen(false)} />}
      <aside className={`mobile-sidebar ${mobileOpen ? "open" : ""}`}>{sidebar}</aside>
      <div className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Buka atau tutup navigasi"><Icon name={mobileOpen ? "close" : "menu"}/></button>
            <div className="breadcrumb"><span>Jejakarsa</span><span className="breadcrumb-separator">/</span><strong>{getPageLabel(pathname)}</strong></div>
          </div>
          <div className="topbar-actions">
            <form className="global-search" onSubmit={submitSearch}>
              <Icon name="search" size={16}/><input aria-label="Cari lomba" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari lomba..."/><kbd>↵</kbd>
            </form>
            <Link href="/profile" className="profile-shortcut" title="Atur profil"><span className="avatar">A</span><span className="profile-shortcut-label">Profil</span></Link>
          </div>
        </header>
        <main className="main-content">
          <div className="demo-ribbon"><span><Icon name="info" size={13}/> MODE DEMO</span><p>Data lomba yang ditampilkan masih berupa contoh.</p><Link href="/about">Tentang</Link></div>
          {children}
          <footer className="site-footer"><span>© 2026 Jejakarsa · Prototipe</span><span>Informasi lomba dan persiapan peserta.</span><Link href="/about">Tentang prototipe</Link></footer>
        </main>
      </div>
    </div>
  );
}

function getPageLabel(pathname: string) {
  if (pathname === "/") return "Beranda";
  if (pathname.startsWith("/explore")) return "Cari Lomba";
  if (pathname.startsWith("/opportunities")) return "Detail Lomba";
  if (pathname.startsWith("/workspace")) return "Tersimpan";
  if (pathname.startsWith("/compare")) return "Bandingkan";
  if (pathname.startsWith("/playbook")) return "Panduan";
  if (pathname.startsWith("/profile")) return "Profil";
  if (pathname.startsWith("/admin")) return "Kurasi Data";
  if (pathname.startsWith("/about")) return "Tentang";
  return "Tersimpan";
}
