import { Country } from '@/lib/types';

/** Inputs collected during onboarding for Pillar 1 calculation */
export interface EmploymentEntry {
  id: string;
  country: Country;
  startDate: string; // ISO date
  endDate: string | null; // null = ongoing
  startSalary: number; // gross annual salary at start of period
  endSalary: number; // gross annual salary at end (or current)
  currency: 'EUR' | 'CHF';
  employmentType: 'employed' | 'self-employed';
}

/** France-specific Pillar 1 parameters */
export interface FranceP1Params {
  trimestresValidated: number;
  trimestresRequired: number; // from birth-year table
  samBest25: number; // Salaire Annuel Moyen (best 25 years, capped at PSS)
  legalMinAge: number;
  retirementAge: number;
  decoteTrimestres: number; // missing trimestres causing penalty
  taux: number; // effective rate (max 50%, reduced by décote)
}

/** Switzerland-specific Pillar 1 parameters */
export interface SwitzerlandP1Params {
  contributionYears: number;
  avgAnnualIncome: number; // capped at max insured
  avsScaleNumber: number; // 1-44
  isMarried: boolean;
  gender: 'M' | 'F';
  retirementAge: number;
  standardRetirementAge: number;
  earlyWithdrawalReduction: number; // percentage
}

/** Luxembourg-specific Pillar 1 parameters */
export interface LuxembourgP1Params {
  insuranceYears: number; // LU-only years (pension is pro-rata on these)
  totalCoefficientSum: number; // sum of annual salary / reference salary
  flatRateAmount: number; // computed flat-rate part
  proportionalAmount: number; // computed proportional part
  retirementAge: number;
  meetsMinimumEligibility: boolean; // EU totalization: combined EU/EEA years >= 120 months
  totalEuInsuranceYears: number; // combined across all EU/EEA countries
}

/** Result of a single country's Pillar 1 calculation */
export interface Pillar1Estimate {
  country: Country;
  monthlyPensionLocal: number; // in local currency
  currency: 'EUR' | 'CHF';
  monthlyPensionEur: number;
  isFullRate: boolean;
  warnings: string[];
  breakdown: {
    label: string;
    value: string;
  }[];
}

/** Combined onboarding state */
export interface OnboardingState {
  // Step 1 - Profile
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  residenceCountry: Country;
  targetRetirementAge: number;
  isMarried: boolean;

  // Step 2 - Employment
  employmentEntries: EmploymentEntry[];

  // Step 3 - Country params (derived + user-editable)
  franceParams: FranceP1Params | null;
  switzerlandParams: SwitzerlandP1Params | null;
  luxembourgParams: LuxembourgP1Params | null;

  // Step 4 - Estimates
  estimates: Pillar1Estimate[];

  // Step 5 - Goal
  monthlyIncomeGoal: number;
}
