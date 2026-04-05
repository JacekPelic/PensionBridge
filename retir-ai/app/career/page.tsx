'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { Timeline } from '@/modules/career/components/Timeline';
import { CareerSidebar } from '@/modules/career/components/CareerSidebar';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { Button } from '@/shared/ui/Button';

export default function CareerPage() {
  return (
    <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
          <Topbar
            title="Career Journey"
            subtitle="Your employment history across countries"
            actions={
              <>
                <Button variant="ghost">↑ Import CSV</Button>
                <Button variant="primary">+ Add Period</Button>
              </>
            }
          />
          <div className="flex-1 p-7 animate-fade-in">
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
              <Timeline />
              <CareerSidebar />
            </div>
          </div>
        </div>
        <ChatWidget />
      </div>
  );
}
