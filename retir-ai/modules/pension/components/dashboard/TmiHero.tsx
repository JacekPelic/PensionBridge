'use client';

import Link from 'next/link';
import { Pill } from '@/shared/ui/Pill';
import { useDataStage } from '@/modules/identity/DataStageProvider';
import { useUserData } from '@/modules/identity/UserDataProvider';
import { COUNTRY_META } from '@/modules/pension';
import { calculateTax, RESIDENCE_META } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';

const COLORS: Record<string, string> = { FR: '#3ecf8e', CH: 'var(--blue)', LU: 'var(--amber)' };

export function TmiHero() {
  const { stage } = useDataStage();
  const { userData } = useUserData();
  const complete = stage === 'after';

  const p1Total = userData.pillar1Total;
  const estimates = userData.pillar1Estimates;
  const numCountries = userData.countriesWorked.length;

  // "After" gross values (document-verified scenario)
  const afterGross = 3840;
  const afterBreakdownGross = { France: 1500, Switzerland: 1360, Luxembourg: 980 };

  // Compute net amounts
  const residenceCountry = (userData.residenceCountry ?? 'LU') as ResidenceCountry;
  const resMeta = RESIDENCE_META[residenceCountry];
  const grossProjected = complete ? afterGross : p1Total;
  const { netAnnual, effectiveRate } = calculateTax(grossProjected * 12, residenceCountry);
  const netProjected = Math.round(netAnnual / 12);

  // Net per-country breakdown for "after" state (proportional allocation)
  const afterBreakdownNet = Object.fromEntries(
    Object.entries(afterBreakdownGross).map(([country, gross]) => {
      const share = afterGross > 0 ? gross / afterGross : 0;
      return [country, Math.round(netProjected * share)];
    }),
  );

  // Net per-country for "before" state (P1 estimates)
  const p1EstimateNets = estimates.map((est) => {
    const share = p1Total > 0 ? est.monthlyPensionEur / p1Total : 0;
    return { ...est, netMonthly: Math.round(netProjected * share) };
  });

  return (
    <div
      className="rounded-[18px] p-8 relative overflow-hidden mb-5"
      style={{
        background: 'linear-gradient(135deg, var(--navy-3) 0%, var(--navy-4) 100%)',
        border: '1px solid var(--gold-border)',
      }}
    >
      {/* Glow */}
      <div
        className="absolute rounded-full"
        style={{
          top: -40, right: -40, width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--gold)' }}>
        Projected Total Monthly Income at Retirement
      </div>
      <div className="my-2 flex items-baseline gap-3">
        <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 54, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>
          €{netProjected.toLocaleString()}
        </span>
        <span className="text-2xl" style={{ color: 'var(--text-muted)' }}>/ month net</span>
        <Link
          href="/simulation"
          className="text-[11px] px-2.5 py-1 rounded-full no-underline cursor-pointer transition-all hover:opacity-80"
          style={{ background: 'var(--navy-4)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          {resMeta.flag} Net in {resMeta.name}
        </Link>
        {!complete && (
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.25)' }}>
            State pension only
          </span>
        )}
      </div>
      <div className="text-[13px] max-w-[420px]" style={{ color: 'var(--text-muted)' }}>
        {complete
          ? `Verified across ${numCountries} countries with official documents. Includes state, workplace, and personal pensions. ±3% accuracy.`
          : `Based on state pension estimates across ${numCountries} countries.`}
        {' '}€{grossProjected.toLocaleString()} gross · {Math.round(effectiveRate * 100)}% effective tax.
      </div>
      {complete && (
        <Link
          href="/estimation"
          className="block text-[13px] mt-1.5 mb-0.5 cursor-pointer no-underline"
          style={{ color: 'var(--blue)' }}
        >
          + €210K available as Swiss workplace pension lump sum →
        </Link>
      )}

      <div className="flex gap-2.5 mt-4 flex-wrap">
        {complete ? (
          <>
            <Pill variant="green">✓ France: Verified</Pill>
            <Pill variant="green">✓ Switzerland State: Verified</Pill>
            <Pill variant="green">✓ Switzerland Workplace: Located</Pill>
            <Pill variant="green">✓ Luxembourg: Verified</Pill>
            <Link href="/estimation">
              <Pill variant="blue" className="cursor-pointer">🏦 €210K Capital Option</Pill>
            </Link>
          </>
        ) : (
          <>
            {p1EstimateNets.map((est) => {
              const meta = COUNTRY_META[est.country];
              return (
                <Pill key={est.country} variant="amber">
                  {meta.flag} {meta.name}: €{est.netMonthly.toLocaleString()}/mo net
                </Pill>
              );
            })}
          </>
        )}
      </div>

      {/* Breakdown */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 hidden lg:flex">
        <div className="text-[11px] uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-dim)' }}>
          {complete ? 'Breakdown' : 'State Pension Breakdown'}
        </div>
        {complete ? (
          <>
            {[
              { color: '#3ecf8e', label: 'France', value: afterBreakdownNet['France'] },
              { color: 'var(--blue)', label: 'Switzerland', value: afterBreakdownNet['Switzerland'] },
              { color: 'var(--amber)', label: 'Luxembourg', value: afterBreakdownNet['Luxembourg'] },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: row.color }} />
                <div className="text-xs w-[110px]" style={{ color: 'var(--text-muted)' }}>{row.label}</div>
                <div className="text-[13px] font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                  €{row.value.toLocaleString()}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {p1EstimateNets.map((est) => {
              const meta = COUNTRY_META[est.country];
              return (
                <div key={est.country} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[est.country] || 'var(--text-dim)' }} />
                  <div className="text-xs w-[110px]" style={{ color: 'var(--text-muted)' }}>{meta.name}</div>
                  <div className="text-[13px] font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                    €{est.netMonthly.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </>
        )}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--gold)' }} />
          <div className="text-xs w-[110px] font-bold" style={{ color: 'var(--text-muted)' }}>{complete ? 'Total' : 'State Total'}</div>
          <div className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>
            €{netProjected.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
