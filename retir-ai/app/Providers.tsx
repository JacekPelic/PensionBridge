'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/shared/ThemeProvider';
import { TierProvider } from '@/shared/TierProvider';
import { PictureProvider } from '@/modules/identity/PictureProvider';
import { ChatProvider } from '@/shared/chat/ChatProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TierProvider>
        <PictureProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </PictureProvider>
      </TierProvider>
    </ThemeProvider>
  );
}
