import type { CountryCode } from '@/modules/identity/picture-types';

export type Pillar = 'p1' | 'p2' | 'p3';
export type AskPriority = 'high' | 'medium' | 'low';
export type Difficulty = 'easy' | 'moderate' | 'hard';

/**
 * Partner product the user can open if they don't yet have the asset
 * the ask is asking about. Carries the same shape as the dashboard
 * ProductOffers so a future merge is trivial.
 */
export interface AskProductOffer {
  provider: string;
  providerInitial: string;
  /** Flat brand color for the provider tile. */
  providerColor: string;
  productName: string;
  /** One-line product description, plain. */
  description: string;
  /** Projected monthly impact at retirement, in EUR. */
  gapImpact: number;
  /** Monthly contribution required to reach gapImpact, in EUR. */
  monthlyContribution: number;
  /** Years to retirement assumed for the projection. */
  horizon: number;
  /** Tax / regulatory note shown below the product. Single short line. */
  taxNote?: string;
}

export interface AskGuideStep {
  num: number;
  text: string;
  detail?: string;
}

export interface AskGuideAltPath {
  title: string;
  options: string[];
}

export interface AskGuide {
  title: string;
  timeEstimate: string;
  difficulty: Difficulty;
  language: string;
  steps: AskGuideStep[];
  altPath?: AskGuideAltPath;
  tips: string[];
}

export interface AskManualField {
  id: string;
  label: string;
  hint: string;
  type: 'number' | 'text' | 'date';
  placeholder: string;
  unit?: string;
}

export interface AskManualForm {
  title: string;
  description: string;
  fields: AskManualField[];
}

export interface DataAsk {
  id: string;
  title: string;
  /** One-line teaching sentence — the value prop of showing this ask now. */
  whyNow: string;
  pillar: Pillar;
  country?: CountryCode;
  priority: AskPriority;
  /** Human-readable impact if fulfilled, e.g. "±\u20AC450 on your Swiss band". */
  impact: string;
  icon: string;
  /** True if this ask can be fulfilled by uploading a document. */
  uploadable: boolean;
  /** Document filename hint displayed to the user. */
  uploadHint?: string;
  guide?: AskGuide;
  manualForm: AskManualForm;
  /**
   * Set when the ask maps to a personal product the user could open if they
   * don't yet have the asset. Surfaces as an "Open one" tab on the AskCard.
   * Omit on asks that don't have a clean product equivalent (e.g. state
   * pension extracts, workplace pensions, vested-benefits recovery).
   */
  productOffer?: AskProductOffer;
}
