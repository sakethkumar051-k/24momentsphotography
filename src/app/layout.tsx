import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost, Cinzel } from 'next/font/google';
import SiteJsonLd from '@/components/seo/SiteJsonLd';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-accent',
  display: 'swap',
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '24 Moments Photography | Premium Photography Services',
    template: '%s | 24 Moments Photography',
  },
  description:
    'Premium photography services for weddings, sports, corporate events, and portraits. Capturing moments. Defining legacies.',
  keywords: [
    'photography',
    'wedding photography',
    'sports photography',
    'corporate photography',
    'portrait photography',
    '24 moments',
    'luxury photography',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '24 Moments Photography',
    description: 'Capturing Moments. Defining Legacies.',
    url: siteUrl,
    siteName: '24 Moments Photography',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '24 Moments Photography',
    description: 'Capturing Moments. Defining Legacies.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'photography',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${cinzel.variable}`}>
      <body className="bg-background text-foreground font-body antialiased">
        <SiteJsonLd />
        {children}
      </body>
    </html>
  );
}
