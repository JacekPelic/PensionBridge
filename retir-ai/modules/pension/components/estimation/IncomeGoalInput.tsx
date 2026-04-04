'use client';

import { Card } from '@/shared/ui/Card';
import { BASE_TMI, RETIREMENT_YEARS } from '@/modules/pension/constants';

interface Props {
  target: number;
  onTargetChange: (v: number) => void;
  /** Net monthly income after tax. When provided, gap is computed against net. */
  netProjected?: number | null;
}

export function IncomeGoalInput({ target, onTargetChange, netProjected }: Props) {
  const grossProjected = BASE_TMI;
  const projected = netProjected ?? grossProjected;
  const isNet = netProjected != null;
  const gap = target - projected;
  const pct = Math.min(100, Math.round((projected / target) * 100));
  const circumference = 2 * Math.PI * 56; // ~351.86
  const fillOffset = circumference - (circumference * pct) / 100;
  const gapOffset = circumference - (circumference * Math.min(100, 100 - pct)) / 100;

  return (
    <Card className="mb-5" style={{ borderColor: 'var(--gold-border)' }}>
      <div className="flex items-start justify-between gap-5 flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <div className="text-[11px] uppercase tracking-wider font-medium mb-1.5" style={{ color: 'var(--gold)' }}>
            Your Retirement Income Goal {isNet && <span style={{ color: 'var(--text-dim)', fontWeight: 400, textTransform: 'none' }}>(net after tax)</span>}
          </div>
          <div className="text-[13px] mb-3.5 max-w-[400px]" style={{ color: 'var(--text-muted)' }}>
            What monthly {isNet ? 'net ' : ''}income do you need to maintain your current lifestyle in retirement?
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-semibold" style={{ color: 'var(--gold-light)' }}>€</span>
              <input
                type="number"
                value={target}
                onChange={(e) => onTargetChange(parseInt(e.target.value) || 0)}
                className="rounded-[10px] outline-none w-[160px]"
                style={{
                  background: 'var(--navy-3)', border: '1.5px solid var(--gold-border)',
                  padding: '12px 14px 12px 32px', fontFamily: 'var(--font-playfair)',
                  fontSize: 22, fontWeight: 700, color: 'var(--text)',
                }}
              />
            </div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/ month</span>
          </div>
          <div className="flex gap-2 mt-2.5 flex-wrap items-center">
            <span className="text-[11.5px]" style={{ color: 'var(--text-dim)' }}>Quick targets:</span>
            {[3500, 4500, 5500, 7000].map((v) => (
              <span
                key={v}
                className="text-xs cursor-pointer underline underline-offset-2"
                style={{ color: v === 5500 ? 'var(--gold-light)' : 'var(--gold-light)' }}
                onClick={() => onTargetChange(v)}
              >
                €{v.toLocaleString()}{v === 5500 ? ' ←' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Gauge */}
        <div className="shrink-0 text-center min-w-[180px]">
          <div className="text-[11px] uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-dim)' }}>
            {isNet ? 'Net Income' : 'Retirement Income'} Gap
          </div>
          <div className="relative w-[140px] h-[140px] mx-auto mb-2.5">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="56" fill="none" stroke="var(--navy-3)" strokeWidth="14" />
              <circle
                cx="70" cy="70" r="56" fill="none" stroke="var(--gold)" strokeWidth="14"
                strokeDasharray={circumference} strokeDashoffset={fillOffset}
                strokeLinecap="round" transform="rotate(-90 70 70)"
              />
              <circle
                cx="70" cy="70" r="56" fill="none" stroke="var(--red)" strokeWidth="14"
                strokeDasharray={circumference} strokeDashoffset={gapOffset}
                strokeLinecap="round" transform="rotate(-90 70 70)" opacity="0.5"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>{pct}%</div>
              <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>covered</div>
            </div>
          </div>
          <div className="text-[13px] font-semibold" style={{ color: gap > 0 ? 'var(--red)' : 'var(--green)' }}>
            {gap > 0 ? `−€${gap.toLocaleString()} / mo shortfall` : `+€${Math.abs(gap).toLocaleString()} surplus`}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
            over {RETIREMENT_YEARS} yrs = {gap > 0 ? '−' : '+'}€{(Math.abs(gap) * 12 * RETIREMENT_YEARS).toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
}
