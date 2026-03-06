export const SITE_NAME = '24 Moments Photography';
export const SITE_TAGLINE = 'Capturing Moments. Defining Legacies.';
export const SITE_DESCRIPTION =
  'Premium photography services for weddings, sports, corporate events, and portraits. Based in India, serving worldwide.';

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
  instagram: 'https://instagram.com/24momentsphotography',
  facebook: 'https://facebook.com/24momentsphotography',
  youtube: 'https://youtube.com/@24momentsphotography',
  tiktok: 'https://tiktok.com/@24momentsphotography',
  whatsapp: 'https://wa.me/919999999999',
} as const;

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
