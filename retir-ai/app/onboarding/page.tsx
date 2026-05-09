'use client';

import { OnboardingWizard } from '@/modules/identity/components/onboarding/OnboardingWizard';
import { UserDataProvider } from '@/modules/identity/UserDataProvider';

export default function OnboardingPage() {
  return (
    <UserDataProvider>
      <OnboardingWizard forceOpen />
    </UserDataProvider>
  );
}
