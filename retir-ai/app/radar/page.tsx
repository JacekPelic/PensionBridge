'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { RiskRadar } from '@/components/radar/RiskRadar';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';

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
