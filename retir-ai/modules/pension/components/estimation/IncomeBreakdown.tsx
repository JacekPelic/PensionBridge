'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import type { Country } from '@/shared/types';
import { simulateResidence, RESIDENCE_META } from '@/modules/tax';
import type { ResidenceCountry } from '@/modules/tax';
import { useUserData } from '@/modules/identity/UserDataProvider';

type Status = 'verified' | 'estimated' | 'unconfirmed' | 'self-reported' | 'not_tracked';
type ViewMode = 'net' | 'gross';

interface FundEntry {
  institution: string;
  pillar: 'P1' | 'P2' | 'P3';
  monthlyPayout: number;
  period: string;
  years: number;
  status: Status;
  capitalOption?: number;
  notes?: string;
  sourceCountry: Country;
}

interface CountryFunds {
  country: string;
  flag: string;
  total: number;
  funds: FundEntry[];
}

interface Props {
  /** Callback to parent with net monthly total */
  onNetComputed?: (netMonthly: number) => void;
}

const statusStyle: Record<Status, { color: string; bg: string; label: string }> = {
  verified:      { color: 'var(--green)', bg: 'var(--green-dim)', label: 'Verified' },
  estimated:     { color: 'var(--amber)', bg: 'var(--amber-dim)', label: 'Estimated' },
  unconfirmed:   { color: 'var(--amber)', bg: 'var(--amber-dim)', label: 'Unconfirmed' },
  'self-reported': { color: 'var(--amber)', bg: 'var(--amber-dim)', label: 'Self-reported' },
  not_tracked:   { color: 'var(--red)', bg: 'var(--red-dim)', label: 'Not tracked' },
};

const fundData: CountryFunds[] = [
  {
    country: 'France',
    flag: '🇫🇷',
    total: 1500,
    funds: [
      { institution: 'CNAV (Caisse Nationale d\'Assurance Vieillesse)', pillar: 'P1', monthlyPayout: 1220, period: 'Sep 2003 – Jul 2013', years: 10.9, status: 'verified', sourceCountry: 'FR', notes: 'Régime général · based on best 25 years SAM' },
      { institution: 'AGIRC-ARRCO', pillar: 'P2', monthlyPayout: 280, period: 'Sep 2003 – Jul 2013', years: 10.9, status: 'verified', sourceCountry: 'FR', notes: 'Compulsory complementary · points-based system' },
      { institution: 'Private savings (PER / Assurance-vie)', pillar: 'P3', monthlyPayout: 0, period: '—', years: 0, status: 'not_tracked', sourceCountry: 'FR', notes: 'No personal savings detected — upload or add manually' },
    ],
  },
  {
    country: 'Switzerland',
    flag: '🇨🇭',
    total: 1360,
    funds: [
      { institution: 'AVS/AHV (Federal Old Age Insurance)', pillar: 'P1', monthlyPayout: 320, period: 'Sep 2014 – Dec 2019', years: 5.3, status: 'verified', sourceCountry: 'CH', notes: 'Partial pension · 5.3 of 44 contribution years' },
      { institution: 'UBS Pension Fund (BVG/LPP)', pillar: 'P2', monthlyPayout: 1040, period: 'Sep 2014 – Dec 2019', years: 5.3, status: 'verified', sourceCountry: 'CH', capitalOption: 210000, notes: 'Occupational pension · capital or annuity option available' },
      { institution: 'Personal savings 3a (tax-privileged)', pillar: 'P3', monthlyPayout: 0, period: '—', years: 0, status: 'not_tracked', sourceCountry: 'CH', notes: 'No personal savings account detected — common for cross-border workers' },
    ],
  },
  {
    country: 'Luxembourg',
    flag: '🇱🇺',
    total: 980,
    funds: [
      { institution: 'CNAP (Caisse Nationale d\'Assurance Pension)', pillar: 'P1', monthlyPayout: 980, period: 'Apr 2020 – present', years: 6.0, status: 'estimated', sourceCountry: 'LU', notes: 'Flat-rate + proportional formula · EU totalisation applies' },
      { institution: 'Employer pension scheme (unknown provider)', pillar: 'P2', monthlyPayout: 280, period: 'Apr 2020 – present', years: 6.0, status: 'unconfirmed', sourceCountry: 'LU', notes: 'Estimated from typical employer scheme — upload pension fund statement to verify' },
      { institution: 'Foyer Prévoyance-vieillesse (Art. 111bis)', pillar: 'P3', monthlyPayout: 220, period: '2021 – present', years: 5.0, status: 'self-reported', sourceCountry: 'LU', notes: 'Tax-advantaged private pension · up to €3,200/yr deductible' },
    ],
  },
];

