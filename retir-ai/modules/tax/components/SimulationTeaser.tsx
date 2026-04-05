'use client';

import { Card } from '@/shared/ui/Card';
import { UpgradePrompt } from '@/shared/ui/UpgradePrompt';
import { RESIDENCE_META } from '@/modules/tax/engine/tables';
import type { TaxResult } from '@/modules/tax/types';

interface Props {
  results: TaxResult[];
}

export function SimulationTeaser({ results }: Props) {
  return (
    <div className="mt-5">
      {/* Blurred preview of results */}
      <Card className="mb-5 relative overflow-hidden">
        <div style={{ filter: 'blur(6px)', opacity: 0.5, pointerEvents: 'none' }}>
          <div className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>Tax Breakdown</div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {results.slice(0, 3).map((r) => {
              const meta = RESIDENCE_META[r.residenceCountry];
              return (
                <div key={r.residenceCountry} className="p-4 rounded-xl" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                  <div className="text-[13px] font-semibold mb-2" style={{ color: 'var(--text)' }}>
                    {meta.flag} {meta.name}
                  </div>
                  <div className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)' }}>
                    €{r.netMonthly.toLocaleString()}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>/ month net</div>
                </div>
              );
            })}
          </div>
          <div className="h-40 rounded-xl" style={{ background: 'var(--navy-3)' }} />
        </div>

        {/* Overlay with upgrade prompt */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(10,15,28,0.6)' }}>
          <div className="max-w-md w-full">
            <UpgradePrompt
              title="Unlock Decision Modelling"
              description="Compare net income across 6 countries, model your capital split, and find the optimal residence for retirement."
              badge="Pro"
            />
            <div className="flex justify-center gap-4 mt-4">
              {[
                { icon: '🌍', label: 'Tax comparison' },
                { icon: '📊', label: 'Country ranking' },
                { icon: '🏦', label: 'Capital modeller' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
                  style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <span>{f.icon}</span> {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
