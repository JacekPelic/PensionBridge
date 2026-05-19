# Prevista — 40-min angel/operator pitch deck

**Audience:** angels + operators + domain experts (no VCs).
**Posture:** bootstrap, no money ask. The 3-part ask is for warm intros, beta users, and a first call when (if) we ever raise.
**Brand register:** calm, authoritative, precise (private bank / actuary office). Restraint over decoration.

---

## Agenda — 40 min (Q&A separate, expect ~30 min)

| # | Section | Slides | Time |
|---|---|---|---|
| 1 | Hook + thesis | 1 | 2 min |
| 2 | Problem | 2, 3-gap | 4 min |
| 3 | Market & user | 3 | 3 min |
| 4 | Product demo | 4 | 12 min |
| 5 | Competitive landscape | 5A, 5B | 5 min |
| 6 | GTM + corridors | 6A, 6B, 6C | 5 min |
| 7 | Business model | 7 | 3 min |
| 8 | Hard problems we navigated | 8 | 2 min |
| 9 | What we don't know yet | 9 | 1 min |
| 10 | The 3-part ask | 10 | 3 min |
| 11 | Close | 11 | 0:30 |

---

## Slide 1 — Hook
*Section 1 · 2 min*

### Slide content

# Prevista
*your future, foreseen.*

### For internationally-mobile Europeans whose pensions span borders.

### Speaker notes

> *"Prevista — Italian for 'foreseen'."*
>
> 90-second problem framing landing on:
>
> *"We give them the picture and tell them what to do about it."*

---

## Slide 2 — Problem (mechanics)
*Section 2 · ~3 min*

### Title

**Nine entitlements. Three states of evidence. No total.**

### Slide content — 9-line table (3 pillars × 3 countries)

Mats Karlsson, 45, LU resident. Career: FR 10y (2000-2010) → CH 5y (2010-2015) → LU 6y (2015-present).

| Country | Pillar 1 (state) | Pillar 2 (workplace) | Pillar 3 (personal) |
|---|---|---|---|
| **France** | CNAV ✓ €1,220 | AGIRC-ARRCO ✓ €420 | ◇ not tracked |
| **Switzerland** | AVS ✓ €320 | BVG ✓ €860 | 3a ⚠ self-reported |
| **Luxembourg** | CNAP ✓ €1,020 | Employer ⚠ €280 | Foyer 111bis ⚠ €220 |

**Verification key:** ✓ verified · ◯ estimated · ⚠ unconfirmed / self-reported · ◇ not tracked

**Total at retirement: ?**

> Numbers from `modules/pension/components/estimation/IncomeBreakdown.tsx` `fundData`.

### Speaker beat

> *"Of the €4,340 a user could naively add up, only €3,840 is verified. We tell them which is which."*

---

## Slide 3-gap — The gap
*Section 2 · ~1 min*

### Slide content — single horizontal bar chart

| | |
|---|---|
| Target | **€5,500** /mo |
| Trajectory | €3,840 /mo |
| Shortfall | **€1,660** /mo |
| **≈ €498,000** | over 25-year drawdown |

### Speaker beat

> *"Mats is the median Profile A user — we'll introduce you to thirty more in the demo."*

---

## Slide 3 — Market & user
*Section 3 · 3 min*

### Title

***"From seventeen million to one."***

### Block 1 — Who Profile A is

A user is **Profile A** if their working life crosses two or more EU/EFTA pension systems. The median user is 45-55, mid-career, with €100K-€500K accumulated across 2-3 jurisdictions. Ten to twenty years from retirement.

Mats Karlsson is the median. We don't build for retirees — we build for the decade in which the gap can still be closed.

### Block 2 — Three honest layers

| Layer | Population | Source |
|---|---|---|
| Intra-EU mobile citizens | **~17M** | Eurostat |
| Cross-border pension entitlements (Y5 deployed) | **~12M** | `financial-model.js` |
| Luxembourg beachhead | **~130-150K** | STATEC + addressability discounts |

