'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/shared/ThemeProvider';
import { TierProvider } from '@/shared/TierProvider';
import { PictureProvider } from '@/modules/identity/PictureProvider';
import { DataStageProvider } from '@/modules/identity/DataStageProvider';
import { OnboardingGate } from '@/modules/identity/OnboardingGate';
import { ChatProvider } from '@/shared/chat/ChatProvider';
import { SidebarProvider } from '@/shared/layout/SidebarProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TierProvider>
        <PictureProvider>
          <DataStageProvider>
            <ChatProvider>
              <SidebarProvider>
                <OnboardingGate>{children}</OnboardingGate>
              </SidebarProvider>
            </ChatProvider>
          </DataStageProvider>
        </PictureProvider>
      </TierProvider>
    </ThemeProvider>
  );
}
