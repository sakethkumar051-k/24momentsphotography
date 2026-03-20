'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

function compressForUpload(file: File, maxDim = 2400): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width <= maxDim && height <= maxDim && file.size <= MAX_UPLOAD_BYTES) {
        resolve(file);
        return;
      }
      const scale = Math.min(maxDim / width, maxDim / height, 1);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compression failed'));
            if (blob.size > MAX_UPLOAD_BYTES && quality > 0.3) { quality -= 0.1; tryCompress(); }
            else resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality,
        );
      };
      tryCompress();
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const aboutFileRef = useRef<HTMLInputElement>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data && typeof data === 'object' && !data.error) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    setUploadingAbout(true);
    try {
      const file = await compressForUpload(rawFile);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/about', { method: 'POST', body: formData, credentials: 'include' });
      const data = await res.json();
      if (data?.url) {
        handleChange('about_image', data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingAbout(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const settingsGroups: Array<{
    title: string;
    fields: { key: string; label: string; type: string }[];
    aboutImage?: boolean;
  }> = [
    {
      title: 'Business Information',
      fields: [
        { key: 'studio_name', label: 'Studio Name', type: 'text' },
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'phone', label: 'Phone Number', type: 'text' },
        { key: 'email', label: 'Email Address', type: 'email' },
        { key: 'address', label: 'Physical Address', type: 'text' },
        { key: 'maps_embed', label: 'Google Maps Embed URL', type: 'text' },
      ],
    },
    {
      title: 'Social Media',
      fields: [
        { key: 'instagram', label: 'Instagram URL', type: 'url' },
        { key: 'youtube', label: 'YouTube URL', type: 'url' },
        { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
      ],
    },
    {
      title: 'About Section',
      fields: [
        { key: 'about_paragraph_1', label: 'Intro Paragraph (line 1)', type: 'textarea' },
        { key: 'about_paragraph_2', label: 'Intro Paragraph (line 2)', type: 'textarea' },
      ],
      aboutImage: true,
    },
    {
      title: 'Homepage Stats',
      fields: [
        { key: 'stat_years_experience', label: 'Years Experience', type: 'number' },
        { key: 'stat_happy_clients', label: 'Happy Clients', type: 'number' },
        { key: 'stat_photos_delivered', label: 'Photos Delivered', type: 'number' },
        { key: 'stat_events_covered', label: 'Events Covered', type: 'number' },
      ],
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text">Site Settings</h1>
          <p className="text-admin-muted text-sm mt-1">Manage your website information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title} className="bg-admin-surface rounded-xl border border-admin-border p-6">
            <h2 className="text-lg font-semibold text-admin-text mb-4">{group.title}</h2>
            <div className="space-y-4">
              {'aboutImage' in group && group.aboutImage && (
                <div>
                  <label className="block text-sm text-admin-muted mb-1">About Section Photo</label>
                  <p className="text-[11px] text-admin-muted mb-2">
                    For best results, upload a vertical image around <span className="font-medium">3:4 ratio</span>{' '}
                    (for example <span className="font-medium">1200×1600px</span>). We automatically center-crop it to fit
                    the layout.
                  </p>
                  <div className="flex items-start gap-4">
                    <div className="w-32 aspect-3/4 rounded-lg overflow-hidden bg-admin-border shrink-0">
                      {settings.about_image ? (
                        <Image
                          src={settings.about_image}
                          alt="About"
                          width={128}
                          height={171}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-admin-muted text-xs">No image</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        ref={aboutFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAboutImageUpload}
                      />
                      <button
                        type="button"
                        onClick={() => aboutFileRef.current?.click()}
                        disabled={uploadingAbout}
                        className="px-4 py-2 bg-admin-gold text-white text-sm rounded-lg hover:bg-admin-gold/90 disabled:opacity-50"
                      >
                        {uploadingAbout ? 'Uploading...' : 'Upload Photo'}
                      </button>
                      <input
                        type="text"
                        value={settings.about_image || ''}
                        onChange={(e) => handleChange('about_image', e.target.value)}
                        placeholder="Or paste image URL"
                        className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                      />
                    </div>
                  </div>
                </div>
              )}
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm text-admin-muted mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={4}
                      className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30 resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:border-admin-gold focus:ring-1 focus:ring-admin-gold/30"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
