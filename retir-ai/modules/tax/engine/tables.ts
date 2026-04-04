import type { TaxBracket, ResidenceCountry, ResidenceMeta } from '../types';

// Simplified 2025 progressive tax brackets for pension income
// These are prototype approximations — not tax advice

export const TAX_BRACKETS: Record<ResidenceCountry, TaxBracket[]> = {
  FR: [
    { upTo: 11294, rate: 0 },
    { upTo: 28797, rate: 0.11 },
    { upTo: 82341, rate: 0.30 },
    { upTo: 177106, rate: 0.41 },
    { upTo: Infinity, rate: 0.45 },
  ],
  CH: [
    // Combined federal + cantonal (Vaud estimate), in EUR
    { upTo: 13775, rate: 0 },
    { upTo: 30400, rate: 0.05 },
    { upTo: 42750, rate: 0.10 },
    { upTo: 57000, rate: 0.15 },
    { upTo: 76000, rate: 0.20 },
    { upTo: Infinity, rate: 0.25 },
  ],
  LU: [
    { upTo: 11265, rate: 0 },
    { upTo: 13173, rate: 0.08 },
    { upTo: 15081, rate: 0.12 },
    { upTo: 16989, rate: 0.14 },
    { upTo: 20805, rate: 0.20 },
    { upTo: 24621, rate: 0.24 },
    { upTo: 28437, rate: 0.30 },
    { upTo: 32253, rate: 0.33 },
    { upTo: 36069, rate: 0.36 },
    { upTo: 39885, rate: 0.39 },
    { upTo: Infinity, rate: 0.42 },
  ],
  PT: [
    // NHR/RNH regime: flat 10% on foreign pension income
    { upTo: Infinity, rate: 0.10 },
  ],
  ES: [
    { upTo: 12450, rate: 0.19 },
    { upTo: 20200, rate: 0.24 },
    { upTo: 35200, rate: 0.30 },
    { upTo: 60000, rate: 0.37 },
    { upTo: 300000, rate: 0.45 },
    { upTo: Infinity, rate: 0.47 },
  ],
  IT: [
    // 7% flat tax for qualifying retirees relocating to Southern municipalities
    { upTo: Infinity, rate: 0.07 },
  ],
};

// France: additional social charges on pension income
export const FR_SOCIAL_CHARGES_RATE = 0.091; // CSG 8.3% + CRDS 0.5% + CASA 0.3%

export const RESIDENCE_META: Record<ResidenceCountry, ResidenceMeta> = {
  FR: { flag: '\u{1F1EB}\u{1F1F7}', name: 'France', regime: 'Standard progressive + 9.1% social charges (CSG/CRDS/CASA)' },
  CH: { flag: '\u{1F1E8}\u{1F1ED}', name: 'Switzerland', regime: 'Combined federal + cantonal rates (Vaud estimate). Varies by canton' },
  LU: { flag: '\u{1F1F1}\u{1F1FA}', name: 'Luxembourg', regime: 'Standard progressive rates. Pension income taxed as ordinary income' },
  PT: { flag: '\u{1F1F5}\u{1F1F9}', name: 'Portugal', regime: 'NHR regime: 10% flat tax on foreign pension income' },
  ES: { flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain', regime: 'Standard progressive rates. No special retiree regime' },
  IT: { flag: '\u{1F1EE}\u{1F1F9}', name: 'Italy', regime: '7% flat tax for retirees in qualifying Southern municipalities' },
};

/**
 * Purchasing Power Parity index relative to France (France = 1.0).
 * Lower = cheaper cost of living = your money goes further.
 * Based on Eurostat/OECD 2024 comparative price levels for household consumption.
 */
export const PPP_INDEX: Record<ResidenceCountry, number> = {
  FR: 1.0,    // baseline
  CH: 1.52,   // Switzerland is ~52% more expensive than France
  LU: 1.18,   // Luxembourg ~18% more expensive
  PT: 0.72,   // Portugal ~28% cheaper
  ES: 0.78,   // Spain ~22% cheaper
  IT: 0.88,   // Italy ~12% cheaper
};

export const ALL_RESIDENCE_COUNTRIES: ResidenceCountry[] = ['FR', 'CH', 'LU', 'PT', 'ES', 'IT'];
