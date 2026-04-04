import {
  FR_PSS,
  FR_TAUX_PLEIN,
  FR_DECOTE_PER_TRIMESTRE,
  FR_SURCOTE_PER_TRIMESTRE,
  FR_MAX_DECOTE_TRIMESTRES,
  FR_AGE_TAUX_PLEIN_AUTO,
  FR_TRIMESTRES_PER_YEAR,
  frGetBirthYearParams,
} from './constants';
import type { EmploymentEntry, FranceP1Params, Pillar1Estimate } from '../types';
import { interpolateYearlySalaries, entryMonths } from './salary';
import { CHF_TO_EUR } from './constants';

/**
 * Derive France Pillar 1 parameters from employment entries.
 * User can override these values in the verification step.
 */
export function deriveFranceParams(
  entries: EmploymentEntry[],
  birthYear: number,
  targetRetirementAge: number,
): FranceP1Params {
  const frEntries = entries.filter((e) => e.country === 'FR');
  const { trimestres: trimestresRequired, legalAge } = frGetBirthYearParams(birthYear);

  // Calculate total months worked in France → trimestres
  let totalMonths = 0;
  const annualSalaries: number[] = [];

  for (const entry of frEntries) {
    totalMonths += entryMonths(entry);

    // Per-year interpolated salaries for SAM calculation
    for (const { salary } of interpolateYearlySalaries(entry)) {
      const salaryEur = entry.currency === 'CHF' ? salary * CHF_TO_EUR : salary;
      annualSalaries.push(Math.min(salaryEur, FR_PSS));
    }
  }

  // Trimestres: 1 trimestre per 3 months of contributions
  const trimestresValidated = Math.min(
    Math.floor(totalMonths / 3),
    trimestresRequired, // can't exceed required for ratio purposes (but surcote possible)
  );

  // SAM: average of best 25 years (or all years if < 25)
  const sortedSalaries = [...annualSalaries].sort((a, b) => b - a);
  const best25 = sortedSalaries.slice(0, 25);
  const samBest25 = best25.length > 0 ? best25.reduce((sum, s) => sum + s, 0) / best25.length : 0;

  // Décote calculation
  const retirementAge = Math.max(targetRetirementAge, legalAge);
  const actualTrimestres = Math.floor(totalMonths / 3);

  let decoteTrimestres = 0;
  if (actualTrimestres < trimestresRequired && retirementAge < FR_AGE_TAUX_PLEIN_AUTO) {
    const missingByTrimestres = trimestresRequired - actualTrimestres;
    const missingByAge = (FR_AGE_TAUX_PLEIN_AUTO - retirementAge) * FR_TRIMESTRES_PER_YEAR;
    decoteTrimestres = Math.min(Math.min(missingByTrimestres, missingByAge), FR_MAX_DECOTE_TRIMESTRES);
  }

  const taux = FR_TAUX_PLEIN - decoteTrimestres * FR_DECOTE_PER_TRIMESTRE;

  return {
    trimestresValidated: actualTrimestres,
    trimestresRequired,
    samBest25: Math.round(samBest25),
    legalMinAge: legalAge,
    retirementAge,
    decoteTrimestres,
    taux,
  };
}

/**
 * Calculate France Pillar 1 monthly pension from parameters.
 */
export function calculateFrance(params: FranceP1Params): Pillar1Estimate {
  const warnings: string[] = [];

  // Effective taux with décote/surcote
  let taux = FR_TAUX_PLEIN;
  const actualTrimestres = params.trimestresValidated;
  const required = params.trimestresRequired;

  if (actualTrimestres < required && params.retirementAge < FR_AGE_TAUX_PLEIN_AUTO) {
    const missingByTrimestres = required - actualTrimestres;
    const missingByAge = (FR_AGE_TAUX_PLEIN_AUTO - params.retirementAge) * FR_TRIMESTRES_PER_YEAR;
    const decote = Math.min(Math.min(missingByTrimestres, missingByAge), FR_MAX_DECOTE_TRIMESTRES);
    taux = FR_TAUX_PLEIN - decote * FR_DECOTE_PER_TRIMESTRE;
    if (decote > 0) {
      warnings.push(`Décote applied: ${decote} missing trimestre(s) reduce your rate to ${(taux * 100).toFixed(1)}%`);
    }
  } else if (actualTrimestres > required) {
    const extraTrimestres = actualTrimestres - required;
    const surcote = extraTrimestres * FR_SURCOTE_PER_TRIMESTRE;
    taux = FR_TAUX_PLEIN + surcote;
  }

  // Ratio of validated trimestres to required (capped at 1 for base calc, surcote handled separately)
  const ratio = Math.min(actualTrimestres / required, 1);

  // Annual pension = SAM × taux × ratio
  const annualPension = params.samBest25 * taux * ratio;
  const monthlyPension = Math.round(annualPension / 12);

  if (actualTrimestres < required) {
    warnings.push(`${actualTrimestres} of ${required} trimestres validated — ${required - actualTrimestres} short of full rate`);
  }

  const isFullRate = actualTrimestres >= required || params.retirementAge >= FR_AGE_TAUX_PLEIN_AUTO;

  return {
    country: 'FR',
    monthlyPensionLocal: monthlyPension,
    currency: 'EUR',
    monthlyPensionEur: monthlyPension,
    isFullRate,
    warnings,
    breakdown: [
      { label: 'SAM (best 25 years)', value: `€${params.samBest25.toLocaleString()}` },
      { label: 'Effective rate (taux)', value: `${(taux * 100).toFixed(2)}%` },
      { label: 'Trimestres ratio', value: `${actualTrimestres} / ${required}` },
      { label: 'Annual pension', value: `€${Math.round(annualPension).toLocaleString()}` },
    ],
  };
}
