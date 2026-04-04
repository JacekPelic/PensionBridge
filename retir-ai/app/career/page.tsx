'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { Timeline } from '@/modules/career/components/Timeline';
import { CareerSidebar } from '@/modules/career/components/CareerSidebar';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { ThemeProvider } from '@/shared/ThemeProvider';
import { Button } from '@/shared/ui/Button';
import { InfoBox } from '@/shared/ui/InfoBox';

export default function CareerPage() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
          <Topbar
            title="Career Journey"
            subtitle="Visual timeline · gap detection · error flagging"
            actions={
              <>
                <Button variant="ghost">↑ Import CSV</Button>
                <Button variant="primary">+ Add Period</Button>
              </>
            }
          />
          <div className="flex-1 p-7 animate-fade-in">
            <InfoBox title="🔍 2 Gaps Detected in Your Career Data">
              A 3-month gap between Switzerland and Luxembourg (Jan–Mar 2020) could cost <strong>€120/month</strong> at retirement.
              We also found <strong>14 months with no data</strong> (Aug 2013 – Aug 2014) between your French periods — add the missing employment to improve your estimate.
            </InfoBox>

            <div className="grid gap-4" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
              <Timeline />
              <CareerSidebar />
            </div>
          </div>
        </div>
        <ChatWidget />
      </div>
    </ThemeProvider>
  );
}
