'use client';

import { useState } from 'react';
import { useVaultTier } from '@/modules/vault/VaultTierProvider';
import { UpgradePrompt } from './UpgradePrompt';
import { mockDiscrepancies } from '@/modules/vault/data/mock-discrepancies';
import { Card } from '@/shared/ui/Card';
import { Pill } from '@/shared/ui/Pill';

const severityConfig: Record<string, { variant: 'red' | 'amber' | 'gold'; label: string }> = {
  high: { variant: 'red', label: 'High' },
  medium: { variant: 'amber', label: 'Medium' },
  low: { variant: 'gold', label: 'Low' },
};

export function DiscrepancyAlerts() {
  const { isPro } = useVaultTier();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isPro) {
    return (
      <UpgradePrompt
        title="Cross-referencing & Discrepancy Alerts"
        description="We compare your documents against each other and your pension calculations to find inconsistencies that could cost you money."
        featureCount={mockDiscrepancies.length}
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Discrepancy Alerts</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Issues found by cross-referencing your documents</div>
        </div>
        <Pill variant="red">{mockDiscrepancies.length} found</Pill>
      </div>

      <div className="flex flex-col gap-2.5">
        {mockDiscrepancies.map((disc) => {
          const sev = severityConfig[disc.severity];
          const isExpanded = expandedId === disc.id;

          return (
            <div key={disc.id}>
              <button
                className="w-full text-left rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all"
                style={{
                  background: 'var(--navy-3)',
                  border: isExpanded ? '1px solid var(--gold-border)' : '1px solid var(--border)',
                  borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
                }}
                onClick={() => setExpandedId(isExpanded ? null : disc.id)}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
                  style={{ background: disc.severity === 'high' ? 'var(--red-dim)' : 'var(--amber-dim)' }}>
                  ⚠
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{disc.title}</div>
                  <div className="flex items-center gap-2">
                    <Pill variant={sev.variant} style={{ fontSize: 9, padding: '1px 8px' }}>{sev.label}</Pill>
                    <span className="text-[11px] font-medium" style={{ color: 'var(--red)' }}>{disc.financialImpact}</span>
                  </div>
                </div>
                <span className="text-[12px] shrink-0 transition-transform mt-1" style={{ color: 'var(--text-dim)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▾
                </span>
              </button>

              {isExpanded && (
                <div className="rounded-b-xl p-4 pt-0" style={{ background: 'var(--navy-3)', border: '1px solid var(--gold-border)', borderTop: 'none' }}>
                  <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{disc.description}</div>

                    <div className="text-[11px] uppercase tracking-wider font-medium mb-1.5" style={{ color: 'var(--text-dim)' }}>
                      Affected documents
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {disc.affectedDocs.map((doc) => (
                        <span key={doc} className="text-[11px] px-2.5 py-1 rounded-lg"
                          style={{ background: 'var(--navy-4)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                          {doc}
                        </span>
                      ))}
                    </div>

                    <div className="rounded-lg p-3" style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
                      <div className="text-[11px] font-medium mb-1" style={{ color: 'var(--gold-light)' }}>Recommendation</div>
                      <div className="text-[12px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{disc.recommendation}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
