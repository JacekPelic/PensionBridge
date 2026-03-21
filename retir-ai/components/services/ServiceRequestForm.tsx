'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ServicePackage } from '@/lib/types';

interface Props {
  pkg: ServicePackage;
  onClose: () => void;
  onSubmit: () => void;
  prefillContext?: string;
}

export function ServiceRequestForm({ pkg, onClose, onSubmit, prefillContext }: Props) {
  const [description, setDescription] = useState(prefillContext || '');
  const [contact, setContact] = useState<'email' | 'phone' | 'chat'>('email');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div
        className="w-[520px] max-w-[90vw] max-h-[85vh] overflow-y-auto rounded-[18px] p-6"
        style={{ background: 'var(--navy-2)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
              {pkg.icon}
            </div>
            <div>
              <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{pkg.name}</div>
              <div className="text-[12px]" style={{ color: 'var(--text-dim)' }}>
                {pkg.priceFrom > 0 ? `From €${pkg.priceFrom} · ${pkg.estimatedDays} days` : 'Free initial assessment'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-lg px-2 py-1 cursor-pointer" style={{ background: 'none', border: 'none', color: 'var(--text-dim)' }}>✕</button>
        </div>

        {/* How it works */}
        <div className="rounded-xl p-4 mb-5" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
          <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-dim)' }}>How it works</div>
          <div className="flex gap-3">
            {[
              { step: '1', label: 'You describe your need', color: 'var(--gold)' },
              { step: '2', label: 'We send a tailored quote', color: 'var(--blue)' },
              { step: '3', label: 'You approve, we deliver', color: 'var(--green)' },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-2 flex-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: 'var(--navy-4)', color: s.color }}>
                  {s.step}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>
              Describe what you need help with
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="E.g., I need help locating my Swiss Pillar 2 from my employment at UBS (2014–2019). I believe it was transferred to a Freizügigkeitskonto but I don't know which institution holds it..."
              className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none resize-none"
              style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}
            />
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-dim)' }}>
              Preferred contact method
            </label>
            <div className="flex gap-2">
              {([['email', 'Email'], ['phone', 'Phone call'], ['chat', 'In-app chat']] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setContact(value)}
                  className="flex-1 py-2 rounded-lg text-[12px] font-medium cursor-pointer transition-all"
                  style={{
                    background: contact === value ? 'var(--gold-dim)' : 'transparent',
                    border: contact === value ? '1px solid var(--gold-border)' : '1px solid var(--border)',
                    color: contact === value ? 'var(--gold-light)' : 'var(--text-muted)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Price note */}
          <div className="rounded-lg p-3 text-[11.5px] leading-relaxed" style={{ background: 'var(--blue-dim)', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--blue)' }}>No commitment yet.</strong> We'll review your request and send a personalised quote within 24 hours. You only pay after you approve the scope and price.
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-5">
          <Button variant="primary" onClick={onSubmit}>
            Request Quote
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
