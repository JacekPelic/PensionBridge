import type { Country } from '@/lib/types';
import type { EmploymentEntry, OnboardingState, Pillar1Estimate } from './types';
import { deriveFranceParams, calculateFrance } from './france';
import { deriveSwitzerlandParams, calculateSwitzerland } from './switzerland';
import { deriveLuxembourgParams, calculateLuxembourg } from './luxembourg';

export type { EmploymentEntry, OnboardingState, Pillar1Estimate } from './types';
export type {
  FranceP1Params,
  SwitzerlandP1Params,
  LuxembourgP1Params,
} from './types';

/** Get the set of countries from employment entries */
export function getCountriesFromEntries(entries: EmploymentEntry[]): Country[] {
  const countries = new Set(entries.map((e) => e.country));
  // Return in display order: FR, CH, LU
  const order: Country[] = ['FR', 'CH', 'LU'];
  return order.filter((c) => countries.has(c));
}

/**
 * Project employment entries to retirement date.
 *
 * Assumption: the user continues in their most recent (ongoing) job at the
 * same salary until their target retirement age. If no ongoing job exists,
 * the most recent ended job is extended. Past (ended) entries are unchanged.
 *
 * This is the standard approach used by public pension simulators (e.g.
 * info-retraite.fr, CNAP.lu pension estimator).
 */
export function projectToRetirement(
  entries: EmploymentEntry[],
  dateOfBirth: string,
  targetRetirementAge: number,
): EmploymentEntry[] {
  if (entries.length === 0) return entries;

  const birthDate = new Date(dateOfBirth);
  const retirementDate = new Date(
    birthDate.getFullYear() + targetRetirementAge,
    birthDate.getMonth(),
    1,
  );
  const retirementIso = retirementDate.toISOString().slice(0, 10);

  // Find the ongoing entry, or the most recently ended one
  const ongoing = entries.find((e) => e.endDate === null);
  const target = ongoing ?? [...entries].sort((a, b) => {
    const aEnd = a.endDate ?? '9999';
    const bEnd = b.endDate ?? '9999';
    return bEnd.localeCompare(aEnd);
  })[0];

  return entries.map((entry) => {
    if (entry.id !== target.id) return entry;
    // Extend this entry to retirement date
    const currentEnd = entry.endDate ? new Date(entry.endDate) : new Date();
    if (retirementDate <= currentEnd) return entry;
    return { ...entry, endDate: retirementIso };
  });
}

/** Derive all country params from employment data + profile */
export function deriveAllParams(state: OnboardingState) {
  const birthYear = new Date(state.dateOfBirth).getFullYear();
  const countries = getCountriesFromEntries(state.employmentEntries);

  // Project career to retirement for the estimate
  const projected = projectToRetirement(
    state.employmentEntries,
    state.dateOfBirth,
    state.targetRetirementAge,
  );

  const franceParams = countries.includes('FR')
    ? deriveFranceParams(projected, birthYear, state.targetRetirementAge)
    : null;

  const switzerlandParams = countries.includes('CH')
    ? deriveSwitzerlandParams(
        projected,
        birthYear,
        state.gender,
        state.targetRetirementAge,
        state.isMarried,
      )
    : null;

  const luxembourgParams = countries.includes('LU')
    ? deriveLuxembourgParams(projected, state.targetRetirementAge)
    : null;

  return { franceParams, switzerlandParams, luxembourgParams };
}

/** Calculate all Pillar 1 estimates from params */
export function calculateAllEstimates(state: OnboardingState): Pillar1Estimate[] {
  const estimates: Pillar1Estimate[] = [];

  if (state.franceParams) {
    estimates.push(calculateFrance(state.franceParams));
  }
  if (state.switzerlandParams) {
    estimates.push(calculateSwitzerland(state.switzerlandParams));
  }
  if (state.luxembourgParams) {
    estimates.push(calculateLuxembourg(state.luxembourgParams));
  }

  return estimates;
}

/** Total Pillar 1 monthly income in EUR */
export function totalPillar1Eur(estimates: Pillar1Estimate[]): number {
  return estimates.reduce((sum, e) => sum + e.monthlyPensionEur, 0);
}

/** Country display metadata */
export const COUNTRY_META: Record<Country, { flag: string; name: string; body: string }> = {
  FR: { flag: '\u{1F1EB}\u{1F1F7}', name: 'France', body: 'CNAV' },
  CH: { flag: '\u{1F1E8}\u{1F1ED}', name: 'Switzerland', body: 'AVS/AHV' },
  LU: { flag: '\u{1F1F1}\u{1F1FA}', name: 'Luxembourg', body: 'CNAP' },
};
