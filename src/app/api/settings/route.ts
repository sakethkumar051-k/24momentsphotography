import { NextRequest, NextResponse } from 'next/server';
import { getSettingsMap, saveSettingsMap } from '@/lib/db';

export async function GET() {
  try {
    const settings = await getSettingsMap();
    return NextResponse.json(settings);
  } catch (err) {
    console.error('Settings fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await saveSettingsMap(body as Record<string, string>);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Settings update error:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
