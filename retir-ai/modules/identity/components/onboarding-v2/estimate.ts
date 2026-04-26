/**
 * Partial-input pension estimator.
 *
 * Two layers:
 *  - **Anchor estimate** — rough country anchors driven by years × full-pension scaling.
 *    Used for countries we don't have an engine for (DE/BE/IT/ES/PT/NL) and for
 *    very partial inputs.
 *  - **Real engine estimate** — for FR/CH/LU we synthesise an EmploymentEntry[]
 *    timeline from the picture and feed it to the actual pension engine. The
 *    result replaces the anchor band for that country with a tighter range.
 *
 * Each missing input widens the band; each present input narrows it and may
 * unlock a contextual insight.
 */

import type { CountryCode, PartialPicture } from '@/modules/identity/picture-types';
import type { EmploymentEntry, Pillar1Estimate } from '@/modules/pension/types';
import { calculateFrance, deriveFranceParams } from '@/modules/pension/engine/france';
import {
  calculateSwitzerland,
  deriveSwitzerlandParams,
} from '@/modules/pension/engine/switzerland';
import {
  calculateLuxembourg,
  deriveLuxembourgParams,
} from '@/modules/pension/engine/luxembourg';
import { calculateTax, type ResidenceCountry } from '@/modules/tax';

export type { CountryCode, PartialPicture };

export interface CountryBand {
  country: CountryCode;
  flag: string;
  name: string;
  low: number;
  high: number;
  /** Estimated years used in calculation (for tooltip / debug). */
  years: number;
  /** True if this band came from the real engine, not the anchor scaler. */
  fromEngine: boolean;
  /** True if the user has confirmed / verified this via manual entry. */
  verified: boolean;
}

export interface Pillar2Row {
  askId: string;
  country: CountryCode;
  flag: string;
  label: string;
  monthlyEur: number;
}

export interface Pillar3Row {
  monthlyEur: number;
  balance: number;
  monthlyContribution: number;
  growthAssumption: number;
  yearsToRetire: number;
}

export interface NetSummary {
  /** Net total across all pillars, per month. */
  totalMonthly: number;
  /** Effective tax rate applied, 0–1. */
  effectiveRate: number;
  /** Multiplier (1 - effectiveRate) — apply to any gross number for a net equivalent. */
  netMultiplier: number;
  /** Two-letter residence country used for the calc. */
  residenceCountry: ResidenceCountry;
}

export interface Estimate {
  /** Gross per-country low/high band sums (P1). */
  monthlyLow: number;
  monthlyHigh: number;
  bands: CountryBand[];
  pillar2: Pillar2Row[];
  pillar3: Pillar3Row | null;
  /** Gross total across all pillars. */
  totalMonthly: number;
  /** Net figures if the residence country is in the tax model (FR/CH/LU/PT/ES/IT). Null otherwise. */
  net: NetSummary | null;
  sharpness: number; // 0–100
  insight: string;
}

const TAX_RESIDENCES: ResidenceCountry[] = ['FR', 'CH', 'LU', 'PT', 'ES', 'IT'];
function isTaxResidence(c: CountryCode): c is ResidenceCountry {
  return (TAX_RESIDENCES as CountryCode[]).includes(c);
}

interface CountryAnchor {
  flag: string;
  name: string;
  /** Approximate monthly state pension after a full career on the local reference salary. */
  fullPension: number;
  /** Years required for full pension. */
  fullYears: number;
  /** Local reference salary used to scale the pension. */
  referenceSalary: number;
}

