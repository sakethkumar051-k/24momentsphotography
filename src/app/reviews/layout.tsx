import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { getSiteUrl } from '@/lib/site';

const title = 'Reviews';
const description =
  'Read client reviews and share your own experience with 24 Moments Photography.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/reviews' },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${getSiteUrl()}/reviews`,
    locale: 'en_IN',
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
