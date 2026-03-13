'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Edit2, Trash2, Check, X,
    Loader2, Layers, DollarSign, Tag
} from 'lucide-react';
import { fetchAPI, endpoints } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function VariantManagement() {
    const { token } = useAuth();
    const [variants, setVariants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        options: [{ label: '', priceModifier: 0 }]
    });

    const getVariants = async () => {
        try {
            const data = await fetchAPI(endpoints.variants);
            setVariants(data);
        } catch (error) {
            console.error('Failed to fetch variants:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVariants();
    }, []);

    const handleOpenModal = (variant: any = null) => {
        if (variant) {
            setEditingVariant(variant);
            setFormData({
                name: variant.name,
                options: variant.options.map((o: any) => ({ label: o.label, priceModifier: o.priceModifier }))
            });
        } else {
            setEditingVariant(null);
            setFormData({
                name: '',
                options: [{ label: '', priceModifier: 0 }]
            });
        }
        setIsModalOpen(true);
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { label: '', priceModifier: 0 }]
        });
    };

    const removeOption = (index: number) => {
        setFormData({
            ...formData,
            options: formData.options.filter((_, i) => i !== index)
        });
    };

    const updateOption = (index: number, field: string, value: any) => {
        const newOptions = [...formData.options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingVariant
                ? `${endpoints.variants}/${editingVariant._id}`
                : endpoints.variants;
            const method = editingVariant ? 'PUT' : 'POST';

            await fetchAPI(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            setIsModalOpen(false);
            getVariants();
        } catch (error: any) {
            alert(error.message || 'Failed to save variant');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This might affect products using this variant.')) return;
        try {
            await fetchAPI(`${endpoints.variants}/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            getVariants();
        } catch (error: any) {
            alert(error.message || 'Failed to delete variant');
        }
    };

    if (loading && variants.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin size-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Global Variants</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Create options like Size, Ice, or Milk to use across products.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="size-5" /> Create Variant Type
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {variants.map((v) => (
                    <div key={v._id} className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-6 shadow-sm flex flex-col group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                    <Layers className="size-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{v.name}</h3>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(v)} className="p-2 text-slate-400 hover:text-primary"><Edit2 className="size-4" /></button>
                                <button onClick={() => handleDelete(v._id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="size-4" /></button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {v.options.map((opt: any, i: number) => (
                                <div key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-primary/5 rounded-lg flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{opt.label}</span>
                                    {opt.priceModifier > 0 && (
                                        <span className="text-[10px] font-black text-green-600">+$ {opt.priceModifier.toFixed(2)}</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 border-t border-primary/5">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Type: Option List</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-primary/10 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-primary/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                {editingVariant ? 'Edit Variant Type' : 'Create Variant Type'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Variant Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Milk Choice"
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Options</label>
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="text-primary font-bold text-xs flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded"
                                    >
                                        <Plus className="size-3" /> Add Option
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {formData.options.map((opt, i) => (
                                        <div key={i} className="flex gap-3 items-center animate-in fade-in slide-in-from-top-2">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Option Label (e.g. Oat Milk)"
                                                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                    value={opt.label}
                                                    onChange={e => updateOption(i, 'label', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="w-32">
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                                                    <input
                                                        type="number" step="0.01"
                                                        className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl pl-8 pr-3 py-3 text-sm focus:ring-1 focus:ring-primary outline-none font-bold"
                                                        value={opt.priceModifier}
                                                        onChange={e => updateOption(i, 'priceModifier', parseFloat(e.target.value))}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeOption(i)}
                                                className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-white/5 rounded-xl border border-primary/5"
                                                disabled={formData.options.length === 1}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20"
                                >
                                    {editingVariant ? 'Save Changes' : 'Create Variant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
