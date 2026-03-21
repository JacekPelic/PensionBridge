'use client';

import { useState } from 'react';
import { familyMembers } from '@/lib/mock-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const accessStyles: Record<string, { bg: string; color: string; label: string }> = {
  full: { bg: 'var(--green-dim)', color: 'var(--green)', label: 'Full Access' },
  beneficiary: { bg: 'var(--blue-dim)', color: 'var(--blue)', label: 'Beneficiary' },
  emergency: { bg: 'var(--amber-dim)', color: 'var(--amber)', label: 'Emergency Only' },
  readonly: { bg: 'var(--navy-3)', color: 'var(--text-dim)', label: 'Read Only' },
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
    flag: '🇫🇷',
    country: 'France',
    language: 'French',
    deadline: 'No strict deadline, but apply 4–6 months before desired start date',
    processingTime: '4–6 months',
    status: 'shared',
    sharedWith: 'Anna Karlsson',
    steps: [
      { label: 'Obtain death certificate (acte de décès)', detail: 'Request from the mairie of the commune where death occurred. You will need multiple certified copies.' },
      { label: 'Notify CNAV of the pension holder\'s death', detail: 'Call 3960 or write to the regional CARSAT. This stops pension payments and triggers survivor pension process.' },
      { label: 'File survivor pension application (pension de réversion)', detail: 'Apply online at lassuranceretraite.fr or at your local CARSAT. Spouse must meet income conditions (net < €24,232/yr in 2025).' },
      { label: 'Request AGIRC-ARRCO complementary survivor pension', detail: 'File separately at agirc-arrco.fr. Surviving spouse receives 60% of the acquired points. No income condition.' },
      { label: 'Request EU coordination forms E205/P1 from CH and LU', detail: 'These confirm contribution periods in other EU/EFTA countries. France needs them to calculate the pro-rata pension. Request from AVS and CNAP respectively.' },
    ],
    documents: [
      'Death certificate (acte de décès) — multiple copies',
      'Marriage certificate (livret de famille)',
      'Pension holder\'s ID and social security number (NIR)',
      'Claimant\'s ID and proof of residence',
      'Tax notice (avis d\'imposition) for income condition',
      'EU forms E205 from Switzerland and Luxembourg',
      'Bank details (RIB) for payment',
    ],
    contacts: [
      { institution: 'CNAV / CARSAT', pillar: 'Pillar 1', phone: '3960 (from France)', website: 'lassuranceretraite.fr', address: 'CARSAT Île-de-France, 17-19 place de l\'Argonne, 75019 Paris' },
      { institution: 'AGIRC-ARRCO', pillar: 'Pillar 2', phone: '0 970 660 660', website: 'agirc-arrco.fr' },
    ],
    warnings: [
      'Pension de réversion is not automatic — it must be actively claimed',
      'Income condition applies to CNAV survivor pension (not AGIRC-ARRCO)',
      'If remarried, surviving spouse loses CNAV réversion rights',
    ],
  },
  {
    flag: '🇨🇭',
    country: 'Switzerland',
    language: 'German / French (depending on canton)',
    deadline: 'Pillar 1: apply within 12 months. Pillar 2: contact fund immediately — some have 6-month deadlines.',
    processingTime: '2–4 months',
    status: 'draft',
    steps: [
      { label: 'Notify the AVS/AHV compensation office (Ausgleichskasse)', detail: 'Report the death to the relevant cantonal SVA. This triggers widow/widower pension assessment. Former canton of employment was Zurich.' },
      { label: 'Apply for AVS survivor pension (Hinterlassenenrente)', detail: 'Surviving spouse with children under 18 receives 80% of the deceased\'s pension. Without children, widow(er) must be 45+ and married 5+ years.' },
      { label: 'Contact UBS Pension Fund for Pillar 2 death benefits', detail: 'The BVG/LPP fund pays a lump sum or survivor pension depending on the plan rules. Contact the fund directly — rules vary by employer.' },
      { label: 'Check for dormant Pillar 2 assets at Stiftung Auffangeinrichtung', detail: 'If the pension holder changed jobs, old P2 assets may have been transferred to the substitute institution. Search at verbindungsstelle.ch.' },
      { label: 'Check for Pillar 3a accounts', detail: 'Banks and insurers holding 3a accounts do not automatically notify beneficiaries. Check with known banks (UBS, Credit Suisse, PostFinance).' },
      { label: 'Request EU form E205 for France and Luxembourg', detail: 'AVS issues this to confirm Swiss contribution periods. Needed by CNAV and CNAP for their own survivor pension calculations.' },
    ],
    documents: [
      'Death certificate (Todesbescheinigung) — apostilled if claiming from abroad',
      'Marriage certificate',
      'Swiss social security number (AHV-Nr / OASI)',
      'Pension holder\'s last AVS statement',
      'UBS Pension Fund certificate (Vorsorgeausweis)',
      'Claimant\'s ID and proof of relationship',
      'Bank details for payment (IBAN)',
    ],
    contacts: [
      { institution: 'SVA Zürich (Ausgleichskasse)', pillar: 'Pillar 1', phone: '+41 44 448 50 00', website: 'svazurich.ch' },
      { institution: 'UBS Pension Fund', pillar: 'Pillar 2', phone: '+41 61 285 40 40', website: 'ubs.com/pensions' },
      { institution: 'Stiftung Auffangeinrichtung', pillar: 'Pillar 2 (dormant)', website: 'verbindungsstelle.ch' },
    ],
    warnings: [
      'Swiss P2 death benefits vary hugely by fund — some pay lump sums, others pay survivor annuities',
      'Unmarried partners may have no legal claim to P2 unless registered as beneficiary in advance',
      'Pillar 3a beneficiary order is fixed by law: spouse > children > parents > siblings',
    ],
  },
  {
    flag: '🇱🇺',
    country: 'Luxembourg',
    language: 'French / German',
    deadline: 'Apply within 12 months of death for full retroactive payment',
    processingTime: '3–4 months',
    status: 'draft',
    steps: [
      { label: 'Notify CNAP (Caisse Nationale d\'Assurance Pension)', detail: 'Report the death to CNAP. If pension was in payment, it stops at the end of the month of death. A 3-month death grant (allocation de décès) may be payable.' },
      { label: 'Apply for survivor pension (pension de survie)', detail: 'File at guichet.lu or directly at CNAP. Surviving spouse receives the pension if married at least 1 year (waived if children from the marriage).' },
      { label: 'Request the death grant (allocation de décès)', detail: 'CNAP pays a lump sum equal to the last monthly pension × 3. Apply within 3 months.' },
      { label: 'Contact employer pension scheme', detail: 'The pension holder\'s current employer in Luxembourg may have a supplementary pension scheme. Contact HR or the scheme administrator directly.' },
    ],
    documents: [
      'Death certificate (acte de décès)',
      'Marriage certificate or proof of PACS',
      'Pension holder\'s Luxembourg social security number (matricule)',
      'CNAP pension statement or career extract',
      'Claimant\'s ID and proof of residence',
      'EU coordination forms from FR and CH',
      'Bank details (IBAN)',
    ],
    contacts: [
      { institution: 'CNAP', pillar: 'Pillar 1', phone: '+352 22 41 41-1', website: 'cnap.lu', address: '1a bd Prince Henri, L-1724 Luxembourg' },
      { institution: 'CCSS (Centre Commun de la Sécurité Sociale)', pillar: 'Registration', phone: '+352 40 141-1', website: 'ccss.lu' },
    ],
    warnings: [
      'The death grant must be claimed within 3 months — this is easy to miss',
      'If the pension holder was still working (not yet retired), survivor pension rules differ from post-retirement death',
      'EU totalisation means Luxembourg will only pay for the Luxembourg portion — separate claims needed in FR and CH',
    ],
  },
];

