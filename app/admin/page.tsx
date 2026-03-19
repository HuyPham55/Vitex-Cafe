'use client';

import { useState, useEffect } from 'react';
import {
  Coffee, DollarSign, Clock, CheckCircle,
  MoreVertical, Loader2, RefreshCw
} from 'lucide-react';
import { fetchAPI, endpoints, formatPrice } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    pending: 0,
    preparing: 0,
    ready: 0
  });

  const getDashboardData = async () => {
    try {
      const [orderData, settings] = await Promise.all([
        fetchAPI(endpoints.orders, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetchAPI(endpoints.settings)
      ]);
      setOrders(orderData);
      setCurrencySymbol(settings.currencySymbol || '$');
      const data = orderData;

      // Calculate simple stats
      const today = new Date().toLocaleDateString();
      const todayOrders = data.filter((o: any) => new Date(o.createdAt).toLocaleDateString() === today);

      const revenue = todayOrders.reduce((acc: number, o: any) => acc + o.total, 0);
      const pending = data.filter((o: any) => o.status === 'pending').length;
      const preparing = data.filter((o: any) => o.status === 'preparing').length;
      const ready = data.filter((o: any) => o.status === 'ready').length;

      setStats({
        revenue,
        totalOrders: todayOrders.length,
        pending,
        preparing,
        ready
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getDashboardData();
      const interval = setInterval(getDashboardData, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetchAPI(`${endpoints.orders}/${orderId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      getDashboardData();
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Today's performance and live orders.</p>
        </div>
        <button
          onClick={getDashboardData}
          className="flex items-center gap-2 text-primary font-bold text-sm hover:bg-primary/5 px-3 py-2 rounded-lg transition-all"
        >
          <RefreshCw className="size-4" /> Refresh Now
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
              <DollarSign className="size-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">Today</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Today's Revenue</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{formatPrice(stats.revenue)}{currencySymbol}</h3>
        </div>

        <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Coffee className="size-6" />
            </div>
            <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">{stats.totalOrders} total</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Today's Orders</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.totalOrders}</h3>
        </div>

        <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
              <Clock className="size-6" />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{stats.preparing} active</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Preparing</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.preparing}</h3>
        </div>

        <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
              <CheckCircle className="size-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stats.ready} ready</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Ready for Pickup</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.ready}</h3>
        </div>
      </div>

      {/* Live Orders Table */}
      <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-primary/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Live Orders Queue
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-white/5">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-primary/5">
              {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-bold text-primary">#{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{order.customerName}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="mb-1 last:mb-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 text-xs">{item.quantity}x {item.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {(item.variantOptions || item.selectedVariants || []).map((v: any) => v.selectedOption || v.option).join(', ')}
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${order.status === 'pending' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      order.status === 'preparing' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-green-50 text-green-600 border-green-100'
                      }`}>
                      <div className={`size-1.5 rounded-full ${order.status === 'pending' ? 'bg-blue-500' :
                        order.status === 'preparing' ? 'bg-orange-500 animate-pulse' :
                          'bg-green-500'
                        }`}></div>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(order._id, 'preparing')}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-[10px] font-bold"
                        >
                          Start Brewing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateStatus(order._id, 'ready')}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-[10px] font-bold"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateStatus(order._id, 'completed')}
                          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 text-[10px] font-bold"
                        >
                          Picked Up
                        </button>
                      )}
                      <button className="p-1.5 text-slate-400 hover:text-slate-600">
                        <MoreVertical className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No active orders in the queue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
