'use client';

import { Button } from '@/shared/ui/Button';
import { useVaultTier } from '@/modules/vault/VaultTierProvider';

interface Props {
  title: string;
  description: string;
  featureCount?: number;
}

export function UpgradePrompt({ title, description, featureCount }: Props) {
  const { toggleTier } = useVaultTier();

  return (
    <div className="rounded-xl p-5 text-center relative overflow-hidden"
      style={{ background: 'var(--navy-3)', border: '1px solid var(--gold-border)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(201,168,76,0.06), transparent 70%)' }} />
      <div className="relative">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>
          Vault Pro
        </div>
        <div className="text-[14px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>{title}</div>
        <div className="text-[12px] mb-4 max-w-[400px] mx-auto" style={{ color: 'var(--text-muted)' }}>
          {description}
          {featureCount != null && featureCount > 0 && (
            <span style={{ color: 'var(--gold-light)' }}> {featureCount} item{featureCount !== 1 ? 's' : ''} found.</span>
          )}
        </div>
        <Button variant="primary" onClick={toggleTier}>
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
