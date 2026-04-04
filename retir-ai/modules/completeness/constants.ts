import type { StepCategory } from './types';

export const CATEGORY_META: Record<StepCategory, { label: string; icon: string; color: string }> = {
  profile:   { label: 'Profile',           icon: '👤', color: 'var(--blue)' },
  career:    { label: 'Career',            icon: '💼', color: 'var(--amber)' },
  documents: { label: 'Pension Documents', icon: '📋', color: 'var(--green)' },
  insurance: { label: 'Insurance & Personal Savings', icon: '🛡️', color: 'var(--blue)' },
  family:    { label: 'Family Access',     icon: '👨‍👩‍👧', color: '#ec4899' },
  planning:  { label: 'Planning',          icon: '📈', color: 'var(--gold)' },
};
