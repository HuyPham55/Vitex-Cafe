'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Coffee, IceCream, Search } from 'lucide-react';
import { fetchAPI, endpoints } from '@/lib/api';

export default function Menu() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const smoothScrollTo = useCallback((id: string) => {
    setActiveCategory(id);
    // We wait a brief moment for the Framer Motion template animation (y: 15 -> 0)
    // to settle, otherwise getBoundingClientRect will be inaccurate.
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      
      const STICKY_HEADER_OFFSET = 140; 
      const top = el.getBoundingClientRect().top + window.scrollY - STICKY_HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 100);
  }, []);

  // Handle initial hash in URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash && !loading) {
      const id = window.location.hash.replace('#', '');
      smoothScrollTo(id);
    }
  }, [loading, smoothScrollTo]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const [data, settings] = await Promise.all([
          fetchAPI(endpoints.products),
          fetchAPI(endpoints.settings)
        ]);
        setProducts(data);
        setCurrencySymbol(settings.currencySymbol || '$');
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('cold') || category.toLowerCase().includes('ice')) {
      return <IceCream className="text-primary size-6" />;
    }
    return <Coffee className="text-primary size-6" />;
  };

  return (
    <div className="flex flex-col items-center w-full py-5">
      <div className="w-full max-w-[1200px] px-4 md:px-10">

        {/* Category Navigation & Search */}
        <div className="sticky top-[73px] bg-white/90 dark:bg-background-dark/90 backdrop-blur z-40 pb-3 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/10">
            <div className="flex overflow-x-auto no-scrollbar">
              <button
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveCategory(null); }}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 px-4 whitespace-nowrap transition-colors ${
                  activeCategory === null
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary'
                }`}
              >
                <p className="text-sm font-bold tracking-wide">All Items</p>
              </button>
              {categories.map((cat) => {
                const id = cat.toLowerCase().replace(/\s+/g, '-');
                return (
                  <button
                    key={cat}
                    onClick={() => smoothScrollTo(id)}
                    className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 px-4 whitespace-nowrap transition-colors ${
                      activeCategory === id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary'
                    }`}
                  >
                    <p className="text-sm font-bold tracking-wide">{cat}</p>
                  </button>
                );
              })}
            </div>
            <div className="relative mb-3 md:mb-0 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                placeholder="Search menu..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full border-none focus:ring-2 focus:ring-primary text-sm outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-12 py-8">
            {categories.map((category) => {
              const categoryProducts = filteredProducts.filter(p => p.category === category);
              if (categoryProducts.length === 0) return null;

              return (
                <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-32">
                  <div className="flex items-center gap-3 px-2 mb-6">
                    {getCategoryIcon(category)}
                    <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight tracking-tight">{category}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                    {categoryProducts.map((product) => (
                      <Link
                        href={`/product/${product._id}`}
                        key={product._id}
                        className="group flex flex-col gap-3 pb-4 bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                      >
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 z-10 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Out of Stock</span>
                          </div>
                        )}
                        <div
                          className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover transition-transform group-hover:scale-105"
                          style={{ backgroundImage: `url("${product.imageUrl || 'https://picsum.photos/400/300'}")` }}
                        ></div>
                        <div className="px-4 py-2">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-slate-900 dark:text-slate-100 text-base font-bold">{product.name}</p>
                            <p className="text-primary font-bold">{product.price.toFixed(2)}{currencySymbol}</p>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm font-normal line-clamp-2">{product.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
