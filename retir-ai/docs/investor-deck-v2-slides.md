# Prevista Investor Deck v2 — Slide Drafts

Working drafts for `generate-investor-deck-v2.js`. Iterate on copy + layout here in markdown before committing to code. Each slide section contains:
- **Headline** — the bold text at the top
- **Body** — what goes on the slide (text, tables, chart specs)
- **Layout** — spatial organization
- **Speaker notes** — what the founder says when presenting (~60-90s per slide)
- **Render notes** — technical guidance for the eventual `pptxgenjs` code

Status legend: 🟢 drafted / 🟡 in progress / ⚪ pending

## Render principles (locked 2026-04-11)

The deck is built for flexibility and ease-of-editing, both at code-generation time and afterward in PowerPoint:

1. **Use `pptxgenjs` native primitives, not embedded images.** Charts via `slide.addChart(...)`, shapes via `slide.addShape(...)`, text via `slide.addText(...)`, tables via `slide.addTable(...)`. No SVG/PNG embeds for content slides — the user (or Jacek) needs to be able to open the generated `.pptx` in PowerPoint and select/move/edit individual elements without re-running the script.

2. **Read live numbers from the financial model.** The deck script should `require()` or replicate the `baseData` array from `generate-financial-projections.js` so that any future change to `ENGINE_SCHEDULE` or `SCENARIOS` automatically propagates to the deck on next generation. No hardcoded V6.2 numbers in the deck script.

3. **Each slide is its own function.** `slide5_funnel(deck, baseData)`, `slide7_engineRollout(deck, baseData)`, etc. Reordering, adding, or removing slides means editing the call list at the bottom of the script — never untangling a giant `generate()` block.

4. **Color and font tokens at the top of the file.** A single `THEME` object with `THEME.purple`, `THEME.accent`, `THEME.bodyFont`, etc. Restyling the entire deck = editing one object.

5. **Speaker notes ship in the .pptx.** Use `slide.addNotes(...)` so the speaker notes from this markdown file are embedded in the file Jacek presents from. He gets the talk track for free.

## Canonical deck order

The slide drafts below are in **drafting order**, not deck order — use this table to navigate to a specific slide. The deck script will render them in the order shown here.

| # | Slide | Act | Status |
|---|---|---|---|
| 1 | Cover | 1 — Setup | ⚪ |
| 2 | The problem | 1 — Setup | ⚪ |
| 3 | What we built (product overview) | 1 — Setup | ⚪ |
| 4 | **Free vs Pro tiers** | 1 — Setup | 🟢 |
| 5 | Target market & beachhead | 2 — GTM | 🟢 |
| 6 | The 3-phase acquisition funnel | 2 — GTM | 🟢 |
| 7 | The corridor unlock thesis | 2 — GTM | 🟢 |
| 8 | Engine rollout — front-loaded launch + 5y EU coverage | 2 — GTM | 🟢 |
| 9 | **Partnership strategy — 3 priority bands** | 2 — GTM | 🟢 |
| 10 | **Partnership rollout timeline** | 2 — GTM | 🟢 |
| 11 | Unit economics, told honestly | 3 — Numbers | 🟢 |
| 12 | 5-year revenue projections (base) | 3 — Numbers | 🟢 |
| 13 | The break-even story | 3 — Numbers | 🟢 |
| 14 | Two revenue streams compounding | 3 — Numbers | ⚪ |
| 15 | Base vs upside | 3 — Numbers | ⚪ |
| 16 | Use of €230K | 4 — Ask | 🟢 |
| 17 | Capital stack & dilution | 4 — Ask | ⚪ |
| 18 | Team & path to Series A | 4 — Ask | ⚪ |

**Total:** 18 core slides + appendix (A1–A6). 11 of 18 drafted (61%).

---

## Slide 6 — The 3-Phase Acquisition Funnel 🟢

**Centerpiece slide for Act 2. The slide that explains how we sequence the GTM.**

### Headline
**The funnel matures in three steps — we don't try to launch everything at once.**

### Body (3-column layout)

**Column 1 — Phase −1: Validate (M-3 to M0)**
- *Funding state:* Founder labor only, €0 spend
- *Tools live:* Calculator (free, public)
- *Channels:* Organic SEO + community seeding
- *CTA:* **"Join the wishlist"**
- *Output:* Warm email list
- *Target by M0:* **~450 wishlist signups**
- *Investor proof:* Demand validated before any capital deploys

**Column 2 — Phase 1: Launch (M1 to M6)**
- *Funding state:* Founder self-funded, no external capital
- *Tools live:* Calculator + Platform
- *Channels:* Organic SEO + community + wishlist activation at M1
- *CTAs from calculator:*
  1. **"Send the detailed report by email"** → marketing consent → drip campaign → platform
  2. **Direct redirect** → platform signup
- *Output:* Validated conversion rates, first paying subscribers
- *Investor proof:* Funnel metrics measured, not modeled

**Column 3 — Phase 2: Scale (M7 to M60)**
- *Funding state:* €230K seed deployed
- *Tools live:* Calculator + Platform + Vault
- *Channels:* Organic + **Paid acquisition** + **Distribution partnerships**
- *CTAs:* Same as Phase 1, plus paid landing pages + partner referrals
- *Output:* €3.67M ARR Y5 base, M16 monthly break-even
- *Investor proof:* Capital pours fuel on a measured fire

### Layout
- Three equal-width columns separated by thin vertical dividers
- Column headers in bold accent color (each phase a different shade of purple, getting more saturated left → right)
- Funnel triangle icon centered at top of each column showing relative funnel maturity (1-stage / 2-stage / 3-stage)
- A horizontal arrow at the bottom connecting Column 1's "wishlist" to Column 2's "warm activation at M1" — visualizes the wishlist handoff
- Footer line: *"Each phase only starts when the previous phase has produced its evidence."*

### Speaker notes
- "Most consumer SaaS plans assume the funnel exists from day one. We're sequencing this deliberately — build it in three steps, validate each step before the next."
- "Phase minus one is the calculator. We can ship it today using engines we've already built for Luxembourg, France, and Switzerland. The CTA is just 'join the wishlist' — we're not asking anyone to pay or commit to anything that doesn't exist yet."
- "Three months of Phase minus one gets us roughly 450 wishlist signups in the Luxembourg beachhead. That's our first proof: do people care enough about cross-border pension calculations to give us their email when there isn't even a product yet?"
- "Phase one is launch. The platform goes live. The wishlist gets activated — those 450 people get a 'we're live' email and convert at much higher rates than cold organic. The calculator's CTA evolves into two options: a detailed email report, which is marketing consent and starts a drip campaign, and a direct redirect to platform signup for high-intent users."
- "Phase one runs on organic only. No paid spend. The point isn't to scale yet — it's to validate that the conversion rates we modeled actually hold."
- "Phase two is when the seed deploys at month seven. Paid acquisition and BD partnerships layer on top of a funnel we've already proven works. We're not raising to figure out the model. We're raising to scale a model that's already producing measured numbers."
- "Bottom line: each phase only starts when the previous phase has produced its evidence. By the time the seed deploys, we have six months of platform metrics and nine months of calculator metrics. Investors get to underwrite measured reality, not slideware."

