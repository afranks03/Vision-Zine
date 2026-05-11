 
import { ImageResponse } from 'next/og';

// Default Open Graph image for Vision Zine. Editorial yellow card with
// the masthead and a one-line tagline — same visual language as the site.

export const alt = 'Vision Zine — Editorial vision boards, printed.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#FFD629',
        color: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        padding: 56,
        fontFamily: 'Georgia, serif',
      }}
    >
      {/* Top meta row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 18,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              width: 9,
              height: 9,
              background: '#0A0A0A',
              borderRadius: '50%',
              marginRight: 12,
            }}
          />
          Issue I · Spring 2026
        </span>
        <span
          style={{
            width: 56,
            height: 56,
            border: '2px solid #0A0A0A',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
          }}
        >
          VZ
        </span>
      </div>

      {/* Masthead */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            fontSize: 24,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: -6,
          }}
        >
          <span>From the desk of</span>
          <span
            style={{
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
              textTransform: 'none',
            }}
          >
            you
          </span>
        </div>
        <div
          style={{
            fontSize: 220,
            lineHeight: 0.85,
            letterSpacing: -3,
            fontWeight: 400,
            fontFamily: 'Georgia, serif',
            marginTop: 8,
          }}
        >
          VISION
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            marginTop: 12,
          }}
        >
          Editorial vision boards, printed.
        </div>
      </div>

      {/* Bottom rule */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '2px solid #0A0A0A',
          paddingTop: 18,
          fontSize: 16,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        <span>vision-zine.vercel.app</span>
        <span>Vol. I · No. 1</span>
      </div>
    </div>,
    { ...size },
  );
}
