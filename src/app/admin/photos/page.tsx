'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import type { Photo, Category } from '@/types/database';

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    alt_text: '',
    category_id: '',
    show_on_home: true,
    show_in_gallery: true,
    tags: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [photosRes, catsRes] = await Promise.all([
        fetch('/api/photos?limit=200'),
        fetch('/api/categories'),
      ]);
      const photosData = await photosRes.json();
      const catsData = await catsRes.json();
      if (Array.isArray(photosData)) setPhotos(photosData);
      if (Array.isArray(catsData)) setCategories(catsData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();

        if (uploadData.error) {
          console.error('Upload failed:', uploadData.error);
          continue;
        }

        await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.name.replace(/\.[^.]+$/, ''),
            alt_text: '',
            category_id: categories[0]?.id || null,
            tags: [],
            url_thumbnail: uploadData.url_thumbnail,
            url_medium: uploadData.url_medium,
            url_full: uploadData.url_full,
            width: uploadData.width,
            height: uploadData.height,
            show_on_home: true,
            show_in_gallery: true,
            sort_order: photos.length,
          }),
        });
      }

      await fetchData();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await fetch(`/api/photos?id=${id}`, { method: 'DELETE' });
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const openEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditForm({
      title: photo.title,
      alt_text: photo.alt_text,
      category_id: photo.category_id || '',
      show_on_home: photo.show_on_home ?? true,
      show_in_gallery: photo.show_in_gallery ?? true,
      tags: photo.tags?.join(', ') || '',
    });
  };

  const handleUpdate = async () => {
    if (!editingPhoto) return;

    try {
      await fetch('/api/photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPhoto.id,
          title: editForm.title,
          alt_text: editForm.alt_text,
          category_id: editForm.category_id || null,
          show_on_home: editForm.show_on_home,
          show_in_gallery: editForm.show_in_gallery,
          tags: editForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      setEditingPhoto(null);
      await fetchData();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text">Photos</h1>
          <p className="text-admin-muted text-sm mt-1">Manage your photo gallery</p>
        </div>
        <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-admin-gold text-white text-sm rounded-lg cursor-pointer hover:bg-admin-gold/90 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          {uploading ? 'Uploading...' : 'Upload Photos'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="mb-8 w-full max-w-xl text-xs text-admin-muted bg-white border border-admin-border rounded-lg px-4 py-3">
        <p className="font-medium text-admin-text mb-1">Where does each photo appear on the website?</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-semibold">Show on homepage</span> → controls if the photo appears in the{' '}
            <span className="underline">“Selected Works” gallery</span> section on the home page.
          </li>
          <li>
            <span className="font-semibold">Show in gallery</span> → controls if the photo appears on the{' '}
            <span className="underline">Gallery page</span>.
          </li>
          <li>
            <span className="font-semibold">Category</span> decides which{' '}
            <span className="underline">tab</span> (Weddings / Sports / Corporate / Portraits / Events) it appears under.
          </li>
          <li>
            <span className="font-semibold">Recommended crop</span> → the homepage gallery uses a{' '}
            <span className="font-semibold">3:4 portrait</span> frame and center-crops each image. Try to upload photos
            that look good when cropped to this ratio.
          </li>
        </ul>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 bg-admin-surface rounded-xl border border-admin-border">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gray-300">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <p className="mt-4 text-admin-muted">No photos uploaded yet</p>
          <p className="text-sm text-gray-400 mt-1">Upload your first photo to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative bg-admin-surface rounded-lg border border-admin-border overflow-hidden">
              <div className="relative aspect-square">
                {photo.url_thumbnail ? (
                  <Image
                    src={photo.url_thumbnail}
                    alt={photo.alt_text || photo.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
                {(photo.show_on_home ?? true) && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-admin-gold text-white text-[10px] uppercase tracking-wider rounded">
                    Homepage
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-admin-text truncate">{photo.title}</p>
                <p className="text-xs text-admin-muted mt-0.5">
                  {photo.width} x {photo.height}
                </p>
                <p className="mt-1 text-[11px] text-admin-muted">
                  {(photo.show_on_home ?? true) && (photo.show_in_gallery ?? true)
                    ? 'Homepage + Gallery'
                    : photo.show_on_home ?? true
                    ? 'Homepage only'
                    : 'Gallery only'}
                </p>
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openEdit(photo)}
                  className="px-3 py-1.5 bg-white text-gray-800 text-xs rounded-md hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingPhoto(null)}>
          <div className="bg-admin-surface rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-admin-text mb-4">Edit Photo</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-admin-muted mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                />
              </div>

              <div>
                <label className="block text-sm text-admin-muted mb-1">Alt Text</label>
                <input
                  type="text"
                  value={editForm.alt_text}
                  onChange={(e) => setEditForm((p) => ({ ...p, alt_text: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                />
              </div>

              <div>
                <label className="block text-sm text-admin-muted mb-1">Category</label>
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm((p) => ({ ...p, category_id: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-admin-muted mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm((p) => ({ ...p, tags: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                  placeholder="wedding, outdoor, couple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.show_on_home}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, show_on_home: e.target.checked }))
                    }
                    className="w-4 h-4 accent-admin-gold"
                  />
                  <span className="text-sm text-admin-text">Show on homepage gallery</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.show_in_gallery}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, show_in_gallery: e.target.checked }))
                    }
                    className="w-4 h-4 accent-admin-gold"
                  />
                  <span className="text-sm text-admin-text">Show on Gallery page</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 text-sm text-admin-muted hover:text-admin-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
