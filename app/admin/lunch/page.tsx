'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  ChefHat,
  ClipboardPaste,
  Save,
  Timer,
  Plus,
  Download,
  Trash2,
  History,
  Settings as SettingsIcon,
  CheckCircle,
  X,
} from 'lucide-react';
import { fetchAPI, endpoints, formatPrice } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CutoffCountdown from '@/components/CutoffCountdown';
import QueueBadge from '@/components/QueueBadge';

interface Dish { name: string }
interface LunchMenu { date: string; rawText?: string; mainDishes: Dish[]; vegetables: Dish[] }
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
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  lunchDate?: string;
}

type RangeTab = 'today' | '7' | '30';

export default function AdminLunchPage() {
  const { token } = useAuth();
  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<LunchMenu | null>(null);
  const [settings, setSettings] = useState<LunchSettings | null>(null);
  const [orders, setOrders] = useState<LunchOrder[]>([]);
  const [history, setHistory] = useState<Record<string, LunchOrder[]>>({});
  const [rangeTab, setRangeTab] = useState<RangeTab>('today');

  // Menu paste/parse state
  const [rawText, setRawText] = useState('');
  const [previewMains, setPreviewMains] = useState<Dish[]>([]);
  const [previewVeg, setPreviewVeg] = useState<Dish[]>([]);
  const [parseLoading, setParseLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Settings form
  const [cutoffInput, setCutoffInput] = useState('10:30');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [paymentQRImage, setPaymentQRImage] = useState('');

  // Toast
  const [toast, setToast] = useState<{ message: string } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const loadAll = async () => {
    try {
      const [menuData, settingsData, ordersData] = await Promise.all([
        fetchAPI(`${endpoints.lunchMenu}/today`),
        fetchAPI(endpoints.lunchSettings),
        fetchAPI(`${endpoints.lunchOrders}/today`, { headers: authHeaders }),
      ]);
      setMenu(menuData);
      setSettings(settingsData);
      setOrders(ordersData || []);
      if (settingsData) {
        setCutoffInput(settingsData.cutoffTime || '10:30');
        setPaymentInstructions(settingsData.paymentInstructions || '');
        setPaymentQRImage(settingsData.paymentQRImage || '');
      }
      if (menuData) {
        setRawText(menuData.rawText || '');
        setPreviewMains(menuData.mainDishes || []);
        setPreviewVeg(menuData.vegetables || []);
      }
    } catch (err) {
      console.error('Failed to load lunch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadAll();
    const id = setInterval(async () => {
      try {
        const ordersData = await fetchAPI(`${endpoints.lunchOrders}/today`, { headers: authHeaders });
        setOrders(ordersData || []);
      } catch {}
    }, 10000);
    return () => clearInterval(id);
  }, [token]);

  useEffect(() => {
    if (rangeTab === 'today' || !token) return;
    const days = rangeTab === '7' ? 7 : 30;
    fetchAPI(`${endpoints.lunchOrders}/history?days=${days}`, { headers: authHeaders })
      .then(setHistory)
      .catch((err) => console.error('Failed to fetch history', err));
  }, [rangeTab, token]);

  const parse = async () => {
    setParseLoading(true);
    try {
      const result = await fetchAPI(`${endpoints.lunchMenu}/parse`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ rawText }),
      });
      setPreviewMains(result.mainDishes || []);
      setPreviewVeg(result.vegetables || []);
    } catch (err: any) {
      alert(err?.message || 'Parse failed');
    } finally {
      setParseLoading(false);
    }
  };

  const saveMenu = async () => {
    setSaveLoading(true);
    try {
      const saved = await fetchAPI(endpoints.lunchMenu, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          rawText,
          mainDishes: previewMains,
          vegetables: previewVeg,
          cutoffTime: cutoffInput,
        }),
      });
      setMenu(saved);
      const refreshedSettings = await fetchAPI(endpoints.lunchSettings);
      setSettings(refreshedSettings);
    } catch (err: any) {
      alert(err?.message || 'Save failed');
    } finally {
      setSaveLoading(false);
    }
  };

  const saveSettings = async (extendBy?: number) => {
    try {
      const body: any = {
        cutoffTime: cutoffInput,
        paymentInstructions,
        paymentQRImage,
      };
      if (typeof extendBy === 'number') body.extendBy = extendBy;
      const saved = await fetchAPI(endpoints.lunchSettings, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      setSettings(saved);
      setCutoffInput(saved.cutoffTime);
      setToast({
        message:
          typeof extendBy === 'number'
            ? `Cutoff extended by ${extendBy === 60 ? '1 hour' : `${extendBy} min`} — now ${saved.cutoffTime}`
            : 'Settings saved',
      });
    } catch (err: any) {
      alert(err?.message || 'Settings update failed');
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await fetchAPI(`${endpoints.orders}/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: status as any } : o)));
    } catch (err: any) {
      alert(err?.message || 'Update failed');
    }
  };

  const updateOrderPayment = async (id: string, paymentStatus: string) => {
    try {
      await fetchAPI(`${endpoints.orders}/${id}/payment`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ paymentStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, paymentStatus: paymentStatus as any } : o))
      );
    } catch (err: any) {
      alert(err?.message || 'Update failed');
    }
  };

  const dishCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of orders) {
      for (const m of o.lunchSelection?.mains || []) counts[m] = (counts[m] || 0) + 1;
      const v = o.lunchSelection?.vegetable;
      if (v) counts[`(veg) ${v}`] = (counts[`(veg) ${v}`] || 0) + 1;
    }
    return counts;
  }, [orders]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const exportTxt = () => {
    const lines: string[] = [];
    lines.push(`Vitex Lunch Order — ${menu?.date || new Date().toISOString().slice(0, 10)}`);
    lines.push(`Total orders: ${orders.length}`);
    lines.push('');
    lines.push('--- Dish counts ---');
    for (const [k, v] of Object.entries(dishCounts).sort((a, b) => b[1] - a[1])) {
      lines.push(`${k}: ${v}`);
    }
    lines.push('');
    lines.push('--- Per-employee ---');
    for (const o of orders.sort((a, b) => a.queueNumber - b.queueNumber)) {
      const items = [...(o.lunchSelection?.mains || []), o.lunchSelection?.vegetable].filter(Boolean).join(', ');
      lines.push(
        `Queue #${o.queueNumber} — ${o.customerName} — ${items} — ${formatPrice(o.total)}đ — ${o.paymentStatus}`
      );
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lunch-${menu?.date || 'today'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ChefHat className="size-7 text-primary" /> Lunch Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Set today&apos;s menu, manage cutoff, and export to the kitchen.
          </p>
        </div>
        <CutoffCountdown cutoffTime={settings?.cutoffTime} cutoffDate={settings?.cutoffDate} />
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-primary/5 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total orders</p>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-primary/5 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Today&apos;s revenue</p>
          <p className="text-3xl font-black text-primary mt-1">{formatPrice(totalRevenue)}đ</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-primary/5 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Kitchen export</p>
            <button
              onClick={exportTxt}
              disabled={orders.length === 0}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/5 px-2 py-1 rounded disabled:opacity-40"
            >
              <Download className="size-3.5" /> .txt
            </button>
          </div>
          <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
            {Object.entries(dishCounts).slice(0, 5).map(([k, v]) => (
              <p key={k} className="text-xs flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 truncate">{k}</span>
                <span className="font-bold text-primary">x{v}</span>
              </p>
            ))}
            {Object.keys(dishCounts).length === 0 && (
              <p className="text-xs text-slate-400">No orders yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Menu setup */}
      <section className="bg-white dark:bg-slate-900 border border-primary/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ClipboardPaste className="size-5 text-primary" /> Today&apos;s Menu
        </h2>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`1. Thịt kho dừa\n2. Cá kho tộ\n3. Đậu sốt cà\nRau có\n1. Rau muống xào tỏi\n2. Su su luộc`}
          className="w-full min-h-[160px] px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary outline-none font-mono text-sm bg-white dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={parse}
            disabled={parseLoading || !rawText.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm hover:bg-slate-200 disabled:opacity-40 transition-all"
          >
            {parseLoading ? <Loader2 className="animate-spin size-4" /> : <ClipboardPaste className="size-4" />}
            Parse
          </button>
          <button
            onClick={saveMenu}
            disabled={saveLoading || (previewMains.length === 0 && !rawText.trim())}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:opacity-95 disabled:opacity-40 transition-all"
          >
            {saveLoading ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
            Save Menu
          </button>
        </div>
        {(previewMains.length > 0 || previewVeg.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mains ({previewMains.length})</p>
              <ul className="space-y-1">
                {previewMains.map((d, i) => (
                  <li key={`${d.name}-${i}`} className="text-sm text-slate-700 dark:text-slate-300">{i + 1}. {d.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Vegetables ({previewVeg.length})</p>
              <ul className="space-y-1">
                {previewVeg.map((d, i) => (
                  <li key={`${d.name}-${i}`} className="text-sm text-slate-700 dark:text-slate-300">{i + 1}. {d.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Cutoff + payment settings */}
      <section className="bg-white dark:bg-slate-900 border border-primary/5 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="size-5 text-primary" /> Cutoff &amp; Payment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Timer className="size-3.5" /> Cutoff time
            </label>
            <input
              type="time"
              value={cutoffInput}
              onChange={(e) => setCutoffInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary outline-none bg-white dark:bg-slate-800 dark:text-slate-100"
            />
            <div className="flex flex-wrap gap-2">
              {[15, 30, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => saveSettings(m)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all"
                >
                  <Plus className="size-3" /> {m === 60 ? '1 hour' : `${m} min`}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment QR image URL</label>
            <input
              type="text"
              value={paymentQRImage}
              onChange={(e) => setPaymentQRImage(e.target.value)}
              placeholder="https://... or /uploads/..."
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary outline-none bg-white dark:bg-slate-800 dark:text-slate-100"
            />
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2 block">Payment instructions</label>
            <textarea
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary outline-none bg-white dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
        <button
          onClick={() => saveSettings()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:opacity-95 transition-all"
        >
          <Save className="size-4" /> Save Settings
        </button>
      </section>

      {/* Range tabs + orders */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="size-5 text-primary" />
            {rangeTab === 'today' ? "Today's Lunch Orders" : 'Lunch Order History'}
          </h2>
          <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-primary/10">
            {(['today', '7', '30'] as RangeTab[]).map((r) => (
              <button
                key={r}
                onClick={() => setRangeTab(r)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  rangeTab === r ? 'bg-primary text-white' : 'text-slate-500 hover:text-primary'
                }`}
              >
                {r === 'today' ? 'Today' : `${r} days`}
              </button>
            ))}
          </div>
        </div>

        {rangeTab === 'today' ? (
          <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-primary/5 rounded-2xl">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/40">
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-4 py-3">Queue</th>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No lunch orders yet today.
                    </td>
                  </tr>
                ) : (
                  orders
                    .slice()
                    .sort((a, b) => a.queueNumber - b.queueNumber)
                    .map((o) => (
                      <tr key={o._id} className="border-t border-primary/5 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3">
                          <QueueBadge queueNumber={o.queueNumber} size="md" />
                        </td>
                        <td className="px-4 py-3 font-bold text-primary">#{o.orderNumber}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{o.customerName}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 max-w-[220px]">
                          <p className="truncate">
                            {(o.lunchSelection?.mains || []).join(', ')}
                          </p>
                          {o.lunchSelection?.vegetable && (
                            <p className="truncate text-slate-500">+ {o.lunchSelection.vegetable}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold">{formatPrice(o.total)}đ</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.paymentStatus}
                            onChange={(e) => updateOrderPayment(o._id, e.target.value)}
                            className={`text-[10px] font-bold p-1.5 px-2 rounded ${
                              o.paymentStatus === 'paid'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            <option value="unpaid">UNPAID</option>
                            <option value="paid">PAID</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                            className="text-[10px] font-bold p-1.5 px-2 rounded bg-slate-50 dark:bg-slate-800"
                          >
                            <option value="pending">PENDING</option>
                            <option value="preparing">PREPARING</option>
                            <option value="ready">READY</option>
                            <option value="completed">COMPLETED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(history).length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-primary/5 rounded-2xl p-12 text-center text-slate-400">
                No history in this range.
              </div>
            ) : (
              Object.entries(history)
                .sort((a, b) => (a[0] < b[0] ? 1 : -1))
                .map(([date, list]) => (
                  <div key={date} className="bg-white dark:bg-slate-900 border border-primary/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{date}</h3>
                      <span className="text-xs text-slate-500">{list.length} orders</span>
                    </div>
                    <ul className="space-y-2">
                      {list.map((o) => (
                        <li key={o._id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <QueueBadge queueNumber={o.queueNumber} size="sm" />
                            <span className="font-bold text-slate-900 dark:text-slate-100">{o.customerName}</span>
                            <span className="text-xs text-slate-500 truncate">
                              {(o.lunchSelection?.mains || []).join(', ')}
                            </span>
                          </div>
                          <span className="font-bold text-primary">{formatPrice(o.total)}đ</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
            )}
          </div>
        )}
      </section>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl shadow-green-600/30 animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          <CheckCircle className="size-5 shrink-0" />
          <span className="font-bold text-sm">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            aria-label="Dismiss"
            className="ml-2 p-1 rounded-md hover:bg-white/15 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
