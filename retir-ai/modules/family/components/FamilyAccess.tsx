'use client';

import { useState } from 'react';
import { trustedDelegates, auditLog } from '@/modules/family/data/mock-data';
import type { TrustedDelegate, AccessScope } from '@/shared/types';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { UpgradePrompt } from '@/shared/ui/UpgradePrompt';
import { useTier } from '@/shared/TierProvider';

const accessStyles: Record<string, { bg: string; color: string; label: string }> = {
  full: { bg: 'var(--green-dim)', color: 'var(--green)', label: 'Full Access' },
  contributor: { bg: 'var(--blue-dim)', color: 'var(--blue)', label: 'Contributor' },
  beneficiary: { bg: 'var(--blue-dim)', color: 'var(--blue)', label: 'Beneficiary' },
  emergency: { bg: 'var(--amber-dim)', color: 'var(--amber)', label: 'Emergency Only' },
  readonly: { bg: 'var(--navy-3)', color: 'var(--text-dim)', label: 'Read Only' },
};

const scopeLabels: Record<AccessScope, { label: string; icon: string }> = {
  dashboard: { label: 'Dashboard', icon: '⬡' },
  career: { label: 'Career', icon: '🗺' },
  pension: { label: 'Pension', icon: '📊' },
  vault: { label: 'Vault', icon: '🗄' },
  simulation: { label: 'Simulation', icon: '🧮' },
  radar: { label: 'Radar', icon: '📡' },
  claims: { label: 'Claims', icon: '📋' },
};

interface ClaimStep {
  label: string;
  detail: string;
}

interface ClaimContact {
  institution: string;
  pillar: string;
  phone?: string;
  website?: string;
  address?: string;
}

interface ClaimCountry {
  flag: string;
  country: string;
  language: string;
  deadline: string;
  processingTime: string;
  status: 'shared' | 'draft';
  sharedWith?: string;
  steps: ClaimStep[];
  documents: string[];
  contacts: ClaimContact[];
  warnings?: string[];
}