export function IncomeBreakdown({ onNetComputed }: Props) {
  const { userData } = useUserData();
  const residenceCountry = (userData.residenceCountry ?? 'LU') as ResidenceCountry;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('net');

  // Build pension sources from fund data for tax calculation
  const taxResult = useMemo(() => {
    const sources = fundData
      .flatMap((c) => c.funds)
      .filter((f) => f.monthlyPayout > 0)
      .map((f) => ({
        sourceCountry: f.sourceCountry,
        label: f.institution,
        grossMonthly: f.monthlyPayout,
      }));
    return simulateResidence(sources, residenceCountry);
  }, [residenceCountry]);

  // Notify parent of net total
  useEffect(() => {
    onNetComputed?.(taxResult.netMonthly);
  }, [taxResult.netMonthly, onNetComputed]);

  // Build a lookup: institution -> net monthly
  const netByInstitution = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of taxResult.perSource) {
      map.set(s.label, s.netMonthly);
    }
    return map;
  }, [taxResult]);

  const isNet = viewMode === 'net';
  const displayTotal = isNet ? taxResult.netMonthly : taxResult.grossMonthly;
  const resMeta = RESIDENCE_META[residenceCountry];

  // Compute net country totals
  const countryNetTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const c of fundData) {
      totals[c.country] = c.funds.reduce(
        (sum, f) => sum + (netByInstitution.get(f.institution) ?? f.monthlyPayout),
        0,
      );
    }
    return totals;
  }, [netByInstitution]);

  // Compute net pillar totals
  const pillarNetTotals = useMemo(() => {
    const totals: Record<string, number> = { P1: 0, P2: 0, P3: 0 };
    for (const c of fundData) {
      for (const f of c.funds) {
        totals[f.pillar] += netByInstitution.get(f.institution) ?? f.monthlyPayout;
      }
    }
    return totals;
  }, [netByInstitution]);

  return (
    <Card className="mb-5">
      {/* Header with total + controls */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2.5">
        <div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Income Breakdown</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Where each euro of your pension comes from</div>
        </div>
        <div className="flex items-center gap-4">
          {/* Gross/Net toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {(['net', 'gross'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-3 py-1.5 text-[11px] font-medium cursor-pointer transition-all capitalize"
                style={{
                  background: viewMode === mode ? 'var(--gold-dim)' : 'var(--navy-3)',
                  color: viewMode === mode ? 'var(--gold-light)' : 'var(--text-dim)',
                  border: 'none',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)' }}>€{displayTotal.toLocaleString()}</span>
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>/ month {isNet ? 'net' : 'gross'}</span>
            </div>
            {isNet && (
              <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                €{taxResult.grossMonthly.toLocaleString()} gross · {Math.round(taxResult.effectiveRate * 100)}% effective tax
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Residence country indicator */}
      <div className="flex items-center gap-2.5 mb-5 p-3 rounded-lg" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
        <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>Tax residence</span>
        <span className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>
          {resMeta.flag} {resMeta.name}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
          {resMeta.regime}
        </span>
        <Link
          href="/simulation"
          className="ml-auto text-[11px] no-underline cursor-pointer hover:opacity-80 transition-all"
          style={{ color: 'var(--blue)' }}
        >
          Compare countries &rarr;
        </Link>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        {/* By Country */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-dim)' }}>By country</div>
          {[
            { flag: '🇫🇷', label: 'France', grossAmount: 1500, color: '#3ecf8e' },
            { flag: '🇨🇭', label: 'Switzerland', grossAmount: 1360, color: 'var(--blue)' },
            { flag: '🇱🇺', label: 'Luxembourg', grossAmount: 980, color: 'var(--amber)', note: '+~€500 unconf.' },
          ].map((row) => {
            const amount = isNet ? (countryNetTotals[row.label] ?? row.grossAmount) : row.grossAmount;
            const pct = displayTotal > 0 ? Math.round((amount / displayTotal) * 100) : 0;
            return (
              <div key={row.label} className="mb-2.5">
                <div className="flex justify-between items-baseline mb-[5px]">
                  <span className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>{row.flag} {row.label}</span>
                  <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                    €{amount.toLocaleString()} {row.note && !isNet && <span style={{ color: 'var(--amber)', fontWeight: 400 }}>{row.note}</span>}
                  </span>
                </div>
                <div className="h-2.5 rounded-[5px] overflow-hidden" style={{ background: 'var(--navy-3)' }}>
                  <div className="h-full rounded-[5px]" style={{ width: `${pct}%`, background: row.color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* By Pillar */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-dim)' }}>By source type</div>
          {[
            { label: 'State (Pillar 1)', pillar: 'P1', grossAmount: 2520, color: 'var(--gold)' },
            { label: 'Workplace (Pillar 2)', pillar: 'P2', grossAmount: 1320, color: 'var(--blue)', note: '+~€280 unconf.' },
            { label: 'Personal (Pillar 3+)', pillar: 'P3', grossAmount: 220, color: 'var(--amber)', prefix: '~', noteText: 'unconfirmed' },
          ].map((row) => {
            const amount = isNet ? (pillarNetTotals[row.pillar] ?? row.grossAmount) : row.grossAmount;
            const pct = displayTotal > 0 ? Math.round((amount / displayTotal) * 100) : 0;
            return (
              <div key={row.label} className="mb-2.5">
                <div className="flex justify-between items-baseline mb-[5px]">
                  <span className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-mono)', color: row.noteText ? 'var(--amber)' : 'var(--text)' }}>
                    {row.prefix || ''}€{amount.toLocaleString()} {row.note && !isNet && <span style={{ color: 'var(--amber)', fontWeight: 400 }}>{row.note}</span>}
                    {row.noteText && <span style={{ fontWeight: 400 }}> {row.noteText}</span>}
                  </span>
                </div>
                <div className="h-2.5 rounded-[5px] overflow-hidden" style={{ background: 'var(--navy-3)' }}>
                  <div className="h-full rounded-[5px]" style={{ width: `${pct}%`, background: row.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fund-level breakdown */}
      <div className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-dim)' }}>
        By fund & institution
      </div>
      <div className="flex flex-col gap-2.5 mb-6">
        {fundData.map((country) => {
          const isExpanded = expanded === country.country;
          const confirmedFunds = country.funds.filter((f) => f.status === 'verified' || f.status === 'estimated');
          const issues = country.funds.filter((f) => f.status === 'not_tracked' || f.status === 'unconfirmed' || f.status === 'self-reported');

          return (
            <div key={country.country}>
              {/* Country header — clickable */}
              <button
                onClick={() => setExpanded(isExpanded ? null : country.country)}
                className="w-full rounded-xl p-4 flex items-center gap-3.5 cursor-pointer transition-all duration-200 text-left"
                style={{
                  background: 'var(--navy-3)',
                  border: isExpanded ? '1px solid var(--gold-border)' : '1px solid var(--border)',
                  borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
                }}
              >
                <span className="text-xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>{country.country}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                    {country.funds.length} sources · {confirmedFunds.length} confirmed
                    {issues.length > 0 && <span style={{ color: 'var(--amber)' }}> · {issues.length} need attention</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                    €{(isNet ? (countryNetTotals[country.country] ?? country.total) : country.total).toLocaleString()}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>/ month {isNet ? 'net' : 'gross'}</div>
                </div>
                <span className="text-sm transition-transform duration-200" style={{ color: 'var(--text-dim)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▾
                </span>
              </button>

              {/* Expanded fund rows */}
              {isExpanded && (
                <div className="rounded-b-xl overflow-hidden" style={{ border: '1px solid var(--gold-border)', borderTop: 'none' }}>
                  {country.funds.map((fund, i) => {
                    const st = statusStyle[fund.status];
                    const isLast = i === country.funds.length - 1;
                    return (
                      <div
                        key={fund.institution}
                        className="px-5 py-3.5 flex items-start gap-3.5"
                        style={{
                          background: fund.status === 'not_tracked' ? 'rgba(239,68,68,0.03)' : 'var(--navy-4)',
                          borderBottom: isLast ? 'none' : '1px solid var(--border)',
                        }}
                      >
                        {/* Source type badge */}
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0 leading-tight text-center"
                          style={{
                            background: fund.pillar === 'P1' ? 'var(--gold-dim)' : fund.pillar === 'P2' ? 'var(--blue-dim)' : 'var(--amber-dim)',
                            color: fund.pillar === 'P1' ? 'var(--gold)' : fund.pillar === 'P2' ? 'var(--blue)' : 'var(--amber)',
                            border: `1px solid ${fund.pillar === 'P1' ? 'var(--gold-border)' : fund.pillar === 'P2' ? 'rgba(96,165,250,0.25)' : 'rgba(245,158,11,0.25)'}`,
                          }}
                        >
                          {fund.pillar === 'P1' ? 'State' : fund.pillar === 'P2' ? 'Work' : 'Pers.'}
                        </div>

                        {/* Fund details */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
                            {fund.institution}
                          </div>
                          <div className="text-[11px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                            {fund.notes}
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            {fund.period !== '—' && (
                              <span className="text-[10.5px] flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                                📅 {fund.period} · {fund.years} yrs
                              </span>
                            )}
                            {fund.capitalOption != null && (
                              <span className="text-[10.5px] flex items-center gap-1" style={{ color: 'var(--blue)' }}>
                                🏦 €{fund.capitalOption.toLocaleString()} capital option
                              </span>
                            )}
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                              style={{ background: st.bg, color: st.color }}
                            >
                              {st.label}
                            </span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right shrink-0">
                          {fund.monthlyPayout > 0 ? (() => {
                            const netAmount = netByInstitution.get(fund.institution) ?? fund.monthlyPayout;
                            const amount = isNet ? netAmount : fund.monthlyPayout;
                            return (
                              <>
                                <div className="text-[14px] font-bold" style={{
                                  fontFamily: 'var(--font-mono)',
                                  color: fund.status === 'verified' ? 'var(--text)' : 'var(--amber)',
                                }}>
                                  {fund.status !== 'verified' && fund.status !== 'estimated' ? '~' : ''}€{amount.toLocaleString()}
                                </div>
                                <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                                  / month {isNet ? 'net' : 'gross'}
                                  {isNet && fund.monthlyPayout > 0 && (
                                    <span> · €{fund.monthlyPayout.toLocaleString()} gross</span>
                                  )}
                                </div>
                              </>
                            );
                          })() : (
                            <div className="text-[12px] font-medium" style={{ color: 'var(--red)' }}>
                              Not tracked
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Matrix table */}
      <div className="text-[11px] font-bold uppercase tracking-wide mb-2.5" style={{ color: 'var(--text-dim)' }}>
        Summary matrix {isNet && <span style={{ color: 'var(--gold)', fontWeight: 400, textTransform: 'none' }}>· after tax in {resMeta.name}</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Country', 'State', 'Workplace', 'Personal', 'Total'].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-[11px] uppercase tracking-wide font-semibold"
                  style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border)', background: 'var(--navy-3)', textAlign: h !== 'Country' ? 'right' : 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fundData.map((countryData) => {
              const p1 = countryData.funds.find((f) => f.pillar === 'P1');
              const p2 = countryData.funds.find((f) => f.pillar === 'P2');
              const p3 = countryData.funds.find((f) => f.pillar === 'P3');
              const getAmount = (f: FundEntry | undefined) => {
                if (!f || f.monthlyPayout === 0) return null;
                return isNet ? (netByInstitution.get(f.institution) ?? f.monthlyPayout) : f.monthlyPayout;
              };
              const countryTotal = isNet ? (countryNetTotals[countryData.country] ?? countryData.total) : countryData.total;

              return (
                <tr key={countryData.country} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-3 py-2.5" style={{ color: 'var(--text)' }}>{countryData.flag} {countryData.country}</td>
                  <td className="px-3 py-2.5 text-right">
                    {p1 && getAmount(p1) != null ? (
                      <>
                        <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)', color: p1.status === 'verified' ? 'var(--green)' : 'var(--amber)' }}>
                          {p1.status !== 'verified' && p1.status !== 'estimated' ? '~' : ''}€{getAmount(p1)!.toLocaleString()}
                        </span>
                        <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{p1.institution.split('(')[0].trim()} · {p1.years} yrs</div>
                      </>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {p2 && getAmount(p2) != null ? (
                      <>
                        <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)', color: p2.status === 'verified' ? 'var(--blue)' : 'var(--amber)' }}>
                          {p2.status !== 'verified' && p2.status !== 'estimated' ? '~' : ''}€{getAmount(p2)!.toLocaleString()}
                        </span>
                        <div className="text-[10px]" style={{ color: p2.status === 'unconfirmed' ? 'var(--amber)' : 'var(--text-dim)' }}>
                          {p2.status === 'unconfirmed' ? 'unconfirmed' : p2.institution.split('(')[0].trim()}
                        </div>
                      </>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {p3 && getAmount(p3) != null ? (
                      <>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>~€{getAmount(p3)!.toLocaleString()}</span>
                        <div className="text-[10px]" style={{ color: 'var(--amber)' }}>{p3.status.replace('_', '-')}</div>
                      </>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                    €{countryTotal.toLocaleString()}
                  </td>
                </tr>
              );
            })}
            <tr style={{ background: 'var(--navy-3)' }}>
              <td className="px-3 py-2.5 font-bold" style={{ color: 'var(--text)' }}>Total ({isNet ? 'net' : 'confirmed'})</td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>
                €{(isNet ? pillarNetTotals.P1 : 2520).toLocaleString()}
              </td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>
                €{(isNet ? pillarNetTotals.P2 : 1320).toLocaleString()}
              </td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>
                ~€{(isNet ? pillarNetTotals.P3 : 220).toLocaleString()}
              </td>
              <td className="px-3 py-2.5 text-right font-bold text-base" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)' }}>
                €{displayTotal.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
