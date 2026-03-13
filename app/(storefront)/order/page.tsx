'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle, CreditCard, Info, Receipt,
  ArrowRight, Coffee, Loader2, Clock, Check, X
} from 'lucide-react';
import { fetchAPI, endpoints } from '@/lib/api';

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const getData = async () => {
      try {
        const [orderData, settingsData] = await Promise.all([
          fetchAPI(`${endpoints.orders}/${orderId}`),
          fetchAPI(endpoints.settings)
        ]);
        setOrder(orderData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
    const interval = setInterval(async () => {
      try {
        const orderData = await fetchAPI(`${endpoints.orders}/${orderId}`);
        setOrder(orderData);
      } catch (e) { }
    }, 5000); // Poll every 5s for status updates

    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin size-12 text-primary" />
        <p className="mt-4 text-slate-500 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Order not found</h2>
        <p className="text-slate-500 mt-2">We couldn't find the order you're looking for.</p>
        <Link href="/menu" className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-bold">Go to Menu</Link>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Received', desc: 'We have received your order' },
    { key: 'preparing', label: 'Preparing', desc: 'Our baristas are crafting your drink' },
    { key: 'ready', label: 'Ready for Pickup', desc: 'Collect your order at the counter' },
    { key: 'completed', label: 'Completed', desc: 'Order picked up. Enjoy!' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);
  const isCompleted = order.status === 'completed';
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="flex flex-col items-center w-full py-10">
      <div className="w-full max-w-[800px] px-4 md:px-10">

        {/* Success Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`size-20 ${isCancelled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100/50`}>
            {isCancelled ? <X className="size-10" /> : <CheckCircle className="size-10" />}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">
            {isCancelled ? 'Order Cancelled' : isCompleted ? 'Order Completed!' : 'Order Confirmed!'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Thank you, {order.customerName}. Your order <span className="font-bold text-primary">#{order.orderNumber}</span> {isCancelled ? 'was cancelled.' : isCompleted ? 'has been picked up.' : 'is being processed.'}
          </p>
        </div>

        {/* Status Tracker */}
        {!isCancelled && !isCompleted && (
          <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-2xl p-6 md:p-10 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
              <Coffee className="text-primary size-6" /> Live Status
            </h2>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
              <div
                className="absolute left-6 top-0 w-0.5 bg-primary -z-10 transition-all duration-500"
                style={{ height: `${(currentStepIndex / (steps.length - 2)) * 100}%` }}
              ></div>

              <div className="flex flex-col gap-8">
                {steps.slice(0, 3).map((step, index) => {
                  const isActive = order.status === step.key;
                  const isDone = currentStepIndex > index;

                  return (
                    <div key={step.key} className={`flex items-start gap-6 ${!isActive && !isDone ? 'opacity-40' : ''}`}>
                      <div className={`size-12 rounded-full flex items-center justify-center font-bold shadow-md shrink-0 transition-all ${isDone ? 'bg-primary text-white' :
                        isActive ? 'bg-white border-4 border-primary text-primary relative' :
                          'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                        {isDone ? <Check className="size-6" /> : isActive ? (
                          <>
                            <span className="absolute -inset-1 rounded-full border-2 border-primary/30 animate-ping"></span>
                            <div className="size-3 bg-primary rounded-full"></div>
                          </>
                        ) : <div className="size-3 bg-slate-400 rounded-full"></div>}
                      </div>
                      <div className="pt-2">
                        <h3 className={`text-lg font-bold ${isActive ? 'text-primary' : 'text-slate-900 dark:text-slate-100'}`}>{step.label}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Order Summary */}
          <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-primary/10 pb-4">
              <Receipt className="text-primary size-5" /> Order Summary
            </h3>

            <div className="flex flex-col gap-4">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Coffee className="text-primary size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.quantity}x {item.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {(item.variantOptions || item.selectedVariants || []).map((v: any) => v.selectedOption || v.option).join(', ')}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">${(item.subtotal || 0).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-primary/10 flex flex-col gap-2">
              <div className="flex justify-between text-lg font-black text-slate-900 dark:text-slate-100">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 border-b border-primary/10 pb-4">
                <CreditCard className="text-primary size-5" /> Payment Instructions
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {settings?.paymentDescription || order.paymentDescription || 'Please pay at the counter.'}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 flex items-start gap-4">
              <Info className="text-blue-500 size-6 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1 text-sm">Pickup Instructions</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Show your order number <span className="font-bold">#{order.orderNumber}</span> to the barista at the mobile pickup counter.
                </p>
              </div>
            </div>

            <Link href="/" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
              Return to Home <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OrderStatus() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin size-12 text-primary" />
      </div>
    }>
      <OrderStatusContent />
    </Suspense>
  );
}
