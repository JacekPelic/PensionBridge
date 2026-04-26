'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { PicturePreview } from './PicturePreview';
import { QuestionCard } from './QuestionCard';
import { estimate } from './estimate';
import { nextQuestion, QUESTIONS } from './questions';
import { usePicture } from '@/modules/identity/PictureProvider';
import type { MaritalStatus, PartialPicture } from '@/modules/identity/picture-types';
import { AsksStack, deriveAsks, PillarTour } from '@/modules/guidance';

/**
 * The picture surface — the always-on home view.
 *
 * Layout: picture strip on top (full width), then either a centered
 * opening question or a two-section refinement area (quick edits row +
 * full-width asks stack).
 */
export function PictureSurface() {
  const { picture, mode, updatePicture, startFresh, loadMock } = usePicture();

  const currentEstimate = useMemo(() => estimate(picture), [picture]);
  const currentQuestion = useMemo(() => nextQuestion(picture), [picture]);

  const answeredCount = QUESTIONS.filter((q) => q.isAnswered(picture)).length;
  const totalCount = QUESTIONS.length;
  const asks = useMemo(() => deriveAsks(picture), [picture]);
  const tourActive = picture.tour?.active === true;
  const tourEverCompleted = picture.tour?.everCompleted === true;

  const startTour = () => {
    updatePicture({
      tour: {
        active: true,
        currentStepIndex: 0,
        everCompleted: picture.tour?.everCompleted ?? false,
      },
    });
  };

  const exitTour = () => {
    updatePicture({
      tour: {
        active: false,
        currentStepIndex: picture.tour?.currentStepIndex ?? 0,
        everCompleted: picture.tour?.everCompleted ?? false,
      },
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {mode === 'mock' && !tourActive && <DemoBanner onStartFresh={startFresh} />}

      <PicturePreview estimate={currentEstimate} />

      {currentQuestion ? (
        <OpeningSection totalCount={totalCount} answeredCount={answeredCount}>
          <QuestionCard
            question={currentQuestion}
            picture={picture}
            onAnswer={updatePicture}
          />
        </OpeningSection>
      ) : tourActive ? (
        <PillarTour picture={picture} onUpdate={updatePicture} onExit={exitTour} />
      ) : (
        <>
          <CompletionHeader picture={picture} />
          <TourCta
            everCompleted={tourEverCompleted}
            pausedAt={picture.tour?.currentStepIndex ?? 0}
            onStart={startTour}
          />
          <QuickEditsRow picture={picture} onUpdate={updatePicture} />
          <AsksSection asks={asks} />
          <FooterActions
            mode={mode}
            onLoadMock={loadMock}
            onStartFresh={startFresh}
          />
        </>
      )}
    </div>
  );
}

// ─── Tour CTA — entry point to the guided walkthrough ──────────────

function TourCta({
  everCompleted,
  pausedAt,
  onStart,
}: {
  everCompleted: boolean;
  pausedAt: number;
  onStart: () => void;
}) {
  const isResume = !everCompleted && pausedAt > 0;
  const isDone = everCompleted;

  return (
    <div
      className="rounded-[14px] p-5 flex items-center gap-4 flex-wrap"
      style={{
        background: isDone ? 'var(--navy-2)' : 'var(--gold-dim)',
        border: isDone
          ? '1px solid var(--border)'
          : '1px solid var(--gold-border, rgba(212,165,116,0.3))',
      }}
    >
      <div
        className="w-11 h-11 rounded-[12px] flex items-center justify-center text-xl shrink-0"
        style={{
          background: isDone ? 'var(--navy-3)' : 'var(--navy-2)',
          border: '1px solid var(--border)',
        }}
      >
        {isDone ? '\u2728' : '\u{1F9ED}'}
      </div>
      <div className="flex-1 min-w-[220px]">
        <div
          className="text-[10.5px] uppercase tracking-[0.14em] font-semibold mb-1"
          style={{ color: isDone ? 'var(--text-dim)' : 'var(--gold-light)' }}
        >
          {isDone ? 'Tour complete' : isResume ? 'Resume where you left off' : 'Complete your picture'}
        </div>
        <div className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
          {isDone
            ? 'Run the tour again to refresh any figures.'
            : isResume
              ? 'Pick up where you left off in the guided walkthrough.'
              : 'State, workplace, and personal \u2014 the three sources of retirement income, about 10 minutes.'}
        </div>
        {!isDone && (
          <div className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
            One step at a time. Skip anything you don’t have on hand.
          </div>
        )}
      </div>
      <Button
        variant={isDone ? 'ghost' : 'primary'}
        onClick={onStart}
        className="shrink-0"
      >
        {isResume ? 'Resume tour' : isDone ? 'Run tour again' : 'Start the tour'} {'\u2192'}
      </Button>
    </div>
  );
}

// ─── Demo banner ────────────────────────────────────────────────────

function DemoBanner({ onStartFresh }: { onStartFresh: () => void }) {
  return (
    <div
      className="rounded-[12px] p-4 flex items-center gap-3"
      style={{
        background: 'var(--gold-dim)',
        border: '1px solid var(--gold-border, rgba(212,165,116,0.3))',
      }}
    >
      <span className="text-lg shrink-0">{'\u2605'}</span>
      <div className="flex-1 min-w-0">
        <div
          className="text-[12.5px] font-semibold mb-0.5"
          style={{ color: 'var(--gold-light)' }}
        >
          Viewing the demo picture
        </div>
        <div
          className="text-[11px] leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          Mats Karlsson — a sample multi-country career. Start fresh to build your own.
        </div>
      </div>
      <Button
        variant="outline-gold"
        onClick={onStartFresh}
        className="shrink-0 text-[11.5px]"
      >
        Start fresh
      </Button>
    </div>
  );
}

// ─── Opening — centered question + progress ────────────────────────

function OpeningSection({
  totalCount,
  answeredCount,
  children,
}: {
  totalCount: number;
  answeredCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[640px]">{children}</div>
      <div className="w-full max-w-[640px]">
        <ProgressBar answered={answeredCount} total={totalCount} />
      </div>
    </div>
  );
}

function ProgressBar({ answered, total }: { answered: number; total: number }) {
  return (
    <div
      className="rounded-lg p-3 flex items-center gap-3"
      style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}
    >
      <span
        className="text-[10.5px] uppercase tracking-[0.14em] font-semibold"
        style={{ color: 'var(--text-dim)' }}
      >
        Opening
      </span>
      <div className="flex-1 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-all"
            style={{
              background: i < answered ? 'var(--gold)' : 'var(--navy-3)',
            }}
          />
        ))}
      </div>
      <span
        className="text-[11px] tabular-nums"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {answered}/{total}
      </span>
    </div>
  );
}

