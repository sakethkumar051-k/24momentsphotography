'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Modal from '@/components/ui/Modal';
import type { Photo, Category } from '@/types/database';

interface GallerySectionProps {
  /**
   * mode = 'home' → show only featured photos for the homepage highlight section
   * mode = 'all'  → show all photos for the full gallery page
   */
  mode?: 'home' | 'all';
}

export default function GallerySection({ mode = 'all' }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let photosData: Photo[] = [];

        if (mode === 'home') {
          // First try: only featured photos for homepage section
          const featuredRes = await fetch('/api/photos?featured=true&limit=24');
          const featuredJson = await featuredRes.json();
          if (Array.isArray(featuredJson) && featuredJson.length > 0) {
            photosData = featuredJson;
          } else {
            // Fallback: show latest photos so homepage never feels empty
            const allRes = await fetch('/api/photos?limit=24');
            const allJson = await allRes.json();
            if (Array.isArray(allJson)) photosData = allJson;
          }
        } else {
          const allRes = await fetch('/api/photos?limit=200');
          const allJson = await allRes.json();
          if (Array.isArray(allJson)) photosData = allJson;
        }

        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();

        setPhotos(photosData);
        if (Array.isArray(categoriesData)) setCategories(categoriesData);
      } catch (err) {
        console.error('Public gallery fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode]);

  const allCategory: Category = {
    id: 'all',
    name: 'All',
    slug: 'all',
    cover_image_url: null,
    sort_order: 0,
    created_at: '',
  };

  const displayCategories = [allCategory, ...categories];

  const filteredPhotos =
    activeCategory === 'all'
      ? photos.filter((p) =>
          mode === 'home' ? (p.show_on_home ?? true) : (p.show_in_gallery ?? true)
        )
      : photos.filter(
          (p) =>
            p.category_id === activeCategory &&
            (mode === 'home' ? (p.show_on_home ?? true) : (p.show_in_gallery ?? true))
        );

  const handlePrev = useCallback(() => {
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    }
  }, [selectedPhoto]);

  const handleNext = useCallback(() => {
    if (selectedPhoto !== null && selectedPhoto < filteredPhotos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    }
  }, [selectedPhoto, filteredPhotos.length]);

  return (
    <section className="relative py-32 md:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {mode === 'home' ? (
          <SectionHeading
            label="Portfolio"
            title="Selected Works"
            subtitle="A rotating selection of featured images from across our galleries"
          />
        ) : (
          <SectionHeading
            label="Gallery"
            title="Full Portfolio"
            subtitle="Explore our work across weddings, sports, corporate events, portraits, and more"
            align="left"
          />
        )}

        {mode === 'all' && (
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`font-accent text-xs tracking-[0.2em] uppercase px-5 py-2.5 rounded-[3px] transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-gold text-background'
                    : 'text-muted hover:text-foreground border border-border hover:border-gold/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="mb-4 h-64 bg-surface-light rounded-[3px] animate-pulse"
              />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <p className="text-muted text-sm">
            No photos have been added yet. Upload photos from the admin panel to
            see them here.
          </p>
        ) : mode === 'home' ? (
          // Homepage: curated, even-height grid with gentle motion
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  exit={{ opacity: 0, y: -20, scale: 0.96 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative cursor-pointer overflow-hidden rounded-[3px] shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                  onClick={() => setSelectedPhoto(index)}
                  data-cursor="pointer"
                >
                  <div className="relative bg-surface-light aspect-3/4">
                    {photo.url_medium ? (
                      <Image
                        src={photo.url_medium}
                        alt={photo.alt_text}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface">
                        <span className="font-display text-6xl text-gold/10">24</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="font-display text-lg text-foreground">{photo.title}</p>
                    </div>
                    <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-500 rounded-[3px]" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Full gallery: flowing masonry-style layout
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-[3px]"
                  onClick={() => setSelectedPhoto(index)}
                  data-cursor="pointer"
                >
                  <div
                    className="relative bg-surface-light"
                    style={{ aspectRatio: `${photo.width}/${photo.height}` }}
                  >
                    {photo.url_medium ? (
                      <Image
                        src={photo.url_medium}
                        alt={photo.alt_text}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface">
                        <span className="font-display text-6xl text-gold/10">24</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="font-display text-lg text-foreground">{photo.title}</p>
                    </div>
                    <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-all duration-500 rounded-[3px]" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        className="relative w-[90vw] h-[90vh] flex items-center justify-center"
      >
        {selectedPhoto !== null && filteredPhotos[selectedPhoto] && (
          <div className="relative w-full h-full flex items-center justify-center">
            {filteredPhotos[selectedPhoto].url_full ? (
              <Image
                src={filteredPhotos[selectedPhoto].url_full}
                alt={filteredPhotos[selectedPhoto].alt_text}
                fill
                className="object-contain"
                sizes="90vw"
              />
            ) : (
              <div className="w-full max-w-2xl aspect-3/2 bg-surface flex items-center justify-center rounded-[3px]">
                <span className="font-display text-8xl text-gold/10">24</span>
              </div>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="font-display text-xl text-foreground">
                {filteredPhotos[selectedPhoto].title}
              </p>
              <p className="text-muted text-sm mt-1">
                {selectedPhoto + 1} / {filteredPhotos.length}
              </p>
            </div>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