const ANCHORS: Record<CountryCode, CountryAnchor> = {
  LU: { flag: '\u{1F1F1}\u{1F1FA}', name: 'Luxembourg',  fullPension: 2500, fullYears: 40, referenceSalary: 75000 },
  FR: { flag: '\u{1F1EB}\u{1F1F7}', name: 'France',      fullPension: 1500, fullYears: 43, referenceSalary: 42000 },
  CH: { flag: '\u{1F1E8}\u{1F1ED}', name: 'Switzerland', fullPension: 2000, fullYears: 44, referenceSalary: 95000 },
  DE: { flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany',     fullPension: 1600, fullYears: 45, referenceSalary: 50000 },
  BE: { flag: '\u{1F1E7}\u{1F1EA}', name: 'Belgium',     fullPension: 1700, fullYears: 45, referenceSalary: 50000 },
  IT: { flag: '\u{1F1EE}\u{1F1F9}', name: 'Italy',       fullPension: 1500, fullYears: 42, referenceSalary: 33000 },
  ES: { flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain',       fullPension: 1400, fullYears: 37, referenceSalary: 30000 },
  PT: { flag: '\u{1F1F5}\u{1F1F9}', name: 'Portugal',    fullPension: 1100, fullYears: 40, referenceSalary: 22000 },
  NL: { flag: '\u{1F1F3}\u{1F1F1}', name: 'Netherlands', fullPension: 1500, fullYears: 50, referenceSalary: 50000 },
};

const DEFAULT_RETIREMENT_AGE = 65;
const ASSUMED_CAREER_START = 23;
const DEFAULT_CAREER_YEARS = 25; // when age is unknown

/** Countries with a real pension engine available. */
const ENGINE_COUNTRIES: CountryCode[] = ['FR', 'CH', 'LU'];

export function estimate(p: PartialPicture): Estimate {
  if (!p.residenceCountry) {
    return {
      monthlyLow: 0,
      monthlyHigh: 0,
      bands: [],
      pillar2: [],
      pillar3: null,
      totalMonthly: 0,
      net: null,
      sharpness: 0,
      insight: 'Tell me where you live to see your starting picture.',
    };
  }

  const residenceAnchor = ANCHORS[p.residenceCountry];

  // Country mix — always include residence
  const explicitCountries = p.countriesWorked ?? [];
  const countries: CountryCode[] = explicitCountries.includes(p.residenceCountry)
    ? explicitCountries
    : [p.residenceCountry, ...explicitCountries];

  // Career-year accounting
  const pastCareerYears = p.age != null
    ? Math.max(0, Math.min(45, p.age - ASSUMED_CAREER_START))
    : DEFAULT_CAREER_YEARS;
  const futureYears = p.age != null
    ? Math.max(0, (p.targetRetirementAge ?? DEFAULT_RETIREMENT_AGE) - p.age)
    : 0;

  // Per-country years: explicit if given; otherwise even split of past career
  const perCountryYears: Record<CountryCode, number> = {} as Record<CountryCode, number>;
  for (const c of countries) {
    const explicit = p.yearsPerCountry?.[c];
    if (explicit != null) {
      perCountryYears[c] = explicit;
    } else {
      perCountryYears[c] = countries.length > 0 ? pastCareerYears / countries.length : 0;
    }
  }
  // Add future years to residence country if not explicitly specified
  if (p.yearsPerCountry?.[p.residenceCountry] == null) {
    perCountryYears[p.residenceCountry] = (perCountryYears[p.residenceCountry] ?? 0) + futureYears;
  }

  // Try real engine for FR/CH/LU when we have enough data
  const engineResults = runEngineWhenPossible(p, countries, perCountryYears);

  // Salary multiplier — only meaningful for residence country (anchor path).
  // Use the residence country's current salary (end of the ongoing band).
  const residenceCurrentSalary = p.salaryPerCountry?.[p.residenceCountry]?.end;
  const salaryMultiplier = residenceCurrentSalary != null
    ? clamp(residenceCurrentSalary / residenceAnchor.referenceSalary, 0.4, 2.5)
    : 1.0;

  // Uncertainty multipliers for the anchor path
  const lowMult = computeLowMultiplier(p);
  const highMult = computeHighMultiplier(p);

  const p1VerifiedAskIds = new Set(
    Object.entries(p.askStatus ?? {})
      .filter(([, s]) => s === 'fulfilled')
      .map(([id]) => id),
  );

  const bands: CountryBand[] = countries.map((c) => {
    const anchor = ANCHORS[c];
    const years = perCountryYears[c] ?? 0;
    const verified = isP1Verified(c, p1VerifiedAskIds);

    const engineEur = engineResults[c];
    if (engineEur != null) {
      const eMult = engineBandMultipliers(p);
      return {
        country: c,
        flag: anchor.flag,
        name: anchor.name,
        years: Math.round(years * 10) / 10,
        low: Math.round(engineEur * eMult.low),
        high: Math.round(engineEur * eMult.high),
        fromEngine: true,
        verified,
      };
    }

    const yearsRatio = clamp(years / anchor.fullYears, 0, 1);
    const baseEstimate = anchor.fullPension * yearsRatio;
    const adjusted = c === p.residenceCountry ? baseEstimate * salaryMultiplier : baseEstimate;
    return {
      country: c,
      flag: anchor.flag,
      name: anchor.name,
      years: Math.round(years * 10) / 10,
      low: Math.round(adjusted * lowMult),
      high: Math.round(adjusted * highMult),
      fromEngine: false,
      verified,
    };
  });

  const monthlyLow = bands.reduce((s, b) => s + b.low, 0);
  const monthlyHigh = bands.reduce((s, b) => s + b.high, 0);
  const p1Mid = Math.round((monthlyLow + monthlyHigh) / 2);

  // Pillar 2 — take whatever the user has given us
  const pillar2: Pillar2Row[] = (p.pillar2Plans ?? []).map((plan) => ({
    askId: plan.askId,
    country: plan.country,
    flag: ANCHORS[plan.country]?.flag ?? '',
    label: plan.label,
    monthlyEur: plan.monthlyEur,
  }));
  const p2Monthly = pillar2.reduce((s, r) => s + r.monthlyEur, 0);

  // Pillar 3 — simple future-value + safe withdrawal projection
  const pillar3 = computeP3Row(p);
  const p3Monthly = pillar3?.monthlyEur ?? 0;

  const totalMonthly = p1Mid + p2Monthly + p3Monthly;

  // Net-of-tax summary at the residence country. P3 drawdown is taxable in most
  // systems the same way as pension income — we treat the whole pot as pension
  // income for the effective-rate calc, which is a reasonable first approximation.
  let net: NetSummary | null = null;
  if (p.residenceCountry && isTaxResidence(p.residenceCountry) && totalMonthly > 0) {
    const { netAnnual, effectiveRate } = calculateTax(totalMonthly * 12, p.residenceCountry);
    const netMultiplier = totalMonthly > 0 ? netAnnual / (totalMonthly * 12) : 1;
    net = {
      totalMonthly: Math.round(netAnnual / 12),
      effectiveRate,
      netMultiplier,
      residenceCountry: p.residenceCountry,
    };
  }

  return {
    monthlyLow,
    monthlyHigh,
    bands,
    pillar2,
    pillar3,
    totalMonthly,
    net,
    sharpness: computeSharpness(p),
    insight: computeInsight(p, countries, perCountryYears, bands),
  };
}

function isP1Verified(country: CountryCode, fulfilledAskIds: Set<string>): boolean {
  const map: Partial<Record<CountryCode, string>> = {
    LU: 'lu-extrait',
    FR: 'fr-releve',
    CH: 'ch-ahv',
  };
  const id = map[country];
  return id != null && fulfilledAskIds.has(id);
}

/**
 * Project private savings to retirement and convert to a monthly income via
 * a 4% safe withdrawal rate. Assumes contributions through retirement age.
 */
function computeP3Row(p: PartialPicture): Pillar3Row | null {
  const savings = p.pillar3Savings;
  if (!savings) return null;

  const retirementAge = p.targetRetirementAge ?? DEFAULT_RETIREMENT_AGE;
  const age = p.age ?? 40;
  const yearsToRetire = Math.max(0, retirementAge - age);

  const growth = Math.max(0, savings.growthAssumption) / 100;
  let futureValue: number;

  if (growth === 0) {
    futureValue = savings.currentBalance + savings.monthlyContribution * 12 * yearsToRetire;
  } else {
    const g = Math.pow(1 + growth, yearsToRetire);
    const annualContrib = savings.monthlyContribution * 12;
    futureValue = savings.currentBalance * g + annualContrib * ((g - 1) / growth);
  }

  const SAFE_WITHDRAWAL_RATE = 0.04;
  const monthlyEur = Math.round((futureValue * SAFE_WITHDRAWAL_RATE) / 12);

  return {
    monthlyEur,
    balance: savings.currentBalance,
    monthlyContribution: savings.monthlyContribution,
    growthAssumption: savings.growthAssumption,
    yearsToRetire,
  };
}

// ─── Real engine wiring ─────────────────────────────────────────────

/**
 * Run the real FR/CH/LU engine for whichever countries we have enough data for.
 * Returns a map of country → monthly EUR estimate.
 *
 * Uses user-provided employmentEntries when present, otherwise synthesises
 * entries from age + yearsPerCountry + salaryPerCountry.
 */
function runEngineWhenPossible(
  p: PartialPicture,
  countries: CountryCode[],
  perCountryYears: Record<CountryCode, number>,
): Partial<Record<CountryCode, number>> {
  const eligibleEngines = countries.filter((c): c is 'FR' | 'CH' | 'LU' =>
    ENGINE_COUNTRIES.includes(c),
  );
  if (eligibleEngines.length === 0) return {};

  // Need either user-provided entries or enough fields to synthesise
  const haveEntries = (p.employmentEntries?.length ?? 0) > 0;
  const canSynthesise = p.age != null && p.yearsPerCountry != null;
  if (!haveEntries && !canSynthesise) return {};

  const entries: EmploymentEntry[] = haveEntries
    ? (p.employmentEntries as EmploymentEntry[])
    : synthesiseEntries(p, perCountryYears);
  if (entries.length === 0) return {};

  const targetRetirementAge = p.targetRetirementAge ?? DEFAULT_RETIREMENT_AGE;
  const birthYear = p.age != null
    ? new Date().getFullYear() - p.age
    : new Date().getFullYear() - 40;

  const out: Partial<Record<CountryCode, number>> = {};

  if (eligibleEngines.includes('FR') && entries.some((e) => e.country === 'FR')) {
    try {
      const params = deriveFranceParams(entries, birthYear, targetRetirementAge);
      const est = calculateFrance(params);
      out.FR = est.monthlyPensionEur;
    } catch {
      // engine failed on this synthesised input — skip; anchor band wins
    }
  }
  if (eligibleEngines.includes('CH') && entries.some((e) => e.country === 'CH')) {
    try {
      const params = deriveSwitzerlandParams(
        entries,
        birthYear,
        'M',
        targetRetirementAge,
        false,
      );
      const est = calculateSwitzerland(params);
      out.CH = est.monthlyPensionEur;
    } catch {
      // skip
    }
  }
  if (eligibleEngines.includes('LU') && entries.some((e) => e.country === 'LU')) {
    try {
      const params = deriveLuxembourgParams(entries, targetRetirementAge);
      const est: Pillar1Estimate = calculateLuxembourg(params);
      out.LU = est.monthlyPensionEur;
    } catch {
      // skip
    }
  }
  return out;
}

/**
 * Synthesise a chronological EmploymentEntry[] from the picture's rough fields.
 * Non-residence countries first (alphabetical), residence last (ongoing).
 * Per-country start/end salaries come from salaryPerCountry when given,
 * otherwise we fall back to the country's reference salary.
 */
function synthesiseEntries(
  p: PartialPicture,
  perCountryYears: Record<CountryCode, number>,
): EmploymentEntry[] {
  if (p.residenceCountry == null || p.age == null) return [];

  const birthYear = new Date().getFullYear() - p.age;
  let cursor = birthYear + ASSUMED_CAREER_START; // first working year
  const entries: EmploymentEntry[] = [];

  const allCountries = Object.keys(perCountryYears) as CountryCode[];
  const nonResidence = allCountries
    .filter((c) => c !== p.residenceCountry)
    .sort();
  const ordered: CountryCode[] = [...nonResidence, p.residenceCountry];

  for (const country of ordered) {
    const years = Math.round(perCountryYears[country] ?? 0);
    if (years <= 0) continue;

    const isLast = country === ordered[ordered.length - 1];
    const startDate = `${cursor}-01-01`;
    const endDate = isLast ? null : `${cursor + years}-01-01`;

    const anchor = ANCHORS[country];
    const given = p.salaryPerCountry?.[country];
    const startSalary = given?.start ?? anchor.referenceSalary;
    const endSalary = given?.end ?? given?.start ?? anchor.referenceSalary;
    const currency: 'EUR' | 'CHF' = country === 'CH' ? 'CHF' : 'EUR';

    entries.push({
      id: `synth-${country}`,
      country: country as 'FR' | 'CH' | 'LU',
      startDate,
      endDate,
      startSalary,
      endSalary,
      currency,
      employmentType: 'employed',
    });

    cursor += years;
  }

  return entries;
}

/**
 * Band multipliers when the engine produced the central estimate.
 * Tighter than anchor bands since the engine accounts for years/salary properly.
 */
function engineBandMultipliers(p: PartialPicture): { low: number; high: number } {
  // Tighter when user-provided entries exist; wider when we synthesised them
  const synth = (p.employmentEntries?.length ?? 0) === 0;
  if (synth) return { low: 0.85, high: 1.15 };
  return { low: 0.95, high: 1.05 };
}

// ─── Helpers ────────────────────────────────────────────────────────

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function salaryCountriesCount(p: PartialPicture): number {
  if (!p.salaryPerCountry) return 0;
  return Object.values(p.salaryPerCountry).filter(
    (s) => s != null && (s.start != null || s.end != null),
  ).length;
}

function computeLowMultiplier(p: PartialPicture): number {
  let mult = 0.65;
  if (p.age != null) mult += 0.07;
  if (p.yearsPerCountry && Object.keys(p.yearsPerCountry).length > 0) mult += 0.12;
  if (salaryCountriesCount(p) > 0) mult += 0.06;
  return Math.min(0.92, mult);
}

function computeHighMultiplier(p: PartialPicture): number {
  let mult = 1.50;
  if (p.age != null) mult -= 0.10;
  if (p.yearsPerCountry && Object.keys(p.yearsPerCountry).length > 0) mult -= 0.18;
  if (salaryCountriesCount(p) > 0) mult -= 0.10;
  return Math.max(1.06, mult);
}

function computeSharpness(p: PartialPicture): number {
  let score = 0;
  if (p.residenceCountry) score += 12;
  if (p.age != null) score += 12;
  if (p.countriesWorked && p.countriesWorked.length > 0) score += 8;
  if (p.yearsPerCountry) {
    const filled = Object.values(p.yearsPerCountry).filter((v) => v != null).length;
    score += Math.min(20, filled * 7);
  }
  // Salary per country — scale by how many countries have it (max ~13 pts)
  const salaryCount = salaryCountriesCount(p);
  if (salaryCount > 0) {
    score += Math.min(13, 6 + salaryCount * 3);
  }
  if (p.targetRetirementAge != null) score += 5;
  if (p.firstName) score += 3;
  if ((p.employmentEntries?.length ?? 0) > 0) score += 15; // big jump for real entries
  return Math.min(100, score);
}

/**
 * Pick the most relevant insight based on what's known.
 * Order matters — later branches win because they require richer state.
 */
function computeInsight(
  p: PartialPicture,
  countries: CountryCode[],
  perCountryYears: Record<CountryCode, number>,
  bands: CountryBand[],
): string {
  if (!p.residenceCountry) {
    return 'Tell me a bit about yourself and the picture will sharpen.';
  }

  const residenceAnchor = ANCHORS[p.residenceCountry];
  const residenceCurrentSalary = p.salaryPerCountry?.[p.residenceCountry]?.end;
  const anySalary = salaryCountriesCount(p) > 0;

  // If any band came from the real engine, lead with that
  const engineBand = bands.find((b) => b.fromEngine);
  if (engineBand && anySalary && p.yearsPerCountry != null) {
    const engineCount = bands.filter((b) => b.fromEngine).length;
    if (engineCount === bands.length && bands.length > 1) {
      return `All ${bands.length} country pensions are now calculated by the real engine. Add documents to verify.`;
    }
    return `${engineBand.name} is now calculated by the real pension engine. Other bands are still anchor estimates.`;
  }

  // Base case: only residence
  if (p.age == null && countries.length === 1 && !anySalary) {
    return `Most ${residenceAnchor.name} residents fall in this range. Your details will narrow it.`;
  }

  // Age but nothing else interesting
  if (p.age != null && countries.length === 1 && !anySalary && p.yearsPerCountry == null) {
    const yearsToRetire = Math.max(0, (p.targetRetirementAge ?? DEFAULT_RETIREMENT_AGE) - p.age);
    return `At ${p.age} you have ${yearsToRetire} years of runway. Here's what that buys you.`;
  }

  // Multi-country — the EU coordination aha
  if (countries.length > 1 && Object.keys(p.yearsPerCountry ?? {}).length === 0) {
    return `EU rules let your ${countries.length} pensions coordinate. None needs to qualify alone.`;
  }

  // Per-country years known — call out short-tenure countries
  if (p.yearsPerCountry && Object.keys(p.yearsPerCountry).length > 0 && !anySalary) {
    const shortStints = countries.filter(
      (c) => c !== p.residenceCountry && (perCountryYears[c] ?? 0) > 0 && (perCountryYears[c] ?? 0) < 10,
    );
    if (shortStints.length > 0) {
      const c = shortStints[0];
      return `Your ${ANCHORS[c].name} years won't qualify for a full pension alone, but they count toward the EU minimum.`;
    }
    return 'Each country pays pro rata on its years. Adding salary will tighten the residence-country band.';
  }

  // Salary added — comment on the residence-country salary if we have it
  if (residenceCurrentSalary != null) {
    const ratio = residenceCurrentSalary / residenceAnchor.referenceSalary;
    if (ratio > 1.3) return 'Your salary is well above the local average — your contributions are pushing the upper band.';
    if (ratio < 0.7) return 'Your salary sits below the local average — bands narrow downward.';
    return 'Your salary is around the local reference — the residence-country band has tightened.';
  }

  // Salary given for a non-residence country only
  if (anySalary) {
    return 'Earlier-country salaries help the engine — add your current-country salary to tighten the residence band too.';
  }

  return `Most ${residenceAnchor.name} residents fall in this range. Your details will narrow it.`;
}

export function countryAnchor(c: CountryCode): CountryAnchor {
  return ANCHORS[c];
}

export const ALL_COUNTRIES: CountryCode[] = ['LU', 'FR', 'CH', 'DE', 'BE', 'IT', 'ES', 'PT', 'NL'];
