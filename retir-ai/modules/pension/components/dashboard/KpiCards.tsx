'use client';

import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { useDataStage } from '@/modules/identity/DataStageProvider';
import { useUserData } from '@/modules/identity/UserDataProvider';
import { calculateTax } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';
import { BASE_TMI } from '@/modules/pension/constants';

// Numeric KPI value — mono + tabular so the four cards align as a column of figures.
function Stat({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 28, fontWeight: 600, color, lineHeight: 1 }}>
      {children}
    </div>
  );
}

// Non-numeric placeholder value ("Pending", "Not tracked") — kept out of mono.
function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[22px] font-semibold" style={{ color: 'var(--text-dim)', lineHeight: 1.1 }}>
      {children}
    </div>
  );
}

const labelCls = 'text-[11.5px] uppercase tracking-wider font-medium mb-2.5';
const linkCls = 'inline-block mt-2.5 py-1 text-[13px] underline underline-offset-2 cursor-pointer';

export function KpiCards() {
  const { stage } = useDataStage();
  const { userData, isFromOnboarding } = useUserData();
  const complete = stage === 'after';

  // For real users coming out of onboarding, hide Mats-specific narrative
  // (gap counts, expected savings amounts, Swiss lump sum) — those are part
  // of the canned demo persona, not of a fresh user's actual data.
  const showMatsSpecifics = !isFromOnboarding;

  const numCountries = userData.countriesWorked.length;

  // Compute net amounts
  const residenceCountry = (userData.residenceCountry ?? 'LU') as ResidenceCountry;
  const grossProjected = complete ? BASE_TMI : userData.pillar1Total;
  const { netAnnual } = calculateTax(grossProjected * 12, residenceCountry);
  const netProjected = Math.round(netAnnual / 12);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <Card>
        <div className={labelCls} style={{ color: 'var(--text-dim)' }}>State Pension</div>
        <Stat color={complete ? 'var(--green)' : 'var(--text)'}>€{netProjected.toLocaleString()}</Stat>
        <div className="text-[12.5px] mt-2" style={{ color: complete ? 'var(--green)' : 'var(--text-muted)' }}>
          {complete ? `✓ verified · net · across ${numCountries} countries` : `estimated · net · across ${numCountries} countries`}
        </div>
      </Card>

      <Card>
        <div className={labelCls} style={{ color: 'var(--text-dim)' }}>Gaps Detected</div>
        {showMatsSpecifics ? (
          <>
            <Stat color="var(--red)">2</Stat>
            <div className="text-[12.5px] mt-2" style={{ color: 'var(--red)' }}>
              {complete ? '1 correctable + 1 freelance unverified' : '1 transition gap + 1 missing period'}
            </div>
            <Link href="/career" className={linkCls} style={{ color: 'var(--gold-light)' }}>View gaps →</Link>
          </>
        ) : (
          <>
            <Placeholder>Pending</Placeholder>
            <div className="text-[12.5px] mt-2" style={{ color: 'var(--text-muted)' }}>
              Upload pension documents to analyze gaps
            </div>
            <Link href="/career" className={linkCls} style={{ color: 'var(--gold-light)' }}>Add documents →</Link>
          </>
        )}
      </Card>

      {complete ? (
        <Card style={{ border: '1px solid var(--blue-dim)' }}>
          <Link href="/estimation" className="no-underline block">
            <div className={labelCls} style={{ color: 'var(--blue)' }}>Retirement Capital</div>
            <Stat color="var(--blue)">€210K</Stat>
            <div className="text-[12.5px] mt-2" style={{ color: 'var(--text-muted)' }}>Swiss workplace pension lump sum</div>
            <span className="inline-block mt-2.5 py-1 text-[13px] underline underline-offset-2" style={{ color: 'var(--blue)' }}>
              Model options →
            </span>
          </Link>
        </Card>
      ) : (
        <Card style={{ border: '1px solid var(--amber-dim)' }}>
          <div className={labelCls} style={{ color: 'var(--amber)' }}>Workplace &amp; Personal</div>
          <Placeholder>Not tracked</Placeholder>
          <div className="text-[12.5px] mt-2" style={{ color: 'var(--text-muted)' }}>
            {showMatsSpecifics ? 'Could add €1,000+/mo' : 'Add workplace pensions and personal savings'}
          </div>
          <Link href="/picture" className={linkCls} style={{ color: 'var(--amber)' }}>Complete your picture →</Link>
        </Card>
      )}

      <Card>
        <div className={labelCls} style={{ color: 'var(--text-dim)' }}>Income Goal</div>
        <Stat color="var(--gold-light)">€{userData.monthlyIncomeGoal.toLocaleString()}</Stat>
        <div className="text-[12.5px] mt-2" style={{ color: userData.monthlyIncomeGoal > netProjected ? 'var(--red)' : 'var(--green)' }}>
          {(() => {
            const gap = userData.monthlyIncomeGoal - netProjected;
            return gap > 0 ? `−€${gap.toLocaleString()}/mo shortfall` : 'On track';
          })()}
        </div>
        <Link href="/estimation" className={linkCls} style={{ color: 'var(--gold-light)' }}>View breakdown →</Link>
      </Card>
    </div>
  );
}
