'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatDate } from '@/lib/utils';
import type { Message } from '@/types/database';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleRead = async (msg: Message) => {
    try {
      await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, read: !msg.read }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...msg, read: !msg.read });
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const openMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      await toggleRead(msg);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-admin-text">Messages</h1>
        <p className="text-admin-muted text-sm mt-1">
          Contact form submissions ({messages.filter((m) => !m.read).length} unread)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : messages.length === 0 ? (
            <div className="text-center py-10 bg-admin-surface rounded-xl border border-admin-border">
              <p className="text-admin-muted text-sm">No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedMessage?.id === msg.id
                    ? 'border-admin-gold bg-admin-gold/5'
                    : 'border-admin-border bg-admin-surface hover:border-admin-gold/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className={`text-sm ${msg.read ? 'text-admin-muted' : 'text-admin-text font-medium'}`}>
                    {msg.full_name}
                  </p>
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-admin-gold flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-admin-muted mt-1">{msg.event_type}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(msg.created_at)}</p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-admin-text">{selectedMessage.full_name}</h2>
                  <p className="text-sm text-admin-muted">{selectedMessage.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRead(selectedMessage)}
                    className="px-3 py-1 text-xs border border-admin-border rounded hover:bg-gray-50 transition-colors text-admin-muted"
                  >
                    Mark as {selectedMessage.read ? 'unread' : 'read'}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-3 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-admin-muted uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-admin-text mt-1">{selectedMessage.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted uppercase tracking-wider">Event Type</p>
                  <p className="text-sm text-admin-text mt-1">{selectedMessage.event_type}</p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted uppercase tracking-wider">Event Date</p>
                  <p className="text-sm text-admin-text mt-1">{selectedMessage.event_date || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted uppercase tracking-wider">Location</p>
                  <p className="text-sm text-admin-text mt-1">{selectedMessage.location || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted uppercase tracking-wider">Referral Source</p>
                  <p className="text-sm text-admin-text mt-1">{selectedMessage.referral_source || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted uppercase tracking-wider">Received</p>
                  <p className="text-sm text-admin-text mt-1">{formatDate(selectedMessage.created_at)}</p>
                </div>
              </div>

              <div className="border-t border-admin-border pt-4">
                <p className="text-xs text-admin-muted uppercase tracking-wider mb-2">Message</p>
                <p className="text-sm text-admin-text whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-admin-surface rounded-xl border border-admin-border p-6 text-center py-20">
              <p className="text-admin-muted text-sm">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
