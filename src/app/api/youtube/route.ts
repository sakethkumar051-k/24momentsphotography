import { NextRequest, NextResponse } from 'next/server';
import { extractYouTubeId, getYouTubeThumbnail, fetchYouTubeOEmbed } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const oembed = await fetchYouTubeOEmbed(url);

    return NextResponse.json({
      youtube_id: videoId,
      title: oembed?.title || '',
      thumbnail_url: getYouTubeThumbnail(videoId, 'hq'),
    });
  } catch (err) {
    console.error('YouTube fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 });
  }
}
