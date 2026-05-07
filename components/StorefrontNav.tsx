'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StorefrontNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/lunch', label: 'Lunch' },
    { href: '/orders', label: 'Orders' },
    // { href: '/product', label: 'Product' },
    { href: '/about', label: 'About Us' },
    { href: '/asmr', label: 'ASMR' },
  ];

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navLinks.map((link) => {
        // Exact match for Home, startsWith for others to handle subpages like /product/[id]
        const isActive = link.href === '/' 
            ? pathname === '/' 
            : pathname?.startsWith(link.href);

        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`text-sm font-medium transition-all ${
              isActive 
                ? 'text-primary scale-105 before:content-[""] before:absolute before:-bottom-1.5 before:left-0 before:w-full before:h-0.5 before:bg-primary before:rounded-full relative' 
                : 'text-slate-700 dark:text-slate-300 hover:text-primary hover:scale-105'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
