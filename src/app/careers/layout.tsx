import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { getSiteUrl } from '@/lib/site';

const title = 'Careers';
const description =
  'Join the 24 Moments Photography team. Browse open roles in photography, editing, and creative production.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/careers' },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${getSiteUrl()}/careers`,
    locale: 'en_IN',
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
