import { romanize } from '../atoms';
import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

/**
 * The Practice — Phase 7. Six reflective inputs grouped Inward / Outward.
 * Style-dispatcher pattern matches 3d-iv: Editorial baseline here; the
 * five other styles fall through until Phase 7b adds their variants.
 *
 * Inward  — gratitude, forgiveness, grounding, spirituality
 * Outward — environment, friend_circle
 */
export function Practice(props: SpreadProps & { palette: SpreadPalette }) {
  switch (props.data.zine.style) {
    case 'fashion':
      return <FashionPractice {...props} />;
    case 'art_catalog':
      return <ArtCatalogPractice {...props} />;
    case 'travel':
      return <TravelPractice {...props} />;
    case 'lifestyle':
      return <LifestylePractice {...props} />;
    case 'financial':
      return <FinancialPractice {...props} />;
    case 'editorial':
    default:
      return <EditorialPractice {...props} />;
  }
}

const FIELDS = [
  { key: 'gratitude', label: 'Gratitude', group: 'inward' as const },
  { key: 'forgiveness', label: 'Forgiveness', group: 'inward' as const },
  { key: 'grounding', label: 'Grounding', group: 'inward' as const },
  { key: 'spirituality', label: 'Spirituality', group: 'inward' as const },
  { key: 'environment', label: 'Environment', group: 'outward' as const },
  { key: 'friend_circle', label: 'Friend circle', group: 'outward' as const },
] as const;

/* -------------------- Editorial (baseline) -------------------- */

