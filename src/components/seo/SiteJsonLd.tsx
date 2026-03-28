import {
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SAME_AS_URLS,
  SITE_TAGLINE,
} from '@/lib/constants';
import { getOptionalBusinessAddress, getSiteUrl } from '@/lib/site';

export default function SiteJsonLd() {
  const url = getSiteUrl();
  const address = getOptionalBusinessAddress();

  const organization: Record<string, unknown> = {
    '@type': 'PhotographyStudio',
    '@id': `${url}/#organization`,
    name: SITE_NAME,
    alternateName: [...SITE_ALTERNATE_NAMES],
    slogan: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    url,
    image: [`${url}/logo.png`, `${url}/opengraph-image`],
    sameAs: [...SITE_SAME_AS_URLS],
  };

  if (address && (address.addressLocality || address.addressRegion)) {
    organization.address = {
      '@type': 'PostalAddress',
      ...(address.streetAddress ? { streetAddress: address.streetAddress } : {}),
      ...(address.addressLocality ? { addressLocality: address.addressLocality } : {}),
      ...(address.addressRegion ? { addressRegion: address.addressRegion } : {}),
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
      addressCountry: address.addressCountry,
    };
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: SITE_NAME,
        alternateName: [...SITE_ALTERNATE_NAMES],
        description: SITE_DESCRIPTION,
        inLanguage: 'en-IN',
        publisher: { '@id': `${url}/#organization` },
      },
      organization,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
