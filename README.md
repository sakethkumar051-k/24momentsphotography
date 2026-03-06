# 24 Moments Photography

Premium photography portfolio website with a full admin dashboard.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + Storage)
- **Auth**: Supabase Auth
- **Image Processing**: Sharp.js
- **Deployment**: Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema in `supabase-schema.sql` via the Supabase SQL Editor
3. Create a storage bucket named `photos` and set it to public
4. Create an admin user in Authentication > Users

### 3. Configure environment variables

Copy `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin dashboard.

## Project Structure

```
src/
  app/
    page.tsx              # Home (Hero, About, Gallery, Video, Services, Testimonials, Contact)
    gallery/page.tsx      # Full gallery page
    videos/page.tsx       # Video showcase page
    contact/page.tsx      # Contact form page
    admin/
      login/page.tsx      # Admin login
      dashboard/page.tsx  # Dashboard with stats
      photos/page.tsx     # Photo manager (upload, edit, delete)
      videos/page.tsx     # Video manager (YouTube embeds)
      galleries/page.tsx  # Category manager
      messages/page.tsx   # Contact form submissions
      settings/page.tsx   # Site settings (info, social, about)
    api/
      photos/route.ts     # CRUD for photos
      videos/route.ts     # CRUD for videos
      categories/route.ts # CRUD for categories
      messages/route.ts   # CRUD for messages
      settings/route.ts   # Read/update site settings
      contact/route.ts    # Contact form submission
      upload/route.ts     # Image upload + Sharp processing
      youtube/route.ts    # YouTube oEmbed fetch
  components/
    ui/                   # Reusable UI components
    public/               # Public site sections
    admin/                # Admin components
  lib/                    # Utilities, Supabase client, constants
  types/                  # TypeScript type definitions
```

## Features

### Public Site
- Full-viewport cinematic hero with typed tagline
- Animated stats counters
- Masonry photo gallery with category filtering and lightbox
- YouTube video showcase with modal player
- Service cards with hover effects
- Auto-scrolling testimonials carousel
- Contact form with email/date/event type fields
- Custom gold cursor, smooth scroll, page transitions

### Admin Dashboard
- Protected routes with Supabase Auth
- Photo upload with Sharp.js (auto-resize to thumbnail/medium/full, WebP conversion)
- YouTube video management with oEmbed auto-fetch
- Gallery category management
- Message inbox with read/unread states
- Site settings manager (business info, social links, about section)
# 24momentsphotography
