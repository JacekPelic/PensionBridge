'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { TmiHero } from '@/components/dashboard/TmiHero';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { RetirementGap } from '@/components/dashboard/RetirementGap';
import { PensionPicture } from '@/components/dashboard/PensionPicture';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { DataStageProvider, useDataStage } from '@/providers/DataStageProvider';
import { UserDataProvider } from '@/providers/UserDataProvider';
import { Button } from '@/components/ui/Button';

function StageToggle() {
  const { stage, toggleStage } = useDataStage();
  const isAfter = stage === 'after';

  return (
    <button
      onClick={toggleStage}
      className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg cursor-pointer transition-all text-[12px] font-medium"
      style={{
        background: isAfter ? 'var(--green-dim)' : 'var(--navy-3)',
        border: isAfter ? '1px solid rgba(62,207,142,0.3)' : '1px solid var(--border)',
        color: isAfter ? 'var(--green)' : 'var(--text-muted)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Toggle track */}
      <div
        className="relative w-8 h-[18px] rounded-full transition-all"
        style={{ background: isAfter ? 'var(--green)' : 'var(--navy-4)' }}
      >
        <div
          className="absolute top-[3px] w-3 h-3 rounded-full transition-all"
          style={{
            left: isAfter ? 17 : 3,
            background: isAfter ? 'var(--navy)' : 'var(--text-dim)',
          }}
        />
      </div>
      {isAfter ? 'Documents uploaded' : 'Before documents'}
    </button>
  );
}

function DashboardContent() {
  const { stage } = useDataStage();
  const complete = stage === 'after';

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <Topbar
          title="Dashboard"
          subtitle="Last synced: today at 09:41 CET"
          actions={
            <>
              <StageToggle />
              <Button variant="ghost">{'\u21BB'} Refresh</Button>
              <Button variant="primary">+ Add Period</Button>
            </>
          }
        />
        <div className="flex-1 p-7 animate-fade-in" key={stage}>
          <TmiHero />
          <KpiCards />
          {complete ? (
            <>
              <RetirementGap />
              <PensionPicture />
            </>
          ) : (
            <>
              <PensionPicture />
              <RetirementGap />
            </>
          )}
        </div>
      </div>
      <ChatWidget />
      <OnboardingWizard />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <UserDataProvider>
        <DataStageProvider>
          <DashboardContent />
        </DataStageProvider>
      </UserDataProvider>
    </ThemeProvider>
  );
}
