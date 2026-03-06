import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategories } from '@/lib/db';
import type { Category } from '@/types/database';

export async function GET() {
  try {
    const categories = await getCategories();
    const sorted = categories.slice().sort((a, b) => a.sort_order - b.sort_order);
    return NextResponse.json(sorted);
  } catch (err) {
    console.error('Categories fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const categories = await getCategories();
    const now = new Date().toISOString();

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: body.name,
      slug: body.slug,
      cover_image_url: body.cover_image_url || null,
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : categories.length + 1,
      created_at: now,
    };

    await saveCategories([...categories, newCategory]);

    return NextResponse.json(newCategory);
  } catch (err) {
    console.error('Category create error:', err);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body as Partial<Category> & { id: string };

    const categories = await getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updated: Category = {
      ...categories[index],
      ...updates,
    };
    categories[index] = updated;
    await saveCategories(categories);

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Category update error:', err);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    const categories = await getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    await saveCategories(filtered);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Category delete error:', err);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
