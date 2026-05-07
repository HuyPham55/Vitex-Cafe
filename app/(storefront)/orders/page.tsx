'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Calendar, Coffee, Loader2, CheckCircle, Info, QrCode, Receipt, ArrowRight, Clock, AlertCircle, UtensilsCrossed
} from 'lucide-react';
import { fetchAPI, endpoints, formatPrice, getImageUrl } from '@/lib/api';
import LunchTag from '@/components/LunchTag';
import QueueBadge from '@/components/QueueBadge';
import CoffeeSuggestionGrid from '@/components/CoffeeSuggestionGrid';

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get('id');

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const [searchId, setSearchId] = useState(orderIdParam || '');
  const [order, setOrder] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'lunch'>('all');

  // Fetch recent orders for sidebar
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const query = filterMode === 'lunch' ? '?type=lunch' : '';
        const data = await fetchAPI(`${endpoints.orders}/active${query}`);
        setRecentOrders(data.slice(0, 20));
      } catch (err) {
        console.error('Failed to fetch recent orders:', err);
      } finally {
        setSidebarLoading(false);
      }
    };
    fetchRecent();

    const fetchSettings = async () => {
        try {
          const data = await fetchAPI(endpoints.settings);
          setSettings(data);
        } catch (err) {}
      };
      fetchSettings();
  }, [filterMode]);

  // Fetch specific order when id changes
  useEffect(() => {
    if (!orderIdParam) {
      setOrder(null);
      setError(null);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAPI(`${endpoints.orders}/lookup/${orderIdParam}`);
        setOrder(data);
        setSearchId(orderIdParam);
      } catch (err: any) {
        setError('Order not found');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderIdParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    // Clean searchId if it starts with #
    const cleanId = searchId.trim().replace(/^#/, '');
    router.push(`/orders?id=${cleanId}`);
  };

  const selectOrder = (orderNum: number) => {
    router.push(`/orders?id=${orderNum}`);
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-10">
      {/* Search Section */}
      <section className="mb-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">Track Your Roast</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Enter your Order ID to view status and payment details.</p>
          <form onSubmit={handleSearch} className="relative mt-8 group">
            <input
              className="w-full bg-white dark:bg-slate-900 border-2 border-primary/10 rounded-2xl px-6 py-5 text-lg focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-primary/5 dark:text-slate-100"
              placeholder="Search for your order by ID (e.g. 100)"
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 bottom-2.5 bg-primary text-white px-8 rounded-xl font-bold flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-md shadow-primary/20"
            >
              <Search className="size-5" />
              <span>Find</span>
            </button>
          </form>
          <div className="flex justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => setFilterMode('lunch')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filterMode === 'lunch'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white dark:bg-slate-900 text-slate-500 hover:text-primary border border-primary/10'
              }`}
            >
              <UtensilsCrossed className="size-4" /> Lunch
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white dark:bg-slate-900 text-slate-500 hover:text-primary border border-primary/10'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar: Recent Orders */}
        <aside className="lg:col-span-4 space-y-6">
          <h3 className="text-xl font-bold px-2 text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="size-5 text-primary" /> Recent Orders
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {sidebarLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-100 dark:bg-slate-800 animate-pulse h-24 rounded-2xl"></div>
              ))
            ) : recentOrders.length === 0 ? (
              <p className="text-slate-500 text-sm px-2">No recent orders found.</p>
            ) : (
              recentOrders.map((o) => (
                <div
                  key={o._id}
                  onClick={() => selectOrder(o.orderNumber)}
                  className={`p-5 rounded-2xl transition-all cursor-pointer border ${
                    parseInt(orderIdParam || '') === o.orderNumber
                      ? 'bg-primary/5 border-primary shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-primary/5 hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-black text-lg text-slate-900 dark:text-slate-100">#{o.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      o.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </div>
                  {o.type === 'lunch' && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      <LunchTag />
                      <QueueBadge queueNumber={o.queueNumber} size="sm" />
                    </div>
                  )}
                  <p className="text-slate-700 dark:text-slate-300 text-xs font-bold mb-2 truncate">
                    {o.customerName}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2 font-medium">
                    <Calendar className="size-3" />
                    <span className="text-primary font-bold">{formatRelativeDate(o.createdAt)}</span> • {new Date(o.createdAt).toLocaleDateString()} • {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Section: Order Details */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-20 flex flex-col items-center justify-center border border-primary/5 shadow-sm">
              <Loader2 className="animate-spin size-12 text-primary" />
              <p className="mt-4 text-slate-500 font-bold">Grinding through order logs...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 p-12 rounded-3xl text-center shadow-sm">
              <div className="size-16 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="size-10" />
              </div>
              <h3 className="text-2xl font-black text-red-700 dark:text-red-300 mb-2">{error}</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                We couldn't find a record for that ID. Please check your confirmation or ask a barista for assistance.
              </p>
            </div>
          ) : order ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col border border-primary/5">
              {/* Header */}
              <div className="bg-primary p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                    <Coffee className="size-64" />
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter">Order #{order.orderNumber}</h2>
                    {order.type === 'lunch' && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          <UtensilsCrossed className="size-3" /> Lunch
                        </span>
                        {order.queueNumber !== undefined && (
                          <span className="inline-flex items-center bg-white text-primary font-bold text-xs px-2.5 py-1 rounded">
                            Queue #{order.queueNumber}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="opacity-90 font-medium mt-1">Found in our roasting logs • <span className="font-bold">{order.customerName}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Clock className="size-7" />
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase font-bold tracking-widest opacity-80">Current Status</span>
                        <span className="font-black text-xl uppercase tracking-wider">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Items List */}
                  <div className="space-y-8">
                    <h4 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <Receipt className="text-primary size-6" /> Brewed Items
                    </h4>
                    <ul className="divide-y divide-primary/10">
                      {order.items.map((item: any, i: number) => (
                        <li key={i} className="py-5 flex justify-between items-center group">
                          <div className="flex gap-4 items-center">
                            <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary/40">
                              <Coffee className="size-6" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100">{item.quantity}x {item.name}</p>
                              <p className="text-xs text-slate-500 font-medium">
                                {(item.variantOptions || item.selectedVariants || []).map((v: any) => v.selectedOption || v.option).join(' • ')}
                              </p>
                            </div>
                          </div>
                          <p className="font-black text-slate-900 dark:text-slate-100">{formatPrice(item.subtotal || 0)}{settings?.currencySymbol || '$'}</p>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Totals Section */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl space-y-4 border border-primary/5 shadow-inner">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="text-slate-900 dark:text-slate-100">{formatPrice((order.total || 0) * 0.9)}{settings?.currencySymbol || '$'}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Tax</span>
                        <span className="text-slate-900 dark:text-slate-100">{formatPrice((order.total || 0) * 0.1)}{settings?.currencySymbol || '$'}</span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-primary/10">
                        <span className="font-bold text-lg text-slate-900 dark:text-slate-100">Total</span>
                        <span className="font-black text-2xl text-primary">{formatPrice(order.total || 0)}{settings?.currencySymbol || '$'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Section (Conditional) */}
                  <div className="space-y-8">
                    {order.paymentStatus === 'unpaid' ? (
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-2 border-primary/10 shadow-xl text-center flex flex-col items-center">
                        <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">Scan to Pay</h4>
                        <p className="text-sm text-slate-500 font-medium mb-8">Complete your payment to start the brew.</p>
                        
                        {(settings?.paymentQRCode) ? (
                          <div className="p-5 bg-white rounded-3xl shadow-inner border border-slate-100 mb-8 w-max">
                            <img 
                              src={getImageUrl(settings.paymentQRCode)} 
                              alt="Payment QR" 
                              className="size-48 object-contain"
                            />
                          </div>
                        ) : (
                          <div className="size-48 bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-dashed border-primary/20 flex flex-col items-center justify-center text-primary/30 mb-8">
                             <QrCode className="size-16" />
                             <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Cash or at counter</span>
                          </div>
                        )}

                        <div className="text-left space-y-4 w-full">
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium bg-primary/5 p-4 rounded-2xl border border-primary/10">
                            {settings?.paymentDescription || order.paymentDescription || 'Please pay at the counter.'}
                          </p>
                          <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest justify-center">
                            <Info className="size-3" />
                            <span>Show verification to barista</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 p-12 rounded-3xl text-center flex flex-col items-center">
                        <div className="size-20 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle className="size-12" />
                        </div>
                        <h3 className="text-2xl font-black text-green-700 dark:text-green-300 mb-2">Order Paid</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                          Thank you! Your payment has been processed and your roast is in progress.
                        </p>
                      </div>
                    )}
                    
                    <button className="w-full bg-slate-900 dark:bg-primary text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:opacity-95 active:scale-[0.98] transition-all shadow-lg">
                      <Receipt className="size-5" />
                      <span>Download Receipt</span>
                    </button>
                    
                    <Link href="/menu" className="w-full flex items-center justify-center gap-2 text-primary font-bold py-2 hover:underline transition-all">
                        Back to Menu <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-50 grayscale">
               <div className="size-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                 <Search className="size-12 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-400">Search for an order to see details</h3>
            </div>
          )}
        </div>
      </div>

      <CoffeeSuggestionGrid count={4} />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin size-12 text-primary" />
      </div>
    }>
      <OrdersPageContent />
    </Suspense>
  );
}
