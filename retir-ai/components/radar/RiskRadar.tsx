'use client';

import { useState } from 'react';
import Link from 'next/link';
import { riskAlerts } from '@/lib/mock-data';
import { Card } from '@/components/ui/Card';
import type { AlertCategory } from '@/lib/types';

const categoryMeta: Record<AlertCategory, { label: string; icon: string; color: string }> = {
  retirement_age: { label: 'Retirement Age', icon: '🎂', color: 'var(--red)' },
  tax:            { label: 'Tax & Social Charges', icon: '💶', color: 'var(--amber)' },
  contribution:   { label: 'Contributions', icon: '📥', color: 'var(--blue)' },
  benefit:        { label: 'Benefits & Indexation', icon: '📊', color: 'var(--green)' },
};

const severityMeta: Record<string, { label: string; bg: string; color: string; border: string }> = {
  high:   { label: 'High', bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(239,68,68,0.25)' },
  medium: { label: 'Medium', bg: 'var(--amber-dim)', color: 'var(--amber)', border: 'rgba(245,158,11,0.25)' },
  low:    { label: 'Low', bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(62,207,142,0.25)' },
};

type FilterKey = 'all' | AlertCategory;

export function RiskRadar() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = filter === 'all' ? riskAlerts : riskAlerts.filter((a) => a.category === filter);
  const highCount = riskAlerts.filter((a) => a.severity === 'high').length;
  const countries = new Set(riskAlerts.map((a) => a.country)).size;

  return (
    <>
      {/* Explainer hero */}
      <div
        className="rounded-[18px] p-7 pb-6 mb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--navy-3) 0%, var(--navy-4) 100%)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="absolute rounded-full" style={{ top: -60, right: -60, width: 240, height: 240, background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)' }} />
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)' }}>
            📡
          </div>
          <div className="flex-1">
            <div className="text-[17px] font-bold mb-1.5" style={{ color: 'var(--text)' }}>
              Legislative & Regulatory Radar
            </div>
            <div className="text-[13px] leading-relaxed max-w-[640px]" style={{ color: 'var(--text-muted)' }}>
              We monitor pension laws, tax reforms, and regulatory changes across every country in your career.
              When a government proposes or enacts a change that could affect your retirement income, you'll see it here — with a clear explanation of what it means for you personally.
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-dim)' }}>Monitoring</div>
            <div className="flex gap-1.5 mt-1">
              {['🇫🇷', '🇨🇭', '🇱🇺', '🇪🇺'].map((flag) => (
                <span key={flag} className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                  {flag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <Card>
          <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
            Active Alerts
          </div>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
            {riskAlerts.length}
          </div>
          <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
            across {countries} jurisdictions
          </div>
        </Card>
        <Card>
          <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
            High Priority
          </div>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>
            {highCount}
          </div>
          <div className="text-xs mt-1.5" style={{ color: 'var(--red)' }}>
            require your attention
          </div>
        </Card>
        <Card>
          <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
            Countries Monitored
          </div>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
            {countries}
          </div>
          <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
            FR · CH · LU · EU
          </div>
        </Card>
        <Card>
          <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
            Last Updated
          </div>
          <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
            Today
          </div>
          <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
            auto-synced daily
          </div>
        </Card>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[11px] uppercase tracking-wider font-medium mr-1" style={{ color: 'var(--text-dim)' }}>Filter</span>
        {([
          { key: 'all' as FilterKey, label: 'All', icon: '📋' },
          ...Object.entries(categoryMeta).map(([key, meta]) => ({ key: key as FilterKey, label: meta.label, icon: meta.icon })),
        ]).map(({ key, label, icon }) => {
          const active = filter === key;
          const count = key === 'all' ? riskAlerts.length : riskAlerts.filter((a) => a.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key as FilterKey)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all"
              style={{
                background: active ? 'var(--gold-dim)' : 'transparent',
                border: active ? '1px solid var(--gold-border)' : '1px solid var(--border)',
                color: active ? 'var(--gold-light)' : 'var(--text-muted)',
              }}
            >
              <span>{icon}</span>
              {label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--navy-3)', color: 'var(--text-dim)' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-3">
        {filtered.map((alert) => {
          const sev = severityMeta[alert.severity];
          const cat = categoryMeta[alert.category];
          return (
            <div
              key={alert.id}
              className="rounded-xl p-5 cursor-pointer transition-all duration-200"
              style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {/* Header row */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-base shrink-0" style={{ background: sev.bg }}>
                  {alert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{alert.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                      {sev.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--navy-4)', color: cat.color, border: '1px solid var(--border)' }}>
                      {cat.icon} {cat.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-dim)' }}>
                    <span>{alert.flag} {alert.country}</span>
                    <span>·</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
                {alert.impact && (
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-dim)' }}>Impact</div>
                    <div className="text-[12px] font-semibold" style={{ color: sev.color }}>{alert.impact}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="text-[12.5px] leading-relaxed mb-3 pl-[54px]" style={{ color: 'var(--text-muted)' }}>
                {alert.description}
              </div>

              {/* Footer metadata */}
              <div className="flex items-center gap-3 pl-[54px] flex-wrap">
                {alert.source && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5" style={{ background: 'var(--navy-4)', color: 'var(--text-dim)' }}>
                    📰 {alert.source}
                  </span>
                )}
                {alert.effectiveDate && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5" style={{ background: 'var(--navy-4)', color: 'var(--text-dim)' }}>
                    📅 {alert.effectiveDate}
                  </span>
                )}
              </div>

              {/* Expert CTA for high severity */}
              {alert.severity === 'high' && (
                <div className="pl-[54px] mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-[12px] font-medium px-3.5 py-2 rounded-lg no-underline transition-all"
                    style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', color: 'var(--gold-light)' }}
                  >
                    👤 Get expert analysis on how this affects you
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
