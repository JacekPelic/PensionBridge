'use client';

import { servicePackages } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import type { ServicePackage } from '@/lib/types';

interface Props {
  onSelect: (pkg: ServicePackage) => void;
}

export function ServiceCatalog({ onSelect }: Props) {
  return (
    <>
      <div className="text-[15px] font-semibold mb-1" style={{ color: 'var(--text)' }}>Available Services</div>
      <div className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
        Each engagement starts with a quote tailored to your situation. No commitment until you approve.
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {servicePackages.slice(0, 3).map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onSelect={onSelect} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {servicePackages.slice(3).map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onSelect={onSelect} />
        ))}
      </div>

      {/* Custom inquiry */}
      <div
        className="rounded-[14px] p-5 flex items-center gap-5 mb-5 transition-all duration-200 cursor-pointer"
        style={{ background: 'var(--navy-3)', border: '1px dashed var(--navy-5)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-border)'; e.currentTarget.style.borderStyle = 'solid'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--navy-5)'; e.currentTarget.style.borderStyle = 'dashed'; }}
        onClick={() => onSelect({
          id: 'svc-custom',
          name: 'Custom Inquiry',
          category: 'full_consultation',
          description: 'Describe your question and we\'ll route it to the right specialist.',
          features: [],
          priceFrom: 0,
          currency: 'EUR',
          estimatedDays: 3,
          icon: '💬',
        })}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
          💬
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
            Don't see what you need?
          </div>
          <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Every pension situation is unique. Describe your question — whether it's about survivor benefits, early withdrawal penalties, cross-border inheritance, or anything else — and we'll connect you with the right specialist. Free initial assessment, no obligation.
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium shrink-0"
          style={{ color: 'var(--gold-light)', border: '1px solid var(--gold-border)', background: 'transparent' }}>
          Ask a Question →
        </span>
      </div>
    </>
  );
}

function PackageCard({ pkg, onSelect }: { pkg: ServicePackage; onSelect: (p: ServicePackage) => void }) {
  return (
    <div
      className="rounded-[14px] p-5 flex flex-col transition-all duration-200 relative"
      style={{
        background: 'var(--navy-3)',
        border: pkg.popular ? '1px solid var(--gold-border)' : '1px solid var(--border)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = pkg.popular ? 'var(--gold-border)' : 'var(--border)')}
    >
      {pkg.popular && (
        <div
          className="absolute -top-2.5 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
          style={{ background: 'var(--gold)', color: 'var(--navy)' }}
        >
          Most popular
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
          {pkg.icon}
        </div>
        <div>
          <div className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{pkg.name}</div>
          <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{pkg.estimatedDays} days delivery</div>
        </div>
      </div>

      <div className="text-[12px] leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
        {pkg.description}
      </div>

      <div className="flex flex-col gap-1.5 mb-4">
        {pkg.features.map((f, i) => (
          <div key={i} className="flex items-start gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="shrink-0 mt-0.5" style={{ color: 'var(--green)' }}>✓</span>
            <span>{f}</span>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between mt-auto">
        <div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>From</div>
          <div className="text-[22px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--gold-light)' }}>
            €{pkg.priceFrom}
          </div>
        </div>
        <Button variant={pkg.popular ? 'primary' : 'outline-gold'} onClick={() => onSelect(pkg)}>
          Request Quote
        </Button>
      </div>
    </div>
  );
}
