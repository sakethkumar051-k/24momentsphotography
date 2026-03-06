import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost, Cinzel } from 'next/font/google';
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

export const metadata: Metadata = {
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
  openGraph: {
    title: '24 Moments Photography',
    description: 'Capturing Moments. Defining Legacies.',
    url: process.env.NEXT_PUBLIC_SITE_URL,
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${cinzel.variable}`}>
      <body className="bg-background text-foreground font-body antialiased">
        {children}
      </body>
    </html>
  );
}
