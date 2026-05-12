import { Cover } from './spreads/cover';
import { DailyCode } from './spreads/daily-code';
import { EditorsLetter } from './spreads/letter';
import { Forecast } from './spreads/forecast';
import { Foundation } from './spreads/foundation';
import { STYLE_PALETTES } from './styles';
import type { ZineRootProps } from './types';

/**
 * Zine — composes spreads in canonical magazine order. Looks up the
 * per-style palette and slices it across the five spreads.
 */
export function Zine({ data }: ZineRootProps) {
  const palette = STYLE_PALETTES[data.zine.style];

  return (
    <div className="zine-root flex flex-col">
      <Cover data={data} palette={palette.cover} />
      <EditorsLetter data={data} palette={palette.letter} />
      <Forecast data={data} palette={palette.forecast} />
      <DailyCode data={data} palette={palette.dailyCode} />
      <Foundation data={data} palette={palette.foundation} />
    </div>
  );
}