### Render notes
- Three-column layout via three text boxes positioned at x=0.5, 4.65, 8.8 (slide width 13.33, gutter 0.3)
- Column body height ~5.5 inches; headline at top ~0.8 inches
- Funnel icons: simple triangles drawn as shapes (not images) — Column 1 shows just the top, Column 2 shows top-mid, Column 3 shows full triangle
- Color progression: PHASE_MINUS1 = #DCC8E8 (light), PHASE_1 = #B898D0 (medium), PHASE_2 = #7030A0 (saturated, brand purple)
- Bottom connecting arrow: thin curved line from Column 1 footer to Column 2 funnel-top
- Use accent color for the "~450 wishlist signups" target — it's the slide's anchor number

---

## Slide 8 — Engine Rollout: Front-Loaded Launch + 5y Full-EU Coverage 🟢

**Visual timeline showing all 29 country engine launches from Phase −1 through M58, with cumulative addressable market growth as an underlying area chart.**

### Headline
**29 country engines, paced for capacity — full EU+UK+CH coverage by Month 58.**

### Body
*This slide is mostly chart. Body text is annotation only.*

**Top annotation (Phase −1 bracket):**
> *Phase −1 (M-3 to M0): Calculator only, no engines required for the wishlist funnel*

**Middle of timeline annotations (callouts):**
- *M1 launch trio:* **"LU + FR + CH live from day one — premium markets, large diasporas, engines already prototyped"**
- *M13 German hub:* **"Single largest TAM unlock in the entire 5-year plan — DE-PL (1.18M), DE-IT (413K), DE-RO (454K) all activate the moment Germany ships"**

**Right-edge endpoint:**
> *M58: 29 engines / ~12M addressable / full EU + UK + CH coverage*

### Chart specs

**Top half: horizontal timeline**
- X-axis: months M-3 to M60
- 29 engine markers as small filled circles, positioned at their launch month
- Above each circle: country code (LU, FR, CH, etc.)
- Circles colored by year band:
  - M1 launch trio: bright accent (the highlight moment)
  - Y1 quarterly adds (PT/ES/UK/IT): medium purple
  - Y2 (DE/PL/BE/NL/RO/AT): slightly lighter
  - Y3 (HU/GR/HR/IE/BG/CZ): lighter still
  - Y4 (SK/SE/DK/FI/LT/LV): light grey-purple
  - Y5 (SI/CY/EE/MT): pale
- Vertical dashed lines at year boundaries (M12, M24, M36, M48, M60)
- Year labels above the dashed lines

**Bottom half: cumulative addressable area chart**
- Same X-axis (M-3 to M60)
- Y-axis: addressable (millions, 0 to 12M)
- Filled area chart in light purple at low alpha
- Anchor values from V6.2 model (year-end snapshots):
  - M0: 0
  - M12: 1.36M
  - M24: 7.35M
  - M36: 10.52M
  - M48: 11.55M
  - M58: 11.96M
- Smooth interpolation between points (the actual model has monthly resolution if we want to read it from baseData; otherwise smooth curve through year-end milestones)
- Big visible jump at M13 (German hub lands)
- Right-edge label: **"~12M addressable"**

### Layout
- Slide is mostly chart (~75% of slide area)
- Headline at top (~0.7 inches)
- Two callout boxes with arrows pointing at M1 and M13 markers
- Phase −1 bracket on the far left, visually grouped with a light grey box
- Right-edge endpoint annotation as a callout pointing at the Y5 area chart end

### Speaker notes
- "This is the geographic expansion plan, end to end."
- "On the far left, Phase minus one. The calculator is live but no engines have been built specifically for it — we're using the LU, FR, and CH engines we already have. The wishlist accumulates. No engines, no platform yet."
- "Month one: launch. Three engines go live simultaneously — Luxembourg, France, and Switzerland. LU is our beachhead, the densest target market in Europe. France is the largest expat group living in Luxembourg. Switzerland is the highest-value pension market on the continent — it's non-EU, it has a third-pillar system that nobody else covers, and it has huge diasporas from Italy, Portugal, France, and Germany."
- "Year one is quarterly. Portugal at M3, Spain at M6, UK at M9, Italy at M12. Each one unlocks bilateral corridors with everything already supported. By M12 we have seven engines and 1.36 million addressable individuals across all those corridors."
- "Year two is the German hub. Month thirteen, Germany goes live. This is the single most consequential month in the entire plan. Germany unlocks DE-Poland — 1.18 million Polish workers in Germany. DE-Italy — 413,000 Italians. DE-Romania — 454,000 Romanians. The addressable market jumps from 1.36 million to over 7 million in the space of about three months."
- "From there, the schedule cadences at roughly one engine every two months through years three, four, and five. Central Europe, Mediterranean, Nordic, Baltic, the small markets last."
- "By month 58, every EU member state plus the UK and Switzerland is supported. Twelve million addressable individuals across the entire European cross-border pension landscape."
- "The order matters. Adding Portugal when only Luxembourg is supported unlocks a 56,000-person corridor. Adding Portugal when LU plus FR plus CH are supported unlocks 565,000. Same engine. Ten times the TAM. The whole sequence is greedy TAM-maximizing — at every step we ship the engine that unlocks the largest combined corridor population given everything already supported."

### Render notes
- This is a complex chart — implement as a custom shape composition, not a built-in pptx chart type
- Engine markers: small filled circles via `slide.addShape("ellipse", ...)`
- Country code labels: small text boxes positioned above each marker
- Area chart: implement via `slide.addChart("area", ...)` with monthly data points
- Use baseData from a generator-side computation OR hardcode the 60 monthly addressable values into the deck script (~600 chars of JSON, fine)
- Year-boundary lines: thin dashed lines via `slide.addShape("line", ...)`
- Critical: the M13 German hub jump should be visually striking — consider a brighter color for that single marker, or an annotation arrow
- Slide aspect ratio: keep wide-screen (13.33×7.5) so the timeline has room to breathe

---

## Slide 13 — The Break-Even Story 🟢

**The slide that wins this deck. A cash balance chart showing the seed bridges the business to self-sustaining profitability with runway to spare.**

### Headline
**Profitable before the runway runs out.**

