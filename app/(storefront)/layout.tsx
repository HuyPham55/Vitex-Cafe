import Link from 'next/link';
import { Coffee, ShoppingBag, User, Mail, Phone, MapPin } from 'lucide-react';
import { endpoints, getImageUrl } from '@/lib/api';

async function getSettings() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_URL}${endpoints.settings}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const logoUrl = settings?.logo ? getImageUrl(settings.logo) : null;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Daily Grind';

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-4 bg-white/80 dark:bg-background-dark/80 sticky top-0 z-50 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 text-primary">
          <div className="size-10 flex items-center justify-center bg-primary/10 rounded-lg overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <Coffee className="size-6" />
            )}
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">
            {siteName}
          </h2>
        </Link>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link href="/menu" className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">Menu</Link>
            <Link href="/product" className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">Product</Link>
            <Link href="/asmr" className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">ASMR</Link>
            <Link href="/orders" className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">Orders</Link>
          </nav>
          <div className="flex gap-3">
            <button className="flex items-center justify-center rounded-xl size-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
              <ShoppingBag className="size-5" />
            </button>
            <button className="flex items-center justify-center rounded-xl size-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
              <User className="size-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="mt-auto border-t border-primary/10 bg-white dark:bg-background-dark/30 py-10">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 text-primary mb-4">
              <div className="size-10 flex items-center justify-center bg-primary/10 rounded-lg overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <Coffee className="size-6" />
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{siteName}</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Experience the best coffee in town. We roast our own beans and craft each cup with care.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-900 dark:text-slate-100">Quick Links</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
              <li><Link href="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Locations</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-900 dark:text-slate-100">Contact</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
              <li className="flex items-center gap-2"><Mail className="size-4" /> hello@dailygrind.com</li>
              <li className="flex items-center gap-2"><Phone className="size-4" /> (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin className="size-4" /> 123 Brew St, Bean City</li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-10 pt-6 border-t border-primary/5 text-center text-slate-400 text-xs">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
