'use client';

import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { useDataStage } from '@/modules/identity/DataStageProvider';
import { useUserData } from '@/modules/identity/UserDataProvider';
import { calculateTax } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';

export function KpiCards() {
  const { stage } = useDataStage();
  const { userData } = useUserData();
  const complete = stage === 'after';

  const numCountries = userData.countriesWorked.length;

  // Compute net amounts
  const residenceCountry = (userData.residenceCountry ?? 'LU') as ResidenceCountry;
  const grossProjected = complete ? 3840 : userData.pillar1Total;
  const { netAnnual } = calculateTax(grossProjected * 12, residenceCountry);
  const netProjected = Math.round(netAnnual / 12);

  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      <Card>
        <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
          State Pension
        </div>
        <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: complete ? 'var(--green)' : 'var(--text)', lineHeight: 1 }}>
          €{netProjected.toLocaleString()}
        </div>
        <div className="text-xs mt-1.5" style={{ color: complete ? 'var(--green)' : 'var(--text-muted)' }}>
          {complete ? `✓ verified · net · across ${numCountries} countries` : `estimated · net · across ${numCountries} countries`}
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
            <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>Swiss workplace pension lump sum</div>
            <div className="mt-2 text-xs underline underline-offset-2" style={{ color: 'var(--blue)' }}>
              Model options →
            </div>
          </Link>
        </Card>
      ) : (
        <Card style={{ border: '1px solid rgba(217,119,6,0.25)' }}>
          <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--amber)' }}>
            Workplace & Personal
          </div>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 700, color: 'var(--text-dim)', lineHeight: 1 }}>
            Not tracked
          </div>
          <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>Could add €1,000+/mo</div>
          <div className="mt-2">
            <Link href="/progress" className="text-xs cursor-pointer underline underline-offset-2" style={{ color: 'var(--amber)' }}>
              Complete your picture &rarr;
            </Link>
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
        <div className="text-xs mt-1.5" style={{ color: userData.monthlyIncomeGoal > netProjected ? 'var(--red)' : 'var(--green)' }}>
          {(() => {
            const gap = userData.monthlyIncomeGoal - netProjected;
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
