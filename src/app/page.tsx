'use client';

import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import GallerySection from '@/components/public/GallerySection';
import VideoSection from '@/components/public/VideoSection';
import Services from '@/components/public/Services';
import Testimonials from '@/components/public/Testimonials';
import ContactForm from '@/components/public/ContactForm';
import Footer from '@/components/public/Footer';

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navbar />
        <main>
          <Hero />
          <About />
          {/* Homepage highlight: shows only featured photos */}
          <GallerySection mode="home" />
          <VideoSection />
          <Services />
          <Testimonials />
          <ContactForm />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
