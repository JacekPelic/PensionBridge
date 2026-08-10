# Foundation — Competitive Landscape

*Started 2026-07-03. Grading per [`_CANON.md`](_CANON.md).*
**Promotes** the "Competitive landscape" item from the `_CANON.md` open queue.
**Supersedes** the competitor framing in Discovery `retir-ai/docs/deep-research-report.md` — that doc's "competitor comparison table" is a set of **US retirement-planning SaaS** (Boldin, ProjectionLab, WealthTrace, MaxiFi, Empower…) used as *pricing anchors*. They are not competitors for Clerio's job; treat them as price references only (§5 here).

**One-line finding:** No product does Clerio's actual job — self-serve unification of **state + workplace + personal** pension entitlements across **multiple** EU/EFTA jurisdictions (FR/CH/LU-type careers) ending in a retirement-income **gap**. Every rival solves a slice: one country, one pillar, or balance-aggregation without projection. The real competition is **inertia + free single-country government tools**, not another app.

---

## 1. How to read the field (what "competes" means here)

A competitor is scored on **Clerio's job**, not on category label. The job has three parts, and most rivals do at most one:

- **Aggregate** across jurisdictions (state P1 + workplace P2 + personal P3, in 2+ countries).
- **Calculate** a real projected income (esp. the *state* pillar — French trimestres, Swiss AVS/AHV, Luxembourg CNAP), not just display a balance.
- **Gap** it against a target, continuously (not a one-off snapshot).

Classification used below: **DIRECT** (same job, real overlap) · **ADJACENT** (one part of the job) · **SUBSTITUTE** (different mechanism, same customer/moment) · **FREE ANCHOR** (govt tool that sets "should be free") · **PRICE ANCHOR** (irrelevant to job, informs willingness-to-pay).

---

## 2. The map, by proximity/threat

### Tier 0 — The real competitor: DIY slog + inertia
**ASSUMPTION (behavioural, strongly reasoned) — the modal alternative is *nothing*, or a stale manual assembly.** For a FR+CH+LU career, seeing total future pension today means: three national portals, three auth schemes (FranceConnect / Swiss compensation-office / CNAP), three statement formats — **the Swiss IK statement is postal only, ~3-week turnaround, not emailed** (ahv-iv.ch) — three incompatible benefit logics, a self-built spreadsheet, and a self-guessed target. None of the three institutions know about the other two. Most abandon the exercise.
→ **This inertia is the primary thing to beat.** Consistent with the persona's "arrive anxious / procrastinating" (`.impeccable.md`). Threat: **HIGH** (it's the default).

### Tier 1 — Closest analogs (watch)
| Player | What | Grade | Read |
|---|---|---|---|
| **Horizon65** (DE) | Retirement-gap *simulator* on a brokerage funnel, expat-targeted | **SAME CUSTOMER / different mechanism** | Same "see & close your gap" *positioning* — but shares **none** of the aggregation job. See "what it actually is" below. iamexpat.de/…/horizon65; horizon65.com |
| **Hoxton Wealth** (UK-founded) | Globally-mobile wealth app; links accounts/pensions/property multi-currency ("WealthFlow" retirement scenarios) | **SAME CUSTOMER (mindshare)** | Closest to Clerio's *user*, but **advisor-led / HNW**, account-linking not pension-verification. Competes for the affluent-expat's attention, not the self-serve gap job. hoxtonwealth.com |

**What Horizon65 actually is (deep-dive 2026-07-03) — VERIFIED:** not a pension aggregator, not even a real tracker. It's a **manual-entry gap simulator** (decent Monte-Carlo UI) bolted onto a German **§34f/§34d GewO investment/insurance brokerage funnel**. You type everything in — **no account linking, no DRV / Digitale Rentenübersicht pull anywhere**; the *state pension* is a manual in-app estimate with undisclosed methodology. Free sim → advisor call → they **broker a private (Pillar-3) contract**. **Germany-only, expats *in* Germany, German system only**; the pan-European/PEPP page is an *interest waitlist*, unshipped.
→ **Monetisation (the notable part):** commissioned product distribution. Two mutually-exclusive paths — (A) one-time **fee-for-advice (Honorarberatung)** → commission-free "Netto" products; or (B) no upfront fee → commission-based contracts (claimed "<1% effective"). A single 2024 review cited a **€2,450** flat setup fee, but the *current* site frames the fee as *"based on the annual amount you'll save"* (variable) and €2,450 appears nowhere live → treat as single-sourced/illustrative. €2,450 only *looks* large because it's transparent: German embedded commission runs ~2.5% of total premiums (LVRG cap; real-world 4–5%), i.e. **€2,700–€4,320 on a €108k contract** — often *more* than the visible fee. **Clerio read:** its product is weaker (no aggregation, no real state-pillar, one country) but it **monetises far richer than a subscription** — a live proof of the "money is in placing the capital, not €/mo" thesis in `market-size.md`.

