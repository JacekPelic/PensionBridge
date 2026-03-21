'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { IncomeGoalInput } from '@/components/estimation/IncomeGoalInput';
import { IncomeBreakdown } from '@/components/estimation/IncomeBreakdown';
import { CapitalModeller } from '@/components/estimation/CapitalModeller';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';

export default function EstimationPage() {
  const [target, setTarget] = useState(5500);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
          <Topbar
            title="Payout Estimation"
            subtitle="Modelled from salary & career data · ±10–15% accuracy"
            actions={
              <>
                <Button variant="ghost">↑ Upload Statement</Button>
                <Button variant="primary">↻ Recalculate</Button>
              </>
            }
          />
          <div className="flex-1 p-7 animate-fade-in">
            <IncomeGoalInput target={target} onTargetChange={setTarget} />
            <IncomeBreakdown />
            <CapitalModeller />
          </div>
        </div>
        <ChatWidget />
      </div>
    </ThemeProvider>
  );
}
