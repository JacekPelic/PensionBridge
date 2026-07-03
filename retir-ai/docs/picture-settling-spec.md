# `/picture` redesign spec — "The Settling Picture" (fixed)

Status: **approved direction** (chosen 2026-06-08 from a 3-flow design panel; this is the "fixed S0" variant).
Interactive reference mockup: **`docs/picture-flow-settling-fixed.html`** (open in a browser — it is the visual source of truth for this spec).
Supersedes the current `/picture` layout (`PictureSurface` + `PicturePreview` + `TourCta` + `AsksStack` + `OnboardingCapstone`) for the **entry experience**.

---

## 1. Why this exists

**Promise of `/picture`:** make assembling messy, multi-country pension data feel *simple and unintimidating* for an anxious 45–65 user — so they keep going instead of bouncing.

**The problem we're fixing:** the current flow assumes the user has documents ready and immediately asks them to upload/enter data (e.g. "Luxembourg Extrait de Carrière"). Most first-session users have **few or no documents on hand** and first need to learn **what exists and how to get it**. The old tour also dead-ended on a broken "Upload" default and a 15-step march.

**Success test (acceptance — see §10):** an anxious 58-year-old with **no or partial documents** finishes the first session knowing **(a)** what to do, **(b)** *how* to do it — including how to obtain each document, and **(c)** that partial is fine, they can stop anytime, and nothing is lost.

**Core principle:** *The picture is always already there as an answer.* Gathering is never a to-do list the user faces — it's **one clear, contextual next step** attached to the single number it would most improve. The user never sees "you have 11 things missing." Emptiness is reframed as "here's your estimate"; filling is reframed as "watch this band tighten."

> Panel note: a gather-first **checklist** was explicitly rejected — an 11-row list is still "a list of things you're behind on" (the government-portal density the brand rejects) and forces 11 decisions before any payoff. The answer-first surface scored highest on hierarchy + brand fit. The one fix it needed — a real call-to-action instead of a dismissable "whisper" — is baked into this spec.

---

## 2. Screens & states

The whole experience is **one surface** (no separate "modes", no linear tour). States below are progressive, not separate pages.

### S0 — The picture, on arrival
The default and home state. Built from opening data alone (`estimate()` already returns bands + total + a contextual insight from as little as residence + age).

- **Eyebrow:** `YOUR RETIREMENT INCOME` + an `EARLY ESTIMATE` badge.
- **Hero (floor reframe):** lead sentence `Based on what you've told us so far, you're on track for at least:` → hero figure **`€2,200` a month** (the band *low*, in Geist Mono) → subline `…and likely up to €3,840 as we confirm the details. Documents only move this up.`
  - Rationale: the wide estimate reads as reassurance ("the floor"), never a vague verdict. The floor = band low; the "up to" = band high, both from `estimate()`.
- **The pillar picture:** the three-pillar / by-country bands from `estimate()` rendered as **soft estimate ranges** (a translucent fill spanning low→high on a track). Wider fill = less certain. Known pillars render tighter; unknown ones stay soft. Workplace & Personal, when absent, show a quiet `not yet counted · likely +€1,000/mo` row (no bar).
- **The one action (THE fix):** exactly **one** primary CTA, rendered **inline on the single weakest/highest-leverage band** (see §3). It is a real gold button, not a grey link:
  - copy block: `Switzerland is the widest part of your picture.` / `One free document, by post, narrows it by about €400/mo.`
  - button: **`Tighten your Swiss estimate →`**
