'use client';

import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { DocumentVault } from '@/modules/vault/components/DocumentVault';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { useDataStage } from '@/modules/identity/DataStageProvider';
import { VaultProvider, useVault } from '@/modules/vault/VaultProvider';
import { VaultTierProvider } from '@/modules/vault/VaultTierProvider';
import { Button } from '@/shared/ui/Button';
import { StageToggle } from '@/shared/ui/StageToggle';

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
    <VaultTierProvider>
      <VaultProvider>
        <VaultContent />
      </VaultProvider>
    </VaultTierProvider>
  );
}
