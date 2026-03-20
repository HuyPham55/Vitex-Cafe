'use client';

import { useState, useEffect } from 'react';
import {
    Settings, Clock, CreditCard, Save,
    Loader2, Check, RefreshCw, X, QrCode
} from 'lucide-react';
import { fetchAPI, endpoints, getImageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function StoreSettings() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [existingHeroImages, setExistingHeroImages] = useState<string[]>([]);
    const [newHeroImages, setNewHeroImages] = useState<File[]>([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
    const [existingPaymentQRCode, setExistingPaymentQRCode] = useState<string | null>(null);
    const [newPaymentQRCode, setNewPaymentQRCode] = useState<File | null>(null);
    const [removePaymentQRCode, setRemovePaymentQRCode] = useState(false);

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
            setExistingHeroImages(data.heroImages || []);
            setExistingGalleryImages(data.galleryImages || []);
            setExistingPaymentQRCode(data.paymentQRCode || null);
            setRemovePaymentQRCode(false);
            setNewPaymentQRCode(null);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSettings();
    }, []);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewHeroImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeExistingPhoto = (index: number) => {
        setExistingHeroImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewPhoto = (index: number) => {
        setNewHeroImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleGalleryPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewGalleryImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeExistingGalleryPhoto = (index: number) => {
        setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewGalleryPhoto = (index: number) => {
        setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            const formDataObj = new FormData();
            formDataObj.append('openTime', formData.openTime);
            formDataObj.append('closeTime', formData.closeTime);
            formDataObj.append('paymentDescription', formData.paymentDescription);

            existingHeroImages.forEach(img => formDataObj.append('existingHeroImages', img));
            newHeroImages.forEach(file => formDataObj.append('newHeroImages', file));

            existingGalleryImages.forEach(img => formDataObj.append('existingGalleryImages', img));
            newGalleryImages.forEach(file => formDataObj.append('newGalleryImages', file));

            if (newPaymentQRCode) {
                formDataObj.append('paymentQRCode', newPaymentQRCode);
            } else if (removePaymentQRCode) {
                formDataObj.append('removePaymentQRCode', 'true');
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoints.settings}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formDataObj
            });

            if (!res.ok) throw new Error('Failed to save settings');

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            // Reload settings to refresh images
            getSettings();
            setNewHeroImages([]);
            setNewGalleryImages([]);

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

                {/* Hero Slider settings */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                            <span className="font-bold text-center w-5 h-5 flex items-center justify-center">🖼️</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Hero Slider Images</h3>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                        {existingHeroImages.map((photo, i) => (
                            <div key={`exist-${i}`} className="relative h-24 w-32 rounded-lg overflow-hidden border border-primary/20">
                                <img
                                    src={getImageUrl(photo)}
                                    alt="Hero Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingPhoto(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <span style={{ fontSize: '10px', padding: '0 4px' }}>x</span>
                                </button>
                            </div>
                        ))}
                        {newHeroImages.map((photo, i) => (
                            <div key={`new-${i}`} className="relative h-24 w-32 rounded-lg overflow-hidden border border-primary/20">
                                <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeNewPhoto(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <span style={{ fontSize: '10px', padding: '0 4px' }}>x</span>
                                </button>
                            </div>
                        ))}
                        <label className="h-24 w-32 border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center text-primary/50 cursor-pointer hover:bg-primary/5 transition-colors">
                            <span className="font-bold text-xl">+</span>
                            <span className="text-[10px] uppercase font-bold mt-1">Add Image</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </label>
                    </div>
                </div>

                {/* Cafe Gallery settings */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-lg">
                            <span className="font-bold text-center w-5 h-5 flex items-center justify-center">📷</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Cafe Gallery Images</h3>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                        {existingGalleryImages.map((photo, i) => (
                            <div key={`gal-exist-${i}`} className="relative h-24 w-32 rounded-lg overflow-hidden border border-primary/20">
                                <img
                                    src={getImageUrl(photo)}
                                    alt="Gallery Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingGalleryPhoto(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <span style={{ fontSize: '10px', padding: '0 4px' }}>x</span>
                                </button>
                            </div>
                        ))}
                        {newGalleryImages.map((photo, i) => (
                            <div key={`gal-new-${i}`} className="relative h-24 w-32 rounded-lg overflow-hidden border border-primary/20">
                                <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeNewGalleryPhoto(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <span style={{ fontSize: '10px', padding: '0 4px' }}>x</span>
                                </button>
                            </div>
                        ))}
                        <label className="h-24 w-32 border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center text-primary/50 cursor-pointer hover:bg-primary/5 transition-colors">
                            <span className="font-bold text-xl">+</span>
                            <span className="text-[10px] uppercase font-bold mt-1">Add Image</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryPhotoChange} />
                        </label>
                    </div>
                </div>

                {/* Payment QR Code settings */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <span className="font-bold text-center w-5 h-5 flex items-center justify-center">💳</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Payment QR Code</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        {(existingPaymentQRCode && !removePaymentQRCode) ? (
                            <div className="relative h-48 w-48 rounded-xl overflow-hidden border border-primary/20 shadow-md">
                                <img
                                    src={getImageUrl(existingPaymentQRCode)}
                                    alt="Payment QR Code"
                                    className="w-full h-full object-contain bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setRemovePaymentQRCode(true)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ) : newPaymentQRCode ? (
                            <div className="relative h-48 w-48 rounded-xl overflow-hidden border border-primary/20 shadow-md">
                                <img
                                    src={URL.createObjectURL(newPaymentQRCode)}
                                    alt="Preview Payment QR Code"
                                    className="w-full h-full object-contain bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setNewPaymentQRCode(null)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="h-48 w-48 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center text-primary/50 cursor-pointer hover:bg-primary/5 transition-all group">
                                <span className="font-bold text-3xl group-hover:scale-110 transition-transform">+</span>
                                <span className="text-xs uppercase font-bold mt-2">Upload QR Code</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setNewPaymentQRCode(e.target.files[0]);
                                            setRemovePaymentQRCode(false);
                                        }
                                    }}
                                />
                            </label>
                        )}
                        <p className="text-xs text-slate-400 italic">This image will be displayed on the order confirmation screen for customers to scan.</p>
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
