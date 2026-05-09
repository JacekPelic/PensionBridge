'use client';

import { ReactNode } from 'react';
import { usePicture } from './PictureProvider';
import { hasClearedOnboarding } from './picture-types';
import { OnboardingScreen } from './components/onboarding-v2/OnboardingScreen';

/**
 * Layout-level gate that intercepts unonboarded users with the standalone
 * <OnboardingScreen /> before letting them reach the application chrome
 * (sidebar, dashboard, etc.).
 *
 * A user is considered "cleared" once both:
 *   - the opening (residence + age + countriesWorked) is complete, AND
 *   - they've explicitly dismissed the completion screen.
 *
 * Mock-mode pictures pre-set both flags so the gate is invisible during demos.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const { picture } = usePicture();

  if (!hasClearedOnboarding(picture)) {
    return <OnboardingScreen />;
  }

  return <>{children}</>;
}
