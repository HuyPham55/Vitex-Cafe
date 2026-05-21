'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MenuSquare, Coffee, CheckCircle, ArrowRight, X, ChevronLeft, ChevronRight, Star, MessageSquareQuote, ExternalLink, ChefHat } from 'lucide-react';
import { fetchAPI, endpoints, getImageUrl } from '@/lib/api';

export default function Home() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [heroImages, setHeroImages] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBBS7MjMdfwCv1DqRLY5YHgD8XRyOsNHseJidVw67eg4s0rItgSTVEKs1YsCAoYPyzO4MsnykLv1Ktwepj6z-pXsx_F_gUztpAA9g2Jvle5oLF0RFSZD34YrTM3DrJdyFgwySZi28siaqS1kU72N9J-htErWvr_U7hWpIGhcY8BZqUHsY2FO8_8nSG44ZdLan2A0HmsJbQUQwIE0a5P8i9K9MdnetqR7OQKCkxIQf58JdmiReEQBGc7z6l4AzRtOIqi9hUKPgwX'
  ]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchAPI(`${endpoints.orders}/active?status=pending,preparing,ready`);
        // Map pending/preparing/ready to display
        setOrders(data.slice(0, 6)); // Show latest 6
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    const getSettings = async () => {
      try {
        const data = await fetchAPI(endpoints.settings);
        if (data.heroImages && data.heroImages.length > 0) {
          setHeroImages(data.heroImages);
        }
        if (data.galleryImages && data.galleryImages.length > 0) {
          setGalleryImages(data.galleryImages);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    getOrders();
    getSettings();
    const getReviews = async () => {
      try {
        const data = await fetchAPI(`${endpoints.reviews}/latest?limit=6`);
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };
    getReviews();
    const interval = setInterval(getOrders, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 5000); // Autoplay every 5 seconds
    return () => clearInterval(timer);
  }, [heroImages]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500 animate-pulse';
      case 'ready': return 'bg-green-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Just ordered';
      case 'preparing': return 'Brewing';
      case 'ready': return 'Ready for Pickup';
      default: return status;
    }
  };

  const handleNextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedImage || galleryImages.length === 0) return;
    const currentIndex = galleryImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  }, [selectedImage, galleryImages]);

  const handlePrevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedImage || galleryImages.length === 0) return;
    const currentIndex = galleryImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  }, [selectedImage, galleryImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handleNextImage, handlePrevImage]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[1200px] px-4 md:px-10 py-6">
        {/* Hero Section */}
        <section className="@container">
          <div className="@[480px]:p-2">
            <div
              className="flex min-h-[520px] flex-col gap-8 @[480px]:rounded-xl items-center justify-center p-6 text-center relative overflow-hidden"
            >
              {heroImages.map((img, i) => (
                <div 
                  key={i} 
                  className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`} 
                  style={{ backgroundImage: `linear-gradient(rgba(34, 25, 16, 0.6) 0%, rgba(34, 25, 16, 0.8) 100%), url("${getImageUrl(img)}")` }}
                />
              ))}

              <div className="flex flex-col gap-4 max-w-2xl z-10">
                <h1 className="text-white text-5xl font-black leading-tight tracking-tight @[480px]:text-6xl">
                  Experience the <span className="text-primary">Perfect Brew</span>
                </h1>
                <p className="text-slate-200 text-lg font-normal leading-relaxed">
                  Welcome to {process.env.NEXT_PUBLIC_SITE_NAME || 'The Daily Grind'}, where every single bean is roasted to perfection and every cup is crafted with passion.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 z-10">
                <Link href="/menu" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                  View Menu
                </Link>
                <Link href="/about" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-base font-bold hover:bg-white/20 transition-all">
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Live Order Status Section */}
        <section className="mt-12 mb-20">
          <div className="flex items-center justify-between px-4 pb-6">
            <div className="flex items-center gap-3">
              <MenuSquare className="text-primary size-8" />
              <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">Live Order Status</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live Updates
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-background-dark/50 rounded-xl border border-primary/10 text-slate-500">
              No active orders at the moment. Be the first to order!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/orders?id=${order.orderNumber}`}
                  aria-label={`View order #${order.orderNumber} details`}
                  className="flex items-center gap-4 min-w-0 overflow-hidden bg-white dark:bg-background-dark border border-primary/10 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-primary/25 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-14">
                    {order.status === 'ready'
                      ? <CheckCircle className="size-8" />
                      : order.type === 'lunch'
                        ? <ChefHat className="size-8" />
                        : <Coffee className="size-8" />}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 min-w-0">
                      <p className="text-slate-900 dark:text-slate-100 text-lg font-bold truncate min-w-0">{order.customerName}</p>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">#{order.orderNumber}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate min-w-0" title={order.items.map((i: any) => i.name).join(', ')}>
                      {order.items.map((i: any) => i.name).join(', ')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${getStatusColor(order.status)}`}></div>
                      <p className={`${getStatusColor(order.status).replace('bg-', 'text-')} text-xs font-bold uppercase`}>
                        {getStatusText(order.status)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link href="/menu" className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Order Yours Now <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <section className="mb-20">
            <div className="flex flex-col gap-2 mb-8 px-4 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <MenuSquare className="text-primary size-8" />
                <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">Our Daily Brews</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl">
                A glimpse into our daily craft, from the perfect latte art to our cozy roasting corner. Every shot tells a story.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
              {galleryImages.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className="aspect-square overflow-hidden rounded-2xl group relative cursor-pointer shadow-sm border border-primary/5"
                >
                  <img 
                    alt="Cafe Gallery" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={getImageUrl(img)} 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-medium uppercase tracking-widest">Vitex Moment</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Customer Testimonials Section */}
        <section className="mb-20 px-4">
          <div className="flex flex-col gap-2 mb-8 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <MessageSquareQuote className="text-primary size-8" />
              <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-tight">Customer Voices</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl">
              Don't just take our word for it. Hear what our community has to say about their daily ritual.
            </p>
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-background-dark/40 rounded-xl border border-primary/10 text-slate-500">
              No reviews yet. Be the first to leave one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white dark:bg-background-dark/40 border border-primary/10 p-6 rounded-2xl shadow-sm flex flex-col h-full hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-1 text-primary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`size-4 ${i < review.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic mb-6 flex-grow line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/5">
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[150px]">{review.customerName}</span>
                      <Link href={`/product/${review.product?._id}`} className="text-primary text-xs font-semibold hover:underline mt-1 flex items-center gap-1">
                        Reviewing: <span className="truncate max-w-[100px]">{review.product?.name}</span> <ExternalLink className="size-3" />
                      </Link>
                    </div>
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                      {review.customerName.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/10">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Ready for your morning kick?</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Order online and skip the line. Your coffee will be waiting for you.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/menu" className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Order Now</Link>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div
              className="relative max-w-5xl h-full flex items-center justify-center group self-center"
              onClick={(e) => e.stopPropagation()}
          >
            {/* Desktop Previous Button */}
            <button 
              className="absolute left-4 md:-left-16 text-white/50 hover:text-white transition-all p-3 bg-white/5 hover:bg-white/20 rounded-full z-10 hidden sm:block scale-90 md:scale-100"
              onClick={handlePrevImage}
            >
              <ChevronLeft size={40} />
            </button>

            <img
                src={getImageUrl(selectedImage)}
                alt="Gallery Preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 p-4"
            />

            {/* Desktop Next Button */}
            <button 
              className="absolute right-4 md:-right-16 text-white/50 hover:text-white transition-all p-3 bg-white/5 hover:bg-white/20 rounded-full z-10 hidden sm:block scale-90 md:scale-100"
              onClick={handleNextImage}
            >
              <ChevronRight size={40} />
            </button>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="absolute bottom-8 flex gap-8 items-center justify-center w-full z-10 sm:hidden">
            <button 
              className="text-white hover:text-primary transition-colors p-4 bg-white/10 hover:bg-white/20 rounded-full active:scale-95"
              onClick={handlePrevImage}
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              className="text-white hover:text-primary transition-colors p-4 bg-white/10 hover:bg-white/20 rounded-full active:scale-95"
              onClick={handleNextImage}
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white transition-colors p-3 bg-black/50 hover:bg-black/80 rounded-full z-50 backdrop-blur-sm shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