const claimData: ClaimCountry[] = [
  {
    flag: '\u{1F1EB}\u{1F1F7}',
    country: 'France',
    language: 'French',
    deadline: 'No strict deadline, but apply 4\u20136 months before desired start date',
    processingTime: '4\u20136 months',
    status: 'shared',
    sharedWith: 'Anna Karlsson',
    steps: [
      { label: 'Obtain death certificate (acte de d\u00e9c\u00e8s)', detail: 'Request from the mairie of the commune where death occurred. You will need multiple certified copies.' },
      { label: 'Notify CNAV of the pension holder\'s death', detail: 'Call 3960 or write to the regional CARSAT. This stops pension payments and triggers survivor pension process.' },
      { label: 'File survivor pension application (pension de r\u00e9version)', detail: 'Apply online at lassuranceretraite.fr or at your local CARSAT. Spouse must meet income conditions (net < \u20ac24,232/yr in 2025).' },
      { label: 'Request AGIRC-ARRCO complementary survivor pension', detail: 'File separately at agirc-arrco.fr. Surviving spouse receives 60% of the acquired points. No income condition.' },
      { label: 'Request EU coordination forms E205/P1 from CH and LU', detail: 'These confirm contribution periods in other EU/EFTA countries. France needs them to calculate the pro-rata pension. Request from AVS and CNAP respectively.' },
    ],
    documents: [
      'Death certificate (acte de d\u00e9c\u00e8s) \u2014 multiple copies',
      'Marriage certificate (livret de famille)',
      'Pension holder\'s ID and social security number (NIR)',
      'Claimant\'s ID and proof of residence',
      'Tax notice (avis d\'imposition) for income condition',
      'EU forms E205 from Switzerland and Luxembourg',
      'Bank details (RIB) for payment',
    ],
    contacts: [
      { institution: 'CNAV / CARSAT', pillar: 'State pension', phone: '3960 (from France)', website: 'lassuranceretraite.fr', address: 'CARSAT \u00cele-de-France, 17-19 place de l\'Argonne, 75019 Paris' },
      { institution: 'AGIRC-ARRCO', pillar: 'Workplace pension', phone: '0 970 660 660', website: 'agirc-arrco.fr' },
    ],
    warnings: [
      'Pension de r\u00e9version is not automatic \u2014 it must be actively claimed',
      'Income condition applies to CNAV survivor pension (not AGIRC-ARRCO)',
      'If remarried, surviving spouse loses CNAV r\u00e9version rights',
    ],
  },
  {
    flag: '\u{1F1E8}\u{1F1ED}',
    country: 'Switzerland',
    language: 'German / French (depending on canton)',
    deadline: 'State pension: apply within 12 months. Workplace pension: contact fund immediately \u2014 some have 6-month deadlines.',
    processingTime: '2\u20134 months',
    status: 'draft',
    steps: [
      { label: 'Notify the AVS/AHV compensation office (Ausgleichskasse)', detail: 'Report the death to the relevant cantonal SVA. This triggers widow/widower pension assessment. Former canton of employment was Zurich.' },
      { label: 'Apply for AVS survivor pension (Hinterlassenenrente)', detail: 'Surviving spouse with children under 18 receives 80% of the deceased\'s pension. Without children, widow(er) must be 45+ and married 5+ years.' },
      { label: 'Contact UBS Pension Fund for workplace pension death benefits', detail: 'The BVG/LPP fund pays a lump sum or survivor pension depending on the plan rules. Contact the fund directly \u2014 rules vary by employer.' },
      { label: 'Check for dormant workplace pension assets at Stiftung Auffangeinrichtung', detail: 'If the pension holder changed jobs, old workplace pension assets may have been transferred to the substitute institution. Search at verbindungsstelle.ch.' },
      { label: 'Check for personal savings accounts (3a)', detail: 'Banks and insurers holding 3a accounts do not automatically notify beneficiaries. Check with known banks (UBS, Credit Suisse, PostFinance).' },
      { label: 'Request EU form E205 for France and Luxembourg', detail: 'AVS issues this to confirm Swiss contribution periods. Needed by CNAV and CNAP for their own survivor pension calculations.' },
    ],
    documents: [
      'Death certificate (Todesbescheinigung) \u2014 apostilled if claiming from abroad',
      'Marriage certificate',
      'Swiss social security number (AHV-Nr / OASI)',
      'Pension holder\'s last AVS statement',
      'UBS Pension Fund certificate (Vorsorgeausweis)',
      'Claimant\'s ID and proof of relationship',
      'Bank details for payment (IBAN)',
    ],
    contacts: [
      { institution: 'SVA Z\u00fcrich (Ausgleichskasse)', pillar: 'State pension', phone: '+41 44 448 50 00', website: 'svazurich.ch' },
      { institution: 'UBS Pension Fund', pillar: 'Workplace pension', phone: '+41 61 285 40 40', website: 'ubs.com/pensions' },
      { institution: 'Stiftung Auffangeinrichtung', pillar: 'Workplace pension (dormant)', website: 'verbindungsstelle.ch' },
    ],
    warnings: [
      'Swiss workplace pension death benefits vary hugely by fund \u2014 some pay lump sums, others pay survivor annuities',
      'Unmarried partners may have no legal claim to workplace pension unless registered as beneficiary in advance',
      'Personal savings (3a) beneficiary order is fixed by law: spouse > children > parents > siblings',
    ],
  },
  {
    flag: '\u{1F1F1}\u{1F1FA}',
    country: 'Luxembourg',
    language: 'French / German',
    deadline: 'Apply within 12 months of death for full retroactive payment',
    processingTime: '3\u20134 months',
    status: 'draft',
    steps: [
      { label: 'Notify CNAP (Caisse Nationale d\'Assurance Pension)', detail: 'Report the death to CNAP. If pension was in payment, it stops at the end of the month of death. A 3-month death grant (allocation de d\u00e9c\u00e8s) may be payable.' },
      { label: 'Apply for survivor pension (pension de survie)', detail: 'File at guichet.lu or directly at CNAP. Surviving spouse receives the pension if married at least 1 year (waived if children from the marriage).' },
      { label: 'Request the death grant (allocation de d\u00e9c\u00e8s)', detail: 'CNAP pays a lump sum equal to the last monthly pension \u00d7 3. Apply within 3 months.' },
      { label: 'Contact employer pension scheme', detail: 'The pension holder\'s current employer in Luxembourg may have a supplementary pension scheme. Contact HR or the scheme administrator directly.' },
    ],
    documents: [
      'Death certificate (acte de d\u00e9c\u00e8s)',
      'Marriage certificate or proof of PACS',
      'Pension holder\'s Luxembourg social security number (matricule)',
      'CNAP pension statement or career extract',
      'Claimant\'s ID and proof of residence',
      'EU coordination forms from FR and CH',
      'Bank details (IBAN)',
    ],
    contacts: [
      { institution: 'CNAP', pillar: 'State pension', phone: '+352 22 41 41-1', website: 'cnap.lu', address: '1a bd Prince Henri, L-1724 Luxembourg' },
      { institution: 'CCSS (Centre Commun de la S\u00e9curit\u00e9 Sociale)', pillar: 'Registration', phone: '+352 40 141-1', website: 'ccss.lu' },
    ],
    warnings: [
      'The death grant must be claimed within 3 months \u2014 this is easy to miss',
      'If the pension holder was still working (not yet retired), survivor pension rules differ from post-retirement death',
      'EU totalisation means Luxembourg will only pay for the Luxembourg portion \u2014 separate claims needed in FR and CH',
    ],
  },
];

