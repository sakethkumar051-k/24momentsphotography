import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { getSiteUrl } from '@/lib/site';

const title = 'Gallery';
const description =
  'Browse the full photography portfolio: weddings, sports, corporate, portraits, and more — 24 Moments Photography, Hyderabad & India.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${getSiteUrl()}/gallery`,
    locale: 'en_IN',
  },
  twitter: {
    title: `${title} | ${SITE_NAME}`,
    description,
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
