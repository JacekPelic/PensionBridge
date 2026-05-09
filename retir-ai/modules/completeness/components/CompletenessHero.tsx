'use client';

import { useState } from 'react';
import { useCompleteness, CATEGORY_META } from '@/modules/completeness';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { NextStepCard } from './NextStepCard';
import type { StepCategory } from '../types';

/** Group completed steps by category for the summary row */
function useCategorySummary(completed: { category: StepCategory }[], pending: { category: StepCategory }[]) {
  const categories = ['profile', 'career', 'documents', 'insurance', 'family', 'planning'] as StepCategory[];
  return categories.map((cat) => {
    const done = completed.filter((s) => s.category === cat).length;
    const total = done + pending.filter((s) => s.category === cat).length;
    return { category: cat, done, total, ...CATEGORY_META[cat] };
  }).filter((c) => c.total > 0);
}

export function CompletenessHero() {
  const { score, completed, pending, nextStep } = useCompleteness();
  const [expanded, setExpanded] = useState(false);
  const categories = useCategorySummary(completed, pending);

  // Color shifts based on score
  const scoreColor = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--gold)' : 'var(--amber)';
  const barColor = score >= 80 ? 'var(--green)' : 'var(--gold)';

  return (
    <div id="completeness" className="mb-5">
      {/* Main card */}
      <div
        className="rounded-[18px] p-6 pb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--navy-3) 0%, var(--navy-4) 100%)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Glow accent */}
        <div
          className="absolute rounded-full"
          style={{
            top: -50, left: -50, width: 200, height: 200,
            background: `radial-gradient(circle, ${score >= 80 ? 'rgba(62,207,142,0.08)' : 'rgba(201,168,76,0.08)'} 0%, transparent 70%)`,
          }}
        />

        {/* Header row */}
        <div className="flex items-start justify-between mb-4 relative">
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-wider font-medium mb-1.5" style={{ color: scoreColor }}>
              Your Pension Picture
            </div>
            <div className="flex items-baseline gap-3">
              <span
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 42,
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1.1,
                }}
              >
                {score}%
              </span>
              <span className="text-[15px]" style={{ color: 'var(--text-muted)' }}>
                complete
              </span>
            </div>
            <div className="text-[12.5px] mt-1.5 max-w-[480px]" style={{ color: 'var(--text-muted)' }}>
              {score < 30 && "You've just started. Upload your first pension document to make a big jump."}
              {score >= 30 && score < 60 && `${completed.length} steps done, ${pending.length} to go. Your next step could unlock significant missing income.`}
              {score >= 60 && score < 90 && "Getting close. A few more documents and your picture will be nearly complete."}
              {score >= 90 && "Almost there — just a few finishing touches."}
            </div>
          </div>

          {/* Score ring — right side */}
          <div className="shrink-0 hidden sm:flex flex-col items-center gap-2">
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${barColor} ${score * 3.6}deg, var(--navy-4) ${score * 3.6}deg)`,
              }}
            >
              <div
                className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
                style={{ background: 'var(--navy-3)' }}
              >
                <span className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
                  {completed.length}/{completed.length + pending.length}
                </span>
              </div>
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>steps</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <ProgressBar percent={score} color={barColor} height={8} />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-1">
          {categories.map((cat) => {
            const allDone = cat.done === cat.total;
            return (
              <div
                key={cat.category}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
                style={{
                  background: allDone ? 'var(--green-dim)' : 'var(--navy-4)',
                  border: `1px solid ${allDone ? 'rgba(62,207,142,0.25)' : 'var(--border)'}`,
                  color: allDone ? 'var(--green)' : 'var(--text-dim)',
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: allDone ? 'rgba(62,207,142,0.15)' : 'var(--navy-3)',
                    color: allDone ? 'var(--green)' : 'var(--text-dim)',
                  }}
                >
                  {cat.done}/{cat.total}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pending steps list */}
        {pending.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-dim)' }}>
                Next Steps
              </div>
              {pending.length > 3 && (
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="text-[12px] font-medium cursor-pointer transition-all"
                  style={{ color: 'var(--gold)', background: 'none', border: 'none', padding: 0, fontFamily: 'var(--font-sans)' }}
                >
                  {expanded ? 'Show less \u25B4' : `Show all ${pending.length} \u25BE`}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {(expanded ? pending : pending.slice(0, 3)).map((step, i) => (
                <NextStepCard key={step.id} step={step} compact={i > 0} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
