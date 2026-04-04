'use client';

import { OnboardingWizard } from '@/modules/identity/components/onboarding/OnboardingWizard';
import { ThemeProvider } from '@/shared/ThemeProvider';
import { UserDataProvider } from '@/modules/identity/UserDataProvider';

export default function OnboardingPage() {
  return (
    <ThemeProvider>
      <UserDataProvider>
        <OnboardingWizard forceOpen />
      </UserDataProvider>
    </ThemeProvider>
  );
}
