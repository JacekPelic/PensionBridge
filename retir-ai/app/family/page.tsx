'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { FamilyAccess } from '@/modules/family/components/FamilyAccess';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { useTier } from '@/shared/TierProvider';
import { Button } from '@/shared/ui/Button';

export default function FamilyPage() {
  const { isPro } = useTier();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <Topbar
          title="Family Access"
          subtitle="Manage who can view your pension data & claim instructions"
          actions={
            isPro ? <Button variant="primary">+ Add Family Member</Button> : undefined
          }
        />
        <div className="flex-1 p-7 animate-fade-in">
          <FamilyAccess />
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}
