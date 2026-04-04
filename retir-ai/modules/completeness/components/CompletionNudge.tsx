'use client';

import Link from 'next/link';
import { useCompleteness } from '@/modules/completeness';
import { ProgressBar } from '@/shared/ui/ProgressBar';

export function CompletionNudge() {
  const { score, pending, nextStep, completed } = useCompleteness();

  const barColor = score >= 80 ? 'var(--green)' : 'var(--gold)';
  const scoreColor = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--gold)' : 'var(--amber)';

  return (
    <Link
      href="/progress"
      className="block rounded-[14px] p-4 px-5 mb-5 no-underline transition-all duration-200 group"
      style={{
        background: 'var(--navy-2)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-5">
        {/* Score ring */}
        <div
          className="relative w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: `conic-gradient(${barColor} ${score * 3.6}deg, var(--navy-4) ${score * 3.6}deg)`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--navy-2)' }}
          >
            <span
              className="text-[15px] font-bold"
              style={{ fontFamily: 'var(--font-playfair)', color: scoreColor }}
            >
              {score}%
            </span>
          </div>
        </div>

        {/* Text + bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
              Your Pension Picture
            </span>
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-dim)' }}>
              {completed.length}/{completed.length + pending.length} steps
            </span>
          </div>
          <ProgressBar percent={score} color={barColor} height={6} />
        </div>

        {/* Next step hint */}
        {nextStep && (
          <div className="shrink-0 hidden md:flex items-center gap-3 pl-4" style={{ borderLeft: '1px solid var(--border)' }}>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider font-medium mb-0.5" style={{ color: 'var(--text-dim)' }}>
                Next
              </div>
              <div className="text-[12px] font-medium max-w-[200px] truncate" style={{ color: 'var(--text-muted)' }}>
                {nextStep.icon} {nextStep.label}
              </div>
            </div>
            <span
              className="text-[12px] font-medium opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--gold)' }}
            >
              &rarr;
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
