'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePicture } from '@/modules/identity/PictureProvider';
import { estimate, countryAnchor } from './estimate';
import { QUESTIONS } from './questions';

/**
 * Compact picture strip for the dashboard.
 * The full picture + refinement lives on /picture.
 */
export function PictureSummary() {
  const { picture, mode } = usePicture();

  const est = useMemo(() => estimate(picture), [picture]);
  const answeredCount = QUESTIONS.filter((q) => q.isAnswered(picture)).length;
  const openingComplete = answeredCount === QUESTIONS.length;

  // Show net when available; fall back to gross.
  const mult = est.net?.netMultiplier ?? 1;
  const p1LowGross = est.monthlyLow;
  const p1HighGross = est.monthlyHigh;
  const hasP2P3 = est.pillar2.length > 0 || est.pillar3 != null;
  const totalLow = Math.round((hasP2P3 ? est.totalMonthly : p1LowGross) * mult);
  const totalHigh = Math.round((hasP2P3 ? est.totalMonthly : p1HighGross) * mult);
  const totalsReady = est.monthlyHigh > 0;
  const isNet = est.net != null;

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
      {/* Headline range */}
      <div className="flex-1 min-w-[240px]">
        <div
          className="text-[10.5px] uppercase tracking-[0.14em] font-semibold mb-1 flex items-center gap-2"
          style={{ color: 'var(--text-dim)' }}
        >
          <span>Projected income at retirement</span>
          {isNet && (
            <span
              className="text-[9.5px] font-bold px-1.5 py-[1px] rounded-[4px]"
              style={{ background: 'var(--green-dim)', color: 'var(--green)', letterSpacing: '0.04em' }}
            >
              NET
            </span>
          )}
        </div>
        {totalsReady ? (
          hasP2P3 ? (
            <div
              className="text-[26px] leading-none font-semibold tabular-nums"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
            >
              {'\u20AC'}{totalLow.toLocaleString()}
              <span className="text-[12px] font-normal ml-2" style={{ color: 'var(--text-dim)' }}>
                /mo
              </span>
            </div>
          ) : (
            <div
              className="text-[26px] leading-none font-semibold tabular-nums"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
            >
              <span>{'\u20AC'}{totalLow.toLocaleString()}</span>
              <span style={{ color: 'var(--text-dim)' }} className="px-2">
                {'\u2014'}
              </span>
              <span>{'\u20AC'}{totalHigh.toLocaleString()}</span>
              <span
                className="text-[12px] font-normal ml-2"
                style={{ color: 'var(--text-dim)' }}
              >
                /mo
              </span>
            </div>
          )
        ) : (
          <div
            className="text-[22px] leading-none font-semibold"
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
            className="text-[11px]"
            style={{ color: 'var(--text-dim)' }}
          >
            {est.bands.length} {est.bands.length === 1 ? 'country' : 'countries'}
          </span>
        </div>
      )}

      {/* Sharpness */}
      <div className="shrink-0 flex items-center gap-2">
        <div
          className="w-[90px] h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--navy-3)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${est.sharpness}%`,
              background: 'linear-gradient(90deg, var(--gold), #f1c889)',
            }}
          />
        </div>
        <span
          className="text-[11.5px] tabular-nums font-semibold"
          style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-mono)' }}
        >
          {est.sharpness}%
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
          sharpness
        </span>
      </div>

      {/* CTA */}
      <Link
        href="/picture"
        className="text-[12px] font-medium px-3.5 py-2 rounded-lg no-underline transition-all shrink-0"
        style={{
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