function EditorialPractice({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { zine, practice } = data;
  const filled = FIELDS.filter((f) => practice[f.key]?.toString().trim());

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
        }}
      >
        {/* Top spread header — bidirectional issue + title */}
        <header
          className="grid items-end gap-6"
          style={{
            gridTemplateColumns: 'auto 1fr auto',
            borderBottom: `2px solid ${palette.fg}`,
            paddingBottom: 18,
            marginBottom: 'clamp(40px, 6vw, 72px)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(64px, 9vw, 120px)',
              lineHeight: 0.85,
              fontWeight: 400,
            }}
          >
            {romanize(zine.issue_number)}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5.5vw, 72px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              fontWeight: 400,
              textAlign: 'left',
            }}
          >
            The <em>Practice</em>.
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textAlign: 'right',
              lineHeight: 1.6,
              alignSelf: 'end',
            }}
          >
            {filled.length} of {FIELDS.length}
            <br />
            prompts answered
          </span>
        </header>

        {filled.length === 0 ? (
          <p
            className="vz-prose mx-auto max-w-xl"
            style={{ color: palette.fg, opacity: 0.7, textAlign: 'center' }}
          >
            Fill in The Practice in the studio — six prompts of inward and outward reckoning —
            and they&apos;ll appear here as a two-tier reflection.
          </p>
        ) : (
          <>
            {/* Inward — 2x2 grid of the four inner-work cells */}
            <GroupBanner label="Inward" subtitle="What's happening inside you" palette={palette} />
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(2, 1fr)',
                columnGap: 'clamp(24px, 4vw, 48px)',
                rowGap: 'clamp(20px, 3vw, 32px)',
                marginBottom: 'clamp(40px, 6vw, 64px)',
              }}
            >
              {FIELDS.filter((f) => f.group === 'inward').map((f, i) => (
                <PracticeCell
                  key={f.key}
                  number={i + 1}
                  label={f.label}
                  body={practice[f.key] ?? ''}
                  palette={palette}
                />
              ))}
            </div>

            {/* Outward — wider 2-column row */}
            <GroupBanner label="Outward" subtitle="What surrounds you" palette={palette} />
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(2, 1fr)',
                columnGap: 'clamp(24px, 4vw, 48px)',
                rowGap: 'clamp(20px, 3vw, 32px)',
              }}
            >
              {FIELDS.filter((f) => f.group === 'outward').map((f, i) => (
                <PracticeCell
                  key={f.key}
                  number={i + 5}
                  label={f.label}
                  body={practice[f.key] ?? ''}
                  palette={palette}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function GroupBanner({
  label,
  subtitle,
  palette,
}: {
  label: string;
  subtitle: string;
  palette: SpreadPalette;
}) {
  return (
    <div
      className="flex items-baseline justify-between"
      style={{
        borderTop: `1px solid ${palette.fg}`,
        paddingTop: 12,
        marginBottom: 'clamp(20px, 3vw, 28px)',
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ color: palette.accent }}>{label}</span>
      <span style={{ opacity: 0.6 }}>{subtitle}</span>
    </div>
  );
}

/* -------------------- Fashion (six studies) -------------------- */

function FashionPractice({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { zine, practice } = data;
  const filled = FIELDS.filter((f) => practice[f.key]?.toString().trim());

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
          <span>The Practice · No. {romanize(zine.issue_number)}</span>
          <span>
            {filled.length} stud{filled.length === 1 ? 'y' : 'ies'}
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 132px)',
            lineHeight: 0.88,
            letterSpacing: '-0.025em',
            fontWeight: 400,
            margin: '36px 0 56px',
            maxWidth: '13em',
          }}
        >
          Six <em style={{ color: palette.accent }}>studies</em> from the inside out.
        </h2>

        {filled.length === 0 ? (
          <p
            className="font-serif italic"
            style={{ fontSize: 18, lineHeight: 1.45, opacity: 0.6, maxWidth: 520 }}
          >
            Fill in The Practice in the studio. Each prompt becomes a study here.
          </p>
        ) : (
          <ol className="list-none">
            {filled.map((f, i) => (
              <li
                key={f.key}
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: 'auto 1fr',
                  columnGap: 'clamp(24px, 4vw, 56px)',
                  padding: 'clamp(24px, 4vw, 42px) 0',
                  borderBottom:
                    i === filled.length - 1 ? 'none' : `1px solid ${palette.rule}`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(56px, 7vw, 96px)',
                    lineHeight: 0.85,
                    fontWeight: 400,
                    color: palette.accent,
                    width: '1.6em',
                  }}
                >
                  Study {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      marginBottom: 10,
                      opacity: 0.7,
                    }}
                  >
                    — {f.label} · {f.group}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(20px, 2.2vw, 28px)',
                      lineHeight: 1.2,
                      letterSpacing: '-0.005em',
                      fontWeight: 400,
                    }}
                  >
                    {practice[f.key]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Art Catalog (wall placards) -------------------- */

function ArtCatalogPractice({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { zine, practice } = data;
  const filled = FIELDS.filter((f) => practice[f.key]?.toString().trim());
  const yearAcc = new Date(zine.created_at).getFullYear() % 100;

  return (
    <article className="relative" style={{ background: palette.bg, color: palette.fg }}>
      <div
        className="vz-container"
        style={{
          paddingTop: 'clamp(60px, 10vw, 140px)',
          paddingBottom: 'clamp(60px, 10vw, 140px)',
          maxWidth: 920,
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
          <span>The Practice · Reflective Holdings</span>
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
          Six placards.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.5,
            opacity: 0.7,
            marginBottom: 'clamp(40px, 6vw, 56px)',
            maxWidth: 560,
          }}
        >
          Wall texts for the inner gallery. Inward holdings first, outward holdings after.
        </p>

        {filled.length === 0 ? (
          <p className="font-serif italic" style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.6 }}>
            Fill in The Practice in the studio. Each prompt becomes a placard here.
          </p>
        ) : (
          <ol
            className="list-none"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {filled.map((f, i) => {
              const accession = `${String(yearAcc).padStart(2, '0')}.P${String(i + 1).padStart(2, '0')}`;
              return (
                <li
                  key={f.key}
                  style={{
                    border: `1px solid ${palette.fg}`,
                    padding: 'clamp(18px, 2.4vw, 26px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: palette.accent,
                    }}
                  >
                    Acc. No. {accession} · {f.group}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: 22,
                      lineHeight: 1.1,
                      fontWeight: 400,
                      margin: 0,
                    }}
                  >
                    {f.label}.
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 14,
                      lineHeight: 1.45,
                    }}
                  >
                    {practice[f.key]}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Travel (field meditations) -------------------- */

function TravelPractice({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { zine, practice } = data;
  const filled = FIELDS.filter((f) => practice[f.key]?.toString().trim());

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
            marginBottom: 'clamp(40px, 6vw, 56px)',
          }}
        >
          <span>The Practice · Field Meditations</span>
          <span>Volume {romanize(zine.issue_number)}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 6.5vw, 88px)',
            lineHeight: 0.95,
            letterSpacing: '-0.018em',
            fontWeight: 400,
            margin: '0 0 16px',
            maxWidth: '14ch',
          }}
        >
          What I keep, <em style={{ color: palette.accent }}>on the road</em>.
        </h2>

        {filled.length === 0 ? (
          <p
            className="font-serif italic"
            style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.6 }}
          >
            Fill in The Practice in the studio. Each prompt becomes a meditation here.
          </p>
        ) : (
          <ol className="list-none">
            {filled.map((f, i) => (
              <li
                key={f.key}
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: '120px 1fr',
                  columnGap: 18,
                  padding: 'clamp(16px, 2.6vw, 24px) 0',
                  borderTop: `1px solid ${palette.rule}`,
                  borderBottom:
                    i === filled.length - 1 ? `2px solid ${palette.fg}` : 'none',
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: palette.accent,
                      marginBottom: 4,
                    }}
                  >
                    Note {String(i + 1).padStart(2, '0')}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      opacity: 0.55,
                    }}
                  >
                    {f.group}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(20px, 2.2vw, 26px)',
                      lineHeight: 1.2,
                      fontWeight: 400,
                      marginBottom: 8,
                    }}
                  >
                    On {f.label.toLowerCase()}.
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 16,
                      lineHeight: 1.5,
                    }}
                  >
                    &ldquo;{practice[f.key]}&rdquo;
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Lifestyle (quiet stack) -------------------- */

