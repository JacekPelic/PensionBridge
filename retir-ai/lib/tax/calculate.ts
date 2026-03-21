import type { Country } from '@/lib/types';
import type { ResidenceCountry, TaxResult } from './types';
import { TAX_BRACKETS, FR_SOCIAL_CHARGES_RATE, PPP_INDEX } from './tables';
import { COUNTRY_META } from '@/lib/pension';

interface PensionSource {
  sourceCountry: Country;
  label: string;
  grossMonthly: number;
}

function applyBrackets(annualIncome: number, country: ResidenceCountry): number {
  const brackets = TAX_BRACKETS[country];
  let tax = 0;
  let remaining = annualIncome;
  let prevThreshold = 0;

  for (const bracket of brackets) {
    const taxableInBracket = Math.min(remaining, bracket.upTo - prevThreshold);
    if (taxableInBracket <= 0) break;
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
    prevThreshold = bracket.upTo;
  }

  // France: add social charges on top
  if (country === 'FR') {
    tax += annualIncome * FR_SOCIAL_CHARGES_RATE;
  }

  return Math.round(tax);
}

export function calculateTax(grossAnnualEur: number, residenceCountry: ResidenceCountry) {
  const taxAnnual = applyBrackets(grossAnnualEur, residenceCountry);
  const netAnnual = grossAnnualEur - taxAnnual;
  const effectiveRate = grossAnnualEur > 0 ? taxAnnual / grossAnnualEur : 0;
  return { taxAnnual, netAnnual, effectiveRate };
}

export function simulateResidence(
  sources: PensionSource[],
  residenceCountry: ResidenceCountry,
): TaxResult {
  const grossMonthly = sources.reduce((sum, s) => sum + s.grossMonthly, 0);
  const grossAnnual = Math.round(grossMonthly * 12);

  const { taxAnnual, netAnnual, effectiveRate } = calculateTax(grossAnnual, residenceCountry);

  const taxMonthly = Math.round(taxAnnual / 12);
  const netMonthlyTotal = Math.round(netAnnual / 12);

  // Allocate tax proportionally to each source
  const perSource = sources.map((s) => {
    const share = grossMonthly > 0 ? s.grossMonthly / grossMonthly : 0;
    const sourceTax = Math.round(taxMonthly * share);
    return {
      sourceCountry: s.sourceCountry,
      label: s.label,
      grossMonthly: s.grossMonthly,
      taxMonthly: sourceTax,
      netMonthly: s.grossMonthly - sourceTax,
    };
  });

  const pppIndex = PPP_INDEX[residenceCountry];
  const pppAdjustedMonthly = Math.round(netMonthlyTotal / pppIndex);

  return {
    residenceCountry,
    grossAnnual,
    taxAnnual,
    netAnnual,
    effectiveRate,
    grossMonthly,
    taxMonthly,
    netMonthly: netMonthlyTotal,
    pppAdjustedMonthly,
    pppIndex,
    perSource,
  };
}

/** Build pension sources from age-adjusted mock data */
export function buildPensionSources(retirementAge: number): PensionSource[] {
  // Simplified: scale P1 amounts based on retirement age vs standard
  // In reality this would use the full pension engine
  const baseAge = 64;
  const ageDelta = retirementAge - baseAge;

  // France: décote/surcote ~1.25% per year
  const frFactor = 1 + ageDelta * 0.0125 * 4; // 4 trimestres/year
  // Switzerland: ~6.8% per year early/late
  const chFactor = 1 + ageDelta * 0.068;
  // Luxembourg: no early retirement before 57, slight adjustment
  const luFactor = 1 + ageDelta * 0.02;

  const baseP1 = { FR: 1220, CH: 320, LU: 980 };
  const baseP2 = { FR: 280, CH: 1040, LU: 280 };

  return [
    {
      sourceCountry: 'FR',
      label: `${COUNTRY_META.FR.flag} France P1 (CNAV)`,
      grossMonthly: Math.round(baseP1.FR * Math.max(0.5, frFactor)),
    },
    {
      sourceCountry: 'FR',
      label: `${COUNTRY_META.FR.flag} France P2 (AGIRC-ARRCO)`,
      grossMonthly: Math.round(baseP2.FR * Math.max(0.5, frFactor)),
    },
    {
      sourceCountry: 'CH',
      label: `${COUNTRY_META.CH.flag} Switzerland P1 (AVS)`,
      grossMonthly: Math.round(baseP1.CH * Math.max(0.5, chFactor)),
    },
    {
      sourceCountry: 'CH',
      label: `${COUNTRY_META.CH.flag} Switzerland P2 (BVG/LPP)`,
      grossMonthly: Math.round(baseP2.CH * Math.max(0.5, chFactor)),
    },
    {
      sourceCountry: 'LU',
      label: `${COUNTRY_META.LU.flag} Luxembourg P1 (CNAP)`,
      grossMonthly: Math.round(baseP1.LU * Math.max(0.5, luFactor)),
    },
  ];
}
