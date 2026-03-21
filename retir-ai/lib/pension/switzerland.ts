import {
  CH_FULL_CONTRIBUTION_YEARS,
  CH_MIN_PENSION,
  CH_MAX_PENSION,
  CH_MAX_INSURED_INCOME,
  CH_MIN_INCOME,
  CH_EARLY_REDUCTION_PER_YEAR,
  CHF_TO_EUR,
  chGetRetirementAge,
} from './constants';
import type { EmploymentEntry, SwitzerlandP1Params, Pillar1Estimate } from './types';
import { interpolateYearlySalaries, entryMonths } from './salary';

/**
 * Derive Switzerland Pillar 1 parameters from employment entries.
 */
export function deriveSwitzerlandParams(
  entries: EmploymentEntry[],
  birthYear: number,
  gender: 'M' | 'F',
  targetRetirementAge: number,
  isMarried: boolean,
): SwitzerlandP1Params {
  const chEntries = entries.filter((e) => e.country === 'CH');

  // Calculate contribution years and average income using per-year interpolation
  let totalMonths = 0;
  let totalIncome = 0;
  let incomeYears = 0;

  for (const entry of chEntries) {
    totalMonths += entryMonths(entry);

    for (const { salary, months } of interpolateYearlySalaries(entry)) {
      const yearFraction = months / 12;
      const annualChf = entry.currency === 'EUR' ? salary / CHF_TO_EUR : salary;
      totalIncome += annualChf * yearFraction;
      incomeYears += yearFraction;
    }
  }

  const contributionYears = Math.min(Math.round(totalMonths / 12), CH_FULL_CONTRIBUTION_YEARS);
  const avgAnnualIncome = incomeYears > 0
    ? Math.min(Math.round(totalIncome / incomeYears), CH_MAX_INSURED_INCOME)
    : 0;

  const standardAge = chGetRetirementAge(gender, birthYear);
  const retirementAge = Math.max(targetRetirementAge, standardAge - 2); // can retire up to 2 years early

  let earlyReduction = 0;
  if (retirementAge < standardAge) {
    earlyReduction = (standardAge - retirementAge) * CH_EARLY_REDUCTION_PER_YEAR;
  }

  return {
    contributionYears,
    avgAnnualIncome,
    avsScaleNumber: contributionYears,
    isMarried,
    gender,
    retirementAge,
    standardRetirementAge: standardAge,
    earlyWithdrawalReduction: earlyReduction,
  };
}

/**
 * Calculate Switzerland Pillar 1 (AVS/AHV) monthly pension.
 *
 * Uses linear interpolation between min and max pension
 * based on average annual insured income.
 */
export function calculateSwitzerland(params: SwitzerlandP1Params): Pillar1Estimate {
  const warnings: string[] = [];

  // 1. Determine pension for full contribution duration based on avg income
  let fullPension: number;
  if (params.avgAnnualIncome <= CH_MIN_INCOME) {
    fullPension = CH_MIN_PENSION;
  } else if (params.avgAnnualIncome >= CH_MAX_INSURED_INCOME) {
    fullPension = CH_MAX_PENSION;
  } else {
    // Linear interpolation
    const fraction = (params.avgAnnualIncome - CH_MIN_INCOME) / (CH_MAX_INSURED_INCOME - CH_MIN_INCOME);
    fullPension = CH_MIN_PENSION + fraction * (CH_MAX_PENSION - CH_MIN_PENSION);
  }

  // 2. Scale by contribution years (scale 1-44)
  const scaleFraction = Math.min(params.contributionYears / CH_FULL_CONTRIBUTION_YEARS, 1);
  let monthlyPension = fullPension * scaleFraction;

  // 3. Apply early withdrawal reduction
  if (params.earlyWithdrawalReduction > 0) {
    monthlyPension *= (1 - params.earlyWithdrawalReduction);
    warnings.push(
      `Early withdrawal: −${(params.earlyWithdrawalReduction * 100).toFixed(1)}% reduction for retiring ${(params.standardRetirementAge - params.retirementAge).toFixed(1)} year(s) early`
    );
  }

  // 4. Marriage note
  if (params.isMarried) {
    warnings.push('Married: income splitting applies — combined AVS incomes are split 50/50');
  }

  monthlyPension = Math.round(monthlyPension);

  if (params.contributionYears < CH_FULL_CONTRIBUTION_YEARS) {
    warnings.push(
      `${params.contributionYears} of ${CH_FULL_CONTRIBUTION_YEARS} contribution years — partial pension (scale ${params.contributionYears}/44)`
    );
  }

  const isFullRate = params.contributionYears >= CH_FULL_CONTRIBUTION_YEARS && params.earlyWithdrawalReduction === 0;
  const monthlyEur = Math.round(monthlyPension * CHF_TO_EUR);

  return {
    country: 'CH',
    monthlyPensionLocal: monthlyPension,
    currency: 'CHF',
    monthlyPensionEur: monthlyEur,
    isFullRate,
    warnings,
    breakdown: [
      { label: 'Avg annual insured income', value: `CHF ${params.avgAnnualIncome.toLocaleString()}` },
      { label: 'Full pension (at scale 44)', value: `CHF ${Math.round(fullPension).toLocaleString()}/mo` },
      { label: 'Scale fraction', value: `${params.contributionYears} / ${CH_FULL_CONTRIBUTION_YEARS}` },
      { label: 'Early withdrawal reduction', value: params.earlyWithdrawalReduction > 0 ? `−${(params.earlyWithdrawalReduction * 100).toFixed(1)}%` : 'None' },
      { label: 'Monthly pension (CHF)', value: `CHF ${monthlyPension.toLocaleString()}` },
    ],
  };
}