### Subhead
*Cumulative break-even at Month 20 — four months before the seed would have been depleted.*

### Body
*Slide is dominated by the chart. Body content is annotations on the chart.*

**Annotations (positioned over chart):**

| Marker | Month | Label | Position |
|---|---|---|---|
| 1 | M-3 | "Phase −1 begins: founder labor, €0 spend" | Left edge, above |
| 2 | M1 | "Platform launches with warm wishlist" | Above curve |
| 3 | M7 | "**€230K seed deploys** ↑" | Above curve, large |
| 4 | M14 | "Peak deficit ~ −€105K" | Below curve at low point |
| 5 | M16 | "**Monthly break-even** — operating revenue exceeds costs" | Above curve |
| 6 | M20 | "**Cumulative break-even** — every euro recovered" | Above curve, callout box |
| 7 | M60 | "**+€4.08M cumulative net**" | Right edge, large |

### Chart specs

- **Type:** Cumulative cash balance line chart
- **X-axis:** months M-3 to M60 (63 data points)
- **Y-axis:** € (likely range −€200K to +€4.5M)
- **Line:** Bold dark purple (brand color), 3pt stroke
- **Below-zero region:** Light red fill at 20% alpha
- **Above-zero region:** Light green fill at 20% alpha
- **Vertical milestone markers:** Dashed light grey lines at M-3, M0, M7, M16, M20, M60
- **Background:** Subtle horizontal gridlines at every €500K

**Key cash balance values to plot** (will read from `baseData` once we wire the script):
- M-3 to M0: flat at €0 (Phase −1)
- M1: ~−€2K (small bootstrap costs, tiny revenue from wishlist activation)
- M6: ~−€15K (cumulative bootstrap deficit)
- M7: jumps to +€215K (€230K seed minus accumulated burn)
- M7 to M14: declining as paid acquisition ramps faster than revenue
- M14: peak deficit relative to seed, roughly +€125K cash (i.e., spent ~€105K of the seed)
- M16: monthly cash flow turns positive (line slope changes from negative to positive)
- M20: line crosses €230K (cumulative break-even — fully recovered including the seed)
- M20 to M60: rapidly rising
- M60: ~€4.3M (€230K seed + €4.08M cumulative net)

**Note on the chart:** The "cumulative break-even at M20" is the moment the cash balance returns to **€230K** (the level it was at when the seed arrived) — this is when the seed has been fully recovered. The deck script needs to compute this from `baseData[i].cumulativeNet` properly.