### Tier 2 — Free government anchors (perception risk, not a feature rival)
Single-country dashboards that set the "should be free" expectation. **None cross borders.**
**VERIFIED (official, 2025–26):** DE Digitale Rentenübersicht (all 3 pillars, DE-only), NL mijnpensioenoverzicht.nl (accessible from abroad but shows *Dutch* rights only), SE minPension, DK PensionsInfo (since 1999), FR info-retraite.fr (has "retraite à l'étranger" but no foreign-entitlement aggregation), UK Pensions Dashboards (**not live until ~2027**).
- **ESTER / ETS — findyourpension.eu.** The EU's official cross-border attempt. **VERIFIED:** public-private consortium, EU-funded; **state-pillar *locator* only**, still a **pilot**, connects only **BE/FR/DE/NL/SE — no CH, no LU**, and does **no gap projection**. Grade **ADJACENT / future-infrastructure** (potential state-pillar data partner or long-term threat if it adds CH/LU + projection).
- **Switzerland has NO dashboard at all — public or private** (VERIFIED negative, research 2026). A core Clerio geography with zero free incumbent. **Use as a moat talking-point.**

### Tier 3 — Single-country pension fintechs (per-leg substitutes / potential partners)
Each owns one country/one pillar; relevant only *after* Clerio surfaces a specific gap → candidate **landing points / partners**, not aggregation rivals.
**VERIFIED (2025–26):** PensionBee (UK; explicitly **does not accept overseas transfers**), Penfold (UK SIPP), VIAC / finpension / frankly (Swiss Pillar 3a, ~0.39–0.44%), Raisin/WeltSparen Rürup (DE tax construct, non-portable). Grünfin = **defunct**.

### Tier 4 — Wealth / net-worth aggregators
| Player | Grade | Read |
|---|---|---|
| **Finary** (FR, expanding EU) | **SUBSTITUTE (weak) / not-competitive for multi-country** | Closest *user base* (engaged EU expats); aggregates FR accounts incl. PER, but **no state-pension calc**, and **Swiss banks not integrated** (own forum, 2025). €0–349/yr. |
| **Kubera** | **PRICE ANCHOR** | Global net-worth tracker, expat-friendly, but pensions are **balance line-items only** — no projection/gap. $249/yr proves expats pay for "serious global." |
| **Moneyhub** (UK) | **not-competitive** | Consumer app **closing Aug 2026**; B2B open-banking data layer only. |

### Tier 5 — Retirement-planning SaaS (PRICE ANCHORS, wrong geography)
The Discovery deep-research table lives here. **VERIFIED:** ProjectionLab (models DB pensions structurally, but 6 supported countries — **none FR/CH/LU** — no multi-currency; own docs say the model "breaks down" for multi-residency); Boldin (US; docs: "does not support international tax laws"); Empower (US, free). **Correction:** Origin is **active and growing** (US-only) — *not* shut down as the Discovery-era note assumed; simply **not applicable**.

### Tier 6 — Human substitutes (where the money currently moves)
**VERIFIED (2025–26):** expat IFAs — Blacktower, Holborn (**FCA sanctioned its UK arm** over adviser-introduced transfers), Blevins Franks, Spectrum (offices incl. FR/LU/CH), Harrison Brook (publishes ~1%/yr, ~3% initial). Economics: historically **5–8% upfront on transfers + ~1%/yr trail**; opaque pricing; **commission conflict of interest**; point-in-time not continuous. Private banks = €1M+ minimums (wrong segment). Cross-border tax/relocation firms touch pension decisions incidentally.
- Also named in `market-size.md` §5 as LU incumbents: **deVere, AES.**
→ Grade **SUBSTITUTE** for the *decision/transaction* layer; **weak** for the "just show me my gap" job. Positioning: Clerio is the trustworthy, always-on, unbiased **first step** *before* (or instead of) the commissioned conversation — matches `.impeccable.md` "IFAs are substitutes, not partners."

