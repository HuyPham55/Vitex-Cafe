'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit2, Trash2, Video,
  Check, X, Loader2, Eye, EyeOff, GripVertical, Upload, Save, Settings
} from 'lucide-react';
import { fetchAPI, endpoints } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AsmrManagement() {
  const { token } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [asmrSettings, setAsmrSettings] = useState({ title: '', description: '' });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
    isVisible: true,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const getVideos = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI(`${endpoints.asmr}/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getVideos();
      getSettings();
    }
  }, [token]);

  const getSettings = async () => {
    try {
      const data = await fetchAPI(endpoints.settings);
      setAsmrSettings({
        title: data.asmrTitle || 'ASMR Brews',
        description: data.asmrDescription || ''
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      const formDataObj = new FormData();
      formDataObj.append('asmrTitle', asmrSettings.title);
      formDataObj.append('asmrDescription', asmrSettings.description);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoints.settings}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj
      });

      if (!res.ok) throw new Error('Failed to save settings');
      
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (error: any) {
      alert(error.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleOpenModal = (video: any = null) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        description: video.description || '',
        order: video.order || 0,
        isVisible: video.isVisible,
      });
    } else {
      setEditingVideo(null);
      setFormData({
        title: '',
        description: '',
        order: videos.length,
        isVisible: true,
      });
    }
    setVideoFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const url = editingVideo
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoints.asmr}/${editingVideo._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoints.asmr}`;
      
      const method = editingVideo ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('order', formData.order.toString());
      data.append('isVisible', formData.isVisible.toString());
      if (videoFile) {
        data.append('video', videoFile);
      } else if (!editingVideo) {
        throw new Error('Please select a video file');
      }

      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save video');
      }

      setIsModalOpen(false);
      getVideos();
    } catch (error: any) {
      alert(error.message || 'Failed to save video');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await fetchAPI(`${endpoints.asmr}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      getVideos();
    } catch (error: any) {
      alert(error.message || 'Failed to delete video');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      return;
    }

    const updatedVideos = [...videos];
    const [movedItem] = updatedVideos.splice(draggedIndex, 1);
    updatedVideos.splice(index, 0, movedItem);

    // Update local state immediately for smooth UI
    const finalVideos = updatedVideos.map((v, i) => ({ ...v, order: i }));
    setVideos(finalVideos);
    setDraggedIndex(null);

    // Persist to backend
    try {
      await Promise.all(
        finalVideos.map((video) =>
          fetchAPI(`${endpoints.asmr}/${video._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ order: video.order })
          })
        )
      );
    } catch (error) {
      console.error('Failed to update video order:', error);
      getVideos(); // Rollback on error
    }
  };

  if (loading && videos.length === 0) {
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">ASMR Video Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Upload and organize ASMR videos for your customers.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="size-5" /> Add New Video
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {videos.sort((a, b) => a.order - b.order).map((video, index) => (
          <div 
            key={video._id} 
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-4 flex items-center gap-6 shadow-sm group transition-all ${draggedIndex === index ? 'opacity-50 scale-[0.98] border-primary/30' : 'hover:border-primary/20'}`}
          >
            <div className="flex-shrink-0 cursor-move text-slate-300 hover:text-primary transition-colors">
              <GripVertical className="size-5" />
            </div>
            
            <div className="relative size-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-background-dark flex items-center justify-center">
              <Video className="size-8 text-slate-300" />
              {!video.isVisible && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                  <EyeOff className="size-5" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{video.title}</h3>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                  Order: {video.order}
                </span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  {video.appreciationCount} Appreciations
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1">{video.description || 'No description provided.'}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal(video)}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Edit2 className="size-4" />
              </button>
              <button
                onClick={() => handleDelete(video._id)}
                className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-100 dark:border-red-900/40"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="py-20 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-primary/10 rounded-3xl">
            <Video className="size-16 text-slate-200 dark:text-white/5 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-slate-400">No videos uploaded yet</h4>
            <p className="text-slate-500 mb-6">Start by adding your first coffee ASMR video.</p>
            <button
               onClick={() => handleOpenModal()}
               className="text-primary font-bold hover:underline"
            >
              Add Video Now
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-primary/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-slate-50 dark:bg-background-dark/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingVideo ? 'Edit ASMR Video' : 'Upload New ASMR Video'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Video Title</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100"
                    placeholder="e.g. Morning Espresso Ritual"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none text-slate-900 dark:text-slate-100"
                    placeholder="Describe the sounds and atmosphere..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Display Order</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100"
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Visibility</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-bold transition-all ${formData.isVisible 
                        ? 'bg-green-500/10 border-green-500/20 text-green-600' 
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                      {formData.isVisible ? (
                        <><Eye className="size-4" /> Visible</>
                      ) : (
                        <><EyeOff className="size-4" /> Hidden</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Video File (.mp4)</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/mp4,video/x-m4v,video/*"
                      className="hidden"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    />
                    <label
                      htmlFor="video-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${videoFile 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-slate-200 dark:border-white/10 hover:border-primary/50 text-slate-400'}`}
                    >
                      {videoFile ? (
                        <div className="text-center">
                          <Check className="size-8 mx-auto mb-2" />
                          <p className="font-bold text-sm">{videoFile.name}</p>
                          <p className="text-[10px] opacity-70">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="size-8 mx-auto mb-2 opacity-50" />
                          <p className="font-bold">Click to upload video</p>
                          <p className="text-xs opacity-70">MP4, M4V, MOV up to 100MB</p>
                        </div>
                      )}
                    </label>
                    {editingVideo && !videoFile && (
                      <p className="text-[10px] text-slate-400 mt-2 italic text-center">Leave empty to keep existing video</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/5 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
                >
                  {uploading ? (
                    <><Loader2 className="animate-spin size-5" /> Processing...</>
                  ) : (
                    editingVideo ? 'Update Video' : 'Upload Video'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASMR Page Content Settings Section */}
      <div className="mt-16 bg-white dark:bg-slate-900 border border-primary/10 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-primary/5 pb-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg">
            <Settings className="size-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Storefront Display Settings</h3>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Section Title</label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
              value={asmrSettings.title}
              onChange={e => setAsmrSettings({ ...asmrSettings, title: e.target.value })}
              placeholder="ASMR Brews"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Section Description</label>
            <textarea
              rows={3}
              className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all resize-none leading-relaxed"
              value={asmrSettings.description}
              onChange={e => setAsmrSettings({ ...asmrSettings, description: e.target.value })}
              placeholder="Describe the ASMR section..."
            ></textarea>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {savingSettings ? <Loader2 className="animate-spin size-5" /> : <Save className="size-5" />}
              Save Page Content
            </button>
            {settingsSuccess && (
              <span className="text-green-600 font-bold text-sm flex items-center gap-1 animate-in fade-in">
                <Check className="size-4" /> Changes saved!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
