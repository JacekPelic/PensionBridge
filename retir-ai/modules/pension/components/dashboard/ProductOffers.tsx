'use client';

import { productOffers } from '@/modules/pension/data/mock-data';
import { Pill } from '@/shared/ui/Pill';
import { Button } from '@/shared/ui/Button';

export function ProductOffers() {
  return (
    <div className="grid grid-cols-3 gap-3.5 mb-[18px]">
      {productOffers.map((offer) => (
        <div
          key={offer.id}
          className="rounded-[14px] p-[18px] px-4 flex flex-col relative transition-all duration-200"
          style={{
            background: 'var(--navy-3)',
            border: offer.isBestMatch ? '1px solid var(--gold-border)' : '1px solid var(--border)',
          }}
        >
          {offer.isBestMatch && (
            <div className="absolute -top-px right-4 text-[9px] font-bold px-2 py-[2px] rounded-b-md tracking-wide"
              style={{ background: 'var(--gold)', color: '#000', letterSpacing: '0.05em' }}>
              BEST MATCH
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Pill variant="gold" style={{ fontSize: 9, padding: '2px 8px' }}>Partner</Pill>
          </div>

          {/* Provider */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: offer.providerGradient }}>
              {offer.providerInitial}
            </div>
            <div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{offer.provider}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{offer.country}</div>
            </div>
          </div>

          <div className="text-[12.5px] font-semibold mb-1" style={{ color: 'var(--text)' }}>{offer.productName}</div>
          <div className="text-[11.5px] leading-relaxed mb-3.5 flex-1" style={{ color: 'var(--text-muted)' }}>
            {offer.description}
          </div>

          {/* Impact */}
          <div className="rounded-lg p-2.5 px-3 mb-3.5" style={{ background: 'var(--green-dim)' }}>
            <div className="text-[11px] mb-0.5" style={{ color: 'var(--text-dim)' }}>Projected gap impact</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--green)' }}>
                +€{offer.gapImpact}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>/mo at retirement</span>
            </div>
            <div className="text-[11px] mt-[3px]" style={{ color: 'var(--text-dim)' }}>
              €{offer.monthlyContribution}/mo contribution · {offer.horizon} yr horizon
            </div>
          </div>

          <Button variant="primary" className="w-full justify-center text-xs py-[9px]">
            See offer
          </Button>
        </div>
      ))}
    </div>
  );
}
