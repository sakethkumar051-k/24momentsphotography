import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

const title = 'Gallery';
const description =
  'Browse the full photography portfolio: weddings, sports, corporate, portraits, and more.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: `${title} | 24 Moments Photography`,
    description,
    url: `${getSiteUrl()}/gallery`,
  },
  twitter: {
    title: `${title} | 24 Moments Photography`,
    description,
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
