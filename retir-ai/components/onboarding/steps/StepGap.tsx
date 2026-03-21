'use client';

import type { OnboardingState } from '@/lib/pension/types';
import { calculateAllEstimates, totalPillar1Eur, COUNTRY_META } from '@/lib/pension';

interface Props {
  state: OnboardingState;
  onChange: (patch: Partial<OnboardingState>) => void;
}

const GOAL_PRESETS = [3000, 4000, 5000, 6000, 7000];

export function StepGap({ state, onChange }: Props) {
  const estimates = calculateAllEstimates(state);
  const pillar1Total = totalPillar1Eur(estimates);
  const goal = state.monthlyIncomeGoal;
  const gap = goal - pillar1Total;
  const pct = goal > 0 ? Math.min(100, Math.round((pillar1Total / goal) * 100)) : 0;
  const annualGap = gap > 0 ? gap * 12 : 0;
  const retirementYears = 85 - state.targetRetirementAge; // assume life expectancy ~85
  const lifetimeGap = annualGap * retirementYears;

  return (
    <div>
      <h1
        className="text-[30px] font-bold leading-tight mb-2"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
      >
        Your retirement <span style={{ color: 'var(--gold-light)' }}>income gap</span>
      </h1>
      <p className="text-sm mb-8 max-w-[540px]" style={{ color: 'var(--text-muted)' }}>
        Pillar 1 alone covers part of your retirement income. The gap represents what Pillar 2
        (occupational) and Pillar 3 (private savings) need to fill.
      </p>

      {/* Goal setter */}
      <div className="max-w-[540px]">
        <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
          Monthly Income Goal
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[15px] font-semibold" style={{ color: 'var(--gold-light)' }}>{'\u20AC'}</span>
          <input
            type="number"
            value={goal}
            onChange={(e) => onChange({ monthlyIncomeGoal: parseInt(e.target.value) || 0 })}
            className="rounded-[10px] outline-none w-[140px] text-center"
            style={{
              background: 'var(--navy-3)',
              border: '1.5px solid var(--gold-border)',
              padding: '8px 14px',
              fontFamily: 'var(--font-playfair)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text)',
            }}
          />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/ month</span>
        </div>
        <div className="flex gap-2 mb-6">
          {GOAL_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange({ monthlyIncomeGoal: preset })}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all"
              style={{
                background: goal === preset ? 'var(--gold-dim)' : 'var(--navy-3)',
                border: goal === preset ? '1px solid var(--gold)' : '1px solid var(--border)',
                color: goal === preset ? 'var(--gold-light)' : 'var(--text-dim)',
              }}
            >
              {'\u20AC'}{preset.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="rounded-xl p-5 mb-5" style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
              Pillar 1 covers
            </span>
            <span className="text-[13px] font-bold" style={{ color: gap <= 0 ? 'var(--green)' : 'var(--text)' }}>
              {pct}%
            </span>
          </div>
          <div className="h-4 rounded-md overflow-hidden flex" style={{ background: 'var(--navy-4)' }}>
            <div
              className="h-full rounded-l-md transition-all flex items-center justify-center"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, var(--green), var(--gold-light))',
                minWidth: pct > 5 ? 'auto' : 0,
              }}
            >
              {pct >= 15 && (
                <span className="text-[10px] font-bold" style={{ color: 'var(--navy)' }}>
                  P1: {'\u20AC'}{pillar1Total.toLocaleString()}
                </span>
              )}
            </div>
            {gap > 0 && (
              <div
                className="h-full flex items-center justify-center flex-1"
                style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, var(--navy-5) 4px, var(--navy-5) 8px)' }}
              >
                <span className="text-[10px] font-bold" style={{ color: 'var(--text-dim)' }}>
                  Gap: {'\u20AC'}{gap.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Pillar 1 breakdown within the bar */}
          <div className="flex gap-3 mt-3">
            {estimates.map((est) => {
              const meta = COUNTRY_META[est.country];
              const countryPct = goal > 0 ? Math.round((est.monthlyPensionEur / goal) * 100) : 0;
              return (
                <div key={est.country} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  <span>{meta.flag}</span>
                  <span>{'\u20AC'}{est.monthlyPensionEur.toLocaleString()}</span>
                  <span style={{ color: 'var(--text-dim)' }}>({countryPct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gap summary */}
        {gap > 0 ? (
          <div className="rounded-xl p-5" style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}>
            <div className="text-[13px] font-semibold mb-3" style={{ color: 'var(--red)' }}>
              {'\u2212\u20AC'}{gap.toLocaleString()} / month shortfall
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ background: 'var(--navy-3)' }}>
                <div className="text-[11px] mb-1" style={{ color: 'var(--text-dim)' }}>Annual gap</div>
                <div className="text-[15px] font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-playfair)' }}>
                  {'\u20AC'}{annualGap.toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'var(--navy-3)' }}>
                <div className="text-[11px] mb-1" style={{ color: 'var(--text-dim)' }}>Lifetime gap ({retirementYears} yrs)</div>
                <div className="text-[15px] font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-playfair)' }}>
                  {'\u20AC'}{lifetimeGap.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-[12px] mt-3" style={{ color: 'var(--text-muted)' }}>
              This gap can be covered through Pillar 2 occupational pensions and Pillar 3 private
              savings. Explore your options in the dashboard.
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-5 text-center" style={{ background: 'var(--green-dim, rgba(34,197,94,0.08))', border: '1px solid var(--green)' }}>
            <div className="text-[15px] font-semibold" style={{ color: 'var(--green)' }}>
              Your Pillar 1 income covers your goal!
            </div>
            <div className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
              +{'\u20AC'}{Math.abs(gap).toLocaleString()}/mo surplus. Pillar 2 &amp; 3 will add even more.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
