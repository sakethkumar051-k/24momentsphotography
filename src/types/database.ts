export interface Photo {
  id: string;
  title: string;
  alt_text: string;
  category_id: string | null;
  tags: string[];
  url_thumbnail: string;
  url_medium: string;
  url_full: string;
  width: number;
  height: number;
  featured: boolean;
  // Visibility controls
  // show_on_home: should this image be eligible for the homepage “Selected Works” section?
  // show_in_gallery: should this image appear on the /gallery page?
  show_on_home?: boolean;
  show_in_gallery?: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string;
  category: 'highlight_reels' | 'behind_the_scenes' | 'client_stories';
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  cover_image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Message {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  location: string;
  message: string;
  referral_source: string;
  read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  client_name: string;
  event_type: string;
  client_photo_url?: string;
  rating?: number;
  featured?: boolean;
  sort_order: number;
  created_at: string;
}

export interface DashboardStats {
  totalPhotos: number;
  totalVideos: number;
  totalMessages: number;
  unreadMessages: number;
}
