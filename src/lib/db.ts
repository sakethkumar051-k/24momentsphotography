import { firestore } from '@/lib/firebaseAdmin';
import {
  type Photo,
  type Video,
  type Category,
  type Message,
  type SiteSettings,
  type Service,
  type Testimonial,
} from '@/types/database';

export async function getPhotos(): Promise<Photo[]> {
  const snapshot = await firestore.collection('photos').get();
  const photos: Photo[] = [];
  snapshot.forEach((doc) => photos.push(doc.data() as Photo));
  return photos;
}

export async function savePhotos(photos: Photo[]): Promise<void> {
  const col = firestore.collection('photos');
  const batch = firestore.batch();
  const existing = await col.get();
  const incomingIds = new Set(photos.map((p) => p.id));

  existing.forEach((doc) => {
    if (!incomingIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  photos.forEach((photo) => {
    batch.set(col.doc(photo.id), photo, { merge: true });
  });

  await batch.commit();
}

export async function getVideos(): Promise<Video[]> {
  const snapshot = await firestore.collection('videos').get();
  const videos: Video[] = [];
  snapshot.forEach((doc) => videos.push(doc.data() as Video));
  return videos;
}

export async function saveVideos(videos: Video[]): Promise<void> {
  const col = firestore.collection('videos');
  const batch = firestore.batch();
  const existing = await col.get();
  const incomingIds = new Set(videos.map((v) => v.id));

  existing.forEach((doc) => {
    if (!incomingIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  videos.forEach((video) => {
    batch.set(col.doc(video.id), video, { merge: true });
  });

  await batch.commit();
}

const defaultCategories: Category[] = [
  { id: 'weddings', name: 'Weddings', slug: 'weddings', cover_image_url: null, sort_order: 1, created_at: new Date().toISOString() },
  { id: 'sports', name: 'Sports', slug: 'sports', cover_image_url: null, sort_order: 2, created_at: new Date().toISOString() },
  { id: 'corporate', name: 'Corporate', slug: 'corporate', cover_image_url: null, sort_order: 3, created_at: new Date().toISOString() },
  { id: 'portraits', name: 'Portraits', slug: 'portraits', cover_image_url: null, sort_order: 4, created_at: new Date().toISOString() },
  { id: 'events', name: 'Events', slug: 'events', cover_image_url: null, sort_order: 5, created_at: new Date().toISOString() },
];

export async function getCategories(): Promise<Category[]> {
  const snapshot = await firestore.collection('categories').get();
  if (snapshot.empty) {
    // Seed defaults on first run
    const batch = firestore.batch();
    const col = firestore.collection('categories');
    defaultCategories.forEach((cat) => {
      batch.set(col.doc(cat.id), cat, { merge: true });
    });
    await batch.commit();
    return defaultCategories;
  }

  const categories: Category[] = [];
  snapshot.forEach((doc) => categories.push(doc.data() as Category));
  return categories;
}

export async function saveCategories(categories: Category[]): Promise<void> {
  const col = firestore.collection('categories');
  const batch = firestore.batch();
  const existing = await col.get();
  const incomingIds = new Set(categories.map((c) => c.id));

  existing.forEach((doc) => {
    if (!incomingIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  categories.forEach((category) => {
    batch.set(col.doc(category.id), category, { merge: true });
  });

  await batch.commit();
}

export async function getMessages(): Promise<Message[]> {
  const snapshot = await firestore
    .collection('messages')
    .orderBy('created_at', 'desc')
    .get();
  const messages: Message[] = [];
  snapshot.forEach((doc) => messages.push(doc.data() as Message));
  return messages;
}

export async function saveMessages(messages: Message[]): Promise<void> {
  const col = firestore.collection('messages');
  const batch = firestore.batch();
  const existing = await col.get();
  const incomingIds = new Set(messages.map((m) => m.id));

  existing.forEach((doc) => {
    if (!incomingIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  messages.forEach((message) => {
    batch.set(col.doc(message.id), message, { merge: true });
  });

  await batch.commit();
}

const defaultSettingsArray: SiteSettings[] = [
  {
    id: 'studio_name',
    key: 'studio_name',
    value: '24 Moments Photography',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tagline',
    key: 'tagline',
    value: 'Capturing Moments. Defining Legacies.',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'phone',
    key: 'phone',
    value: '+91 99999 99999',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'email',
    key: 'email',
    value: 'hello@24moments.com',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'address',
    key: 'address',
    value: 'Studio 24, Creative District, Mumbai, India',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'maps_embed',
    key: 'maps_embed',
    value: '',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'instagram',
    key: 'instagram',
    value: 'https://instagram.com/24momentsphotography',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'youtube',
    key: 'youtube',
    value: 'https://youtube.com/@24momentsphotography',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'whatsapp',
    key: 'whatsapp',
    value: '+919999999999',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'about_text',
    key: 'about_text',
    value:
      "At 24 Moments Photography, we believe every frame tells a story. With over a decade of experience capturing life's most precious moments, our team of passionate photographers brings an editorial eye and cinematic sensibility to every project.",
    updated_at: new Date().toISOString(),
  },
  {
    id: 'about_image',
    key: 'about_image',
    value: '',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'about_paragraph_1',
    key: 'about_paragraph_1',
    value:
      "At 24 Moments Photography, we believe every frame tells a story. With over a decade of experience capturing life's most precious moments, our team of passionate photographers brings an editorial eye and cinematic sensibility to every project.",
    updated_at: new Date().toISOString(),
  },
  {
    id: 'about_paragraph_2',
    key: 'about_paragraph_2',
    value:
      'From intimate portraits to grand celebrations, we craft visual narratives that transcend time. Our commitment to excellence has earned the trust of hundreds of clients across the globe, making us a name synonymous with luxury photography.',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'stat_years_experience',
    key: 'stat_years_experience',
    value: '12',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'stat_happy_clients',
    key: 'stat_happy_clients',
    value: '500',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'stat_photos_delivered',
    key: 'stat_photos_delivered',
    value: '50000',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'stat_events_covered',
    key: 'stat_events_covered',
    value: '1000',
    updated_at: new Date().toISOString(),
  },
];

export async function getSettingsMap(): Promise<Record<string, string>> {
  const snapshot = await firestore.collection('settings').get();

  if (snapshot.empty) {
    const now = new Date().toISOString();
    const batch = firestore.batch();
    const col = firestore.collection('settings');

    defaultSettingsArray.forEach((row) => {
      const docRef = col.doc(row.key);
      batch.set(docRef, { ...row, updated_at: now }, { merge: true });
    });

    await batch.commit();
  }

  const latest = await firestore.collection('settings').get();
  const map: Record<string, string> = {};
  latest.forEach((doc) => {
    const data = doc.data() as SiteSettings;
    map[data.key] = data.value;
  });
  return map;
}

export async function saveSettingsMap(input: Record<string, string>): Promise<void> {
  const now = new Date().toISOString();
  const col = firestore.collection('settings');
  const batch = firestore.batch();

  Object.entries(input).forEach(([key, value]) => {
    const doc: SiteSettings = {
      id: key,
      key,
      value,
      updated_at: now,
    };
    batch.set(col.doc(key), doc, { merge: true });
  });

  await batch.commit();
}

const defaultServices: Service[] = [
  {
    id: 'wedding',
    title: 'Wedding Photography',
    description:
      'Timeless coverage of your most important day. From preparation to reception, every moment preserved with cinematic elegance.',
    icon: 'heart',
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sports',
    title: 'Sports Events',
    description:
      'High-speed, high-impact photography that captures the raw energy and decisive moments of athletic competition.',
    icon: 'trophy',
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'corporate',
    title: 'Corporate Events',
    description:
      'Professional coverage for conferences, galas, product launches, and corporate milestones.',
    icon: 'building',
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'portraits',
    title: 'Portrait Sessions',
    description:
      'Individual, couple, or family portraits crafted with studio precision or natural-light artistry.',
    icon: 'user',
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'albums',
    title: 'Albums & Prints',
    description:
      'Museum-quality prints and handcrafted albums that transform your photographs into tangible heirlooms.',
    icon: 'book',
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
];

export async function getServices(): Promise<Service[]> {
  const snapshot = await firestore.collection('services').get();
  if (snapshot.empty) {
    const batch = firestore.batch();
    const col = firestore.collection('services');
    defaultServices.forEach((service) => {
      batch.set(col.doc(service.id), service, { merge: true });
    });
    await batch.commit();
    return defaultServices;
  }

  const services: Service[] = [];
  snapshot.forEach((doc) => services.push(doc.data() as Service));
  return services;
}

export async function saveServices(services: Service[]): Promise<void> {
  const col = firestore.collection('services');
  const batch = firestore.batch();
  const existing = await col.get();
  const incomingIds = new Set(services.map((s) => s.id));

  existing.forEach((doc) => {
    if (!incomingIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  services.forEach((service) => {
    batch.set(col.doc(service.id), service, { merge: true });
  });

  await batch.commit();
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "24 Moments captured our wedding with such grace and artistry. Every photograph tells a story we'll cherish forever.",
    client_name: 'Priya & Rahul',
    event_type: 'Wedding',
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    quote:
      "The team's ability to capture split-second moments during our tournament was extraordinary. Pure professionalism.",
    client_name: 'Delhi Sports Club',
    event_type: 'Sports Event',
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    quote:
      'Our corporate gala photographs exceeded all expectations. The attention to detail and lighting was impeccable.',
    client_name: 'Anika Sharma, CEO',
    event_type: 'Corporate Event',
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    quote:
      'The portrait session felt effortless. They made us feel completely natural, and the results were stunning.',
    client_name: 'The Mehta Family',
    event_type: 'Portrait Session',
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

export async function getTestimonials(): Promise<Testimonial[]> {
  const snapshot = await firestore.collection('testimonials').get();
  if (snapshot.empty) {
    const batch = firestore.batch();
    const col = firestore.collection('testimonials');
    defaultTestimonials.forEach((t) => {
      batch.set(col.doc(t.id), t, { merge: true });
    });
    await batch.commit();
    return defaultTestimonials;
  }

  const testimonials: Testimonial[] = [];
  snapshot.forEach((doc) => testimonials.push(doc.data() as Testimonial));
  return testimonials;
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<void> {
  const col = firestore.collection('testimonials');
  const batch = firestore.batch();
  const existing = await col.get();
  const incomingIds = new Set(testimonials.map((t) => t.id));

  existing.forEach((doc) => {
    if (!incomingIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  testimonials.forEach((testimonial) => {
    batch.set(col.doc(testimonial.id), testimonial, { merge: true });
  });

  await batch.commit();
}

