'use client';

import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { ProductOffers } from './ProductOffers';
import { useDataStage } from '@/modules/identity/DataStageProvider';
import { useUserData } from '@/modules/identity/UserDataProvider';
import { calculateTax } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';

export function RetirementGap() {
  const { stage } = useDataStage();
  const { userData } = useUserData();
  const complete = stage === 'after';

  // ─── Shared values ────────────────────────────────────────────────
  const grossProjected = complete ? 3840 : userData.pillar1Total;
  const residenceCountry = (userData.residenceCountry ?? 'LU') as ResidenceCountry;
  const { netAnnual, effectiveRate } = calculateTax(grossProjected * 12, residenceCountry);
  const projected = Math.round(netAnnual / 12);
  const goal = userData.monthlyIncomeGoal;
  const gap = goal - projected;
  const barWidth = Math.round((projected / goal) * 100);

  return (
    <Card className="mb-5 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-[220px] h-[220px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right,rgba(212,175,55,0.06),transparent 70%)' }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-[22px]">
        <div>
          <div className="text-[15px] font-semibold mb-[3px]" style={{ color: 'var(--text)' }}>Retirement Income Gap</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
            {complete
              ? `Your verified net projection vs your goal · ${Math.round(effectiveRate * 100)}% effective tax`
              : `Your projected net state pension vs your goal · ${Math.round(effectiveRate * 100)}% effective tax`}
          </div>
          {!complete && (
            <div className="text-[11px] mt-1 flex items-center gap-1.5" style={{ color: 'var(--amber)' }}>
              <span>⚠</span>
              <span>This gap will narrow as you complete your pension picture above</span>
            </div>
          )}
        </div>
        <span className="text-[11px] pt-1" style={{ color: 'var(--text-dim)' }}>
          {userData.countriesWorked.length} countries · retiring at {userData.targetRetirementAge}
        </span>
      </div>

      {/* Visual gap bar */}
      <div className="mb-[22px]">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {complete ? 'Your projection' : 'State pension projection'}
          </span>
          <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Your goal</span>
        </div>
        <div className="relative h-12 rounded-[10px] overflow-hidden mb-2.5" style={{ background: 'var(--navy-3)' }}>
          <div className="absolute top-0 left-0 h-full rounded-l-[10px] flex items-center pl-3.5"
            style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg,#3ecf8e,#2ba87a)' }}>
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>€{projected.toLocaleString()}</span>
            <span className="text-[11px] ml-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>/mo</span>
          </div>
          {!complete && (
            /* Unknown P2/P3 zone */
            <div className="absolute top-0 h-full flex items-center justify-center"
              style={{
                left: `${barWidth}%`, width: '24%',
                background: 'repeating-linear-gradient(135deg,rgba(217,119,6,0.12),rgba(217,119,6,0.12) 4px,rgba(217,119,6,0.06) 4px,rgba(217,119,6,0.06) 8px)',
                borderLeft: '2px dashed rgba(217,119,6,0.5)',
              }}>
              <span className="text-[10px] font-medium" style={{ color: 'var(--amber)' }}>Workplace & Personal unknown</span>
            </div>
          )}
          {/* Remaining gap */}
          <div className="absolute top-0 h-full flex items-center justify-center"
            style={{
              left: complete ? `${barWidth}%` : '70%',
              width: complete ? `${100 - barWidth}%` : '30%',
              background: 'rgba(239,68,68,0.18)',
              borderLeft: '2px dashed rgba(239,68,68,0.5)',
            }}>
            <span className="text-xs font-bold" style={{ color: 'var(--red)' }}>−€{gap.toLocaleString()} gap</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'linear-gradient(90deg,#3ecf8e,#2ba87a)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {complete ? 'Net projected' : 'State pension net'} <strong style={{ color: 'var(--text)' }}>€{projected.toLocaleString()}/mo</strong>
            </span>
          </div>
          {!complete && (
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{
                background: 'repeating-linear-gradient(135deg,rgba(217,119,6,0.25),rgba(217,119,6,0.25) 2px,rgba(217,119,6,0.1) 2px,rgba(217,119,6,0.1) 4px)',
                border: '1px dashed rgba(217,119,6,0.4)',
              }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Workplace & Personal <strong style={{ color: 'var(--amber)' }}>unknown</strong></span>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(239,68,68,0.4)', border: '1px dashed rgba(239,68,68,0.6)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Your goal <strong style={{ color: 'var(--text)' }}>€{goal.toLocaleString()}/mo</strong></span>
          </div>
        </div>
      </div>

      {/* Gap sources */}
      <div className="grid grid-cols-3 gap-2.5 mb-7">
        {complete ? (
          <>
            {[
              { label: 'Contribution gap', amount: '−€960', color: 'var(--red)', desc: 'Missing insurance years across 3 countries' },
              { label: 'Personal savings gap', amount: '−€580', color: 'var(--red)', desc: 'No private savings currently tracked' },
              { label: 'Transition gap', amount: '−€120', color: 'var(--amber)', desc: 'Jan–Mar 2020 Luxembourg gap (correction in progress)' },
            ].map((src) => (
              <div key={src.label} className="rounded-[10px] p-[13px]" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                <div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-dim)' }}>{src.label}</div>
                <div className="text-xl font-bold mb-[3px]" style={{ fontFamily: 'var(--font-playfair)', color: src.color }}>{src.amount}</div>
                <div className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>{src.desc}</div>
              </div>
            ))}
          </>
        ) : (
          <>
            {[
              { label: 'Workplace & Personal', amount: '?', color: 'var(--amber)', desc: 'Upload pension statements to reveal your occupational & private savings' },
              { label: 'Transition gap', amount: '−€120', color: 'var(--red)', desc: '3 months between Switzerland and Luxembourg (Jan–Mar 2020)' },
              { label: 'Missing period', amount: '?', color: 'var(--amber)', desc: '14 months with no data (Aug 2013 – Aug 2014). Add employment to improve estimate' },
            ].map((src) => (
              <div key={src.label} className="rounded-[10px] p-[13px]" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                <div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-dim)' }}>{src.label}</div>
                <div className="text-xl font-bold mb-[3px]" style={{ fontFamily: 'var(--font-playfair)', color: src.color }}>{src.amount}</div>
                <div className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>{src.desc}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3.5 mb-[22px]">
        <div className="flex-1 h-px" style={{ background: 'var(--gold-border)' }} />
        <span className="text-[12.5px] font-semibold whitespace-nowrap" style={{ color: 'var(--gold)' }}>
          {complete ? 'Here\u2019s how to close it' : 'Start closing the gap'}
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--gold-border)' }} />
      </div>

      {/* Product offers */}
      <ProductOffers />

      {/* All three summary */}
      <div className="rounded-[10px] p-3.5 px-[18px] mb-4" style={{ background: 'var(--navy-3)', border: '1px solid rgba(62,207,142,0.2)' }}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>If you act on all three</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>
            {complete ? 'Gap closes to −€310/mo' : '+€1,350/mo toward your goal'}
          </span>
        </div>
        <div className="relative h-6 rounded-md overflow-hidden" style={{ background: 'var(--navy-4)' }}>
          <div className="absolute top-0 left-0 h-full rounded-l-md" style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg,#3ecf8e,#2ba87a)' }} />
          <div className="absolute top-0 h-full" style={{
            left: `${barWidth}%`, width: '24.5%',
            background: 'repeating-linear-gradient(135deg,rgba(62,207,142,0.25),rgba(62,207,142,0.25) 4px,rgba(62,207,142,0.12) 4px,rgba(62,207,142,0.12) 8px)',
            borderLeft: '1px dashed var(--green)',
          }} />
          {!complete && (
            <div className="absolute top-0 h-full" style={{
              left: '70.5%', width: '14.5%',
              background: 'repeating-linear-gradient(135deg,rgba(217,119,6,0.15),rgba(217,119,6,0.15) 4px,rgba(217,119,6,0.06) 4px,rgba(217,119,6,0.06) 8px)',
              borderLeft: '1px dashed rgba(217,119,6,0.4)',
            }} />
          )}
          <div className="absolute top-0 right-0 h-full" style={{
            width: complete ? '5.5%' : '15%',
            background: 'rgba(239,68,68,0.18)',
            borderLeft: '1px dashed rgba(239,68,68,0.4)',
          }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>€{projected.toLocaleString()} current</span>
          <span className="text-[11px]" style={{ color: 'var(--green)' }}>+€1,350 from products</span>
          {!complete && <span className="text-[11px]" style={{ color: 'var(--amber)' }}>Workplace & Personal unknown</span>}
          <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>€{goal.toLocaleString()} goal</span>
        </div>
      </div>

      {/* Capital drawdown note — only in complete state */}
      {complete && (
        <div className="rounded-[10px] p-3.5 px-[18px] mb-4 flex items-center gap-3.5 flex-wrap"
          style={{ background: 'var(--blue-dim)', border: '1px solid rgba(96,165,250,0.25)' }}>
          <div className="text-lg shrink-0">🏦</div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-[13px] font-semibold mb-[3px]" style={{ color: 'var(--text)' }}>
              You also have <span style={{ color: 'var(--blue)' }}>€210,000</span> in Swiss workplace pension capital
            </div>
            <div className="flex gap-4 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
              <span>Drawdown: <strong style={{ color: 'var(--blue)' }}>+€700/mo</strong> over 25 yrs</span>
              <span>Annuity: <strong style={{ color: 'var(--text)' }}>€840/mo</strong> for life</span>
            </div>
          </div>
          <Link href="/estimation" className="shrink-0 no-underline">
            <button className="px-4 py-2 rounded-lg text-xs cursor-pointer transition-all"
              style={{ background: 'transparent', border: '1px solid rgba(96,165,250,0.3)', color: 'var(--blue)', fontFamily: 'var(--font-sans)' }}>
              Model options →
            </button>
          </Link>
        </div>
      )}

      {/* Transparency note */}
      <div className="flex items-start gap-2.5 p-3 px-4 rounded-[10px]" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
        <span className="text-sm shrink-0 mt-px">ℹ️</span>
        <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          <strong style={{ color: 'var(--text-muted)' }}>How this works:</strong> Prevista partners with regulated financial providers to show you products matched to your situation.
          If you subscribe, we receive a referral fee — this keeps the platform free for core pension tracking. Projections assume 5% annual return and are illustrative only.
        </div>
      </div>
    </Card>
  );
}
