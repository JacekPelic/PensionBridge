'use client';

import { ReactNode } from 'react';
import { useTier } from '@/shared/TierProvider';

export type VaultTier = 'free' | 'pro';

export function VaultTierProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useVaultTier() {
  return useTier();
}
