import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, saveTestimonials } from '@/lib/db';
import type { Testimonial } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get('featured') === 'true';

    const testimonials = await getTestimonials();
    let filtered = testimonials;
    if (featuredOnly) {
      filtered = testimonials.filter((t) => t.featured !== false);
    }
    const sorted = filtered.slice().sort((a, b) => a.sort_order - b.sort_order);
    return NextResponse.json(sorted);
  } catch (err) {
    console.error('Testimonials fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await getTestimonials();
    const now = new Date().toISOString();

    const newTestimonial: Testimonial = {
      id: crypto.randomUUID(),
      quote: body.quote || '',
      client_name: body.client_name || '',
      event_type: body.event_type || '',
      client_photo_url: body.client_photo_url || undefined,
      rating: body.rating != null ? Math.min(5, Math.max(1, body.rating)) : undefined,
      featured: body.featured ?? true,
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : existing.length,
      created_at: now,
    };

    await saveTestimonials([...existing, newTestimonial]);

    return NextResponse.json(newTestimonial);
  } catch (err) {
    console.error('Testimonial create error:', err);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body as Partial<Testimonial> & { id: string };

    const testimonials = await getTestimonials();
    const index = testimonials.findIndex((t) => t.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const updated: Testimonial = {
      ...testimonials[index],
      ...updates,
      rating: updates.rating != null ? Math.min(5, Math.max(1, updates.rating)) : testimonials[index].rating,
    };

    testimonials[index] = updated;
    await saveTestimonials(testimonials);

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Testimonial update error:', err);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing testimonial ID' }, { status: 400 });
    }

    const testimonials = await getTestimonials();
    const filtered = testimonials.filter((t) => t.id !== id);
    await saveTestimonials(filtered);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Testimonial delete error:', err);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
