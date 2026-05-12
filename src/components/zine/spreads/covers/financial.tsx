import { romanize } from '../../atoms';
import type { SpreadPalette } from '../../styles';
import type { SpreadProps } from '../../types';
import { getDisplayName } from './_shared';

/**
 * Financial cover — annual-report aesthetic. Deep green page, year
 * prominently in the corner, formal sans masthead, a "performance
 * summary" 4-column meta strip at the bottom.
 */
export function FinancialCover({
  data,
  palette,
}: SpreadProps & { palette: SpreadPalette }) {
  const { zine } = data;
  const displayName = getDisplayName(data);
  const year = new Date(zine.created_at).getFullYear();
  const title = zine.title || 'Annual Report';
  const goalCount =
    (data.goals.financial?.length ?? 0) +
    (data.goals.creative?.length ?? 0) +
    (data.goals.place?.length ?? 0) +
    (data.goals.body_spirit?.length ?? 0);
  const achievementCount = data.achievements.items?.length ?? 0;
  const tenetCount = data.tenets.tenets?.filter((t) => t.trim()).length ?? 0;

  return (
    <article
      className="relative overflow-hidden"
      style={{ background: palette.bg, color: palette.fg }}
    >
      <div
        className="relative grid"
        style={{
          padding: 'clamp(40px, 6vw, 88px)',
          minHeight: '900px',
          gridTemplateRows: 'auto 1fr auto',
        }}
      >
        {/* Top — annual issue + year (year big as a stamp) */}
        <header className="flex items-start justify-between gap-6">
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ display: 'block', color: palette.accent }}>The Annual Report</span>
            <span style={{ display: 'block', marginTop: 6 }}>
              Vol. {romanize(zine.issue_number)} · {displayName}
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(56px, 9vw, 120px)',
              lineHeight: 0.85,
              fontWeight: 400,
              color: palette.accent,
            }}
          >
            {year}
          </span>
        </header>

        {/* Title in the middle — restrained, formal */}
        <div className="flex flex-col justify-center">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(56px, 11vw, 168px)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              fontWeight: 400,
              maxWidth: 1000,
              wordBreak: 'break-word',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(22px, 3vw, 36px)',
              lineHeight: 1.2,
              marginTop: 24,
              maxWidth: 720,
              opacity: 0.9,
            }}
          >
            A statement of position, prepared by the editor — for the editor.
          </p>
        </div>

        {/* Performance summary */}
        <footer
          className="grid"
          style={{
            borderTop: `1px solid ${palette.fg}`,
            paddingTop: 18,
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}
        >
          {[
            { label: 'Goals', value: goalCount },
            { label: 'Receipts', value: achievementCount },
            { label: 'Tenets', value: `${tenetCount}/10` },
            { label: 'Issue', value: romanize(zine.issue_number) },
          ].map((item) => (
            <div key={item.label}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                  opacity: 0.7,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 40,
                  lineHeight: 0.9,
                  fontWeight: 400,
                  color: palette.accent,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </footer>
      </div>
    </article>
  );
}
