'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Save, Coffee } from 'lucide-react';
import { fetchAPI, endpoints, formatPrice } from '@/lib/api';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (orderData: any) => Promise<void>;
    initialData?: any;
    currencySymbol: string;
}

export default function OrderModal({ isOpen, onClose, onSave, initialData, currencySymbol }: OrderModalProps) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [variantTypes, setVariantTypes] = useState<any[]>([]);
    const [customerName, setCustomerName] = useState(initialData?.customerName || '');
    const [note, setNote] = useState(initialData?.note || '');
    const [items, setItems] = useState<any[]>(initialData?.items || []);
    const [isAnonymous, setIsAnonymous] = useState(initialData?.isAnonymous || false);

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (initialData) {
                setCustomerName(initialData.customerName || '');
                setNote(initialData.note || '');
                setItems(initialData.items || []);
                setIsAnonymous(initialData.isAnonymous || false);
            } else {
                // Reset for new order if needed
                setCustomerName('');
                setNote('');
                setItems([]);
                setIsAnonymous(false);
            }
        }
    }, [isOpen, initialData]);

    const fetchData = async () => {
        try {
            const [productData, variantData] = await Promise.all([
                fetchAPI(endpoints.products),
                fetchAPI(endpoints.variants)
            ]);
            setProducts(productData);
            setVariantTypes(variantData);
        } catch (error) {
            console.error('Failed to fetch data for modal:', error);
        }
    };

    const addItem = () => {
        setItems([...items, { product: '', name: '', quantity: 1, price: 0, variantOptions: [], subtotal: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, updates: any) => {
        const newItems = [...items];
        const item = { ...newItems[index], ...updates };

        // If product changed, reset name, price, and variants
        if (updates.product) {
            const product = products.find(p => p._id === updates.product);
            if (product) {
                item.name = product.name;
                item.price = product.price;
                item.variantOptions = []; // Reset variants when product changes
            }
        }

        // Recalculate subtotal
        const variantPrice = (item.variantOptions || []).reduce((acc: number, v: any) => acc + (v.priceModifier || 0), 0);
        item.subtotal = (item.price + variantPrice) * item.quantity;

        newItems[index] = item;
        setItems(newItems);
    };

    const toggleVariant = (itemIndex: number, variantType: any, option: any) => {
        const item = items[itemIndex];
        const currentVariants = item.variantOptions || [];
        const existingIdx = currentVariants.findIndex((v: any) => v.name === variantType.name);

        let newVariants = [...currentVariants];
        if (existingIdx >= 0) {
            if (currentVariants[existingIdx].selectedOption === option.label) {
                // Deselect if same option
                newVariants.splice(existingIdx, 1);
            } else {
                // Update if different option
                newVariants[existingIdx] = {
                    name: variantType.name,
                    selectedOption: option.label,
                    priceModifier: option.priceModifier
                };
            }
        } else {
            // Add new
            newVariants.push({
                name: variantType.name,
                selectedOption: option.label,
                priceModifier: option.priceModifier
            });
        }

        updateItem(itemIndex, { variantOptions: newVariants });
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            alert('Please add at least one item');
            return;
        }
        if (!customerName && !isAnonymous) {
            alert('Please enter a customer name or mark as anonymous');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                customerName: isAnonymous ? 'Anonymous' : customerName,
                items,
                note,
                total: calculateTotal(),
                isAnonymous
            });
            onClose();
        } catch (error: any) {
            alert(error.message || 'Failed to save order');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white/10">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                            {initialData ? 'Edit Order' : 'Create New Order'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">Fill in the details below to {initialData ? 'update' : 'place'} an order.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Customer Name</label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                disabled={isAnonymous}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium disabled:opacity-50"
                                placeholder="Enter customer name..."
                            />
                            <div className="flex items-center gap-2 mt-2 ml-1">
                                <input
                                    type="checkbox"
                                    id="isAnonymous"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isAnonymous" className="text-xs font-bold text-slate-500 cursor-pointer">Mark as Anonymous Order</label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Order Note</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all font-medium h-[100px] resize-none"
                                placeholder="Any special instructions?"
                            />
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                                <Coffee className="size-4 text-primary" /> Order Items
                            </h4>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1.5 text-[10px] font-black bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-all uppercase"
                            >
                                <Plus className="size-3" /> Add Product
                            </button>
                        </div>

                        <div className="space-y-4">
                            {items.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-primary/5 space-y-4 relative group">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(idx)}
                                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-6 space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Select Product</label>
                                            <select
                                                value={item.product}
                                                onChange={(e) => updateItem(idx, { product: e.target.value })}
                                                className="w-full bg-white dark:bg-slate-950 border-none rounded-xl p-2.5 px-4 outline-none focus:ring-1 focus:ring-primary text-sm font-bold shadow-sm"
                                                required
                                            >
                                                <option value="">Choose item...</option>
                                                {products.map(p => (
                                                    <option key={p._id} value={p._id}>{p.name} - {formatPrice(p.price)}{currencySymbol}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-3 space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Quantity</label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => updateItem(idx, { quantity: Math.max(1, item.quantity - 1) })}
                                                    className="size-8 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center font-bold shadow-sm"
                                                >-</button>
                                                <span className="font-black text-slate-900 dark:text-slate-100 w-4 text-center">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateItem(idx, { quantity: item.quantity + 1 })}
                                                    className="size-8 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center font-bold shadow-sm"
                                                >+</button>
                                            </div>
                                        </div>
                                        <div className="md:col-span-3 text-right flex flex-col justify-end">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subtotal</p>
                                            <p className="text-lg font-black text-primary">{formatPrice(item.subtotal)}{currencySymbol}</p>
                                        </div>
                                    </div>

                                    {/* Variant Selection */}
                                    {item.product && products.find(p => p._id === item.product)?.variantTypes?.length > 0 && (
                                        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                                            {products.find(p => p._id === item.product).variantTypes.map((v: any) => {
                                                // Handle both populated and non-populated variantTypes
                                                const vt = typeof v === 'string' ? variantTypes.find(variant => variant._id === v) : v;
                                                if (!vt) return null;
                                                return (
                                                    <div key={vt._id} className="space-y-1.5">
                                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{vt.name}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {vt.options.map((opt: any) => {
                                                                const isSelected = item.variantOptions?.some((v: any) => v.name === vt.name && v.selectedOption === opt.label);
                                                                return (
                                                                    <button
                                                                        key={opt.label}
                                                                        type="button"
                                                                        onClick={() => toggleVariant(idx, vt, opt)}
                                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${isSelected
                                                                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                                                            : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-primary/30'
                                                                            }`}
                                                                    >
                                                                        {opt.label} {opt.priceModifier > 0 && `(+${formatPrice(opt.priceModifier)})`}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {items.length === 0 && (
                                <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                                    <p className="text-slate-400 text-sm font-medium">No items added to this order yet.</p>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="mt-4 text-primary text-xs font-bold hover:underline"
                                    >+ Click to add your first item</button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{formatPrice(calculateTotal())}{currencySymbol}</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 md:px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
                        >Cancel</button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || items.length === 0}
                            className="flex-1 md:px-12 py-3 rounded-xl font-black bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                            {initialData ? 'Update Order' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
