'use client';

import Link from 'next/link';
import { Pill } from '@/components/ui/Pill';
import { useDataStage } from '@/providers/DataStageProvider';
import { useUserData } from '@/providers/UserDataProvider';
import { COUNTRY_META } from '@/lib/pension';

const COLORS: Record<string, string> = { FR: '#3ecf8e', CH: 'var(--blue)', LU: 'var(--amber)' };

export function TmiHero() {
  const { stage } = useDataStage();
  const { userData } = useUserData();
  const complete = stage === 'after';

  const p1Total = userData.pillar1Total;
  const estimates = userData.pillar1Estimates;
  const numCountries = userData.countriesWorked.length;

  // "After" values remain hardcoded (document-verified scenario)
  const afterTotal = '€3,840';

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
          {complete ? afterTotal : `€${p1Total.toLocaleString()}`}
        </span>
        <span className="text-2xl" style={{ color: 'var(--text-muted)' }}>/ month</span>
        {!complete && (
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.25)' }}>
            Pillar 1 only
          </span>
        )}
      </div>
      <div className="text-[13px] max-w-[420px]" style={{ color: 'var(--text-muted)' }}>
        {complete
          ? `Verified across ${numCountries} countries with official documents. Includes Pillar 1, Pillar 2, and private savings. ±3% accuracy.`
          : `Based on Pillar 1 (state pension) estimates across ${numCountries} countries. Pillar 2 and private savings are not yet included — upload documents to complete your picture.`}
      </div>
      {complete && (
        <Link
          href="/estimation"
          className="block text-[13px] mt-1.5 mb-0.5 cursor-pointer no-underline"
          style={{ color: 'var(--blue)' }}
        >
          + €210K available as Swiss P2 lump sum →
        </Link>
      )}

      <div className="flex gap-2.5 mt-4 flex-wrap">
        {complete ? (
          <>
            <Pill variant="green">✓ France: Verified</Pill>
            <Pill variant="green">✓ Switzerland P1: Verified</Pill>
            <Pill variant="green">✓ Switzerland P2: Located</Pill>
            <Pill variant="green">✓ Luxembourg: Verified</Pill>
            <Link href="/estimation">
              <Pill variant="blue" className="cursor-pointer">🏦 €210K Capital Option</Pill>
            </Link>
          </>
        ) : (
          <>
            <Pill variant="amber">◎ Pillar 1 only — P2 & P3 not yet tracked</Pill>
            <Pill variant="red">! 1 Gap + 1 Missing period</Pill>
          </>
        )}
      </div>

      {/* Breakdown */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 hidden lg:flex">
        <div className="text-[11px] uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-dim)' }}>
          {complete ? 'Breakdown' : 'Pillar 1 Breakdown'}
        </div>
        {complete ? (
          <>
            {[
              { color: '#3ecf8e', label: 'France', value: '€1,500' },
              { color: 'var(--blue)', label: 'Switzerland', value: '€1,360' },
              { color: 'var(--amber)', label: 'Luxembourg', value: '€980' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: row.color }} />
                <div className="text-xs w-[110px]" style={{ color: 'var(--text-muted)' }}>{row.label}</div>
                <div className="text-[13px] font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                  {row.value}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {estimates.map((est) => {
              const meta = COUNTRY_META[est.country];
              return (
                <div key={est.country} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[est.country] || 'var(--text-dim)' }} />
                  <div className="text-xs w-[110px]" style={{ color: 'var(--text-muted)' }}>{meta.name} P1</div>
                  <div className="text-[13px] font-medium" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                    €{est.monthlyPensionEur.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </>
        )}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--gold)' }} />
          <div className="text-xs w-[110px] font-bold" style={{ color: 'var(--text-muted)' }}>{complete ? 'Total' : 'P1 Total'}</div>
          <div className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>
            {complete ? afterTotal : `€${p1Total.toLocaleString()}`}
          </div>
        </div>
        {!complete && (
          <div className="flex items-center gap-2.5 mt-1">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--navy-3)', border: '1px dashed var(--text-dim)' }} />
            <div className="text-xs w-[110px]" style={{ color: 'var(--text-dim)' }}>P2 + P3</div>
            <div className="text-[13px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              — not yet tracked
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
