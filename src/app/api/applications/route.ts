import { NextRequest, NextResponse } from 'next/server';
import { getApplications, saveApplication, deleteApplication } from '@/lib/db';
import type { JobApplication } from '@/types/database';

export async function GET() {
  try {
    const apps = await getApplications();
    return NextResponse.json(apps);
  } catch (err) {
    console.error('Applications fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const app: JobApplication = {
      id: crypto.randomUUID(),
      job_id: body.job_id || '',
      job_title: body.job_title || '',
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || '',
      portfolio_url: body.portfolio_url?.trim() || '',
      message: body.message?.trim() || '',
      created_at: new Date().toISOString(),
    };
    await saveApplication(app);
    return NextResponse.json({ success: true, message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Application create error:', err);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing application ID' }, { status: 400 });
    await deleteApplication(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Application delete error:', err);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