// ─── Completion header ──────────────────────────────────────────────

function CompletionHeader({ picture }: { picture: PartialPicture }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <div
          className="text-[10.5px] uppercase tracking-[0.14em] font-semibold mb-1"
          style={{ color: 'var(--gold-light)' }}
        >
          Opening complete
        </div>
        <h2
          className="text-[20px] leading-tight font-semibold"
          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
        >
          {picture.firstName ? `Nice work, ${picture.firstName}.` : 'Nice work.'}
          {' '}
          <span style={{ color: 'var(--text-muted)' }}>Sharpen from here.</span>
        </h2>
      </div>
    </div>
  );
}

// ─── Quick edits — 3 compact cards in a row ────────────────────────

function QuickEditsRow({
  picture,
  onUpdate,
}: {
  picture: PartialPicture;
  onUpdate: (patch: Partial<PartialPicture>) => void;
}) {
  return (
    <div>
      <div
        className="text-[10.5px] uppercase tracking-[0.14em] font-semibold mb-2"
        style={{ color: 'var(--text-dim)' }}
      >
        Quick edits
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <NameRefinement
          firstName={picture.firstName}
          lastName={picture.lastName}
          onUpdate={onUpdate}
        />
        <MaritalStatusRefinement
          value={picture.maritalStatus}
          onUpdate={onUpdate}
        />
        <NumberRefinement
          label="Target retirement age"
          unit="years"
          value={picture.targetRetirementAge}
          placeholder="65"
          min={55}
          max={75}
          presets={[60, 62, 65, 67, 70]}
          onSave={(v) => onUpdate({ targetRetirementAge: v })}
        />
        <NumberRefinement
          label="Monthly income goal"
          unit={'\u20AC / month'}
          value={picture.monthlyIncomeGoal}
          placeholder="5,000"
          min={500}
          max={20000}
          step={100}
          presets={[3000, 4000, 5000, 6000, 8000]}
          onSave={(v) => onUpdate({ monthlyIncomeGoal: v })}
        />
      </div>
    </div>
  );
}

