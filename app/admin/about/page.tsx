'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Save, Loader2, Check, X, Users, Leaf, Coffee } from 'lucide-react';
import { fetchAPI, endpoints, getImageUrl } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AboutPageEditor() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        aboutHeroTitle: '',
        aboutHeroSubtitle: '',
        aboutOriginTitle: '',
        aboutOriginParagraph1: '',
        aboutOriginParagraph2: '',
        aboutFounder1Name: '',
        aboutFounder1Role: '',
        aboutFounder1Bio: '',
        aboutFounder2Name: '',
        aboutFounder2Role: '',
        aboutFounder2Bio: '',
        aboutQualityTitle: '',
        aboutQualityContent: '',
        aboutMissionStatement: '',
    });

    // Image states
    const [existingHeroImage, setExistingHeroImage] = useState<string | null>(null);
    const [newHeroImage, setNewHeroImage] = useState<File | null>(null);
    const [removeHeroImage, setRemoveHeroImage] = useState(false);

    const [existingFounder1Photo, setExistingFounder1Photo] = useState<string | null>(null);
    const [newFounder1Photo, setNewFounder1Photo] = useState<File | null>(null);
    const [removeFounder1Photo, setRemoveFounder1Photo] = useState(false);

    const [existingFounder2Photo, setExistingFounder2Photo] = useState<string | null>(null);
    const [newFounder2Photo, setNewFounder2Photo] = useState<File | null>(null);
    const [removeFounder2Photo, setRemoveFounder2Photo] = useState(false);

    const [existingQualityImage, setExistingQualityImage] = useState<string | null>(null);
    const [newQualityImage, setNewQualityImage] = useState<File | null>(null);
    const [removeQualityImage, setRemoveQualityImage] = useState(false);

    const loadSettings = async () => {
        try {
            const data = await fetchAPI(endpoints.settings);
            setFormData({
                aboutHeroTitle: data.aboutHeroTitle || '',
                aboutHeroSubtitle: data.aboutHeroSubtitle || '',
                aboutOriginTitle: data.aboutOriginTitle || '',
                aboutOriginParagraph1: data.aboutOriginParagraph1 || '',
                aboutOriginParagraph2: data.aboutOriginParagraph2 || '',
                aboutFounder1Name: data.aboutFounder1Name || '',
                aboutFounder1Role: data.aboutFounder1Role || '',
                aboutFounder1Bio: data.aboutFounder1Bio || '',
                aboutFounder2Name: data.aboutFounder2Name || '',
                aboutFounder2Role: data.aboutFounder2Role || '',
                aboutFounder2Bio: data.aboutFounder2Bio || '',
                aboutQualityTitle: data.aboutQualityTitle || '',
                aboutQualityContent: data.aboutQualityContent || '',
                aboutMissionStatement: data.aboutMissionStatement || '',
            });
            setExistingHeroImage(data.aboutHeroImage || null);
            setExistingFounder1Photo(data.aboutFounder1Photo || null);
            setExistingFounder2Photo(data.aboutFounder2Photo || null);
            setExistingQualityImage(data.aboutQualityImage || null);
            setRemoveHeroImage(false);
            setRemoveFounder1Photo(false);
            setRemoveFounder2Photo(false);
            setRemoveQualityImage(false);
            setNewHeroImage(null);
            setNewFounder1Photo(null);
            setNewFounder2Photo(null);
            setNewQualityImage(null);
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            const fd = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                fd.append(key, value);
            });

            if (newHeroImage) {
                fd.append('aboutHeroImage', newHeroImage);
            } else if (removeHeroImage) {
                fd.append('removeAboutHeroImage', 'true');
            }

            if (newFounder1Photo) {
                fd.append('aboutFounder1Photo', newFounder1Photo);
            } else if (removeFounder1Photo) {
                fd.append('removeAboutFounder1Photo', 'true');
            }

            if (newFounder2Photo) {
                fd.append('aboutFounder2Photo', newFounder2Photo);
            } else if (removeFounder2Photo) {
                fd.append('removeAboutFounder2Photo', 'true');
            }

            if (newQualityImage) {
                fd.append('aboutQualityImage', newQualityImage);
            } else if (removeQualityImage) {
                fd.append('removeAboutQualityImage', 'true');
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoints.settings}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });

            if (!res.ok) throw new Error('Failed to save');

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            loadSettings();
        } catch (error: any) {
            alert(error.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const ImageUploader = ({
        label,
        existing,
        newFile,
        removed,
        onNew,
        onRemoveExisting,
        onRemoveNew,
        aspectClass = 'h-48 w-full max-w-sm',
        rounded = false,
    }: {
        label: string;
        existing: string | null;
        newFile: File | null;
        removed: boolean;
        onNew: (f: File) => void;
        onRemoveExisting: () => void;
        onRemoveNew: () => void;
        aspectClass?: string;
        rounded?: boolean;
    }) => {
        const roundedClass = rounded ? 'rounded-full' : 'rounded-xl';
        const preview = newFile ? URL.createObjectURL(newFile) : (existing && !removed ? getImageUrl(existing) : null);

        return (
            <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                {preview ? (
                    <div className={`relative ${aspectClass} ${roundedClass} overflow-hidden border border-primary/20 shadow-sm bg-slate-50 dark:bg-slate-800`}>
                        <img src={preview} alt={label} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={newFile ? onRemoveNew : onRemoveExisting}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                ) : (
                    <label className={`${aspectClass} ${roundedClass} border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary/50 cursor-pointer hover:bg-primary/5 transition-all group`}>
                        <span className="font-bold text-2xl group-hover:scale-110 transition-transform">+</span>
                        <span className="text-[10px] uppercase font-bold mt-1">Upload Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) onNew(e.target.files[0]);
                            }}
                        />
                    </label>
                )}
            </div>
        );
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
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">About Us Page</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Edit the content displayed on the public About Us page.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Section */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <BookOpen className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Hero Section</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Headline</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                value={formData.aboutHeroTitle}
                                onChange={e => setFormData({ ...formData, aboutHeroTitle: e.target.value })}
                                placeholder="The soul of the daily grind."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subheadline</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all"
                                value={formData.aboutHeroSubtitle}
                                onChange={e => setFormData({ ...formData, aboutHeroSubtitle: e.target.value })}
                                placeholder="Crafting moments of clarity since 2012."
                            />
                        </div>
                        <ImageUploader
                            label="Hero Image"
                            existing={existingHeroImage}
                            newFile={newHeroImage}
                            removed={removeHeroImage}
                            onNew={(f) => { setNewHeroImage(f); setRemoveHeroImage(false); }}
                            onRemoveExisting={() => setRemoveHeroImage(true)}
                            onRemoveNew={() => setNewHeroImage(null)}
                            aspectClass="h-56 w-full max-w-sm"
                        />
                    </div>
                </div>

                {/* Origin Story */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                            <BookOpen className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Origin Story</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Section Title</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                value={formData.aboutOriginTitle}
                                onChange={e => setFormData({ ...formData, aboutOriginTitle: e.target.value })}
                                placeholder="Our Origin Story"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">First Paragraph</label>
                            <textarea
                                rows={4}
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all resize-y leading-relaxed"
                                value={formData.aboutOriginParagraph1}
                                onChange={e => setFormData({ ...formData, aboutOriginParagraph1: e.target.value })}
                                placeholder="The opening paragraph about your origin..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Second Paragraph</label>
                            <textarea
                                rows={4}
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all resize-y leading-relaxed"
                                value={formData.aboutOriginParagraph2}
                                onChange={e => setFormData({ ...formData, aboutOriginParagraph2: e.target.value })}
                                placeholder="The second paragraph expanding on your story..."
                            />
                        </div>
                    </div>
                </div>

                {/* Founders */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <Users className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Founders</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Founder 1 */}
                        <div className="space-y-4 border border-primary/5 rounded-xl p-6">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Founder 1</p>
                            <ImageUploader
                                label="Photo"
                                existing={existingFounder1Photo}
                                newFile={newFounder1Photo}
                                removed={removeFounder1Photo}
                                onNew={(f) => { setNewFounder1Photo(f); setRemoveFounder1Photo(false); }}
                                onRemoveExisting={() => setRemoveFounder1Photo(true)}
                                onRemoveNew={() => setNewFounder1Photo(null)}
                                aspectClass="h-32 w-32"
                                rounded
                            />
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                    value={formData.aboutFounder1Name}
                                    onChange={e => setFormData({ ...formData, aboutFounder1Name: e.target.value })}
                                    placeholder="e.g. Alex"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role / Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all"
                                    value={formData.aboutFounder1Role}
                                    onChange={e => setFormData({ ...formData, aboutFounder1Role: e.target.value })}
                                    placeholder="e.g. Master Roaster"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all resize-y leading-relaxed"
                                    value={formData.aboutFounder1Bio}
                                    onChange={e => setFormData({ ...formData, aboutFounder1Bio: e.target.value })}
                                    placeholder="Short biography..."
                                />
                            </div>
                        </div>
                        {/* Founder 2 */}
                        <div className="space-y-4 border border-primary/5 rounded-xl p-6">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Founder 2</p>
                            <ImageUploader
                                label="Photo"
                                existing={existingFounder2Photo}
                                newFile={newFounder2Photo}
                                removed={removeFounder2Photo}
                                onNew={(f) => { setNewFounder2Photo(f); setRemoveFounder2Photo(false); }}
                                onRemoveExisting={() => setRemoveFounder2Photo(true)}
                                onRemoveNew={() => setNewFounder2Photo(null)}
                                aspectClass="h-32 w-32"
                                rounded
                            />
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                    value={formData.aboutFounder2Name}
                                    onChange={e => setFormData({ ...formData, aboutFounder2Name: e.target.value })}
                                    placeholder="e.g. Jordan"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role / Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all"
                                    value={formData.aboutFounder2Role}
                                    onChange={e => setFormData({ ...formData, aboutFounder2Role: e.target.value })}
                                    placeholder="e.g. Director of Sourcing"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all resize-y leading-relaxed"
                                    value={formData.aboutFounder2Bio}
                                    onChange={e => setFormData({ ...formData, aboutFounder2Bio: e.target.value })}
                                    placeholder="Short biography..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quality Section */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                            <Leaf className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quality Section</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Section Title</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                value={formData.aboutQualityTitle}
                                onChange={e => setFormData({ ...formData, aboutQualityTitle: e.target.value })}
                                placeholder="Uncompromising Quality"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Content</label>
                            <textarea
                                rows={4}
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all resize-y leading-relaxed"
                                value={formData.aboutQualityContent}
                                onChange={e => setFormData({ ...formData, aboutQualityContent: e.target.value })}
                                placeholder="Describe your quality standards..."
                            />
                        </div>
                        <ImageUploader
                            label="Quality Section Image"
                            existing={existingQualityImage}
                            newFile={newQualityImage}
                            removed={removeQualityImage}
                            onNew={(f) => { setNewQualityImage(f); setRemoveQualityImage(false); }}
                            onRemoveExisting={() => setRemoveQualityImage(true)}
                            onRemoveNew={() => setNewQualityImage(null)}
                            aspectClass="h-48 w-full max-w-sm"
                        />
                    </div>
                </div>

                {/* Mission Statement */}
                <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                            <Coffee className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Mission Statement</h3>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mission Quote</label>
                        <textarea
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all resize-y leading-relaxed"
                            value={formData.aboutMissionStatement}
                            onChange={e => setFormData({ ...formData, aboutMissionStatement: e.target.value })}
                            placeholder='To transform your daily ritual into a moment of mindful appreciation...'
                        />
                        <p className="text-xs text-slate-400 mt-2 italic">This will be displayed as a large italic quote on the About Us page.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4 items-center">
                    {success && (
                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in fade-in slide-in-from-right-4">
                            <Check className="size-4" /> About page saved successfully!
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
