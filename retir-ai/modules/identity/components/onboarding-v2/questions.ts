import type { PartialPicture } from './estimate';
import { ALL_COUNTRIES, countryAnchor } from './estimate';

export type InputType =
  | 'country-select'
  | 'age-input'
  | 'multi-country'
  | 'years-per-country'
  | 'salary-per-country';

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
      'Your country of tax residence \u2014 the country where you currently pay income tax, not just where you were born. It sets which pension system you\u2019re contributing to today, and whose retirement rules apply to you first.',
    inputType: 'country-select',
    when: () => true,
    isAnswered: (p) => p.residenceCountry != null,
  },
  {
    id: 'age',
    prompt: 'How old are you?',
    rationale:
      'Your age tells us how many working years you still have before retirement \u2014 which directly shapes how much your future contributions can still add to the picture. No exact day needed.',
    inputType: 'age-input',
    when: () => true,
    isAnswered: (p) => p.age != null,
  },
  {
    id: 'countriesWorked',
    prompt: 'Which other countries have you worked in?',
    rationale:
      'Most people with international careers build up small pension entitlements in several countries. EU rules coordinate them so each one counts toward your retirement \u2014 even short stints. We\u2019ll only ask details for the ones you tick.',
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
      'Each country pays a share of your pension proportional to how long you worked there. A rough range is fine \u2014 you can refine later once you have the exact figures from your career extract.',
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
      'Pensions are calculated on the salary you contributed on, so a "start \u2192 current/end" range gives us a realistic career curve. Ballpark numbers are fine; skip anything you can\u2019t remember and we\u2019ll use local averages.',
    inputType: 'salary-per-country',
    when: (p) => p.yearsPerCountry != null,
    isAnswered: (p) => p.askStatus?.['salary-per-country'] === 'fulfilled',
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
