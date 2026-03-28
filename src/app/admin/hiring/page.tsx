'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { JobPosting } from '@/types/database';

const JOB_TYPES = ['full-time', 'part-time', 'freelance', 'internship'] as const;

export default function AdminHiringPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [form, setForm] = useState({ title: '', description: '', location: '', type: 'full-time' as string });

  const fetchJobs = () => {
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setJobs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchJobs, []);

  const resetForm = () => {
    setForm({ title: '', description: '', location: '', type: 'full-time' });
    setEditingJob(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingJob ? 'PUT' : 'POST';
    const body = editingJob ? { ...form, id: editingJob.id } : form;
    await fetch('/api/jobs', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    resetForm();
    fetchJobs();
  };

  const handleEdit = (job: JobPosting) => {
    setForm({ title: job.title, description: job.description, location: job.location, type: job.type });
    setEditingJob(job);
    setShowForm(true);
  };

  const handleToggle = async (job: JobPosting) => {
    await fetch('/api/jobs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: job.id, active: !job.active }),
    });
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' });
    fetchJobs();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-admin-text">Hiring / Careers</h1>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 transition-colors"
          >
            + Post New Job
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-admin-surface border border-admin-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-admin-text">{editingJob ? 'Edit Job' : 'New Job Posting'}</h2>
            <input
              required
              placeholder="Job Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-lg text-sm text-admin-text"
            />
            <textarea
              required
              rows={5}
              placeholder="Job description, responsibilities, requirements..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-lg text-sm text-admin-text resize-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Location (e.g. Hyderabad, Remote)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-lg text-sm text-admin-text"
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-lg text-sm text-admin-text"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90">
                {editingJob ? 'Update' : 'Post Job'}
              </button>
              <button type="button" onClick={resetForm} className="px-5 py-2 border border-admin-border text-admin-muted text-sm rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-admin-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 text-admin-muted">
            <p className="text-lg mb-2">No job postings yet</p>
            <p className="text-sm">Click &ldquo;Post New Job&rdquo; to create your first listing.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-admin-surface border border-admin-border rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-admin-text">{job.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        job.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {job.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-admin-muted mb-3">
                      <span>{job.location}</span>
                      <span className="capitalize">{job.type}</span>
                      <span>{new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-admin-muted whitespace-pre-line line-clamp-3">{job.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleToggle(job)} className="text-xs px-3 py-1.5 border border-admin-border rounded-lg hover:bg-gray-50 text-admin-muted">
                      {job.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleEdit(job)} className="text-xs px-3 py-1.5 border border-admin-border rounded-lg hover:bg-gray-50 text-admin-muted">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-500">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
