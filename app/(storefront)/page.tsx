import Link from 'next/link';
import { MenuSquare, Coffee, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[1200px] px-4 md:px-10 py-6">
        {/* Hero Section */}
        <section className="@container">
          <div className="@[480px]:p-2">
            <div 
              className="flex min-h-[520px] flex-col gap-8 bg-cover bg-center bg-no-repeat @[480px]:rounded-xl items-center justify-center p-6 text-center relative overflow-hidden" 
              style={{ backgroundImage: 'linear-gradient(rgba(34, 25, 16, 0.6) 0%, rgba(34, 25, 16, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBS7MjMdfwCv1DqRLY5YHgD8XRyOsNHseJidVw67eg4s0rItgSTVEKs1YsCAoYPyzO4MsnykLv1Ktwepj6z-pXsx_F_gUztpAA9g2Jvle5oLF0RFSZD34YrTM3DrJdyFgwySZi28siaqS1kU72N9J-htErWvr_U7hWpIGhcY8BZqUHsY2FO8_8nSG44ZdLan2A0HmsJbQUQwIE0a5P8i9K9MdnetqR7OQKCkxIQf58JdmiReEQBGc7z6l4AzRtOIqi9hUKPgwX")' }}
            >
              <div className="flex flex-col gap-4 max-w-2xl z-10">
                <h1 className="text-white text-5xl font-black leading-tight tracking-tight @[480px]:text-6xl">
                  Experience the <span className="text-primary">Perfect Brew</span>
                </h1>
                <p className="text-slate-200 text-lg font-normal leading-relaxed">
                  Welcome to The Daily Grind, where every single bean is roasted to perfection and every cup is crafted with passion.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 z-10">
                <Link href="/menu" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                  View Menu
                </Link>
                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-base font-bold hover:bg-white/20 transition-all">
                  Our Story
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Order Status Section */}
        <section className="mt-12 mb-20">
          <div className="flex items-center justify-between px-4 pb-6">
            <div className="flex items-center gap-3">
              <MenuSquare className="text-primary size-8" />
              <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">Live Order Status</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live Updates
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
            {/* Order Card 1 */}
            <div className="flex items-center gap-4 bg-white dark:bg-background-dark border border-primary/10 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-14">
                <Coffee className="size-8" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-slate-900 dark:text-slate-100 text-lg font-bold">John D.</p>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">#402</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Caramel Macchiato</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <p className="text-blue-500 text-xs font-bold uppercase">Just ordered</p>
                </div>
              </div>
            </div>
            {/* Order Card 2 */}
            <div className="flex items-center gap-4 bg-white dark:bg-background-dark border border-primary/10 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-14">
                <Coffee className="size-8" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-slate-900 dark:text-slate-100 text-lg font-bold">Sarah M.</p>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">#401</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cold Brew w/ Oat Milk</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                  <p className="text-orange-500 text-xs font-bold uppercase">Brewing</p>
                </div>
              </div>
            </div>
            {/* Order Card 3 */}
            <div className="flex items-center gap-4 bg-white dark:bg-background-dark border border-primary/10 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-14">
                <CheckCircle className="size-8" />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-slate-900 dark:text-slate-100 text-lg font-bold">Michael R.</p>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">#400</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Double Espresso</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <p className="text-green-500 text-xs font-bold uppercase">Ready for Pickup</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              View All Recent Orders <ArrowRight className="size-4" />
            </button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/10">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Ready for your morning kick?</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Order online and skip the line. Your coffee will be waiting for you.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/menu" className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Order Now</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
