# Prevista — Design Audit (2026-04-18)

Generated via `/impeccable:audit` after the /picture rebuild, rebrand, data alignment, concierge removal, and "Stuck? Ask your advisor" feature. Re-run `/impeccable:audit` after the fixes below to see the score improve.

Design context lives in `.impeccable.md` (copied into `CLAUDE.md` via `@` import).

---

## Audit Health Score — **10/20** (Acceptable — significant work needed)

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | **2** | Light-mode body text ≈ 3.2:1 contrast (below WCAG AA); icon-only buttons missing aria-labels; no page-level `<h1>` |
| 2 | Performance | **3** | No layout-property animations, memoisation in place, no re-render traps |
| 3 | Theming | **2** | 40+ hard-coded hex/rgba values outside `globals.css`; hardcoded `white` / `#000` don't theme-flip |
| 4 | Responsive | **1** | `grid-cols-2`/`grid-cols-3` with no mobile fallback; only ~7 responsive prefixes project-wide; touch targets <44px |
| 5 | Anti-Patterns | **2** | Both fonts on the impeccable reject list (Playfair Display + DM Sans); bounce easing on `popIn`; decorative radial gradients; icon+heading+body card templating on `/pro` |

**Issue count:** P0 = 0 · P1 = 4 · P2 = 6 · P3 = 3

---

## Anti-Patterns Verdict

**Fail — not AI slop, but several tells.** Passes the three biggest BANs: no border-left stripes, no gradient text, no glassmorphism. Colour palette (navy + gold) is distinctive. Three tells:

1. **Font pairing is both on the reject list.** `app/layout.tsx:2` — Playfair Display + DM Sans are the "reflex reject" pair that converges AI-generated projects.
2. **`popIn` uses bounce/overshoot easing.** `app/globals.css:88` — elastic `cubic-bezier(0.175, 0.885, 0.32, 1.275)`.
3. **Templated icon-card grid on `/pro`.** `app/pro/page.tsx:117-159` — five cards all share icon-chip + heading + description + highlights + hook.

Minor: decorative radial gradients at page corners (`/pro`, Family, Radar, RetirementGap); copy redundancy on `/pro` hero.

---

## Detailed Findings

### P1 — Major (fix before release)

**[P1] Light-mode body text fails WCAG AA**
- `app/globals.css:28-40` — `--text-muted: #5a6478` on `--navy: #f5f6fa` ≈ 3.2:1.
- Entire light theme affected (muted text is used everywhere).
- Fix: darken `--text-muted` toward `#3d4658`; audit `--text-dim` + `--gold-light`; move to OKLCH with chroma-reduced tints near white.
- Command: `/typeset`

**[P1] Grid layouts break below ~400px**
- `modules/pension/components/estimation/IncomeBreakdown.tsx:200` (`grid-cols-2`)
- `modules/identity/components/onboarding-v2/QuestionCard.tsx:109` (`grid-cols-3` country selector)
- `modules/guidance/AskCard.tsx:230` (`grid-cols-2` manual entry)
- Fix: `grid-cols-1 md:grid-cols-2/3` pattern, or `auto-fit minmax()`.
- Command: `/adapt`

**[P1] Touch targets below 44×44px**
- `shared/layout/Sidebar.tsx:92` (nav items `py-[9px]` ≈ 40px), `:104` (theme toggle `py-2` ≈ 32px), badges at `py-[1px]`/`py-[2px]`.
- Fails WCAG 2.1 SC 2.5.5.
- Fix: min 44×44 hit-area via padding (visual size can stay smaller with invisible padding).
- Command: `/adapt`

**[P1] Banned font pairing (Playfair Display + DM Sans)**
- `app/layout.tsx:2`, `:6-22`.
- Biggest AI-slop signal in the codebase.
- Fix: pick a display + body pair off the beaten path. Candidates: GT Sectra / Signifier / Recoleta Alt (display) × Söhne / Untitled Sans / ABC Diatype (body). Google Fonts fallbacks: Young Serif / Sentient for display, Lexend Deca / Outfit-alt / Be Vietnam Pro for body — must NOT be on the reflex-reject list.
- Command: `/typeset`

### P2 — Minor (fix in next pass)

**[P2] Icon-only buttons missing `aria-label`**
- `shared/layout/Sidebar.tsx:163` (theme toggle), `shared/chat/ChatWidget.tsx:92` (close ×), `:180` (FAB).
- Command: `/polish`

**[P2] No `<h1>` on any page**
- All `app/**/page.tsx` start at `<h2>` (e.g. `QuestionCard.tsx:43`).
- Fix: make `Topbar` render `<h1>` for the page title.
- Command: `/polish`

