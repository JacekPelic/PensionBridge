import type { PartialPicture, CountryCode } from '@/modules/identity/picture-types';
import type { DataAsk, AskPriority } from './types';
import {
  ALL_ASKS,
  ASK_CH_AHV,
  ASK_CH_BVG,
  ASK_CH_FREIZUGIGKEIT,
  ASK_CH_3A,
  ASK_FR_RELEVE,
  ASK_LU_EXTRAIT,
  ASK_LU_RCP,
  ASK_LU_PREVOYANCE,
  ASK_FR_AGIRC_ARRCO,
  ASK_FR_PER,
  ASK_PRIVATE_SAVINGS,
} from './asks-data';

/**
 * Given a partial picture, return the asks the user should see, in priority order.
 *
 * Rules (first cut):
 *  - An ask surfaces if its country is in the user's career (residence or worked),
 *    or if it has no country (universal, like private savings).
 *  - Priority is static per ask for now. A future iteration could boost priority
 *    based on band width, gap detection, or unfulfilled pillars.
 *  - The opening has to be complete (residence + countries) to derive meaningful
 *    asks — otherwise returns an empty list.
 */
export function deriveAsks(picture: PartialPicture): DataAsk[] {
  if (!picture.residenceCountry) return [];

  const careerCountries = new Set<CountryCode>([
    picture.residenceCountry,
    ...(picture.countriesWorked ?? []),
  ]);

  const asks: DataAsk[] = [];

  if (careerCountries.has('CH')) {
    asks.push(ASK_CH_AHV);
    asks.push(ASK_CH_BVG);
    asks.push(ASK_CH_FREIZUGIGKEIT);
    asks.push(ASK_CH_3A);
  }
  if (careerCountries.has('FR')) {
    asks.push(ASK_FR_RELEVE);
    asks.push(ASK_FR_AGIRC_ARRCO);
    asks.push(ASK_FR_PER);
  }
  if (careerCountries.has('LU')) {
    asks.push(ASK_LU_EXTRAIT);
    asks.push(ASK_LU_RCP);
    asks.push(ASK_LU_PREVOYANCE);
  }

  // Universal catch-all after country-specific P3 products
  asks.push(ASK_PRIVATE_SAVINGS);

  return sortByPriority(asks);
}

const PRIORITY_ORDER: Record<AskPriority, number> = { high: 0, medium: 1, low: 2 };

function sortByPriority(asks: DataAsk[]): DataAsk[] {
  return [...asks].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

export { ALL_ASKS };
