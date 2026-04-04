'use client';

import { useVaultTier } from '@/modules/vault/VaultTierProvider';
import { useVault } from '@/modules/vault/VaultProvider';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

export function VaultProActions() {
  const { isPro } = useVaultTier();
  const { documents } = useVault();
  const verified = documents.filter((d) => d.status === 'verified').length;

  if (!isPro) {
    return (
      <div className="grid grid-cols-2 gap-3.5 mb-5">
        {/* Export — locked */}
        <div className="rounded-xl p-4 flex items-center gap-3 relative overflow-hidden"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', opacity: 0.7 }}>
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm" style={{ background: 'var(--navy-4)' }}>📑</div>
          <div className="flex-1">
            <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>Export Dossier</div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Download your full pension report as PDF</div>
          </div>
          <span className="text-[9px] font-bold px-2 py-1 rounded-full" style={{ background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid var(--gold-border)' }}>
            PRO
          </span>
        </div>

        {/* Family sharing — locked */}
        <div className="rounded-xl p-4 flex items-center gap-3 relative overflow-hidden"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', opacity: 0.7 }}>
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm" style={{ background: 'var(--navy-4)' }}>👨‍👩‍👧</div>
          <div className="flex-1">
            <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>Family Sharing</div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Give family members controlled access</div>
          </div>
          <span className="text-[9px] font-bold px-2 py-1 rounded-full" style={{ background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid var(--gold-border)' }}>
            PRO
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 mb-5">
      {/* Export — active */}
      <Card style={{ cursor: 'pointer', border: '1px solid rgba(96,165,250,0.25)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm" style={{ background: 'var(--blue-dim)' }}>📑</div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>Export Dossier</div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
              {verified} verified documents ready for export
            </div>
          </div>
          <Button variant="outline-gold" className="text-[11px] px-3 py-1.5">
            Download PDF
          </Button>
        </div>
      </Card>

      {/* Family sharing — active */}
      <Card style={{ cursor: 'pointer', border: '1px solid rgba(62,207,142,0.25)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm" style={{ background: 'var(--green-dim)' }}>👨‍👩‍👧</div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>Family Sharing</div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
              2 family members have access
            </div>
          </div>
          <Button variant="outline-gold" className="text-[11px] px-3 py-1.5">
            Manage
          </Button>
        </div>
      </Card>
    </div>
  );
}
