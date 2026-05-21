import Link from 'next/link';
import { Coffee } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <Coffee className="size-10" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">
        404 — Page not found
      </h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        This page may have been removed or is no longer available on the menu.
      </p>
      <Link
        href="/menu"
        className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-95 transition-opacity"
      >
        Back to Menu
      </Link>
    </div>
  );
}
