'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import type { EmploymentEntry, OnboardingState } from '@/lib/pension/types';
import type { Country } from '@/lib/types';
import { COUNTRY_META } from '@/lib/pension';

// ─── Demo salary data (used by "Fill with sample data" button) ──────
// Tuned so the calculated Pillar 1 total lands around €2,500/month
const DEMO_SALARIES: Record<string, { startSalary: number; endSalary: number }> = {
  'parsed-lu':   { startSalary: 35000,  endSalary: 42000 },
  'parsed-ch':   { startSalary: 80000,  endSalary: 95000 },
  'parsed-fr-2': { startSalary: 34000,  endSalary: 44000 },
  'parsed-fr-1': { startSalary: 26000,  endSalary: 32000 },
};

// ─── Mock parsed entries (simulates CV / LinkedIn extraction) ────────
// Import extracts countries, dates, and employment type — salary must be entered manually
const MOCK_PARSED_ENTRIES: EmploymentEntry[] = [
  {
    id: 'parsed-lu',
    country: 'LU',
    startDate: '2020-04-01',
    endDate: null,
    startSalary: 0,
    endSalary: 0,
    currency: 'EUR',
    employmentType: 'employed',
  },
  {
    id: 'parsed-ch',
    country: 'CH',
    startDate: '2014-09-01',
    endDate: '2019-12-01',
    startSalary: 0,
    endSalary: 0,
    currency: 'CHF',
    employmentType: 'employed',
  },
  {
    id: 'parsed-fr-2',
    country: 'FR',
    startDate: '2008-06-01',
    endDate: '2013-07-01',
    startSalary: 0,
    endSalary: 0,
    currency: 'EUR',
    employmentType: 'employed',
  },
  {
    id: 'parsed-fr-1',
    country: 'FR',
    startDate: '2003-09-01',
    endDate: '2008-05-01',
    startSalary: 0,
    endSalary: 0,
    currency: 'EUR',
    employmentType: 'employed',
  },
];

interface Props {
  state: OnboardingState;
  onChange: (patch: Partial<OnboardingState>) => void;
}

const inputStyle: React.CSSProperties = {
  background: 'var(--navy-3)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontFamily: 'var(--font-sans)',
};

const emptyEntry = (): EmploymentEntry => ({
  id: crypto.randomUUID(),
  country: 'FR',
  startDate: '',
  endDate: null,
  startSalary: 0,
  endSalary: 0,
  currency: 'EUR',
  employmentType: 'employed',
});

type ImportStatus = 'idle' | 'parsing' | 'done';