function LifestylePractice({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { practice } = data;
  const filled = FIELDS.filter((f) => practice[f.key]?.toString().trim());

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
            marginBottom: 24,
            opacity: 0.7,
          }}
        >
          The Practice
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(36px, 5vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: '-0.012em',
            fontWeight: 400,
            margin: '0 0 16px',
          }}
        >
          What I&apos;m sitting with.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.55,
            opacity: 0.7,
            marginBottom: 'clamp(48px, 7vw, 80px)',
          }}
        >
          Six quiet answers. Inward, then outward.
        </p>

        {filled.length === 0 ? (
          <p className="font-serif italic" style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.6 }}>
            Fill in The Practice in the studio. Each one becomes a small paragraph here.
          </p>
        ) : (
          <ol
            className="list-none"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(28px, 4vw, 44px)',
              textAlign: 'left',
            }}
          >
            {filled.map((f) => (
              <li key={f.key}>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: palette.accent,
                    marginBottom: 8,
                    textAlign: 'center',
                  }}
                >
                  {f.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 17,
                    lineHeight: 1.6,
                    fontWeight: 400,
                    textAlign: 'center',
                  }}
                >
                  {practice[f.key]}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

/* -------------------- Financial (closing-position ledger) -------------------- */

function FinancialPractice({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const { zine, practice } = data;
  const filled = FIELDS.filter((f) => practice[f.key]?.toString().trim());
  const year = new Date(zine.created_at).getFullYear();

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
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            borderTop: `2px solid ${palette.fg}`,
            borderBottom: `1px solid ${palette.fg}`,
            padding: '10px 0',
            marginBottom: 28,
          }}
        >
          <span>The Practice · Closing Positions</span>
          <span>FY {year} · Vol. {zine.issue_number}</span>
        </div>

        <div className="mb-10 flex items-baseline justify-between">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1,
              letterSpacing: '-0.018em',
              fontWeight: 400,
              margin: 0,
            }}
          >
            Positions, declared.
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.6,
            }}
          >
            {filled.length} of {FIELDS.length} held
          </span>
        </div>

        {filled.length === 0 ? (
          <p className="font-serif italic" style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.6 }}>
            Fill in The Practice in the studio. They post to the ledger here.
          </p>
        ) : (
          <>
            <div
              className="grid items-baseline"
              style={{
                gridTemplateColumns: '52px 1fr 90px 110px',
                columnGap: 16,
                paddingBottom: 8,
                borderBottom: `1px solid ${palette.fg}`,
                fontFamily: 'var(--font-sans)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: 0.55,
              }}
            >
              <span>§</span>
              <span>Position</span>
              <span style={{ textAlign: 'right' }}>Field</span>
              <span style={{ textAlign: 'right' }}>Direction</span>
            </div>

            <ol className="list-none">
              {filled.map((f, i) => (
                <li
                  key={f.key}
                  className="grid items-baseline"
                  style={{
                    gridTemplateColumns: '52px 1fr 90px 110px',
                    columnGap: 16,
                    padding: '12px 0',
                    borderBottom: `1px solid ${palette.rule}`,
                    fontFamily: 'var(--font-serif)',
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: palette.accent,
                    }}
                  >
                    {String(i + 1).padStart(3, '0')}
                  </span>
                  <span>{practice[f.key]}</span>
                  <span
                    style={{
                      textAlign: 'right',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                    }}
                  >
                    {f.label}
                  </span>
                  <span
                    style={{
                      textAlign: 'right',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      opacity: 0.55,
                    }}
                  >
                    {f.group}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </article>
  );
}

function PracticeCell({
  number,
  label,
  body,
  palette,
}: {
  number: number;
  label: string;
  body: string;
  palette: SpreadPalette;
}) {
  if (!body.trim()) {
    return (
      <div
        style={{
          borderTop: `1px solid ${palette.rule}`,
          paddingTop: 14,
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: 0.45,
        }}
      >
        <span style={{ color: palette.accent }}>{String(number).padStart(2, '0')}</span> · {label}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 14,
            letterSpacing: 0,
            textTransform: 'none',
            fontWeight: 400,
            marginTop: 6,
          }}
        >
          — empty this issue —
        </p>
      </div>
    );
  }

  return (
    <div style={{ borderTop: `1px solid ${palette.fg}`, paddingTop: 14 }}>
      <div
        className="flex items-baseline gap-3"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            lineHeight: 1,
            fontWeight: 400,
            color: palette.accent,
            letterSpacing: 0,
            textTransform: 'none',
          }}
        >
          {String(number).padStart(2, '0')}
        </span>
        <span>{label}</span>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(15px, 1.4vw, 17px)',
          lineHeight: 1.5,
          fontWeight: 400,
        }}
      >
        {body}
      </p>
    </div>
  );
}
