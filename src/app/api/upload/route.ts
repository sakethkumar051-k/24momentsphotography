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

function buildCloudinaryTransformUrl(baseSecureUrl: string, transform: string) {
  // Cloudinary URLs look like:
  // https://res.cloudinary.com/<cloud>/.../upload/<version>/<public_id>.<format>
  // We insert transforms right after `/upload/` so we can enforce a fixed crop ratio.
  return baseSecureUrl.replace('/upload/', `/upload/${transform}/`);
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

    // Force a consistent `3:4` portrait crop everywhere the website displays gallery images.
    // 3:4 => height = width * 4/3. We round to sensible integers.
    const thumbUrl = buildCloudinaryTransformUrl(secure_url, 'c_fill,w_400,h_533,f_auto,q_auto');
    const mediumUrl = buildCloudinaryTransformUrl(secure_url, 'c_fill,w_1200,h_1600,f_auto,q_auto');
    const fullUrl = buildCloudinaryTransformUrl(secure_url, 'c_fill,w_2400,h_3200,f_auto,q_auto');

    return NextResponse.json({
      url_thumbnail: thumbUrl,
      url_medium: mediumUrl,
      url_full: fullUrl,
      width,
      height,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
