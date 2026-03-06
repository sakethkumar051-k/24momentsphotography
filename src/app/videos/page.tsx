'use client';

import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import Navbar from '@/components/public/Navbar';
import VideoSection from '@/components/public/VideoSection';
import Footer from '@/components/public/Footer';
import PageTransition from '@/components/ui/PageTransition';

export default function VideosPage() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navbar />
        <PageTransition>
          <main className="pt-20">
            <VideoSection />
          </main>
        </PageTransition>
        <Footer />
      </SmoothScroll>
    </>
  );
}
