import { romanize } from '../atoms';
import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

/**
 * The Profile — Bio spread (Phase 8). The author's editorial introduction.
 * Reads after the Editor's Letter (Vision): "Here's who's writing this."
 * Style-dispatcher pattern matches 3d-iv.
 */
export function Bio(props: SpreadProps & { palette: SpreadPalette }) {
  switch (props.data.zine.style) {
    case 'fashion':
      return <FashionBio {...props} />;
    case 'art_catalog':
      return <ArtCatalogBio {...props} />;
    case 'travel':
      return <TravelBio {...props} />;
    case 'lifestyle':
      return <LifestyleBio {...props} />;
    case 'financial':
      return <FinancialBio {...props} />;
    case 'editorial':
    default:
      return <EditorialBio {...props} />;
  }
}

function bioText(data: SpreadProps['data']): string {
  return (data.bio.summary || data.bio.raw_paste || '').trim();
}

function displayNameOf(data: SpreadProps['data']): string {
  return data.personal.display_name || data.personal.full_name || 'You';
}

/* -------------------- Editorial -------------------- */

function EditorialBio({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const text = bioText(data);
  const displayName = displayNameOf(data);
  const location = data.personal.location;
  const { zine } = data;

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
              <span className="block">The Profile</span>
              <span className="block">Issue {zine.issue_number}</span>
              <span className="block">{displayName}</span>
              {location && <span className="block">{location}</span>}
            </div>
          </aside>

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
              On <em>{displayName}</em>.
            </h2>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(17px, 1.6vw, 21px)',
                lineHeight: 1.55,
              }}
            >
              {text ? (
                text.split(/\n\n+/).map((p, i) => (
                  <p key={i} style={{ marginBottom: '1em' }}>
                    {p}
                  </p>
                ))
              ) : (
                <p style={{ opacity: 0.6 }}>
                  The Bio is empty this issue. Add a summary in the studio — it appears here
                  composed alongside a left-rail meta column.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------- Fashion (oversized italic name) -------------------- */

function FashionBio({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const text = bioText(data);
  const displayName = displayNameOf(data);
  const { zine } = data;

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
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
          <span>The Profile · No. {romanize(zine.issue_number)}</span>
          <span>Featuring {displayName}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(56px, 10vw, 168px)',
            lineHeight: 0.85,
            letterSpacing: '-0.03em',
            fontWeight: 400,
            margin: '36px 0 56px',
            color: palette.accent,
          }}
        >
          {displayName}.
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            lineHeight: 1.55,
            maxWidth: '70ch',
          }}
        >
          {text ? (
            text.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1.1em' }}>
                {p}
              </p>
            ))
          ) : (
            <p style={{ opacity: 0.6, fontStyle: 'italic' }}>
              The Bio is empty this issue. Add a summary in the studio — it appears here as a
              feature opener.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------- Art Catalog (museum bio plate) -------------------- */

function ArtCatalogBio({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const text = bioText(data);
  const displayName = displayNameOf(data);
  const { zine } = data;

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
          maxWidth: 760,
        }}
      >
        <div
          className="flex items-baseline justify-between"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            borderTop: `1px solid ${palette.fg}`,
            borderBottom: `1px solid ${palette.fg}`,
            padding: '10px 0',
            marginBottom: 'clamp(40px, 6vw, 64px)',
          }}
        >
          <span>The Profile · Artist Plate</span>
          <span>Vol. {zine.issue_number}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            lineHeight: 1.05,
            letterSpacing: '-0.012em',
            fontWeight: 400,
            margin: '0 0 14px',
          }}
        >
          On {displayName}.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: palette.accent,
            marginBottom: 'clamp(36px, 5vw, 56px)',
          }}
        >
          Wall text · biography
        </p>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 16,
            lineHeight: 1.65,
            maxWidth: '60ch',
          }}
        >
          {text ? (
            text.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1.2em' }}>
                {p}
              </p>
            ))
          ) : (
            <p style={{ opacity: 0.6, fontStyle: 'italic' }}>
              The Bio is empty this issue. Add a summary in the studio — it appears as a gallery
              wall plate, narrow column, no drop cap.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------- Travel (correspondent profile) -------------------- */

function TravelBio({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const text = bioText(data);
  const displayName = displayNameOf(data);
  const location = data.personal.location || 'The Field';
  const { zine } = data;

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
          maxWidth: 820,
        }}
      >
        <div
          className="flex items-baseline justify-between"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            borderTop: `2px solid ${palette.fg}`,
            borderBottom: `1px solid ${palette.fg}`,
            padding: '12px 0',
            marginBottom: 28,
          }}
        >
          <span>The Profile · Correspondent</span>
          <span>From {location}</span>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 2.2vw, 26px)',
            opacity: 0.8,
            marginBottom: 16,
            color: palette.accent,
          }}
        >
          Filed by {displayName} · Volume {romanize(zine.issue_number)}
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 84px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            fontWeight: 400,
            margin: '0 0 40px',
            maxWidth: '14ch',
          }}
        >
          About the writer.
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(17px, 1.7vw, 19px)',
            lineHeight: 1.6,
          }}
        >
          {text ? (
            text.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1.1em' }}>
                {p}
              </p>
            ))
          ) : (
            <p style={{ opacity: 0.6, fontStyle: 'italic' }}>
              The Bio is empty this issue. Add a summary in the studio — it appears as a
              correspondent profile.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------- Lifestyle (quiet centered) -------------------- */

function LifestyleBio({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const text = bioText(data);
  const displayName = displayNameOf(data);

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(80px, 12vw, 180px)',
          paddingBottom: 'clamp(80px, 12vw, 180px)',
          maxWidth: 620,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 28,
            opacity: 0.7,
          }}
        >
          On the author
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.5vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: '-0.012em',
            fontWeight: 400,
            margin: '0 0 36px',
          }}
        >
          {displayName}.
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            lineHeight: 1.7,
            textAlign: 'left',
          }}
        >
          {text ? (
            text.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1.2em' }}>
                {p}
              </p>
            ))
          ) : (
            <p style={{ opacity: 0.6, fontStyle: 'italic' }}>
              The Bio is empty this issue. Add a summary in the studio — it lives here as a quiet
              introduction.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------- Financial (executive summary memo) -------------------- */

function FinancialBio({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const text = bioText(data);
  const displayName = displayNameOf(data);
  const { zine } = data;
  const year = new Date(zine.created_at).getFullYear();

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
          maxWidth: 860,
        }}
      >
        <div
          style={{
            borderTop: `2px solid ${palette.fg}`,
            borderBottom: `2px solid ${palette.fg}`,
            padding: '14px 0',
            marginBottom: 36,
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            display: 'grid',
            gridTemplateColumns: '80px 1fr',
            rowGap: 6,
            columnGap: 16,
          }}
        >
          <span style={{ opacity: 0.55 }}>Profile</span>
          <span>Executive Summary, FY {year}</span>
          <span style={{ opacity: 0.55 }}>Subject</span>
          <span>{displayName}</span>
          <span style={{ opacity: 0.55 }}>Volume</span>
          <span>{zine.issue_number}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 4.8vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            fontWeight: 400,
            margin: '0 0 32px',
            paddingBottom: 18,
            borderBottom: `1px solid ${palette.fg}`,
          }}
        >
          Re: <em style={{ color: palette.accent }}>The author, summarized.</em>
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 16,
            lineHeight: 1.5,
            textAlign: 'justify',
          }}
        >
          {text ? (
            text.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1em' }}>
                {p}
              </p>
            ))
          ) : (
            <p style={{ opacity: 0.6, fontStyle: 'italic' }}>
              The Bio is empty this issue. Add a summary in the studio — it appears as an
              executive summary memo.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
