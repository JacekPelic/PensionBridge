'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePicture } from '@/modules/identity/PictureProvider';
import { useDataStage } from '@/modules/identity/DataStageProvider';
import { useUserData } from '@/modules/identity/UserDataProvider';
import { calculateTax } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';
import { BASE_TMI } from '@/modules/pension/constants';
import { estimate, countryAnchor } from './estimate';
import { QUESTIONS } from './questions';

/**
 * Compact picture strip for the dashboard.
 * The full picture + refinement lives on /picture.
 *
 * Numbers shown here are aligned with the dashboard's KPI cards and gap
 * surface so the whole dashboard tells a single story:
 *  - Before document upload (stage='before'): Pillar 1 gross → net at residence
 *  - After document upload  (stage='after'):  verified P1+P2 gross → net at residence
 *
 * Sharpness mirrors the same toggle — gold "sharpness" bar when rough,
 * green "verified" bar once documents are in. Outside the DataStageProvider
 * the default is 'before', so this is a no-op on surfaces that don't
 * expose the toggle.
 */
const VERIFIED_SHARPNESS = 95;

export function PictureSummary() {
  const { picture, mode } = usePicture();
  const { stage } = useDataStage();
  const { userData } = useUserData();
  const verified = stage === 'after';

  const est = useMemo(() => estimate(picture), [picture]);

  // Match KpiCards / RetirementGap exactly. Same gross input, same tax engine,
  // same net result — keeps every dashboard surface speaking with one number.
  const residence = (userData.residenceCountry ?? 'LU') as ResidenceCountry;
  const grossProjected = verified ? BASE_TMI : userData.pillar1Total;
  const { netAnnual } = calculateTax(grossProjected * 12, residence);
  const netProjected = Math.round(netAnnual / 12);
  const totalsReady = grossProjected > 0;

  const sharpness = verified ? VERIFIED_SHARPNESS : est.sharpness;
  const answeredCount = QUESTIONS.filter((q) => q.isAnswered(picture)).length;
  const openingComplete = answeredCount === QUESTIONS.length;

  const flags = est.bands.length > 0
    ? est.bands.map((b) => countryAnchor(b.country).flag)
    : picture.residenceCountry
      ? [countryAnchor(picture.residenceCountry).flag]
      : [];

  return (
    <div
      className="rounded-[14px] p-5 mb-5 flex items-center gap-5 flex-wrap"
      style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}
    >
      {/* Headline \u2014 picture status. The income answer itself lives in the gap
          card below, so this leads with "your picture" and keeps the figure
          secondary rather than competing with the gap hero. */}
      <div className="flex-1 min-w-[240px]">
        <div
          className="text-[12px] uppercase tracking-[0.14em] font-semibold mb-2 flex items-center gap-2 flex-wrap"
          style={{ color: 'var(--text-dim)' }}
        >
          <span>Your pension picture</span>
          <span
            className="text-[11px] font-bold px-2 py-[2px] rounded-[4px]"
            style={{
              background: verified ? 'var(--green-dim)' : 'var(--amber-dim)',
              color: verified ? 'var(--green)' : 'var(--amber)',
              letterSpacing: '0.04em',
            }}
          >
            {verified ? 'NET \u00B7 VERIFIED' : 'NET \u00B7 ESTIMATE'}
          </span>
        </div>
        {totalsReady ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="text-[20px] leading-none font-semibold"
              style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text)' }}
            >
              {'\u20AC'}{netProjected.toLocaleString()}
            </span>
            <span className="text-[13px]" style={{ color: 'var(--text-dim)' }}>/mo projected</span>
            <span className="text-[12.5px]" style={{ color: 'var(--text-dim)' }}>
              {'\u00B7'} {verified ? 'P1 + P2 verified' : 'Pillar 1 only \u2014 P2/P3 pending'}
            </span>
          </div>
        ) : (
          <div
            className="text-[18px] leading-snug font-semibold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text-dim)' }}
          >
            Answer a few questions to see your picture
          </div>
        )}
      </div>

      {/* Countries */}
      {flags.length > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 text-lg">
            {flags.map((f, i) => (
              <span key={i}>{f}</span>
            ))}
          </div>
          <span
            className="text-[12.5px]"
            style={{ color: 'var(--text-dim)' }}
          >
            {est.bands.length} {est.bands.length === 1 ? 'country' : 'countries'}
          </span>
        </div>
      )}

      {/* Sharpness */}
      <div className="shrink-0 flex items-center gap-2">
        <div
          className="w-[90px] h-2 rounded-full overflow-hidden"
          style={{ background: 'var(--navy-3)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${sharpness}%`,
              background: verified ? 'var(--green)' : 'var(--gold)',
            }}
          />
        </div>
        <span
          className="text-[12.5px] tabular-nums font-semibold"
          style={{
            color: verified ? 'var(--green)' : 'var(--gold-light)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {sharpness}%
        </span>
        <span className="text-[12.5px]" style={{ color: 'var(--text-dim)' }}>
          {verified ? 'verified' : 'sharpness'}
        </span>
      </div>

      {/* CTA */}
      <Link
        href="/picture"
        className="text-[13px] font-medium px-4 rounded-lg no-underline transition-all shrink-0 flex items-center"
        style={{
          minHeight: 44,
          background: openingComplete ? 'var(--navy-3)' : 'var(--gold)',
          border: openingComplete ? '1px solid var(--border)' : '1px solid var(--gold)',
          color: openingComplete ? 'var(--text-muted)' : 'var(--navy)',
        }}
      >
        {mode === 'mock'
          ? 'Open picture \u2192'
          : openingComplete
            ? 'Refine \u2192'
            : 'Continue building \u2192'}
      </Link>
    </div>
  );
}