### Layout
- Headline top-left (~0.5" margin)
- Subhead immediately below in lighter weight
- Chart fills bottom ~80% of slide
- Annotations as text boxes with thin leader lines pointing at chart markers
- Right-side y-axis with labeled ticks at 0, €230K, €1M, €2M, €3M, €4M
- Phase −1 region (M-3 to M0) shaded in light grey on the chart background

### Speaker notes
- "This is the slide that explains why our seed pitch is structurally different from most seed pitches you'll see this year."
- "Most decks at this stage show a P&L chart that doesn't cross zero for three or four years and a story about why that's fine because growth-stage capital will arrive eventually. We don't have that slide because we don't have that problem."
- "What you're looking at is the cumulative cash balance, base scenario, from three months before launch through month 60."
- "On the left, Phase minus one. We're operating on founder labor only. Cash balance is flat at zero — we're not spending anything, but we're not raising anything either. The wishlist is accumulating."
- "Month one: platform launches. The wishlist activates. We have our first paying subscribers. Tiny revenue, small operating costs, line ticks slightly negative. Founder self-funded through bootstrap."
- "Month seven: the seed arrives. Two hundred thirty thousand euros. Cash balance jumps."
- "Then we ramp paid acquisition. Operating costs grow faster than revenue for about six months. Cash balance keeps falling. Peak deficit lands around month fourteen — we've spent roughly a hundred and five thousand of the seed. We still have about a hundred and twenty-five thousand in the bank."
- "Month sixteen: monthly break-even. Operating revenue starts exceeding monthly costs. The line slope changes from negative to positive. Every month from here adds cash, doesn't subtract it."
- "Month twenty: the line crosses back through the original two hundred thirty thousand mark. Cumulative break-even. We've fully recovered the seed — every euro of capital, plus all the bootstrap losses, plus the paid acquisition spend. The business is self-sustaining."
- "And then, because there's no second raise required, the cash compounds. By the end of year five, cumulative net income is over four million euros."
- "Here's the point. Cumulative break-even at month twenty. The seed runway, at average burn, would have lasted until roughly month twenty-four. We hit profitability with four months of buffer still on the clock."
- "What that means for an investor: you're not financing a runway. You're financing a bridge to a self-sustaining business. The Series A becomes optional, not survival. We do it because we want to accelerate further into the European corridors, not because we'll run out of money."
- "That's an unusual story at seed stage and it's the single biggest reason we believe this round is the right round to lead."

### Render notes
- This is the highest-stakes chart in the deck — invest rendering effort here
- Use a `line` chart via `slide.addChart("line", ...)` with the 63 monthly cash values
- Below/above-zero fills: trickier with `pptxgenjs` line charts; may need to fake it with two stacked area charts or with rectangles overlaid
- Vertical milestone lines: separate `slide.addShape("line", ...)` calls
- Annotations: `slide.addText` boxes with manual positioning; use a small leader line `slide.addShape("line", ...)` from each annotation to the relevant chart point
- Font sizes: callout labels at 10-11pt, milestone numbers (€230K, +€4.08M) at 14-16pt bold
- Colors: use the same purple as elsewhere, with red/green at 20% alpha for fills
- Add a small "(base scenario)" tag in the bottom-right corner so people don't think this is upside

---

## Slide 12 — 5-Year Revenue Projections (Base) 🟢

**The headline financials slide. One table. Defends Y5 €3.67M with the wishlist callout up top so the M1 ramp feels earned.**

### Headline
**€3.67M ARR by Year 5 — base scenario.**

### Subhead
*V6.2 model, conservative parameters. Upside scenario in slide 12.*

### Body

Top callout (above table):
> *Year 1 isn't cold-start: M1 launches with ~450 warm wishlist signups (Phase −1) of which ~40% activate to platform signups in the first month.*

**Main table:**

| | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|---|---|---|---|---|---|
| Countries live (end of year) | 7 | 13 | 19 | 25 | **29** |
| Addressable market | 1.36M | 7.35M | 10.52M | 11.55M | **11.96M** |
| Paying subscribers (end of year) | 486 | 3,792 | 9,922 | 15,955 | **21,221** |
| Subscription ARR | €82K | €633K | €1.66M | €2.66M | **€3.54M** |
| Lead gen annual revenue | €2K | €16K | €47K | €85K | **€127K** |
| **Total ARR** | **€84K** | **€649K** | **€1.70M** | **€2.75M** | **€3.67M** |
| Capital under referral | €6.6M | €54.9M | €157.4M | €283.6M | **€425M** |
| YoY ARR growth | — | 7.72× | 2.62× | 1.61× | 1.34× |

Bottom callout (below table):
> *YoY ratios decelerate from 7.72× (Y2) to 1.34× (Y5) — the natural shape of a corridor-expansion model maturing into existing markets.*

### Layout
- Headline + subhead at top (~1 inch)
- Top callout in light accent box, single line, ~0.5 inches
- Main table fills middle ~5 inches
- Bottom callout in light accent box, single line, ~0.5 inches
- Margins ~0.5 inches each side

### Speaker notes
- "Year 5 base scenario lands at three point six seven million in total ARR. Twenty-one thousand paying subscribers across 29 country engines."
- "Three things to notice."
- "First, year one isn't cold-start. Phase minus one builds a wishlist of about four hundred fifty warm signups, forty percent of whom activate in month one. So we're starting with measured demand, not zero."
- "Second, the year-over-year growth ratios. Year two is seven point seven times. That's the German hub at month thirteen — single largest TAM unlock in the plan. After that, the curve decelerates: two point six, one point six, one point three. That's the natural shape of a SaaS business that's mature enough to be measured by retention and penetration, not pure addition."
- "Third, the capital under referral line at the bottom. Four hundred twenty-five million by year five. Lead gen revenue is small as a percentage of total, but it's compounding pure margin — one hundred twenty-seven thousand a year by year five, growing on its own without any acquisition spend. We'll come back to this on a later slide."
- "The three point six seven million base is our committed number. Upside scenario hits seven point two two with defensible parameter shifts — that's slide twelve."

### Render notes
- Table via `slide.addTable(...)` with 9 rows × 6 columns
- Header row in `THEME.purple` background, white text, bold
- "Total ARR" row highlighted with `THEME.lightGreen` fill, bold
- "Capital under referral" row highlighted with `THEME.lightGold` fill
- All currency cells right-aligned with appropriate format strings
- Pull table values directly from `baseData[yearEndIndices[i]]` rather than hardcoding — propagates automatically if model changes
- Two callout boxes via `slide.addText(...)` with `fill: { color: THEME.lightAccent }` and italic font
- Border styling: thin grey grid lines on the table

---

## Slide 11 — Unit Economics, Told Honestly 🟢

**The slide that defends the 1.6× LTV:CAC instead of hiding it. Three calculation blocks + one big honest framing callout.**

### Headline
**Unit economics — the honest math.**

### Subhead
*No cherry-picked ratios. Conservative parameters. Strong on a blended basis.*

### Body — three vertical blocks

**Block 1: Subscription LTV**
- Monthly subscription: **€14.90**
- Monthly churn: **3%** (Recurly 2025 finance category median: 3.7% — multi-year pension context justifies sitting below median)
- Avg subscriber lifetime: **33 months**
- → **Sub LTV: €492**

**Block 2: Lead Gen LTV per Signup**
- 80% of users have a retirement gap
- 25% click product offers
- 15% invest via referral
- → **3% effective conversion** of all platform users
- Avg capital invested: €50,000
- Annual commission per investor: €15 (0.03% × €50K)
- 10-year holding period
- → **Lead gen LTV per signup: €4.50**

**Block 3: CAC and LTV:CAC**
- **Per-signup CAC (paid channel): €40** (defensible for niche keywords with no competitive bidding)
- Blended LTV per signup: **€63.54** (12% × €492 + €4.50)
- → **Per-signup LTV:CAC: 1.6×**
- ─────────
- Per-paying-sub CAC: **€333** (€40 ÷ 12% conversion)
- Per-paying-sub LTV: **€492**
- → **Per-sub LTV:CAC: 1.48×**

### Bottom callout (the most important text on the slide)

> **Paid is only ~10% of total signups in the model.** Organic SEO and distribution partnerships drive the majority of acquisition. The blended channel mix has healthier economics than this paid-only ratio implies — and post-launch CPC optimization is a realistic path to 2.5–3× within twelve months.

### Layout
- Three equal-width vertical blocks across the middle (~60% of slide height)
- Each block has a small subheader bar at top in `THEME.purple`
- Each block ends with a bold final value in larger font
- Bottom callout spans full slide width as a horizontal banner (~25% of slide height) in `THEME.accent` background with white text

### Speaker notes
- "Most decks show one LTV:CAC ratio and skip the math. We're showing the math because the math defends the business."
- "Subscription LTV: thirty-three months at fifteen euros. Four hundred ninety-two."
- "Lead gen LTV: small per signup but real. Three percent of all platform users invest through a referral, and each investor produces about a hundred fifty euros of trailing commission over a ten-year holding period. Four euros fifty per signup."
- "Blended expected value of a signup: sixty-three euros fifty. We model paid CAC at forty euros per signup. So per-signup LTV:CAC is one point six."
- "And here's the honest framing. One point six is below the conventional three times target. We're not going to pretend otherwise."
- "But here's what matters. Paid acquisition is roughly ten percent of total signups in this model. Organic SEO and distribution partnerships do most of the work. The blended channel economics — across all three channels — are much healthier than the paid-only ratio suggests."
- "On a per-paying-subscriber basis, the math also defends. Forty euros divided by twelve percent conversion gives a CAC of three hundred thirty-three euros per paying subscriber. Sub LTV is four hundred ninety-two. So one point four eight on a per-sub basis. Subscription revenue alone covers acquisition with margin."
- "These are conservative parameters. Forty euro CAC is the high end of what we expect for niche keywords with no competitive bidding. Three percent churn is below median for the financial tools category. Twelve percent conversion is realistic for a tool that surfaces a concrete financial gap. CPC optimization, landing page iteration, retargeting — all are realistic paths to push the paid ratio toward two-and-a-half or three within twelve months of launch."
- "The honest framing is the strong framing here. If we showed a fake three point seven and someone runs the math during diligence, we look bad. We show the real one point six and explain why it's defensible — and the explanation is the strongest part of the pitch."

### Render notes
- Three text boxes side-by-side at x=0.5, 4.65, 8.8 (gutter 0.3)
- Block subheader bars: small filled rectangles via `slide.addShape("rect", ...)` in `THEME.purple` with white centered text
- Block bodies: text boxes with bullet line content
- Block final values: separate text boxes with larger font (16-18pt bold) in `THEME.accent`
- Bottom callout: full-width text box at y=5.5 with `fill: THEME.accent` and white text at 14pt
- This slide deliberately avoids charts — clarity over visualization

---

## Slide 7 — The Corridor Unlock Thesis 🟢

**The structural insight nobody else has. Two-column visual comparison: same engine, 10× the marginal TAM depending on order.**

### Headline
**Same engine, 10× the TAM — the order matters.**

### Subhead
*Each new country unlocks bilateral pension corridors with every already-supported country. Sequence determines marginal value.*

### Body — two-column comparison

**Left column: "Adding PT when only LU is supported"**
- *Live engines:* LU
- *New engine:* PT
- *Unlocked corridors:*
  - PT–LU: 56K
- → **Marginal addressable: 56K**

**Right column: "Adding PT when LU + FR + CH are all live"**
- *Live engines:* LU, FR, CH
- *New engine:* PT
- *Unlocked corridors:*
  - PT–LU: 56K
  - FR–PT: 358K
  - CH–PT: 151K
- → **Marginal addressable: 565K**

### Bottom banner (full slide width)

> **Same engine. ~10× the marginal TAM. The launch trio (LU + FR + CH at M1) is what makes the rest of the schedule work.**

### Footer line (italic, smaller)
*This is why we ship Luxembourg, France, and Switzerland together at month one rather than sequentially.*

### Layout
- Headline + subhead at top
- Two columns side-by-side with a thick vertical divider line between them
- Left column muted (light grey accents) — visually the "weak case"
- Right column in brand purple — visually the "strong case"
- Each column structured identically: header → "Live:" → "New engine:" → "Unlocked corridors:" (bullet list with corridor populations) → big bold marginal value at the bottom
- Small country flag icons or country code circles next to each country name (avoid actual flag images — use simple coloured circles with country code text)
- Bottom banner: full-width horizontal box in `THEME.accent` with white text
- Footer line at the very bottom in italic, smaller font

### Speaker notes
- "This is the structural insight nobody else has."
- "The cross-border pension problem exists along migration corridors. Each engine we ship unlocks bilateral corridors with every already-supported country."
- "Take the simplest example: Portugal."
- "If we add Portugal when only Luxembourg is supported, we unlock the PT-Luxembourg corridor — about fifty-six thousand multi-country pension holders."
- "If we add Portugal when Luxembourg, France, and Switzerland are all supported, we unlock PT-Luxembourg, but also FR-Portugal — three hundred fifty-eight thousand Portuguese living in France — and CH-Portugal — one hundred fifty-one thousand Portuguese in Switzerland. Total: five hundred sixty-five thousand."
- "Same engine. Same engineering work. Ten times the marginal addressable market. Just because of what was supported when it shipped."
- "This is why our launch trio matters. We ship Luxembourg, France, and Switzerland together at month one, not sequentially. By the time we add Portugal at month three, we already have three countries to corridor against. The same logic applies to every subsequent engine — Spain in month six unlocks ES-FR, ES-PT, and CH-ES. UK in month nine unlocks UK-FR, UK-ES, and UK-PT."
- "The full schedule is greedy TAM-maximizing. At every step, we ship the engine that unlocks the largest combined corridor population given everything already supported. That's how we get from 1.36 million addressable in year one to nearly 12 million by year five."
- "And one more thing about this slide. The corridor logic is what makes this defensible against entry. A US tool like Boldin can't just 'add Europe' — they'd need to build twenty-nine country pension engines AND know which corridors to ship in which order. Sequence is the moat."

### Render notes
- Two text boxes at x=0.7 and x=7.2 (slide width 13.33)
- Vertical divider: 4pt line via `slide.addShape("line", ...)` in light grey
- Country code circles: small filled circles via `slide.addShape("ellipse", ...)` with country code text overlaid
- Final marginal values: big bold text (24pt) in `THEME.purple` (left column) and `THEME.accent` (right column)
- Bottom banner via `slide.addText(...)` with `fill: THEME.accent`, white text, 16pt bold, centered
- Footer line at y=6.8 in italic 11pt grey
- Optional polish: a small "→" arrow between the left and right columns to emphasize the comparison

---

## Slide 5 — Target Market & Beachhead 🟢

**Why Luxembourg first. Four key facts in a clean numbered list, with the wishlist callout to anchor it back to Phase −1.**

### Headline
**The densest target market in Europe — and why we start here.**

### Body — vertical numbered list

1. **48% foreign-born population**
   Luxembourg has the highest proportion of foreign residents in the EU. The cross-border pension problem isn't a niche here — it's the default.

2. **130–150K addressable individuals in LU**
   Multi-country pension holders, calculated from STATEC data on resident foreign nationals. Discounted for second-generation residents and excludes frontaliers.

3. **NOT frontaliers**
   A German living in Germany commuting to Luxembourg has all their pension contributions in LU — no multi-country problem. Our target is people who **relocated** and accumulated entitlements in 2+ countries.

4. **17M EU mobile citizens (Eurostat)**
   The ceiling. Luxembourg is the beachhead, not the boundary. Year 5 endpoint covers all of EU + UK + CH (29 country engines).

### Bottom callout

> *Phase −1 lets us measure the addressable market before we spend a euro of seed capital. The wishlist tells us if our sizing is right — or if it isn't.*

### Layout
- Headline at top, no subhead
- Four numbered items vertically stacked, taking up ~65% of slide height
- Each item: a large purple-circle number on the left (24pt bold), then a bold headline + 1-2 line description on the right
- Bottom callout in a horizontal accent bar across full slide width (~15% of slide height)
- Optional polish: a small stylized Europe outline in the upper-right corner with Luxembourg highlighted in accent color (avoid an actual map graphic — a simple stylized shape works)

### Speaker notes
- "Why Luxembourg first."
- "Forty-eight percent of Luxembourg's residents are foreign-born. That's the highest proportion in Europe by a wide margin. The cross-border pension problem isn't a niche here — it's the default."
- "We've sized the addressable market at 130 to 150 thousand individuals. That's based on STATEC data — Luxembourg's national statistics — on resident foreign nationals from each country, discounted for second-generation residents who likely don't have multi-country careers, and explicitly excluding frontaliers."
- "Frontaliers matter to mention because people get this confused. A German living in Germany who commutes daily across the border to a job in Luxembourg has all their pension contributions in Luxembourg. They don't have a multi-country problem. Our target is people who actually relocated — Portuguese who worked in Portugal before moving here, French who worked in France, Italians, Spanish, and so on."
- "The seventeen million number is from Eurostat. EU citizens currently living in a member state other than their own. That's the ceiling for the entire business — what we get to address by year five when all twenty-nine country engines are live."
- "Luxembourg is the beachhead, not the boundary. Phase minus one — the wishlist phase before launch — is specifically designed to measure whether our addressable estimate is right before we spend a euro of seed capital. If the wishlist doesn't grow at the rate we expect in Luxembourg, that's information. We adjust before raising, not after."

### Render notes
- Vertical layout with four `slide.addText(...)` blocks
- Number circles via `slide.addShape("ellipse", ...)` filled with `THEME.purple`, white centered text (1, 2, 3, 4) at 24pt bold
- Item headlines bold at 14pt, descriptions at 11pt regular
- Bottom callout via `slide.addText(...)` with `fill: THEME.lightAccent`, italic, 12pt
- Optional Europe outline: skip in v1, add in v2 if there's time. Don't block the slide on it.

---

## Slide 16 — Use of €230K 🟢

**Pure variable acquisition cost. Everything else is funded by equity. The "what's NOT in the seed" block is the slide's persuasion.**

### Headline
**€230K seed: pure variable acquisition cost.**

### Subhead
*Co-founder labor, engine builds, and partnerships are all funded by equity. The seed only buys things that scale with growth.*

### Top callout

> *By the time the seed deploys at M7, the calculator has been live for 9 months and the platform for 6 months. Paid acquisition pours fuel on a measured fire.*

### Body — main table

| Category | Amount | When deployed | What it buys | Revenue impact |
|---|---|---|---|---|
| Paid acquisition | **€180,000** | M7–M60 ramp (€3K → €25K/mo) | ~4,500 platform signups at €40 blended CAC → ~540 paid users at 12% conversion | ~€96K additional sub ARR over 5y + compounding lead gen |
| Content & SEO acceleration | **€50,000** | M7–M18 (~€4K/mo) | Multi-language SEO content per corridor; multi-country landing pages | Drives the dominant organic channel — compounds annually |
| **TOTAL** | **€230,000** | | | |

### Bottom block — "What is NOT in the seed"

**Excluded line items (funded by equity, not cash):**
- ❌ **Co-founder salaries** — technical + BD work on equity until Series A (eliminates the largest opex line at this stage)
- ❌ **Engine development** — 29 pension engines built by technical co-founder over 5 years; founder labor, no cash cost
- ❌ **BD/distribution partnerships** — owned full-time by BD co-founder, no salary line
- ❌ **Legal entity setup, infrastructure, basic ops** — founder self-funded during Phases −1 and 1

### Layout
- Headline + subhead at top
- Top callout banner immediately below (~10% of slide height) with light accent fill
- Main table in middle (~40% of slide height), TOTAL row highlighted in accent purple
- "What is NOT in the seed" block at bottom (~35% of slide height) — title + 4 bullet items with red ❌ markers
- Color coding: top half (what IS in the seed) in purple/accent; bottom half (what is NOT) in muted grey to visually distinguish

### Speaker notes
- "Two hundred thirty thousand euros, deployed against two line items only."
- "One hundred eighty thousand for paid acquisition. The budget ramps from three thousand a month at month seven to twenty-five thousand a month by month sixty. Across that period it generates roughly forty-five hundred additional platform signups at our forty-euro blended CAC. About five hundred forty of them convert to paying subscribers at our twelve percent conversion rate. That's roughly ninety-six thousand euros of additional subscription ARR over the five-year window, plus compounding lead-gen contribution."
- "Fifty thousand for content and SEO acceleration. Multi-language landing pages per migration corridor. Multi-country SEO content. This is what compounds the dominant organic channel over time."
- "What's deliberately excluded from the seed: co-founder salaries, engine development, BD partnerships, legal entity setup, infrastructure, ongoing operations. All of those are funded by equity and founder labor."
- "Here's the framing that matters."
- "By the time the seed actually deploys at month seven, the calculator has been live for nine months — three months of Phase minus one plus six months of Phase one. The platform has been live for six months. We have measured conversion rates, an active user base, a wishlist that's been activated, and a set of corridors with real traffic data."
- "The seed isn't bridging us across a chasm of unknown unit economics. The seed is pouring fuel on a measured fire. Those forty euros of paid spend can be confidently turned into one platform signup because we already know the funnel rates that make that math work — we proved them in Phase one without spending a euro of investor capital."

### Render notes
- Headline + subhead via `slide.addText(...)` at top
- Top callout: `slide.addText(...)` with `fill: THEME.lightAccent`, italic, full width
- Main table via `slide.addTable(...)` with 4 rows × 5 columns, TOTAL row in `THEME.accent` background
- "What is NOT in the seed" block: title text + 4 bullet items
- Use ❌ as a Unicode character in the text strings — works fine in PowerPoint
- Color the "NOT in seed" block muted grey (`THEME.lightGrey`) to visually distinguish from the "IS in seed" block above

---

## Slide 4 — Free vs Pro Tiers 🟢

**Freemium model visualization. Three zones: philosophy banner / two-column feature lists / strategic moat callout.**

### Headline
**"See your situation" is free. "Act on your situation" is paid.**

### Subhead
*A freemium model designed around the data moat — every feature that drives uploads stays free.*

### Body — three vertical zones

**Zone 1 — Philosophy banner** (top, full width)
The headline IS the philosophy. No additional zone-1 text needed; the headline carries it.

**Zone 2 — Two columns (FREE vs PRO)**

**FREE — Visibility**
- 📊 Dashboard, KPIs, retirement gap
- 🗂️ Career timeline + gap detection
- 💰 Payout estimation (all pillars P1/P2/P3, all funds, gross + net)
- 📄 Unlimited vault uploads + AI extraction + categorization
- 🎛️ Simulation interactive controls
- 👁️ Module previews (Radar / Family / Chat hero teasers)
- 💬 General pension Q&A

**PRO — €14.90/mo / €149/yr — Intelligence**
- 🔍 Vault Pro: cross-referencing & discrepancy alerts
- ⚙️ Correction workflow (auto-generate letters in correct language, smart timers, follow-up nudges)
- 📅 Document age & expiry monitoring
- 📤 Consolidated dossier export (one-click PDF for advisors)
- 👨‍👩‍👧 Family vault sharing (multi-user with permission levels)
- 📈 Simulation Pro: tax breakdown, country comparison with PPP, capital modeller
- 🛰️ Radar full: KPIs, filters, alert impact analysis, sources
- 🤖 Chat AI: personalized data-aware analysis (gaps, optimization, strategies)

**Zone 3 — Strategic moat callout** (bottom, full width)
> **Why this works: data accumulation is the moat.** Free tier maximises uploads — every document increases switching cost and improves the AI's accuracy. Pro tier delivers ongoing intelligence on top of that data: cross-referencing, correction workflows, monitoring, and personalised analysis. The free tier is not generosity — it is the lead-gen funnel.

### Layout
- Headline at top (~0.8 inches), philosophy as one bold line
- Subhead immediately below in lighter weight
- Two columns at x=0.7 and x=7.0, each ~5.7 inches wide
- FREE column: muted purple background (THEME.lightAccent), header bar with grey text "FREE — Visibility"
- PRO column: brand purple background (THEME.purple), header bar with white text "PRO — €14.90/mo — Intelligence", slightly raised/larger to draw the eye
- Each column body: bullet list with emoji + feature name + brief detail
- Bottom callout banner spanning full width, dark purple background, white italic text
- Margins: 0.5 inches around

### Speaker notes
- "We're a freemium product, but the way we split free from paid is deliberate and strategic, not arbitrary."
- "The principle is one line. See your situation is free. Act on your situation is paid."
- "Free tier is everything that helps you understand your pension picture. Dashboard, career timeline, payout estimation across all pillars. Unlimited document uploads. AI extraction. Categorisation. Interactive simulation controls. General pension Q&A. Module previews so you can see what Pro looks like."
- "Pro tier is everything that takes action on your behalf. Cross-referencing your documents to find inconsistencies. Auto-generating correction letters in the right language for the right institution. Monitoring your documents for staleness as legislation changes or annual cycles refresh. Exporting consolidated dossiers for your financial advisor. Sharing your vault with family members. Personalised AI chat that knows your specific situation."
- "Here is why this split works strategically. Data accumulation is the moat. Every document a user uploads increases their switching cost — they would have to re-upload everything elsewhere. It also improves the AI's accuracy on their case. So we do not paywall anything that drives uploads. Free tier is not generosity. It is the lead-gen funnel."
- "Pro tier monetises engaged users who have built up their vault and now want the ongoing intelligence layer on top. The conversion logic is built into the funnel: a user who has uploaded six documents and identified a thousand-euro retirement gap is naturally going to consider a fifteen-euro-per-month subscription that tells them how to fix it."
- "And critically: every free user who never converts to Pro still has lead-gen value. The slide on unit economics shows how that lead-gen contribution subsidises the effective CAC across the entire user base."

### Render notes
- Two text boxes for the columns at x=0.7, 7.0 (slide width 13.33)
- Column heights ~4.5 inches; bullet line height ~0.4 inches
- Use Unicode emoji for icons — render reliably in PowerPoint and stay editable. Don't use embedded image icons.
- PRO column header bar via `slide.addShape("rect", ...)` filled with `THEME.purple`, white centered text 14pt bold
- FREE column header bar same shape, filled with `THEME.lightAccent`, dark purple text 14pt bold
- Bottom callout: full-width text box at y=6.0, `fill: THEME.purple`, white italic text 13pt
- The PRO column should be very slightly raised/inset to feel elevated — try `y: 1.7` for FREE and `y: 1.65` for PRO

---

## Slide 9 — Partnership Strategy: Three Priority Bands 🟢

**Sequencing logic for partnership outreach. Three bands stacked vertically, each with purpose / targets / examples / timing.**

### Headline
**Partnerships sequenced by purpose — credibility first, reach second, expansion third.**

### Subhead
*Luxembourg-first sequencing aligned to launch credibility, customer access, and corridor rollout.*

### Body — three priority bands stacked vertically

**Band 1 — CREDIBILITY FIRST (Logo power & trust)**
- *Purpose:* Establish trust signals, gather logos, generate warm intros
- *Targets:* Luxembourg institutions, major chambers & hubs, media + ecosystem anchors
- *Examples:* Chamber of Commerce, House of Entrepreneurship (HoE), UEL (Union des Entreprises Luxembourgeoises), LHoFT (Luxembourg House of Financial Technology), ABBL (Luxembourg Bankers' Association)
- *Timing:* Concurrent with launch (Wave 1)

**Band 2 — CUSTOMER REACH (Audience access)**
- *Purpose:* Direct access to target users in Luxembourg
- *Targets:* Country communities in LU, bilateral chambers, HR / startup / expat networks
- *Examples:* French Chamber, Swiss Chamber, HRCommunity, FEDIL (Luxembourg industries federation), House of Startups (HoST), ACA (insurance association), CFA Society
- *Timing:* Layered onto Band 1 across Year 1

**Band 3 — EXPANSION BRIDGES (Country timing)**
- *Purpose:* Corridor activation aligned to engine rollout schedule
- *Targets:* Country chambers of commerce, expat associations
- *Examples:* PT, ES, UK, IT chambers — only when corridor is live
- *Timing:* Per the rollout timeline (Slide 10) — never all at once

### Bottom callout (decision rule, full width)
> **Decision rule: we contact partners in the order that maximises launch credibility first, customer acquisition second, and corridor expansion only when timed to the roadmap.** Lower-priority country associations stay warm in the tracker but only move after launch + Y1 expansion priorities are covered.

### Layout
- Three numbered bands stacked vertically, each ~1.6 inches tall
- Band header bar (left edge): big circular number (1, 2, 3) + bold band name
- Band body: 4 lines (purpose, targets, examples, timing) in compact text
- Color progression: Band 1 in brand purple (most saturated — most urgent), Band 2 in medium purple, Band 3 in light purple
- Bottom callout banner spans full slide width, ~1 inch tall, in accent color with white text
- Margins 0.5 inches

### Speaker notes
- "Partnerships are one of our three acquisition channels, alongside organic SEO and paid acquisition. They're the leveraged channel — each deal opens an audience, not just a single user."
- "But we sequence them deliberately. Three bands, three purposes."
- "Band one is credibility. Before we ask anyone to send their users to us, we need logos and warm intros. Luxembourg institutions — the Chamber of Commerce, the House of Entrepreneurship, UEL, LHoFT, ABBL — these are the trust anchors. We start here."
- "Band two is customer reach. Once we have credibility, we go to the channels that put us in front of our actual target users. Bilateral chambers, country communities living in Luxembourg, HR networks, startup ecosystem partners. The French Chamber, the Swiss Chamber, HRCommunity, FEDIL, House of Startups, ACA, CFA Society."
- "Band three is expansion. Country chambers of commerce — Portuguese, Spanish, British, Italian — but only when the corresponding country engine has launched or is about to launch. We do not activate all country associations at once. That spreads the BD co-founder too thin and burns goodwill on countries we are not ready to serve."
- "The decision rule is at the bottom. Maximise launch credibility first. Customer acquisition second. Corridor expansion only when timed to the roadmap. Lower-priority logos stay warm in the tracker."
- "This sequencing is what allows the BD co-founder to run partnerships full-time without a hire — concentration, not breadth."

### Render notes
- Three band rows via `slide.addShape("rect", ...)` for the band backgrounds
- Numbered circles via `slide.addShape("ellipse", ...)` filled with `THEME.purple`, white centered number text 24pt bold
- Band content: text boxes with multiple lines, 11pt regular for body, 14pt bold for band name
- Color progression: BAND1_FILL = `THEME.purple`, BAND2_FILL = mid-purple (try #9558B0), BAND3_FILL = `THEME.lightAccent`
- Text color inverts based on background: white on purple, dark on light
- Bottom callout: full-width rectangle + text box, `fill: THEME.accent`, white italic 13pt

---

## Slide 10 — Partnership Rollout Timeline 🟢

**Five outreach waves aligned to engine rollout. Horizontal timeline showing the alignment between partnership outreach and country launches.**

### Headline
**Outreach waves aligned to engine rollout — concentrated, not scattered.**

### Subhead
*Each country wave coincides with corridor activation. The lead time grows as the engines get more complex.*

### Body — horizontal timeline with 5 waves + alignment markers

**Wave 1 — Weeks 1-4** (M1 launch)
- *Country focus:* LU + FR + CH
- *Targets:* Luxembourg institutions, France & Switzerland-linked partners
- *Goal:* Trust, visibility, warm intros
- *Engine alignment:* Concurrent with launch trio at M1

**Wave 2 — Weeks 11-12** (~M3)
- *Country focus:* PT (Y1)
- *Targets:* Portugal-linked partners (Portuguese chambers, expat associations)
- *Goal:* PT community activation, prepare first external corridor
- *Engine alignment:* Concurrent with PT engine ship at M3

**Wave 3 — Weeks 19-20** (~M5)
- *Country focus:* ES (Y1)
- *Targets:* Spain-linked partners
- *Goal:* ES community activation
- *Engine alignment:* 1 month before ES engine ship at M6

**Wave 4 — Weeks 27-28** (~M7)
- *Country focus:* UK (Y1)
- *Targets:* British Chamber of Commerce, UK expat associations
- *Goal:* Market-entry bridge, navigate post-Brexit complexity
- *Engine alignment:* 2 months before UK engine ship at M9

**Wave 5 — Weeks 35-36** (~M9)
- *Country focus:* IT (Y1)
- *Targets:* Italy-linked partners, Italian community associations
- *Goal:* Market-entry bridge, prepare for fragmented INPS environment
- *Engine alignment:* 3 months before IT engine ship at M12

### Bottom callouts (two short rules)

**Sequencing rule:** *We do not activate all country associations at once. Outreach is concentrated by wave so the BD co-founder can give each launch their full attention.*

**Backlog discipline:** *Lower-priority country associations stay warm in the tracker, but only move after launch + Y1 expansion priorities are fully covered.*

### Layout
- Horizontal timeline as the centerpiece (~70% of slide height)
- 5 wave markers as labelled circles or pills along a horizontal axis at the top
- Below each wave marker: a compact text block with country focus / targets / goal / engine alignment
- The horizontal axis is labelled with months M1-M12 underneath
- Engine launch markers (small icons or labels) on the axis at M1, M3, M6, M9, M12 to show the alignment visually
- Color coding: each wave a slightly different shade of accent purple, getting lighter from Wave 1 to Wave 5 to indicate decreasing urgency
- Bottom: two callout boxes side-by-side with the sequencing rule and backlog discipline notes

### Speaker notes
- "This is the operational view. Five waves of partnership outreach across the first nine months."
- "Wave one runs in the first month, weeks one to four, alongside the launch of the LU, FR, and CH engines. Luxembourg institutions plus France and Switzerland-linked partners. The goal is trust, visibility, warm introductions. We are concurrent with launch — partnerships start the same week the platform goes live."
- "Wave two is around month three. Portugal-linked partners. PT engine ships at month three, so this is concurrent."
- "Wave three is around month five. Spain-linked partners. Spain engine ships at month six, so we are starting outreach about a month before the engine is live."
- "Wave four is around month seven. British Chamber and UK expat associations. UK engine ships at month nine, so we have two months of lead time."
- "Wave five is around month nine. Italian-linked partners. IT engine ships at month twelve, so we have three months of lead time."
- "Notice the pattern: the lead time grows as we move to more complex markets. UK has post-Brexit QROPS regulation. Italy has the famously fragmented INPS system plus the casse di previdenza. Both need more relationship-building before launch — you can't just send a cold email to a British chamber and expect them to onboard a foreign fintech in a week."
- "The two rules at the bottom are how we keep this disciplined. We do not activate all country associations at once. The BD co-founder cannot serve five countries in parallel and we don't try. And lower-priority country associations stay in the tracker. They are not ignored — they are deferred."
- "This is also why partnerships are a leveraged channel. One deal with a French Chamber gives us access to their entire member base. We close maybe twenty meaningful partnerships across years one through three. That is the BD co-founder's actual workload."

### Render notes
- This is a custom timeline composition — implement via `slide.addShape(...)` and `slide.addText(...)`
- Horizontal axis: a thick line via `slide.addShape("line", ...)` from x=0.7 to x=12.7 at y=4.0
- Month markers below the axis: small text labels "M1", "M3", "M6", "M9", "M12" at corresponding x positions
- Engine launch markers on the axis: small filled circles at the engine months, labelled with country codes
- Wave markers above the axis: 5 labelled pills/rectangles at corresponding x positions, each with wave number + week range
- Below each wave marker (between marker and axis): compact text block with country focus + targets + goal
- Color: each wave a different shade of accent purple, from saturated (Wave 1) to lightest (Wave 5)
- Bottom callouts: two text boxes side-by-side at y=6.0, each ~6 inches wide, with light fill and italic text
- This slide will need careful spacing — preview render and iterate

---

## Next slides to draft (in priority order)

⚪ Slide 15 — Base vs upside scenarios (side-by-side comparison)
⚪ Slide 14 — Two revenue streams compounding (subscription + lead gen capital chart)
⚪ Slide 17 — Capital stack & dilution
⚪ Slide 18 — Team & path to Series A
⚪ Slides 1, 2, 3 — cover, problem, product (supporting slides — lower priority since less unique content)
⚪ Appendix A1-A6 — corridor matrix, full P&L, engine schedule detail, sensitivity, competitive landscape, regulatory

## Drafted slides — status (11 of 18 complete = 61%)

🟢 Slide 4 — Free vs Pro Tiers
🟢 Slide 5 — Target Market & Beachhead
🟢 Slide 6 — The 3-Phase Acquisition Funnel
🟢 Slide 7 — The Corridor Unlock Thesis
🟢 Slide 8 — Engine Rollout Timeline
🟢 Slide 9 — Partnership Strategy (3 Priority Bands)
🟢 Slide 10 — Partnership Rollout Timeline
🟢 Slide 11 — Unit Economics, Told Honestly
🟢 Slide 12 — 5-Year Revenue Projections (Base)
🟢 Slide 13 — The Break-Even Story
🟢 Slide 16 — Use of €230K
