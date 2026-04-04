import {
  LU_FULL_INSURANCE_YEARS,
  LU_MIN_ELIGIBILITY_MONTHS,
  LU_FLAT_RATE_BASE,
  LU_REFERENCE_SALARY,
  LU_PROPORTIONAL_RATE,
  LU_MIN_PENSION_40YRS,
  LU_SALARY_CAP,
} from './constants';
import type { EmploymentEntry, LuxembourgP1Params, Pillar1Estimate } from '../types';
import { interpolateYearlySalaries, entryMonths } from './salary';

/**
 * Derive Luxembourg Pillar 1 parameters from employment entries.
 *
 * EU Regulation 883/2004: insurance periods across all EU/EEA member states
 * (and Switzerland via bilateral agreement) are totalized to meet the
 * 10-year (120-month) minimum eligibility threshold. Luxembourg then pays
 * a pro-rata pension based only on the LU contribution years.
 */
export function deriveLuxembourgParams(
  entries: EmploymentEntry[],
  targetRetirementAge: number,
): LuxembourgP1Params {
  const luEntries = entries.filter((e) => e.country === 'LU');

  // LU-specific totals (pension is calculated on these)
  let luMonths = 0;
  let totalCoefficientSum = 0;

  for (const entry of luEntries) {
    luMonths += entryMonths(entry);

    // Per-year interpolated coefficients
    for (const { salary, months } of interpolateYearlySalaries(entry)) {
      const yearFraction = months / 12;
      const cappedSalary = Math.min(salary, LU_SALARY_CAP);
      const annualCoefficient = cappedSalary / LU_REFERENCE_SALARY;
      totalCoefficientSum += annualCoefficient * yearFraction;
    }
  }

  // EU totalization: count ALL EU/EEA + CH months for eligibility
  let totalEuMonths = 0;
  for (const entry of entries) {
    totalEuMonths += entryMonths(entry);
  }

  const insuranceYears = Math.min(Math.round(luMonths / 12), LU_FULL_INSURANCE_YEARS);
  const totalEuInsuranceYears = Math.round(totalEuMonths / 12);
  // Eligible if LU alone >= 120 months OR combined EU total >= 120 months
  const meetsMinimumEligibility = totalEuMonths >= LU_MIN_ELIGIBILITY_MONTHS;

  // Flat-rate: (years / 40) × base amount — uses LU years only
  const flatRateAmount = Math.round((insuranceYears / LU_FULL_INSURANCE_YEARS) * LU_FLAT_RATE_BASE);

  // Proportional: coefficientSum × proportionalRate × referenceSalary / 12
  const proportionalAmount = Math.round(
    (totalCoefficientSum * LU_PROPORTIONAL_RATE * LU_REFERENCE_SALARY) / 12
  );

  return {
    insuranceYears,
    totalCoefficientSum: Math.round(totalCoefficientSum * 100) / 100,
    flatRateAmount,
    proportionalAmount,
    retirementAge: Math.max(targetRetirementAge, 57),
    meetsMinimumEligibility,
    totalEuInsuranceYears,
  };
}

/**
 * Calculate Luxembourg Pillar 1 (CNAP) monthly pension.
 *
 * Pension = flat-rate + proportional + end-of-year allowance (13th month / 12)
 */
export function calculateLuxembourg(params: LuxembourgP1Params): Pillar1Estimate {
  const warnings: string[] = [];

  if (!params.meetsMinimumEligibility) {
    warnings.push(
      `Minimum 10 years (120 months) of combined EU/EEA insurance required (EU Reg. 883/2004). ` +
      `You have ${params.totalEuInsuranceYears} year(s) total across all countries.`
    );
    return {
      country: 'LU',
      monthlyPensionLocal: 0,
      currency: 'EUR',
      monthlyPensionEur: 0,
      isFullRate: false,
      warnings,
      breakdown: [
        { label: 'LU insurance years', value: `${params.insuranceYears}` },
        { label: 'Total EU/EEA years', value: `${params.totalEuInsuranceYears}` },
        { label: 'Status', value: 'Below minimum eligibility (10 years combined)' },
      ],
    };
  }

  // Note EU totalization if LU alone would have been insufficient
  if (params.insuranceYears < 10 && params.meetsMinimumEligibility) {
    warnings.push(
      `Eligible via EU totalization (Reg. 883/2004): ${params.totalEuInsuranceYears} combined EU/EEA years meet the 10-year threshold. Pension is pro-rata on ${params.insuranceYears} LU year(s).`
    );
  }

  // Recalculate from params (user may have edited values)
  const flatRate = Math.round(
    (params.insuranceYears / LU_FULL_INSURANCE_YEARS) * LU_FLAT_RATE_BASE
  );

  const proportional = Math.round(
    (params.totalCoefficientSum * LU_PROPORTIONAL_RATE * LU_REFERENCE_SALARY) / 12
  );

  // 13th month spread across 12 months
  const basePension = flatRate + proportional;
  const withEndOfYear = Math.round(basePension * (13 / 12));

  // Apply minimum pension if 40+ years
  let monthlyPension = withEndOfYear;
  if (params.insuranceYears >= LU_FULL_INSURANCE_YEARS && monthlyPension < LU_MIN_PENSION_40YRS) {
    monthlyPension = LU_MIN_PENSION_40YRS;
    warnings.push('Minimum pension guarantee applied (40+ years of contributions)');
  }

  if (params.insuranceYears < LU_FULL_INSURANCE_YEARS) {
    warnings.push(
      `${params.insuranceYears} of ${LU_FULL_INSURANCE_YEARS} insurance years — flat-rate component is proportionally reduced`
    );
  }

  const isFullRate = params.insuranceYears >= LU_FULL_INSURANCE_YEARS;

  return {
    country: 'LU',
    monthlyPensionLocal: monthlyPension,
    currency: 'EUR',
    monthlyPensionEur: monthlyPension,
    isFullRate,
    warnings,
    breakdown: [
      { label: 'LU insurance years', value: `${params.insuranceYears} / ${LU_FULL_INSURANCE_YEARS}` },
      { label: 'Total EU/EEA years', value: `${params.totalEuInsuranceYears} (for eligibility)` },
      { label: 'Income coefficient sum', value: `${params.totalCoefficientSum.toFixed(2)}` },
      { label: 'Flat-rate component', value: `\u20AC${flatRate.toLocaleString()}/mo` },
      { label: 'Proportional component', value: `\u20AC${proportional.toLocaleString()}/mo` },
      { label: 'End-of-year allowance', value: `+\u20AC${Math.round(basePension / 12).toLocaleString()}/mo (13th month)` },
    ],
  };
}
