import { romanize } from '../atoms';
import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';

/**
 * The Joint Section — Co-author spread (Phase 8). Sits near the back of
 * the magazine. Renders the partner's display name + joint notes when
 * a co-author is engaged; renders an editorial empty state otherwise.
 *
 * Style-dispatcher pattern matches the rest of the spreads.
 */
export function Joint(props: SpreadProps & { palette: SpreadPalette }) {
  switch (props.data.zine.style) {
    case 'fashion':
      return <FashionJoint {...props} />;
    case 'art_catalog':
      return <ArtCatalogJoint {...props} />;
    case 'travel':
      return <TravelJoint {...props} />;
    case 'lifestyle':
      return <LifestyleJoint {...props} />;
    case 'financial':
      return <FinancialJoint {...props} />;
    case 'editorial':
    default:
      return <EditorialJoint {...props} />;
  }
}

function partnerOf(data: SpreadProps['data']): string | null {
  return data.coauthor.partner_display_name?.trim() || null;
}
function notesOf(data: SpreadProps['data']): string {
  return (data.coauthor.joint_notes || '').trim();
}
function editorOf(data: SpreadProps['data']): string {
  return data.personal.display_name || data.personal.full_name || 'the editor';
}

/* -------------------- Editorial -------------------- */

function EditorialJoint({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const partner = partnerOf(data);
  const notes = notesOf(data);
  const editor = editorOf(data);
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
            }}
          >
            The <em>Joint</em> Section.
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
            {partner ? `Co-edited` : 'Solo'}
            <br />
            {partner ? `with ${partner}` : 'this issue'}
          </span>
        </header>

        {notes || partner ? (
          <div className="grid items-start gap-8 md:grid-cols-[1fr_2.4fr] md:gap-20">
            <aside>
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
                <span className="block">Editor</span>
                <span className="block">{editor}</span>
                {partner && (
                  <>
                    <span className="mt-2 block">Co-editor</span>
                    <span className="block">{partner}</span>
                  </>
                )}
              </div>
            </aside>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(17px, 1.6vw, 21px)',
                lineHeight: 1.55,
              }}
            >
              {notes ? (
                notes.split(/\n\n+/).map((p, i) => (
                  <p key={i} style={{ marginBottom: '1em' }}>
                    {p}
                  </p>
                ))
              ) : (
                <p style={{ opacity: 0.65 }}>
                  Co-edited with <em>{partner}</em>. The joint notes for this section
                  haven&rsquo;t been written yet.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p
            className="vz-prose mx-auto max-w-xl text-center"
            style={{ opacity: 0.7 }}
          >
            This issue is edited solo. Invite a co-author from the studio to compose this section
            together — they&rsquo;ll be able to write the joint notes in their own voice.
          </p>
        )}
      </div>
    </article>
  );
}

/* -------------------- Fashion (dual masthead) -------------------- */

function FashionJoint({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const partner = partnerOf(data);
  const notes = notesOf(data);
  const editor = editorOf(data);
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
          <span>Joint Section · No. {romanize(zine.issue_number)}</span>
          <span>{partner ? 'Co-edited' : 'Solo'}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(48px, 8vw, 120px)',
            lineHeight: 0.88,
            letterSpacing: '-0.025em',
            fontWeight: 400,
            margin: '36px 0 56px',
          }}
        >
          {editor}{' '}
          <em style={{ color: palette.accent }}>+</em>{' '}
          {partner ?? <span style={{ opacity: 0.4 }}>—</span>}.
        </h2>

        {notes ? (
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(18px, 1.8vw, 22px)',
              lineHeight: 1.55,
              maxWidth: '70ch',
            }}
          >
            {notes.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1.1em' }}>
                {p}
              </p>
            ))}
          </div>
        ) : (
          <p
            className="font-serif italic"
            style={{ fontSize: 18, lineHeight: 1.45, opacity: 0.6, maxWidth: 520 }}
          >
            {partner
              ? `Co-edited with ${partner}. The joint notes haven’t been written yet.`
              : 'Solo this issue. Invite a co-author from the studio to add a second voice here.'}
          </p>
        )}
      </div>
    </article>
  );
}

