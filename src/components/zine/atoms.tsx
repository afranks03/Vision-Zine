/**
 * Atomic ornamental elements reused across zine spreads.
 */
import { type CSSProperties } from 'react';

/** Convert a positive integer to a Roman numeral. */
export function romanize(n: number): string {
  const map: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  let remaining = n;
  for (const [value, numeral] of map) {
    while (remaining >= value) {
      out += numeral;
      remaining -= value;
    }
  }
  return out || 'I';
}

/** Decorative barcode bar pattern — pure CSS, deterministic per seed. */
export function Barcode({ seed = 'visionzine' }: { seed?: string }) {
  // Deterministic widths derived from the seed so the barcode looks unique
  // per issue but stays stable across renders.
  const bars: number[] = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 36; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    bars.push(1 + ((h >>> 8) & 0x3));
  }
  return (
    <div
      style={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-end',
        height: 34,
      }}
    >
      {bars.map((w, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: `${w * 1.5}px`,
            height: '100%',
            background: 'currentColor',
          }}
        />
      ))}
    </div>
  );
}

/** Small circular brand mark for the cover top-right. Falls back to "VZ". */
export function BrandMark({
  letter = 'VZ',
  style,
}: {
  letter?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        borderRadius: '50%',
        border: '1.5px solid currentColor',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: 18,
        lineHeight: 1,
        letterSpacing: 0,
        ...style,
      }}
    >
      {letter}
    </span>
  );
}
