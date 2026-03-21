'use client';

import { useState, useMemo } from 'react';
import type { OnboardingState } from '@/lib/pension/types';
import { COUNTRY_META, calculateAllEstimates, totalPillar1Eur, deriveAllParams } from '@/lib/pension';

interface Props {
  state: OnboardingState;
}

/** Find the ongoing (or most recent) entry for the projection assumption label */
function getProjectionLabel(state: OnboardingState): string | null {
  const ongoing = state.employmentEntries.find((e) => e.endDate === null);
  if (ongoing) {
    const meta = COUNTRY_META[ongoing.country];
    return `Assumes you continue working in ${meta.name} at ${ongoing.currency === 'CHF' ? 'CHF' : '\u20AC'}${ongoing.endSalary.toLocaleString()}/yr until age ${state.targetRetirementAge}`;
  }
  return null;
}

export function StepEstimate({ state }: Props) {
  const estimates = calculateAllEstimates(state);
  const total = totalPillar1Eur(estimates);
  const [retirementAge, setRetirementAge] = useState(state.targetRetirementAge);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const projectionLabel = getProjectionLabel(state);

  // For age sensitivity, recalculate with different ages (re-derive params with new age)
  const ageState = useMemo(() => {
    if (retirementAge === state.targetRetirementAge) return state;
    const newState = { ...state, targetRetirementAge: retirementAge, franceParams: null, switzerlandParams: null, luxembourgParams: null };
    const derived = deriveAllParams(newState);
    return { ...newState, ...derived };
  }, [state, retirementAge]);

  const ageEstimates = retirementAge !== state.targetRetirementAge ? calculateAllEstimates(ageState) : estimates;
  const ageTotal = retirementAge !== state.targetRetirementAge ? totalPillar1Eur(ageEstimates) : total;

  const displayEstimates = retirementAge !== state.targetRetirementAge ? ageEstimates : estimates;

  return (
    <div className="text-center py-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 animate-pop-in"
        style={{ background: 'var(--green-dim)', border: '2px solid var(--green)' }}
      >
        {'\u2713'}
      </div>
      <h1
        className="text-[30px] font-bold leading-tight mb-2"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
      >
        Your Pillar 1 <span style={{ color: 'var(--gold-light)' }}>Estimate</span>
      </h1>
      <p className="text-sm mb-4 max-w-[460px] mx-auto" style={{ color: 'var(--text-muted)' }}>
        Combined state pension projection from {displayEstimates.length} countr{displayEstimates.length === 1 ? 'y' : 'ies'}.
      </p>

      {/* Projection assumption */}
      {projectionLabel && (
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] mb-6"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <span style={{ color: 'var(--blue, #60a5fa)' }}>{'i'}</span>
          {projectionLabel}
        </div>
      )}

      {/* Total */}
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--gold)' }}>
          Total Monthly Pillar 1 Income
        </div>
        <div
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 48,
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.1,
          }}
        >
          {'\u20AC'}{ageTotal.toLocaleString()}
          <span className="text-xl" style={{ color: 'var(--text-muted)' }}> / month</span>
        </div>
      </div>

      {/* Per-country breakdown */}
      <div className="max-w-[520px] mx-auto text-left mb-8">
        {displayEstimates.map((est) => {
          const meta = COUNTRY_META[est.country];
          const isExpanded = expandedCountry === est.country;
          return (
            <div key={est.country} className="mb-3">
              <div
                className="flex items-center gap-3.5 p-4 rounded-xl cursor-pointer transition-all"
                style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
                onClick={() => setExpandedCountry(isExpanded ? null : est.country)}
              >
                <span className="text-xl">{meta.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
                      {meta.name}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: 'var(--navy-4)', color: 'var(--text-dim)' }}>
                      {meta.body}
                    </span>
                    {!est.isFullRate && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: 'var(--amber-dim, rgba(245,158,11,0.15))', color: 'var(--amber)' }}>
                        Below full rate
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
                    {est.currency === 'CHF' ? 'CHF' : '\u20AC'}{est.monthlyPensionLocal.toLocaleString()}
                  </div>
                  {est.currency === 'CHF' && (
                    <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                      {'\u2248 \u20AC'}{est.monthlyPensionEur.toLocaleString()}
                    </div>
                  )}
                </div>
                <span className="text-[11px] transition-transform" style={{ color: 'var(--text-dim)', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                  {'\u25BC'}
                </span>
              </div>

              {/* Expanded breakdown */}
              {isExpanded && (
                <div className="mt-1 rounded-xl p-4" style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}>
                  <div className="text-[11px] font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-dim)' }}>
                    Formula Breakdown
                  </div>
                  {est.breakdown.map((row) => (
                    <div key={row.label} className="flex justify-between py-1.5 text-[12.5px]" style={{ borderBottom: '1px solid var(--navy-4)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                      <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{row.value}</span>
                    </div>
                  ))}

                  {/* Warnings */}
                  {est.warnings.length > 0 && (
                    <div className="mt-3">
                      {est.warnings.map((w, i) => (
                        <div key={i} className="text-[11.5px] py-1 flex gap-2" style={{ color: 'var(--amber)' }}>
                          <span>{'!'}</span>
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Age sensitivity slider */}
      <div className="max-w-[420px] mx-auto rounded-xl p-5" style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}>
        <div className="text-[12px] font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
          What if I retire at a different age?
        </div>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>57</span>
          <input
            type="range"
            min={57}
            max={70}
            value={retirementAge}
            onChange={(e) => setRetirementAge(parseInt(e.target.value))}
            className="flex-1 accent-[var(--gold)]"
          />
          <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>70</span>
        </div>
        <div className="text-[15px] font-semibold" style={{ color: 'var(--gold-light)' }}>
          Age {retirementAge}: {'\u20AC'}{ageTotal.toLocaleString()}/mo
        </div>
        {retirementAge !== state.targetRetirementAge && (
          <div className="text-[11.5px] mt-1" style={{ color: ageTotal > total ? 'var(--green)' : 'var(--amber)' }}>
            {ageTotal > total ? '+' : ''}{'\u20AC'}{(ageTotal - total).toLocaleString()}/mo vs. age {state.targetRetirementAge}
          </div>
        )}
      </div>
    </div>
  );
}
