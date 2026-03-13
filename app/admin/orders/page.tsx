'use client';

import { useState, useEffect } from 'react';
import {
    Search, Filter, History, Coffee, CheckCircle,
    XCircle, Clock, MoreVertical, CreditCard, Loader2
} from 'lucide-react';
import { fetchAPI, endpoints } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function OrderManagement() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [filterStatus, setFilterStatus] = useState('all');

    const getOrders = async () => {
        try {
            const [orderData, settings] = await Promise.all([
                fetchAPI(endpoints.orders, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetchAPI(endpoints.settings)
            ]);
            setOrders(orderData);
            setCurrencySymbol(settings.currencySymbol || '$');
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
        const interval = setInterval(getOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await fetchAPI(`${endpoints.orders}/${id}/status`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            getOrders();
        } catch (error: any) {
            alert(error.message || 'Update failed');
        }
    };

    const updatePayment = async (id: string, newStatus: string) => {
        try {
            await fetchAPI(`${endpoints.orders}/${id}/payment`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({ paymentStatus: newStatus })
            });
            getOrders();
        } catch (error: any) {
            alert(error.message || 'Update failed');
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    if (loading && orders.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin size-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Order Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor and process orders in real-time.</p>
                </div>
                <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-primary/10 overflow-x-auto no-scrollbar max-w-full">
                    {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${filterStatus === status
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-slate-500 hover:text-primary'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <div key={order._id} className="bg-white dark:bg-slate-900 border border-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">
                        <div className={`w-2 shrink-0 ${order.status === 'pending' ? 'bg-blue-500' :
                            order.status === 'preparing' ? 'bg-orange-500' :
                                order.status === 'ready' ? 'bg-green-500' :
                                    order.status === 'completed' ? 'bg-slate-300' : 'bg-red-500'
                            }`}></div>

                        <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-black text-primary text-lg">#{order.orderNumber}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <p className="font-bold text-slate-900 dark:text-slate-100">{order.customerName}</p>
                                <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>

                            <div className="md:col-span-1">
                                <div className="space-y-1">
                                    {order.items.map((item: any, i: number) => (
                                        <div key={i} className="text-xs">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.quantity}x {item.name}</span>
                                            <p className="text-[10px] text-slate-500 truncate">
                                                {(item.variantOptions || item.selectedVariants || []).map((v: any) => v.selectedOption || v.option).join(', ')}
                                            </p>
                                        </div>
                                    ))}
                                    {order.note && (
                                        <p className="text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded mt-2 border border-orange-100 dark:border-orange-800">
                                            Note: {order.note}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-1">Status</p>
                                <div className="flex justify-center gap-2">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className="bg-slate-50 dark:bg-slate-800 border-none outline-none text-xs font-bold p-2 px-3 rounded-lg focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="pending">PENDING</option>
                                        <option value="preparing">PREPARING</option>
                                        <option value="ready">READY</option>
                                        <option value="completed">COMPLETED</option>
                                        <option value="cancelled">CANCELLED</option>
                                    </select>
                                    <select
                                        value={order.paymentStatus}
                                        onChange={(e) => updatePayment(order._id, e.target.value)}
                                        className={`border-none outline-none text-xs font-bold p-2 px-3 rounded-lg focus:ring-1 focus:ring-primary ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                            }`}
                                    >
                                        <option value="unpaid">UNPAID</option>
                                        <option value="paid">PAID</option>
                                    </select>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{order.total.toFixed(2)}{currencySymbol}</p>
                                <div className="flex justify-end gap-2 mt-2">
                                    {order.status === 'pending' && (
                                        <button onClick={() => updateStatus(order._id, 'preparing')} className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">Brew</button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button onClick={() => updateStatus(order._id, 'ready')} className="bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">Ready</button>
                                    )}
                                    {order.status === 'ready' && (
                                        <button onClick={() => updateStatus(order._id, 'completed')} className="bg-slate-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">Done</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-primary/5">
                        <History className="size-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No orders found matching this status.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