### Block 3 — The wedge

- **M1:** Luxembourg launch. 130-150K addressable. Founder ground game.
- **M13:** 8 country engines live. Germany activates.
- **Y5:** 29 country engines. EU27 + UK + CH.

> *Footer: Sizing only. The compounding mechanic — how 130K reaches 12M — is on slide 6C.*

### Speaker beats (3 min)

1. *"Eurostat counts seventeen million people living in an EU country other than their own. We narrow that to twelve million — the unit that matters is not residency, it's pension entitlements that cross a border. That's the prize."*
2. *"We don't start with twelve million. We start with one hundred and thirty thousand — Portuguese, French, Belgian, German residents in Luxembourg, all with pension history in their home countries."*
3. *"And we don't start with all of them. We start with one. Mats. Forty-five, three countries. The next thirty users we onboard will look almost exactly like him."*
4. *"Twelve million is the prize. One hundred and thirty thousand is the beachhead. One person is who we build for. Slide six comes back to how the middle reaches the right."*

---

## Slide 4 — Product demo
*Section 4 · 12 min · hybrid delivery (recorded video + live founder voiceover)*

### Three load-bearing moments to land

1. **Verified, not sold.**
2. **See it then act on it.**
3. **Calm under complex data.**

### 8 beats

| # | Time | Surface | Beat |
|---|---|---|---|
| 1 | 0:00–1:00 | landing / empty state | "What Mats sees first time" — buys 12-min audience patience |
| 2 | 1:00–3:00 | `/picture` | Document upload + AI extraction; **4 verification states introduced** (✓ / ◯ / ⚠ / ◇) |
| 3 | 3:00–5:00 | `/` dashboard | TMI hero + KPI + retirement gap — **€3,840 / €5,500 / €1,660 / €498K** reveal |
| 4 | 5:00–6:30 | `/estimation` IncomeBreakdown | 9-line drill-down; verification states reappear; net-by-residence Pro tease |
| 5 | 6:30–8:30 | `/simulation` CapitalModeller | 3 sliders (P3 contribution, retirement age, BVG capital vs annuity) — *"the €4,000-of-advisor-time conversation in 3 minutes"* |
| 6 | 8:30–10:00 | chat widget | *"Should I take BVG as capital or annuity if I retire in LU?"* — references his data; pre-empts regulatory line *("guidance, not advice")* |
| 7 | 10:00–11:30 | RiskRadar | Forgotten Swiss vested benefits — **"CHF 6.7B unclaimed at Stiftung Auffangeinrichtung"** PR hook |
| 8 | 11:30–12:00 | dashboard | Return; gap reduced by simulations; close with *"That's Prevista."* |

### Deliberate cuts (kept for Q&A)

vault, family/sharing, tax country comparison full Pro feature, onboarding wizard.

---

## Slide 5A — Competitive landscape
*Section 5 · ~2 min*

### Title

**The cross-border × self-serve quadrant is empty. That's the wedge.**

### 2×2 quadrant

```
                      SINGLE-COUNTRY                CROSS-BORDER
                ┌─────────────────────────┬────────────────────────┐
   SELF-SERVE   │ PensionBee · Penfold    │                        │
                │ VIAC · finpension       │      [empty]           │
                │ frankly                 │      ← wedge           │
                ├─────────────────────────┼────────────────────────┤
                │ National portals        │ AES · Spectrum         │
   ADVISOR-LED  │ Mercer · Aon · WTW      │ Blevins Franks · deVere│
                │                         │                        │
                └─────────────────────────┴────────────────────────┘
```

---

## Slide 5B — Four threats × win-conditions
*Section 5 · ~3 min · the load-bearing slide*

