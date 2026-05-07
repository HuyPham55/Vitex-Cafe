'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Coffee, ArrowRight } from 'lucide-react';
import { fetchAPI, endpoints, formatPrice, getImageUrl } from '@/lib/api';

interface CoffeeSuggestionGridProps {
  count?: number;
  title?: string;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  inStock?: boolean;
  isHidden?: boolean;
  category?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function CoffeeSuggestionGrid({ count = 4, title = 'Suggested for You' }: CoffeeSuggestionGridProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [products, settings] = await Promise.all([
          fetchAPI(endpoints.products),
          fetchAPI(endpoints.settings).catch(() => null),
        ]);
        if (cancelled) return;
        const list = (products || []) as Product[];
        const eligible = list.filter((p) => !p.isHidden && p.inStock !== false);
        setItems(shuffle(eligible).slice(0, count));
        if (settings?.currencySymbol) setCurrencySymbol(settings.currencySymbol);
      } catch (err) {
        console.error('Failed to load coffee suggestions', err);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [count]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16 mb-8">
      <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
        <Coffee className="size-6 text-primary" /> {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((p) => (
          <Link
            key={p._id}
            href={`/product/${p._id}`}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-primary/5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={getImageUrl(p.imageUrl)}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1 truncate">{p.name}</h3>
              {p.description && (
                <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-2">{p.description}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="font-black text-primary">
                  {formatPrice(p.price)}
                  {currencySymbol}
                </span>
                <ArrowRight className="size-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
