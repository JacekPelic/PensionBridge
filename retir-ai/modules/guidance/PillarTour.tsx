'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useChat } from '@/shared/chat/ChatProvider';
import { useTier } from '@/shared/TierProvider';
import type { PartialPicture, Pillar2Plan, Pillar3Savings } from '@/modules/identity/picture-types';
import type { DataAsk } from './types';
import { deriveTour, type TourStep, type TourAskStep, type PhaseIntro } from './tour';
import { stuckPromptFor } from './stuckPrompts';

interface PillarTourProps {
  picture: PartialPicture;
  onUpdate: (patch: Partial<PartialPicture>) => void;
  onExit: () => void;
}

const PHASE_ICON: Record<string, string> = {
  p1: '\u{1F3DB}',   // classical building
  p2: '\u{1F3E2}',   // office building
  p3: '\u{1F4B0}',   // money bag
};

const PHASE_COLOR: Record<string, string> = {
  p1: 'var(--gold)',
  p2: 'var(--blue, #5b8def)',
  p3: 'var(--green)',
};

export function PillarTour({ picture, onUpdate, onExit }: PillarTourProps) {
  const steps = useMemo(() => deriveTour(picture), [picture]);
  const currentIndex = picture.tour?.currentStepIndex ?? 0;
  const safeIndex = Math.min(Math.max(0, currentIndex), steps.length - 1);
  const step = steps[safeIndex];

  const goto = (idx: number) => {
    const bounded = Math.max(0, Math.min(idx, steps.length - 1));
    onUpdate({
      tour: {
        active: true,
        currentStepIndex: bounded,
        everCompleted: picture.tour?.everCompleted ?? false,
      },
    });
  };
  const next = () => goto(safeIndex + 1);
  const prev = () => goto(safeIndex - 1);

  const finish = () => {
    onUpdate({
      tour: {
        active: false,
        currentStepIndex: 0,
        everCompleted: true,
      },
    });
  };

  return (
    <div
      className="rounded-[14px] overflow-hidden flex flex-col"
      style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <TourHeader
        steps={steps}
        currentIndex={safeIndex}
        onExit={onExit}
      />

      {/* Body */}
      <div className="p-6 lg:p-7 min-h-[360px]">
        {step.kind === 'intro' && <IntroStep step={step} onContinue={next} />}
        {step.kind === 'ask' && (
          <AskStep
            step={step}
            picture={picture}
            onFulfill={(updates) => {
              onUpdate(updates);
              next();
            }}
            onSkip={() => {
              onUpdate({
                askStatus: {
                  ...(picture.askStatus ?? {}),
                  [step.ask.id]: 'skipped',
                },
              });
              next();
            }}
          />
        )}
        {step.kind === 'summary' && <SummaryStep picture={picture} onFinish={finish} />}
      </div>

      {/* Footer nav */}
      <div
        className="flex items-center justify-between gap-3 px-6 py-4"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--navy-3)' }}
      >
        <Button
          variant="ghost"
          onClick={prev}
          disabled={safeIndex === 0}
          className="text-[11.5px]"
        >
          {'\u2190'} Back
        </Button>
        <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
          Step {safeIndex + 1} of {steps.length}
        </span>
        <Button variant="ghost" onClick={onExit} className="text-[11.5px]">
          Exit tour
        </Button>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────

function TourHeader({
  steps,
  currentIndex,
  onExit,
}: {
  steps: TourStep[];
  currentIndex: number;
  onExit: () => void;
}) {
  // Build the phase progress indicator (3 pills: p1, p2, p3)
  const phases: Array<'p1' | 'p2' | 'p3'> = ['p1', 'p2', 'p3'];
  const currentStep = steps[currentIndex];
  const currentPhase = currentStep?.kind === 'summary' ? null : currentStep?.phase;

  const phaseStatus = (phase: 'p1' | 'p2' | 'p3'): 'done' | 'current' | 'upcoming' => {
    // Find the last step of this phase
    const indexes = steps
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => s.kind !== 'summary' && s.phase === phase);
    if (indexes.length === 0) return 'upcoming';
    const lastIdx = indexes[indexes.length - 1].i;
    if (currentIndex > lastIdx) return 'done';
    if (currentPhase === phase) return 'current';
    return 'upcoming';
  };

  return (
    <div
      className="flex items-center gap-3 px-6 py-4 flex-wrap"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--navy-2)' }}
    >
      <div
        className="text-[10.5px] uppercase tracking-[0.14em] font-semibold shrink-0"
        style={{ color: 'var(--gold-light)' }}
      >
        Picture Tour
      </div>
      <div className="flex items-center gap-1.5 flex-1">
        {phases.map((phase) => {
          const status = phaseStatus(phase);
          const color = PHASE_COLOR[phase];
          return (
            <div
              key={phase}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{
                background:
                  status === 'current'
                    ? 'var(--navy-3)'
                    : status === 'done'
                      ? 'transparent'
                      : 'transparent',
                border:
                  status === 'current'
                    ? `1px solid ${color}`
                    : '1px solid var(--border)',
                color:
                  status === 'done'
                    ? 'var(--text-dim)'
                    : status === 'current'
                      ? color
                      : 'var(--text-dim)',
                opacity: status === 'upcoming' ? 0.6 : 1,
              }}
            >
              <span>{PHASE_ICON[phase]}</span>
              <span>{phaseLabel(phase)}</span>
              {status === 'done' && <span style={{ color: 'var(--green)' }}>{'\u2713'}</span>}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onExit}
        className="text-[11px] shrink-0 cursor-pointer"
        style={{ color: 'var(--text-dim)' }}
      >
        Close {'\u2715'}
      </button>
    </div>
  );
}

function phaseLabel(phase: 'p1' | 'p2' | 'p3'): string {
  if (phase === 'p1') return 'State';
  if (phase === 'p2') return 'Workplace';
  return 'Personal';
}

// ─── Intro step ──────────────────────────────────────────────────────

function IntroStep({
  step,
  onContinue,
}: {
  step: PhaseIntro;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-[14px] flex items-center justify-center text-3xl shrink-0"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
        >
          {PHASE_ICON[step.phase]}
        </div>
        <div>
          <div
            className="text-[10.5px] uppercase tracking-[0.14em] font-semibold mb-1"
            style={{ color: 'var(--gold-light)' }}
          >
            Pillar {step.phase === 'p1' ? '1' : step.phase === 'p2' ? '2' : '3'}
          </div>
          <h2
            className="text-[24px] font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            {step.title}
          </h2>
        </div>
      </div>
      <p
        className="text-[14px] leading-relaxed max-w-[640px]"
        style={{ color: 'var(--text-muted)' }}
      >
        {step.body}
      </p>
      <div>
        <Button variant="primary" onClick={onContinue}>
          Continue {'\u2192'}
        </Button>
      </div>
    </div>
  );
}

// ─── Ask step ────────────────────────────────────────────────────────

type CapturePath = 'upload' | 'manual';

function AskStep({
  step,
  picture,
  onFulfill,
  onSkip,
}: {
  step: TourAskStep;
  picture: PartialPicture;
  onFulfill: (updates: Partial<PartialPicture>) => void;
  onSkip: () => void;
}) {
  const { ask, phase } = step;
  const [path, setPath] = useState<CapturePath>(ask.uploadable ? 'upload' : 'manual');
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-[12px] flex items-center justify-center text-2xl shrink-0"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
        >
          {ask.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="text-[9.5px] font-semibold uppercase tracking-wider px-1.5 py-[2px] rounded-[4px]"
              style={{
                background: 'var(--navy-3)',
                color: PHASE_COLOR[phase],
                border: `1px solid ${PHASE_COLOR[phase]}33`,
              }}
            >
              {phase === 'p1' ? 'Pillar 1' : phase === 'p2' ? 'Pillar 2' : 'Pillar 3'}
            </span>
          </div>
          <h2
            className="text-[20px] font-semibold leading-tight mb-1.5"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            {ask.title}
          </h2>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {ask.whyNow}
          </p>
          <div className="text-[11.5px] font-medium mt-2" style={{ color: 'var(--gold-light)' }}>
            {ask.impact}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {ask.uploadable && (
          <TabButton active={path === 'upload'} onClick={() => setPath('upload')}>
            Upload document
          </TabButton>
        )}
        <TabButton active={path === 'manual'} onClick={() => setPath('manual')}>
          Enter manually
        </TabButton>
        {ask.guide && (
          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className="ml-auto text-[11.5px] px-3 py-1.5 rounded-md cursor-pointer"
            style={{
              background: showGuide ? 'var(--navy-3)' : 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-dim)',
            }}
          >
            {showGuide ? 'Hide guide' : 'How to get it'}
          </button>
        )}
      </div>

      {/* Content */}
      {showGuide && ask.guide && <GuideInline ask={ask} />}
      {!showGuide && path === 'upload' && <UploadStub ask={ask} />}
      {!showGuide && path === 'manual' && (
        <ManualEntry ask={ask} picture={picture} onFulfill={onFulfill} />
      )}

      {/* Skip link */}
      <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          type="button"
          onClick={onSkip}
          className="text-[12px] underline-offset-2 cursor-pointer"
          style={{ color: 'var(--text-dim)' }}
        >
          Skip for now
        </button>
        <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
          You can come back to this anytime from the asks list.
        </span>
      </div>
    </div>
  );
}

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
        background: active ? 'var(--navy-3)' : 'transparent',
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

