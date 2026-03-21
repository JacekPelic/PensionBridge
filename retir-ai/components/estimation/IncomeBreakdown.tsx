'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

type Status = 'verified' | 'estimated' | 'unconfirmed' | 'self-reported' | 'not_tracked';

interface FundEntry {
  institution: string;
  pillar: 'P1' | 'P2' | 'P3';
  monthlyPayout: number;
  period: string;
  years: number;
  status: Status;
  capitalOption?: number;
  notes?: string;
}

interface CountryFunds {
  country: string;
  flag: string;
  total: number;
  funds: FundEntry[];
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
      { institution: 'CNAV (Caisse Nationale d\'Assurance Vieillesse)', pillar: 'P1', monthlyPayout: 1220, period: 'Sep 2003 – Jul 2013', years: 10.9, status: 'verified', notes: 'Régime général · based on best 25 years SAM' },
      { institution: 'AGIRC-ARRCO', pillar: 'P2', monthlyPayout: 280, period: 'Sep 2003 – Jul 2013', years: 10.9, status: 'verified', notes: 'Compulsory complementary · points-based system' },
      { institution: 'Private savings (PER / Assurance-vie)', pillar: 'P3', monthlyPayout: 0, period: '—', years: 0, status: 'not_tracked', notes: 'No Pillar 3 product detected — upload or add manually' },
    ],
  },
  {
    country: 'Switzerland',
    flag: '🇨🇭',
    total: 1360,
    funds: [
      { institution: 'AVS/AHV (Federal Old Age Insurance)', pillar: 'P1', monthlyPayout: 320, period: 'Sep 2014 – Dec 2019', years: 5.3, status: 'verified', notes: 'Partial pension · 5.3 of 44 contribution years' },
      { institution: 'UBS Pension Fund (BVG/LPP)', pillar: 'P2', monthlyPayout: 1040, period: 'Sep 2014 – Dec 2019', years: 5.3, status: 'verified', capitalOption: 210000, notes: 'Occupational pension · capital or annuity option available' },
      { institution: 'Pillar 3a (tax-privileged)', pillar: 'P3', monthlyPayout: 0, period: '—', years: 0, status: 'not_tracked', notes: 'No 3a account detected — common for cross-border workers' },
    ],
  },
  {
    country: 'Luxembourg',
    flag: '🇱🇺',
    total: 980,
    funds: [
      { institution: 'CNAP (Caisse Nationale d\'Assurance Pension)', pillar: 'P1', monthlyPayout: 980, period: 'Apr 2020 – present', years: 6.0, status: 'estimated', notes: 'Flat-rate + proportional formula · EU totalisation applies' },
      { institution: 'Employer pension scheme (unknown provider)', pillar: 'P2', monthlyPayout: 280, period: 'Apr 2020 – present', years: 6.0, status: 'unconfirmed', notes: 'Estimated from typical employer scheme — upload pension fund statement to verify' },
      { institution: 'Foyer Prévoyance-vieillesse (Art. 111bis)', pillar: 'P3', monthlyPayout: 220, period: '2021 – present', years: 5.0, status: 'self-reported', notes: 'Tax-advantaged private pension · up to €3,200/yr deductible' },
    ],
  },
];

