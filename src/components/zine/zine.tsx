import { presetCssVars } from '@/lib/typography/presets';
import { Page, buildRunningHead, type PageVariant } from './page';
import { Bio } from './spreads/bio';
import { Career } from './spreads/career';
import { Contents } from './spreads/contents';
import { Cover } from './spreads/cover';
import { DailyCode } from './spreads/daily-code';
import { EditorsLetter } from './spreads/letter';
import { Forecast } from './spreads/forecast';
import { Foundation } from './spreads/foundation';
import { Joint } from './spreads/joint';
import { Practice } from './spreads/practice';
import { STYLE_PALETTES } from './styles';
import type { ZineRootProps } from './types';

/**
 * Zine — composes spreads in canonical magazine order. Wraps each
 * inner spread in <Page> for chrome (running head + page number);
 * the cover is bare (no chrome) per magazine convention.
 *
 * Phase 8 expanded the spread list so every studio section that
 * carries data now has its own printed page. Each <Page> wrapper
 * also forces a page-break in the PDF output.
 *
 * Page sequence (Letter):
 *   1. Cover
 *   2. Contents (TOC)
 *   3. Editor's Letter — Vision
 *   4. The Profile — Bio
 *   5. The Career — Resume
 *   6. The Practice — Reflective inputs
 *   7. The Forecast — Goals
 *   8. The Daily Code — Tenets
 *   9. The Foundation — Achievements
 *   10. The Joint Section — Co-author
 *
 * Pocket skips Contents (limited real estate) — same nine spreads,
 * just one shorter.
 */
export function Zine({ data, coverImageUrl }: ZineRootProps) {
  const palette = STYLE_PALETTES[data.zine.style];
  const typographyStyle = presetCssVars(data.zine.typography_preset);
  const { zine } = data;
  const runningHead = buildRunningHead(zine);
  const showContents = zine.format !== 'pocket';

  // Page-number math. Cover is page 1 (no chrome). Contents is page 2
  // on Letter; Letter format starts the inner spreads at page 3.
  // Pocket starts inner spreads at page 2 (no Contents).
  const letterPage = showContents ? 3 : 2;
  const bioPage = letterPage + 1;
  const careerPage = letterPage + 2;
  const practicePage = letterPage + 3;
  const forecastPage = letterPage + 4;
  const dailyCodePage = letterPage + 5;
  const foundationPage = letterPage + 6;
  const jointPage = letterPage + 7;
  const totalPages = jointPage;

  return (
    <div className="zine-root flex flex-col" style={typographyStyle}>
      {/* 1. Cover — no chrome */}
      <Cover data={data} palette={palette.cover} coverImageUrl={coverImageUrl} />

      {/* 2. Contents (Letter only) */}
      {showContents && (
        <Page
          number={2}
          total={totalPages}
          runningHead={runningHead}
          sectionEyebrow="Contents"
          variant="verso"
          palette={palette.cover}
          format={zine.format}
        >
          <Contents data={data} palette={palette.cover} startPage={letterPage} />
        </Page>
      )}

      {/* 3 (or 2). Editor's Letter — Vision */}
      <Page
        number={letterPage}
        total={totalPages}
        runningHead={runningHead}
        sectionEyebrow="The Vision"
        variant={pageVariant(letterPage)}
        palette={palette.letter}
        format={zine.format}
      >
        <EditorsLetter data={data} palette={palette.letter} />
      </Page>

      {/* 4 (or 3). The Profile — Bio */}
      <Page
        number={bioPage}
        total={totalPages}
        runningHead={runningHead}
        sectionEyebrow="The Profile"
        variant={pageVariant(bioPage)}
        palette={palette.dailyCode}
        format={zine.format}
      >
        <Bio data={data} palette={palette.dailyCode} />
      </Page>

      {/* 5 (or 4). The Career — Resume */}
      <Page
        number={careerPage}
        total={totalPages}
        runningHead={runningHead}
        sectionEyebrow="The Career"
        variant={pageVariant(careerPage)}
        palette={palette.foundation}
        format={zine.format}
      >
        <Career data={data} palette={palette.foundation} />
      </Page>

      {/* 6 (or 5). The Practice */}
      <Page
        number={practicePage}
        total={totalPages}
        runningHead={runningHead}
        sectionEyebrow="The Practice"
        variant={pageVariant(practicePage)}
        palette={palette.forecast}
        format={zine.format}
      >
        <Practice data={data} palette={palette.forecast} />
      </Page>

      {/* 7 (or 6). The Forecast — Goals */}
      <Page
        number={forecastPage}
        total={totalPages}
        runningHead={runningHead}
        sectionEyebrow="The Forecast"
        variant={pageVariant(forecastPage)}
        palette={palette.forecast}
        format={zine.format}
      >
        <Forecast data={data} palette={palette.forecast} />
      </Page>

      {/* 8 (or 7). The Daily Code — Tenets */}
      <Page
        number={dailyCodePage}
        total={totalPages}
        runningHead={runningHead}
        sectionEyebrow="The Daily Code"
        variant={pageVariant(dailyCodePage)}
        palette={palette.dailyCode}
        format={zine.format}
      >
        <DailyCode data={data} palette={palette.dailyCode} />
      </Page>

      {/* 9 (or 8). The Foundation — Achievements */}
      <Page
        number={foundationPage}
        total={totalPages}
        runningHead={runningHead}
        sectionEyebrow="The Foundation"
        variant={pageVariant(foundationPage)}
        palette={palette.foundation}
        format={zine.format}
      >
        <Foundation data={data} palette={palette.foundation} />
      </Page>

      {/* 10 (or 9). The Joint Section — Co-author */}
      <Page
        number={jointPage}
        total={totalPages}
        runningHead={runningHead}
        sectionEyebrow="The Joint Section"
        variant={pageVariant(jointPage)}
        palette={palette.letter}
        format={zine.format}
      >
        <Joint data={data} palette={palette.letter} />
      </Page>
    </div>
  );
}

/** Even = verso (left), odd = recto (right). */
function pageVariant(n: number): PageVariant {
  return n % 2 === 0 ? 'verso' : 'recto';
}