// ─── Asks — full width ──────────────────────────────────────────────

function AsksSection({ asks }: { asks: ReturnType<typeof deriveAsks> }) {
  return (
    <div>
      <AsksStack asks={asks} />
    </div>
  );
}

// ─── Footer actions ────────────────────────────────────────────────

function FooterActions({
  mode,
  onLoadMock,
  onStartFresh,
}: {
  mode: 'mock' | 'user';
  onLoadMock: () => void;
  onStartFresh: () => void;
}) {
  return (
    <div
      className="flex items-center gap-2 text-[11px] pt-3"
      style={{ color: 'var(--text-dim)', borderTop: '1px solid var(--border)' }}
    >
      {mode === 'user' && (
        <>
          <button
            type="button"
            onClick={onLoadMock}
            className="underline-offset-2 cursor-pointer"
            style={{ color: 'var(--text-dim)' }}
          >
            View demo picture
          </button>
          <span>{'\u00B7'}</span>
        </>
      )}
      <button
        type="button"
        onClick={onStartFresh}
        className="underline-offset-2 cursor-pointer"
        style={{ color: 'var(--text-dim)' }}
      >
        Start over
      </button>
    </div>
  );
}

// ─── Inline refinement editors ──────────────────────────────────────

function RefinementCard({
  label,
  valueDisplay,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  valueDisplay: string;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[12px] overflow-hidden"
      style={{
        background: 'var(--navy-2)',
        border: expanded
          ? '1px solid var(--gold-border, rgba(212,165,116,0.3))'
          : '1px solid var(--border)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3.5 cursor-pointer text-left"
        style={{ background: 'transparent', border: 'none' }}
      >
        <div className="flex-1 min-w-0">
          <div
            className="text-[10.5px] uppercase tracking-[0.14em] font-semibold mb-0.5"
            style={{ color: 'var(--text-dim)' }}
          >
            {label}
          </div>
          <div
            className="text-[13px] font-medium truncate"
            style={{ color: 'var(--text)' }}
          >
            {valueDisplay}
          </div>
        </div>
        <span
          className="text-[11.5px] shrink-0"
          style={{ color: expanded ? 'var(--gold-light)' : 'var(--text-dim)' }}
        >
          {expanded ? '\u2715' : 'Edit'}
        </span>
      </button>
      {expanded && (
        <div className="px-3.5 pb-3.5 pt-1 animate-fade-in">{children}</div>
      )}
    </div>
  );
}

function NameRefinement({
  firstName,
  lastName,
  onUpdate,
}: {
  firstName?: string;
  lastName?: string;
  onUpdate: (patch: Partial<PartialPicture>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [first, setFirst] = useState(firstName ?? '');
  const [last, setLast] = useState(lastName ?? '');

  const display =
    firstName || lastName
      ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
      : 'Add your name';

  const save = () => {
    onUpdate({
      firstName: first.trim() || undefined,
      lastName: last.trim() || undefined,
    });
    setExpanded(false);
  };

  return (
    <RefinementCard
      label="Your name"
      valueDisplay={display}
      expanded={expanded}
      onToggle={() => setExpanded((v) => !v)}
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          placeholder="First"
          className="flex-1 min-w-0 rounded-md px-2.5 py-2 text-[13px] outline-none"
          style={{
            background: 'var(--navy-3)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-sans)',
          }}
        />
        <input
          type="text"
          value={last}
          onChange={(e) => setLast(e.target.value)}
          placeholder="Last"
          className="flex-1 min-w-0 rounded-md px-2.5 py-2 text-[13px] outline-none"
          style={{
            background: 'var(--navy-3)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-sans)',
          }}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <Button variant="primary" onClick={save}>
          Save
        </Button>
      </div>
    </RefinementCard>
  );
}

const MARITAL_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'partnered', label: 'Partnered' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

const MARITAL_LABEL: Record<MaritalStatus, string> = {
  single: 'Single',
  married: 'Married',
  partnered: 'Partnered',
  divorced: 'Divorced',
  widowed: 'Widowed',
};

function MaritalStatusRefinement({
  value,
  onUpdate,
}: {
  value?: MaritalStatus;
  onUpdate: (patch: Partial<PartialPicture>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const display = value ? MARITAL_LABEL[value] : 'Not set';

  const select = (next: MaritalStatus) => {
    onUpdate({ maritalStatus: next });
    setExpanded(false);
  };

  return (
    <RefinementCard
      label="Marital status"
      valueDisplay={display}
      expanded={expanded}
      onToggle={() => setExpanded((v) => !v)}
    >
      <div className="flex flex-wrap gap-1.5">
        {MARITAL_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className="text-[12px] px-2.5 py-1.5 rounded-md cursor-pointer transition-all"
              style={{
                background: selected ? 'var(--gold-dim)' : 'var(--navy-3)',
                border: selected ? '1px solid var(--gold)' : '1px solid var(--border)',
                color: selected ? 'var(--gold-light)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <div className="text-[10.5px] mt-2" style={{ color: 'var(--text-dim)' }}>
        Affects tax class (e.g. LU Class 1 vs 2) and survivor-pension framing.
        No certificate needed \u2014 institutions collect that at claim time.
      </div>
    </RefinementCard>
  );
}

interface NumberRefinementProps {
  label: string;
  unit: string;
  value?: number;
  placeholder: string;
  min: number;
  max: number;
  step?: number;
  presets: number[];
  onSave: (value: number) => void;
}

function NumberRefinement({
  label,
  unit,
  value,
  placeholder,
  min,
  max,
  step = 1,
  presets,
  onSave,
}: NumberRefinementProps) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<string>(value != null ? String(value) : '');

  const display = value != null ? `${value.toLocaleString()} ${unit}` : 'Not set';

  const commit = (n: number) => {
    if (!Number.isFinite(n) || n < min || n > max) return;
    onSave(n);
    setExpanded(false);
  };

  return (
    <RefinementCard
      label={label}
      valueDisplay={display}
      expanded={expanded}
      onToggle={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit(parseInt(draft, 10));
          }}
          placeholder={placeholder}
          className="w-24 rounded-md px-2.5 py-2 text-[14px] font-semibold outline-none"
          style={{
            background: 'var(--navy-3)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
          }}
        />
        <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>
          {unit}
        </span>
        <div className="flex-1" />
        <Button variant="primary" onClick={() => commit(parseInt(draft, 10))}>
          Save
        </Button>
      </div>
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setDraft(String(p));
              commit(p);
            }}
            className="text-[11px] px-2 py-1 rounded-md cursor-pointer"
            style={{
              background: 'var(--navy-3)',
              border: '1px solid var(--border)',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {p.toLocaleString()}
          </button>
        ))}
      </div>
    </RefinementCard>
  );
}
