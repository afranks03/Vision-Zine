import { Cover } from './spreads/cover';
import { DailyCode } from './spreads/daily-code';
import { EditorsLetter } from './spreads/letter';
import { Forecast } from './spreads/forecast';
import { Foundation } from './spreads/foundation';
import type { ZineRootProps } from './types';

/**
 * Zine — composes spreads in the canonical magazine order. Phase 3a only
 * supports the Editorial style at Letter format; the props are typed for
 * the broader matrix so we can add styles/formats without changing this
 * call site.
 */
export function Zine({ data }: ZineRootProps) {
  return (
    <div className="zine-root flex flex-col">
      <Cover data={data} />
      <EditorsLetter data={data} />
      <Forecast data={data} />
      <DailyCode data={data} />
      <Foundation data={data} />
    </div>
  );
}
