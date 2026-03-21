'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useDataStage } from '@/providers/DataStageProvider';
import { useUserData } from '@/providers/UserDataProvider';

export function KpiCards() {
  const { stage } = useDataStage();
  const { userData } = useUserData();
  const complete = stage === 'after';

  // Sum contribution years from P1 estimates breakdown (rough: total EUR / average monthly → years equivalent)
  // For simplicity, show the number of countries as a label
  const numCountries = userData.countriesWorked.length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      <Card>
        <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
          Pillar 1 Projection
        </div>
        <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: complete ? 'var(--green)' : 'var(--text)', lineHeight: 1 }}>
          {complete ? '€3,840' : `€${userData.pillar1Total.toLocaleString()}`}
        </div>
        <div className="text-xs mt-1.5" style={{ color: complete ? 'var(--green)' : 'var(--text-muted)' }}>
          {complete ? `✓ verified · across ${numCountries} countries` : `estimated · across ${numCountries} countries`}
        </div>
      </Card>

      <Card>
        <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
          Gaps Detected
        </div>
        <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>
          {complete ? '2' : '2'}
        </div>
        <div className="text-xs mt-1.5" style={{ color: 'var(--red)' }}>
          {complete ? '1 correctable + 1 freelance unverified' : '1 transition gap + 1 missing period'}
        </div>
        <div className="mt-2">
          <Link href="/career" className="text-xs cursor-pointer underline underline-offset-2" style={{ color: 'var(--gold-light)' }}>
            View gaps →
          </Link>
        </div>
      </Card>

      {complete ? (
        <Card style={{ border: '1px solid rgba(96,165,250,0.25)', cursor: 'pointer' }}>
          <Link href="/estimation" className="no-underline">
            <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--blue)' }}>
              Retirement Capital
            </div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--blue)', lineHeight: 1 }}>
              €210K
            </div>
            <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>Swiss Pillar 2 lump sum</div>
            <div className="mt-2 text-xs underline underline-offset-2" style={{ color: 'var(--blue)' }}>
              Model options →
            </div>
          </Link>
        </Card>
      ) : (
        <Card style={{ border: '1px solid rgba(217,119,6,0.25)' }}>
          <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--amber)' }}>
            Pillar 2 & 3
          </div>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700, color: 'var(--text-dim)', lineHeight: 1 }}>
            Not tracked
          </div>
          <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>Upload documents to unlock</div>
          <div className="mt-2 text-xs" style={{ color: 'var(--amber)' }}>
            Could add €1,000+/mo →
          </div>
        </Card>
      )}

      <Card>
        <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
          Income Goal
        </div>
        <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--gold-light)', lineHeight: 1 }}>
          €{userData.monthlyIncomeGoal.toLocaleString()}
        </div>
        <div className="text-xs mt-1.5" style={{ color: userData.monthlyIncomeGoal > (complete ? 3840 : userData.pillar1Total) ? 'var(--red)' : 'var(--green)' }}>
          {(() => {
            const projected = complete ? 3840 : userData.pillar1Total;
            const gap = userData.monthlyIncomeGoal - projected;
            return gap > 0 ? `−€${gap.toLocaleString()}/mo shortfall` : 'On track';
          })()}
        </div>
        <div className="mt-2">
          <Link href="/estimation" className="text-xs cursor-pointer underline underline-offset-2" style={{ color: 'var(--gold-light)' }}>
            View breakdown →
          </Link>
        </div>
      </Card>
    </div>
  );
}