- **Prepared-user door:** a quiet, persistent secondary button `I already have my documents →` (see S3').
- **The contract (always visible, low):** `Everything saves automatically. Add more whenever — the picture only sharpens.`
- **No** "Start the tour" banner, **no** asks list, **no** quick-edits grid competing for attention.

### S1 — Guide opens in place
Tapping the CTA expands the **existing `DataAsk.guide`** inline, directly under the band (band stays visible above so the payoff is in view).

- **"Save for later" at the TOP** (low-effort exit reachable in one move): `No rush — bank it and go: [Save this to gather later ☆]`.
- Guide body from `ask.guide`: title (`Swiss AVS account statement (Kontoauszug)`), metadata chips (`timeEstimate` → "Arrives by post · 1–2 weeks", `difficulty` → "Easy", free), numbered `steps`, and `altPath` ("Lost your AHV number? …").
- **Closes with reassurance, NOT a sales pitch:** `No rush — your estimate already stands without this.`
- Two actions: **`Save this to gather later`** (primary, passive capture) and **`I have it now — enter it`** (ghost → reveals AskCard upload/manual tabs).

### S2 — Save-for-later → visible payoff (THE second fix)
On "Save this to gather later":
- the band **visibly narrows** toward a labelled provisional target (animated width change),
- an on-the-way marker appears: `1 document on the way — adds ~€400/mo when you upload it. Saved to gather.` (teal dot),
- a **"Things to gather (n)"** tray appears low on the page (collapsed list of saved guides),
- the single nudge **migrates to the next highest-leverage band** (never two nudges at once).

This converts a zero-data tap into *felt* progress and a concrete reason to return.

### S3 — Has-docs fast path (same surface, no mode switch)
"I have it now" reveals AskCard's existing **upload + manualForm** tabs in place. On save: the band re-renders **tight**, the read-out line flips to the engine read-out ("Switzerland is now calculated by the real engine"), and the next-weakest band grows its nudge.

### S3' — Prepared-user door
`I already have my documents →` opens a **flat, finite list of all derived asks** (`deriveAsks` already returns the full prioritised set) with upload/manual inline — worked in the user's own order, no teaching gate, no weakest-first throttle. The calm one-action surface remains the default for everyone else. (Directly fixes the prepared-expat "no way in" stall.)

### S4 — Stop anytime, intact
No tour to abandon, no checklist half-done. Whatever was entered is in the picture; whatever was saved sits in the gather tray. The persistent contract line is the only "save" affordance needed. No "you're 30% done" progress guilt.

### S5 — Return session
Hero answer is unchanged-but-tighter. The collapsed **"Things to gather"** tray holds saved items (with guides intact) as a calm reference, not a nag. One fresh nudge appears on the now-weakest band. Across sessions, bands narrow estimate-grey → engine-tight → verified.

---

## 3. The single-nudge selector (new logic — get this right)

The whole calm promise rests on **the one surfaced nudge being the right one.**

- **Rank by `ask.impact` (the € value), NOT by band width and NOT by static `priority` alone.** `deriveAsks` today sorts by static `priority` and does not consider band spread; surfacing a marginal LU item (±€150) ahead of forgotten Swiss vested benefits ("€50k–300k found money", priority high) because one band is slightly wider would point the single load-bearing nudge at the small prize.
- Selection: from `deriveAsks(picture)` filtered to unfulfilled **and not `saved`**, pick the **highest projected-€ impact**; tie-break to high-priority "found money" P2 asks; place the nudge on that ask's associated pillar/country band.
- **Exactly one** nudge visible at a time. After it's fulfilled or saved, recompute and surface the next.

---

## 4. Data & reuse map

| Piece | Powered by (existing) |
|---|---|
| Hero band + total + "up to" + read-out sentence | `estimate()` — `modules/identity/components/onboarding-v2/estimate.ts:122` (returns bands/total/sharpness/insight from partial data) |
| Candidate asks + priority + the per-item € impact | `deriveAsks(picture)` + `DataAsk` (`modules/guidance/types.ts`: `impact`, `priority`, `whyNow`, `timeEstimate`, `difficulty`, `steps`, `altPath`, `tips`, `guide`) |
| The inline "how to get it" guide | `DataAsk.guide` rendered by `GuidePane` (in `AskCard.tsx`) |
| Upload + manual entry (has-docs / "I have it now") | `AskCard` upload + `ManualPane` tabs, unchanged (`modules/guidance/AskCard.tsx`) |
| Prepared-user flat list (S3') | the full `deriveAsks` set + existing `AskCard` |
| Band-group labels | repurpose `PHASE_INTROS` one-liners (`modules/guidance/tour.ts`) |

**Retired from the entry path:** `deriveTour` / `PillarTour` (15 linear steps) / `TourCta` / `AsksStack` (the "show 3 then more" list). The tour machinery is not deleted but is **no longer the `/picture` entry experience**.

---

## 5. New work required (all presentation-layer, no backend)

1. **Single-nudge selector** (§3) — impact-ranked pick of one ask, suppress the rest.
2. **Inline band placement** — render the nudge attached to its band (not a bottom stack); "one at a time" rule + the save→migrate behaviour.
3. **Gather tray + `'saved'` AskStatus** — extend `AskStatus = 'fulfilled' | 'skipped'` → add `'saved'` (`modules/identity/picture-types.ts:7`). The tray is a collapsed list of `saved` asks with their guides. **This is the one type/state change; everything else is presentation.**
4. **Fix the guide's ending in the gather context** — the guide currently ends in `StuckFooter` (`AskCard.tsx:117`, the "Stuck? … this preview shows what they'd say / Pro" teaser). In the Settling gather flow, replace that closing with `Save this to gather later` + `No rush — your estimate already stands without this.` (The advisor/Pro path can remain elsewhere, but **not** as the closer of the one guide an anxious no-docs user dared to open.)
5. **Provisional band animation** — on `saved`, narrow the band toward a labelled provisional target + the "€X/mo on the way" marker.
6. **Floor-reframe hero** — copy + binding low/high from `estimate()` bands.

---

## 6. Visual & interaction system

- **Palette:** the shipped warm tokens (`globals.css`) — gold the single accent; **teal** (`--green`) only for verified/"on the way" state; no gradients, no hatching on the live UI (the mockup's dashed "rough estimate" fill is acceptable as the *soft-estimate* visual — a single, intentional texture meaning "uncertain", not decoration).
- **Type:** Source Serif 4 (lead sentence + guide titles), Inter Tight (UI), Geist Mono + tabular-nums (every figure).
- **The CTA** is a real ≥48px gold button; the prepared-door and "save" are ≥44px. Body ≥14–16px (older-user baseline).
- **Motion:** calm ease-out only; the band-narrowing on save is the one signature animation (≤700ms). No bounce.

---

## 7. Accessibility

- The single nudge is a real `<button>` with a clear accessible name (not an icon/whisper). 
- Band narrowing is accompanied by text ("€400/mo on the way") — never colour/animation alone.
- Full keyboard operation; visible focus; the guide is a disclosure with proper `aria-expanded`.
- WCAG AA contrast (the warm palette already clears the prior light-mode failure).

---

## 8. Acceptance criteria

- **Anxious / no-docs (the core test):** lands on a finished-feeling estimate; is asked for nothing up front; meets **one** clear action; opening it teaches *how to get* the document (free, by post, where) with no upsell at the end; can "save to gather" in one move and **see** a payoff; leaves with a real estimate on screen + a short, prioritised, how-to-backed gather list + explicit "nothing is lost." **Enters zero data and the session still feels complete.**
- **Procrastinator (one thing then leaves):** cannot leave the first screen without an obvious action present; saving the one thing **shows visible progress** (band narrows, €X on the way) and a concrete reason to return.
- **Prepared / has-docs:** has an always-visible "I have my documents" door into a **finite** entry list in their own order — never throttled to weakest-first or gated behind a teaching step. The "Step 1 of 15" feeling is gone (a filtered entry list contains only completable items).
- **No horizontal overflow at 390px; both themes first-class.**

---

## 9. Out of scope / open

- Real upload extraction (still a stub today) — manual entry remains the working path; do **not** present upload as the only/default door until it works.
- Email/print of the gather tray (a nice takeaway artifact from the panel) — **optional follow-up**, not required for v1.
- The tour is retired from entry but kept for now; a later pass can repurpose its content or remove it.

---

## 10. Build sequencing (suggested)

1. `'saved'` AskStatus + gather-tray state (the only data change).
2. Single-nudge selector (impact-ranked) + inline band placement; retire `AsksStack`/`TourCta` from `PictureSurface`.
3. Floor-reframe hero + soft-estimate band component in `PicturePreview`.
4. Save→payoff animation + nudge migration.
5. Guide closer fix (replace `StuckFooter` in gather context) + "Save for later" at top.
6. Prepared-user door (S3') → flat finite `deriveAsks` entry list.
7. Verify against §8 at 390px + 1280px, light + dark.
