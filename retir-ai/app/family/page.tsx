'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { FamilyAccess } from '@/modules/family/components/FamilyAccess';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { ThemeProvider } from '@/shared/ThemeProvider';
import { Button } from '@/shared/ui/Button';

export default function FamilyPage() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
          <Topbar
            title="Family Access"
            subtitle="Manage who can view your pension data & claim instructions"
            actions={
              <Button variant="primary">+ Add Family Member</Button>
            }
          />
          <div className="flex-1 p-7 animate-fade-in">
            <FamilyAccess />
          </div>
        </div>
        <ChatWidget />
      </div>
    </ThemeProvider>
  );
}
