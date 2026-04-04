'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { RiskRadar } from '@/modules/radar/components/RiskRadar';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { ThemeProvider } from '@/shared/ThemeProvider';
import { Button } from '@/shared/ui/Button';

export default function RadarPage() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
          <Topbar
            title="Legislative Radar"
            subtitle="Monitoring pension laws, tax reforms & regulatory changes across your countries"
            actions={
              <Button variant="ghost">Mark All Read</Button>
            }
          />
          <div className="flex-1 p-7 animate-fade-in">
            <RiskRadar />
          </div>
        </div>
        <ChatWidget />
      </div>
    </ThemeProvider>
  );
}
