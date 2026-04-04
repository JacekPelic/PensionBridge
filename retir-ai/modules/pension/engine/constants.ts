// ─── France (CNAV) ──────────────────────────────────────────────────
/** Plafond de la Sécurité Sociale 2025 (annual) */
export const FR_PSS = 47100;
/** Maximum Pillar 1 rate */
export const FR_TAUX_PLEIN = 0.5;
/** Décote per missing trimestre */
export const FR_DECOTE_PER_TRIMESTRE = 0.00625;
/** Surcote per extra trimestre beyond full-rate conditions */
export const FR_SURCOTE_PER_TRIMESTRE = 0.0125;
/** Max trimestres subject to décote */
export const FR_MAX_DECOTE_TRIMESTRES = 20;
/** Age at which full rate is automatic regardless of trimestres */
export const FR_AGE_TAUX_PLEIN_AUTO = 67;
/** Trimestres per year */
export const FR_TRIMESTRES_PER_YEAR = 4;

/** Birth-year table: trimestres required + legal minimum retirement age */
export const FR_BIRTH_YEAR_TABLE: Record<number, { trimestres: number; legalAge: number }> = {
  1958: { trimestres: 167, legalAge: 62 },
  1959: { trimestres: 167, legalAge: 62 },
  1960: { trimestres: 167, legalAge: 62 },
  1961: { trimestres: 168, legalAge: 62 },
  1962: { trimestres: 169, legalAge: 62.5 },
  1963: { trimestres: 170, legalAge: 63 },
  1964: { trimestres: 171, legalAge: 63.5 },
  1965: { trimestres: 172, legalAge: 64 },
  1966: { trimestres: 172, legalAge: 64 },
  1967: { trimestres: 172, legalAge: 64 },
  1968: { trimestres: 172, legalAge: 64 },
  1969: { trimestres: 172, legalAge: 64 },
  1970: { trimestres: 172, legalAge: 64 },
  // Anyone born 1971+ uses same rules as 1970
};

/** Lookup trimestres required + legal age for a given birth year */
export function frGetBirthYearParams(birthYear: number): { trimestres: number; legalAge: number } {
  if (birthYear <= 1957) return { trimestres: 166, legalAge: 62 };
  if (birthYear >= 1965) return { trimestres: 172, legalAge: 64 };
  return FR_BIRTH_YEAR_TABLE[birthYear] ?? { trimestres: 172, legalAge: 64 };
}


// ─── Switzerland (AVS/AHV) ─────────────────────────────────────────
/** Full contribution duration (years) */
export const CH_FULL_CONTRIBUTION_YEARS = 44;
/** Minimum full pension (CHF/month) 2025 */
export const CH_MIN_PENSION = 1225;
/** Maximum full pension (CHF/month) 2025 */
export const CH_MAX_PENSION = 2450;
/** Maximum insured annual income (CHF) */
export const CH_MAX_INSURED_INCOME = 88200;
/** Minimum annual income for non-zero pension (CHF) */
export const CH_MIN_INCOME = 14700;
/** Reduction per year of early withdrawal */
export const CH_EARLY_REDUCTION_PER_YEAR = 0.068;
/** Max years of deferral */
export const CH_MAX_DEFERRAL_YEARS = 5;
/** Deferral bonus by years (approximate) */
export const CH_DEFERRAL_BONUS: Record<number, number> = {
  1: 0.052,
  2: 0.106,
  3: 0.164,
  4: 0.227,
  5: 0.315,
};

/** Standard retirement age by gender & birth year (AVS 21 transition) */
export function chGetRetirementAge(gender: 'M' | 'F', birthYear: number): number {
  if (gender === 'M') return 65;
  // Women: transitioning from 64 to 65
  if (birthYear <= 1963) return 64;
  if (birthYear === 1964) return 64.25;
  if (birthYear === 1965) return 64.5;
  if (birthYear === 1966) return 64.75;
  return 65; // 1967+
}

/** CHF to EUR approximate conversion rate */
export const CHF_TO_EUR = 0.95;


// ─── Luxembourg (CNAP) ─────────────────────────────────────────────
/** Full insurance duration (years) */
export const LU_FULL_INSURANCE_YEARS = 40;
/** Minimum eligibility (months) */
export const LU_MIN_ELIGIBILITY_MONTHS = 120;
/** Legal retirement age */
export const LU_LEGAL_RETIREMENT_AGE = 65;
/** Early retirement with 40 years of contributions */
export const LU_EARLY_RETIREMENT_40YRS = 57;
/** Early retirement general (with 480 months) */
export const LU_EARLY_RETIREMENT_GENERAL = 60;
/** Monthly base amount for flat-rate component (2025 approx.) */
export const LU_FLAT_RATE_BASE = 602;
/** Reference salary for proportional calculation (2025 approx.) */
export const LU_REFERENCE_SALARY = 30849;
/** Proportional rate per coefficient point */
export const LU_PROPORTIONAL_RATE = 0.01844;
/** Minimum pension with 40+ years (monthly, 2025 approx.) */
export const LU_MIN_PENSION_40YRS = 2125;
/** Pensionable salary cap = 5 x minimum social salary */
export const LU_SALARY_CAP = 12541 * 5; // ~€62,705/year
