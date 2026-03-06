'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { VIDEO_CATEGORIES } from '@/lib/constants';
import type { Video } from '@/types/database';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [form, setForm] = useState({
    youtube_url: '',
    title: '',
    description: '',
    category: 'highlight_reels' as Video['category'],
    visible: true,
  });
  const [fetching, setFetching] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (Array.isArray(data)) setVideos(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleFetchYouTube = async () => {
    if (!form.youtube_url) return;
    setFetching(true);

    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.youtube_url }),
      });
      const data = await res.json();

      if (data.title) {
        setForm((p) => ({ ...p, title: data.title }));
      }
    } catch (err) {
      console.error('YouTube fetch error:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const ytRes = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.youtube_url }),
      });
      const ytData = await ytRes.json();

      if (!ytData.youtube_id) {
        alert('Invalid YouTube URL');
        return;
      }

      if (editingVideo) {
        await fetch('/api/videos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingVideo.id,
            title: form.title,
            description: form.description,
            youtube_url: form.youtube_url,
            youtube_id: ytData.youtube_id,
            thumbnail_url: ytData.thumbnail_url,
            category: form.category,
            visible: form.visible,
          }),
        });
      } else {
        await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title || ytData.title || 'Untitled',
            description: form.description,
            youtube_url: form.youtube_url,
            youtube_id: ytData.youtube_id,
            thumbnail_url: ytData.thumbnail_url,
            category: form.category,
            visible: form.visible,
            sort_order: videos.length,
          }),
        });
      }

      resetForm();
      await fetchVideos();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    try {
      await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
      setVideos((p) => p.filter((v) => v.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const openEdit = (video: Video) => {
    setEditingVideo(video);
    setForm({
      youtube_url: video.youtube_url,
      title: video.title,
      description: video.description,
      category: video.category,
      visible: video.visible,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setForm({ youtube_url: '', title: '', description: '', category: 'highlight_reels', visible: true });
    setEditingVideo(null);
    setShowAddForm(false);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text">Videos</h1>
          <p className="text-admin-muted text-sm mt-1">Manage YouTube video embeds</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddForm(true); }}
          className="px-5 py-2.5 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 transition-colors"
        >
          Add Video
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 bg-admin-surface rounded-xl p-6 border border-admin-border">
          <h2 className="text-lg font-semibold text-admin-text mb-4">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="url"
                value={form.youtube_url}
                onChange={(e) => setForm((p) => ({ ...p, youtube_url: e.target.value }))}
                placeholder="Paste YouTube URL..."
                required
                className="flex-1 border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
              />
              <button
                type="button"
                onClick={handleFetchYouTube}
                disabled={fetching}
                className="px-4 py-2 bg-gray-100 text-sm text-admin-text rounded-lg hover:bg-gray-200 transition-colors"
              >
                {fetching ? 'Fetching...' : 'Fetch Info'}
              </button>
            </div>

            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Video title"
              className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
            />

            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Description (optional)"
              rows={3}
              className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30 resize-none"
            />

            <div className="flex gap-4">
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Video['category'] }))}
                className="border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
              >
                {VIDEO_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm((p) => ({ ...p, visible: e.target.checked }))}
                  className="w-4 h-4 accent-admin-gold"
                />
                <span className="text-sm text-admin-text">Visible</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-admin-muted hover:text-admin-text">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 transition-colors">
                {editingVideo ? 'Update' : 'Add Video'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 bg-admin-surface rounded-xl border border-admin-border">
          <p className="text-admin-muted">No videos added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-admin-surface rounded-lg border border-admin-border overflow-hidden group">
              <div className="relative aspect-video">
                {video.thumbnail_url ? (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                {!video.visible && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-gray-800 text-white text-[10px] uppercase tracking-wider rounded">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-admin-text truncate">{video.title}</h3>
                <p className="text-xs text-admin-muted mt-1">
                  {VIDEO_CATEGORIES.find((c) => c.value === video.category)?.label}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEdit(video)}
                    className="px-3 py-1 text-xs text-admin-gold border border-admin-gold/30 rounded hover:bg-admin-gold/5 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="px-3 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
