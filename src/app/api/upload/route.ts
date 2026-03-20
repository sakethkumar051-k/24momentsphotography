import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { cloudinary } from '@/lib/cloudinary';

function uploadToCloudinary(buffer: Buffer, publicId: string): Promise<{ secure_url: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'gallery',
        public_id: publicId,
        resource_type: 'image',
        overwrite: true,
        format: 'webp',
        quality: 'auto:good',
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ secure_url: result.secure_url, width: result.width, height: result.height });
      },
    );
    stream.end(buffer);
  });
}

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
    const publicId = `${timestamp}-${baseName}`;

    const resized = await sharp(buffer)
      .resize(2400, undefined, { withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const { secure_url, width, height } = await uploadToCloudinary(resized, publicId);

    const baseUrl = secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
    const thumbUrl = secure_url.replace('/upload/', '/upload/c_fill,w_400,f_auto,q_auto/');
    const mediumUrl = secure_url.replace('/upload/', '/upload/c_limit,w_1200,f_auto,q_auto/');

    return NextResponse.json({
      url_thumbnail: thumbUrl,
      url_medium: mediumUrl,
      url_full: baseUrl,
      width,
      height,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