**[P2] Form inputs without `<label htmlFor>` linkage**
- `modules/identity/components/onboarding-v2/QuestionCard.tsx:152, :164`, `modules/guidance/AskCard.tsx:449`, `modules/guidance/PillarTour.tsx:450`.
- Command: `/polish`

**[P2] Hard-coded colours outside the token system (40+)**
- `modules/identity/components/onboarding-v2/PicturePreview.tsx:10-19` (`COUNTRY_COLORS` hex table).
- `modules/family/data/mock-data.ts:5-11` (delegate gradients).
- Scattered `rgba(…)` in `modules/radar/**`, `modules/family/**`, `modules/pension/**`.
- Fix: promote `COUNTRY_COLORS` into `globals.css` with `[data-theme="light"]` overrides; replace inline rgba with tokens or `color-mix`.
- Command: `/harden` then `/polish`

**[P2] `white` / `#000` / `#fff` don't theme-flip**
- `shared/chat/ChatWidget.tsx:208` (`color: '#fff'` on red badge), `shared/layout/Sidebar.tsx:113` (`color: 'white'` on red badge), product-offer button `color: '#000'`.
- Fix: introduce `--text-on-red`, `--text-on-gold` tokens.
- Command: `/harden`

**[P2] `outline: none` / `outline-none` without `:focus-visible` replacement**
- 11 instances — notably `shared/chat/ChatWidget.tsx:181`, `modules/guidance/AskCard.tsx:259`, `modules/identity/components/onboarding-v2/QuestionCard.tsx:163, :523`.
- Fix: global `:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }` or per-element ring.
- Command: `/polish`

### P3 — Polish

**[P3] Bounce easing on `popIn`**
- `app/globals.css:88`.
- Replace with ease-out-quart `cubic-bezier(0.25, 1, 0.5, 1)`.
- Command: `/animate`

**[P3] Decorative radial gradients at page corners**
- `app/pro/page.tsx:85`, `modules/family/components/FamilyAccess.tsx`, `modules/radar/components/RiskRadar.tsx`, `modules/pension/components/dashboard/RetirementGap.tsx:62`.
- Command: `/quieter`

**[P3] Copy redundancy on `/pro` hero**
- `app/pro/page.tsx:86-92`.
- Keep H1, trim subtitle to a single fact, drop the body line.
- Command: `/clarify`

---

## Systemic Patterns

- **Responsive was never designed in.** Only ~7 breakpoint-prefix uses project-wide. Needs a structured mobile-first pass, not scattered fixes.
- **Token discipline is partial.** Core palette tokenised; 2nd-tier (country colours, avatar gradients, rgba borders) drifted into components. Light-mode parity not audited against dark.
- **Typography identity is borrowed.** Playfair + DM Sans + DM Mono is the most common AI-generated landing-page stack.
- **Motion is incidental.** One fadeIn, one popIn with bounce, inline transitions. No orchestrated page-load choreography.

---

## Positive Findings

- Colour palette (navy + gold + semantic rest) is intentional and distinctive — not Tailwind defaults.
- Core token system is respected in high-traffic surfaces.
- Performance is solid — memoisation on estimators, transform/opacity-only animations.
- Passes all three absolute BANs (no gradient text, no border-stripe cards, no glassmorphism).
- Semantic layout discipline — no `<div onClick>`.
- Data integrity is high after recent alignment passes — picture, timeline, vault, KPIs and chat quote consistent numbers.

---

## Recommended Action Plan (priority order)

1. **[P1] `/adapt`** — mobile-first breakpoints; fix `grid-cols-2`/`grid-cols-3`; audit touch targets in Sidebar; container-query strategy for narrow-column cards.
2. **[P1] `/typeset`** — fix light-mode contrast (`--text-muted`/`--text-dim`/`--gold-light`); replace Playfair + DM Sans pair.
3. **[P1] `/harden`** — promote `COUNTRY_COLORS`, delegate gradients, rgba values into design tokens; add `--text-on-*` tokens; light/dark parity.
4. **[P2] `/clarify`** — tighten `/pro` hero copy; audit other headline stacks.
5. **[P2] `/polish`** — `aria-label` on icon buttons; `<label htmlFor>` on inputs; page-level `<h1>` via Topbar; `:focus-visible` focus ring.
6. **[P3] `/animate`** — replace `popIn` bounce easing; orchestrate `/picture` reveal with staggered numbers.
7. **[P3] `/quieter`** — remove decorative radial gradients at page corners.
8. **`/polish`** — final consistency pass before shipping.

> Re-run `/impeccable:audit` after fixes to confirm score improvement.
