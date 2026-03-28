import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '24 Moments Photography',
    short_name: '24 Moments',
    description:
      'Premium photography for weddings, sports, corporate events, and portraits.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    lang: 'en',
  };
}
