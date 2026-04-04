export type { ResidenceCountry, TaxResult, ResidenceMeta } from './types';
export { TAX_BRACKETS, FR_SOCIAL_CHARGES_RATE, RESIDENCE_META, PPP_INDEX, ALL_RESIDENCE_COUNTRIES } from './engine/tables';
export { calculateTax, simulateResidence, buildPensionSources } from './engine/calculate';
