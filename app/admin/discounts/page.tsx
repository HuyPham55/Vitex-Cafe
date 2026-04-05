'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Rocket, Filter, ArrowUpDown, Trash2, Edit2, CheckCircle2, Ticket, Coffee, DollarSign, Percent } from 'lucide-react';
import { fetchAPI, endpoints } from '@/lib/api';

export default function AdminDiscounts() {
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('percent'); // 'percent' or 'amount'
    const [value, setValue] = useState(0);
    const [quantity, setQuantity] = useState<number | string>('');
    const [expiresAt, setExpiresAt] = useState('');
    const [applyToAll, setApplyToAll] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [discountsData, productsData] = await Promise.all([
                fetchAPI(endpoints.discounts),
                fetchAPI(endpoints.products)
            ]);
            setDiscounts(discountsData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductSelect = (productId: string) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setCode('');
        setDiscountType('percent');
        setValue(0);
        setQuantity('');
        setExpiresAt('');
        setApplyToAll(true);
        setSelectedProducts([]);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (d: any) => {
        setEditingId(d._id);
        setCode(d.code);
        setDiscountType(d.discountType);
        setValue(d.value);
        setQuantity(d.quantity || '');
        setExpiresAt(d.expiresAt ? new Date(d.expiresAt).toISOString().split('T')[0] : '');
        setApplyToAll(d.applicableProducts.length === 0);
        setSelectedProducts(d.applicableProducts.map((p: any) => p._id));
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const payload = {
                code,
                discountType,
                value,
                quantity: quantity === '' ? null : Number(quantity),
                expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
                applicableProducts: applyToAll ? [] : selectedProducts,
                isActive: true
            };

            if (editingId) {
                await fetchAPI(`${endpoints.discounts}/${editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
            } else {
                await fetchAPI(endpoints.discounts, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
            }

            await fetchData();
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            alert(error.message || 'Action failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await fetchAPI(`${endpoints.discounts}/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ isActive: !currentStatus })
            });
            fetchData();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const totalRedemptions = discounts.reduce((acc, curr) => acc + (curr.usedCount || 0), 0);
    const activeDiscountsCount = discounts.filter(d => d.isActive).length;

    return (
        <div className="max-w-[1200px] w-full mx-auto space-y-8">
            {/* Bento Grid Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-primary text-white p-8 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
                    <div className="z-10">
                        <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Active Discounts</h1>
                        <p className="opacity-90 max-w-md">Manage seasonal campaigns and promotional offers for the boutique roastery experience.</p>
                    </div>
                    <div className="mt-8 flex gap-4 z-10">
                        <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl">
                            <span className="block text-3xl font-black">{activeDiscountsCount}</span>
                            <span className="text-xs uppercase font-bold opacity-80">Active Codes</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl">
                            <span className="block text-3xl font-black">{totalRedemptions}</span>
                            <span className="text-xs uppercase font-bold opacity-80">Redemptions</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-background-dark/50 p-8 rounded-2xl shadow-sm border border-primary/10 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Ticket className="text-primary size-8" />
                    </div>
                    <h3 className="font-black text-xl mb-2 text-slate-900 dark:text-slate-100">New Promotion?</h3>
                    <p className="text-sm text-slate-500 mb-6 px-4">Create a limited-time offer to boost your morning sales.</p>
                    <button 
                        onClick={openCreateModal}
                        className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-primary hover:text-white transition-colors"
                    >
                        Launch Code
                    </button>
                </div>
            </div>

            {/* Listing Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-widest text-primary">Live Campaigns</h2>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-slate-500 animate-pulse bg-white dark:bg-background-dark/50 rounded-2xl">
                        Loading discounts...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {discounts.map(d => (
                            <div key={d._id} className={`bg-white dark:bg-background-dark/50 p-6 rounded-2xl shadow-sm border border-primary/10 flex flex-col sm:flex-row gap-6 transition-all ${!d.isActive ? 'opacity-60 grayscale-[50%]' : ''}`}>
                                <div className="flex-shrink-0 w-24 h-24 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex flex-col items-center justify-center border border-orange-100 dark:border-orange-900/30">
                                    <span className="text-2xl font-black text-primary">
                                        {d.discountType === 'percent' ? `${d.value}%` : `$${d.value}`}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase text-slate-400">
                                        {d.discountType === 'percent' ? 'OFF' : 'FIXED'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">{d.code}</h3>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${d.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {d.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 mb-4">
                                        Applies to: <span className="text-slate-900 dark:text-slate-300">
                                            {d.applicableProducts && d.applicableProducts.length > 0 
                                                ? d.applicableProducts.map((p:any) => p.name).join(', ') 
                                                : 'Whole Menu'}
                                        </span>
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-primary/10">
                                        <div>
                                            <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Usage</span>
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                {d.usedCount} {d.quantity ? `/ ${d.quantity}` : '/ Unlimited'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Expires</span>
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : 'Never'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-primary/10">
                                        <button 
                                            onClick={() => openEditModal(d)}
                                            className="flex-1 py-2 text-xs font-bold uppercase tracking-widest border-2 border-primary/20 text-primary rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1"
                                        >
                                            <Edit2 className="size-3" /> Edit
                                        </button>
                                        <button 
                                            onClick={() => toggleActive(d._id, d.isActive)}
                                            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                                        >
                                            {d.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Side Panel / Modal for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
                    <div className="w-full md:w-[480px] bg-white dark:bg-background-dark h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                                    {editingId ? 'Edit Discount' : 'Create Discount'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
                                    <X className="size-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto pr-2 pb-20 no-scrollbar">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Discount Code Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={code}
                                        onChange={e => setCode(e.target.value.toUpperCase())}
                                        className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-6 text-slate-900 dark:text-slate-100 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase" 
                                        placeholder="e.g. ROASTERY25" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Discount Type & Value</label>
                                    <div className="flex gap-2 mb-3 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl">
                                        <button 
                                            type="button" 
                                            onClick={() => setDiscountType('percent')}
                                            className={`flex-1 py-3 font-bold text-sm rounded-lg flex items-center justify-center gap-2 ${discountType === 'percent' ? 'bg-white shadow-sm border border-primary/10 text-primary' : 'text-slate-500'}`}
                                        >
                                            <Percent className="size-4" /> Percentage
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setDiscountType('amount')}
                                            className={`flex-1 py-3 font-bold text-sm rounded-lg flex items-center justify-center gap-2 ${discountType === 'amount' ? 'bg-white shadow-sm border border-primary/10 text-primary' : 'text-slate-500'}`}
                                        >
                                            <DollarSign className="size-4" /> Fixed Amount
                                        </button>
                                    </div>
                                    <input 
                                        type="number" 
                                        required
                                        min="0"
                                        step={discountType === 'percent' ? '1' : '0.01'}
                                        max={discountType === 'percent' ? '100' : undefined}
                                        value={value || ''}
                                        onChange={e => setValue(Number(e.target.value))}
                                        className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-6 text-slate-900 dark:text-slate-100 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                                        placeholder={`Enter ${discountType === 'percent' ? 'percentage (e.g. 20)' : 'amount (e.g. 2.50)'}`} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Apply To</label>
                                    <div className="space-y-2 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
                                        <label className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors">
                                            <input 
                                                type="checkbox" 
                                                checked={applyToAll}
                                                onChange={e => {
                                                    setApplyToAll(e.target.checked);
                                                    if(e.target.checked) setSelectedProducts([]);
                                                }}
                                                className="w-5 h-5 rounded text-primary focus:ring-primary"
                                            />
                                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Entire Menu</span>
                                        </label>
                                        
                                        {!applyToAll && (
                                            <div className="pl-8 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 max-h-48 overflow-y-auto no-scrollbar">
                                                {products.map(p => (
                                                    <label key={p._id} className="flex items-center gap-3 py-2 cursor-pointer group">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedProducts.includes(p._id)}
                                                            onChange={() => handleProductSelect(p._id)}
                                                            className="w-4 h-4 rounded text-primary focus:ring-primary"
                                                        />
                                                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors cursor-pointer">{p.name} - {p.category}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Usage Limit</label>
                                        <input 
                                            type="number" 
                                            min="1"
                                            value={quantity}
                                            onChange={e => setQuantity(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-4 text-slate-900 dark:text-slate-100 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                                            placeholder="Unlimited" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Expiry Date</label>
                                        <input 
                                            type="date"
                                            value={expiresAt}
                                            onChange={e => setExpiresAt(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-4 text-slate-900 dark:text-slate-100 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Campaign'}
                                        <Rocket className="size-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
