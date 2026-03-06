'use client';

import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import Navbar from '@/components/public/Navbar';
import GallerySection from '@/components/public/GallerySection';
import Footer from '@/components/public/Footer';
import PageTransition from '@/components/ui/PageTransition';

export default function GalleryPage() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navbar />
        <PageTransition>
          <main className="pt-20">
            {/* Full gallery: all photos with category filters */}
            <GallerySection mode="all" />
          </main>
        </PageTransition>
        <Footer />
      </SmoothScroll>
    </>
  );
}
