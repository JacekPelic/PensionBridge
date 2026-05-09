'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/shared/ThemeProvider';
import { TierProvider } from '@/shared/TierProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TierProvider>
        {children}
      </TierProvider>
    </ThemeProvider>
  );
}
