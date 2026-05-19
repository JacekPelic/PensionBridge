'use client';

import { useState } from 'react';
import type { DataAsk } from './types';
import { AskCard } from './AskCard';

interface AsksStackProps {
  asks: DataAsk[];
}

const INITIAL_VISIBLE = 3;

export function AsksStack({ asks }: AsksStackProps) {
  const [showAll, setShowAll] = useState(false);

  if (asks.length === 0) {
    return (
      <div
        className="rounded-lg p-4 text-[12px] text-center"
        style={{
          background: 'var(--navy-3)',
          border: '1px solid var(--border)',
          color: 'var(--text-dim)',
        }}
      >
        Complete the opening questions to see personalised next steps.
      </div>
    );
  }

  const visible = showAll ? asks : asks.slice(0, INITIAL_VISIBLE);
  const hiddenCount = asks.length - INITIAL_VISIBLE;
  const highCount = asks.filter((a) => a.priority === 'high').length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <div
          className="text-[10.5px] uppercase tracking-[0.14em] font-semibold"
          style={{ color: 'var(--text-dim)' }}
        >
          Next {'\u00B7'} {asks.length} things to add
        </div>
        {highCount > 0 && (
          <span
            className="text-[10px] font-medium"
            style={{ color: 'var(--red)' }}
          >
            {highCount} high priority
          </span>
        )}
      </div>

      {visible.map((ask) => (
        <AskCard key={ask.id} ask={ask} />
      ))}

      {!showAll && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-[11.5px] py-2 rounded-lg cursor-pointer transition-colors"
          style={{
            background: 'var(--navy-3)',
            border: '1px dashed var(--border)',
            color: 'var(--text-dim)',
          }}
        >
          Show {hiddenCount} more {'\u2193'}
        </button>
      )}
    </div>
  );
}
