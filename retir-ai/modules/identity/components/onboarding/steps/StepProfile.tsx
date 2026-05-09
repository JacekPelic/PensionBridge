'use client';

import type { OnboardingState } from '@/modules/pension/types';
import type { Country } from '@/shared/types';

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

export function StepProfile({ state, onChange }: Props) {
  return (
    <div>
      <h1
        className="text-[30px] font-bold leading-tight mb-2"
        style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
      >
        Welcome to <span style={{ color: 'var(--gold-light)' }}>RetirAI</span>
      </h1>
      <p className="text-sm mb-8 max-w-[520px]" style={{ color: 'var(--text-muted)' }}>
        Let&apos;s build your State pension estimate. We need a few personal details to determine which
        rules apply to you.
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-5 max-w-[540px]">
        {/* First name */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>
            First Name
          </label>
          <input
            value={state.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13.5px] outline-none"
            style={inputStyle}
          />
        </div>

        {/* Last name */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Last Name
          </label>
          <input
            value={state.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13.5px] outline-none"
            style={inputStyle}
          />
        </div>

        {/* Date of birth */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Date of Birth
          </label>
          <input
            type="date"
            value={state.dateOfBirth}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13.5px] outline-none"
            style={inputStyle}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Gender
          </label>
          <div className="flex gap-2">
            {(['M', 'F'] as const).map((g) => (
              <button
                key={g}
                onClick={() => onChange({ gender: g })}
                className="flex-1 rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium cursor-pointer transition-all"
                style={{
                  ...inputStyle,
                  background: state.gender === g ? 'var(--gold-dim)' : 'var(--navy-3)',
                  border: state.gender === g ? '1.5px solid var(--gold)' : '1px solid var(--border)',
                  color: state.gender === g ? 'var(--gold-light)' : 'var(--text-muted)',
                }}
              >
                {g === 'M' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
          <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>
            Affects Swiss AVS retirement age calculation
          </div>
        </div>

        {/* Country of residence */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Country of Residence
          </label>
          <select
            value={state.residenceCountry}
            onChange={(e) => onChange({ residenceCountry: e.target.value as Country })}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13.5px] outline-none"
            style={inputStyle}
          >
            <option value="FR">France</option>
            <option value="CH">Switzerland</option>
            <option value="LU">Luxembourg</option>
          </select>
        </div>

        {/* Target retirement age */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Target Retirement Age
          </label>
          <input
            type="number"
            min={57}
            max={70}
            value={state.targetRetirementAge}
            onChange={(e) => onChange({ targetRetirementAge: parseInt(e.target.value) || 64 })}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13.5px] outline-none"
            style={inputStyle}
          />
        </div>

      </div>
    </div>
  );
}
