'use client';

import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

export function CareerSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
          Estimated Insurance Years
        </div>
        <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 32, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
          21.1 <span className="text-lg" style={{ color: 'var(--text-muted)' }}>yrs</span>
        </div>
        <div className="text-[10px] mt-1 inline-flex items-center gap-1 px-2 py-[2px] rounded-full"
          style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.2)' }}>
          ◎ From imported data · not verified
        </div>
        <hr className="my-[18px]" style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
        <div className="flex flex-col gap-2">
          {[
            { flag: '🇫🇷', label: 'France', value: '~9.8 yrs', sub: '2 periods' },
            { flag: '🇨🇭', label: 'Switzerland', value: '~5.3 yrs', sub: '1 period' },
            { flag: '🇱🇺', label: 'Luxembourg', value: '~6.0 yrs', sub: '1 period (ongoing)' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center text-[12.5px]">
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{row.flag} {row.label}</span>
                <span className="text-[10px] ml-1.5" style={{ color: 'var(--text-dim)' }}>{row.sub}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <hr className="my-[18px]" style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
        <div className="flex items-start gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          <span className="shrink-0 mt-px" style={{ color: 'var(--amber)' }}>⚠</span>
          <span>14-month gap detected (Aug 2013 – Aug 2014). Add missing employment to get a more complete picture.</span>
        </div>
      </Card>

      <Card>
        <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
          Gap Impact
        </div>
        <div className="text-[12.5px] mb-2.5" style={{ color: 'var(--text-muted)' }}>
          Fixing the Jan–Mar 2020 gap could recover:
        </div>
        <div style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, fontWeight: 700, color: 'var(--green)' }}>
          +€120/mo
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>= +€43,200 over 30 years of retirement</div>
        <hr className="my-[18px]" style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
        <Button variant="primary" className="w-full justify-center">Correct This Gap</Button>
      </Card>

      <Card>
        <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
          Improve Accuracy
        </div>
        <div className="text-[12.5px] leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
          Your timeline is based on imported career data. Upload official documents to verify your insurance years and unlock workplace pension.
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { flag: '🇫🇷', doc: 'Relevé de Carrière', impact: '+12% accuracy' },
            { flag: '🇨🇭', doc: 'AHV/AVS Extract', impact: '+10% accuracy' },
            { flag: '🇱🇺', doc: 'Extrait de Carrière', impact: '+18% accuracy' },
          ].map((row) => (
            <div key={row.doc} className="flex items-center justify-between text-[11.5px] p-2 px-2.5 rounded-lg"
              style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{row.flag} {row.doc}</span>
              <span style={{ color: 'var(--amber)' }}>{row.impact}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
