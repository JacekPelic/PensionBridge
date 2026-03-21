'use client';

import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { UserDataProvider } from '@/providers/UserDataProvider';

export default function OnboardingPage() {
  return (
    <ThemeProvider>
      <UserDataProvider>
        <OnboardingWizard forceOpen />
      </UserDataProvider>
    </ThemeProvider>
  );
}
