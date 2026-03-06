import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { storageBucket } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');

    // Enforce a consistent vertical 3:4 portrait crop for the about image
    const resized = await sharp(buffer)
      .resize(1200, 1600, {
        fit: 'cover',
        position: 'centre',
        withoutEnlargement: true,
      })
      .webp({ quality: 90 })
      .toBuffer();

    const fileName = `about/${timestamp}-${baseName}.webp`;
    const storageFile = storageBucket.file(fileName);
    await storageFile.save(resized, {
      contentType: 'image/webp',
      public: true,
    });

    const url = `https://storage.googleapis.com/${storageBucket.name}/${fileName}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error('About image upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
