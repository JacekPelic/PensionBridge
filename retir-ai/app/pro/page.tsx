'use client';

import Link from 'next/link';
import { Sidebar } from '@/shared/layout/Sidebar';
import { Topbar } from '@/shared/layout/Topbar';
import { ChatWidget } from '@/shared/chat/ChatWidget';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useTier } from '@/shared/TierProvider';

const features = [
  {
    icon: '🧮',
    title: 'Retirement Simulation',
    description: 'Compare net income across 6 countries, model retirement age scenarios, and optimise your capital split between annuity and lump sum.',
    highlights: ['Tax comparison across FR, CH, LU, PT, ES, IT', 'Retirement age modelling (57–70)', 'Capital vs annuity optimiser'],
    hook: 'Portugal NHR could save you up to €356/mo vs France',
    href: '/simulation',
    color: 'var(--blue)',
  },
  {
    icon: '🗄',
    title: 'Vault Pro',
    description: 'AI-powered cross-referencing detects discrepancies between your documents and projections. Automated correction workflows with institution-specific SLAs.',
    highlights: ['Cross-document discrepancy alerts', 'Pre-filled correction letters', 'Document age & expiry monitoring', 'Consolidated dossier export'],
    hook: 'Discrepancies found could affect your projection by ±15%',
    href: '/vault',
    color: 'var(--green)',
  },
  {
    icon: '📡',
    title: 'Legislative Radar',
    description: 'Real-time monitoring of pension law changes, tax reforms, and regulatory updates across every country in your career — with personal impact analysis.',
    highlights: ['6 active alerts across 3 jurisdictions', '3 high-priority changes requiring attention', 'Financial impact estimates per alert', 'Source references & effective dates'],
    hook: 'France may raise retirement age to 65 — impact: −€2,520/yr',
    href: '/radar',
    color: 'var(--red)',
  },
  {
    icon: '👥',
    title: 'Trusted Access',
    description: 'Share your pension data with family and professional advisors. Scoped permissions, contributor roles, activity logging, and country-specific claim guides.',
    highlights: ['Invite advisors with scoped contributor access', 'Claim guides for FR, CH, LU with deadlines', 'Activity log tracks every access and change', 'Share & export as PDF'],
    hook: '€3.7B in pensions go unclaimed in France alone every year',
    href: '/family',
    color: 'var(--amber)',
  },
  {
    icon: '💬',
    title: 'Personalised AI Advisor',
    description: 'Get advice that references your actual career data — gap analysis, Swiss pension tracking, tax optimisation, and income strategies tailored to your situation.',
    highlights: ['Data-aware gap & correction advice', 'Swiss pension location guidance', 'Tax residency comparison', 'Income gap-closing strategies'],
    hook: 'Your Swiss workplace pension (~€210K) needs to be located',
    href: '/',
    color: 'var(--gold)',
  },
];

