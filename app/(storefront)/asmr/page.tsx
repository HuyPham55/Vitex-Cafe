'use client';

import { useState, useEffect } from 'react';
import { Play, Heart, Gift, Volume2, Info, ArrowRight } from 'lucide-react';
import { fetchAPI, endpoints } from '@/lib/api';
import { motion } from 'framer-motion';

interface AsmrVideo {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  appreciationCount: number;
}

export default function AsmrPage() {
  const [videos, setVideos] = useState<AsmrVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<AsmrVideo | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await fetchAPI(endpoints.asmr);
        setVideos(data);
        if (data.length > 0) {
          setActiveVideo(data[0]);
        }
      } catch (err) {
        console.error('Failed to load videos:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  const handleAppreciate = async (videoId: string) => {
    try {
      const result = await fetchAPI(`${endpoints.asmr}/${videoId}/appreciate`, {
        method: 'POST',
      });
      
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, appreciationCount: result.appreciationCount } : v
        )
      );

      if (activeVideo?._id === videoId) {
        setActiveVideo((prev) => prev ? { ...prev, appreciationCount: result.appreciationCount } : null);
      }
    } catch (err) {
      console.error('Failed to appreciate:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-slate-500">Brewing your sounds...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 md:px-20 py-8 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <section className="w-full mb-12">
        <div className="flex flex-col gap-2 mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-900 dark:text-slate-100 text-4xl md:text-5xl font-black tracking-tight"
          >
            ASMR Brews
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl"
          >
            Immerse yourself in the rhythmic symphony of coffee craftsmanship. From the gentle hiss of steam to the crunch of freshly ground beans.
          </motion.p>
        </div>

        {activeVideo ? (
          <div className="relative group overflow-hidden rounded-2xl bg-slate-900 aspect-video w-full shadow-2xl border border-white/10">
            {/* Video Player */}
            <video 
              key={activeVideo.videoUrl} 
              src={`http://localhost:5000${activeVideo.videoUrl}`}
              className="absolute inset-0 w-full h-full object-cover"
              controls
              autoPlay
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent pointer-events-none"></div>
            
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 pointer-events-none">
              <div className="flex justify-between items-end pointer-events-auto">
                <div className="max-w-[70%]">
                  <span className="bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase mb-3 inline-block">
                    Now Playing
                  </span>
                  <h2 className="text-white text-2xl md:text-4xl font-black mb-2">{activeVideo.title}</h2>
                  <p className="text-slate-300 text-sm md:text-base line-clamp-2">{activeVideo.description}</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAppreciate(activeVideo._id)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/20 group/btn"
                  >
                    <Heart className={`size-5 transition-transform group-hover/btn:scale-125 ${activeVideo.appreciationCount > 0 ? 'fill-primary text-primary' : ''}`} />
                    <span className="font-bold">{activeVideo.appreciationCount}</span>
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
                    <Gift className="size-5" />
                    <span className="font-bold">Appreciate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-video w-full rounded-2xl bg-slate-100 dark:bg-white/5 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-white/10">
            <Volume2 className="size-16 mb-4 opacity-20" />
            <p>No videos available yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Sound Gallery */}
      <section className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-slate-900 dark:text-slate-100 text-2xl font-black">The Sound Gallery</h3>
            <p className="text-slate-500 text-sm">Explore our collection of soothing coffee sounds</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button className="whitespace-nowrap px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold">All Sounds</button>
            <button className="whitespace-nowrap px-4 py-2 rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-200/50 dark:hover:bg-white/5">Grinding</button>
            <button className="whitespace-nowrap px-4 py-2 rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-200/50 dark:hover:bg-white/5">Steaming</button>
            <button className="whitespace-nowrap px-4 py-2 rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-200/50 dark:hover:bg-white/5">Pouring</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <motion.div 
              layout
              key={video._id}
              className={`group flex flex-col gap-4 bg-white dark:bg-white/5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${activeVideo?._id === video._id ? 'border-primary' : 'border-transparent hover:border-primary/20 hover:shadow-xl'}`}
              onClick={() => setActiveVideo(video)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 shadow-inner">
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900 group-hover:scale-110 transition-transform duration-700">
                    <Play className="size-12 text-white/20" />
                  </div>
                )}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${activeVideo?._id === video._id ? 'opacity-100 bg-primary/20' : 'opacity-0 group-hover:opacity-100 bg-black/40'}`}>
                  <div className="size-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                    <Play className="size-6 fill-white" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-slate-900 dark:text-slate-100 text-lg font-black group-hover:text-primary transition-colors">{video.title}</h4>
                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-primary transition-colors">
                    <Heart className={`size-4 ${video.appreciationCount > 0 ? 'fill-primary text-primary' : ''}`} />
                    <span className="text-xs font-bold">{video.appreciationCount}</span>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {videos.length === 0 && !loading && (
          <div className="py-20 text-center flex flex-col items-center">
            <Volume2 className="size-20 text-slate-200 dark:text-white/10 mb-4" />
            <h4 className="text-xl font-bold text-slate-400 mb-2">Silence is Golden</h4>
            <p className="text-slate-500">But we'll have sounds here very soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
