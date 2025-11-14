import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-12 sm:h-14 lg:h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold text-gray-900 transition-colors hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
          >
            <span className="text-xl sm:text-2xl" aria-hidden="true">🌐</span>
            <span className="whitespace-nowrap">Find My eSIM</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