export default function ProPage() {
  const { isPro, toggleTier } = useTier();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
        <Topbar
          title="RetirAI Pro"
          subtitle="Everything you need to act on your pension picture"
        />
        <div className="flex-1 p-7 animate-fade-in">

          {/* Hero */}
          <div
            className="rounded-[18px] p-8 mb-6 relative overflow-hidden text-center"
            style={{
              background: 'linear-gradient(135deg, var(--navy-3) 0%, var(--navy-4) 100%)',
              border: '1px solid var(--gold-border)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center top, rgba(201,168,76,0.08), transparent 60%)' }} />
            <div className="relative">
              <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>
                RetirAI Pro
              </div>
              <div className="text-[28px] font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
                See your situation. <span style={{ color: 'var(--gold-light)' }}>Now act on it.</span>
              </div>
              <div className="text-[14px] max-w-[560px] mx-auto mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                You've built your pension picture across 3 countries. Pro gives you the tools to optimise it —
                tax simulation, legislative monitoring, family protection, and personalised AI advice.
              </div>

              {/* Pricing */}
              <div className="inline-flex items-end gap-1 mb-2">
                <span className="text-[42px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)', lineHeight: 1 }}>€14.90</span>
                <span className="text-[15px] mb-1" style={{ color: 'var(--text-dim)' }}>/ month</span>
              </div>
              <div className="text-[12px] mb-5" style={{ color: 'var(--text-dim)' }}>
                or €149/year (save 17%) · cancel anytime
              </div>

              {isPro ? (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl"
                  style={{ background: 'var(--green-dim)', border: '1px solid rgba(62,207,142,0.3)' }}>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--green)' }}>You're on Pro</span>
                </div>
              ) : (
                <Button variant="primary" onClick={toggleTier}>
                  Start Pro — €14.90/mo
                </Button>
              )}
            </div>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col gap-4 mb-6">
            {features.map((feature) => (
              <Card key={feature.title} style={{ borderColor: `color-mix(in srgb, ${feature.color} 25%, transparent)` }}>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `color-mix(in srgb, ${feature.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${feature.color} 25%, transparent)` }}>
                    {feature.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{feature.title}</div>
                    </div>
                    <div className="text-[12.5px] leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                      {feature.description}
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
                      {feature.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-dim)' }}>
                          <span style={{ color: feature.color }}>✓</span>
                          {h}
                        </div>
                      ))}
                    </div>

                    {/* Personalised hook */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px]"
                      style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
                      <span className="text-[10px]" style={{ color: feature.color }}>★</span>
                      <span style={{ color: 'var(--text-muted)' }}>{feature.hook}</span>
                    </div>
                  </div>

                  {/* Link to feature */}
                  <Link href={feature.href}
                    className="shrink-0 text-[11px] no-underline hover:opacity-80 transition-all mt-1"
                    style={{ color: feature.color }}>
                    View →
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Comparison table */}
          <Card className="mb-6">
            <div className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>Free vs Pro</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Feature', 'Free', 'Pro'].map((h, i) => (
                      <th key={h} className="px-4 py-2.5 text-[11px] uppercase tracking-wide font-semibold"
                        style={{
                          color: i === 2 ? 'var(--gold)' : 'var(--text-dim)',
                          borderBottom: '1px solid var(--border)',
                          background: i === 2 ? 'var(--gold-dim)' : 'var(--navy-3)',
                          textAlign: i === 0 ? 'left' : 'center',
                        }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Dashboard & KPIs', free: true, pro: true },
                    { feature: 'Career timeline', free: true, pro: true },
                    { feature: 'Payout estimation (all pillars)', free: true, pro: true },
                    { feature: 'Document uploads & AI extraction', free: true, pro: true },
                    { feature: 'Completeness tracking', free: true, pro: true },
                    { feature: 'Basic chat (rules & documents)', free: true, pro: true },
                    { feature: 'Tax & residency simulation', free: false, pro: true },
                    { feature: 'Capital vs annuity modeller', free: false, pro: true },
                    { feature: 'Document cross-referencing', free: false, pro: true },
                    { feature: 'Correction workflows', free: false, pro: true },
                    { feature: 'Legislative radar & impact analysis', free: false, pro: true },
                    { feature: 'Family claim guides & sharing', free: false, pro: true },
                    { feature: 'Personalised AI advisor', free: false, pro: true },
                    { feature: 'Dossier export (PDF)', free: false, pro: true },
                  ].map((row) => (
                    <tr key={row.feature} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-4 py-2.5" style={{ color: 'var(--text-muted)' }}>{row.feature}</td>
                      <td className="px-4 py-2.5 text-center text-[14px]" style={{ color: row.free ? 'var(--green)' : 'var(--text-dim)' }}>
                        {row.free ? '✓' : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-center text-[14px]" style={{ color: 'var(--green)', background: 'rgba(201,168,76,0.03)' }}>
                        ✓
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Bottom CTA */}
          {!isPro && (
            <div className="text-center py-4">
              <Button variant="primary" onClick={toggleTier}>
                Start Pro — €14.90/mo
              </Button>
              <div className="text-[11px] mt-2" style={{ color: 'var(--text-dim)' }}>
                Cancel anytime · no commitment · instant access
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatWidget />
    </div>
  );
}
