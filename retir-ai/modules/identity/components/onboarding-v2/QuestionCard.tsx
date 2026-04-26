'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import type { CountryCode, PartialPicture } from './estimate';
import type { Question } from './questions';
import { RESIDENCE_OPTIONS, QUESTIONS, countriesForYears } from './questions';
import { countryAnchor } from './estimate';

interface QuestionCardProps {
  question: Question;
  picture: PartialPicture;
  onAnswer: (patch: Partial<PartialPicture>) => void;
}

export function QuestionCard({ question, picture, onAnswer }: QuestionCardProps) {
  const totalQuestions = QUESTIONS.length;
  const indexOfThis = QUESTIONS.findIndex((q) => q.id === question.id);
  // For the first two questions (residence + age) the rationale is revealed by
  // default — first-time users need the context and the card has room for it.
  const [showWhy, setShowWhy] = useState(indexOfThis < 2);

  // Rough time remaining: 30-40s per remaining question, rounded to half-minutes.
  const remainingQuestions = Math.max(0, totalQuestions - indexOfThis);
  const secondsLeft = remainingQuestions * 35;
  const timeLeftLabel =
    secondsLeft < 60
      ? 'about a minute left'
      : `about ${Math.round(secondsLeft / 60)} min left`;

  return (
    <div
      className="rounded-[14px] p-7 flex flex-col gap-5 animate-fade-in"
      style={{
        background: 'var(--navy-2)',
        border: '1px solid var(--border)',
        minHeight: 380,
      }}
      key={question.id}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[10.5px] uppercase tracking-[0.14em] font-semibold"
          style={{ color: 'var(--gold-light)' }}
        >
          Step {indexOfThis + 1} of {totalQuestions}
        </span>
        <span className="text-[10.5px]" style={{ color: 'var(--text-dim)' }}>
          {timeLeftLabel}
        </span>
      </div>

      <h2
        className="text-[22px] leading-tight font-semibold"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
      >
        {question.prompt}
      </h2>

      <div className="flex-1">
        {question.inputType === 'country-select' && (
          <CountrySelectInput value={picture.residenceCountry} onAnswer={onAnswer} />
        )}
        {question.inputType === 'age-input' && (
          <AgeInput value={picture.age} onAnswer={onAnswer} />
        )}
        {question.inputType === 'multi-country' && (
          <MultiCountryInput
            residence={picture.residenceCountry}
            value={picture.countriesWorked}
            askStatus={picture.askStatus}
            onAnswer={onAnswer}
          />
        )}
        {question.inputType === 'years-per-country' && (
          <YearsPerCountryInput picture={picture} onAnswer={onAnswer} />
        )}
        {question.inputType === 'salary-per-country' && (
          <SalaryPerCountryInput picture={picture} onAnswer={onAnswer} />
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowWhy((v) => !v)}
          className="text-[11.5px] underline-offset-2 cursor-pointer transition-colors"
          style={{ color: 'var(--text-dim)' }}
        >
          {showWhy ? 'Hide \u201cwhy we ask\u201d' : 'Why we ask'}
        </button>
        {showWhy && (
          <div
            className="mt-2 p-3 rounded-lg text-[12px] leading-relaxed animate-fade-in"
            style={{
              background: 'var(--navy-3)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            {question.rationale}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Inputs ─────────────────────────────────────────────────────────

function CountrySelectInput({
  value,
  onAnswer,
}: {
  value?: CountryCode;
  onAnswer: (patch: Partial<PartialPicture>) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {RESIDENCE_OPTIONS.map((opt) => {
        const selected = value === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => onAnswer({ residenceCountry: opt.code })}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all"
            style={{
              background: selected ? 'var(--gold-dim)' : 'var(--navy-3)',
              border: selected ? '1px solid var(--gold)' : '1px solid var(--border)',
              color: selected ? 'var(--gold-light)' : 'var(--text-muted)',
            }}
          >
            <span className="text-base">{opt.flag}</span>
            <span>{opt.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function AgeInput({
  value,
  onAnswer,
}: {
  value?: number;
  onAnswer: (patch: Partial<PartialPicture>) => void;
}) {
  const [draft, setDraft] = useState<string>(value != null ? String(value) : '');
  const [error, setError] = useState<string | null>(null);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed === '') {
      setError('Enter your age to continue.');
      return;
    }
    const n = parseInt(trimmed, 10);
    if (Number.isNaN(n)) {
      setError('Use a whole number like 42.');
      return;
    }
    if (n < 18 || n > 80) {
      setError('Age should be between 18 and 80.');
      return;
    }
    setError(null);
    onAnswer({ age: n });
  };

  const invalid = error != null;

  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={18}
          max={80}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
          }}
          placeholder="42"
          aria-invalid={invalid}
          className="w-28 rounded-lg px-4 py-3 text-[20px] font-semibold outline-none"
          style={{
            background: 'var(--navy-3)',
            border: invalid ? '1px solid var(--red)' : '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
          }}
        />
        <span style={{ color: 'var(--text-dim)' }} className="text-[13px]">
          years old
        </span>
        <div className="flex-1" />
        <Button variant="primary" onClick={commit}>
          Continue {'\u2192'}
        </Button>
      </div>
      {error && (
        <div
          className="text-[11.5px] mt-2"
          style={{ color: 'var(--red)' }}
          role="alert"
        >
          {error}
        </div>
      )}
      <div className="flex gap-1.5 mt-3 flex-wrap">
        {[30, 40, 50, 55, 60].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setDraft(String(preset));
              setError(null);
              onAnswer({ age: preset });
            }}
            className="text-[11.5px] px-2.5 py-1 rounded-md cursor-pointer transition-colors"
            style={{
              background: 'var(--navy-3)',
              border: '1px solid var(--border)',
              color: 'var(--text-dim)',
            }}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Years per country ──────────────────────────────────────────────

const YEAR_BUCKETS: { label: string; midpoint: number }[] = [
  { label: '0\u20132', midpoint: 1 },
  { label: '2\u20135', midpoint: 3.5 },
  { label: '5\u201310', midpoint: 7.5 },
  { label: '10\u201320', midpoint: 15 },
  { label: '20+', midpoint: 25 },
];

function bucketForYears(years?: number): number | null {
  if (years == null) return null;
  for (let i = 0; i < YEAR_BUCKETS.length; i++) {
    const b = YEAR_BUCKETS[i];
    if (Math.abs(b.midpoint - years) < 0.01) return i;
  }
  return null;
}

function YearsPerCountryInput({
  picture,
  onAnswer,
}: {
  picture: PartialPicture;
  onAnswer: (patch: Partial<PartialPicture>) => void;
}) {
  const countries = countriesForYears(picture);
  const current = picture.yearsPerCountry ?? {};

  const setYears = (country: CountryCode, midpoint: number) => {
    onAnswer({
      yearsPerCountry: { ...current, [country]: midpoint },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {countries.map((c) => {
        const anchor = countryAnchor(c);
        const selectedIdx = bucketForYears(current[c]);
        return (
          <div key={c} className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-[110px] shrink-0">
              <span className="text-base">{anchor.flag}</span>
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {anchor.name}
              </span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {YEAR_BUCKETS.map((b, i) => {
                const isSelected = selectedIdx === i;
                return (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => setYears(c, b.midpoint)}
                    className="text-[12px] px-2.5 py-1.5 rounded-md cursor-pointer transition-all"
                    style={{
                      background: isSelected ? 'var(--gold-dim)' : 'var(--navy-3)',
                      border: isSelected ? '1px solid var(--gold)' : '1px solid var(--border)',
                      color: isSelected ? 'var(--gold-light)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {b.label}{i === YEAR_BUCKETS.length - 1 ? '' : ' yrs'}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
        Pick a rough range for each country. The next question appears when all are set.
      </div>
    </div>
  );
}

// ─── Salary per country ─────────────────────────────────────────────

/** Country-specific salary presets (local currency). Scaled loosely to reference salary. */
const SALARY_PRESETS_BY_COUNTRY: Record<CountryCode, number[]> = {
  LU: [50000, 75000, 100000, 140000, 200000],
  FR: [25000, 38000, 55000, 80000, 120000],
  CH: [70000, 95000, 120000, 160000, 220000], // CHF
  DE: [35000, 50000, 70000, 95000, 140000],
  BE: [35000, 50000, 70000, 95000, 140000],
  IT: [22000, 33000, 50000, 75000, 110000],
  ES: [20000, 30000, 45000, 65000, 100000],
  PT: [15000, 22000, 35000, 50000, 80000],
  NL: [35000, 55000, 75000, 100000, 150000],
};

function currencyFor(c: CountryCode): string {
  return c === 'CH' ? 'CHF' : '\u20AC';
}

function SalaryPerCountryInput({
  picture,
  onAnswer,
}: {
  picture: PartialPicture;
  onAnswer: (patch: Partial<PartialPicture>) => void;
}) {
  const countries = countriesForYears(picture);
  const current = picture.salaryPerCountry ?? {};

  const setSalary = (
    country: CountryCode,
    field: 'start' | 'end',
    value: number | undefined,
  ) => {
    const row = current[country] ?? { start: 0, end: 0 };
    const next = { ...row, [field]: value ?? 0 };
    // If user only set one side, mirror it so the engine has something to work with.
    if (field === 'start' && !current[country]?.end) {
      next.end = value ?? 0;
    }
    if (field === 'end' && !current[country]?.start) {
      next.start = value ?? 0;
    }
    onAnswer({
      salaryPerCountry: { ...current, [country]: next },
    });
  };

  const confirm = () => {
    onAnswer({
      askStatus: { ...(picture.askStatus ?? {}), 'salary-per-country': 'fulfilled' },
    });
  };

  const skipAll = () => {
    onAnswer({
      askStatus: { ...(picture.askStatus ?? {}), 'salary-per-country': 'skipped' },
    });
  };

  const filledCount = countries.filter(
    (c) => (current[c]?.start ?? 0) > 0 || (current[c]?.end ?? 0) > 0,
  ).length;

  return (
    <div className="flex flex-col gap-3">
      {countries.map((c) => {
        const anchor = countryAnchor(c);
        const row = current[c];
        const isResidence = c === picture.residenceCountry;
        const endLabel = isResidence ? 'Current' : 'When you left';
        const currency = currencyFor(c);
        const presets = SALARY_PRESETS_BY_COUNTRY[c] ?? [30000, 50000, 75000, 100000, 150000];

        return (
          <div
            key={c}
            className="rounded-lg p-3"
            style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{anchor.flag}</span>
              <span
                className="text-[12.5px] font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {anchor.name}
              </span>
              {isResidence && (
                <span
                  className="text-[9.5px] uppercase tracking-[0.12em] font-semibold px-1.5 py-[1px] rounded"
                  style={{ background: 'var(--gold-dim)', color: 'var(--gold-light)' }}
                >
                  Current
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <SalaryField
                label="When you started"
                currency={currency}
                value={row?.start}
                onChange={(n) => setSalary(c, 'start', n)}
              />
              <SalaryField
                label={endLabel}
                currency={currency}
                value={row?.end}
                onChange={(n) => setSalary(c, 'end', n)}
              />
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    // One-click: fill "end" (most recent/current) with the preset.
                    // If start is empty, mirror it there too.
                    const next = {
                      start: row?.start && row.start > 0 ? row.start : preset,
                      end: preset,
                    };
                    onAnswer({
                      salaryPerCountry: { ...current, [c]: next },
                    });
                  }}
                  className="text-[11px] px-2 py-1 rounded-md cursor-pointer transition-colors"
                  style={{
                    background: 'var(--navy-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {currency}{(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="text-[11.5px] tabular-nums"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          {filledCount === 0
            ? 'None filled yet'
            : `${filledCount} of ${countries.length} filled`}
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={skipAll}
          className="text-[11.5px] underline-offset-2 cursor-pointer transition-colors"
          style={{ color: 'var(--text-dim)' }}
        >
          Skip for now
        </button>
        <Button variant="primary" onClick={confirm}>
          Continue {'\u2192'}
        </Button>
      </div>
      <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
        Gross annual salary. Rough is fine — presets fill both start & current;
        adjust the start if your salary grew over time.
      </div>
    </div>
  );
}

function SalaryField({
  label,
  currency,
  value,
  onChange,
}: {
  label: string;
  currency: string;
  value?: number;
  onChange: (n: number | undefined) => void;
}) {
  const externalTarget = value != null && value > 0 ? String(value) : '';
  const [draft, setDraft] = useState<string>(externalTarget);
  const [lastExternal, setLastExternal] = useState<string>(externalTarget);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adopt parent updates (e.g. preset click) during render — but not while the
  // user is typing here. Using the "setState during render" pattern instead of
  // an effect avoids cascading renders.
  if (!focused && externalTarget !== lastExternal) {
    setLastExternal(externalTarget);
    setDraft(externalTarget);
    if (error) setError(null);
  }

  const commit = () => {
    const cleaned = draft.replace(/[^\d]/g, '');
    if (cleaned === '') {
      setError(null);
      onChange(undefined);
      return;
    }
    const n = parseInt(cleaned, 10);
    if (Number.isNaN(n)) {
      setError('Use a number, e.g. 60000.');
      return;
    }
    if (n < 5000) {
      setError('Try a figure above 5,000.');
      return;
    }
    if (n > 1000000) {
      setError('Values over 1,000,000 are capped.');
      return;
    }
    setError(null);
    onChange(n);
  };

  const invalid = error != null;

  return (
    <div>
      <div
        className="text-[10.5px] uppercase tracking-[0.1em] font-semibold mb-1"
        style={{ color: 'var(--text-dim)' }}
      >
        {label}
      </div>
      <div
        className="rounded-md flex items-center pl-2 overflow-hidden"
        style={{
          background: 'var(--navy-2)',
          border: invalid ? '1px solid var(--red)' : '1px solid var(--border)',
        }}
      >
        <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-dim)' }}>
          {currency}
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            commit();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
          }}
          placeholder="—"
          aria-invalid={invalid}
          className="w-full px-1.5 py-2 text-[14px] font-semibold outline-none bg-transparent tabular-nums"
          style={{
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
          }}
        />
      </div>
      {error && (
        <div className="text-[10.5px] mt-1" style={{ color: 'var(--red)' }} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

function MultiCountryInput({
  residence,
  value,
  askStatus,
  onAnswer,
}: {
  residence?: CountryCode;
  value?: CountryCode[];
  askStatus?: Partial<Record<string, 'fulfilled' | 'skipped'>>;
  onAnswer: (patch: Partial<PartialPicture>) => void;
}) {
  const selected = value ?? [];
  const count = selected.length;

  const toggle = (code: CountryCode) => {
    if (code === residence) return; // residence is implicit
    const next = selected.includes(code)
      ? selected.filter((c) => c !== code)
      : [...selected, code];
    onAnswer({ countriesWorked: next });
  };

  const confirm = () => {
    onAnswer({
      countriesWorked: selected,
      askStatus: { ...(askStatus ?? {}), 'countries-worked': 'fulfilled' },
    });
  };

  const confirmNone = () => {
    onAnswer({
      countriesWorked: [],
      askStatus: { ...(askStatus ?? {}), 'countries-worked': 'fulfilled' },
    });
  };

  return (
    <div>
      <div className="text-[12px] mb-3" style={{ color: 'var(--text-muted)' }}>
        Select all that apply. Don&apos;t worry about exact dates yet.
      </div>
      <div className="grid grid-cols-3 gap-2">
        {RESIDENCE_OPTIONS.filter((opt) => opt.code !== residence).map((opt) => {
          const isSelected = selected.includes(opt.code);
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => toggle(opt.code)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all"
              style={{
                background: isSelected ? 'var(--gold-dim)' : 'var(--navy-3)',
                border: isSelected ? '1px solid var(--gold)' : '1px solid var(--border)',
                color: isSelected ? 'var(--gold-light)' : 'var(--text-muted)',
              }}
            >
              <span className="text-base">{opt.flag}</span>
              <span>{opt.name}</span>
            </button>
          );
        })}
      </div>
      {residence && (
        <div
          className="text-[11.5px] mt-3 p-2.5 rounded-md"
          style={{
            background: 'var(--navy-3)',
            border: '1px solid var(--border)',
            color: 'var(--text-dim)',
          }}
        >
          {countryAnchor(residence).flag} {countryAnchor(residence).name} is included
          automatically as your country of residence.
        </div>
      )}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <span
          className="text-[11.5px] tabular-nums"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          {count === 0
            ? 'None selected yet'
            : count === 1
              ? '1 other country selected'
              : `${count} other countries selected`}
        </span>
        <div className="flex-1" />
        {count === 0 ? (
          <button
            type="button"
            onClick={confirmNone}
            className="text-[11.5px] underline-offset-2 cursor-pointer transition-colors"
            style={{ color: 'var(--text-dim)' }}
          >
            I&apos;ve only worked in {residence ? countryAnchor(residence).name : 'one country'}
          </button>
        ) : (
          <Button variant="primary" onClick={confirm}>
            Continue {'\u2192'}
          </Button>
        )}
      </div>
    </div>
  );
}