export function StepEmployment({ state, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EmploymentEntry>(emptyEntry());
  const [showForm, setShowForm] = useState(state.employmentEntries.length === 0);
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [importSource, setImportSource] = useState<'cv' | 'linkedin' | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isFillingSalaries, setIsFillingSalaries] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const entries = state.employmentEntries;
  const hasMissingSalaries = entries.length > 0 && entries.some((e) => !e.startSalary && !e.endSalary);

  const fillDemoSalaries = () => {
    setIsFillingSalaries(true);
    setTimeout(() => {
      const filled = entries.map((e) => {
        const demo = DEMO_SALARIES[e.id];
        if (demo && !e.startSalary && !e.endSalary) {
          return { ...e, startSalary: demo.startSalary, endSalary: demo.endSalary };
        }
        return e;
      });
      onChange({ employmentEntries: filled });
      setIsFillingSalaries(false);
    }, 800);
  };

  const simulateImport = (source: 'cv' | 'linkedin') => {
    setImportSource(source);
    setImportStatus('parsing');
    setTimeout(() => {
      onChange({ employmentEntries: MOCK_PARSED_ENTRIES });
      setImportStatus('done');
      setShowForm(false);
    }, 2200);
  };

  const handleFileSelect = (_e: React.ChangeEvent<HTMLInputElement>) => {
    simulateImport('cv');
  };

  const handleLinkedinSubmit = () => {
    if (!linkedinUrl.trim()) return;
    simulateImport('linkedin');
  };

  const saveEntry = () => {
    if (!draft.startDate || !draft.startSalary) return;
    // Default endSalary to startSalary if not set
    const toSave = { ...draft, endSalary: draft.endSalary || draft.startSalary };

    if (editingId) {
      onChange({
        employmentEntries: entries.map((e) => (e.id === editingId ? toSave : e)),
      });
    } else {
      onChange({ employmentEntries: [...entries, toSave] });
    }
    setDraft(emptyEntry());
    setEditingId(null);
    setShowForm(false);
  };

  const removeEntry = (id: string) => {
    onChange({ employmentEntries: entries.filter((e) => e.id !== id) });
  };

  const editEntry = (entry: EmploymentEntry) => {
    setDraft({ ...entry });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const aDate = a.endDate ?? '9999';
    const bDate = b.endDate ?? '9999';
    return bDate.localeCompare(aDate);
  });

  const currencySymbol = (c: 'EUR' | 'CHF') => c === 'CHF' ? 'CHF ' : '\u20AC';

  return (
    <div>
      <h1
        className="text-[30px] font-bold leading-tight mb-2"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
      >
        Your <span style={{ color: 'var(--gold-light)' }}>employment history</span>
      </h1>
      <p className="text-sm mb-6 max-w-[560px]" style={{ color: 'var(--text-muted)' }}>
        Import your career from a CV or LinkedIn profile, or add periods manually below.
      </p>

      {/* Import section */}
      {importStatus === 'idle' && entries.length === 0 && (
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          {/* CV upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl p-5 text-center cursor-pointer transition-all group"
            style={{ border: '2px dashed var(--navy-5)', background: 'var(--navy-2)' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="text-2xl mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
              {'\uD83D\uDCC4'}
            </div>
            <div className="text-[13.5px] font-medium mb-1" style={{ color: 'var(--text)' }}>
              Upload CV
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
              PDF, DOC, or DOCX
            </div>
          </button>

          {/* LinkedIn URL */}
          <div
            className="rounded-xl p-5 flex flex-col"
            style={{ border: '2px dashed var(--navy-5)', background: 'var(--navy-2)' }}
          >
            <div className="text-2xl mb-2 opacity-60">{'\uD83D\uDD17'}</div>
            <div className="text-[13.5px] font-medium mb-2" style={{ color: 'var(--text)' }}>
              LinkedIn Profile
            </div>
            <div className="flex gap-2 mt-auto">
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="linkedin.com/in/..."
                className="flex-1 rounded-lg px-3 py-2 text-[12px] outline-none min-w-0"
                style={inputStyle}
                onKeyDown={(e) => e.key === 'Enter' && handleLinkedinSubmit()}
              />
              <Button
                variant="primary"
                onClick={handleLinkedinSubmit}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Import
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Parsing animation */}
      {importStatus === 'parsing' && (
        <div
          className="rounded-xl p-6 mb-6 flex items-center gap-4"
          style={{ background: 'var(--navy-2)', border: '1.5px solid var(--gold-border)' }}
        >
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
          <div>
            <div className="text-[13.5px] font-medium" style={{ color: 'var(--gold-light)' }}>
              {importSource === 'cv' ? 'Extracting employment history from CV...' : 'Fetching career data from LinkedIn...'}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
              Detecting countries, dates, and salary ranges
            </div>
          </div>
        </div>
      )}

      {/* Import success banner */}
      {importStatus === 'done' && (
        <div
          className="rounded-xl p-4 mb-6 flex items-center gap-3"
          style={{ background: 'var(--navy-2)', border: '1px solid var(--green)' }}
        >
          <span className="text-base">{'\u2705'}</span>
          <div className="flex-1">
            <div className="text-[13px] font-medium" style={{ color: 'var(--green)' }}>
              {entries.length} employment periods extracted
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
              {importSource === 'cv' ? 'From uploaded CV' : 'From LinkedIn profile'} — countries, dates, and employment type detected
            </div>
            {hasMissingSalaries && (
              <div className="flex items-center gap-3 mt-2">
                <div className="text-[11px]" style={{ color: 'var(--amber)' }}>
                  ⚠ Salary data couldn't be extracted — add manually or use sample data for demo
                </div>
                <button
                  onClick={fillDemoSalaries}
                  disabled={isFillingSalaries}
                  className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                  style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', color: 'var(--gold-light)' }}
                >
                  {isFillingSalaries ? 'Filling...' : 'Fill with sample data'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline visualization */}
      {sortedEntries.length > 0 && (
        <div className="mb-6">
          {sortedEntries.map((entry) => {
            const meta = COUNTRY_META[entry.country];
            const endLabel = entry.endDate
              ? new Date(entry.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
              : 'Present';
            const startLabel = new Date(entry.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
            const cs = currencySymbol(entry.currency);
            const salaryChanged = entry.startSalary !== entry.endSalary;
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3.5 p-3.5 px-[18px] rounded-xl mb-2.5 group cursor-pointer transition-all"
                style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
                onClick={() => editEntry(entry)}
              >
                <span className="text-[22px]">{meta.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-medium truncate" style={{ color: 'var(--text)' }}>
                      {meta.name}
                    </span>
                    <span
                      className="text-[11px] px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--navy-4)', color: 'var(--text-dim)' }}
                    >
                      {entry.employmentType}
                    </span>
                  </div>
                  <div className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {startLabel} — {endLabel}
                  </div>
                </div>
                <div className="text-right">
                  {!entry.startSalary && !entry.endSalary ? (
                    <>
                      <div className="text-[12px] font-medium" style={{ color: 'var(--amber)' }}>
                        Add salary
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--amber)' }}>click to edit</div>
                    </>
                  ) : salaryChanged ? (
                    <>
                      <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
                        {cs}{entry.startSalary.toLocaleString()} {'\u2192'} {cs}{entry.endSalary.toLocaleString()}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>gross / year</div>
                    </>
                  ) : (
                    <>
                      <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
                        {cs}{entry.endSalary.toLocaleString()}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>gross / year</div>
                    </>
                  )}
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded"
                  style={{ color: 'var(--red)', background: 'var(--navy-4)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEntry(entry.id);
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit form */}
      {showForm ? (
        <div
          className="rounded-xl p-5 mb-4"
          style={{ background: 'var(--navy-2)', border: '1.5px solid var(--gold-border)' }}
        >
          <div className="text-xs font-medium uppercase tracking-wide mb-4" style={{ color: 'var(--gold)' }}>
            {editingId ? 'Edit Employment Period' : 'Add Employment Period'}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Country */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
                Country
              </label>
              <select
                value={draft.country}
                onChange={(e) => {
                  const country = e.target.value as Country;
                  setDraft({
                    ...draft,
                    country,
                    currency: country === 'CH' ? 'CHF' : 'EUR',
                  });
                }}
                className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none"
                style={inputStyle}
              >
                <option value="FR">France</option>
                <option value="CH">Switzerland</option>
                <option value="LU">Luxembourg</option>
              </select>
            </div>

            {/* Employment type */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
                Employment Type
              </label>
              <select
                value={draft.employmentType}
                onChange={(e) => setDraft({ ...draft, employmentType: e.target.value as 'employed' | 'self-employed' })}
                className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none"
                style={inputStyle}
              >
                <option value="employed">Employed</option>
                <option value="self-employed">Self-employed</option>
              </select>
            </div>

            {/* Start date */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
                Start Date
              </label>
              <input
                type="month"
                value={draft.startDate ? draft.startDate.slice(0, 7) : ''}
                onChange={(e) => setDraft({ ...draft, startDate: e.target.value + '-01' })}
                className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none"
                style={inputStyle}
              />
            </div>

            {/* End date */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
                End Date
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="month"
                  value={draft.endDate ? draft.endDate.slice(0, 7) : ''}
                  onChange={(e) => setDraft({ ...draft, endDate: e.target.value ? e.target.value + '-01' : null })}
                  className="flex-1 rounded-lg px-3 py-2.5 text-[13px] outline-none"
                  style={{ ...inputStyle, opacity: draft.endDate === null ? 0.4 : 1 }}
                  disabled={draft.endDate === null}
                />
                <label className="flex items-center gap-1.5 text-[12px] cursor-pointer select-none whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>
                  <input
                    type="checkbox"
                    checked={draft.endDate === null}
                    onChange={(e) => setDraft({ ...draft, endDate: e.target.checked ? null : '' })}
                    className="accent-[var(--gold)]"
                  />
                  Current
                </label>
              </div>
            </div>

            {/* Start salary */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
                Starting Salary ({draft.currency}/yr)
              </label>
              <input
                type="number"
                value={draft.startSalary || ''}
                onChange={(e) => setDraft({ ...draft, startSalary: parseInt(e.target.value) || 0 })}
                placeholder="e.g. 45000"
                className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none"
                style={inputStyle}
              />
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                Gross annual salary when you started
              </div>
            </div>

            {/* End salary */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
                {draft.endDate === null ? 'Current' : 'Final'} Salary ({draft.currency}/yr)
              </label>
              <input
                type="number"
                value={draft.endSalary || ''}
                onChange={(e) => setDraft({ ...draft, endSalary: parseInt(e.target.value) || 0 })}
                placeholder="e.g. 65000"
                className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none"
                style={inputStyle}
              />
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                {draft.endDate === null ? 'Your salary today' : 'Gross annual salary when you left'}
              </div>
            </div>

            <div className="col-span-2 flex gap-2">
              <Button variant="primary" onClick={saveEntry}>
                {editingId ? 'Update' : 'Add Period'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setDraft(emptyEntry());
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setDraft(emptyEntry());
            setShowForm(true);
          }}
          className="w-full rounded-xl p-4 text-center cursor-pointer transition-all text-[13.5px] font-medium"
          style={{
            border: '2px dashed var(--navy-5)',
            background: 'var(--navy-2)',
            color: 'var(--text-muted)',
          }}
        >
          + Add Employment Period
        </button>
      )}

      {/* Summary */}
      {entries.length > 0 && (
        <div className="mt-6 flex gap-4">
          {(['FR', 'CH', 'LU'] as Country[]).map((c) => {
            const countryEntries = entries.filter((e) => e.country === c);
            if (countryEntries.length === 0) return null;
            const meta = COUNTRY_META[c];
            const totalMonths = countryEntries.reduce((sum, e) => {
              const start = new Date(e.startDate);
              const end = e.endDate ? new Date(e.endDate) : new Date();
              return sum + Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
            }, 0);
            const years = Math.round(totalMonths / 12 * 10) / 10;
            return (
              <div
                key={c}
                className="flex-1 rounded-xl p-3.5 text-center"
                style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
              >
                <div className="text-lg mb-1">{meta.flag}</div>
                <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{years} yrs</div>
                <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{meta.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
