'use client';

import { useState, useEffect } from 'react';
import {
    Settings, Clock, CreditCard, Save,
    Loader2, Check, RefreshCw
} from 'lucide-react';
import { fetchAPI, endpoints } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function StoreSettings() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        openTime: '08:00',
        closeTime: '22:00',
        paymentDescription: '',
        currencySymbol: '$'
    });

    const getSettings = async () => {
        try {
            const data = await fetchAPI(endpoints.settings);
            setFormData({
                openTime: data.openTime || '08:00',
                closeTime: data.closeTime || '22:00',
                paymentDescription: data.paymentDescription || '',
                currencySymbol: data.currencySymbol || '$'
            });
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            await fetchAPI(endpoints.settings, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error: any) {
            alert(error.message || 'Failed to save settings');
        } finally {
            setSaving(false);
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
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Store Settings</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Configure store hours and payment information.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Trading Hours */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Clock className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Trading Hours</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Opening Time</label>
                            <input
                                type="time"
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                value={formData.openTime}
                                onChange={e => setFormData({ ...formData, openTime: e.target.value })}
                                required
                            />
                            <p className="text-[10px] text-slate-400 mt-2">When the store starts receiving orders</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Closing Time</label>
                            <input
                                type="time"
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                value={formData.closeTime}
                                onChange={e => setFormData({ ...formData, closeTime: e.target.value })}
                                required
                            />
                            <p className="text-[10px] text-slate-400 mt-2">When ordering is disabled for customers</p>
                        </div>
                    </div>
                </div>

                {/* Payment Confirmation */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <CreditCard className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Payment Information</h3>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Description</label>
                        <textarea
                            rows={5}
                            placeholder="e.g. Please transfer to account 123-456-789 (VCB) or pay cash at counter."
                            className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all resize-none leading-relaxed"
                            value={formData.paymentDescription}
                            onChange={e => setFormData({ ...formData, paymentDescription: e.target.value })}
                            required
                        ></textarea>
                        <p className="text-xs text-slate-400 mt-2 italic">This description will be shown to customers after they place an order.</p>
                    </div>
                </div>

                {/* Regional Settings */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                            <Settings className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Regional Settings</h3>
                    </div>

                    <div className="max-w-xs">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency Symbol</label>
                        <input
                            type="text"
                            placeholder="e.g. ₫, $, €"
                            className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all font-bold text-center text-xl"
                            value={formData.currencySymbol}
                            onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                            required
                        />
                        <p className="text-[10px] text-slate-400 mt-2">Display symbol for all product prices.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4 items-center">
                    {success && (
                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in fade-in slide-in-from-right-4">
                            <Check className="size-4" /> Settings saved successfully!
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="animate-spin size-5" /> : <Save className="size-5" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
