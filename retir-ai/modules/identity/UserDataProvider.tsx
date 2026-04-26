'use client';

import { type ReactNode, useMemo } from 'react';
import type { Country } from '@/shared/types';
import type { Pillar1Estimate } from '@/modules/pension/types';
import { usePicture } from './PictureProvider';
import { estimate } from './components/onboarding-v2/estimate';
import type { CountryCode } from './picture-types';

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

/** Mats Karlsson fallback — used whenever the picture isn't compatible with
 * the strict Country type, or to keep older pages working. */
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

const STRICT_COUNTRIES: CountryCode[] = ['FR', 'CH', 'LU'];

/**
 * Compatibility wrapper. The provider is now a pass-through — actual state
 * lives in `PictureProvider` (mounted at the root). This component remains
 * so that older pages can `<UserDataProvider>...</UserDataProvider>` without
 * needing edits; it has no effect.
 */
export function UserDataProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

interface UserDataContextType {
  userData: UserData;
  setUserData: (data: UserData) => void;
  isFromOnboarding: boolean;
}

/**
 * Reads UserData by deriving it from the current picture.
 * If the picture is in mock mode or has fields incompatible with the legacy
 * strict Country type, returns the FALLBACK Mats Karlsson data.
 */
export function useUserData(): UserDataContextType {
  const { picture, mode } = usePicture();

  return useMemo<UserDataContextType>(() => {
    if (mode === 'mock') {
      return { userData: FALLBACK, setUserData: () => {}, isFromOnboarding: false };
    }

    const residence = picture.residenceCountry;
    if (!residence || !STRICT_COUNTRIES.includes(residence)) {
      // Picture exists but residence isn't FR/CH/LU — legacy pages can't
      // render properly. Fall back to mock so navigation stays usable.
      return { userData: FALLBACK, setUserData: () => {}, isFromOnboarding: false };
    }

    const est = estimate(picture);
    const pillar1Estimates: Pillar1Estimate[] = est.bands
      .filter((b): b is typeof b & { country: 'FR' | 'CH' | 'LU' } =>
        STRICT_COUNTRIES.includes(b.country),
      )
      .map((b) => {
        const mid = Math.round((b.low + b.high) / 2);
        return {
          country: b.country,
          monthlyPensionLocal: mid,
          currency: b.country === 'CH' ? 'CHF' : 'EUR',
          monthlyPensionEur: mid,
          isFullRate: false,
          warnings: [],
          breakdown: [],
        };
      });

    const firstName = picture.firstName ?? '';
    const lastName = picture.lastName ?? '';
    const initials = `${(firstName[0] ?? '').toUpperCase()}${(lastName[0] ?? '').toUpperCase()}` || 'YOU';

    const userData: UserData = {
      firstName: firstName || 'You',
      lastName: lastName || '',
      initials,
      residenceCountry: residence as Country,
      targetRetirementAge: picture.targetRetirementAge ?? 65,
      monthlyIncomeGoal: picture.monthlyIncomeGoal ?? 5000,
      pillar1Estimates,
      pillar1Total: pillar1Estimates.reduce((s, e) => s + e.monthlyPensionEur, 0),
      countriesWorked: (picture.countriesWorked ?? []).filter(
        (c): c is Country => STRICT_COUNTRIES.includes(c),
      ),
    };

    return { userData, setUserData: () => {}, isFromOnboarding: true };
  }, [picture, mode]);
}
