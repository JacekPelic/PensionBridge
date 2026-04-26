'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { DocumentVault } from '@/modules/vault/components/DocumentVault';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { DataStageProvider, useDataStage } from '@/modules/identity/DataStageProvider';
import { VaultProvider, useVault } from '@/modules/vault/VaultProvider';
import { VaultTierProvider } from '@/modules/vault/VaultTierProvider';
import { Button } from '@/shared/ui/Button';

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

function UploadButton() {
  const { triggerUpload } = useVault();
  return <Button variant="primary" onClick={triggerUpload}>+ Upload Document</Button>;
}

function VaultContent() {
  const { stage } = useDataStage();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <Topbar
          title="Document Vault"
          subtitle="Upload · AI extraction · verification tracking"
          actions={
            <>
              <StageToggle />
              <UploadButton />
            </>
          }
        />
        <div className="flex-1 p-7 animate-fade-in" key={stage}>
          <DocumentVault />
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}

export default function VaultPage() {
  return (
    <DataStageProvider>
      <VaultTierProvider>
        <VaultProvider>
          <VaultContent />
        </VaultProvider>
      </VaultTierProvider>
    </DataStageProvider>
  );
}
