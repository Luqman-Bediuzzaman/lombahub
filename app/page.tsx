"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const quickFilters = [
    { id: 1, icon: "🔥", label: "Tutup Minggu Ini" },
    { id: 2, icon: "💸", label: "Gratis Biaya" },
    { id: 3, icon: "💻", label: "Bidang IT & Tech" },
    { id: 4, icon: "🎨", label: "Desain UI/UX" },
    { id: 5, icon: "🏆", label: "Cerita Juara" },
  ];

  const mockCompetitions = [
    { id: 1, title: "National Business Plan Competition", organizer: "Universitas Indonesia", category: "Bisnis", fee: "Gratis", deadline: "12 Nov 2026", color: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
    { id: 2, title: "UI/UX Design Challenge 2026", organizer: "Tech Startup JKT", category: "Desain", fee: "Rp 50.000", deadline: "15 Nov 2026", color: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
    { id: 3, title: "Lomba Esai Mahasiswa Nasional", organizer: "Kementerian Pendidikan", category: "Karya Tulis", fee: "Gratis", deadline: "20 Nov 2026", color: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
    { id: 4, title: "Hackathon FinTech Nusantara", organizer: "Bank Indonesia", category: "IT & Tech", fee: "Gratis", deadline: "25 Nov 2026", color: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
    { id: 5, title: "Debat Bahasa Inggris Mahasiswa", organizer: "UGM English Club", category: "Bahasa", fee: "Rp 100.000", deadline: "01 Des 2026", color: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400" },
    { id: 6, title: "Olimpiade Sains & Teknologi", organizer: "Institut Teknologi Bandung", category: "Sains", fee: "Rp 75.000", deadline: "10 Des 2026", color: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-600 dark:text-teal-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans transition-colors duration-500 ease-in-out dark:bg-slate-900">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors duration-500 ease-in-out dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600 transition-colors duration-500 dark:text-blue-400">
              Jejakarsa<span className="text-orange-500">.</span>
            </Link>
          </div>
          <div className="hidden items-center space-x-8 md:flex">
            <Link href="#" className="text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">Katalog Lomba</Link>
            <Link href="#" className="text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">Berita Lomba</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="group rounded-full p-2 text-slate-500 transition-all duration-300 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Toggle Dark Mode">
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 transition-transform group-hover:-rotate-12"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 transition-transform group-hover:rotate-90"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 21v-2.25m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
              )}
            </button>
            <Link href="#" className="hidden rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:block">
              Mitra Jejakarsa
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        
        {/* TAHAP 1: LEVEL 1 - QUICK ACTION BAR */}
        <section className="flex flex-col items-center pb-8 pt-12 text-center sm:pt-20">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 transition-colors duration-500 ease-in-out dark:text-white sm:text-5xl md:text-6xl">
            Lacak <span className="text-blue-600 transition-colors duration-500 dark:text-blue-400">Targetmu.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 transition-colors duration-500 ease-in-out dark:text-slate-400">
            Platform intelijen lomba untuk mahasiswa. Temukan, filter, dan siapkan strategimu.
          </p>

          <div className="mt-8 w-full max-w-2xl">
            <form className="flex w-full items-center rounded-full border border-slate-300 bg-white p-1.5 shadow-sm transition-all duration-500 ease-in-out focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20">
              <div className="flex w-full items-center px-4">
                <svg className="h-5 w-5 text-slate-400 transition-colors duration-500 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" className="ml-3 w-full border-none bg-transparent py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors duration-500 focus:outline-none focus:ring-0 dark:text-white dark:placeholder-slate-500" placeholder="Ketik nama lomba, penyelenggara..." />
              </div>
            </form>
          </div>

{/* PERBAIKAN: Menambahkan pl-4 (padding left) dan pr-4 (padding right)
              agar ada "ruang napas" di awal dan akhir saat di-swipe mentok */}
          <div className="mt-8 w-full max-w-4xl overflow-hidden">
            <div className="flex w-full items-center justify-start gap-4 overflow-x-auto px-4 py-4 sm:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* Pseudo-element transparan untuk ruang napas ekstra di kiri */}
              <div className="shrink-0 w-2 sm:hidden"></div>

              {quickFilters.map((filter) => (
                <button key={filter.id} className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:text-blue-600 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400">
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
              
              {/* Pseudo-element transparan untuk ruang napas ekstra di kanan */}
              <div className="shrink-0 w-2 sm:hidden"></div>

            </div>
          </div>
        </section>

        {/* TAHAP 2: LEVEL 2 - SPOTLIGHT BENTO GRID */}
        <section className="mt-4 w-full">
          <div className="mb-4 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 transition-colors duration-500 dark:text-white">Sorotan Hari Ini</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-6">
            <div className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 p-8 text-white shadow-md transition-all duration-300 hover:shadow-xl md:col-span-2 md:row-span-2">
              <div className="absolute inset-0 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10">
                <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">🔥 Tutup 3 Hari Lagi</span>
                <h3 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Hackathon Nasional Gemastik 2026</h3>
                <p className="mb-6 max-w-md text-sm text-blue-100 sm:text-base">Kompetisi pengembangan aplikasi tingkat nasional dengan total hadiah Rp 50.000.000. Pendaftaran terbuka untuk seluruh mahasiswa Indonesia.</p>
                <Link href="#" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-600 transition-transform hover:scale-105">
                  Lihat Detail <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 md:col-span-1 md:row-span-1">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 transition-colors duration-500 dark:text-white">Kabar Jejakarsa</h3>
                <p className="mt-2 text-sm text-slate-600 transition-colors duration-500 dark:text-slate-400">Kuota gelombang pertama <strong>Bussiness Plan UGM</strong> tersisa 15 tim. Segera amankan kursi tim Anda!</p>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 md:col-span-1 md:row-span-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400">💡 Tips Juara</span>
                <blockquote className="mt-3 text-sm italic text-slate-700 transition-colors duration-500 dark:text-slate-300">"Juri lebih suka purwarupa (prototype) yang menyelesaikan masalah lokal di sekitar kita."</blockquote>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div>
                  <p className="text-xs font-bold text-slate-900 transition-colors duration-500 dark:text-white">Budi Santoso</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Juara 1 UI/UX Design</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TAHAP 3: LEVEL 3 - KATALOG LOMBA (CURATED FEED) */}
        <section className="mt-16 w-full">
          <div className="mb-6 flex items-center justify-between px-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 transition-colors duration-500 dark:text-white">
              Peluang dalam 30 Hari Kedepan
            </h2>
            <Link href="#" className="hidden text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 sm:block">
              Lihat Semua Lomba &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockCompetitions.map((lomba) => (
              <div key={lomba.id} className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <div className={`relative flex h-40 w-full items-center justify-center transition-colors duration-500 ${lomba.color}`}>
                  <span className={`text-sm font-bold uppercase tracking-widest opacity-50 ${lomba.text}`}>{lomba.category}</span>
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-white">
                    {lomba.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{lomba.organizer}</div>
                  <h3 className="mb-4 line-clamp-2 text-lg font-bold text-slate-900 transition-colors duration-500 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {lomba.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                    <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                      <svg className="mr-1.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {lomba.deadline}
                    </div>
                    <div className={`rounded-md px-2 py-1 text-xs font-bold ${lomba.fee === 'Gratis' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {lomba.fee}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button className="rounded-full border-2 border-slate-200 bg-transparent px-8 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800">
              Muat Lebih Banyak
            </button>
          </div>

        </section>

      </main>
    </div>
  );
}