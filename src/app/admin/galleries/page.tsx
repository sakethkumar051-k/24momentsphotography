'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types/database';

export default function AdminGalleriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '' });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleNameChange = (name: string) => {
    setForm({ name, slug: slugify(name) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editing) {
        await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, name: form.name, slug: form.slug }),
        });
      } else {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            slug: form.slug,
            sort_order: categories.length,
          }),
        });
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Photos in this category will be uncategorized.')) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      setCategories((p) => p.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', slug: '' });
    setEditing(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text">Gallery Categories</h1>
          <p className="text-admin-muted text-sm mt-1">Organize your photo galleries</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-5 py-2.5 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 transition-colors"
        >
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-admin-surface rounded-xl p-6 border border-admin-border">
          <h2 className="text-lg font-semibold text-admin-text mb-4">
            {editing ? 'Edit Category' : 'New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-admin-muted mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm text-admin-muted mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  required
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                  placeholder="category-slug"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-admin-muted hover:text-admin-text">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-admin-surface rounded-xl border border-admin-border">
          <p className="text-admin-muted">No categories created yet</p>
        </div>
      ) : (
        <div className="bg-admin-surface rounded-xl border border-admin-border divide-y divide-admin-border">
          {categories.map((cat, i) => (
            <div key={cat.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-admin-muted w-6">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-admin-text">{cat.name}</p>
                  <p className="text-xs text-admin-muted">/{cat.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="px-3 py-1 text-xs text-admin-gold border border-admin-gold/30 rounded hover:bg-admin-gold/5 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="px-3 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
