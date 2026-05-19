# Shape Brief — Tour Peak-End Summary

Generated via `/impeccable:shape` on 2026-04-18.
Anchored in `.impeccable.md` (Prevista design context).

Status: **approved by user** · ready for `/impeccable:craft` or direct implementation.

---

## 1. Feature Summary

The closing step of the guided pillar tour on `/picture`. After a user completes (or skips) the three-pillar walkthrough, they currently see generic stat cards. This redesign turns that moment into the **peak-end payoff** — the user sees the refined monthly projection that their answers just produced, in one calm, unambiguous frame, before moving on.

## 2. Primary User Action

**Understand that the work they just did changed the picture**, then move to the dashboard to see the full consequences.

The user's eye should land on one number — their updated monthly income at retirement — and they should leave the tour feeling "that was worth 10 minutes."

## 3. Design Direction

Anchored in the `.impeccable.md` voice: **calm · authoritative · precise**.

This is *not* a celebration screen. No confetti, no green-checkmark explosions, no "🎉 Congratulations". It's the moment a private banker turns the folder toward you and says "here's what we have for you now." Typographic, considered, slightly generous whitespace. One hero number in Playfair. Supporting context in smaller DM Sans. Motion used sparingly — the hero number eases in (ease-out-quart, not bounce), the delta fades in after it, the CTA enters last.

The tone the user leaves with: *quietly reassured that the picture is sharper*. Not pumped up, not patronised.

## 4. Layout Strategy

A single centred column, bounded by the tour modal's existing frame. Vertical tiers of emphasis, top-to-bottom:

1. **Quiet eyebrow** — small uppercase micro-label (`YOUR UPDATED PICTURE` / `YOUR STARTING PICTURE` / `TOUR COMPLETE`). Gold-light, tracking-wide.
2. **Hero number** — the new monthly projection in Playfair, large. Net if modelled, gross otherwise. Beside it, a small `NET` / `gross` chip matching `PicturePreview`'s existing semantics. Below, a one-line soft caption: *"Based on what you added. Updates as you refine further."*
3. **Delta strip** — small, horizontal, gold-tinted. Shows the change from where the tour started:
   - Improvement: `+€{n}/mo from where you started`
   - Confidence win (headline flat): `Range tightened from ±€{before} to ±€{after}/mo`
   - First picture: `Your starting point — you can refine any of these later`
4. **What now lives in your picture** — a 2–3 row compact list of the most impactful fulfilled items **this session** (e.g. *"Swiss BVG · €860/mo tracked"*, *"French Agirc-Arrco · €420/mo tracked"*). Omitted if nothing was fulfilled this session.
5. **Soft footer** — if items were skipped: *"N items waiting on your asks list — come back anytime."* Faint, low-contrast.
6. **CTAs** — primary `See your full dashboard →` (auto-route target), secondary ghost `Keep refining on your picture`.

No stats grid. The current `SummaryStep`'s three stat cards (Fulfilled / Workplace plans / Personal savings) are replaced by the narrative vertical flow above.

## 5. Key States

| State | Conditions | What user sees / feels |
|---|---|---|
| **Headline improvement** | Before estimate < after estimate | Big new number. Positive delta strip. Fulfilled-items list. *"Your picture is sharper now."* |
| **Confidence win, headline flat** | Before ≈ after but band tightened | Big (same) number. Delta strip shows band-narrowing instead of €-delta. Still positive. *"The numbers didn't move much — they just became more certain."* |
| **Started from blank** | No prior picture, tour produced first estimate | Big number. "Your starting picture" framing (no delta; nothing to compare to). Fulfilled-items list emphasised. |
| **Mostly skipped** | User clicked Skip through most asks | Modest number. No fulfilled-items list. Softer headline ("A starting point."). Footer with skipped count is the dominant follow-up. *"Come back when you have a document handy."* |
| **Demo / mock mode** | Tour run on Mats's pre-fulfilled mock | Headline reflects Mats's canonical number. Delta hidden (no "before"). Copy acknowledges this is the demo: *"This is Mats's refined picture. Start fresh to build your own."* |
| **Estimate engine returns zero** | Edge: residence missing somehow | Fallback copy: *"Add a country to see your picture."* Primary CTA disabled. |