| # | Threat | Win-condition |
|---|---|---|
| 1 | **Doing nothing** | Trigger moments collapse it (move / leaving / tax calendar / retirement / property) |
| 2 | **Cross-border IFAs** | We substitute upstream half — complement-then-substitute, not direct competitor |
| 3 | **Single-country tools** | Structurally mono-jurisdictional; can't pivot without rebuilding the engine fleet |
| 4 | **Incumbent clone (Allianz / AXA / UBS)** | Three structural reasons it doesn't happen ↓ |

### Why the incumbent clone doesn't happen

- **Distribution conflict** *(strongest)* — incumbents can't credibly say *"verified, not sold"*; their distribution depends on the opposite.
- **Cost structure** — €8K/mo founder-eng vs €200K+ FTE. They can't match the margin.
- **Data accumulation moat** — the year-0 free-tier corpus is uncatchable; we accumulate document extractions that never become available again.

---

## Slide 6A — First 1000 customers
*Section 6 · ~1.5 min*

### Title

**First 1000 customers. Two motions, one goal.**

### Sub-headline

**Year 1 model: 434 paid (base) → 951 paid (upside). The first thousand lands inside upside — not inside base.**

### Five pains, two motions

| Motion | Trigger pains served | Why this motion fits |
|---|---|---|
| **Content / SEO — engine** | T2 *"I left CH and never collected my BVG"* · T3 *"October — pension deduction window"* · T5 *"Using my 3a for property abroad"* | User has exited institutions or self-serves on a deadline. SEO + viral hooks reach them. |
| **Partnership — moat** | T1 *"I'm moving in 3 months"* · T4 *"I'm 58. Where do I retire?"* | User passes through agencies, HR, EU institutions. We get distributed trust at the moment of pain. |

### Year 1 model split

| Motion | Y1 paid (base) | Y1 paid (upside) |
|---|---|---|
| Content / SEO | 422 | 906 |
| Partnership | 12 | 45 |
| **Total Y1 paid** | **434** | **951** |

### Pre-empt

> *"Partnership is where our GTM work is — LuxRelo, EIB, VIAC. Year 1 doesn't bet on it. Content carries; partnership compounds. Y2 partnership paid jumps 5× to 66 base / 259 upside. The named-entity work is for the moat, not Year 1 volume."*

### Speaker beat

> *"Two motions. Content carries Year One; partnership compounds Year Two and beyond. The first thousand sits inside the upside scenario — base scenario hits four hundred and thirty-four. Either way, content is the engine. Partnerships are why we still own the channel three years from now. And no paid acquisition does not mean free — founder time, content production, and partnership outreach all carry real opportunity cost."*

---

## Slide 6B — Early signal + activation lag
*Section 6 · ~1.5 min*

### What's pre-launch in motion

- **T1:** LU shortlist v1 (LuxRelo / ERS / MMC), simplified 4-deliverable offer, Spuerkeess endorsement (5/8 firms)
- **T4:** EIB first contact
- **T2:** PR hook ready
- **T3:** affiliate model designed (CH-deferred)

### Activation lag

| Channel | Window |
|---|---|
| T2 / T5 | Fast (M2–M4) |
| T3 | Q4-gated |
| T1 / T4 | Partnerships compound (M5–M9) |

---

## Slide 6C — Country engines compound
*Section 6 · ~2 min · the corridor mechanic*

### Section 1 — The mechanic

> **COUNTRY ENGINES COMPOUND — they don't run in parallel.**
>
> Pension data is country-anchored. Mats's full picture requires every country he's ever worked in.
>
> When we add a new engine, two things happen at once:
>
> - **⊕ Additive** — new residents become addressable
> - **⊗ Compounding** — every prior user with history in that country gets a completed picture
>
> Expansion is **greedy under engineering capacity** (one new engine every 2-3 months). DE is held to M13 deliberately — its arrival concentrates the unlock into a single 12-month wave instead of dribbling it across Y1.

### Section 2 — Four phases

**Phase 1 · M1-M12 · Beachhead + Latin Europe + UK reach**
- Engines: LU · FR · CH (M1) → PT (M3) · ES (M6) · UK (M9) · IT (M12)
- Logic: founder ground game in LU. Iberian retirement corridor + Mediterranean + Atlantic UK reach.
- Addressable end Y1: **~1.4M**

