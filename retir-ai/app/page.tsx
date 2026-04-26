'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { Button } from '@/shared/ui/Button';
import { PictureSummary } from '@/modules/identity/components/onboarding-v2/PictureSummary';
import { KpiCards } from '@/modules/pension/components/dashboard/KpiCards';
import { RetirementGap } from '@/modules/pension/components/dashboard/RetirementGap';
import { DataStageProvider, useDataStage } from '@/modules/identity/DataStageProvider';
import { usePicture } from '@/modules/identity/PictureProvider';

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

function DashboardChrome() {
  const { mode, picture, startFresh, loadMock } = usePicture();

  const hasOpening = picture.residenceCountry != null && picture.age != null;
  let subtitle: string;
  if (mode === 'mock') {
    subtitle = 'Demo \u00B7 Mats Karlsson, 45, LU resident';
  } else if (hasOpening) {
    subtitle = 'Based on your picture \u00B7 updates as you refine details';
  } else {
    subtitle = 'Add a few details on the Your picture page to see your numbers here';
  }

  return (
    <Topbar
      title="Dashboard"
      subtitle={subtitle}
      actions={
        <>
          <StageToggle />
          {mode === 'mock' ? (
            <Button variant="ghost" onClick={startFresh}>
              Start fresh
            </Button>
          ) : (
            <Button variant="ghost" onClick={loadMock}>
              View demo
            </Button>
          )}
        </>
      }
    />
  );
}

function DashboardBody() {
  return (
    <div className="flex-1 p-7 animate-fade-in">
      <PictureSummary />
      <RetirementGap />
      <KpiCards />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DataStageProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
          <DashboardChrome />
          <DashboardBody />
        </div>
        <ChatWidget />
      </div>
    </DataStageProvider>
  );
}
