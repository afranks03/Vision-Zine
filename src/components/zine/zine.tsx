import { presetCssVars } from '@/lib/typography/presets';
import { Page, buildRunningHead, type PageVariant } from './page';
import { Contents } from './spreads/contents';
import { Cover } from './spreads/cover';
import { DailyCode } from './spreads/daily-code';
import { EditorsLetter } from './spreads/letter';
import { Forecast } from './spreads/forecast';
import { Foundation } from './spreads/foundation';
import { Practice } from './spreads/practice';
import { STYLE_PALETTES } from './styles';
import type { ZineRootProps } from './types';

/**
 * Zine — composes spreads in canonical magazine order. Wraps each
 * inner spread in <Page> for chrome (running head + page number);
 * the cover is bare (no chrome) per magazine convention.
 *
 * Page sequence (Letter):
 *   1. Cover (no chrome)
 *   2. Contents (TOC)
 *   3. Editor's Letter — Vision section
 *   4. Forecast — Goals
 *   5. Daily Code — Tenets
 *   6. Foundation — Achievements
 *
 * Pocket skips the Contents page (limited real estate) so its
 * inner sequence is: 1 cover, 2 letter, 3 forecast, 4 daily code,
 * 5 foundation.
 */
export function Zine({ data, coverImageUrl }: ZineRootProps) {
  const palette = STYLE_PALETTES[data.zine.style];
  const typographyStyle = presetCssVars(data.zine.typography_preset);
  const { zine } = data;
  const runningHead = buildRunningHead(zine);
  const showContents = zine.format !== 'pocket';

  // Pages 2..N receive chrome. Page 1 is the cover (no chrome).
  // First listed section's page index depends on whether Contents
  // exists; Letter zines have Contents at page 2, so the Letter is
  // page 3; Pocket has Letter at page 2.
  //
  // Sequence (Letter): Cover · Contents · Letter · Practice · Forecast
  //                    · DailyCode · Foundation
  // Sequence (Pocket): Cover · Letter · Practice · Forecast
  //                    · DailyCode · Foundation
  const letterPage = showContents ? 3 : 2;
  const practicePage = letterPage + 1;
  const forecastPage = letterPage + 2;
  const dailyCodePage = letterPage + 3;
  const foundationPage = letterPage + 4;
  const totalPages = foundationPage;

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

      {/* 4 (or 3). The Practice — inward + outward */}
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

      {/* 5 (or 4). Forecast — Goals */}
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

      {/* 5 (or 4). Daily Code — Tenets */}
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

      {/* 6 (or 5). Foundation — Achievements */}
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
    </div>
  );
}

/** Even = verso (left), odd = recto (right). */
function pageVariant(n: number): PageVariant {
  return n % 2 === 0 ? 'verso' : 'recto';
}
