'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type VaultTier = 'free' | 'pro';

interface VaultTierContextType {
  tier: VaultTier;
  isPro: boolean;
  toggleTier: () => void;
}

const VaultTierContext = createContext<VaultTierContextType>({ tier: 'free', isPro: false, toggleTier: () => {} });

export function VaultTierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<VaultTier>('free');

  const toggleTier = useCallback(() => {
    setTier((prev) => (prev === 'free' ? 'pro' : 'free'));
  }, []);

  return (
    <VaultTierContext.Provider value={{ tier, isPro: tier === 'pro', toggleTier }}>
      {children}
    </VaultTierContext.Provider>
  );
}

export function useVaultTier() {
  return useContext(VaultTierContext);
}