## 6. Interaction Model

- **Entry**: User reaches the last step of `deriveTour()` (the `summary` kind). Tour modal stays open; this step replaces the current `SummaryStep` component in `modules/guidance/PillarTour.tsx`.
- **On mount**:
  - Read the "before" estimate that was snapshotted when the tour started (new state in `PillarTour`).
  - Compute the "after" estimate from the current picture.
  - Animate the hero number with an ease-out-quart roll-up from the before value to the after value (~800 ms). If there is no "before", just fade in.
  - After the number settles, fade in the delta strip (~150 ms delay).
  - Fade in the fulfilled-items list (~300 ms delay).
  - CTAs last (~450 ms delay).
- **Primary CTA** (`See your full dashboard`): closes the tour, marks `everCompleted: true`, navigates to `/`. Dashboard re-renders from the same picture so the numbers there match.
- **Secondary CTA** (`Keep refining on your picture`): closes the tour, stays on `/picture`, user can tap the asks stack for anything they skipped.
- **Reduced motion**: respects `prefers-reduced-motion` — numbers appear instantly, no roll-up, fades replaced with instant opacity changes.
- **Modal dismiss**: Escape or the close button both behave as "close without navigating" (stays on `/picture`). No data loss — the picture is already saved by the time this step renders.

## 7. Content Requirements

- **Eyebrow label**:
  - `YOUR UPDATED PICTURE` — improvement or confidence win
  - `YOUR STARTING PICTURE` — first tour ever (no prior estimate)
  - `TOUR COMPLETE` — mostly skipped / negligible change
- **Hero caption**: *"Based on what you added. Updates as you refine further."* Consistent with Topbar subtitles from the clarify pass.
- **Delta copy**: listed above.
- **Fulfilled-items list** — up to 3 lines. Format: `{flag} {label} · €{n}/mo tracked`. If more than 3 were fulfilled this session, show top 3 by monthly €.
- **Skipped footer**: *"{n} item{s} waiting on your asks list — come back anytime."* Hidden if `n === 0`.
- **Primary CTA**: `See your full dashboard →`
- **Secondary CTA**: `Keep refining on your picture`
- **Number formatting**: tabular-nums, thousand separators, no decimals. Example: `€4,200/mo`. Deltas over €2,000 render as `+€2,100/mo`.

## 8. Recommended References

During implementation, consult:
- **motion-design.md** — for the roll-up easing, stagger timing, `prefers-reduced-motion` handling. The roll-up carries the "calm relief" feeling; wrong easing undermines the whole brief.
- **spatial-design.md** — for the vertical rhythm between tiers. Default to `--space-md/lg/xl` in a generous pattern; resist making it dense.
- **typography.md** — for the hero number's optical adjustment (tabular-nums + slight letter-spacing) so it reads as a number, not text.
- **cognitive-load.md** — justifies removing the three-stat grid. If anyone pushes back, this reference is the argument.

## 9. Open Questions (resolve at implementation time)

- **Before-estimate snapshot** — take it at `startTour()` in `PictureSurface` (when user commits to doing the tour) rather than at the `p1` intro. Recommended: tour-start locks the "before" frame.
- **Net vs gross headline** — follow `PicturePreview`'s existing rule: use `net.totalMonthly` when available, else `totalMonthly` gross. Show the same `NET` chip consistently.
- **Fulfilled-items filtering** — include only asks fulfilled *this session*. Requires tracking `askStatusAtTourStart` alongside the estimate snapshot.
- **Mock-mode behaviour** — if `mode === 'mock'` at tour end, suppress the delta strip entirely (there is no "before"). The mock persona's tour is illustrative.
- **Downgraded picture edge case** — if the user overwrites values with worse ones, show the same structure but neutral — no negative framing of the user's own answers.

---

## Related Artifacts

- **Audit**: `docs/design-audit-2026-04-18.md` — the code-level audit that identified the peak-end-rule violation as a P2 issue.
- **Design context**: `.impeccable.md` — the voice and principles this brief inherits.
