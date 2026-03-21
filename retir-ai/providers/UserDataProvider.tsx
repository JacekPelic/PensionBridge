'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Pillar1Estimate } from '@/lib/pension/types';
import type { Country } from '@/lib/types';

export interface UserData {
  firstName: string;
  lastName: string;
  initials: string;
  residenceCountry: Country;
  targetRetirementAge: number;
  monthlyIncomeGoal: number;
  pillar1Estimates: Pillar1Estimate[];
  pillar1Total: number;
  countriesWorked: Country[];
}

/** Hardcoded fallback matching the original mock data */
const FALLBACK: UserData = {
  firstName: 'Mats',
  lastName: 'Karlsson',
  initials: 'MK',
  residenceCountry: 'LU',
  targetRetirementAge: 64,
  monthlyIncomeGoal: 5500,
  pillar1Estimates: [
    { country: 'FR', monthlyPensionLocal: 1220, currency: 'EUR', monthlyPensionEur: 1220, isFullRate: false, warnings: [], breakdown: [] },
    { country: 'CH', monthlyPensionLocal: 337, currency: 'CHF', monthlyPensionEur: 320, isFullRate: false, warnings: [], breakdown: [] },
    { country: 'LU', monthlyPensionLocal: 980, currency: 'EUR', monthlyPensionEur: 980, isFullRate: false, warnings: [], breakdown: [] },
  ],
  pillar1Total: 2520,
  countriesWorked: ['FR', 'CH', 'LU'],
};

const STORAGE_KEY = 'retir-user-data';

interface UserDataContextType {
  userData: UserData;
  setUserData: (data: UserData) => void;
  isFromOnboarding: boolean;
}

const UserDataContext = createContext<UserDataContextType>({
  userData: FALLBACK,
  setUserData: () => {},
  isFromOnboarding: false,
});

function readStoredData(): { data: UserData; fromOnboarding: boolean } {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      return { data: JSON.parse(stored) as UserData, fromOnboarding: true };
    }
  } catch {
    // ignore parse errors
  }
  return { data: FALLBACK, fromOnboarding: false };
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [userData, setUserDataState] = useState<UserData>(FALLBACK);
  const [isFromOnboarding, setIsFromOnboarding] = useState(false);

  // Read localStorage once on mount, then mark hydrated
  useEffect(() => {
    const { data, fromOnboarding } = readStoredData();
    setUserDataState(data);
    setIsFromOnboarding(fromOnboarding);
    setHydrated(true);
  }, []);

  const setUserData = useCallback((data: UserData) => {
    setUserDataState(data);
    setIsFromOnboarding(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage errors
    }
  }, []);

  // Don't render children until we've read localStorage — prevents hydration flash
  if (!hydrated) return null;

  return (
    <UserDataContext.Provider value={{ userData, setUserData, isFromOnboarding }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
}
