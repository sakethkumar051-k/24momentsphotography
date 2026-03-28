import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { getSiteUrl } from '@/lib/site';

const title = 'Contact';
const description =
  'Book wedding, corporate, or portrait photography — contact Team 24 Moments (team24momentsphotography.in).';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${getSiteUrl()}/contact`,
    locale: 'en_IN',
  },
  twitter: {
    title: `${title} | ${SITE_NAME}`,
    description,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
