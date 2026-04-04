import type { Country } from '@/shared/types';

export type ResidenceCountry = 'FR' | 'CH' | 'LU' | 'PT' | 'ES' | 'IT';

export interface TaxBracket {
  upTo: number;
  rate: number;
}

export interface ResidenceMeta {
  flag: string;
  name: string;
  regime: string;
}

export interface TaxResult {
  residenceCountry: ResidenceCountry;
  grossAnnual: number;
  taxAnnual: number;
  netAnnual: number;
  effectiveRate: number;
  grossMonthly: number;
  taxMonthly: number;
  netMonthly: number;
  /** Net monthly adjusted for purchasing power (expressed in France-equivalent EUR) */
  pppAdjustedMonthly: number;
  /** PPP index relative to France (France = 1.0, lower = cheaper) */
  pppIndex: number;
  perSource: {
    sourceCountry: Country;
    label: string;
    grossMonthly: number;
    taxMonthly: number;
    netMonthly: number;
  }[];
}
