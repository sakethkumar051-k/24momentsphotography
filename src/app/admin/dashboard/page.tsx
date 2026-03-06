'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { DashboardStats } from '@/types/database';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPhotos: 0,
    totalVideos: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [photosRes, videosRes, messagesRes] = await Promise.all([
          fetch('/api/photos?limit=1'),
          fetch('/api/videos'),
          fetch('/api/messages'),
        ]);

        const photos = await photosRes.json();
        const videos = await videosRes.json();
        const messages = await messagesRes.json();

        setStats({
          totalPhotos: Array.isArray(photos) ? photos.length : 0,
          totalVideos: Array.isArray(videos) ? videos.length : 0,
          totalMessages: Array.isArray(messages) ? messages.length : 0,
          unreadMessages: Array.isArray(messages) ? messages.filter((m: { read: boolean }) => !m.read).length : 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Photos',
      value: stats.totalPhotos,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Videos',
      value: stats.totalVideos,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="23,7 16,12 23,17" />
          <rect x="1" y="5" width="15" height="14" rx="2" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Total Messages',
      value: stats.totalMessages,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Unread Messages',
      value: stats.unreadMessages,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      ),
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-admin-text">Dashboard</h1>
        <p className="text-admin-muted text-sm mt-1">Welcome to 24 Moments admin panel</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-admin-surface rounded-xl p-6 border border-admin-border animate-pulse">
              <div className="h-12 w-12 rounded-lg bg-gray-100" />
              <div className="mt-4 h-8 w-16 bg-gray-100 rounded" />
              <div className="mt-2 h-4 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-admin-surface rounded-xl p-6 border border-admin-border hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                {card.icon}
              </div>
              <p className="mt-4 text-3xl font-semibold text-admin-text">{card.value}</p>
              <p className="text-sm text-admin-muted mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
