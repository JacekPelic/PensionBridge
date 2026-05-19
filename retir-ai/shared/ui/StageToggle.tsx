'use client';

import { useDataStage } from '@/modules/identity/DataStageProvider';

/**
 * Demo affordance — swaps every projection surface between "before document
 * upload" (rough estimates) and "documents verified" (canonical figures).
 * Backed by a global, persistent <DataStageProvider /> at the app root, so
 * flipping it on the dashboard carries over to /picture, /estimation, and
 * /vault automatically.
 */
export function StageToggle() {
  const { stage, toggleStage } = useDataStage();
  const isAfter = stage === 'after';

  return (
    <button
      onClick={toggleStage}
      className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg cursor-pointer transition-all text-[12px] font-medium"
      style={{
        background: isAfter ? 'var(--green-dim)' : 'var(--navy-3)',
        border: isAfter ? '1px solid rgba(62,207,142,0.3)' : '1px solid var(--border)',
        color: isAfter ? 'var(--green)' : 'var(--text-muted)',
        fontFamily: 'var(--font-sans)',
      }}
      aria-label={isAfter ? 'Switch to estimates-only view' : 'Switch to documents-verified view'}
    >
      <span
        className="relative w-8 h-[18px] rounded-full transition-all"
        style={{ background: isAfter ? 'var(--green)' : 'var(--navy-4)' }}
      >
        <span
          className="absolute top-[3px] w-3 h-3 rounded-full transition-all"
          style={{
            left: isAfter ? 17 : 3,
            background: isAfter ? 'var(--navy)' : 'var(--text-dim)',
          }}
        />
      </span>
      {isAfter ? 'Documents verified' : 'Initial estimates'}
    </button>
  );
}
