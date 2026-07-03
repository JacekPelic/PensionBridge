'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { OnboardingCapstone, deriveAsks } from '@/modules/guidance';
import { PicturePreview } from './PicturePreview';
import { QuestionCard } from './QuestionCard';
import { estimate } from './estimate';
import { nextQuestion, QUESTIONS } from './questions';
import { usePicture } from '@/modules/identity/PictureProvider';

/**
 * Standalone full-screen onboarding. Three phases:
 *   1. Splash       — first-time users see brand + intent + a "View demo" escape
 *   2. Questions    — the five opening questions (existing QuestionCard)
 *   3. Completion   — picture preview + capstone product offers + "Enter dashboard"
 *
 * The OnboardingGate decides when to render this; this screen drives its own
 * phase locally based on picture state (splash only shown when nothing has
 * been answered yet).
 */
export function OnboardingScreen() {
  const router = useRouter();
  const { picture, updatePicture, loadMock } = usePicture();

  // Splash gate — show splash only if the user hasn't started typing answers.
  const hasStartedAnswering =
    picture.residenceCountry != null ||
    picture.age != null ||
    picture.countriesWorked != null;
  const [splashDismissed, setSplashDismissed] = useState(hasStartedAnswering);

  const currentQuestion = useMemo(() => nextQuestion(picture), [picture]);
  const currentEstimate = useMemo(() => estimate(picture), [picture]);
  const asks = useMemo(() => deriveAsks(picture), [picture]);

  const enterDashboard = () => {
    updatePicture({ onboardingDismissed: true });
    router.push('/');
  };

  // Phase selection. nextQuestion() is the single source of truth for whether
  // the opening flow still has work to do — it gates on askStatus rather than
  // whether the array fields are non-null, so multi-select questions stay on
  // screen until the user explicitly confirms ("Continue").
  let phase: 'splash' | 'questions' | 'complete';
  if (!splashDismissed && !hasStartedAnswering) {
    phase = 'splash';
  } else if (currentQuestion) {
    phase = 'questions';
  } else {
    phase = 'complete';
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--navy)' }}>
      <header
        className="px-8 py-5 flex items-center justify-between shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base"
            style={{ background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'var(--font-playfair)' }}
          >
            P
          </div>
          <span
            className="text-base font-semibold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            Clerio
          </span>
        </div>
        {phase === 'questions' && (
          <PhaseProgress picture={picture} />
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        {phase === 'splash' && (
          <SplashPanel
            onBegin={() => setSplashDismissed(true)}
            onLoadDemo={loadMock}
          />
        )}

        {phase === 'questions' && currentQuestion && (
          <div className="w-full max-w-[640px]">
            <QuestionCard
              question={currentQuestion}
              picture={picture}
              onAnswer={updatePicture}
            />
          </div>
        )}

        {phase === 'complete' && (
          <div className="w-full max-w-[1100px] flex flex-col gap-6">
            <CompletionHeader
              firstName={picture.firstName}
              countryCount={1 + (picture.countriesWorked?.length ?? 0)}
            />
            <PicturePreview estimate={currentEstimate} forceUnverified />
            <OnboardingCapstone picture={picture} asks={asks} />
            <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
              <div className="text-[11.5px] max-w-[480px]" style={{ color: 'var(--text-dim)' }}>
                Sharpen your picture anytime from <strong style={{ color: 'var(--text-muted)' }}>Your picture</strong>.
                Add documents, refine salaries, or work through the guided pillar tour.
              </div>
              <Button variant="primary" onClick={enterDashboard}>
                Enter your dashboard {'→'}
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer
        className="px-8 py-3 text-[11px] text-center shrink-0"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-dim)' }}
      >
        Clerio {'·'} your future, foreseen
      </footer>
    </div>
  );
}

// ─── Splash ─────────────────────────────────────────────────────────

function SplashPanel({
  onBegin,
  onLoadDemo,
}: {
  onBegin: () => void;
  onLoadDemo: () => void;
}) {
  return (
    <div className="w-full max-w-[560px] text-center">
      <div
        className="text-[10.5px] uppercase tracking-[0.16em] font-semibold mb-3"
        style={{ color: 'var(--gold-light)' }}
      >
        Your retirement picture
      </div>
      <h1
        className="text-[36px] leading-tight font-semibold mb-3"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
      >
        Let’s build your picture.
      </h1>
      <p
        className="text-[14px] leading-relaxed mb-8 max-w-[440px] mx-auto"
        style={{ color: 'var(--text-muted)' }}
      >
        Seven questions about your career and goals — about three minutes. We combine the rules across the countries you’ve worked in and surface a single, calm view of where you stand.
      </p>

      <div className="flex flex-col items-center gap-3">
        <Button variant="primary" onClick={onBegin} className="text-[14px] px-6 py-3">
          Begin {'→'}
        </Button>
        <button
          type="button"
          onClick={onLoadDemo}
          className="text-[12px] underline underline-offset-2 cursor-pointer transition-opacity hover:opacity-80"
          style={{ color: 'var(--text-dim)', background: 'transparent', border: 'none' }}
        >
          Or view a sample picture (Mats Karlsson, FR/CH/LU career)
        </button>
      </div>

      <div
        className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left"
      >
        {[
          {
            heading: 'Multi-country by design',
            body: 'Built for careers that span 3+ EU jurisdictions. Each country contributes its own pension share.',
          },
          {
            heading: 'Verified, not sold',
            body: 'Every figure is traceable to a source. Where products are shown, the disclosure is plain.',
          },
          {
            heading: 'You stay in control',
            body: 'Your data stays with you. Nothing is shared with employers, advisors, or providers without consent.',
          },
        ].map((b) => (
          <div
            key={b.heading}
            className="rounded-lg p-3.5"
            style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}
          >
            <div
              className="text-[10.5px] uppercase tracking-[0.12em] font-semibold mb-1.5"
              style={{ color: 'var(--gold-light)' }}
            >
              {b.heading}
            </div>
            <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {b.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Question phase progress ───────────────────────────────────────

function PhaseProgress({ picture }: { picture: ReturnType<typeof usePicture>['picture'] }) {
  const total = QUESTIONS.length;
  const answered = QUESTIONS.filter((q) => q.isAnswered(picture)).length;
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1 w-[140px]">
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

// ─── Completion header ─────────────────────────────────────────────

function CompletionHeader({
  firstName,
  countryCount,
}: {
  firstName?: string;
  countryCount: number;
}) {
  return (
    <div className="text-center">
      <div
        className="text-[10.5px] uppercase tracking-[0.16em] font-semibold mb-2"
        style={{ color: 'var(--gold-light)' }}
      >
        Your picture is ready
      </div>
      <h2
        className="text-[28px] leading-tight font-semibold mb-2"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
      >
        {firstName ? `Here's your starting view, ${firstName}.` : 'Here\'s your starting view.'}
      </h2>
      <div className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
        Across {countryCount} {countryCount === 1 ? 'country' : 'countries'} {'·'} you can sharpen it anytime once inside.
      </div>
    </div>
  );
}
