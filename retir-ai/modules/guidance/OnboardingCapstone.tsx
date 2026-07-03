'use client';

import type { PartialPicture } from '@/modules/identity/picture-types';
import type { DataAsk } from './types';

/**
 * Milestone surface shown once the user has resolved a meaningful chunk of
 * the picture (≥3 asks fulfilled). Pulls product offers from the asks the
 * user hasn't fulfilled yet, ranks them by gap-impact-per-euro contributed,
 * and shows the top three.
 *
 * Two outcomes the onboarding flow promises:
 *  1) Help the user understand & sharpen the picture (the asks themselves)
 *  2) Help the user act — partner products that close specific gaps (this)
 */
export function OnboardingCapstone({
  picture,
  asks,
}: {
  picture: PartialPicture;
  asks: DataAsk[];
}) {
  const fulfilledCount = countFulfilled(picture);

  if (fulfilledCount < CAPSTONE_THRESHOLD) return null;

  const offers = pickProductOffers(picture, asks);
  if (offers.length === 0) return null;

  return (
    <div
      className="rounded-[14px] overflow-hidden"
      style={{
        background: 'var(--navy-2)',
        border: '1px solid var(--gold-border)',
      }}
    >
      <div className="px-5 pt-5 pb-4 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div
            className="text-[10.5px] uppercase tracking-[0.14em] font-semibold mb-1"
            style={{ color: 'var(--gold-light)' }}
          >
            Where to act now
          </div>
          <h3
            className="text-[18px] leading-tight font-semibold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            Your picture is sharp enough to act on.
          </h3>
          <div className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Three partner products ranked by how much each €1 contributed moves your retirement income.
          </div>
        </div>
        <div
          className="text-[11px] px-2.5 py-1 rounded-full shrink-0"
          style={{ background: 'var(--gold-dim)', color: 'var(--gold-light)', border: '1px solid var(--gold-border)' }}
        >
          {fulfilledCount} steps resolved
        </div>
      </div>

      <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        {offers.map((entry, i) => (
          <CapstoneOffer key={entry.ask.id} entry={entry} rank={i + 1} />
        ))}
      </div>

      <div
        className="px-5 py-3 flex items-center justify-between gap-3 flex-wrap"
        style={{ background: 'var(--navy-3)', borderTop: '1px solid var(--border)' }}
      >
        <div className="text-[10.5px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          Clerio is paid only if you fund a product — a small trailing partnership fee, never a subscription.
          Projections assume 4% annual return and are illustrative.
        </div>
      </div>
    </div>
  );
}

// ─── Bits ───────────────────────────────────────────────────────────

const CAPSTONE_THRESHOLD = 3;

interface RankedOffer {
  ask: DataAsk;
  /** gapImpact / monthlyContribution — €/mo at retirement per €/mo today. */
  yieldRatio: number;
}

function countFulfilled(picture: PartialPicture): number {
  const status = picture.askStatus ?? {};
  return Object.values(status).filter((s) => s === 'fulfilled').length;
}

function pickProductOffers(picture: PartialPicture, asks: DataAsk[]): RankedOffer[] {
  const status = picture.askStatus ?? {};
  const ranked: RankedOffer[] = [];

  for (const ask of asks) {
    if (!ask.productOffer) continue;
    if (status[ask.id] === 'fulfilled') continue;

    const offer = ask.productOffer;
    if (offer.monthlyContribution <= 0) continue;

    ranked.push({ ask, yieldRatio: offer.gapImpact / offer.monthlyContribution });
  }

  ranked.sort((a, b) => b.yieldRatio - a.yieldRatio);
  return ranked.slice(0, 3);
}

function CapstoneOffer({ entry, rank }: { entry: RankedOffer; rank: number }) {
  const { ask } = entry;
  const offer = ask.productOffer!;
  const isTop = rank === 1;

  return (
    <div
      className="rounded-[12px] p-4 flex flex-col relative"
      style={{
        background: 'var(--navy-3)',
        border: isTop ? '1px solid var(--gold-border)' : '1px solid var(--border)',
      }}
    >
      {isTop && (
        <div
          className="absolute -top-px right-3 text-[9px] font-bold px-2 py-[2px] rounded-b-md tracking-wider"
          style={{ background: 'var(--gold)', color: 'var(--navy)', letterSpacing: '0.08em' }}
        >
          BEST MATCH
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-bold text-white shrink-0"
          style={{ background: offer.providerColor, fontFamily: 'var(--font-playfair)' }}
        >
          {offer.providerInitial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text)' }}>
            {offer.provider}
          </div>
          <div className="text-[10.5px]" style={{ color: 'var(--text-dim)' }}>
            {offer.productName}
          </div>
        </div>
      </div>

      <div className="text-[11.5px] leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>
        {offer.description}
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span
          className="text-[20px] font-bold tabular-nums"
          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--green)', lineHeight: 1 }}
        >
          +€{offer.gapImpact.toLocaleString()}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          /mo at retirement
        </span>
      </div>
      <div className="text-[10.5px]" style={{ color: 'var(--text-dim)' }}>
        €{offer.monthlyContribution}/mo · {offer.horizon} yrs
      </div>
    </div>
  );
}
