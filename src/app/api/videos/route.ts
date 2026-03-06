import { NextRequest, NextResponse } from 'next/server';
import { getVideos, saveVideos } from '@/lib/db';
import type { Video } from '@/types/database';

export async function GET() {
  try {
    const videos = await getVideos();
    const sorted = videos.slice().sort((a, b) => a.sort_order - b.sort_order);
    return NextResponse.json(sorted);
  } catch (err) {
    console.error('Videos fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const videos = await getVideos();
    const now = new Date().toISOString();

    const newVideo: Video = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || '',
      youtube_url: body.youtube_url,
      youtube_id: body.youtube_id,
      thumbnail_url: body.thumbnail_url,
      category: body.category,
      visible: body.visible ?? true,
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : videos.length,
      created_at: now,
      updated_at: now,
    };

    await saveVideos([...videos, newVideo]);

    return NextResponse.json(newVideo);
  } catch (err) {
    console.error('Video create error:', err);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body as Partial<Video> & { id: string };

    const videos = await getVideos();
    const index = videos.findIndex((v) => v.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const updated: Video = {
      ...videos[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    videos[index] = updated;
    await saveVideos(videos);

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Video update error:', err);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
    }

    const videos = await getVideos();
    const filtered = videos.filter((v) => v.id !== id);
    await saveVideos(filtered);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Video delete error:', err);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
