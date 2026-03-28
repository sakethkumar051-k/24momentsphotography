/**
 * Canonical site origin for metadata, sitemap, and structured data.
 * Always set NEXT_PUBLIC_SITE_URL in production to your live origin (https://…, no trailing slash).
 * Default matches the primary .in domain so builds are correct if the env var is missing.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://team24momentsphotography.in';
  return raw.replace(/\/$/, '');
}

export type BusinessPostalAddress = {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
};

/**
 * Optional address for LocalBusiness JSON-LD (helps local search).
 * Set in production, e.g. NEXT_PUBLIC_BUSINESS_LOCALITY=Hyderabad, NEXT_PUBLIC_BUSINESS_REGION=Telangana
 */
export function getOptionalBusinessAddress(): BusinessPostalAddress | null {
  const locality = process.env.NEXT_PUBLIC_BUSINESS_LOCALITY?.trim();
  const region = process.env.NEXT_PUBLIC_BUSINESS_REGION?.trim();
  if (!locality && !region) return null;

  return {
    streetAddress: process.env.NEXT_PUBLIC_BUSINESS_STREET_ADDRESS?.trim() || undefined,
    addressLocality: locality || undefined,
    addressRegion: region || undefined,
    postalCode: process.env.NEXT_PUBLIC_BUSINESS_POSTAL_CODE?.trim() || undefined,
    addressCountry: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY?.trim() || 'IN',
  };
}