export function FamilyAccess() {
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

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
            <div className="text-[11px] leading-snug mt-1" style={{ color: 'var(--text-muted)' }}>
              unclaimed in France alone
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>
              Source: Cour des Comptes 2024
            </div>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
            <div className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--red)' }}>CHF 4.1B</div>
            <div className="text-[11px] leading-snug mt-1" style={{ color: 'var(--text-muted)' }}>
              dormant Swiss P2 assets
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>
              Source: Stiftung Auffangeinrichtung
            </div>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
            <div className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--amber)' }}>60%</div>
            <div className="text-[11px] leading-snug mt-1" style={{ color: 'var(--text-muted)' }}>
              of cross-border survivors miss at least one claim
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>
              Source: EU Pension Tracking Study
            </div>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: 'var(--navy-4)', border: '1px solid rgba(201,168,76,0.25)' }}>
            <div className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)' }}>3 countries</div>
            <div className="text-[11px] leading-snug mt-1" style={{ color: 'var(--text-muted)' }}>
              your family would need to contact CNAV, AVS, CNAP + employer funds
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--gold)' }}>
              Your situation
            </div>
          </div>
        </div>
      </div>

      <Card className="mb-5">
        <div className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>Family Members</div>
        <div className="flex flex-col gap-2.5">
          {familyMembers.map((member) => {
            const access = accessStyles[member.accessLevel];
            return (
              <div
                key={member.id}
                className="flex items-center gap-3.5 p-4 px-[18px] rounded-xl cursor-pointer transition-all duration-200"
                style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold shrink-0 text-white"
                  style={{ background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})` }}
                >
                  {member.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{member.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{member.relation}</div>
                </div>
                <span
                  className="text-[11px] px-2.5 py-[3px] rounded-md font-medium"
                  style={{ background: access.bg, color: access.color }}
                >
                  {access.label}
                </span>
              </div>
            );
          })}
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
              {/* Country header */}
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
                    {c.status === 'shared' ? `Shared with ${c.sharedWith}` : 'Draft — not yet shared'}
                  </span>
                  <span className="text-sm transition-transform duration-200" style={{ color: 'var(--text-dim)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▾
                  </span>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="rounded-b-xl p-5" style={{ background: 'var(--navy-4)', border: '1px solid var(--gold-border)', borderTop: 'none' }}>
                  {/* Deadline & processing */}
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

                  {/* Steps checklist */}
                  <div className="mb-5">
                    <div className="text-[12px] font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]" style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}>✓</span>
                      Steps to follow
                    </div>
                    <div className="flex flex-col gap-2">
                      {c.steps.map((step, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: 'var(--navy-3)' }}>
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                            style={{ background: 'var(--navy-5)', color: 'var(--text-muted)' }}
                          >
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

                  {/* Documents & Contacts side by side */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {/* Required documents */}
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

                    {/* Contacts */}
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

                  {/* Warnings */}
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

                  {/* Share button */}
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

      <Button variant="primary">+ Add Family Member</Button>
    </>
  );
}
