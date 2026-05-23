import { romanize } from '../atoms';
import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

/**
 * Editor's Letter — Vision spread. Style-dispatcher (Phase 3d-iv).
 *
 * Editorial variant: drop-cap letter with a left-rail meta column.
 * Vision Zine's original treatment.
 *
 * Fashion variant: feature-opener. Bold eyebrow strip, oversized
 * masthead, pull-quote in the accent color floated mid-text, the
 * Vision statement flowing as a single confident column.
 */
export function EditorsLetter(props: SpreadProps & { palette: SpreadPalette }) {
  switch (props.data.zine.style) {
    case 'fashion':
      return <FashionLetter {...props} />;
    case 'editorial':
    case 'lifestyle':
    case 'art_catalog':
    case 'travel':
    case 'financial':
    default:
      return <EditorialLetter {...props} />;
  }
}

/* -------------------- Editorial (baseline) -------------------- */

function EditorialLetter({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { personal, vision } = data;
  const displayName = personal.display_name || personal.full_name || 'You';
  const statement = vision.statement?.trim();

  const paragraphs = statement
    ? statement
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        <div className="grid items-start gap-8 md:grid-cols-[1fr_2.4fr] md:gap-20">
          {/* Side meta */}
          <aside className="md:sticky md:top-10">
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                lineHeight: 1.7,
                borderTop: `1px solid ${palette.fg}`,
                borderBottom: `1px solid ${palette.fg}`,
                padding: '14px 0',
              }}
            >
              <span className="block">The Vision</span>
              <span className="block">Issue {data.zine.issue_number}</span>
              <span className="block">{displayName}</span>
            </div>
          </aside>

          {/* Letter */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 6.5vw, 84px)',
                lineHeight: 0.9,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                margin: '18px 0 36px',
              }}
            >
              {statement ? (
                <>
                  A letter from <em>{displayName}</em>.
                </>
              ) : (
                <>
                  Your <em>letter</em> goes here.
                </>
              )}
            </h2>
            <div
              className="vz-dropcap"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(17px, 1.6vw, 21px)',
                lineHeight: 1.55,
                fontWeight: 400,
              }}
            >
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => (
                  <p key={i} style={{ marginBottom: '1em' }}>
                    {p}
                  </p>
                ))
              ) : (
                <p style={{ marginBottom: '1em', opacity: 0.6 }}>
                  Write your Vision statement in the studio — once you save it, this spread will
                  compose around your words with a drop cap, a signature, and the side rail. Until
                  then, this page holds the form for what&apos;s coming.
                </p>
              )}
            </div>
            {paragraphs.length > 0 && (
              <div className="mt-9 flex flex-wrap items-end gap-5">
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 46,
                    lineHeight: 1,
                    fontWeight: 400,
                    color: palette.accent,
                  }}
                >
                  — {displayName}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    lineHeight: 1.5,
                  }}
                >
                  {personal.location ? <span className="block">{personal.location}</span> : null}
                  <span className="block">Editor, this issue</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------- Fashion (feature opener) -------------------- */

function FashionLetter({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { personal, vision, zine } = data;
  const displayName = personal.display_name || personal.full_name || 'You';
  const statement = vision.statement?.trim();
  const paragraphs = statement
    ? statement
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  // Pull a pull-quote from the first paragraph if it has a sentence
  // worth lifting; otherwise no quote (the column reads cleaner empty
  // than with a half-baked pull).
  const pullCandidate = paragraphs[0]?.split(/(?<=[.!?])\s+/).find((s) => s.length > 40);
  const pullQuote = pullCandidate && pullCandidate.length < 220 ? pullCandidate : null;

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        {/* Eyebrow strip */}
        <div
          className="flex items-baseline justify-between"
          style={{
            borderBottom: `2px solid ${palette.fg}`,
            paddingBottom: 14,
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span>The Vision · No. {romanize(zine.issue_number)}</span>
          <span>Editor: {displayName}</span>
        </div>

        {/* Oversized italic masthead */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 10vw, 168px)',
            lineHeight: 0.85,
            letterSpacing: '-0.03em',
            fontWeight: 400,
            margin: '36px 0 48px',
          }}
        >
          {statement ? (
            <>
              <em style={{ color: palette.accent }}>From</em>
              <br />
              {displayName}.
            </>
          ) : (
            <>
              <em>Your</em> letter,
              <br />
              forthcoming.
            </>
          )}
        </h2>

        {/* Body column — wider than Editorial's split layout */}
        <div
          className="grid gap-12 md:grid-cols-[2fr_1fr] md:gap-20"
          style={{ alignItems: 'start' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(18px, 1.8vw, 22px)',
              lineHeight: 1.55,
              fontWeight: 400,
            }}
          >
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} style={{ marginBottom: '1.1em' }}>
                  {p}
                </p>
              ))
            ) : (
              <p style={{ marginBottom: '1em', opacity: 0.6 }}>
                Write your Vision statement in the studio. The first paragraph carries this column;
                a pull is lifted on the right.
              </p>
            )}
          </div>

          {/* Right column — pull quote in accent color */}
          <aside className="md:pt-3">
            {pullQuote ? (
              <blockquote
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(26px, 3vw, 40px)',
                  lineHeight: 1.1,
                  color: palette.accent,
                  margin: 0,
                  borderTop: `2px solid ${palette.accent}`,
                  borderBottom: `2px solid ${palette.accent}`,
                  padding: '20px 0',
                }}
              >
                &ldquo;{pullQuote.replace(/^["“]|["”]$/g, '')}&rdquo;
              </blockquote>
            ) : (
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  opacity: 0.55,
                  borderTop: `1px solid ${palette.fg}`,
                  paddingTop: 14,
                }}
              >
                <p>Edited & written by</p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 28,
                    textTransform: 'none',
                    letterSpacing: 0,
                    marginTop: 6,
                    opacity: 1,
                  }}
                >
                  {displayName}
                </p>
                {personal.location && <p className="mt-2">{personal.location}</p>}
              </div>
            )}
          </aside>
        </div>

        {/* Signature footer */}
        {paragraphs.length > 0 && (
          <div
            className="mt-16 flex items-end justify-between"
            style={{ borderTop: `1px solid ${palette.fg}`, paddingTop: 20 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(40px, 5vw, 64px)',
                lineHeight: 1,
                fontWeight: 400,
                color: palette.accent,
              }}
            >
              — {displayName}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textAlign: 'right',
                lineHeight: 1.7,
              }}
            >
              {personal.location && <span className="block">{personal.location}</span>}
              <span className="block">Editor, this issue</span>
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
