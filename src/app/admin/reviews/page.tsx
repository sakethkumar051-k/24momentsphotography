'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { ClientReview } from '@/types/database';

type Tab = 'pending' | 'approved' | 'rejected';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('pending');

  const fetchReviews = () => {
    setLoading(true);
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setReviews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchReviews, []);

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    await fetch('/api/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
    fetchReviews();
  };

  const filtered = reviews.filter((r) => r.status === tab);
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pending', label: `Pending${pendingCount ? ` (${pendingCount})` : ''}` },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-admin-text">Client Reviews</h1>

        <div className="flex gap-2 border-b border-admin-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.key
                  ? 'border-admin-gold text-admin-gold'
                  : 'border-transparent text-admin-muted hover:text-admin-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-admin-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-admin-muted">
            <p>No {tab} reviews</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((review) => (
              <div key={review.id} className="bg-admin-surface border border-admin-border rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-admin-text">{review.client_name}</h3>
                      <div className="flex gap-0.5 text-admin-gold text-sm">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span key={n}>{n <= review.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-admin-muted mb-2">
                      {review.email} &middot; {review.event_type || 'General'} &middot; {new Date(review.created_at).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-admin-text">&ldquo;{review.quote}&rdquo;</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatus(review.id, 'approved')}
                          className="text-xs px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700 hover:bg-green-100"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatus(review.id, 'rejected')}
                          className="text-xs px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-500 hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {review.status === 'rejected' && (
                      <button
                        onClick={() => handleStatus(review.id, 'approved')}
                        className="text-xs px-3 py-1.5 border border-admin-border rounded-lg text-admin-muted hover:bg-gray-50"
                      >
                        Approve
                      </button>
                    )}
                    {review.status === 'approved' && (
                      <button
                        onClick={() => handleStatus(review.id, 'rejected')}
                        className="text-xs px-3 py-1.5 border border-admin-border rounded-lg text-admin-muted hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50"
                    >
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
