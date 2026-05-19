import type { PartialPicture } from './picture-types';

// Mats Karlsson — the seed picture used for screen recordings and walkthroughs.
// State reflects "just finished the opening onboarding": opening questions
// answered, but the deep pillar tour hasn't been run, so P2 (workplace plans)
// and P3 (personal savings) are still empty. Running the on-screen tour fills
// them in live.
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
  salaryPerCountry: {
    FR: { start: 38000, end: 62000 },
    CH: { start: 95000, end: 125000 },
    LU: { start: 85000, end: 95000 },
  },
  employmentEntries: [],
  tour: {
    active: false,
    currentStepIndex: 0,
    everCompleted: false,
  },
  askStatus: {
    'countries-worked': 'fulfilled',
    'salary-per-country': 'fulfilled',
  },
  onboardingDismissed: true,
};
