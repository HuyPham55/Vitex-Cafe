import Link from 'next/link';
import { Coffee, LayoutDashboard, MenuSquare, History, Settings, LogOut, Search, Bell } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark/50 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <Coffee className="size-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Brew Admin</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Main Branch Hub</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors">
            <LayoutDashboard className="size-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/menu" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors">
            <MenuSquare className="size-5" />
            <span>Menu Management</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors">
            <History className="size-5" />
            <span>Order History</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors">
            <Settings className="size-5" />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-primary/10">
          <Link href="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 cursor-pointer transition-colors">
            <LogOut className="size-5" />
            <span className="font-medium">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-primary/10 bg-white dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-white/5 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm outline-none" placeholder="Search orders, customers, or items..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-background-light dark:hover:bg-white/5 rounded-full relative">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-primary/10 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">James Miller</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Shift Manager</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1hpl4s7gGcC9EGom3tVEW0ZAxy-5PiWCf2VG7lY55IqbmClEWB3E04CvyrksJIkIBgmhLjeJXGQYATuLnhhK0AGbr3RlxFvVxwOnmFR8k_a4srJskKskI3rSZGrNalFrwLTwwnc-Lh2UYE1rFyRB2kLEMePPCt2N2iCShFr8lnMs-HhUic8M9MEVWyO5ARf4g2Xw1DzFsoSoJ3dILewrrIwhCunkHNoMKa9kwZa9aQmeQ7Zg9jV6byit_ZOrVkxuYX9tDOENa')", backgroundSize: 'cover' }}>
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
