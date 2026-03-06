import { NextRequest, NextResponse } from 'next/server';
import { getPhotos, savePhotos } from '@/lib/db';
import type { Photo } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let photos = await getPhotos();

    if (category && category !== 'all') {
      photos = photos.filter((p) => p.category_id === category);
    }

    if (featured === 'true') {
      // Featured query is now simply “eligible for homepage”
      photos = photos.filter((p) => p.show_on_home ?? true);
    } else {
      // Default listing: only photos that should appear in the gallery
      photos = photos.filter((p) => p.show_in_gallery ?? true);
    }

    photos = photos.sort((a, b) => a.sort_order - b.sort_order);
    const sliced = photos.slice(offset, offset + limit);

    return NextResponse.json(sliced);
  } catch (err) {
    console.error('Photos fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await getPhotos();
    const now = new Date().toISOString();

    const show_on_home: boolean = body.show_on_home ?? true;
    const show_in_gallery: boolean = body.show_in_gallery ?? true;

    const newPhoto: Photo = {
      id: crypto.randomUUID(),
      title: body.title || '',
      alt_text: body.alt_text || '',
      category_id: body.category_id || null,
      tags: body.tags || [],
      url_thumbnail: body.url_thumbnail,
      url_medium: body.url_medium,
      url_full: body.url_full,
      width: body.width || 0,
      height: body.height || 0,
      featured: show_on_home, // keep for backwards compatibility, but not exposed in UI
      show_on_home,
      show_in_gallery,
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : existing.length,
      created_at: now,
      updated_at: now,
    };

    await savePhotos([...existing, newPhoto]);

    return NextResponse.json(newPhoto);
  } catch (err) {
    console.error('Photo create error:', err);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body as Partial<Photo> & { id: string };

    const photos = await getPhotos();
    const index = photos.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const next_show_on_home =
      updates.show_on_home !== undefined
        ? updates.show_on_home
        : photos[index].show_on_home ?? true;
    const next_show_in_gallery =
      updates.show_in_gallery !== undefined
        ? updates.show_in_gallery
        : photos[index].show_in_gallery ?? true;

    const updated: Photo = {
      ...photos[index],
      ...updates,
      show_on_home: next_show_on_home,
      show_in_gallery: next_show_in_gallery,
      featured: next_show_on_home, // keep in sync but unused in UI
      updated_at: new Date().toISOString(),
    };

    photos[index] = updated;
    await savePhotos(photos);

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Photo update error:', err);
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing photo ID' }, { status: 400 });
    }

    const photos = await getPhotos();
    const filtered = photos.filter((p) => p.id !== id);
    await savePhotos(filtered);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Photo delete error:', err);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
