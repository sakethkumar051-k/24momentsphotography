import { NextRequest, NextResponse } from 'next/server';
import { getMessages, saveMessages } from '@/lib/db';
import { Message } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      event_type,
      event_date,
      location,
      message,
      referral_source,
    } = body;

    if (!full_name || !email || !event_type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existing = await getMessages();
    const now = new Date().toISOString();
    const newMessage: Message = {
      id: crypto.randomUUID(),
      full_name,
      email,
      phone: phone || '',
      event_type,
      event_date: event_date || '',
      location: location || '',
      message,
      referral_source: referral_source || '',
      read: false,
      created_at: now,
    };

    await saveMessages([newMessage, ...existing]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}
