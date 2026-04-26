import type { PartialPicture } from './picture-types';

/**
 * Mats Karlsson — the demo persona. Used as the default picture so screenshots,
 * pitches, and partner walkthroughs land on a fully-populated state.
 *
 * Mirrors the persona that older modules (KpiCards, RetirementGap, etc.) hard-code.
 * P2 plans and P3 savings are pre-populated so the demo shows a full 3-pillar picture.
 */
export const MOCK_PICTURE: PartialPicture = {
  firstName: 'Mats',
  lastName: 'Karlsson',
  residenceCountry: 'LU',
  age: 45,
  targetRetirementAge: 64,
  monthlyIncomeGoal: 5500,
  maritalStatus: 'married',
  countriesWorked: ['FR', 'CH'],
  yearsPerCountry: {
    LU: 6,
    FR: 10,
    CH: 5,
  },
  // Career arc: started in France out of school, moved to Switzerland mid-career,
  // now settled in Luxembourg. Salaries in local currency (CHF for CH).
  salaryPerCountry: {
    FR: { start: 38000, end: 62000 },   // 10y employed in France (EUR)
    CH: { start: 95000, end: 125000 },  // 5y in Switzerland (CHF)
    LU: { start: 85000, end: 95000 },   // 6y in Luxembourg, current (EUR)
  },
  employmentEntries: [],
  pillar2Plans: [
    {
      askId: 'ch-bvg',
      country: 'CH',
      label: 'Swiss BVG (Vorsorgeausweis)',
      monthlyEur: 860,
      rawValues: {
        vestedBenefits: 210000,
        projectedAnnuity: 12480,
        conversionRate: 6.0,
        insuredSalary: 85000,
      },
    },
    {
      askId: 'fr-agirc-arrco',
      country: 'FR',
      label: 'French Agirc-Arrco',
      monthlyEur: 420,
      rawValues: {
        points: 4820,
        projectedAnnual: 5040,
      },
    },
  ],
  pillar3Savings: {
    currentBalance: 85000,
    monthlyContribution: 600,
    growthAssumption: 4,
  },
  tour: {
    active: false,
    currentStepIndex: 0,
    everCompleted: true,
  },
  askStatus: {
    'countries-worked': 'fulfilled',
    'ch-bvg': 'fulfilled',
    'fr-agirc-arrco': 'fulfilled',
    'private-savings': 'fulfilled',
  },
};
