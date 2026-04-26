"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06060b]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-600">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Дата<span className="text-teal-400">Креатив</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <Link href="/" className="transition-colors hover:text-white">
            Платформа
          </Link>
          <Link href="/#features" className="transition-colors hover:text-white">
            Возможности
          </Link>
          <Link href="/#how" className="transition-colors hover:text-white">
            Как это работает
          </Link>
        </nav>

        <Link
          href="/analyze"
          className="rounded-full bg-teal-500 px-5 py-2 text-sm font-medium text-black transition-all hover:bg-teal-400 hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]"
        >
          Попробовать
        </Link>
      </div>
    </header>
  );
}
