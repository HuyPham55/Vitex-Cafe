'use client';

import { useState, useEffect } from 'react';
import {
    Search, Filter, History, Coffee, CheckCircle,
    XCircle, Clock, MoreVertical, CreditCard, Loader2, Plus, Edit2, Ticket, UtensilsCrossed
} from 'lucide-react';
import { fetchAPI, endpoints, formatPrice } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import OrderModal from '@/components/OrderModal';
import LunchTag from '@/components/LunchTag';
import QueueBadge from '@/components/QueueBadge';

export default function OrderManagement() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [filterStatus, setFilterStatus] = useState('all');
    const [lunchOnly, setLunchOnly] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<any>(null);

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

    const handleCreateOrder = async (orderData: any) => {
        try {
            await fetchAPI(`${endpoints.orders}/admin`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(orderData)
            });
            getOrders();
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create order');
        }
    };

    const handleUpdateOrderItems = async (orderData: any) => {
        if (!editingOrder) return;
        try {
            await fetchAPI(`${endpoints.orders}/${editingOrder._id}/items`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    items: orderData.items,
                    note: orderData.note,
                    total: orderData.total,
                    customerName: orderData.customerName,
                    isAnonymous: orderData.isAnonymous
                })
            });
            getOrders();
        } catch (error: any) {
            throw new Error(error.message || 'Failed to update order');
        }
    };

    const filteredOrders = orders.filter(o => {
        if (filterStatus !== 'all' && o.status !== filterStatus) return false;
        if (lunchOnly && o.type !== 'lunch') return false;
        return true;
    });

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
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus className="size-4" /> New Order
                    </button>
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
                    <button
                        onClick={() => setLunchOnly(v => !v)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${lunchOnly
                            ? 'bg-amber-100 text-amber-700 border-amber-300 shadow-md shadow-amber-200'
                            : 'bg-white dark:bg-slate-900 text-slate-500 hover:text-amber-700 border-primary/10'
                            }`}
                        title={lunchOnly ? 'Showing lunch orders only' : 'Click to filter to lunch only'}
                    >
                        <UtensilsCrossed className="size-4" /> Lunch
                    </button>
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
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="font-black text-primary text-lg">#{order.orderNumber}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                    {order.type === 'lunch' && (
                                        <>
                                            <LunchTag />
                                            <QueueBadge queueNumber={order.queueNumber} size="sm" />
                                        </>
                                    )}
                                </div>
                                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    {order.customerName}
                                    {order.isAnonymous && (
                                        <span className="text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Anon</span>
                                    )}
                                </p>
                                <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>

                            <div className="md:col-span-1">
                                <div className="space-y-2">
                                    {order.items.map((item: any, i: number) => (
                                        <div key={i} className="text-xs">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.quantity}x {item.name}</span>
                                            {(item.variantOptions || item.selectedVariants || []).length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {(item.variantOptions || item.selectedVariants || []).map((v: any, vi: number) => (
                                                        <span
                                                            key={vi}
                                                            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                        >
                                                            <span className="opacity-70">{v.name}:</span>
                                                            {v.selectedOption || v.option}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {order.note && (
                                        <p className="text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded mt-2 border border-orange-100 dark:border-orange-800">
                                            Note: {order.note}
                                        </p>
                                    )}
                                    {order.discountCode && (
                                        <p className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1.5 rounded mt-2 border border-emerald-100 dark:border-emerald-800 flex items-center gap-1 font-bold">
                                            <Ticket className="size-3 shrink-0" /> Discount Used: {order.discountCode}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center flex-1">Status</p>
                                    <button
                                        onClick={() => setEditingOrder(order)}
                                        className="p-1 px-2 text-primary hover:bg-primary/5 rounded font-bold text-[10px] flex items-center gap-1 transition-all"
                                    >
                                        <Edit2 className="size-3" /> Edit Items
                                    </button>
                                </div>
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
                                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{formatPrice(order.total)}{currencySymbol}</p>
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

            {/* Modals */}
            <OrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateOrder}
                currencySymbol={currencySymbol}
            />

            {editingOrder && (
                <OrderModal
                    isOpen={!!editingOrder}
                    onClose={() => setEditingOrder(null)}
                    onSave={handleUpdateOrderItems}
                    initialData={editingOrder}
                    currencySymbol={currencySymbol}
                />
            )}
        </div>
    );
}
