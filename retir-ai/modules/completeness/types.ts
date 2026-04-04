import type { Country } from '@/shared/types';

export type StepCategory =
  | 'profile'
  | 'career'
  | 'documents'
  | 'insurance'
  | 'family'
  | 'planning';

export type StepTier = 'free' | 'pro' | 'family';

export interface CompletenessStep {
  id: string;
  /** Short imperative label shown in checklists */
  label: string;
  /** Why this step matters — framed as personal financial impact */
  why: string;
  /** How to complete it — specific institution, phone, document name */
  how: string;
  /** Effort estimate shown to reduce friction */
  effort: string;
  /** Weight towards the 100% score */
  weight: number;
  /** Grouping for display */
  category: StepCategory;
  /** Which countries this step applies to (null = all) */
  countries: Country[] | null;
  /** Link to the relevant page */
  href: string;
  /** CTA button text */
  cta: string;
  /** Minimum tier required */
  tier: StepTier;
  /** Icon for display */
  icon: string;
  /** Priority for ordering (lower = show first) */
  priority: number;
}

export interface CompletenessState {
  /** Overall score 0-100 */
  score: number;
  /** Steps the user has completed */
  completed: CompletenessStep[];
  /** Steps still to do, sorted by priority */
  pending: CompletenessStep[];
  /** The single highest-priority next step */
  nextStep: CompletenessStep | null;
  /** Total weight of all steps */
  totalWeight: number;
  /** Weight of completed steps */
  completedWeight: number;
}
