import { NextRequest, NextResponse } from 'next/server';
import { getMessages, saveMessages } from '@/lib/db';
import type { Message } from '@/types/database';

export async function GET() {
  try {
    const messages = await getMessages();
    const sorted = messages.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return NextResponse.json(sorted);
  } catch (err) {
    console.error('Messages fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body as Partial<Message> & { id: string };

    const messages = await getMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const updated: Message = {
      ...messages[index],
      ...updates,
    };
    messages[index] = updated;
    await saveMessages(messages);

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Message update error:', err);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing message ID' }, { status: 400 });
    }

    const messages = await getMessages();
    const filtered = messages.filter((m) => m.id !== id);
    await saveMessages(filtered);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Message delete error:', err);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
