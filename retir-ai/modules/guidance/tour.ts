import type { PartialPicture, CountryCode } from '@/modules/identity/picture-types';
import type { DataAsk } from './types';
import {
  ASK_CH_AHV,
  ASK_CH_BVG,
  ASK_CH_FREIZUGIGKEIT,
  ASK_CH_3A,
  ASK_FR_RELEVE,
  ASK_FR_AGIRC_ARRCO,
  ASK_FR_PER,
  ASK_LU_EXTRAIT,
  ASK_LU_RCP,
  ASK_LU_PREVOYANCE,
  ASK_PRIVATE_SAVINGS,
} from './asks-data';

export type TourPhase = 'p1' | 'p2' | 'p3';

export interface PhaseIntro {
  kind: 'intro';
  phase: TourPhase;
  title: string;
  body: string;
}

export interface TourAskStep {
  kind: 'ask';
  phase: TourPhase;
  ask: DataAsk;
}

export interface TourSummary {
  kind: 'summary';
}

export type TourStep = PhaseIntro | TourAskStep | TourSummary;

const PHASE_INTROS: Record<TourPhase, Omit<PhaseIntro, 'kind' | 'phase'>> = {
  p1: {
    title: 'State pensions \u2014 what each country owes you',
    body:
      'State pensions are what you\u2019ll receive from each country\u2019s social security system when you retire \u2014 CNAV in France, AHV/AVS in Switzerland, CNAP in Luxembourg. Because you\u2019ve worked in several, you\u2019ll get a partial pension from each. Let\u2019s replace our estimates with the real figures.',
  },
  p2: {
    title: 'Workplace pensions \u2014 set up by your employers',
    body:
      'Workplace pensions are what your employers set aside on top of the state system \u2014 Swiss BVG, French Agirc-Arrco, Luxembourg employer plans. These often add up to more than the state pension, and they\u2019re the piece people most commonly lose track of after leaving a country. Let\u2019s find each one.',
  },
  p3: {
    title: 'Personal savings \u2014 what you\u2019ve set aside yourself',
    body:
      'Your own retirement savings, separate from anything your employer contributes \u2014 French PER, Swiss 3a, Luxembourg Art. 111bis, or any brokerage / life-insurance wrapper. A rough total is enough for now; you can break it down per product later.',
  },
};

/**
 * Country-by-country ask map. Ordered so steps appear consistently.
 */
const P1_ASK_BY_COUNTRY: Partial<Record<CountryCode, DataAsk>> = {
  LU: ASK_LU_EXTRAIT,
  FR: ASK_FR_RELEVE,
  CH: ASK_CH_AHV,
};

const P2_ASK_BY_COUNTRY: Partial<Record<CountryCode, DataAsk>> = {
  CH: ASK_CH_BVG,
  FR: ASK_FR_AGIRC_ARRCO,
  LU: ASK_LU_RCP,
};

/**
 * Additional P2 asks that surface alongside the main one. Today this is just
 * the Swiss vested-benefits trace — typical case for expats who left CH.
 */
const P2_EXTRA_ASKS_BY_COUNTRY: Partial<Record<CountryCode, DataAsk[]>> = {
  CH: [ASK_CH_FREIZUGIGKEIT],
};

const P3_ASK_BY_COUNTRY: Partial<Record<CountryCode, DataAsk>> = {
  FR: ASK_FR_PER,
  CH: ASK_CH_3A,
  LU: ASK_LU_PREVOYANCE,
};

/** Display order for country phases: residence first, then others. */
function orderedCountries(p: PartialPicture): CountryCode[] {
  const worked = new Set<CountryCode>([
    ...(p.countriesWorked ?? []),
    ...(p.residenceCountry ? [p.residenceCountry] : []),
  ]);
  const ordered: CountryCode[] = [];
  if (p.residenceCountry && worked.has(p.residenceCountry)) {
    ordered.push(p.residenceCountry);
  }
  for (const c of worked) {
    if (c !== p.residenceCountry) ordered.push(c);
  }
  return ordered;
}

/**
 * Build the ordered list of tour steps for the given picture.
 * Phases are included only if they have at least one actionable ask (except P3,
 * which is always included since it's country-agnostic).
 */
export function deriveTour(p: PartialPicture): TourStep[] {
  const countries = orderedCountries(p);

  const steps: TourStep[] = [];

  const p1Asks: TourAskStep[] = [];
  for (const c of countries) {
    const ask = P1_ASK_BY_COUNTRY[c];
    if (ask) p1Asks.push({ kind: 'ask', phase: 'p1', ask });
  }
  if (p1Asks.length > 0) {
    steps.push({ kind: 'intro', phase: 'p1', ...PHASE_INTROS.p1 });
    steps.push(...p1Asks);
  }

  const p2Asks: TourAskStep[] = [];
  for (const c of countries) {
    const ask = P2_ASK_BY_COUNTRY[c];
    if (ask) p2Asks.push({ kind: 'ask', phase: 'p2', ask });
    const extras = P2_EXTRA_ASKS_BY_COUNTRY[c] ?? [];
    for (const extra of extras) {
      p2Asks.push({ kind: 'ask', phase: 'p2', ask: extra });
    }
  }
  if (p2Asks.length > 0) {
    steps.push({ kind: 'intro', phase: 'p2', ...PHASE_INTROS.p2 });
    steps.push(...p2Asks);
  }

  // P3 — country-specific products first (tax-advantaged vehicles are highly
  // jurisdiction-dependent), then a catch-all private-savings step.
  const p3Asks: TourAskStep[] = [];
  for (const c of countries) {
    const ask = P3_ASK_BY_COUNTRY[c];
    if (ask) p3Asks.push({ kind: 'ask', phase: 'p3', ask });
  }
  steps.push({ kind: 'intro', phase: 'p3', ...PHASE_INTROS.p3 });
  steps.push(...p3Asks);
  steps.push({ kind: 'ask', phase: 'p3', ask: ASK_PRIVATE_SAVINGS });

  steps.push({ kind: 'summary' });

  return steps;
}

/** Number of ask steps in the phase up to (and including) the current step. */
export function phaseProgress(
  steps: TourStep[],
  currentIndex: number,
): { phase: TourPhase | null; stepInPhase: number; stepsInPhase: number } | null {
  const step = steps[currentIndex];
  if (!step || step.kind === 'summary') return null;
  const phase = step.phase;
  const phaseSteps = steps.filter((s) => s.kind !== 'summary' && s.phase === phase);
  const asksBeforeAndAt = phaseSteps.slice(
    0,
    phaseSteps.indexOf(step) + 1,
  ).filter((s) => s.kind === 'ask').length;
  const askCount = phaseSteps.filter((s) => s.kind === 'ask').length;
  return {
    phase,
    stepInPhase: step.kind === 'ask' ? asksBeforeAndAt : 0,
    stepsInPhase: askCount,
  };
}

export { PHASE_INTROS };
