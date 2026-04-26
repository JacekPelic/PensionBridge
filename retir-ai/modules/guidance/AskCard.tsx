'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useChat } from '@/shared/chat/ChatProvider';
import { useTier } from '@/shared/TierProvider';
import type { DataAsk, AskPriority, Pillar } from './types';
import { stuckPromptFor } from './stuckPrompts';

type Tab = 'upload' | 'manual' | 'guide';

const PRIORITY_STYLE: Record<AskPriority, { bg: string; color: string; label: string }> = {
  high: { bg: 'var(--red-dim)', color: 'var(--red)', label: 'High priority' },
  medium: { bg: 'var(--amber-dim)', color: 'var(--amber)', label: 'Medium' },
  low: { bg: 'var(--navy-3)', color: 'var(--text-dim)', label: 'Low' },
};

const PILLAR_LABEL: Record<Pillar, string> = {
  p1: 'Pillar 1 \u00B7 State',
  p2: 'Pillar 2 \u00B7 Workplace',
  p3: 'Pillar 3 \u00B7 Private',
};

export function AskCard({ ask }: { ask: DataAsk }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<Tab>(
    ask.uploadable ? 'upload' : 'manual',
  );

  const priority = PRIORITY_STYLE[ask.priority];

  return (
    <div
      className="rounded-[12px] overflow-hidden transition-all"
      style={{
        background: 'var(--navy-3)',
        border: expanded
          ? '1px solid var(--gold-border, rgba(212,165,116,0.3))'
          : '1px solid var(--border)',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 p-3.5 cursor-pointer text-left"
        style={{ background: 'transparent', border: 'none' }}
      >
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center text-base shrink-0"
          style={{ background: 'var(--navy-4)' }}
        >
          {ask.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span
              className="text-[9.5px] font-semibold uppercase tracking-wider px-1.5 py-[2px] rounded-[4px]"
              style={{ background: priority.bg, color: priority.color }}
            >
              {priority.label}
            </span>
            <span
              className="text-[10px]"
              style={{ color: 'var(--text-dim)' }}
            >
              {PILLAR_LABEL[ask.pillar]}
            </span>
          </div>
          <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
            {ask.title}
          </div>
          <div className="text-[11.5px] leading-relaxed mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {ask.whyNow}
          </div>
          <div className="text-[11px] font-medium mt-1" style={{ color: 'var(--gold-light)' }}>
            {ask.impact}
          </div>
        </div>
        <span className="text-[12px] shrink-0 mt-1" style={{ color: 'var(--text-dim)' }}>
          {expanded ? '\u2715' : '\u25BE'}
        </span>
      </button>

      {expanded && (
        <div
          className="border-t animate-fade-in"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex gap-1 p-2" style={{ background: 'var(--navy-4)' }}>
            {ask.uploadable && (
              <TabButton active={tab === 'upload'} onClick={() => setTab('upload')}>
                Upload
              </TabButton>
            )}
            <TabButton active={tab === 'manual'} onClick={() => setTab('manual')}>
              Enter manually
            </TabButton>
            {ask.guide && (
              <TabButton active={tab === 'guide'} onClick={() => setTab('guide')}>
                How to get it
              </TabButton>
            )}
          </div>

          <div className="p-4">
            {tab === 'upload' && <UploadPane ask={ask} />}
            {tab === 'manual' && <ManualPane ask={ask} onDone={() => setExpanded(false)} />}
            {tab === 'guide' && ask.guide && <GuidePane ask={ask} />}
          </div>

          <StuckFooter ask={ask} />
        </div>
      )}
    </div>
  );
}

// ─── "Stuck? Ask your advisor" footer ──────────────────────────────
//
// When the self-service paths above don't work (the ask is literally
// impossible to retrieve through the documented routes), users can escalate
// to the chat advisor. Free tier sees a Pro teaser; Pro tier opens a
// contextualised chat seeded with the specific ask's sticking point.

function StuckFooter({ ask }: { ask: DataAsk }) {
  const { openWithSeed } = useChat();
  const { isPro } = useTier();

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 flex-wrap"
      style={{ background: 'var(--navy-4)', borderTop: '1px solid var(--border)' }}
    >
      <div className="flex-1 min-w-[200px]">
        <div
          className="text-[11px] font-semibold mb-0.5 flex items-center gap-1.5"
          style={{ color: 'var(--text)' }}
        >
          <span>{'\u{1F4AC}'}</span>
          {isPro ? 'Need a hand?' : 'Stuck? We can help.'}
        </div>
        <div className="text-[10.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {isPro
            ? 'Chat with your advisor for a personalised workaround \u2014 we\u2019ll pick up with the context of this step.'
            : 'Chat with an advisor who already knows your career. Unlimited questions are part of Pro; this preview shows you what they\u2019d say.'}
        </div>
      </div>
      <Button
        variant={isPro ? 'primary' : 'outline-gold'}
        onClick={() => openWithSeed(stuckPromptFor(ask.id))}
        className="shrink-0 text-[11.5px]"
      >
        {isPro ? 'Ask your advisor \u2192' : 'Preview the answer \u2192'}
      </Button>
    </div>
  );
}

// ─── Tab button ─────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11.5px] px-3 py-1.5 rounded-md cursor-pointer transition-all"
      style={{
        background: active ? 'var(--navy-2)' : 'transparent',
        border: active ? '1px solid var(--border)' : '1px solid transparent',
        color: active ? 'var(--text)' : 'var(--text-dim)',
        fontFamily: 'var(--font-sans)',
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
    </button>
  );
}

// ─── Upload ─────────────────────────────────────────────────────────

function UploadPane({ ask }: { ask: DataAsk }) {
  return (
    <div
      className="rounded-lg p-4 border border-dashed flex flex-col items-center gap-2 text-center"
      style={{ borderColor: 'var(--border)', background: 'var(--navy-2)' }}
    >
      <span className="text-2xl">{'\u{1F4CE}'}</span>
      <div className="text-[12.5px] font-medium" style={{ color: 'var(--text)' }}>
        Drop a PDF here or click to select
      </div>
      <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
        {ask.uploadHint ?? 'PDF, JPG or PNG'}
      </div>
      <div className="flex gap-2 mt-2">
        <Button variant="outline-gold" className="text-[11.5px]">
          Choose file
        </Button>
        <a
          href="/vault"
          className="text-[11px] underline-offset-2 self-center cursor-pointer"
          style={{ color: 'var(--text-dim)' }}
        >
          or manage in the Vault {'\u2192'}
        </a>
      </div>
      <div className="text-[10.5px] mt-1" style={{ color: 'var(--text-dim)' }}>
        Extraction runs on upload. Preview the parsed values before confirming.
      </div>
    </div>
  );
}

// ─── Manual entry ──────────────────────────────────────────────────

function ManualPane({ ask, onDone }: { ask: DataAsk; onDone: () => void }) {
  const form = ask.manualForm;

  return (
    <div>
      <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
        {form.title}
      </div>
      <div className="text-[11.5px] leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
        {form.description}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
        {form.fields.map((field) => (
          <div key={field.id}>
            <label
              className="text-[11px] font-medium block mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {field.label}
              {field.unit && (
                <span
                  className="ml-1 font-normal"
                  style={{ color: 'var(--text-dim)' }}
                >
                  ({field.unit})
                </span>
              )}
            </label>
            <input
              type={field.type === 'number' ? 'text' : field.type}
              inputMode={field.type === 'number' ? 'decimal' : undefined}
              placeholder={field.placeholder}
              className="w-full rounded-lg px-3 py-2 text-[12.5px] outline-none transition-all"
              style={{
                background: 'var(--navy-2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontFamily: field.type === 'number' ? 'var(--font-mono)' : 'var(--font-sans)',
              }}
            />
            <div
              className="text-[10px] mt-0.5 leading-snug"
              style={{ color: 'var(--text-dim)' }}
            >
              {field.hint}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Button variant="primary" onClick={onDone}>
          Save & recalculate
        </Button>
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Guide ──────────────────────────────────────────────────────────

const DIFFICULTY_STYLE = {
  easy: { label: 'Easy', color: 'var(--green)', bg: 'var(--green-dim)' },
  moderate: { label: 'Moderate', color: 'var(--amber)', bg: 'var(--amber-dim)' },
  hard: { label: 'May need help', color: 'var(--red)', bg: 'var(--red-dim)' },
} as const;

function GuidePane({ ask }: { ask: DataAsk }) {
  const guide = ask.guide!;
  const diff = DIFFICULTY_STYLE[guide.difficulty];

  return (
    <div>
      <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
        {guide.title}
      </div>
      <div className="flex items-center gap-3 flex-wrap mt-1 mb-4">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-dim)' }}>Timeline:</span> {guide.timeEstimate}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-dim)' }}>Language:</span> {guide.language}
        </span>
        <span
          className="text-[10px] font-medium px-2 py-[2px] rounded-full"
          style={{ background: diff.bg, color: diff.color }}
        >
          {diff.label}
        </span>
      </div>

      <div
        className="text-[10.5px] uppercase tracking-wider font-medium mb-2"
        style={{ color: 'var(--text-dim)' }}
      >
        Step by step
      </div>
      <div className="relative pl-5 mb-3">
        <div
          className="absolute left-[7px] top-1 bottom-3 w-px"
          style={{ background: 'var(--border)' }}
        />
        {guide.steps.map((step) => (
          <div key={step.num} className="relative pl-4 pb-4">
            <div
              className="absolute left-0 top-[3px] w-[15px] h-[15px] rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{
                background: 'var(--navy-2)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {step.num}
            </div>
            <div
              className="text-[12px] font-medium mb-0.5"
              style={{ color: 'var(--text)' }}
            >
              {step.text}
            </div>
            {step.detail && (
              <div
                className="text-[11px] leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {step.detail}
              </div>
            )}
          </div>
        ))}
      </div>

      {guide.altPath && (
        <div
          className="rounded-lg p-3 mb-3"
          style={{
            background: 'var(--amber-dim)',
            border: '1px solid rgba(217,119,6,0.2)',
          }}
        >
          <div
            className="text-[11px] font-semibold mb-2 flex items-center gap-1.5"
            style={{ color: 'var(--amber)' }}
          >
            <span>{'\u26A0'}</span> {guide.altPath.title}
          </div>
          <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {guide.altPath.options.map((option, i) => (
              <li
                key={i}
                className="text-[11px] leading-relaxed flex gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <span
                  className="shrink-0 mt-px font-bold"
                  style={{ color: 'var(--amber)' }}
                >
                  {i + 1}.
                </span>
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="rounded-lg p-3 mb-3"
        style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}
      >
        <div
          className="text-[10.5px] uppercase tracking-wider font-medium mb-2"
          style={{ color: 'var(--gold)' }}
        >
          Tips
        </div>
        <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
          {guide.tips.map((tip, i) => (
            <li
              key={i}
              className="text-[11px] leading-relaxed flex gap-2"
              style={{ color: 'var(--text-muted)' }}
            >
              <span className="shrink-0 mt-px" style={{ color: 'var(--gold)' }}>
                {'\u2022'}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
