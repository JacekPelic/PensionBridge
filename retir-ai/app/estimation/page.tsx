'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { IncomeGoalInput } from '@/modules/pension/components/estimation/IncomeGoalInput';
import { IncomeBreakdown } from '@/modules/pension/components/estimation/IncomeBreakdown';
import { SimulationCTA } from '@/modules/pension/components/estimation/SimulationCTA';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { UserDataProvider } from '@/modules/identity/UserDataProvider';
import { Button } from '@/shared/ui/Button';

export default function EstimationPage() {
  const [target, setTarget] = useState(5500);
  const [netMonthly, setNetMonthly] = useState<number | null>(null);

  const handleNetComputed = useCallback((net: number) => {
    setNetMonthly(net);
  }, []);

  return (
    <UserDataProvider>
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
            <IncomeGoalInput target={target} onTargetChange={setTarget} netProjected={netMonthly} />
            <IncomeBreakdown onNetComputed={handleNetComputed} />
            <SimulationCTA />
          </div>
        </div>
        <ChatWidget />
      </div>
    </UserDataProvider>
  );
}
