import type { PartialPicture } from './estimate';
import { ALL_COUNTRIES, countryAnchor } from './estimate';

export type InputType =
  | 'country-select'
  | 'age-input'
  | 'multi-country'
  | 'years-per-country'
  | 'salary-per-country'
  | 'target-retirement-age'
  | 'monthly-income-goal';

export interface Question {
  id: string;
  prompt: string;
  rationale: string; // shown under "Why we ask"
  inputType: InputType;
  /** Question only shown when this returns true. */
  when: (p: PartialPicture) => boolean;
  /** Whether this question can be answered from the current partial picture. */
  isAnswered: (p: PartialPicture) => boolean;
}

export const QUESTIONS: Question[] = [
  {
    id: 'residence',
    prompt: 'Where do you live now?',
    rationale:
      'Tax residence \u2014 where you pay income tax today, not where you were born. Sets which pension system you contribute to and whose retirement rules apply first.',
    inputType: 'country-select',
    when: () => true,
    isAnswered: (p) => p.residenceCountry != null,
  },
  {
    id: 'age',
    prompt: 'How old are you?',
    rationale:
      'Sets how many working years remain \u2014 and how much your future contributions can still add. No exact day needed.',
    inputType: 'age-input',
    when: () => true,
    isAnswered: (p) => p.age != null,
  },
  {
    id: 'countriesWorked',
    prompt: 'Which other countries have you worked in?',
    rationale:
      'International careers leave entitlements scattered. EU coordination rules make each one count, even short stints. We only ask details for the ones you tick.',
    inputType: 'multi-country',
    when: (p) => p.residenceCountry != null && p.age != null,
    // Answered only once the user explicitly confirms (Continue) — otherwise
    // picking the first country would auto-advance before they can add more.
    isAnswered: (p) => p.askStatus?.['countries-worked'] === 'fulfilled',
  },
  {
    id: 'yearsPerCountry',
    prompt: 'Roughly how long in each country?',
    rationale:
      'Each country pays a share proportional to your time there. A rough range is fine \u2014 refine later from your career extract.',
    inputType: 'years-per-country',
    when: (p) => p.countriesWorked != null,
    isAnswered: (p) => {
      if (p.yearsPerCountry == null) return false;
      const needed = countriesForYears(p);
      return needed.every((c) => p.yearsPerCountry?.[c] != null);
    },
  },
  {
    id: 'salaryPerCountry',
    prompt: 'Roughly what did you earn in each country?',
    rationale:
      'Pensions are calculated on the salary you contributed on. A start-to-current range captures the career curve. Skip what you can\u2019t remember \u2014 we\u2019ll use local averages.',
    inputType: 'salary-per-country',
    when: (p) => p.yearsPerCountry != null,
    isAnswered: (p) => p.askStatus?.['salary-per-country'] === 'fulfilled',
  },
  {
    id: 'targetRetirementAge',
    prompt: 'When do you plan to retire?',
    rationale:
      'Sets the runway we project against. Earlier means lower state-pension figures (FR d\u00e9cote, CH BVG penalty); later usually adds. Pick the number you\u2019d defend in a planning meeting \u2014 change it any time.',
    inputType: 'target-retirement-age',
    when: (p) => p.askStatus?.['salary-per-country'] != null,
    isAnswered: (p) => p.targetRetirementAge != null,
  },
  {
    id: 'monthlyIncomeGoal',
    prompt: 'What monthly income would feel comfortable in retirement?',
    rationale:
      'The anchor for everything else \u2014 gap, recommendations, residency comparisons. Net of tax, in today\u2019s euros. Rule of thumb: 70\u201380% of your current take-home, but the right number is yours.',
    inputType: 'monthly-income-goal',
    when: (p) => p.targetRetirementAge != null,
    isAnswered: (p) => p.monthlyIncomeGoal != null,
  },
];

/** Countries that need a years-per-country answer (residence + all worked). */
export function countriesForYears(p: PartialPicture) {
  const worked = p.countriesWorked ?? [];
  if (p.residenceCountry && !worked.includes(p.residenceCountry)) {
    return [p.residenceCountry, ...worked];
  }
  return worked;
}

/** Find the next unanswered question whose `when` gate passes. */
export function nextQuestion(p: PartialPicture): Question | null {
  for (const q of QUESTIONS) {
    if (q.when(p) && !q.isAnswered(p)) return q;
  }
  return null;
}

/** Country options for the residence dropdown. */
export const RESIDENCE_OPTIONS = ALL_COUNTRIES.map((c) => ({
  code: c,
  flag: countryAnchor(c).flag,
  name: countryAnchor(c).name,
}));
