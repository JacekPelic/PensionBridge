'use client';

import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Pill } from '@/shared/ui/Pill';

export function SimulationCTA() {
  return (
    <Card style={{ borderColor: 'var(--gold-border)' }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
          🎯
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
              Model Your Retirement Decisions
            </div>
            <span className="text-[9px] font-bold px-2 py-1 rounded-full"
              style={{ background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid var(--gold-border)' }}>
              PRO
            </span>
          </div>
          <div className="text-[12.5px] mb-3.5" style={{ color: 'var(--text-muted)' }}>
            See how retirement age, country of residence, and capital split affect your net income.
          </div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {['Retirement age', 'Tax residence', 'Capital split'].map((label) => (
              <span
                key={label}
                className="text-[10.5px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'var(--gold-dim)', color: 'var(--gold-light)', border: '1px solid var(--gold-border)' }}
              >
                {label}
              </span>
            ))}
          </div>
          <Link href="/simulation">
            <Button variant="primary">Model how to close your gap &rarr;</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
