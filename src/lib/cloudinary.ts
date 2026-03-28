import { v2 as cloudinary } from 'cloudinary';

let configured = false;

/**
 * Returns the configured Cloudinary instance.
 * Lazily configures on first call so the module can be imported at build time
 * without crashing when env vars are absent (Next.js collects page data for
 * all routes during build, including upload routes that import this module).
 */
export function getCloudinary() {
  if (!configured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        'Missing Cloudinary environment variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.'
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    configured = true;
  }

  return cloudinary;
}

/** @deprecated Use getCloudinary() instead — kept for backwards compat. */
export { cloudinary };
