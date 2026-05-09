'use client';

import Link from 'next/link';
import type { CompletenessStep } from '../types';

interface NextStepCardProps {
  step: CompletenessStep;
  /** Compact mode hides the why/how detail — used in lists */
  compact?: boolean;
}

export function NextStepCard({ step, compact = false }: NextStepCardProps) {
  const tierBadge = step.tier !== 'free' && (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider"
      style={{
        background: step.tier === 'pro' ? 'var(--blue-dim)' : 'rgba(236,72,153,0.12)',
        color: step.tier === 'pro' ? 'var(--blue)' : '#ec4899',
        border: `1px solid ${step.tier === 'pro' ? 'rgba(96,165,250,0.25)' : 'rgba(236,72,153,0.25)'}`,
      }}
    >
      {step.tier}
    </span>
  );

  if (compact) {
    return (
      <Link
        href={step.href}
        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline group"
        style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
          style={{ background: 'var(--navy-4)' }}
        >
          {step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium truncate" style={{ color: 'var(--text)' }}>
              {step.label}
            </span>
            {tierBadge}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
            {step.effort}
          </div>
        </div>
        <span className="text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }}>
          {step.cta} &rarr;
        </span>
      </Link>
    );
  }

  return (
    <div
      className="rounded-xl p-5 transition-all duration-200"
      style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg shrink-0"
          style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}
        >
          {step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
              {step.label}
            </span>
            {tierBadge}
          </div>
        </div>
      </div>

      {/* Why */}
      <div className="pl-[54px] mb-3">
        <div className="text-[11px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--gold)' }}>
          Why this matters
        </div>
        <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {step.why}
        </div>
      </div>

      {/* How */}
      <div className="pl-[54px] mb-4">
        <div className="text-[11px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--text-dim)' }}>
          How to do it
        </div>
        <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {step.how}
        </div>
      </div>

      {/* Footer */}
      <div className="pl-[54px] flex items-center gap-3">
        <Link
          href={step.href}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium no-underline transition-all"
          style={{ background: 'var(--gold)', color: 'var(--navy)' }}
        >
          {step.cta}
        </Link>
        <span className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--text-dim)' }}>
          &#9201; {step.effort}
        </span>
      </div>
    </div>
  );
}
