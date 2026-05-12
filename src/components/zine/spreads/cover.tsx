import type { SpreadPalette } from '../styles';
import type { SpreadProps } from '../types';
import { ArtCatalogCover } from './covers/art-catalog';
import { EditorialCover } from './covers/editorial';
import { FashionCover } from './covers/fashion';
import { FinancialCover } from './covers/financial';
import { LifestyleCover } from './covers/lifestyle';
import { TravelCover } from './covers/travel';

/**
 * Cover router — picks the per-style cover variant. Each style gets a
 * structurally distinct layout, not just a recolored Editorial cover.
 */
export function Cover({ data, palette }: SpreadProps & { palette: SpreadPalette }) {
  switch (data.zine.style) {
    case 'lifestyle':
      return <LifestyleCover data={data} palette={palette} />;
    case 'fashion':
      return <FashionCover data={data} palette={palette} />;
    case 'art_catalog':
      return <ArtCatalogCover data={data} palette={palette} />;
    case 'travel':
      return <TravelCover data={data} palette={palette} />;
    case 'financial':
      return <FinancialCover data={data} palette={palette} />;
    case 'editorial':
    default:
      return <EditorialCover data={data} palette={palette} />;
  }
}
