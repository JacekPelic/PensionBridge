'use client';

import { useMemo } from 'react';
import { useUserData } from '@/modules/identity/UserDataProvider';
import { useDataStage } from '@/modules/identity/DataStageProvider';
import { useTier } from '@/shared/TierProvider';
import { STEPS } from './steps';
import type { CompletenessStep, CompletenessState } from './types';

/**
 * Evaluates which completeness steps are done based on the current user/app state.
 *
 * In a real app this would check actual database state. For the demo, we derive
 * completion from what's available in context: UserData, DataStage, and localStorage.
 */
function getCompletedIds(
  userData: ReturnType<typeof useUserData>['userData'],
  isFromOnboarding: boolean,
  stage: 'before' | 'after',
): Set<string> {
  const done = new Set<string>();

  // Profile: completed if we have user data (either from onboarding or fallback)
  if (userData.firstName && userData.lastName) {
    done.add('profile-created');
  }

  // Income goal: completed if set above 0
  if (userData.monthlyIncomeGoal > 0) {
    done.add('retirement-goal-set');
  }

  // Employment history: completed if we have countries worked
  if (userData.countriesWorked.length > 0) {
    done.add('employment-history');
  }

  // Salary data: completed if we came through onboarding (where salary is entered)
  if (isFromOnboarding) {
    done.add('salary-data');
  }

  // Documents: in "after" stage, pension documents are verified
  if (stage === 'after') {
    if (userData.countriesWorked.includes('FR')) done.add('doc-fr-career');
    if (userData.countriesWorked.includes('CH')) {
      done.add('doc-ch-ahv');
      done.add('doc-ch-p2');
    }
    if (userData.countriesWorked.includes('LU')) done.add('doc-lu-career');
  }

  // Check localStorage for manually completed steps (user clicks "Mark done")
  try {
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem('retir-completeness')
      : null;
    if (stored) {
      const manual = JSON.parse(stored) as string[];
      manual.forEach((id) => done.add(id));
    }
  } catch {
    // ignore
  }

  return done;
}

/**
 * Filters steps to only those relevant to the user's countries.
 */
function filterByCountry(
  steps: CompletenessStep[],
  countriesWorked: string[],
): CompletenessStep[] {
  return steps.filter((step) => {
    if (!step.countries) return true;
    return step.countries.some((c) => countriesWorked.includes(c));
  });
}

export function useCompleteness(): CompletenessState {
  const { userData, isFromOnboarding } = useUserData();
  const { stage } = useDataStage();
  const { isPro } = useTier();

  return useMemo(() => {
    const countryFiltered = filterByCountry(STEPS, userData.countriesWorked);

    // Filter by tier: free users only see free steps
    const relevantSteps = isPro
      ? countryFiltered
      : countryFiltered.filter((s) => s.tier === 'free');

    const completedIds = getCompletedIds(userData, isFromOnboarding, stage);

    const completed: CompletenessStep[] = [];
    const pending: CompletenessStep[] = [];

    for (const step of relevantSteps) {
      if (completedIds.has(step.id)) {
        completed.push(step);
      } else {
        pending.push(step);
      }
    }

    // Sort pending by priority (lowest first = most impactful)
    pending.sort((a, b) => a.priority - b.priority);

    const totalWeight = relevantSteps.reduce((sum, s) => sum + s.weight, 0);
    const completedWeight = completed.reduce((sum, s) => sum + s.weight, 0);
    const score = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

    return {
      score,
      completed,
      pending,
      nextStep: pending[0] ?? null,
      totalWeight,
      completedWeight,
    };
  }, [userData, isFromOnboarding, stage, isPro]);
}
