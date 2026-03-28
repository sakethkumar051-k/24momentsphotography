/**
 * Canonical site origin for metadata, sitemap, and structured data.
 * Set NEXT_PUBLIC_SITE_URL in production (https://yourdomain.com, no trailing slash).
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://24moments.com';
  return raw.replace(/\/$/, '');
}