/* ─── Delegate card ─── */
function DelegateCard({ delegate }: { delegate: TrustedDelegate }) {
  const [expanded, setExpanded] = useState(false);
  const access = accessStyles[delegate.accessLevel];

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3.5 p-4 px-[18px] rounded-xl cursor-pointer transition-all duration-200 text-left"
        style={{
          background: 'var(--navy-3)',
          border: expanded ? '1px solid var(--gold-border)' : '1px solid var(--border)',
          borderRadius: expanded ? '12px 12px 0 0' : '12px',
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold shrink-0 text-white"
          style={{ background: `linear-gradient(135deg, ${delegate.gradientFrom}, ${delegate.gradientTo})` }}
        >
          {delegate.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{delegate.name}</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
            {delegate.relation}
            {delegate.company && <span> · {delegate.company}</span>}
          </div>
        </div>
        <span
          className="text-[11px] px-2.5 py-[3px] rounded-md font-medium"
          style={{ background: access.bg, color: access.color }}
        >
          {access.label}
        </span>
        <span className="text-sm transition-transform duration-200" style={{ color: 'var(--text-dim)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </span>
      </button>

      {expanded && (
        <div className="rounded-b-xl p-4 px-[18px]" style={{ background: 'var(--navy-4)', border: '1px solid var(--gold-border)', borderTop: 'none' }}>
          {delegate.title && (
            <div className="text-[11.5px] mb-3" style={{ color: 'var(--text-muted)' }}>
              {delegate.title}{delegate.company ? ` at ${delegate.company}` : ''}
            </div>
          )}
          <div className="text-[10px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
            Access scopes
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {delegate.scopes.map((scope) => {
              const s = scopeLabels[scope];
              return (
                <span key={scope} className="text-[11px] px-2 py-[3px] rounded-md flex items-center gap-1" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <span className="text-[10px]">{s.icon}</span> {s.label}
                </span>
              );
            })}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
            Added {new Date(delegate.addedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="ghost">Edit permissions</Button>
            <Button variant="ghost">Revoke access</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Audit trail ─── */
function AuditTrail() {
  return (
    <Card className="mb-5">
      <div className="text-[15px] font-semibold mb-1" style={{ color: 'var(--text)' }}>Activity Log</div>
      <div className="text-[12px] mb-4" style={{ color: 'var(--text-dim)' }}>Recent actions by people with access to your data</div>
      <div className="flex flex-col gap-1.5">
        {auditLog.map((entry) => {
          const scope = scopeLabels[entry.scope];
          const date = new Date(entry.timestamp);
          const relative = formatRelative(date);

          return (
            <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--navy-3)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] shrink-0 mt-0.5" style={{ background: 'var(--navy-4)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                {scope.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px]" style={{ color: 'var(--text)' }}>
                  <span className="font-medium">{entry.delegateName}</span>
                  <span style={{ color: 'var(--text-muted)' }}> · {entry.action}</span>
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{entry.detail}</div>
              </div>
              <div className="text-[10px] shrink-0 mt-0.5" style={{ color: 'var(--text-dim)' }}>{relative}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function formatRelative(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/* ─── Main component ─── */
export function FamilyAccess() {
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const { isPro } = useTier();

  const familyDelegates = trustedDelegates.filter((d) => d.delegateType === 'family');
  const advisorDelegates = trustedDelegates.filter((d) => d.delegateType === 'advisor');

  return (
    <>
      {/* Unclaimed pensions awareness hero */}
      <div
        className="rounded-[18px] p-7 mb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--navy-3) 0%, var(--navy-4) 100%)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="absolute rounded-full" style={{ top: -50, right: -50, width: 220, height: 220, background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)' }} />

        <div className="flex items-start gap-5 mb-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚠️
          </div>
          <div>
            <div className="text-[17px] font-bold mb-1" style={{ color: 'var(--text)' }}>
              Billions in pensions go unclaimed every year
            </div>
            <div className="text-[13px] leading-relaxed max-w-[600px]" style={{ color: 'var(--text-muted)' }}>
              When a pension holder passes away, their family often doesn't know which countries, funds, or institutions hold their benefits.
              For multi-country careers like yours, the risk is even higher — claims must be filed separately in each jurisdiction, often in a different language, with strict deadlines.
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl p-3.5" style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
            <div className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--red)' }}>€3.7B</div>
            <div className="text-[11px] leading-snug mt-1" style={{ color: 'var(--text-muted)' }}>unclaimed in France alone</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>Source: Cour des Comptes 2024</div>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
            <div className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--red)' }}>CHF 4.1B</div>
            <div className="text-[11px] leading-snug mt-1" style={{ color: 'var(--text-muted)' }}>dormant Swiss workplace pension assets</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>Source: Stiftung Auffangeinrichtung</div>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
            <div className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--amber)' }}>60%</div>
            <div className="text-[11px] leading-snug mt-1" style={{ color: 'var(--text-muted)' }}>of cross-border survivors miss at least one claim</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>Source: EU Pension Tracking Study</div>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: 'var(--navy-4)', border: '1px solid rgba(201,168,76,0.25)' }}>
            <div className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)' }}>3 countries</div>
            <div className="text-[11px] leading-snug mt-1" style={{ color: 'var(--text-muted)' }}>your family would need to contact CNAV, AVS, CNAP + employer funds</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--gold)' }}>Your situation</div>
          </div>
        </div>
      </div>

      {isPro ? (
        <>
          {/* Advisors section */}
          <Card className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Advisors</div>
              <span className="text-[10px] px-2 py-[2px] rounded-full font-medium" style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>
                {advisorDelegates.length}
              </span>
            </div>
            <div className="text-[12px] mb-4" style={{ color: 'var(--text-dim)' }}>
              External professionals with delegated access to your pension data
            </div>
            <div className="flex flex-col gap-2.5">
              {advisorDelegates.map((d) => <DelegateCard key={d.id} delegate={d} />)}
            </div>
            <div className="mt-3">
              <Button variant="ghost">+ Invite Advisor</Button>
            </div>
          </Card>

          {/* Audit trail */}
          <AuditTrail />

          {/* Family section */}
          <Card className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Family Members</div>
              <span className="text-[10px] px-2 py-[2px] rounded-full font-medium" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>
                {familyDelegates.length}
              </span>
            </div>
            <div className="text-[12px] mb-4" style={{ color: 'var(--text-dim)' }}>
              Family and beneficiaries with access to your pension information and claim guides
            </div>
            <div className="flex flex-col gap-2.5">
              {familyDelegates.map((d) => <DelegateCard key={d.id} delegate={d} />)}
            </div>
            <div className="mt-3">
              <Button variant="ghost">+ Add Family Member</Button>
            </div>
          </Card>

          {/* Claim instructions by country */}
          <div className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>Claim Instructions by Country</div>
          <div className="text-[13px] mb-4 max-w-[640px]" style={{ color: 'var(--text-muted)' }}>
            Step-by-step guides for your family to claim your pension in each country. Share these with your beneficiaries so they know exactly what to do.
          </div>

          <div className="flex flex-col gap-3 mb-5">
            {claimData.map((c) => {
              const isOpen = expandedCountry === c.country;
              return (
                <div key={c.country}>
                  <button
                    onClick={() => setExpandedCountry(isOpen ? null : c.country)}
                    className="w-full rounded-xl p-4 px-5 flex items-center gap-3.5 cursor-pointer transition-all duration-200 text-left"
                    style={{
                      background: 'var(--navy-3)',
                      border: isOpen ? '1px solid var(--gold-border)' : '1px solid var(--border)',
                      borderRadius: isOpen ? '12px 12px 0 0' : '12px',
                    }}
                  >
                    <span className="text-2xl">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{c.country}</div>
                      <div className="text-[11px] flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>
                        <span>{c.steps.length} steps</span>
                        <span>·</span>
                        <span>{c.documents.length} documents needed</span>
                        <span>·</span>
                        <span>{c.language}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: c.status === 'shared' ? 'var(--green-dim)' : 'var(--amber-dim)',
                          color: c.status === 'shared' ? 'var(--green)' : 'var(--amber)',
                        }}
                      >
                        {c.status === 'shared' ? `Shared with ${c.sharedWith}` : 'Draft \u2014 not yet shared'}
                      </span>
                      <span className="text-sm transition-transform duration-200" style={{ color: 'var(--text-dim)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▾
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="rounded-b-xl p-5" style={{ background: 'var(--navy-4)', border: '1px solid var(--gold-border)', borderTop: 'none' }}>
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="rounded-lg p-3" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                          <div className="text-[10px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--text-dim)' }}>Claim deadline</div>
                          <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{c.deadline}</div>
                        </div>
                        <div className="rounded-lg p-3" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                          <div className="text-[10px] uppercase tracking-wider font-medium mb-1" style={{ color: 'var(--text-dim)' }}>Processing time</div>
                          <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{c.processingTime}</div>
                        </div>
                      </div>

                      <div className="mb-5">
                        <div className="text-[12px] font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                          <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]" style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}>✓</span>
                          Steps to follow
                        </div>
                        <div className="flex flex-col gap-2">
                          {c.steps.map((step, i) => (
                            <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: 'var(--navy-3)' }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5" style={{ background: 'var(--navy-5)', color: 'var(--text-muted)' }}>
                                {i + 1}
                              </div>
                              <div>
                                <div className="text-[12.5px] font-medium mb-0.5" style={{ color: 'var(--text)' }}>{step.label}</div>
                                <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.detail}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                          <div className="text-[12px] font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                            <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]" style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>📄</span>
                            Required documents
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {c.documents.map((doc, i) => (
                              <div key={i} className="flex items-start gap-2 text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
                                <span className="shrink-0 mt-0.5" style={{ color: 'var(--text-dim)' }}>•</span>
                                <span>{doc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                            <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>📞</span>
                            Who to contact
                          </div>
                          <div className="flex flex-col gap-2">
                            {c.contacts.map((contact, i) => (
                              <div key={i} className="rounded-lg p-3" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                                <div className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>{contact.institution}</div>
                                <div className="text-[10px] mb-1.5" style={{ color: 'var(--text-dim)' }}>{contact.pillar}</div>
                                {contact.phone && (
                                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                    Tel: <span style={{ color: 'var(--blue)' }}>{contact.phone}</span>
                                  </div>
                                )}
                                {contact.website && (
                                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                    Web: <span style={{ color: 'var(--blue)' }}>{contact.website}</span>
                                  </div>
                                )}
                                {contact.address && (
                                  <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>{contact.address}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {c.warnings && c.warnings.length > 0 && (
                        <div className="rounded-lg p-3.5" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.15)' }}>
                          <div className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--red)' }}>
                            ⚠ Important warnings
                          </div>
                          <div className="flex flex-col gap-1">
                            {c.warnings.map((w, i) => (
                              <div key={i} className="flex items-start gap-2 text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
                                <span className="shrink-0 mt-0.5" style={{ color: 'var(--red)' }}>•</span>
                                <span>{w}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-4">
                        <Button variant="primary">
                          {c.status === 'shared' ? 'Re-share with family' : 'Share with family'}
                        </Button>
                        <Button variant="ghost">Export as PDF</Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Free: feature preview + upgrade prompt */
        <>
          <Card className="mb-5">
            <div className="text-[15px] font-semibold mb-1.5" style={{ color: 'var(--text)' }}>What Trusted Access includes</div>
            <div className="text-[12.5px] mb-4" style={{ color: 'var(--text-muted)' }}>
              Share your pension data with family and trusted professionals, with scoped permissions.
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: '👨‍👩‍👧', title: 'Family member management', desc: 'Add spouse, children, and beneficiaries with controlled access levels' },
                { icon: '🧑‍💼', title: 'Advisor access', desc: 'Invite pension consultants and tax advisors with scoped, audited permissions' },
                { icon: '📋', title: 'Country claim guides', desc: 'Step-by-step instructions for France, Switzerland, and Luxembourg' },
                { icon: '📝', title: 'Contributor role', desc: 'Let advisors upload documents and add career data on your behalf' },
                { icon: '📄', title: 'Document checklists', desc: '21 required documents identified across 3 jurisdictions' },
                { icon: '🔍', title: 'Activity log', desc: 'See exactly who accessed or modified your data and when' },
              ].map((f) => (
                <div key={f.title} className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm shrink-0" style={{ background: 'var(--navy-4)' }}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-medium mb-0.5" style={{ color: 'var(--text)' }}>{f.title}</div>
                    <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Country summary */}
            <div className="flex gap-2.5 mb-4">
              {claimData.map((c) => (
                <div key={c.country} className="flex-1 rounded-lg p-3 text-center"
                  style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
                  <div className="text-xl mb-1">{c.flag}</div>
                  <div className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>{c.country}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{c.steps.length} steps · {c.documents.length} docs</div>
                </div>
              ))}
            </div>
          </Card>

          <UpgradePrompt
            title="Unlock Trusted Access"
            description="Share your pension data with family and professional advisors. Scoped permissions, contributor roles, activity logging, and country-specific claim guides — all in one place."
            badge="Pro"
          />
        </>
      )}
    </>
  );
}
