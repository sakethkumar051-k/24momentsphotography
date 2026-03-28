import { NextRequest, NextResponse } from 'next/server';
import { getReviews, saveReview, deleteReview } from '@/lib/db';
import type { ClientReview } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const reviews = await getReviews();
    const filtered = status ? reviews.filter((r) => r.status === status) : reviews;
    return NextResponse.json(filtered);
  } catch (err) {
    console.error('Reviews fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.client_name?.trim() || !body.quote?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: 'Name, email, and review are required' }, { status: 400 });
    }

    const review: ClientReview = {
      id: crypto.randomUUID(),
      client_name: body.client_name.trim(),
      email: body.email.trim(),
      event_type: body.event_type || '',
      quote: body.quote.trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    await saveReview(review);
    return NextResponse.json({ success: true, message: 'Review submitted for approval' });
  } catch (err) {
    console.error('Review create error:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const reviews = await getReviews();
    const existing = reviews.find((r) => r.id === body.id);
    if (!existing) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    const updated: ClientReview = { ...existing, ...body };
    await saveReview(updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Review update error:', err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing review ID' }, { status: 400 });
    await deleteReview(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Review delete error:', err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
