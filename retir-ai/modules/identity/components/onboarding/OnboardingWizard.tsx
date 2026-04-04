'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { StepProfile } from './steps/StepProfile';
import { StepEmployment } from './steps/StepEmployment';
import { StepEstimate } from './steps/StepEstimate';
import { StepGap } from './steps/StepGap';
import type { OnboardingState } from '@/modules/pension/types';
import { deriveAllParams, calculateAllEstimates, totalPillar1Eur, getCountriesFromEntries } from '@/modules/pension';
import { useUserData } from '@/modules/identity/UserDataProvider';

// ─── Step definition ────────────────────────────────────────────────
interface StepDef {
  id: string;
  label: string;
  group: 'profile' | 'employment' | 'estimate' | 'gap';
}

const STEPS: StepDef[] = [
  { id: 'profile', label: 'Profile', group: 'profile' },
  { id: 'employment', label: 'Employment', group: 'employment' },
  { id: 'estimate', label: 'Estimate', group: 'estimate' },
  { id: 'gap', label: 'Gap', group: 'gap' },
];

// ─── Default state ──────────────────────────────────────────────────
const defaultState: OnboardingState = {
  firstName: 'Mats',
  lastName: 'Karlsson',
  dateOfBirth: '1981-03-15',
  gender: 'M',
  residenceCountry: 'LU',
  targetRetirementAge: 64,
  isMarried: false,
  employmentEntries: [],
  franceParams: null,
  switzerlandParams: null,
  luxembourgParams: null,
  estimates: [],
  monthlyIncomeGoal: 5500,
};

// ─── Progress bar groups ────────────────────────────────────────────
const PROGRESS_GROUPS = [
  { key: 'profile', label: 'Profile' },
  { key: 'employment', label: 'Employment' },
  { key: 'estimate', label: 'Estimate' },
  { key: 'gap', label: 'Gap & Goals' },
] as const;

