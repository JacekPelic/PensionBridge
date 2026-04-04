'use client';

import { RESIDENCE_META, ALL_RESIDENCE_COUNTRIES } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';

interface Props {
  retirementAge: number;
  onRetirementAgeChange: (age: number) => void;
  selectedResidences: ResidenceCountry[];
  onToggleResidence: (country: ResidenceCountry) => void;
}

export function SimulationControls({
  retirementAge,
  onRetirementAgeChange,
  selectedResidences,
  onToggleResidence,
}: Props) {
  return (
    <div className="mb-5">
      <div className="grid grid-cols-2 gap-5">
        {/* Age slider */}
        <div
          className="rounded-[14px] p-6 relative overflow-hidden"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
        >
          <div className="text-[11px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--gold)' }}>
            When do you want to retire?
          </div>
          <div className="flex items-baseline gap-2 mb-5">
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 48, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
              {retirementAge}
            </span>
            <span className="text-lg" style={{ color: 'var(--text-muted)' }}>years old</span>
          </div>

          <input
            type="range"
            min={57}
            max={70}
            value={retirementAge}
            onChange={(e) => onRetirementAgeChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${((retirementAge - 57) / 13) * 100}%, var(--navy-4) ${((retirementAge - 57) / 13) * 100}%, var(--navy-4) 100%)`,
              accentColor: 'var(--gold)',
            }}
          />
          <div className="flex justify-between mt-2 text-[11px]" style={{ color: 'var(--text-dim)' }}>
            <span>57 (LU early)</span>
            <span>62</span>
            <span>64 (FR)</span>
            <span>65 (CH/LU)</span>
            <span>70</span>
          </div>

          {/* Age warnings */}
          {retirementAge < 64 && (
            <div className="mt-3 text-[11px] flex items-center gap-1.5" style={{ color: 'var(--red)' }}>
              <span>⚠</span>
              <span>France applies a permanent d{'\u00E9'}cote (penalty) before age 64</span>
            </div>
          )}
          {retirementAge > 65 && (
            <div className="mt-3 text-[11px] flex items-center gap-1.5" style={{ color: 'var(--green)' }}>
              <span>↑</span>
              <span>Deferring increases your pension — France applies a surcote bonus</span>
            </div>
          )}
        </div>

        {/* Country selector */}
        <div
          className="rounded-[14px] p-6"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
        >
          <div className="text-[11px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--gold)' }}>
            Where will you live in retirement?
          </div>
          <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Select countries to compare net income after taxes
          </div>

          <div className="flex flex-col gap-2">
            {ALL_RESIDENCE_COUNTRIES.map((c) => {
              const meta = RESIDENCE_META[c];
              const isSelected = selectedResidences.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => onToggleResidence(c)}
                  className="flex items-center gap-3 p-2.5 px-3.5 rounded-xl cursor-pointer transition-all text-left"
                  style={{
                    background: isSelected ? 'var(--gold-dim)' : 'var(--navy-4)',
                    border: isSelected ? '1px solid var(--gold-border)' : '1px solid var(--border)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <span className="text-lg">{meta.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium" style={{ color: isSelected ? 'var(--gold-light)' : 'var(--text-muted)' }}>
                      {meta.name}
                    </div>
                    <div className="text-[10px] truncate" style={{ color: 'var(--text-dim)' }}>
                      {meta.regime}
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] shrink-0"
                    style={{
                      background: isSelected ? 'var(--gold)' : 'transparent',
                      border: isSelected ? 'none' : '1.5px solid var(--border)',
                      color: isSelected ? 'var(--navy)' : 'transparent',
                    }}
                  >
                    {isSelected ? '✓' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
