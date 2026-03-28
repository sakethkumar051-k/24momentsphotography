import { getSiteUrl } from '@/lib/site';

const DESCRIPTION =
  'Premium photography services for weddings, sports, corporate events, and portraits. Capturing moments. Defining legacies.';

export default function SiteJsonLd() {
  const url = getSiteUrl();
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: '24 Moments Photography',
        description: DESCRIPTION,
        inLanguage: 'en-US',
        publisher: { '@id': `${url}/#business` },
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${url}/#business`,
        name: '24 Moments Photography',
        description: DESCRIPTION,
        url,
        image: `${url}/opengraph-image`,
        areaServed: 'Worldwide',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