// ─── Upload stub ────────────────────────────────────────────────────

function UploadStub({ ask }: { ask: DataAsk }) {
  return (
    <div
      className="rounded-lg p-5 border border-dashed flex flex-col items-center gap-2 text-center"
      style={{ borderColor: 'var(--border)', background: 'var(--navy-3)' }}
    >
      <span className="text-3xl">{'\u{1F4CE}'}</span>
      <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
        Drop a PDF here or click to select
      </div>
      <div className="text-[11.5px]" style={{ color: 'var(--text-dim)' }}>
        {ask.uploadHint ?? 'PDF, JPG or PNG'}
      </div>
      <div className="text-[11px] mt-2" style={{ color: 'var(--text-dim)' }}>
        Extraction will run on upload. Review the parsed values before confirming.
      </div>
      <div className="text-[11px] mt-1" style={{ color: 'var(--amber)' }}>
        Note: upload capture isn’t wired yet — use manual entry for now.
      </div>
    </div>
  );
}

// ─── Manual entry — the real data capture path ─────────────────────

function ManualEntry({
  ask,
  picture,
  onFulfill,
}: {
  ask: DataAsk;
  picture: PartialPicture;
  onFulfill: (updates: Partial<PartialPicture>) => void;
}) {
  const form = ask.manualForm;
  const [values, setValues] = useState<Record<string, string>>(() =>
    prefillFromPicture(ask, picture),
  );

  const save = () => {
    const updates = buildUpdates(ask, values, picture);
    onFulfill(updates);
  };

  return (
    <div>
      <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
        {form.title}
      </div>
      <div className="text-[11.5px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
        {form.description}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        {form.fields.map((field) => (
          <div key={field.id}>
            <label className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
              {field.label}
              {field.unit && (
                <span className="ml-1 font-normal" style={{ color: 'var(--text-dim)' }}>
                  ({field.unit})
                </span>
              )}
            </label>
            <input
              type={field.type === 'number' ? 'text' : field.type}
              inputMode={field.type === 'number' ? 'decimal' : undefined}
              placeholder={field.placeholder}
              value={values[field.id] ?? ''}
              onChange={(e) =>
                setValues((v) => ({ ...v, [field.id]: e.target.value }))
              }
              className="w-full rounded-lg px-3 py-2 text-[13px] outline-none"
              style={{
                background: 'var(--navy-3)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontFamily: field.type === 'number' ? 'var(--font-mono)' : 'var(--font-sans)',
              }}
            />
            <div className="text-[10px] mt-0.5 leading-snug" style={{ color: 'var(--text-dim)' }}>
              {field.hint}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Button variant="primary" onClick={save}>
          Save &amp; continue {'\u2192'}
        </Button>
      </div>

      <StuckPrompt ask={ask} />
    </div>
  );
}

/** Inline "Stuck?" CTA shown under the manual entry form during the tour. */
function StuckPrompt({ ask }: { ask: DataAsk }) {
  const { openWithSeed } = useChat();
  const { isPro } = useTier();

  return (
    <div
      className="mt-4 pt-3 flex items-center gap-3 flex-wrap"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="flex-1 min-w-[200px] text-[11px]" style={{ color: 'var(--text-muted)' }}>
        <span className="mr-1">{'\u{1F4AC}'}</span>
        {isPro
          ? 'Can\u2019t get this document through any route? Your advisor can suggest a workaround \u2014 we\u2019ll open the chat with this step\u2019s context.'
          : 'Can\u2019t get this document through any route? See how an advisor would guide you \u2014 full chat is part of Pro.'}
      </div>
      <button
        type="button"
        onClick={() => openWithSeed(stuckPromptFor(ask.id))}
        className="text-[11.5px] font-medium px-3 py-1.5 rounded-md cursor-pointer transition-all shrink-0"
        style={{
          background: isPro ? 'var(--gold-dim)' : 'transparent',
          border: '1px solid var(--gold-border, rgba(212,165,116,0.3))',
          color: 'var(--gold-light)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {isPro ? 'Ask your advisor' : 'Preview the answer'} {'\u2192'}
      </button>
    </div>
  );
}

/** Pre-fill manual form with existing values from the picture, if any. */
function prefillFromPicture(
  ask: DataAsk,
  picture: PartialPicture,
): Record<string, string> {
  const out: Record<string, string> = {};

  if (ask.pillar === 'p2') {
    const plan = picture.pillar2Plans?.find((p) => p.askId === ask.id);
    if (plan?.rawValues) {
      for (const [k, v] of Object.entries(plan.rawValues)) {
        out[k] = String(v);
      }
    }
  } else if (ask.pillar === 'p3' && ask.id === 'private-savings') {
    const s = picture.pillar3Savings;
    if (s) {
      out.currentBalance = String(s.currentBalance);
      out.monthlyContribution = String(s.monthlyContribution);
      out.growthAssumption = String(s.growthAssumption);
    }
  }

  return out;
}

/** Translate manual form values into PartialPicture updates. */
function buildUpdates(
  ask: DataAsk,
  values: Record<string, string>,
  picture: PartialPicture,
): Partial<PartialPicture> {
  const askStatus = {
    ...(picture.askStatus ?? {}),
    [ask.id]: 'fulfilled' as const,
  };

  if (ask.pillar === 'p2') {
    const plan = translateP2(ask, values);
    if (!plan) return { askStatus };
    const others = (picture.pillar2Plans ?? []).filter((p) => p.askId !== ask.id);
    return {
      askStatus,
      pillar2Plans: [...others, plan],
    };
  }

  if (ask.pillar === 'p3') {
    const savings = translateP3(ask, values, picture);
    if (!savings) return { askStatus };
    return { askStatus, pillar3Savings: savings };
  }

  // P1 values currently inform sharpness/badges only — the estimator doesn't
  // use them yet. Just mark the ask fulfilled.
  return { askStatus };
}

/**
 * Map a P3 ask's country-specific fields onto the picture's aggregate
 * Pillar3Savings bucket. Each ask writes fresh — filling multiple P3 asks
 * overwrites rather than sums (tech debt: eventually turn Pillar3Savings into a
 * per-product list like Pillar2Plans).
 *
 * Currency: CHF-denominated values (3a, Freizügigkeit) are converted to EUR.
 */
function translateP3(
  ask: DataAsk,
  values: Record<string, string>,
  picture: PartialPicture,
): Pillar3Savings | null {
  const existing = picture.pillar3Savings;
  const growth =
    parseNumber(values.growthAssumption) ?? existing?.growthAssumption ?? 4;

  if (ask.id === 'private-savings') {
    return {
      currentBalance: parseNumber(values.currentBalance) ?? 0,
      monthlyContribution: parseNumber(values.monthlyContribution) ?? 0,
      growthAssumption: growth,
    };
  }

  if (ask.id === 'fr-per') {
    const balance = parseNumber(values.currentBalance);
    const monthly = parseNumber(values.monthlyContribution);
    if (balance == null && monthly == null) return null;
    return {
      currentBalance: balance ?? 0,
      monthlyContribution: monthly ?? 0,
      growthAssumption: growth,
    };
  }

  if (ask.id === 'ch-3a') {
    const balanceChf = parseNumber(values.currentBalance);
    const annualChf = parseNumber(values.annualContribution);
    if (balanceChf == null && annualChf == null) return null;
    return {
      currentBalance: Math.round((balanceChf ?? 0) * CHF_TO_EUR),
      monthlyContribution: Math.round(((annualChf ?? 0) / 12) * CHF_TO_EUR),
      growthAssumption: growth,
    };
  }

  if (ask.id === 'lu-prevoyance') {
    const balance = parseNumber(values.currentBalance);
    const annual = parseNumber(values.annualContribution);
    if (balance == null && annual == null) return null;
    return {
      currentBalance: balance ?? 0,
      monthlyContribution: Math.round((annual ?? 0) / 12),
      growthAssumption: growth,
    };
  }

  return null;
}

/**
 * Rough translation from a P2 ask's form values to a monthly EUR figure.
 * These are illustrative — real engines would be more nuanced.
 */
function translateP2(ask: DataAsk, values: Record<string, string>): Pillar2Plan | null {
  const rawValues: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(values)) {
    const n = parseNumber(v);
    rawValues[k] = n != null ? n : v;
  }

  let monthlyEur = 0;
  let country: Pillar2Plan['country'] = 'LU';
  let label = ask.title;

  if (ask.id === 'ch-bvg') {
    country = 'CH';
    label = 'Swiss BVG (Vorsorgeausweis)';
    const annual = parseNumber(values.projectedAnnuity);
    if (annual != null && annual > 0) {
      monthlyEur = Math.round((annual / 12) * CHF_TO_EUR);
    } else {
      const capital = parseNumber(values.vestedBenefits);
      const rate = parseNumber(values.conversionRate);
      if (capital != null && rate != null) {
        monthlyEur = Math.round(((capital * rate) / 100 / 12) * CHF_TO_EUR);
      }
    }
  } else if (ask.id === 'ch-freizugigkeit') {
    country = 'CH';
    label = 'Swiss vested benefits (Freiz\u00fcgigkeit)';
    // Vested benefits are typically taken as a lump sum on retirement.
    // For the monthly-income picture, amortise over ~20 years of retirement.
    const capital = parseNumber(values.currentBalance);
    if (capital != null && capital > 0) {
      monthlyEur = Math.round(((capital / (20 * 12)) * CHF_TO_EUR));
    }
  } else if (ask.id === 'fr-agirc-arrco') {
    country = 'FR';
    label = 'French Agirc-Arrco';
    const annual = parseNumber(values.projectedAnnual);
    if (annual != null) monthlyEur = Math.round(annual / 12);
  } else if (ask.id === 'lu-rcp') {
    country = 'LU';
    label = 'Luxembourg RCP (employer pension)';
    // LU RCP typically pays as a lump sum. If projected is given use it;
    // otherwise grow vested capital ~50% to retirement and amortise over 20y.
    const projected = parseNumber(values.projectedLumpSum);
    const vested = parseNumber(values.vestedCapital);
    if (projected != null && projected > 0) {
      monthlyEur = Math.round(projected / (20 * 12));
    } else if (vested != null && vested > 0) {
      monthlyEur = Math.round((vested * 1.5) / (20 * 12));
    }
  }

  if (monthlyEur <= 0) return null;

  return {
    askId: ask.id,
    country,
    label,
    monthlyEur,
    rawValues,
  };
}

const CHF_TO_EUR = 0.95;

function parseNumber(v: string | undefined): number | null {
  if (v == null) return null;
  const cleaned = v.replace(/[^\d.-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

// ─── Guide pane (simplified, inline in tour) ───────────────────────

function GuideInline({ ask }: { ask: DataAsk }) {
  const g = ask.guide!;
  return (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
    >
      <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
        {g.title}
      </div>
      <div className="flex items-center gap-3 flex-wrap text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
        <span>
          <span style={{ color: 'var(--text-dim)' }}>Timeline:</span> {g.timeEstimate}
        </span>
        <span>
          <span style={{ color: 'var(--text-dim)' }}>Language:</span> {g.language}
        </span>
        <span
          className="px-2 py-[2px] rounded-full font-medium"
          style={{
            background:
              g.difficulty === 'easy'
                ? 'var(--green-dim)'
                : g.difficulty === 'moderate'
                  ? 'var(--amber-dim)'
                  : 'var(--red-dim)',
            color:
              g.difficulty === 'easy'
                ? 'var(--green)'
                : g.difficulty === 'moderate'
                  ? 'var(--amber)'
                  : 'var(--red)',
          }}
        >
          {g.difficulty === 'easy'
            ? 'Easy'
            : g.difficulty === 'moderate'
              ? 'Moderate'
              : 'May need help'}
        </span>
      </div>
      <div className="relative pl-5">
        <div
          className="absolute left-[7px] top-1 bottom-3 w-px"
          style={{ background: 'var(--border)' }}
        />
        {g.steps.map((s) => (
          <div key={s.num} className="relative pl-4 pb-3">
            <div
              className="absolute left-0 top-[3px] w-[15px] h-[15px] rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{
                background: 'var(--navy-2)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {s.num}
            </div>
            <div className="text-[12px] font-medium mb-0.5" style={{ color: 'var(--text)' }}>
              {s.text}
            </div>
            {s.detail && (
              <div className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {s.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Summary step ────────────────────────────────────────────────────

function SummaryStep({
  picture,
  onFinish,
}: {
  picture: PartialPicture;
  onFinish: () => void;
}) {
  const askStatus = picture.askStatus ?? {};
  const fulfilledCount = Object.values(askStatus).filter((s) => s === 'fulfilled').length;
  const skippedCount = Object.values(askStatus).filter((s) => s === 'skipped').length;
  const p2Count = picture.pillar2Plans?.length ?? 0;
  const hasP3 = picture.pillar3Savings != null;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-[14px] flex items-center justify-center text-3xl shrink-0"
          style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border, rgba(212,165,116,0.3))' }}
        >
          {'\u2728'}
        </div>
        <div>
          <div
            className="text-[10.5px] uppercase tracking-[0.14em] font-semibold mb-1"
            style={{ color: 'var(--gold-light)' }}
          >
            Tour complete
          </div>
          <h2
            className="text-[24px] font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            Your 3-pillar picture is in shape.
          </h2>
        </div>
      </div>

      <p
        className="text-[14px] leading-relaxed max-w-[640px]"
        style={{ color: 'var(--text-muted)' }}
      >
        You’ve walked through state, workplace, and personal savings. Bands that were
        guessed are now grounded in your own figures. You can revisit any step from the asks list.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SummaryStat label="Fulfilled" value={fulfilledCount} color="var(--green)" />
        <SummaryStat
          label="Workplace plans"
          value={p2Count}
          color="var(--blue, #5b8def)"
        />
        <SummaryStat
          label="Personal savings"
          value={hasP3 ? 'Set' : '—'}
          color={hasP3 ? 'var(--green)' : 'var(--text-dim)'}
        />
      </div>

      {skippedCount > 0 && (
        <div
          className="rounded-lg p-3 text-[11.5px] leading-relaxed"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          You skipped {skippedCount} item{skippedCount === 1 ? '' : 's'}. They’re waiting for you on the asks list
          whenever you want to come back.
        </div>
      )}

      <div>
        <Button variant="primary" onClick={onFinish}>
          Finish {'\u2192'}
        </Button>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg p-3 text-center"
      style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
    >
      <div
        className="text-[22px] font-semibold"
        style={{ fontFamily: 'var(--font-playfair)', color }}
      >
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wider mt-1" style={{ color: 'var(--text-dim)' }}>
        {label}
      </div>
    </div>
  );
}
