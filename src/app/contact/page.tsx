'use client';

import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import Navbar from '@/components/public/Navbar';
import ContactForm from '@/components/public/ContactForm';
import Footer from '@/components/public/Footer';
import PageTransition from '@/components/ui/PageTransition';

export default function ContactPage() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navbar />
        <PageTransition>
          <main className="pt-20">
            <ContactForm />
          </main>
        </PageTransition>
        <Footer />
      </SmoothScroll>
    </>
  );
}
