'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Pill } from '@/shared/ui/Pill';
import { SWISS_P2_CAPITAL, DRAWDOWN_YEARS } from '@/modules/pension/constants';
import { capitalComponents } from '@/modules/pension/data/mock-data';

export function CapitalModeller() {
  const [capitalPct, setCapitalPct] = useState(0);

  const lumpSum = Math.round(SWISS_P2_CAPITAL * (capitalPct / 100));
  const annuityPortion = Math.round(1040 * (1 - capitalPct / 100));
  const drawdownMonthly = Math.round(lumpSum / DRAWDOWN_YEARS / 12);

  return (
    <Card className="mb-5" style={{ borderColor: 'rgba(96,165,250,0.25)' }}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px]" style={{ background: 'var(--blue-dim)' }}>🏦</div>
        <div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Capital at Retirement</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Your pension components — annuity vs lump-sum options</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Component', 'Monthly Annuity', 'Lump-Sum Option', 'Payout Type'].map((h, i) => (
                <th key={h} className="px-3 py-2 text-[11px] uppercase tracking-wide font-semibold"
                  style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border)', background: 'var(--navy-3)', textAlign: i === 0 ? 'left' : i === 3 ? 'center' : 'right' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capitalComponents.map((comp) => (
              <tr key={comp.label} style={{
                borderBottom: '1px solid var(--border)',
                background: comp.isHighlighted ? 'var(--blue-dim)' : 'transparent',
              }}>
                <td className="px-3 py-2.5" style={{ color: 'var(--text)', fontWeight: comp.isHighlighted ? 600 : 400 }}>
                  {comp.label}
                  {comp.isHighlighted && <Pill variant="red" style={{ fontSize: 9, marginLeft: 4, padding: '1px 6px' }}>unlocated</Pill>}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold" style={{
                  fontFamily: 'var(--font-mono)',
                  color: comp.isHighlighted ? 'var(--amber)' : comp.payoutType === 'annuity_only' ? 'var(--green)' : 'var(--text)',
                }}>
                  €{comp.monthlyAnnuity.toLocaleString()}{comp.isHighlighted ? ' est.' : ''}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold" style={{
                  fontFamily: 'var(--font-mono)',
                  color: comp.lumpSumOption ? 'var(--amber)' : 'var(--text-dim)',
                }}>
                  {comp.lumpSumOption ? `~€${comp.lumpSumOption.toLocaleString()}` : '—'}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <Pill variant={comp.payoutType === 'capital_choice' ? 'blue' : 'green'} style={{ fontSize: 10 }}>
                    {comp.payoutType === 'capital_choice' ? 'Capital choice' : 'Annuity only'}
                  </Pill>
                </td>
              </tr>
            ))}
            <tr style={{ background: 'var(--navy-3)' }}>
              <td className="px-3 py-2.5 font-bold" style={{ color: 'var(--text)' }}>Total</td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>€3,840</td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>~€210,000</td>
              <td className="px-3 py-2.5 text-center text-[11px]" style={{ color: 'var(--text-dim)' }}>1 capital choice</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Capital Modeller */}
      <div className="p-5 rounded-xl" style={{ background: 'var(--navy-3)', border: '1px solid rgba(96,165,250,0.2)' }}>
        <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text)' }}>Swiss Workplace Pension Capital Modeller</div>
        <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          Slide to model how much of your Swiss workplace capital to take as a lump sum vs annuity
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>0% capital</span>
          <input
            type="range"
            min="0" max="100"
            value={capitalPct}
            onChange={(e) => setCapitalPct(parseInt(e.target.value))}
            className="flex-1 h-1.5 rounded-md outline-none cursor-pointer"
            style={{ accentColor: 'var(--blue)' }}
          />
          <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>100% capital</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--navy-4)' }}>
            <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--text-dim)' }}>Monthly Annuity</div>
            <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)' }}>
              €{annuityPortion.toLocaleString()}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>for life</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--navy-4)' }}>
            <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--text-dim)' }}>Lump Sum</div>
            <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--blue)' }}>
              €{lumpSum.toLocaleString()}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{capitalPct}% of workplace capital</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--navy-4)' }}>
            <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--text-dim)' }}>Drawdown Income</div>
            <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--green)' }}>
              €{drawdownMonthly.toLocaleString()}/mo
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>over {DRAWDOWN_YEARS} years</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