// ─── Component ──────────────────────────────────────────────────────
export function OnboardingWizard({ forceOpen = false }: { forceOpen?: boolean }) {
  const [visible, setVisible] = useState(forceOpen);
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [stepIndex, setStepIndex] = useState(0);
  const { setUserData } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (forceOpen || !localStorage.getItem('retir-onboarding-done')) {
      setVisible(true);
    }
  }, [forceOpen]);

  const currentStep = STEPS[stepIndex] ?? STEPS[0];
  const totalSteps = STEPS.length;

  // Derive country params when entering estimate step
  useEffect(() => {
    if (currentStep.group === 'estimate') {
      const derived = deriveAllParams(state);
      setState((prev) => ({
        ...prev,
        franceParams: prev.franceParams ?? derived.franceParams,
        switzerlandParams: prev.switzerlandParams ?? derived.switzerlandParams,
        luxembourgParams: prev.luxembourgParams ?? derived.luxembourgParams,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep.id]);

  if (!visible) return null;

  const finish = () => {
    // Compute final estimates and persist to shared user data
    const finalDerived = deriveAllParams(state);
    const finalState = { ...state, ...finalDerived };
    const estimates = calculateAllEstimates(finalState);
    const total = totalPillar1Eur(estimates);
    const countries = getCountriesFromEntries(state.employmentEntries);

    setUserData({
      firstName: state.firstName,
      lastName: state.lastName,
      initials: (state.firstName[0] || '') + (state.lastName[0] || ''),
      residenceCountry: state.residenceCountry,
      targetRetirementAge: state.targetRetirementAge,
      monthlyIncomeGoal: state.monthlyIncomeGoal,
      pillar1Estimates: estimates,
      pillar1Total: total,
      countriesWorked: countries,
    });

    localStorage.setItem('retir-onboarding-done', '1');
    if (forceOpen) {
      router.push('/');
    } else {
      setVisible(false);
    }
  };

  const updateState = (patch: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      // Reset derived params when employment changes so they get re-derived
      if (patch.employmentEntries) {
        next.franceParams = null;
        next.switzerlandParams = null;
        next.luxembourgParams = null;
      }
      return next;
    });
  };

  const canProceed = (): boolean => {
    if (currentStep.group === 'profile') {
      return !!state.firstName && !!state.dateOfBirth;
    }
    if (currentStep.group === 'employment') {
      return state.employmentEntries.length > 0
        && state.employmentEntries.every((e) => e.startSalary > 0 || e.endSalary > 0);
    }
    return true;
  };

  const goNext = () => {
    if (stepIndex < totalSteps - 1) setStepIndex(stepIndex + 1);
  };
  const goBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  // Step label for footer
  const stepLabels: Record<string, string> = {
    profile: 'Personal information',
    employment: 'Employment history',
    estimate: 'Your State pension estimate',
    gap: 'Income gap analysis',
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col overflow-y-auto" style={{ background: 'var(--navy)' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-10 py-5 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base"
            style={{ background: 'var(--gold)', fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}
          >
            R
          </div>
          <span className="text-base font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
            RetirAI
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full ml-2" style={{ background: 'var(--gold-dim)', color: 'var(--gold-light)' }}>
            State Pension Calculator
          </span>
        </div>
        <span
          className="text-[13px] cursor-pointer transition-colors"
          style={{ color: 'var(--text-dim)' }}
          onClick={finish}
        >
          Skip {'\u2192'}
        </span>
      </div>

      {/* Progress bar — grouped */}
      <div className="px-10 py-4 shrink-0" style={{ background: 'var(--navy-2)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-0 max-w-[820px] mx-auto">
          {PROGRESS_GROUPS.map((group, i) => {
            const isActive = currentStep.group === group.key;
            const groupIdx = STEPS.findIndex((s) => s.group === group.key);
            const isDone = groupIdx < stepIndex && !isActive;
            const num = i + 1;

            return (
              <div
                key={group.key}
                className="flex items-center gap-2 flex-1 text-xs font-medium relative"
                style={{ color: isActive ? 'var(--gold-light)' : isDone ? 'var(--text-muted)' : 'var(--text-dim)' }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 z-[1]"
                  style={{
                    background: isActive ? 'var(--gold)' : isDone ? 'var(--green)' : 'var(--navy-3)',
                    border: isActive ? '1px solid var(--gold)' : isDone ? '1px solid var(--green)' : '1px solid var(--border)',
                    color: isActive || isDone ? 'var(--navy)' : 'var(--text-dim)',
                  }}
                >
                  {isDone ? '\u2713' : num}
                </div>
                <span className="whitespace-nowrap hidden md:block">
                  {group.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-5 py-10">
        <div className="w-full max-w-[820px] animate-fade-in" key={currentStep.id}>
          {currentStep.group === 'profile' && (
            <StepProfile state={state} onChange={updateState} />
          )}
          {currentStep.group === 'employment' && (
            <StepEmployment state={state} onChange={updateState} />
          )}
          {currentStep.group === 'estimate' && (
            <StepEstimate state={state} />
          )}
          {currentStep.group === 'gap' && (
            <StepGap state={state} onChange={updateState} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="sticky bottom-0 px-10 py-4 flex items-center justify-between shrink-0"
        style={{ background: 'var(--navy-2)', borderTop: '1px solid var(--border)' }}
      >
        <span className="text-[13px]" style={{ color: 'var(--text-dim)' }}>
          Step {stepIndex + 1} of {totalSteps} {'\u00B7'} {stepLabels[currentStep.group]}
        </span>
        <div className="flex gap-2.5 items-center">
          {stepIndex > 0 && (
            <Button variant="ghost" onClick={goBack}>
              {'\u2190'} Back
            </Button>
          )}
          {currentStep.group === 'gap' ? (
            <Button variant="primary" onClick={finish} style={{ minWidth: 140, justifyContent: 'center' }}>
              Enter Dashboard {'\u2192'}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={goNext}
              disabled={!canProceed()}
              style={{ minWidth: 140, justifyContent: 'center' }}
            >
              {currentStep.group === 'estimate' ? 'See Income Gap \u2192' : 'Continue \u2192'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
