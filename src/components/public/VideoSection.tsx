'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Modal from '@/components/ui/Modal';
import { VIDEO_CATEGORIES } from '@/lib/constants';
import type { Video } from '@/types/database';

const placeholderVideos: Video[] = [
  {
    id: '1',
    title: 'Wedding Highlight Reel',
    description: 'A cinematic journey through a magical celebration',
    youtube_url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_id: 'dQw4w9WgXcQ',
    thumbnail_url: '',
    category: 'highlight_reels',
    visible: true,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Behind the Lens',
    description: 'A look at how we capture your moments',
    youtube_url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_id: 'dQw4w9WgXcQ',
    thumbnail_url: '',
    category: 'behind_the_scenes',
    visible: true,
    sort_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Client Testimonial',
    description: 'Hear from our delighted clients',
    youtube_url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_id: 'dQw4w9WgXcQ',
    thumbnail_url: '',
    category: 'client_stories',
    visible: true,
    sort_order: 2,
    created_at: '',
    updated_at: '',
  },
];

export default function VideoSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Only show videos marked visible
          setVideos(data.filter((v) => v.visible !== false));
        } else {
          setVideos([]);
        }
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const displayVideos = videos.length ? videos : placeholderVideos;

  const filteredVideos =
    activeCategory === 'all'
      ? displayVideos
      : displayVideos.filter((v) => v.category === activeCategory);

  return (
    <section className="relative py-32 md:py-40 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          label="Films"
          title="Motion Stories"
          subtitle="Cinematic narratives that bring your moments to life"
        />

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveCategory('all')}
            className={`font-accent text-xs tracking-[0.2em] uppercase px-5 py-2.5 rounded-[3px] transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-gold text-background'
                : 'text-muted hover:text-foreground border border-border hover:border-gold/30'
            }`}
          >
            All
          </button>
          {VIDEO_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`font-accent text-xs tracking-[0.2em] uppercase px-5 py-2.5 rounded-[3px] transition-all duration-300 ${
                activeCategory === cat.value
                  ? 'bg-gold text-background'
                  : 'text-muted hover:text-foreground border border-border hover:border-gold/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-surface-light rounded-[3px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative aspect-video bg-surface-light rounded-[3px] overflow-hidden cursor-pointer"
                  onClick={() => setPlayingVideo(video)}
                  data-cursor="pointer"
                >
                  {video.thumbnail_url ? (
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface">
                      <span className="font-display text-6xl text-gold/10">24</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-background/40 group-hover:bg-background/60 transition-colors duration-300" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center bg-background/30 backdrop-blur-sm"
                    >
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        className="ml-1"
                      >
                        <path d="M0 0L20 12L0 24V0Z" fill="#D4A017" />
                      </svg>
                    </motion.div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-xl text-foreground">{video.title}</h3>
                    <p className="text-muted text-sm mt-1 line-clamp-1">{video.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!playingVideo}
        onClose={() => setPlayingVideo(null)}
        className="w-[90vw] max-w-5xl aspect-video"
      >
        {playingVideo && (
          <div className="relative w-full h-full rounded-[3px] overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${playingVideo.youtube_id}?autoplay=1&rel=0`}
              title={playingVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-background/80 rounded-full text-foreground hover:text-gold transition-colors z-10"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
