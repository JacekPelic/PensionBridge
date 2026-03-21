'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Timeline } from '@/components/career/Timeline';
import { CareerSidebar } from '@/components/career/CareerSidebar';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { InfoBox } from '@/components/ui/InfoBox';

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
              <div className="mt-2.5">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-[12px] font-medium px-3.5 py-2 rounded-lg no-underline transition-all"
                  style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', color: 'var(--gold-light)' }}
                >
                  👤 Have an expert investigate and fix these gaps
                </Link>
              </div>
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
