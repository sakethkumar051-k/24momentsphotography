import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { getSiteUrl } from '@/lib/site';

const title = 'Videos';
const description =
  'Watch highlight films and motion work from 24 Moments Photography, Hyderabad & India.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/videos' },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${getSiteUrl()}/videos`,
    locale: 'en_IN',
  },
  twitter: {
    title: `${title} | ${SITE_NAME}`,
    description,
  },
};

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
