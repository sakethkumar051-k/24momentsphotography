import { NextRequest, NextResponse } from 'next/server';
import { getJobs, saveJob, deleteJob } from '@/lib/db';
import type { JobPosting } from '@/types/database';

export async function GET() {
  try {
    const jobs = await getJobs();
    return NextResponse.json(jobs);
  } catch (err) {
    console.error('Jobs fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const job: JobPosting = {
      id: crypto.randomUUID(),
      title: body.title || '',
      description: body.description || '',
      location: body.location || '',
      type: body.type || 'full-time',
      active: body.active ?? true,
      created_at: now,
      updated_at: now,
    };
    await saveJob(job);
    return NextResponse.json(job);
  } catch (err) {
    console.error('Job create error:', err);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const jobs = await getJobs();
    const existing = jobs.find((j) => j.id === body.id);
    if (!existing) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    const updated: JobPosting = {
      ...existing,
      ...body,
      updated_at: new Date().toISOString(),
    };
    await saveJob(updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Job update error:', err);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing job ID' }, { status: 400 });
    await deleteJob(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Job delete error:', err);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
