'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Coffee, LayoutDashboard, MenuSquare, History, Settings, LogOut, Search, Bell, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, username, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }

    if (!isAuthenticated) {
      router.push('/admin/login');
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-background-dark">
        <Loader2 className="animate-spin size-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark/50 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <Coffee className="size-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Vitex Admin</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Coffee Management</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'}`}>
            <LayoutDashboard className="size-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/menu" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/admin/menu' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'}`}>
            <MenuSquare className="size-5" />
            <span>Menu Management</span>
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/admin/orders' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'}`}>
            <History className="size-5" />
            <span>Order Management</span>
          </Link>
          <Link href="/admin/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/admin/settings' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'}`}>
            <Settings className="size-5" />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-primary/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 p-2 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 cursor-pointer transition-colors"
          >
            <LogOut className="size-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-primary/10 bg-white dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-white/5 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm outline-none" placeholder="Search..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">{username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              </div>
              <div className="size-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary">
                {username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
