import type { CountryCode } from '@/modules/identity/picture-types';

export type Pillar = 'p1' | 'p2' | 'p3';
export type AskPriority = 'high' | 'medium' | 'low';
export type Difficulty = 'easy' | 'moderate' | 'hard';

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
}
