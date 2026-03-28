import { ImageResponse } from 'next/og';

export const alt = '24 Moments Photography — Capturing Moments. Defining Legacies.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #0a0a0a 0%, #141210 45%, #0a0a0a 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 48,
            border: '1px solid rgba(212, 160, 23, 0.35)',
            borderRadius: 4,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#e8e4dc',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            24 MOMENTS
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: '0.35em',
              color: '#D4A017',
              textTransform: 'uppercase',
              marginBottom: 28,
            }}
          >
            Photography
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'rgba(232, 228, 220, 0.85)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Capturing Moments. Defining Legacies.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
