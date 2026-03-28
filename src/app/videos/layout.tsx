import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

const title = 'Videos';
const description =
  'Watch highlight films and motion work from 24 Moments Photography.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/videos' },
  openGraph: {
    title: `${title} | 24 Moments Photography`,
    description,
    url: `${getSiteUrl()}/videos`,
  },
  twitter: {
    title: `${title} | 24 Moments Photography`,
    description,
  },
};

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