**Phase 2 · M13-M24 · German-Polish wave + Eastern enlargement**
- Engines: DE (M13) · PL (M15) · BE · NL · RO · AT
- Logic: DE alone activates 7 new corridors with Y1 engines. PL adds Europe's two biggest bilateral corridors (DE-PL 1.18M, PL-UK 605K). BE/NL/AT complete the Greater Region & DACH.
- Addressable end Y2: **~7.3M ▲ 5.4×**

**Phase 3 · M25-M36 · Deepening existing pictures**
- Engines: HU · GR · HR · IE · BG · CZ
- Logic: Phase 3 doesn't grow TAM dramatically — it deepens existing users. A Mats who worked in Hungary in 1998 was incomplete until M25. The compounding leg ⊗ takes precedence over the additive leg ⊕.
- Addressable end Y3: **~10.5M ▲ 1.4×**

**Phase 4-5 · M37-M60 · Nordic + long tail**
- Engines: SK · SE · DK · FI · LT · LV · SI · CY · EE · MT
- Logic: completes the 29-country graph. Marginal addressable per addition shrinks; full-picture coverage maximises retention.
- Addressable end Y5: **~12.0M ▲ 1.1×**

### Section 3 — TAM math

| Milestone | Engines | Addressable | Phase delta |
|---|---|---|---|
| M1 — Beachhead | 3 | ramping | — |
| M12 — End Y1 | 7 | ~1.4M | +1.4M |
| M24 — End Y2 | 13 | ~7.3M | **+5.9M** |
| M36 — End Y3 | 19 | ~10.5M | +3.2M |
| M60 — Y5 full | 29 | ~12.0M | +1.5M |

- Y5 paid subs (base scenario): **19,437**
- Y5 corridor penetration: **0.16%**

> *Footnote: Addressable = sum of bilateral pension diasporas × 0.55 addressability factor, ramped 6 months after both engines live. A 3-country user appears in 3 corridors — counts engagement opportunities, not unique persons. Source: `docs/financial-model.js` `computeAddressable(m)`.*

### Speaker beats

1. *"At M1 we have three engines and effectively zero addressable — corridors take six months to ramp. That's deliberate. We're not chasing reach, we're earning trust."*
2. *"Phase 2 is where the math turns. The German-Polish bilateral wave plus Greater Region completion takes addressable from 1.4 to 7.3 million in twelve months — five-fold."*
3. *"Phase 3 doesn't add countries for new users. It completes pictures for users we already have."*
4. *"Sixteen basis points of corridor TAM, Y5, base scenario, zero paid acquisition. Every reduction in churn or lift in conversion is upside on top of this."*

---

## Slide 7 — Business model
*Section 7 · 3 min*

### Title

***"Two streams. One pays the operation. The other compounds."***

**Sub-headline:** 86% gross margin · M18 cumulative break-even · zero paid acquisition · zero outside capital.

### Stream 1 — Subscription (the operation)

| | |
|---|---|
| Price | €4.99/mo · €49/yr (40% annual target) |
| Variable cost per paid user | €0.70/mo (AI €0.20 + support €0.50, post-M24) |
| Gross margin | **86%** |
| Steady-state monthly churn | 2.1% (improves from 3.0% as cohort matures) |
| LTV (long-run, blended) | **~€189** |
| Y5 paid subs | 19,437 |
| Y5 sub ARR | **€1.08M** |

> *"Paid acquisition is zero in both base and upside scenarios. At €4.99 with 12% conversion, paid LTV:CAC does not clear. Paid is reserved as a Series A lever once organic-only economics are validated."*

### Stream 2 — Lead-gen (the asset)

