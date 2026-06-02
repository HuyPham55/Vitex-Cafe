'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Shuffle,
  Salad,
  UtensilsCrossed,
  Wallet,
  QrCode,
  CheckCircle,
  History,
  AlertTriangle,
  ChefHat,
} from 'lucide-react';
import { fetchAPI, endpoints, formatPrice, getImageUrl } from '@/lib/api';
import { CUSTOMER_NAME_STORAGE_KEY, LUNCH_NOTE_STORAGE_KEY } from '@/lib/utils';
import CutoffCountdown from '@/components/CutoffCountdown';
import QueueBadge from '@/components/QueueBadge';
import CoffeeSuggestionGrid from '@/components/CoffeeSuggestionGrid';

interface Dish {
  name: string;
}

interface LunchMenu {
  date: string;
  mainDishes: Dish[];
  vegetables: Dish[];
}

interface LunchSettings {
  cutoffTime: string;
  cutoffDate: string;
  paymentQRImage?: string;
  paymentInstructions?: string;
  basePrice: number;
  extraMainPrice: number;
  baseMainsLimit: number;
}

interface LunchOrder {
  _id: string;
  orderNumber: number;
  customerName: string;
  queueNumber: number;
  lunchSelection?: { mains: string[]; vegetable: string };
  total: number;
  paymentMethod?: 'pay_later' | 'pay_now';
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function LunchPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<LunchMenu | null>(null);
  const [settings, setSettings] = useState<LunchSettings | null>(null);
  const [todayOrders, setTodayOrders] = useState<LunchOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMains, setSelectedMains] = useState<string[]>([]);
  const [selectedVeg, setSelectedVeg] = useState<string>('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pay_later' | 'pay_now'>('pay_later');
  const [paidConfirmation, setPaidConfirmation] = useState(false);
  const [expired, setExpired] = useState(false);

  // Restore saved name on mount (subsequent-order convenience)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(CUSTOMER_NAME_STORAGE_KEY);
    if (saved) setName(saved);
  }, []);

  // Persist whenever the user types/edits their name
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (name.trim()) {
      window.localStorage.setItem(CUSTOMER_NAME_STORAGE_KEY, name.trim());
    }
  }, [name]);

  // Restore saved note on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(LUNCH_NOTE_STORAGE_KEY);
    if (saved) setNote(saved);
  }, []);

  // Persist note whenever edited
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LUNCH_NOTE_STORAGE_KEY, note);
  }, [note]);

  useEffect(() => {
    const load = async () => {
      try {
        const [menuData, settingsData, ordersData] = await Promise.all([
          fetchAPI(`${endpoints.lunchMenu}/today`),
          fetchAPI(endpoints.lunchSettings),
          fetchAPI(`${endpoints.lunchOrders}/today`),
        ]);
        setMenu(menuData);
        setSettings(settingsData);
        setTodayOrders(ordersData || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load today\'s lunch info');
      } finally {
        setLoading(false);
      }
    };
    load();

    const id = setInterval(async () => {
      try {
        const ordersData = await fetchAPI(`${endpoints.lunchOrders}/today`);
        setTodayOrders(ordersData || []);
      } catch {}
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const nextQueue = useMemo(() => {
    const last = todayOrders.reduce((max, o) => (o.queueNumber > max ? o.queueNumber : max), 0);
    return last + 1;
  }, [todayOrders]);

  const mainsCount = selectedMains.length;
  const baseLimit = settings?.baseMainsLimit ?? 3;
  const basePrice = settings?.basePrice ?? 35000;
  const extraPrice = settings?.extraMainPrice ?? 5000;
  const extras = Math.max(0, mainsCount - baseLimit);
  const total = basePrice + extras * extraPrice;

  const toggleMain = (name: string) => {
    setSelectedMains((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const randomPick = () => {
    if (!menu) return;
    const mains = shuffle(menu.mainDishes).slice(0, Math.min(baseLimit, menu.mainDishes.length)).map((d) => d.name);
    const veg = menu.vegetables[Math.floor(Math.random() * menu.vegetables.length)]?.name || '';
    setSelectedMains(mains);
    setSelectedVeg(veg);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (selectedMains.length < baseLimit) {
      setError(`Pick at least ${baseLimit} main dishes`);
      return;
    }
    if (!selectedVeg) {
      setError('Pick one vegetable');
      return;
    }
    if (paymentMethod === 'pay_now' && !paidConfirmation) {
      setError('Please confirm you have transferred the payment');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const created = await fetchAPI(endpoints.lunchOrders, {
        method: 'POST',
        body: JSON.stringify({
          customerName: name.trim(),
          mains: selectedMains,
          vegetable: selectedVeg,
          paymentMethod,
          paidConfirmation,
          note: note.trim() || undefined,
        }),
      });
      router.push(`/orders?id=${created.orderNumber}`);
    } catch (err: any) {
      setError(err?.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin size-12 text-primary" />
      </div>
    );
  }

  const noMenuToday = !menu || menu.mainDishes.length === 0;
  const formDisabled = expired || noMenuToday;

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-10">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <ChefHat className="size-9 text-primary" /> Today&apos;s Lunch
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Pick your dishes before the cutoff. The kitchen prepares once orders close.
          </p>
        </div>
        <CutoffCountdown
          cutoffTime={settings?.cutoffTime}
          cutoffDate={settings?.cutoffDate}
          onExpire={() => setExpired(true)}
        />
      </header>

      {noMenuToday && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-6 rounded-2xl flex items-center gap-3 mb-8">
          <AlertTriangle className="size-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            Today&apos;s menu hasn&apos;t been published yet. Please check back shortly.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form */}
        <form onSubmit={submit} className="lg:col-span-7 space-y-8">
          {/* Mains */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <UtensilsCrossed className="size-5 text-primary" /> Main Dishes
              </h2>
              <button
                type="button"
                onClick={randomPick}
                disabled={formDisabled}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg disabled:opacity-40 transition-all"
              >
                <Shuffle className="size-4" /> Random Pick
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Pick at least {baseLimit} mains for {formatPrice(basePrice)}đ. Each extra main +{formatPrice(extraPrice)}đ. Vegetables included.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menu?.mainDishes.map((d) => {
                const checked = selectedMains.includes(d.name);
                const indexInSelection = selectedMains.indexOf(d.name);
                const isExtra = checked && indexInSelection >= baseLimit;
                return (
                  <label
                    key={d.name}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
                    } ${formDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={formDisabled}
                      onChange={() => toggleMain(d.name)}
                      className="size-4 accent-primary"
                    />
                    <span className="font-bold flex-1 text-slate-900 dark:text-slate-100">{d.name}</span>
                    {isExtra && (
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded uppercase tracking-wider">
                        +{formatPrice(extraPrice)}đ
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </section>

          {/* Vegetables */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 mb-4">
              <Salad className="size-5 text-primary" /> Vegetables
              <span className="text-xs font-normal text-slate-500">(pick one)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menu?.vegetables.map((d) => {
                const checked = selectedVeg === d.name;
                return (
                  <label
                    key={d.name}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
                    } ${formDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="vegetable"
                      checked={checked}
                      disabled={formDisabled}
                      onChange={() => setSelectedVeg(d.name)}
                      className="size-4 accent-primary"
                    />
                    <span className="font-bold flex-1 text-slate-900 dark:text-slate-100">{d.name}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Live orders */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/5 shadow-sm p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 mb-4">
              <History className="size-5 text-primary" /> Live Lunch Orders
              <span className="text-xs font-normal text-slate-500">({todayOrders.length} placed)</span>
            </h2>
            {todayOrders.length === 0 ? (
              <p className="text-sm text-slate-500">No orders yet today. Be the first!</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {todayOrders.slice().reverse().map((o) => (
                  <li
                    key={o._id}
                    className="flex items-start justify-between gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{o.customerName}</span>
                        <QueueBadge queueNumber={o.queueNumber} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {(o.lunchSelection?.mains || []).join(', ')}
                        {o.lunchSelection?.vegetable ? ` • ${o.lunchSelection.vegetable}` : ''}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                        o.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </form>

        {/* Summary sidebar */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-primary/10 shadow-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your Order</h2>
              <QueueBadge queueNumber={nextQueue} size="md" />
            </div>

            <div className="space-y-2">
              {selectedMains.length === 0 && !selectedVeg ? (
                <p className="text-sm text-slate-500">Pick dishes to see your order summary.</p>
              ) : (
                <>
                  {selectedMains.map((m, i) => (
                    <div key={m} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">
                        <CheckCircle className="inline size-3 text-primary mr-2" />
                        {m}
                      </span>
                      {i >= baseLimit && (
                        <span className="text-xs font-bold text-orange-600">+{formatPrice(extraPrice)}đ</span>
                      )}
                    </div>
                  ))}
                  {selectedVeg && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">
                        <CheckCircle className="inline size-3 text-primary mr-2" />
                        {selectedVeg}
                      </span>
                      <span className="text-xs text-slate-500">free</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-primary/10 pt-4 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">Total</span>
              <span className="font-black text-2xl text-primary">{formatPrice(total)}đ</span>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alice"
                disabled={formDisabled}
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary outline-none bg-white dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                Note <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special instructions? (e.g: ít cơm, nhiều rau)"
                rows={2}
                disabled={formDisabled}
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary outline-none bg-white dark:bg-slate-800 dark:text-slate-100 resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'pay_later'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={paymentMethod === 'pay_later'}
                    onChange={() => setPaymentMethod('pay_later')}
                  />
                  <Wallet className="size-5 text-primary" />
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Pay Later</span>
                  <span className="text-[10px] text-slate-500">Settle in person</span>
                </label>
                <label
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'pay_now'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={paymentMethod === 'pay_now'}
                    onChange={() => setPaymentMethod('pay_now')}
                  />
                  <QrCode className="size-5 text-primary" />
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Pay Now</span>
                  <span className="text-[10px] text-slate-500">QR transfer</span>
                </label>
              </div>

              {paymentMethod === 'pay_now' && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-3">
                  {settings?.paymentQRImage ? (
                    <img
                      src={getImageUrl(settings.paymentQRImage)}
                      alt="Payment QR"
                      className="size-40 object-contain mx-auto bg-white p-2 rounded-lg"
                    />
                  ) : (
                    <div className="size-40 mx-auto bg-white rounded-lg flex flex-col items-center justify-center text-primary/40">
                      <QrCode className="size-12" />
                      <span className="text-[10px] mt-1">QR not set</span>
                    </div>
                  )}
                  {settings?.paymentInstructions && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                      {settings.paymentInstructions}
                    </p>
                  )}
                  <label className="flex items-start gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paidConfirmation}
                      onChange={(e) => setPaidConfirmation(e.target.checked)}
                      className="mt-0.5 accent-primary size-4"
                    />
                    <span className="text-slate-700 dark:text-slate-300">
                      I confirm I have transferred {formatPrice(total)}đ to the coordinator.
                    </span>
                  </label>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                {error}
              </p>
            )}

            <button
              onClick={submit}
              disabled={formDisabled || submitting}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <>
                  Place Order — Queue #{nextQueue}
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              You will receive a queue number to call out to the kitchen when your meal is ready.
            </p>
          </div>
        </aside>
      </div>

      <CoffeeSuggestionGrid count={4} />
    </div>
  );
}
