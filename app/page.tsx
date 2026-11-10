"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Logika presisi untuk mengganti tema
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    // transition-colors duration-500 ease-in-out memberikan efek perubahan warna yang sangat halus
    <div className="min-h-screen bg-slate-50 font-sans transition-colors duration-500 ease-in-out dark:bg-slate-900">
      
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors duration-500 ease-in-out dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600 transition-colors duration-500 dark:text-blue-400">
              Jejakarsa<span className="text-orange-500">.</span>
            </Link>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link href="#" className="text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
              Katalog Lomba
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
              Kisah Juara
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Tombol Matahari & Bulan */}
            <button
              onClick={toggleTheme}
              className="group rounded-full p-2 text-slate-500 transition-all duration-300 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                // IKON BULAN (Mode Gelap)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 transition-transform group-hover:-rotate-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              ) : (
                // IKON MATAHARI (Mode Terang)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 transition-transform group-hover:rotate-90">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 21v-2.25m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              )}
            </button>

            <Link href="#" className="hidden rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 sm:block">
              Daftarkan Lomba
            </Link>
          </div>
          
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main>
        <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 transition-colors duration-500 ease-in-out dark:text-white sm:text-5xl md:text-6xl">
            Temukan Kompetisi yang Sesuai <span className="text-blue-600 transition-colors duration-500 dark:text-blue-400">Targetmu.</span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg text-slate-600 transition-colors duration-500 ease-in-out dark:text-slate-400 sm:text-xl">
            Filter ribuan peluang, baca strategi juara, dan siapkan karyamu tanpa perlu pusing mencari informasi yang berserakan.
          </p>

          {/* 3. KOMPONEN SEARCH BAR */}
          <div className="mt-10 w-full max-w-2xl">
            <form className="flex w-full items-center rounded-full border border-slate-300 bg-white p-2 shadow-sm transition-all duration-500 ease-in-out focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20">
              
              <div className="flex w-full items-center px-4">
                <svg className="h-5 w-5 text-slate-400 transition-colors duration-500 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="ml-3 w-full border-none bg-transparent p-2 text-sm text-slate-900 placeholder-slate-400 transition-colors duration-500 focus:outline-none focus:ring-0 dark:text-white dark:placeholder-slate-500"
                  placeholder="Cari nama lomba, bidang, atau penyelenggara..."
                />
              </div>
              
              <button
                type="submit"
                className="shrink-0 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Cari Lomba
              </button>

            </form>
          </div>

        </section>
      </main>

    </div>
  );
}