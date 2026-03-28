import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost, Cinzel } from 'next/font/google';
import SiteJsonLd from '@/components/seo/SiteJsonLd';
import { SITE_DESCRIPTION, SITE_NAME, SITE_SEO_KEYWORDS, SITE_TAGLINE } from '@/lib/constants';
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
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | team24momentsphotography.in`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    ...SITE_SEO_KEYWORDS,
    'photography',
    'wedding photography',
    'luxury photography',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: siteUrl,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_TAGLINE,
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
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
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
    <html lang="en-IN" className={`${cormorant.variable} ${jost.variable} ${cinzel.variable}`}>
      <body className="bg-background text-foreground font-body antialiased">
        <SiteJsonLd />
        {children}
      </body>
    </html>
  );
}