export function IncomeBreakdown() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Card className="mb-5">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2.5">
        <div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Income Breakdown</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Where each euro of your pension comes from</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)' }}>€3,840</span>
          <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>/ month total</span>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        {/* By Country */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-dim)' }}>By country</div>
          {[
            { flag: '🇫🇷', label: 'France', amount: 1500, pct: 39, color: '#3ecf8e' },
            { flag: '🇨🇭', label: 'Switzerland', amount: 1360, pct: 35, color: 'var(--blue)' },
            { flag: '🇱🇺', label: 'Luxembourg', amount: 980, pct: 26, color: 'var(--amber)', note: '+~€500 unconf.' },
          ].map((row) => (
            <div key={row.label} className="mb-2.5">
              <div className="flex justify-between items-baseline mb-[5px]">
                <span className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>{row.flag} {row.label}</span>
                <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                  €{row.amount.toLocaleString()} {row.note && <span style={{ color: 'var(--amber)', fontWeight: 400 }}>{row.note}</span>}
                </span>
              </div>
              <div className="h-2.5 rounded-[5px] overflow-hidden" style={{ background: 'var(--navy-3)' }}>
                <div className="h-full rounded-[5px]" style={{ width: `${row.pct}%`, background: row.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* By Pillar */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-dim)' }}>By pillar</div>
          {[
            { label: 'Pillar 1 · State', amount: 2520, pct: 66, color: 'var(--gold)' },
            { label: 'Pillar 2 · Occupational', amount: 1320, pct: 34, color: 'var(--blue)', note: '+~€280 unconf.' },
            { label: 'Pillar 3 · Private', amount: 220, pct: 5, color: 'var(--amber)', prefix: '~', noteText: 'unconfirmed' },
          ].map((row) => (
            <div key={row.label} className="mb-2.5">
              <div className="flex justify-between items-baseline mb-[5px]">
                <span className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-mono)', color: row.noteText ? 'var(--amber)' : 'var(--text)' }}>
                  {row.prefix || ''}€{row.amount.toLocaleString()} {row.note && <span style={{ color: 'var(--amber)', fontWeight: 400 }}>{row.note}</span>}
                  {row.noteText && <span style={{ fontWeight: 400 }}> {row.noteText}</span>}
                </span>
              </div>
              <div className="h-2.5 rounded-[5px] overflow-hidden" style={{ background: 'var(--navy-3)' }}>
                <div className="h-full rounded-[5px]" style={{ width: `${row.pct}%`, background: row.color }} />
              </div>
            </div>
          ))}
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
                    €{country.total.toLocaleString()}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>/ month</div>
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
                        {/* Pillar badge */}
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={{
                            background: fund.pillar === 'P1' ? 'var(--gold-dim)' : fund.pillar === 'P2' ? 'var(--blue-dim)' : 'var(--amber-dim)',
                            color: fund.pillar === 'P1' ? 'var(--gold)' : fund.pillar === 'P2' ? 'var(--blue)' : 'var(--amber)',
                            border: `1px solid ${fund.pillar === 'P1' ? 'var(--gold-border)' : fund.pillar === 'P2' ? 'rgba(96,165,250,0.25)' : 'rgba(245,158,11,0.25)'}`,
                          }}
                        >
                          {fund.pillar}
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
                          {fund.monthlyPayout > 0 ? (
                            <>
                              <div className="text-[14px] font-bold" style={{
                                fontFamily: 'var(--font-mono)',
                                color: fund.status === 'verified' ? 'var(--text)' : 'var(--amber)',
                              }}>
                                {fund.status !== 'verified' && fund.status !== 'estimated' ? '~' : ''}€{fund.monthlyPayout.toLocaleString()}
                              </div>
                              <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>/ month</div>
                            </>
                          ) : (
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
      <div className="text-[11px] font-bold uppercase tracking-wide mb-2.5" style={{ color: 'var(--text-dim)' }}>Summary matrix</div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Country', 'P1 · State', 'P2 · Occupational', 'P3 · Private', 'Total'].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-[11px] uppercase tracking-wide font-semibold"
                  style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border)', background: 'var(--navy-3)', textAlign: h !== 'Country' ? 'right' : 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td className="px-3 py-2.5" style={{ color: 'var(--text)' }}>🇫🇷 France</td>
              <td className="px-3 py-2.5 text-right">
                <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>€1,220</span>
                <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>CNAV · 10.9 yrs</div>
              </td>
              <td className="px-3 py-2.5 text-right">
                <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>€280</span>
                <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>AGIRC-ARRCO</div>
              </td>
              <td className="px-3 py-2.5 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>—</td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>€1,500</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td className="px-3 py-2.5" style={{ color: 'var(--text)' }}>🇨🇭 Switzerland</td>
              <td className="px-3 py-2.5 text-right">
                <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>€320</span>
                <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>AVS · 5.3 yrs</div>
              </td>
              <td className="px-3 py-2.5 text-right">
                <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>€1,040</span>
                <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>LPP · UBS</div>
              </td>
              <td className="px-3 py-2.5 text-right" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>—</td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>€1,360</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td className="px-3 py-2.5" style={{ color: 'var(--text)' }}>🇱🇺 Luxembourg</td>
              <td className="px-3 py-2.5 text-right">
                <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>€980</span>
                <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>CNAP · 6.0 yrs · est.</div>
              </td>
              <td className="px-3 py-2.5 text-right">
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>~€280</span>
                <div className="text-[10px]" style={{ color: 'var(--amber)' }}>unconfirmed</div>
              </td>
              <td className="px-3 py-2.5 text-right">
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>~€220</span>
                <div className="text-[10px]" style={{ color: 'var(--amber)' }}>self-reported</div>
              </td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                €980 <span className="text-[10px] font-normal" style={{ color: 'var(--amber)' }}>+~€500</span>
              </td>
            </tr>
            <tr style={{ background: 'var(--navy-3)' }}>
              <td className="px-3 py-2.5 font-bold" style={{ color: 'var(--text)' }}>Total (confirmed)</td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>€2,520</td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>€1,320</td>
              <td className="px-3 py-2.5 text-right font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>~€220</td>
              <td className="px-3 py-2.5 text-right font-bold text-base" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)' }}>
                €3,840 <span className="text-[11px] font-normal" style={{ color: 'var(--amber)' }}>+~€500</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