| | |
|---|---|
| Conversion: signup → referred investor | 3.0% (gap × click × invest = 80% × 25% × 15%) |
| Avg capital per investor | €125,000 |
| Take rate | **0.03% / yr** (3 bps — order of magnitude below typical advisor trail) |
| Y5 cumulative investors | 7,147 |
| Y5 lead-gen ARR | €312K |
| Lead-gen as % of total revenue | Y3: 18% · Y5: 22% · trajectory: structurally rising |

> *"This stream is an asset, not a flow. The capital base compounds at nine percent a year. It gets harder to lose every month."*

### Combined Y5

| | Base | Upside (overlay) |
|---|---|---|
| Total ARR | **€1.39M** | €2.91M |
| Cumulative net | €853K | — |
| Cumulative break-even | **M18** | M13 |

> *Footnote: Lead-gen revenue = annual fee on cumulative referred capital. Prevista routes; partner platforms (Spuerkeess, VIAC, banks) custody. Take is paid as referral fee, not management fee.*

### Speaker beats

1. *"Two revenue streams. Subscription pays the lights. Lead-gen compounds an asset."*
2. *"Subscription: four ninety-nine a month, eighty-six percent gross margin, fifty euros profit per user per year at steady-state. Lifetime value around one hundred and ninety euros, on three percent monthly churn declining as cohorts mature."*
3. *"Lead-gen: three percent of signups make a multi-country pension consolidation move — average rebalance one hundred and twenty-five thousand euros. We earn three basis points per year on the cumulative referred capital. **By year five, lead-gen is one fifth of total revenue. By year ten, the majority.** We don't manage assets. We route them — and the routing fee compounds."*
4. *"Cumulative break-even at month eighteen. Founder capital only. Zero paid acquisition. Zero outside capital. The unit economics are the ask — not for money, for trust that they hold under scrutiny."*

---

## Slide 8 — Hard problems navigated
*Section 8 · 2 min*

### Title

***"Three decisions that came close to going the other way."***

### Problem 1 — Pricing model: freemium with monetised free users

**Considered:**
- Pure paid (no free tier) — €4.99/mo from day one
- Per-document pricing — pay per pension document extracted
- Premium-only with advisor — €499/yr including consultation
- Freemium with profitable free tier

**Pressure-tested:** Each non-freemium variant strangles Stream 2. Lead-gen needs the biggest possible signup base — 3% signup→investor conversion compounds on **cumulative signups, paying or not**.

**Decided:** Freemium, with a non-obvious twist — **free users monetise too**. Free-user AI cost ~€0.04/mo; their share of Stream 2 dominates that cost.

> *"The free tier is a feature of the lead-gen business, not a marketing cost."*

### Problem 2 — Germany at M13, not M1

**Considered:** Pure greedy TAM-maximizing ordering puts DE at M1 (largest single-country corridor unlock).

**Pressure-tested:** Engineering capacity. DE adds Riester / Rürup / bAV complexity when bandwidth is thinnest. Worse: DE at M1 means the unlock dribbles across Y1 as adjacent engines come online.

**Decided:** Hold DE to M13. The capacity-constrained greedy schedule concentrates the German unlock into a single Y2 wave with PL/BE/NL/RO/AT. **Addressable: 1.4M → 7.3M in twelve months.**

### Problem 3 — One-time paid services killed

**Considered:** Bolt-on paid services — power of attorney drafting, pension pay-gap analysis, country-specific consolidation guidance. Mid-three-figures per engagement. Real demand.

**Pressure-tested:** Every service is human-time-intensive and jurisdiction-specific. Scaling means hiring specialists per country. Margin per hour caps the business at consulting-firm size.

**Decided:** No paid services. Platform-only. Where users need POA, consolidation, or jurisdictional guidance, **we route to partners** — the referral fee is Stream 2.

### What each pivot protects

| Pivot | What it protects |
|---|---|
| Pricing → Freemium | **Stream 2 user base** (free users still convert to investors at 3%) |
| DE held to M13 | Phase-2 unlock wave (slide 6C "5×") |
| Manual services killed | **Stream 2 architecture** — routing, not delivering |

