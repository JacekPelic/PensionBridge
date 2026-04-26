import type { EmploymentEntry } from '@/modules/pension/types';

export type CountryCode =
  | 'LU' | 'FR' | 'CH' | 'DE' | 'BE' | 'IT' | 'ES' | 'PT' | 'NL';

/** Per-ask state as the user moves through the tour or à-la-carte. */
export type AskStatus = 'fulfilled' | 'skipped';

/** A workplace pension plan captured from a P2 ask. */
export interface Pillar2Plan {
  /** The ask id that produced this plan (e.g. 'ch-bvg'). */
  askId: string;
  country: CountryCode;
  label: string;                 // e.g. "Swiss BVG / Vorsorgeausweis"
  /** Approximate monthly pension in EUR, derived from whatever the user gave us. */
  monthlyEur: number;
  /** Raw values the user entered — kept so we can refine later without losing them. */
  rawValues?: Record<string, string | number>;
}

/** Personal savings and investments (pillar 3) — aggregate for now, per-product later. */
export interface Pillar3Savings {
  currentBalance: number;        // EUR
  monthlyContribution: number;   // EUR / month
  growthAssumption: number;      // % annual, e.g. 4
}

/**
 * Rough salary bookends for a country the user worked in.
 * Stored in the local currency (CHF for Switzerland, EUR elsewhere).
 * For the residence country (ongoing), `end` is the user's current salary.
 */
export interface CountrySalary {
  start: number;  // when they started working there
  end: number;    // when they left — or current if still there
}

/** State of the guided pillar tour. */
export interface TourState {
  /** Whether the user is currently in tour mode. */
  active: boolean;
  /** Index into the derived step list. */
  currentStepIndex: number;
  /** True once the user has completed the tour at least once. */
  everCompleted: boolean;
}

/**
 * Marital status drives tax class (e.g. LU Class 1 vs Class 2) and
 * survivor-pension eligibility framing. We capture the status as a field
 * rather than a certificate — actual certificates go to pension institutions
 * at claim time, not to Prevista.
 */
export type MaritalStatus = 'single' | 'married' | 'partnered' | 'divorced' | 'widowed';

/**
 * The user's pension picture, with every field optional.
 * Drives both the live picture display and downstream pages.
 */
export interface PartialPicture {
  // Identity
  firstName?: string;
  lastName?: string;

  // Profile
  residenceCountry?: CountryCode;
  age?: number;
  targetRetirementAge?: number;
  monthlyIncomeGoal?: number;
  maritalStatus?: MaritalStatus;

  // Career — three layers of detail (each layer fills in below)
  countriesWorked?: CountryCode[];
  yearsPerCountry?: Partial<Record<CountryCode, number>>;
  /** Start & end salary per country, in local currency. */
  salaryPerCountry?: Partial<Record<CountryCode, CountrySalary>>;
  employmentEntries?: EmploymentEntry[];

  // Pillar 2 — workplace pensions, one entry per plan the user has told us about
  pillar2Plans?: Pillar2Plan[];

  // Pillar 3 — aggregate private savings (per-product detail lives on a future page)
  pillar3Savings?: Pillar3Savings;

  // Tour + per-ask tracking
  tour?: TourState;
  askStatus?: Partial<Record<string, AskStatus>>;
}

/** True if the opening sequence (residence + age + countriesWorked) is complete. */
export function isOpeningComplete(p: PartialPicture): boolean {
  return p.residenceCountry != null && p.age != null && p.countriesWorked != null;
}
