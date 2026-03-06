import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@24moments.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-password';

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', 'active', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 4, // 4 hours
  });

  return response;
}