### Speaker beats

1. *"Three decisions that came close to going the other way. We're showing them because the audit is in the abandoned paths, not the headline numbers."*
2. *"Pricing model. We considered pure paid, per-document, premium-with-advisor. Each one strangled Stream Two — lead-gen needs the biggest possible user base, paying or not. Freemium won, with a wrinkle: free users monetise too. The free tier is a feature of the lead-gen business, not a marketing cost."*
3. *"Germany at month one or month thirteen. TAM math says one. Engineering capacity plus the compounding wave argument says thirteen. The five-fold Y2 you saw on slide six only works because we held it."*
4. *"Manual services — power of attorney drafting, pension consolidation help. Real demand, mid-three-figures per client. We said no. Manual scales with headcount. The platform compounds. Where users need a hand, we route — that's why lead-gen is Stream Two."*
5. *"Three pivots, each defensible from the model. The discipline is in which numbers we chose to optimise."*

---

## Slide 9 — What we don't know yet
*Section 9 · 1 min*

### Title

***"Three things we don't know yet."***

### Question 1 — Will paid conversion hold at 12%?

- **Why it matters:** Stream 1's load-bearing assumption. At 8% conversion, Y5 ARR drops ~33%.
- **Resolution:** **M6-M9.** Luxembourg's first cohort post-launch is the truth.

### Question 2 — Does 3% of signups actually convert to a referred investment with €125K avg capital?

- **Why it matters:** Stream 2's load-bearing assumption. Three sub-rates compounded (80% × 25% × 15%) — the multiplied number has never been measured for this exact funnel.
- **Resolution:** **M9-M15.** Capital under referral starts compounding only when the first partner platform integrations route real flow.

### Question 3 — Does *"guidance, not advice"* hold across seven regulators by Y2?

- **Why it matters:** GDPR is solved. The investment-advice regulatory perimeter is not. CSSF (LU) · AMF (FR) · FINMA (CH) · BaFin (DE) · CNMV (ES) · CMVM (PT) · FCA (UK) each have different perimeters. A single classification of *"investment advice"* pauses that engine pending licensing.
- **Resolution:** **Per engine, at engine launch.** Each country's first regulatory contact happens before that country goes live.

### Speaker beats

1. *"Three things the model can't tell us yet."*
2. *"One: paid conversion at twelve percent. Benchmark, not measurement. Luxembourg's first cohort answers it by month six."*
3. *"Two: the lead-gen funnel. Three percent of signups making a multi-country pension move. Three sub-rates compounded, never measured for this exact path. We learn it when the first partner integration routes real flow, around month nine to twelve."*
4. *"Three: regulatory perimeter. GDPR is solved. **Guidance, not advice** under each jurisdiction's investment-advice regulator is solved per engine, at the moment of engine launch. Seven regulators by year two."*
5. *"These resolve in the first eighteen months. What we learn changes the trajectory — for better or worse. We'll tell you which. **Which brings us to what we're asking for.**"*

---

## Slide 10 — The 3-part ask
*Section 10 · 3 min*

### Title

***"Three asks. None for money."***

### Ask 1 — A warm intro

> *"We've identified the partners. We've drafted the partnerships. We need an email subject line that gets us into the room."*

| Channel | Named entities | Status |
|---|---|---|
| **T1 — Relocation, LU** | LuxRelo (Stéphane Compain) · ERS (Sylvie Schmit) · MMC (Imène Arfaoui-Marzouk) | Cold-outreach drafted; warm path through AMCHAM Luxembourg |
| **T3 — Tax calendar, CH** | VIAC founders (Daniel Peter · Christian Mathis) | **Time-gated: Q4 deadline. First email mid-May. Slip = wait 12 months.** |
| **T4 — EU institutions** | EIB College of Staff Representatives, LU HQ | Halo path → European Commission · ECJ · Court of Auditors |

