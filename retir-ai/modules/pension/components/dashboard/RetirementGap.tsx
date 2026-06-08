'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { ProductOffers } from './ProductOffers';
import { useDataStage } from '@/modules/identity/DataStageProvider';
import { useUserData } from '@/modules/identity/UserDataProvider';
import { calculateTax } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';
import { BASE_TMI } from '@/modules/pension/constants';

// Tabular mono figure — every currency/year/age number renders here so digits
// align and the hero answer reads like an actuary's statement, not marketing.
function Figure({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={className}
      style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', ...style }}
    >
      {children}
    </span>
  );
}

export function RetirementGap() {
  const { stage } = useDataStage();
  const { userData, isFromOnboarding } = useUserData();
  const complete = stage === 'after';
  // Only show Mats-specific gap dates / closing amounts when we're actually
  // in the canned demo (mock mode). Real onboarded users get neutral copy.
  const showMatsSpecifics = !isFromOnboarding;

  const [showDetail, setShowDetail] = useState(false);

  // ─── Shared values ────────────────────────────────────────────────
  // BASE_TMI is the canonical verified-net monthly projection — already after tax.
  // The hard-coded gap-source cards below (€960 + €580 + €120 = €1,660) assume
  // projected = BASE_TMI directly. The pre-verification path is still gross →
  // applies LU tax → reports the implied net + effective rate.
  const residenceCountry = (userData.residenceCountry ?? 'LU') as ResidenceCountry;
  let projected: number;
  if (complete) {
    projected = BASE_TMI;
  } else {
    const { netAnnual } = calculateTax(userData.pillar1Total * 12, residenceCountry);
    projected = Math.round(netAnnual / 12);
  }
  const goal = userData.monthlyIncomeGoal;
  const gap = goal - projected;
  const onTrack = gap <= 0;
  const barWidth = Math.max(0, Math.min(100, Math.round((projected / goal) * 100)));

  const eur = (n: number) => `€${Math.abs(n).toLocaleString()}`;

  // While the modal is open: close on Escape and lock background scroll.
  useEffect(() => {
    if (!showDetail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDetail(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showDetail]);

  return (
    <Card className="mb-5">
      {/* ════════════════ THE REVEAL — one clear answer ════════════════ */}
      <div className="px-1 pt-2 pb-1">
        <div
          className="text-[12px] font-semibold uppercase mb-5"
          style={{ color: 'var(--gold)', letterSpacing: '0.16em' }}
        >
          Your retirement income
        </div>

        {/* Plain-language lead */}
        <p
          className="text-[21px] leading-[1.45] mb-4"
          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)', maxWidth: '34ch' }}
        >
          {onTrack ? (
            <>
              {complete ? "You're on track for " : 'Your state pension comes to '}
              <strong style={{ fontWeight: 600 }}>{eur(projected)}</strong> a month — that already
              meets your <strong style={{ fontWeight: 600 }}>{eur(goal)}</strong> goal.
            </>
          ) : (
            <>
              {complete ? "You're on track for " : 'Your state pension comes to '}
              <strong style={{ fontWeight: 600 }}>{eur(projected)}</strong> a month. Your goal is{' '}
              <strong style={{ fontWeight: 600 }}>{eur(goal)}</strong>. That leaves a gap of:
            </>
          )}
        </p>

        {/* Hero figure — the gap */}
        {!onTrack && (
          <div className="flex items-baseline gap-3.5 mb-1.5">
            <Figure
              className="text-[64px] font-semibold leading-none"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              {eur(gap)}
            </Figure>
            <span className="text-[18px]" style={{ color: 'var(--text-muted)' }}>a month</span>
          </div>
        )}
        {onTrack && (
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-[40px]" style={{ color: 'var(--green)' }}>✓</span>
            <span className="text-[28px] font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
              On track
            </span>
          </div>
        )}

        {/* Provisional note when the picture is still incomplete */}
        {!complete && !onTrack && (
          <p className="text-[14px] leading-relaxed mb-7 mt-2" style={{ color: 'var(--text-dim)', maxWidth: '46ch' }}>
            This counts your state pension only — it narrows as you add your workplace &amp; personal pensions.
          </p>
        )}
        {(complete || onTrack) && <div className="mb-8" />}

        {/* One calm bar: on track → goal */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="text-[12.5px] mb-1" style={{ color: 'var(--text-muted)' }}>On track</div>
              <Figure className="text-[17px] font-medium" style={{ color: 'var(--text)' }}>{eur(projected)}</Figure>
            </div>
            <div className="text-right">
              <div className="text-[12.5px] mb-1" style={{ color: 'var(--text-muted)' }}>Your goal</div>
              <Figure className="text-[17px] font-medium" style={{ color: 'var(--text)' }}>{eur(goal)}</Figure>
            </div>
          </div>
          <div className="h-3.5 rounded-lg overflow-hidden relative" style={{ background: 'var(--navy-3)' }}>
            <div
              className="absolute inset-y-0 left-0 rounded-lg"
              style={{ width: `${barWidth}%`, background: 'var(--gold)' }}
            />
          </div>
        </div>

        {/* Reassurance */}
        <p className="text-[16px] leading-[1.55] mb-6" style={{ color: 'var(--text)' }}>
          {onTrack ? (
            <>You can still strengthen it — there are ways to add margin and protect against inflation.</>
          ) : complete ? (
            <>
              <strong style={{ color: 'var(--green)', fontWeight: 600 }}>Good news —</strong> we&apos;ve found three
              ways to close most of it.
            </>
          ) : (
            <>
              <strong style={{ color: 'var(--green)', fontWeight: 600 }}>Next —</strong> add your workplace &amp;
              personal pensions to see exactly how to close it.
            </>
          )}
        </p>

        {/* Primary action — opt into the detail */}
        <button
          type="button"
          onClick={() => setShowDetail(true)}
          aria-haspopup="dialog"
          className="inline-flex items-center gap-2.5 rounded-[11px] cursor-pointer transition-colors"
          style={{
            background: 'var(--gold)',
            color: 'var(--navy)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '16px',
            padding: '15px 26px',
            minHeight: '52px',
            border: 'none',
          }}
        >
          {onTrack ? 'See how to strengthen it' : 'See how to close it'}
          <span aria-hidden>→</span>
        </button>

        {/* Trust / provenance line */}
        <div
          className="mt-8 pt-5 flex items-center gap-2.5 text-[13.5px]"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-dim)' }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: complete ? 'var(--green)' : 'var(--amber)' }}
          />
          <span>
            {complete ? 'Verified across ' : 'Based on your picture so far · '}
            <Figure>{userData.countriesWorked.length}</Figure>{' '}
            {userData.countriesWorked.length === 1 ? 'country' : 'countries'} · retiring at{' '}
            <Figure>{userData.targetRetirementAge}</Figure>
          </span>
        </div>
      </div>

      {/* ════════════════ THE DETAIL — opt-in "how to close it" modal ════════════════ */}
      {showDetail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="closegap-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowDetail(false)}
        >
          <div
            className="w-[680px] max-w-[92vw] max-h-[85vh] overflow-y-auto rounded-[18px] p-6 animate-fade-in"
            style={{ background: 'var(--navy-2)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div id="closegap-title" className="text-[18px] font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
                  {complete ? 'How to close your gap' : 'Start closing your gap'}
                </div>
                <div className="text-[13px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                  {onTrack ? 'Ways to add margin to your plan' : `Closing the ${eur(gap)}/mo gap toward your ${eur(goal)} goal`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                aria-label="Close"
                className="text-lg leading-none cursor-pointer shrink-0 rounded-md flex items-center justify-center"
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', width: 44, height: 44 }}
              >
                ✕
              </button>
            </div>

          {/* Gap sources */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-7">
            {(complete
              ? [
                  { label: 'Contribution gap', amount: '−€960', color: 'var(--red)', desc: 'Missing insurance years across 3 countries' },
                  { label: 'Personal savings gap', amount: '−€580', color: 'var(--red)', desc: 'No private savings currently tracked' },
                  { label: 'Transition gap', amount: '−€120', color: 'var(--amber)', desc: 'Jan–Mar 2020 Luxembourg gap (correction in progress)' },
                ]
              : showMatsSpecifics
                ? [
                    { label: 'Workplace & Personal', amount: '?', color: 'var(--amber)', desc: 'Upload pension statements to reveal your occupational & private savings' },
                    { label: 'Transition gap', amount: '−€120', color: 'var(--red)', desc: '3 months between Switzerland and Luxembourg (Jan–Mar 2020)' },
                    { label: 'Missing period', amount: '?', color: 'var(--amber)', desc: '14 months with no data (Aug 2013 – Aug 2014). Add employment to improve estimate' },
                  ]
                : [
                    { label: 'Workplace & Personal', amount: '?', color: 'var(--amber)', desc: 'Upload pension statements to reveal your occupational & private savings' },
                    { label: 'Career history', amount: '?', color: 'var(--amber)', desc: 'Add your employment timeline to surface contribution gaps and missing periods' },
                    { label: 'Personal savings', amount: '?', color: 'var(--amber)', desc: 'Tell us about IRA / 3a / PER / private savings to complete the picture' },
                  ]
            ).map((src) => (
              <div key={src.label} className="rounded-[10px] p-[13px]" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                <div className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: 'var(--text-dim)' }}>{src.label}</div>
                <Figure className="block text-xl font-semibold mb-[3px]" style={{ color: src.color }}>{src.amount}</Figure>
                <div className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>{src.desc}</div>
              </div>
            ))}
          </div>

          {/* Product offers */}
          <ProductOffers />

          {/* All three summary */}
          <div className="rounded-[10px] p-3.5 px-[18px] mb-4" style={{ background: 'var(--navy-3)', border: '1px solid var(--green-dim)' }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>If you act on all three</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>
                {complete
                  ? 'Gap closes to −€310/mo'
                  : showMatsSpecifics
                    ? '+€1,350/mo toward your goal'
                    : 'Could substantially close your gap'}
              </span>
            </div>
            <div className="relative h-6 rounded-md overflow-hidden" style={{ background: 'var(--navy-4)' }}>
              <div className="absolute top-0 left-0 h-full rounded-l-md" style={{ width: `${barWidth}%`, background: 'var(--green)' }} />
              <div className="absolute top-0 h-full" style={{
                left: `${barWidth}%`, width: '24.5%',
                background: 'var(--green-dim)',
                borderLeft: '1px dashed var(--green)',
              }} />
              <div className="absolute top-0 right-0 h-full" style={{
                width: complete ? '5.5%' : '15%',
                background: 'var(--red-dim)',
                borderLeft: '1px dashed var(--red)',
              }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <Figure className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{eur(projected)} current</Figure>
              {showMatsSpecifics && !complete && (
                <span className="text-[11px]" style={{ color: 'var(--green)' }}>+€1,350 from products</span>
              )}
              <Figure className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{eur(goal)} goal</Figure>
            </div>
          </div>

          {/* Capital drawdown note — only in complete state */}
          {complete && (
            <div className="rounded-[10px] p-3.5 px-[18px] mb-4 flex items-center gap-3.5 flex-wrap"
              style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue-dim)' }}>
              <div className="text-lg shrink-0" style={{ color: 'var(--blue)', fontFamily: 'var(--font-playfair)', fontWeight: 600 }}>▣</div>
              <div className="flex-1 min-w-[200px]">
                <div className="text-[13px] font-semibold mb-[3px]" style={{ color: 'var(--text)' }}>
                  You also have <Figure style={{ color: 'var(--blue)' }}>€210,000</Figure> in Swiss workplace pension capital
                </div>
                <div className="flex gap-4 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
                  <span>Drawdown: <strong style={{ color: 'var(--blue)' }}>+€700/mo</strong> over 25 yrs</span>
                  <span>Annuity: <strong style={{ color: 'var(--text)' }}>€840/mo</strong> for life</span>
                </div>
              </div>
              <Link href="/estimation" className="shrink-0 no-underline">
                <button className="px-4 py-2 rounded-lg text-xs cursor-pointer transition-all"
                  style={{ background: 'transparent', border: '1px solid var(--blue)', color: 'var(--blue)', fontFamily: 'var(--font-sans)' }}>
                  Model options →
                </button>
              </Link>
            </div>
          )}

          {/* Transparency note */}
          <div className="flex items-start gap-2.5 p-3 px-4 rounded-[10px]" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
            <span className="text-sm shrink-0 mt-px">ℹ️</span>
            <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              <strong style={{ color: 'var(--text-muted)' }}>How this works:</strong> Prevista shows products from regulated providers matched to your situation.
              If you fund one, we receive a small trailing partnership fee — a fraction of a percent — which keeps core pension tracking free. Projections assume 5% annual return and are illustrative only.
            </div>
          </div>
          </div>
        </div>
      )}
    </Card>
  );
}
