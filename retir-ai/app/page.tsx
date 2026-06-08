'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { Button } from '@/shared/ui/Button';
import { StageToggle } from '@/shared/ui/StageToggle';
import { PictureSummary } from '@/modules/identity/components/onboarding-v2/PictureSummary';
import { KpiCards } from '@/modules/pension/components/dashboard/KpiCards';
import { RetirementGap } from '@/modules/pension/components/dashboard/RetirementGap';
import { usePicture } from '@/modules/identity/PictureProvider';

function DashboardChrome() {
  const { mode, picture, startFresh, loadMock } = usePicture();

  const hasOpening = picture.residenceCountry != null && picture.age != null;
  let subtitle: string;
  if (hasOpening) {
    subtitle = 'Based on your picture · updates as you refine details';
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
    <div className="flex-1 p-4 sm:p-7 animate-fade-in">
      <PictureSummary />
      <RetirementGap />
      <KpiCards />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <DashboardChrome />
        <DashboardBody />
      </div>
      <ChatWidget />
    </div>
  );
}
