'use client';

import { useVault } from '@/modules/vault/VaultProvider';
import type { GroupMode } from '@/modules/vault/VaultProvider';
import type { DocStatus, Country, SourceType, DocCategory } from '@/shared/types';

const statusOptions: { value: DocStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'missing', label: 'Missing' },
];

const sourceTypeOptions: { value: SourceType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'state', label: 'State' },
  { value: 'workplace', label: 'Workplace' },
  { value: 'personal', label: 'Personal' },
  { value: 'general', label: 'General' },
];

const countryOptions: { value: Country | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'FR', label: '🇫🇷 FR' },
  { value: 'CH', label: '🇨🇭 CH' },
  { value: 'LU', label: '🇱🇺 LU' },
];

const categoryOptions: { value: DocCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'career', label: '📋 Career' },
  { value: 'pension', label: '📊 Pension' },
  { value: 'correspondence', label: '✉️ Letters' },
];

const groupModes: { value: GroupMode; label: string }[] = [
  { value: 'category', label: 'By category' },
  { value: 'country', label: 'By country' },
  { value: 'flat', label: 'Flat' },
];

function PillGroup<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-all"
          style={{
            background: value === opt.value ? 'var(--gold-dim)' : 'transparent',
            border: value === opt.value ? '1px solid var(--gold-border)' : '1px solid var(--border)',
            color: value === opt.value ? 'var(--gold-light)' : 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function VaultToolbar() {
  const { filters, setFilters, groupMode, setGroupMode } = useVault();

  return (
    <div className="flex flex-col gap-3 mb-5">
      {/* Row 1: Search + group mode */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px]" style={{ color: 'var(--text-dim)' }}>🔍</span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search documents..."
            className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none"
            style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}
          />
        </div>
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {groupModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setGroupMode(mode.value)}
              className="px-3 py-1.5 text-[11px] font-medium cursor-pointer transition-all"
              style={{
                background: groupMode === mode.value ? 'var(--gold-dim)' : 'var(--navy-3)',
                color: groupMode === mode.value ? 'var(--gold-light)' : 'var(--text-dim)',
                border: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-dim)' }}>Status</span>
        <PillGroup options={statusOptions} value={filters.status} onChange={(v) => setFilters({ status: v })} />

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-dim)' }}>Source</span>
        <PillGroup options={sourceTypeOptions} value={filters.sourceType} onChange={(v) => setFilters({ sourceType: v })} />

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-dim)' }}>Country</span>
        <PillGroup options={countryOptions} value={filters.country} onChange={(v) => setFilters({ country: v })} />

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-dim)' }}>Category</span>
        <PillGroup options={categoryOptions} value={filters.category} onChange={(v) => setFilters({ category: v })} />
      </div>
    </div>
  );
}
