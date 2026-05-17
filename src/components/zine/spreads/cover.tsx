import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';
import { ACCENT_HEX } from './covers/_shared';
import { BigTypeCover } from './covers/big-type';
import { DailyLifeCover } from './covers/daily-life';
import { DesignCover } from './covers/design';
import { FashionCover } from './covers/fashion';
import { TravelCover } from './covers/travel';

/**
 * Cover router (Phase 3d-i). Dispatches on `zine.cover_layout` — the
 * new layout field that's independent of `zine.style`. The accent
 * color is overridden into the palette from `zine.cover_accent` so
 * the cover gets the user's hot-color choice without disturbing the
 * inner spreads' palette.
 *
 * The pre-3d-i version dispatched on `zine.style`; the migration
 * 20260517160000 backfilled cover_layout from style so existing
 * zines keep their previous cover treatment.
 */
export function Cover(props: SpreadProps & { palette: SpreadPalette }) {
  const { data, palette } = props;
  const composed: SpreadPalette = {
    ...palette,
    accent: ACCENT_HEX[data.zine.cover_accent],
  };

  switch (data.zine.cover_layout) {
    case 'fashion':
      return <FashionCover {...props} palette={composed} />;
    case 'travel':
      return <TravelCover {...props} palette={composed} />;
    case 'design':
      return <DesignCover {...props} palette={composed} />;
    case 'daily_life':
      return <DailyLifeCover {...props} palette={composed} />;
    case 'big_type':
    default:
      return <BigTypeCover {...props} palette={composed} />;
  }
}