> *"We are not asking you to broker the deal. We're asking for the email subject line that gets us into the room."*

### Ask 2 — A user. Or three referrals.

> *"If you're Profile A — multi-country pension history, mid-career, ten to twenty years from retirement — be in the first cohort. If not, name three who are."*

The first thirty users we onboard become design partners. Their data shapes the engines we build next.

> *This is the M6-M9 cohort that resolves Question 1 from the previous slide.*

### Ask 3 — A first call when we raise.

> *"We're not raising now. The €10K cash trough at M11 absorbs on founder capital. Cumulative break-even at M18."*

When we do raise — for paid-acquisition scaling, post-validation — first call to this room. **Pre-positioned cap table. No commitment. No timeline.**

> *The only ask where you can say yes today and act on it later. The other two require action this week.*

### Closing line (full-width, italic, under all three)

> ***Three asks. The first two require action this week. The third you can say yes to today and act on later.***

### Speaker beats

1. *"Three asks. None of them are for money."*
2. *"First. A warm intro. T1 — relocation, Luxembourg: LuxRelo, ERS, MMC. T3 — tax calendar, Switzerland: VIAC founders. This one is time-gated; the Q4 deadline cycle means our first email needs to go out by mid-May or we wait twelve months. T4 — EU institutions: the EIB College of Staff Representatives, Luxembourg HQ, with halo to the Commission, the Court of Justice, the Court of Auditors. We've drafted the partnerships. We're asking for an email subject line."*
3. *"Second. If you're Profile A — multi-country pension history, ten to twenty years from retirement — be in the first cohort. If not, name three who are. The first thirty users we onboard become design partners; their data shapes the engines we build next."*
4. *"Third. A first call when we raise. We're not raising now — the eleven-month cash trough absorbs on founder capital, cumulative break-even at month eighteen. When we do raise, for post-validation paid-acquisition scaling, first call to this room. Pre-positioned cap table, no commitment, no timeline."*
5. *"Three asks. The first two require action this week. The third you can say yes to today and act on later."*

---

## Slide 11 — Close
*Section 11 · 30 sec*

### Slide content (centred, large)

> ***Mats has the picture.***
>
> The verified projection. Three simulation moves. A choice he can defend with evidence.
>
> Thirty more like him **in the first month**. **Twelve million** across Europe by year five.
>
> *Prevista — your future, foreseen.*

### Speaker beats

1. *"Mats has the picture. The verified projection. Three simulation moves. A choice he can defend with evidence."*
2. *"Thirty more like him in the first month. Twelve million across Europe by year five."*
3. *"Prevista — your future, foreseen. Thank you."*

---

## Anchor numbers (use consistently)

- Mats Karlsson, 45, LU resident, target retirement age **64** (NOT 65)
- Career: FR 10y (2000-2010) → CH 5y (2010-2015) → LU 6y (2015-present)
- Target: **€5,500/mo** · Verified projection: **€3,840/mo** · Gap: **€1,660/mo**
- 25-year drawdown total gap: **≈ €498,000**
- LU statutory retirement age: 65 (Mats targets 64 = 1y early via EU coordination)
- Pillar 3 personal savings: €85,000 balance + €600/mo + 4% growth assumption
- Y5 base ARR: **€1.39M** · Cumulative net: €853K · Break-even: M18
- Y5 corridor TAM: **~12M** · Y5 paid subs: **19,437**

---

## Structural callbacks (intentional, deck-wide)

- **"12M" appears 3×** — slide 3 (the prize) → slide 6C (earned through corridor math) → slide 11 (the destination)
- **Mats appears throughout** — slide 1 (implicit) → slide 2 (introduced) → slide 3-gap (his shortfall) → slide 4 (demo subject) → slide 6/8 (named) → slide 11 (the close)
- **Stream 2 protected by 2 of 3 pivots** on slide 8 — economic spine of the deck made visible
- **"Verified, not sold"** repeats on slides 2, 4, 5B — the brand-trust beat
