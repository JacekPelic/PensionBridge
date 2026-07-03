'use client';

import { useDataStage } from '@/modules/identity/DataStageProvider';
import { useUserData } from '@/modules/identity/UserDataProvider';
import { calculateTax } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';
import { BASE_TMI } from '@/modules/pension/constants';
import type { Estimate, CountryBand, Pillar2Row, Pillar3Row } from './estimate';

interface PicturePreviewProps {
  estimate: Estimate;
  /**
   * When true, forces the "ESTIMATE" labeling regardless of the global
   * DataStage toggle, and uses the estimate midpoint as the displayed gross
   * (instead of the dashboard's BASE_TMI alignment). Use at onboarding
   * completion — at that point the user has only answered questions; nothing
   * has been uploaded or verified, so claiming "VERIFIED" would be dishonest.
   */
  forceUnverified?: boolean;
}

const COUNTRY_COLORS: Record<string, string> = {
  LU: '#d4a574',
  FR: '#5b8def',
  CH: '#ef4444',
  DE: '#fbbf24',
  BE: '#a78bfa',
  IT: '#3ecf8e',
  ES: '#f97316',
  PT: '#22d3ee',
  NL: '#f472b6',
};

export function PicturePreview({ estimate, forceUnverified = false }: PicturePreviewProps) {
  const {
    monthlyLow,
    monthlyHigh,
    bands,
    pillar2,
    pillar3,
    net,
    sharpness,
    insight,
  } = estimate;

  // Verification state. In onboarding (forceUnverified=true) we ignore the
  // global DataStage toggle because the user has only answered questions —
  // nothing has actually been verified. Elsewhere, the toggle drives whether
  // the headline matches the dashboard's "before / after docs" view.
  const { stage } = useDataStage();
  const { userData } = useUserData();
  const verified = forceUnverified ? false : stage === 'after';
  const residence = (userData.residenceCountry ?? 'LU') as ResidenceCountry;
  // Pick the gross figure powering the headline net.
  // - Onboarding: midpoint of the user's own P1 estimate range (their answers).
  // - Dashboard before docs: the same gross KpiCards uses.
  // - Dashboard after docs: BASE_TMI (canonical verified gross).
  const estimateMidGross = (monthlyLow + monthlyHigh) / 2;
  const alignedGross = forceUnverified
    ? Math.round(estimateMidGross)
    : verified
      ? BASE_TMI
      : userData.pillar1Total;
  const alignedTax = calculateTax(alignedGross * 12, residence);
  const alignedNet = Math.round(alignedTax.netAnnual / 12);
  const alignedEffectivePct = Math.round(alignedTax.effectiveRate * 100);

  const hasData = monthlyHigh > 0;
  const hasP2 = pillar2.length > 0;
  const hasP3 = pillar3 != null && pillar3.monthlyEur > 0;

  const mult = net?.netMultiplier ?? 1;

  const p1LowNet = Math.round(monthlyLow * mult);
  const p1HighNet = Math.round(monthlyHigh * mult);

  const p2TotalGross = pillar2.reduce((s, r) => s + r.monthlyEur, 0);
  const p2TotalNet = Math.round(p2TotalGross * mult);

  const p3TotalGross = pillar3?.monthlyEur ?? 0;
  const p3TotalNet = Math.round(p3TotalGross * mult);

  return (
    <div
      className="rounded-[14px] p-6 lg:p-7 flex flex-col gap-5"
      style={{ background: 'var(--navy-2)', border: '1px solid var(--border)' }}
    >
      {/* Top row — total + sharpness */}
      <div className="flex items-start justify-between gap-8 flex-wrap">
        <div className="min-w-[260px]">
          <div
            className="text-[12px] uppercase tracking-[0.14em] font-semibold mb-2 flex items-center gap-2 flex-wrap"
            style={{ color: 'var(--text-dim)' }}
          >
            <span>Your monthly income at retirement</span>
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
          {hasData ? (
            <>
              {/* Floor reframe (estimate mode): the number counts Pillar 1 only,
                  so workplace + personal can only add to it \u2014 present it as a
                  floor ("at least"), never a vague verdict. */}
              {!verified && (
                <div className="text-[14px] mb-1" style={{ color: 'var(--text-muted)' }}>
                  You&apos;re on track for <strong style={{ color: 'var(--text)' }}>at least</strong>:
                </div>
              )}
              <div
                className="text-[40px] leading-none font-semibold tabular-nums"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}
              >
                {'\u20AC'}{alignedNet.toLocaleString()}
                <span className="text-[14px] font-normal ml-2" style={{ color: 'var(--text-dim)' }}>
                  /mo
                </span>
              </div>
            </>
          ) : (
            <div
              className="text-[30px] leading-none font-semibold"
              style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text-dim)' }}
            >
              {'\u20AC'} ? {'\u2014'} {'\u20AC'} ?
            </div>
          )}
          {hasData && (
            <div className="text-[12px] mt-2 flex items-center gap-3 flex-wrap" style={{ color: 'var(--text-dim)' }}>
              <span>
                after {alignedEffectivePct}% tax
                {' '}{'\u00B7'}{' '}
                <span style={{ color: 'var(--text-muted)' }}>
                  {'\u20AC'}{alignedGross.toLocaleString()}/mo gross
                </span>
              </span>
              {verified ? (
                <span>{'\u00B7'} P1 + P2 verified</span>
              ) : (
                <span style={{ color: 'var(--green)' }}>
                  {'\u00B7'} Workplace &amp; personal pensions only add to this
                </span>
              )}
            </div>
          )}
          {!hasData && (
            <div className="text-[11.5px] mt-2" style={{ color: 'var(--text-dim)' }}>
              Answer a few questions to see your starting picture.
            </div>
          )}
        </div>

        {/* Confidence band — was "Sharpness" */}
        <div className="min-w-[240px] flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 w-full">
            <span
              className="text-[10.5px] uppercase tracking-[0.14em] font-semibold"
              style={{ color: 'var(--text-dim)' }}
            >
              Confidence
            </span>
            <span
              className="text-[12px] tabular-nums font-semibold ml-auto"
              style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-mono)' }}
            >
              {hasData
                ? `\u00B1\u20AC${roundBand(
                    (monthlyHigh - monthlyLow) / 2 * mult,
                  ).toLocaleString()}/mo`
                : '\u2014'}
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden w-full"
            style={{ background: 'var(--navy-3)' }}
            title="How tight the band is. Closer to full = a narrower range."
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.max(0, Math.min(100, sharpness))}%`,
                background: 'var(--gold)',
              }}
            />
          </div>
          <div className="text-[11px] leading-snug" style={{ color: 'var(--text-dim)' }}>
            {nextActionHint({ bands, hasP2, hasP3, hasData })}
          </div>
        </div>
      </div>

      {/* P1 — state pension bands */}
      <PillarSection
        label="State pension"
        sublabel={
          bands.length === 0
            ? undefined
            : net
              ? `\u20AC${p1LowNet.toLocaleString()}\u2013${p1HighNet.toLocaleString()}/mo net`
              : `\u20AC${Math.round(monthlyLow).toLocaleString()}\u2013${Math.round(monthlyHigh).toLocaleString()}/mo gross`
        }
        color="var(--gold)"
      >
        {bands.length > 0 ? (
          <P1Bands bands={bands} netMultiplier={mult} />
        ) : (
          <div
            className="rounded-md border border-dashed h-16 flex items-center justify-center text-[12px]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}
          >
            Country pension bands will appear here.
          </div>
        )}
      </PillarSection>

      {/* P2 — workplace pensions */}
      {hasP2 && (
        <PillarSection
          label="Workplace pensions"
          sublabel={
            net
              ? `\u20AC${p2TotalNet.toLocaleString()}/mo net`
              : `\u20AC${p2TotalGross.toLocaleString()}/mo gross`
          }
          color="var(--blue, #5b8def)"
        >
          <div className="flex flex-col gap-2">
            {pillar2.map((row) => (
              <P2RowDisplay key={row.askId} row={row} netMultiplier={mult} showNet={net != null} />
            ))}
          </div>
        </PillarSection>
      )}

      {/* P3 — personal savings */}
      {hasP3 && pillar3 && (
        <PillarSection
          label="Personal savings"
          sublabel={
            net
              ? `\u20AC${p3TotalNet.toLocaleString()}/mo net`
              : `\u20AC${p3TotalGross.toLocaleString()}/mo gross`
          }
          color="var(--green)"
        >
          <P3RowDisplay row={pillar3} netMultiplier={mult} showNet={net != null} />
        </PillarSection>
      )}

      {/* Insight */}
      {insight && (
        <div
          className="rounded-lg p-3.5"
          style={{
            background: hasData ? 'var(--gold-dim)' : 'var(--navy-3)',
            border: hasData
              ? '1px solid var(--gold-border, rgba(212,165,116,0.3))'
              : '1px solid var(--border)',
          }}
        >
          <div
            className="text-[10.5px] uppercase tracking-[0.14em] font-semibold mb-1"
            style={{ color: hasData ? 'var(--gold-light)' : 'var(--text-dim)' }}
          >
            What this means
          </div>
          <div
            className="text-[13px] leading-relaxed"
            style={{ color: 'var(--text)' }}
            key={insight}
          >
            {insight}
          </div>
        </div>
      )}
    </div>
  );
}

/** Round a ± band to a calm, human-readable step (nearest €50 / €100). */
function roundBand(n: number): number {
  if (n <= 0) return 0;
  const step = n < 500 ? 50 : 100;
  return Math.max(step, Math.round(n / step) * step);
}

/**
 * One specific, actionable next step the user could take to tighten the band.
 * Chooses the highest-impact missing piece rather than a generic "add more".
 */
function nextActionHint({
  bands,
  hasP2,
  hasP3,
  hasData,
}: {
  bands: CountryBand[];
  hasP2: boolean;
  hasP3: boolean;
  hasData: boolean;
}): string {
  if (!hasData) return 'Answer a few questions to see your starting range.';
  const bandsWithoutYears = bands.filter((b) => !b.years || b.years === 0);
  if (bandsWithoutYears.length > 0) {
    return `Add your years in ${bandsWithoutYears[0].name} to tighten this.`;
  }
  const unverified = bands.filter((b) => !b.verified);
  if (!hasP2) return 'Add your workplace pensions to tighten this.';
  if (!hasP3) return 'Add your personal savings to complete the picture.';
  if (unverified.length > 0) {
    return `Upload your ${unverified[0].name} career extract to verify.`;
  }
  return 'All sources verified \u2014 the range is as tight as it gets.';
}

// ─── Pillar section frame ───────────────────────────────────────────

function PillarSection({
  label,
  sublabel,
  color,
  children,
}: {
  label: string;
  sublabel?: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
        <div
          className="text-[10.5px] uppercase tracking-[0.14em] font-semibold"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            className="text-[11px] tabular-nums ml-auto"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            {sublabel}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── P1 country bands ───────────────────────────────────────────────

function P1Bands({ bands, netMultiplier }: { bands: CountryBand[]; netMultiplier: number }) {
  const maxBandHigh = Math.max(1, ...bands.map((b) => b.high));
  return (
    <div className="flex flex-col gap-2">
      {bands.map((band) => {
        const color = COUNTRY_COLORS[band.country] ?? 'var(--text-muted)';
        const widthPct = Math.max(8, (band.high / maxBandHigh) * 100);
        const filledPct = band.high > 0 ? (band.low / band.high) * 100 : 0;
        const lowDisplay = Math.round(band.low * netMultiplier);
        const highDisplay = Math.round(band.high * netMultiplier);
        return (
          <div key={band.country} className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-[150px] shrink-0">
              <span className="text-base">{band.flag}</span>
              <span
                className="text-[12px] font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {band.name}
              </span>
              {band.verified && (
                <span
                  className="text-[9px] font-semibold px-1.5 py-[1px] rounded flex items-center gap-0.5"
                  style={{ background: 'var(--green-dim)', color: 'var(--green)' }}
                  title="Verified from documents"
                >
                  {'\u2713'} verified
                </span>
              )}
              {!band.verified && band.fromEngine && (
                <span
                  className="text-[9px] font-semibold px-1.5 py-[1px] rounded"
                  style={{ background: 'var(--navy-3)', color: 'var(--text-dim)' }}
                  title="Calculated by the real engine"
                >
                  engine
                </span>
              )}
            </div>
            <div
              className="flex-1 h-6 rounded-md relative overflow-hidden"
              style={{ background: 'var(--navy-3)' }}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-md transition-all duration-500"
                style={{
                  width: `${widthPct}%`,
                  background: `${color}33`,
                  borderRight: `1px solid ${color}66`,
                }}
              />
              <div
                className="absolute left-0 top-0 h-full rounded-md transition-all duration-500"
                style={{
                  width: `${(widthPct * filledPct) / 100}%`,
                  background: `${color}99`,
                }}
              />
            </div>
            <div
              className="text-[11px] tabular-nums w-[120px] text-right shrink-0"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              {'\u20AC'}{lowDisplay.toLocaleString()}{'\u2013'}{highDisplay.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── P2 row display ─────────────────────────────────────────────────

function P2RowDisplay({
  row,
  netMultiplier,
  showNet,
}: {
  row: Pillar2Row;
  netMultiplier: number;
  showNet: boolean;
}) {
  const display = Math.round(row.monthlyEur * netMultiplier);
  return (
    <div
      className="flex items-center gap-3 rounded-md px-3 py-2"
      style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
    >
      <span className="text-base shrink-0">{row.flag}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium truncate" style={{ color: 'var(--text)' }}>
          {row.label}
        </div>
      </div>
      <div
        className="text-[12px] tabular-nums shrink-0"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {'\u20AC'}{display.toLocaleString()}/mo
        <span className="text-[10px] ml-1" style={{ color: 'var(--text-dim)' }}>
          {showNet ? 'net' : 'gross'}
        </span>
      </div>
    </div>
  );
}

// ─── P3 row display ─────────────────────────────────────────────────

function P3RowDisplay({
  row,
  netMultiplier,
  showNet,
}: {
  row: Pillar3Row;
  netMultiplier: number;
  showNet: boolean;
}) {
  const display = Math.round(row.monthlyEur * netMultiplier);
  return (
    <div
      className="flex items-center gap-3 rounded-md px-3 py-2"
      style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
    >
      <span className="text-base shrink-0">{'\u{1F4B0}'}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>
          Private savings
        </div>
        <div className="text-[10.5px]" style={{ color: 'var(--text-dim)' }}>
          {'\u20AC'}{row.balance.toLocaleString()} today
          {row.monthlyContribution > 0 && ` + \u20AC${row.monthlyContribution}/mo`}
          {' '}{'\u00B7'} {row.yearsToRetire}yr horizon {'\u00B7'} {row.growthAssumption}% p.a.
        </div>
      </div>
      <div
        className="text-[12px] tabular-nums shrink-0"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {'\u20AC'}{display.toLocaleString()}/mo
        <span className="text-[10px] ml-1" style={{ color: 'var(--text-dim)' }}>
          {showNet ? 'net' : 'gross'}
        </span>
      </div>
    </div>
  );
}
