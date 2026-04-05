'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { PlatformTier } from '@/shared/types';

interface TierContextType {
  tier: PlatformTier;
  isPro: boolean;
  toggleTier: () => void;
}

const TierContext = createContext<TierContextType>({ tier: 'free', isPro: false, toggleTier: () => {} });

export function TierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<PlatformTier>('free');

  const toggleTier = useCallback(() => {
    setTier((prev) => (prev === 'free' ? 'pro' : 'free'));
  }, []);

  return (
    <TierContext.Provider value={{ tier, isPro: tier === 'pro', toggleTier }}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  return useContext(TierContext);
}
