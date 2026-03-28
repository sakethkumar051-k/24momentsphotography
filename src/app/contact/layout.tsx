import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

const title = 'Contact';
const description =
  'Get in touch to book a session or ask about wedding, event, and portrait photography.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `${title} | 24 Moments Photography`,
    description,
    url: `${getSiteUrl()}/contact`,
  },
  twitter: {
    title: `${title} | 24 Moments Photography`,
    description,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
