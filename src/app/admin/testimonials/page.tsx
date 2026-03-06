'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import type { Testimonial } from '@/types/database';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    quote: '',
    client_name: '',
    event_type: '',
    client_photo_url: '',
    rating: 5,
    featured: true,
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (Array.isArray(data)) setTestimonials(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const resetForm = () => {
    setForm({
      quote: '',
      client_name: '',
      event_type: '',
      client_photo_url: '',
      rating: 5,
      featured: true,
    });
    setEditing(null);
    setAdding(false);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      quote: t.quote,
      client_name: t.client_name,
      event_type: t.event_type,
      client_photo_url: t.client_photo_url || '',
      rating: t.rating ?? 5,
      featured: t.featured ?? true,
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/about', { method: 'POST', body: fd });
      const data = await res.json();
      if (data?.url) setForm((p) => ({ ...p, client_photo_url: data.url }));
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await fetch('/api/testimonials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editing.id,
            quote: form.quote,
            client_name: form.client_name,
            event_type: form.event_type,
            client_photo_url: form.client_photo_url || undefined,
            rating: form.rating,
            featured: form.featured,
          }),
        });
      } else {
        await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quote: form.quote,
            client_name: form.client_name,
            event_type: form.event_type,
            client_photo_url: form.client_photo_url || undefined,
            rating: form.rating,
            featured: form.featured,
            sort_order: testimonials.length,
          }),
        });
      }
      resetForm();
      await fetchTestimonials();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const showModal = editing || adding;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text">Client Testimonials</h1>
          <p className="text-admin-muted text-sm mt-1">Manage what clients say about you</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="px-5 py-2.5 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 transition-colors"
        >
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 bg-admin-surface rounded-xl border border-admin-border">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gray-300">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <p className="mt-4 text-admin-muted">No testimonials yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first client testimonial</p>
          <button
            onClick={() => setAdding(true)}
            className="mt-4 px-4 py-2 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90"
          >
            Add Testimonial
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-4 p-4 bg-admin-surface rounded-xl border border-admin-border hover:border-admin-gold/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-admin-border flex-shrink-0">
                {t.client_photo_url ? (
                  <Image src={t.client_photo_url} alt="" width={48} height={48} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-admin-muted text-lg font-display">
                    {t.client_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-admin-text line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-xs text-admin-muted mt-1">
                  {t.client_name} · {t.event_type}
                  {t.rating != null && (
                    <span className="ml-2 text-admin-gold">
                      {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(t)}
                  className="px-3 py-1.5 text-sm text-admin-gold hover:bg-admin-gold/10 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={resetForm}>
          <div className="bg-admin-surface rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-admin-text mb-4">
              {editing ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-admin-muted mb-1">Quote</label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
                  rows={4}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30 resize-none"
                  placeholder="What did the client say?"
                />
              </div>

              <div>
                <label className="block text-sm text-admin-muted mb-1">Client Name</label>
                <input
                  type="text"
                  value={form.client_name}
                  onChange={(e) => setForm((p) => ({ ...p, client_name: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                  placeholder="Priya & Rahul"
                />
              </div>

              <div>
                <label className="block text-sm text-admin-muted mb-1">Event Type</label>
                <input
                  type="text"
                  value={form.event_type}
                  onChange={(e) => setForm((p) => ({ ...p, event_type: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                  placeholder="Wedding, Sports Event, Corporate Event..."
                />
              </div>

              <div>
                <label className="block text-sm text-admin-muted mb-1">Client Photo (optional)</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-admin-border flex-shrink-0">
                    {form.client_photo_url ? (
                      <Image src={form.client_photo_url} alt="" width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-admin-muted text-sm">No photo</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input ref={avatarFileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    <button
                      type="button"
                      onClick={() => avatarFileRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="px-3 py-1.5 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 disabled:opacity-50"
                    >
                      {uploadingAvatar ? 'Uploading...' : 'Upload'}
                    </button>
                    <input
                      type="text"
                      value={form.client_photo_url}
                      onChange={(e) => setForm((p) => ({ ...p, client_photo_url: e.target.value }))}
                      placeholder="Or paste URL"
                      className="mt-2 w-full border border-admin-border rounded-lg px-3 py-1.5 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                    className="w-4 h-4 accent-admin-gold"
                  />
                  <span className="text-sm text-admin-text">Show on homepage</span>
                </label>
                <p className="text-xs text-admin-muted mt-1">Uncheck to hide from the public site</p>
              </div>

              <div>
                <label className="block text-sm text-admin-muted mb-1">Star Rating (1–5)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, rating: n }))}
                      className={`w-10 h-10 rounded-lg text-lg transition-colors ${
                        form.rating >= n ? 'text-admin-gold bg-admin-gold/10' : 'text-gray-300 hover:text-admin-gold/70'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-admin-muted hover:text-admin-text transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.quote.trim() || !form.client_name.trim()}
                className="px-4 py-2 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 disabled:opacity-50 transition-colors"
              >
                {editing ? 'Save Changes' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
