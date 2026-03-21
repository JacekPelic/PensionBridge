'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { RESIDENCE_META } from '@/lib/tax';
import type { TaxResult } from '@/lib/tax';

interface Props {
  results: TaxResult[];
}

type SortMode = 'net' | 'ppp';

export function CountryComparison({ results }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>('ppp');

  if (results.length === 0) return null;

  const maxNet = Math.max(...results.map((r) => r.netMonthly));
  const bestNetCountry = results.find((r) => r.netMonthly === maxNet)?.residenceCountry;

  const maxPpp = Math.max(...results.map((r) => r.pppAdjustedMonthly));
  const bestPppCountry = results.find((r) => r.pppAdjustedMonthly === maxPpp)?.residenceCountry;

  const sorted = [...results].sort((a, b) =>
    sortMode === 'ppp'
      ? b.pppAdjustedMonthly - a.pppAdjustedMonthly
      : b.netMonthly - a.netMonthly,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Country Comparison</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
            Same pension, different tax residence — ranked by {sortMode === 'ppp' ? 'spending power' : 'net income'}
          </div>
        </div>
        {/* Sort toggle */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
          {([
            { key: 'net' as SortMode, label: 'Net income' },
            { key: 'ppp' as SortMode, label: 'Spending power' },
          ]).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortMode(opt.key)}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition-all"
              style={{
                background: sortMode === opt.key ? 'var(--gold-dim)' : 'transparent',
                border: sortMode === opt.key ? '1px solid var(--gold-border)' : '1px solid transparent',
                color: sortMode === opt.key ? 'var(--gold-light)' : 'var(--text-dim)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual comparison bar chart */}
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            {sortMode === 'ppp' ? 'Spending power (France-equivalent €)' : 'Net monthly income'}
          </div>
          {sortMode === 'ppp' && (
            <div className="text-[10px] px-2 py-[2px] rounded-full" style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(96,165,250,0.25)' }}>
              Adjusted for cost of living
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {sorted.map((result) => {
            const meta = RESIDENCE_META[result.residenceCountry];
            const isBestNet = result.residenceCountry === bestNetCountry;
            const isBestPpp = result.residenceCountry === bestPppCountry;
            const isBest = sortMode === 'ppp' ? isBestPpp : isBestNet;

            const displayValue = sortMode === 'ppp' ? result.pppAdjustedMonthly : result.netMonthly;
            const maxDisplay = sortMode === 'ppp' ? maxPpp : maxNet;
            const barPct = maxDisplay > 0 ? (displayValue / maxDisplay) * 100 : 0;
            const diffFromBest = displayValue - maxDisplay;

            return (
              <div key={result.residenceCountry}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{meta.flag}</span>
                    <span className="text-[12.5px] font-medium" style={{ color: 'var(--text)' }}>{meta.name}</span>
                    {isBest && (
                      <span className="text-[9px] font-bold px-2 py-[2px] rounded-full"
                        style={{ background: 'var(--gold-dim)', color: 'var(--gold-light)', border: '1px solid var(--gold-border)' }}>
                        {sortMode === 'ppp' ? 'BEST VALUE' : 'BEST NET'}
                      </span>
                    )}
                    {sortMode === 'ppp' && result.pppIndex !== 1.0 && (
                      <span className="text-[10px]" style={{ color: result.pppIndex < 1 ? 'var(--green)' : 'var(--red)' }}>
                        {result.pppIndex < 1 ? `${Math.round((1 - result.pppIndex) * 100)}% cheaper` : `${Math.round((result.pppIndex - 1) * 100)}% pricier`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: isBest ? 'var(--green)' : 'var(--text)' }}>
                      €{displayValue.toLocaleString()}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>/mo</span>
                    {!isBest && diffFromBest !== 0 && (
                      <span className="text-[11px] font-medium" style={{ color: 'var(--red)' }}>
                        {diffFromBest.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative h-7 rounded-lg overflow-hidden" style={{ background: 'var(--navy-4)' }}>
                  <div className="absolute top-0 left-0 h-full rounded-l-lg flex items-center pl-2.5"
                    style={{
                      width: `${barPct}%`,
                      background: isBest ? 'linear-gradient(90deg,#3ecf8e,#2ba87a)' : 'linear-gradient(90deg,rgba(62,207,142,0.6),rgba(43,168,122,0.6))',
                    }}>
                    {barPct > 15 && (
                      <span className="text-[10px] font-bold text-white">
                        {sortMode === 'ppp' ? 'SPENDING POWER' : 'NET'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detail cards grid */}
      <div className={`grid gap-4 ${sorted.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {sorted.map((result) => {
          const meta = RESIDENCE_META[result.residenceCountry];
          const isBestNet = result.residenceCountry === bestNetCountry;
          const isBestPpp = result.residenceCountry === bestPppCountry;

          return (
            <Card
              key={result.residenceCountry}
              style={(isBestNet || isBestPpp) ? { border: '1px solid var(--gold-border)' } : undefined}
            >
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {isBestNet && (
                  <span className="text-[9px] font-bold px-2 py-[2px] rounded-full"
                    style={{ background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(62,207,142,0.25)' }}>
                    HIGHEST NET
                  </span>
                )}
                {isBestPpp && (
                  <span className="text-[9px] font-bold px-2 py-[2px] rounded-full"
                    style={{ background: 'var(--gold-dim)', color: 'var(--gold-light)', border: '1px solid var(--gold-border)' }}>
                    BEST SPENDING POWER
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{meta.flag}</span>
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{meta.name}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{meta.regime}</div>
                </div>
              </div>

              {/* Gross / Tax / Net */}
              <div className="flex flex-col gap-1.5 mb-3">
                <div className="flex justify-between text-[12px]">
                  <span style={{ color: 'var(--text-muted)' }}>Gross</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>€{result.grossMonthly.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span style={{ color: 'var(--text-muted)' }}>Tax</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)' }}>−€{result.taxMonthly.toLocaleString()}/mo</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                <div className="flex justify-between text-[13px] font-bold">
                  <span style={{ color: 'var(--text)' }}>Net</span>
                  <span style={{ fontFamily: 'var(--font-playfair)', color: isBestNet ? 'var(--green)' : 'var(--text)' }}>
                    €{result.netMonthly.toLocaleString()}/mo
                  </span>
                </div>
              </div>

              {/* Spending power */}
              <div className="rounded-lg p-2.5 px-3 mb-3"
                style={{ background: isBestPpp ? 'var(--blue-dim)' : 'var(--navy-3)', border: isBestPpp ? '1px solid rgba(96,165,250,0.25)' : '1px solid var(--border)' }}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-dim)' }}>Spending power</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      France-equivalent
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: isBestPpp ? 'var(--blue)' : 'var(--text)' }}>
                      €{result.pppAdjustedMonthly.toLocaleString()}
                    </div>
                    <div className="text-[10px]" style={{ color: result.pppIndex < 1 ? 'var(--green)' : result.pppIndex > 1 ? 'var(--red)' : 'var(--text-dim)' }}>
                      {result.pppIndex === 1
                        ? 'baseline'
                        : result.pppIndex < 1
                          ? `+${Math.round((1 / result.pppIndex - 1) * 100)}% more purchasing power`
                          : `−${Math.round((1 - 1 / result.pppIndex) * 100)}% less purchasing power`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Effective rate bar */}
              <div className="mb-2">
                <div className="flex justify-between text-[11px] mb-1">
                  <span style={{ color: 'var(--text-dim)' }}>Effective rate</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{(result.effectiveRate * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--navy-4)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${Math.min(result.effectiveRate * 100, 100)}%`,
                    background: result.effectiveRate < 0.15 ? 'var(--green)' : result.effectiveRate < 0.25 ? 'var(--amber)' : 'var(--red)',
                  }} />
                </div>
              </div>

              {/* Annual figures */}
              <div className="text-[11px] mt-2" style={{ color: 'var(--text-dim)' }}>
                Annual net: €{result.netAnnual.toLocaleString()} · Spending power: €{(result.pppAdjustedMonthly * 12).toLocaleString()}/yr
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
