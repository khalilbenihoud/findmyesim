import Link from "next/link";

const CURRENT_YEAR = 2024;

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-lg lg:text-xl" aria-hidden="true">🌐</span>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              © {CURRENT_YEAR} Find My eSIM
            </p>
          </div>
          <nav className="flex items-center gap-4 sm:gap-6" aria-label="Footer navigation">
            <Link
              href="/about"
              className="text-xs sm:text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="text-xs sm:text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

