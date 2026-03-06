import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { IMAGE_SIZES } from '@/lib/constants';
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

    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    const sizes = {
      thumbnail: IMAGE_SIZES.thumbnail,
      medium: IMAGE_SIZES.medium,
      full: IMAGE_SIZES.full,
    } as const;

    const urls: Record<string, string> = {};

    for (const [sizeName, maxWidth] of Object.entries(sizes)) {
      const resized = await sharp(buffer)
        .resize(maxWidth, undefined, { withoutEnlargement: true })
        .webp({ quality: sizeName === 'thumbnail' ? 70 : sizeName === 'medium' ? 80 : 90 })
        .toBuffer();

      const fileName = `gallery/${timestamp}-${baseName}-${sizeName}.webp`;
      const file = storageBucket.file(fileName);
      await file.save(resized, {
        contentType: 'image/webp',
        public: true,
      });

      urls[sizeName] = `https://storage.googleapis.com/${storageBucket.name}/${fileName}`;
    }

    return NextResponse.json({
      url_thumbnail: urls.thumbnail,
      url_medium: urls.medium,
      url_full: urls.full,
      width,
      height,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
