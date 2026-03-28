export const SITE_NAME = '24 Moments Photography';
export const SITE_TAGLINE = 'Capturing Moments. Defining Legacies.';
/** Meta description: include brand + domain phrases people search for. */
export const SITE_DESCRIPTION =
  'Official website of 24 Moments Photography (Team 24 Moments). Wedding, corporate, sports, and portrait photography in Hyderabad and across India — team24momentsphotography.in.';

/** Extra names Google and users may associate with your site (JSON-LD alternateName + keywords). */
export const SITE_ALTERNATE_NAMES = [
  'Team 24 Moments Photography',
  'Team24 Moments Photography',
  'team24momentsphotography',
  'team24momentsphotography.in',
  '24 Moments',
] as const;

export const SITE_SEO_KEYWORDS = [
  'team24momentsphotography',
  'team24momentsphotography.in',
  '24 Moments Photography',
  'Team 24 Moments',
  'wedding photographer Hyderabad',
  'corporate event photography India',
  'sports photography',
  'portrait photography',
] as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Films', href: '/videos' },
  { label: 'Contact', href: '/contact' },
] as const;

export const EVENT_TYPES = [
  'Wedding',
  'Sports Event',
  'Corporate Event',
  'Portrait Session',
  'Birthday / Celebration',
  'Concert / Festival',
  'Fashion Shoot',
  'Other',
] as const;

export const REFERRAL_SOURCES = [
  'Instagram',
  'Facebook',
  'YouTube',
  'Google Search',
  'Friend / Family',
  'Previous Client',
  'Wedding Planner',
  'Other',
] as const;

export const VIDEO_CATEGORIES = [
  { value: 'highlight_reels', label: 'Highlight Reels' },
  { value: 'behind_the_scenes', label: 'Behind the Scenes' },
  { value: 'client_stories', label: 'Client Stories' },
] as const;

export const SOCIAL_LINKS = {
  /** Match your live Instagram handle (used in footer + JSON-LD sameAs). */
  instagram: 'https://www.instagram.com/24moments_photography_/',
  facebook: 'https://facebook.com/24momentsphotography',
  youtube: 'https://www.youtube.com/@24momentsphotography',
  tiktok: 'https://tiktok.com/@24momentsphotography',
  whatsapp: 'https://wa.me/919999999999',
} as const;

/** Profiles to connect your website entity in Google (keep URLs real and public). */
export const SITE_SAME_AS_URLS: readonly string[] = [
  SOCIAL_LINKS.instagram,
  SOCIAL_LINKS.youtube,
];

export const IMAGE_SIZES = {
  thumbnail: 400,
  medium: 1200,
  full: 2400,
} as const;

export const ASPECT_RATIOS = [
  { label: 'Free', value: undefined },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
] as const;