---

## 3. Whitespace + moat
- **VERIFIED across every tool surveyed:** none *calculates* multi-country **state-pension** entitlement from contribution history. Closest touches are ProjectionLab (structural DB math, wrong countries) and Finary (right users, no calc). This is Clerio's defensible core.
- **Two structural tailwinds worth citing externally:**
  1. **ASSUMPTION → VERIFIED (negative):** Switzerland has no free dashboard — no incumbent to fight in a core market.
  2. **VERIFIED:** **FIDA** (EU financial-data-access reg, ~2026) is set to **exclude occupational/Pillar-2 pensions from the *mandatory* open-data scope** (Council position; Pillar-2 stays opt-in per member state). The messiest pillar for FR/CH/LU careers therefore stays manual even after open banking — protecting a product that does the hard verified aggregation now.

## 4. Threats / watch-items (monitor, don't fear)
- **ETS/findyourpension.eu** adds CH/LU + projection → would erode the pure-aggregation wedge; differentiation shifts to planning/gap/decision-support.
- **Horizon65** actually ships cross-border (PEPP-based) → but see PEPP: framework has **~2 providers and ~9% consumer awareness** after 4 years; low near-term risk.
- **FIDA final text** *includes* Pillar-2 in trilogue → would lower the aggregation moat (currently trending the other way).

## 5. Adjacent framework — why-not-PEPP
The **Pan-European Personal Pension Product** (Reg. (EU) 2019/1238, live since 2022) is the EU's attempt to solve fragmentation by *manufacturing a new portable product* with national sub-accounts. **VERIFIED — it has largely failed:** ~2 authorised providers (Finax SK; LifeGoals CY), ~91% consumer non-awareness (EIOPA 2024), killed by a bundled **1% fee cap** + **no tax harmonisation** (tax is national competence; the EU issued only a non-binding Recommendation). Reform underway ("EuroPension"): EIOPA input Sept 2025 → Commission proposal **COM(2025) 840, Nov 2025** → **Council general approach 24 Jun 2026** (reportedly removes the 1% cap); **not enacted — pre-trilogue.**
→ **Two implications for Clerio:** (a) **Switzerland is structurally outside PEPP** (no EEA residence → no PEPP, ever; EIOPA FAQ) — a PEPP-based rival cannot represent Mats's Swiss years; (b) PEPP is a *cautionary tale for the "new product" strategy* (Horizon65's bet), reinforcing that the achievable win is the **aggregation-and-clarity layer**, not a new instrument.

---

## 6. OPEN — what to harden next
- **MyPensionPlan.lu** — named in `market-size.md` §5 as an independent LU beta; **not covered in the 2026-07-03 research pass.** Closest thing to a *Luxembourg-specific direct competitor* — needs its own look (what it does, coverage, live status, funding).
- **deVere / AES** — LU IFA incumbents named in market-size; confirm current offer/positioning vs the Tier-6 UK-rooted firms.
- **Swiss neobanks** (Alpian, Yuh, etc.) — check for any "prévoyance"/pillar-aggregation feature that would create a CH-side private anchor (currently assumed none).
- **EIOPA PEPP register** (pepp.eiopa.europa.eu) — live count of authorised products (JS-rendered; needs a browser check) to firm up "~2 providers."
- **Horizon65 end-user pricing** — free vs referral-commission; and whether its shipped product has moved beyond DE-only.
- **LifeGoals (CY) launch date** — April-2025 target vs ~Feb-2026 register listing conflict; re-verify before citing.

---

## Verdict (VC lens)
The **job is genuinely unowned** — verified, calculated, multi-country state+workplace+personal aggregation with a live gap exists nowhere. That's real and defensible. But it cuts both ways: the field is empty partly because the customer must be *taught* the problem (near-zero category search, `market-size.md` §5), the strongest "competitor" is user inertia, and free single-country dashboards keep raising the "why pay?" bar everywhere except Switzerland. Direct-analog risk (Horizon65, ETS) is real but years off and geography-mismatched. **Net: differentiation is not the problem — activation and trust are.** Compete on doing the multi-country *verified calculation* nobody else will, and on being the unbiased first step the commissioned-IFA market structurally can't be.
