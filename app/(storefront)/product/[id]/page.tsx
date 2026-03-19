'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Coffee, Droplets, Snowflake, Cuboid, User,
    FileEdit, ShoppingCart, Star, MessageSquare, Camera,
    Plus, Minus, Check, Loader2, Image as ImageIcon, X
} from 'lucide-react';
import { fetchAPI, endpoints, getImageUrl, formatPrice } from '@/lib/api';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, any>>({});
    const [customerName, setCustomerName] = useState('');
    const [note, setNote] = useState('');

    // Review form state
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '', customerName: '' });
    const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const [prodData, reviewsData, settings] = await Promise.all([
                    fetchAPI(`${endpoints.products}/${id}`),
                    fetchAPI(`${endpoints.reviews}/${id}`),
                    fetchAPI(endpoints.settings)
                ]);
                setProduct(prodData);
                setReviews(reviewsData);
                setCurrencySymbol(settings.currencySymbol || '$');

                // Initialize default variants
                const defaults: Record<string, any> = {};
                prodData.variantTypes?.forEach((vt: any) => {
                    if (vt.options?.length > 0) {
                        defaults[vt.name] = vt.options[0];
                    }
                });
                setSelectedVariants(defaults);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [id]);

    const handleVariantChange = (vtName: string, option: any) => {
        setSelectedVariants(prev => ({ ...prev, [vtName]: option }));
    };

    const totalPrice = product
        ? (product.price + Object.values(selectedVariants).reduce((acc, curr) => acc + curr.priceModifier, 0)) * quantity
        : 0;

    const handleOrder = async () => {
        if (!customerName.trim()) {
            alert('Please enter your name');
            return;
        }

        setIsSubmittingOrder(true);
        try {
            const itemPrice = product.price + Object.values(selectedVariants).reduce((acc, curr) => acc + (curr as any).priceModifier, 0);
            const orderData = {
                customerName,
                items: [{
                    product: product._id,
                    name: product.name,
                    variantOptions: Object.entries(selectedVariants).map(([name, opt]: [string, any]) => ({
                        name,
                        selectedOption: opt.label,
                        priceModifier: opt.priceModifier
                    })),
                    quantity,
                    price: itemPrice,
                    subtotal: itemPrice * quantity
                }],
                note,
                total: totalPrice
            };

            const result = await fetchAPI(endpoints.orders, {
                method: 'POST',
                body: JSON.stringify(orderData)
            });

            router.push(`/order?id=${result._id}`);
        } catch (error: any) {
            alert(error.message || 'Failed to place order');
        } finally {
            setIsSubmittingOrder(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removePhoto = (index: number) => {
        setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.customerName.trim()) {
            alert('Please enter your name');
            return;
        }

        setIsSubmittingReview(true);
        try {
            const formData = new FormData();
            formData.append('productId', id);
            formData.append('customerName', newReview.customerName);
            formData.append('rating', newReview.rating.toString());
            formData.append('comment', newReview.comment);
            selectedPhotos.forEach(photo => {
                formData.append('photos', photo);
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoints.reviews}`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Failed to post review');

            const savedReview = await res.json();
            setReviews(prev => [savedReview, ...prev]);
            setIsReviewOpen(false);
            setNewReview({ rating: 5, comment: '', customerName: '' });
            setSelectedPhotos([]);
        } catch (error: any) {
            alert(error.message || 'Failed to post review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin size-12 text-primary" />
                <p className="mt-4 text-slate-500 font-medium tracking-wide">Brewing the details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Product not found</h2>
                <Link href="/menu" className="mt-4 text-primary font-bold">Back to Menu</Link>
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 'New';

    return (
        <div className="flex flex-col items-center w-full py-6">
            <div className="w-full max-w-[1200px] px-4 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Product Image & Info */}
                    <div className="flex flex-col gap-6">
                        <div
                            className="w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-cover bg-center rounded-2xl shadow-sm border border-primary/5"
                            style={{ backgroundImage: `url("${getImageUrl(product.imageUrl)}")` }}
                        >
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-black tracking-tight">{product.name}</h1>
                                <p className="text-primary text-2xl font-bold">{formatPrice(product.price)}{currencySymbol}</p>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Reviews Summary */}
                        <div className="flex items-center gap-4 bg-white dark:bg-background-dark border border-primary/10 p-4 rounded-xl">
                            <div className="flex items-center gap-1 text-primary">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`size-5 ${s <= Number(averageRating) ? 'fill-current' : 'opacity-30'}`} />
                                ))}
                            </div>
                            <p className="text-slate-900 dark:text-slate-100 font-bold">
                                {averageRating} <span className="text-slate-500 dark:text-slate-400 font-normal text-sm">({reviews.length} reviews)</span>
                            </p>
                        </div>
                    </div>

                    {/* Customization Form */}
                    <div className="flex flex-col gap-8 bg-white dark:bg-background-dark/50 border border-primary/10 p-6 md:p-8 rounded-2xl shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-b border-primary/10 pb-4">Customize Your Drink</h2>

                        {product.variantTypes?.map((vt: any) => (
                            <div key={vt._id} className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
                                    {vt.name === 'Size' ? <Coffee className="size-5 text-primary" /> : <Droplets className="size-5 text-primary" />}
                                    {vt.name}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {vt.options.map((option: any) => (
                                        <label key={option.label} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name={vt.name}
                                                className="peer sr-only"
                                                checked={selectedVariants[vt.name]?.label === option.label}
                                                onChange={() => handleVariantChange(vt.name, option)}
                                            />
                                            <div className="text-center py-3 px-2 rounded-xl border border-primary/20 text-slate-600 dark:text-slate-400 font-medium peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all text-sm">
                                                {option.label} {option.priceModifier > 0 && <span className="text-[10px] opacity-80 block">+{formatPrice(option.priceModifier)}{currencySymbol}</span>}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Name & Notes */}
                        <div className="flex flex-col gap-4 border-t border-primary/10 pt-6">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5" />
                                <input
                                    type="text"
                                    placeholder="Name for the order"
                                    className="w-full bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-slate-700 dark:text-slate-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <FileEdit className="absolute left-4 top-4 text-primary size-5" />
                                <textarea
                                    placeholder="Special instructions (optional)"
                                    rows={2}
                                    className="w-full bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-slate-700 dark:text-slate-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex items-center justify-between bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl px-4 py-2 w-32">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-primary font-bold text-xl hover:text-primary/70"
                                >-</button>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-primary font-bold text-xl hover:text-primary/70"
                                >+</button>
                            </div>
                            <button
                                onClick={handleOrder}
                                disabled={isSubmittingOrder || !product.inStock}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-xl p-4 font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {isSubmittingOrder ? <Loader2 className="animate-spin size-5" /> : <ShoppingCart className="size-5" />}
                                {product.inStock ? `Add to Order - ${formatPrice(totalPrice)}${currencySymbol}` : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 border-t border-primary/10 pt-10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                            <MessageSquare className="text-primary size-6" />
                            Customer Reviews
                        </h3>
                        <button
                            onClick={() => setIsReviewOpen(!isReviewOpen)}
                            className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                            <Camera className="size-4" /> {isReviewOpen ? 'Cancel Review' : 'Add Review'}
                        </button>
                    </div>

                    {isReviewOpen && (
                        <form onSubmit={submitReview} className="mb-10 bg-primary/5 border border-primary/20 p-6 rounded-2xl gap-4 flex flex-col">
                            <div className="flex items-center gap-4">
                                <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Rate it:</p>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setNewReview(prev => ({ ...prev, rating: s }))}
                                        >
                                            <Star className={`size-6 ${s <= newReview.rating ? 'text-primary fill-current' : 'text-slate-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="bg-white dark:bg-background-dark border border-primary/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-primary w-full max-w-sm"
                                value={newReview.customerName}
                                onChange={e => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                                required
                            />
                            <textarea
                                placeholder="Share your thoughts..."
                                rows={3}
                                className="bg-white dark:bg-background-dark border border-primary/10 p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none"
                                value={newReview.comment}
                                onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            ></textarea>

                            <div className="flex flex-wrap gap-2">
                                {selectedPhotos.map((photo, i) => (
                                    <div key={i} className="relative size-20 rounded-lg overflow-hidden border border-primary/20">
                                        <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="size-20 border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center text-primary/50 cursor-pointer hover:bg-primary/5 transition-colors">
                                    <Camera className="size-6" />
                                    <span className="text-[10px] uppercase font-bold mt-1">Photos</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingReview}
                                className="bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmittingReview ? <Loader2 className="animate-spin size-4" /> : <Check className="size-4" />}
                                Submit Review
                            </button>
                        </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-white dark:bg-background-dark/50 border border-primary/10 p-6 rounded-xl flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {review.customerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{review.customerName}</p>
                                            <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-primary">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`size-4 ${s <= review.rating ? 'fill-current' : 'opacity-30'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-4">{review.comment}</p>
                                {review.photos?.length > 0 && (
                                    <div className="flex gap-2 mt-auto overflow-x-auto no-scrollbar pb-1">
                                        {review.photos.map((photo: string, i: number) => (
                                            <img
                                                key={i}
                                                src={getImageUrl(photo)}
                                                alt="Review"
                                                className="size-16 rounded-lg object-cover border border-primary/5 cursor-pointer hover:scale-105 transition-transform"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {reviews.length === 0 && (
                            <p className="text-slate-500 text-center py-10 col-span-full">No reviews yet. Be the first to tell us what you think!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
