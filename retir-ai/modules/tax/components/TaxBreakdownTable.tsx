'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { RESIDENCE_META } from '@/modules/tax';
import type { TaxResult } from '@/modules/tax';

interface Props {
  results: TaxResult[];
}

export function TaxBreakdownTable({ results }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const result = results[selectedIdx] ?? results[0];
  if (!result) return null;

  const meta = RESIDENCE_META[result.residenceCountry];

  return (
    <Card className="mb-5">
      {/* Header with country tabs */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-2.5">
        <div>
          <div className="text-[15px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
            Detailed Tax Breakdown
          </div>
          <div className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
            Gross pension → income tax → net monthly income
          </div>
          {/* Country tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
            {results.map((r, i) => {
              const m = RESIDENCE_META[r.residenceCountry];
              const isActive = i === selectedIdx;
              return (
                <button
                  key={r.residenceCountry}
                  onClick={() => setSelectedIdx(i)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition-all"
                  style={{
                    background: isActive ? 'var(--gold-dim)' : 'transparent',
                    border: isActive ? '1px solid var(--gold-border)' : '1px solid transparent',
                    color: isActive ? 'var(--gold-light)' : 'var(--text-dim)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <span>{m.flag}</span>
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--green)' }}>
              €{result.netMonthly.toLocaleString()}
            </span>
            <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>net / month</span>
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
            Effective rate: {(result.effectiveRate * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Summary bars */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Gross', value: result.grossMonthly, color: 'var(--text)', sub: null },
          { label: 'Tax', value: result.taxMonthly, color: 'var(--red)', sub: `${(result.effectiveRate * 100).toFixed(1)}% effective` },
          { label: 'Net', value: result.netMonthly, color: 'var(--green)', sub: null },
          { label: 'Spending Power', value: result.pppAdjustedMonthly, color: 'var(--blue)', sub: result.pppIndex !== 1 ? `PPP index: ${result.pppIndex.toFixed(2)}` : 'baseline' },
        ].map((item) => (
          <div key={item.label} className="rounded-[10px] p-3 text-center"
            style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
            <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--text-dim)' }}>{item.label}</div>
            <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: item.color }}>
              €{item.value.toLocaleString()}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>/month</div>
            {item.sub && <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{item.sub}</div>}
          </div>
        ))}
      </div>

      {/* Detailed table */}
      <div className="text-[11px] font-bold uppercase tracking-wide mb-2.5" style={{ color: 'var(--text-dim)' }}>
        Per pension source
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Pension Source', 'Gross/mo', 'Tax/mo', 'Net/mo', 'Share'].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-[11px] uppercase tracking-wide font-semibold"
                  style={{
                    color: 'var(--text-dim)',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--navy-3)',
                    textAlign: h !== 'Pension Source' ? 'right' : 'left',
                  }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.perSource.map((src) => {
              const pct = result.grossMonthly > 0 ? (src.grossMonthly / result.grossMonthly * 100).toFixed(0) : '0';
              return (
                <tr key={src.label} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-3 py-2.5" style={{ color: 'var(--text)' }}>{src.label}</td>
                  <td className="px-3 py-2.5 text-right font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                    €{src.grossMonthly.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)' }}>
                    −€{src.taxMonthly.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>
                    €{src.netMonthly.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {pct}%
                  </td>
                </tr>
              );
            })}
            {/* Total row */}
            <tr style={{ background: 'var(--navy-3)' }}>
              <td className="px-3 py-2.5 font-bold" style={{ color: 'var(--text)' }}>Total</td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>
                €{result.grossMonthly.toLocaleString()}
              </td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)' }}>
                −€{result.taxMonthly.toLocaleString()}
              </td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--green)', fontSize: 15 }}>
                €{result.netMonthly.toLocaleString()}
              </td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                {(result.effectiveRate * 100).toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Regime note */}
      <div className="flex items-start gap-2.5 p-3 px-4 rounded-[10px] mt-4" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
        <span className="text-sm shrink-0 mt-px">ℹ️</span>
        <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          <strong style={{ color: 'var(--text-muted)' }}>{meta.name} tax regime:</strong> {meta.regime}
        </div>
      </div>
    </Card>
  );
}