/* -------------------- Art Catalog (collaborative exhibit) -------------------- */

function ArtCatalogJoint({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const partner = partnerOf(data);
  const notes = notesOf(data);
  const editor = editorOf(data);
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
          <span>Joint Section · Collaborative Plate</span>
          <span>Vol. {zine.issue_number}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            lineHeight: 1.05,
            fontWeight: 400,
            margin: '0 0 14px',
          }}
        >
          {editor} {partner ? `& ${partner}` : 'alone'}.
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
          Wall text · partnership
        </p>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 16,
            lineHeight: 1.65,
            maxWidth: '60ch',
          }}
        >
          {notes ? (
            notes.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1.2em' }}>
                {p}
              </p>
            ))
          ) : (
            <p style={{ opacity: 0.65, fontStyle: 'italic' }}>
              {partner
                ? `Co-curated with ${partner}. The joint plate text hasn’t been written yet.`
                : 'Solo curation this volume. Invite a co-author from the studio to compose this plate together.'}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------- Travel (dispatch with co-author) -------------------- */

function TravelJoint({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const partner = partnerOf(data);
  const notes = notesOf(data);
  const editor = editorOf(data);
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
          <span>Joint Section · Co-dispatch</span>
          <span>Volume {romanize(zine.issue_number)}</span>
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
          Filed by {editor} {partner ? `& ${partner}` : 'alone'}
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
          Together, on the road.
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(17px, 1.7vw, 19px)',
            lineHeight: 1.6,
          }}
        >
          {notes ? (
            notes.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1.1em' }}>
                {p}
              </p>
            ))
          ) : (
            <p style={{ opacity: 0.65, fontStyle: 'italic' }}>
              {partner
                ? `Co-dispatched with ${partner}. The notes haven’t been filed yet.`
                : 'Solo dispatch this volume. Invite a co-author from the studio to add their dateline.'}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------- Lifestyle (in conversation) -------------------- */

function LifestyleJoint({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const partner = partnerOf(data);
  const notes = notesOf(data);

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
          In conversation with
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(40px, 5.5vw, 64px)',
            lineHeight: 1.05,
            fontWeight: 400,
            margin: '0 0 36px',
          }}
        >
          {partner ?? <span style={{ opacity: 0.4 }}>—</span>}.
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            lineHeight: 1.7,
            textAlign: 'left',
          }}
        >
          {notes ? (
            notes.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1.2em' }}>
                {p}
              </p>
            ))
          ) : (
            <p style={{ opacity: 0.65, fontStyle: 'italic' }}>
              {partner
                ? `In conversation with ${partner}. The joint notes haven’t been written yet.`
                : 'Solo this issue. Invite a co-author from the studio to begin a conversation here.'}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* -------------------- Financial (partnership memo) -------------------- */

function FinancialJoint({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  const partner = partnerOf(data);
  const notes = notesOf(data);
  const editor = editorOf(data);
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
            gridTemplateColumns: '110px 1fr',
            rowGap: 6,
            columnGap: 16,
          }}
        >
          <span style={{ opacity: 0.55 }}>Memo</span>
          <span>Joint Section, FY {year}</span>
          <span style={{ opacity: 0.55 }}>Partners</span>
          <span>{partner ? `${editor} · ${partner}` : `${editor} (solo)`}</span>
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
          Re: <em style={{ color: palette.accent }}>The partnership, on record.</em>
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 16,
            lineHeight: 1.5,
            textAlign: 'justify',
          }}
        >
          {notes ? (
            notes.split(/\n\n+/).map((p, i) => (
              <p key={i} style={{ marginBottom: '1em' }}>
                {p}
              </p>
            ))
          ) : (
            <p style={{ opacity: 0.65, fontStyle: 'italic' }}>
              {partner
                ? `Partnered with ${partner}. The joint memo hasn’t been filed yet.`
                : 'Solo position this volume. Invite a co-author from the studio to record a joint memo here.'}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
