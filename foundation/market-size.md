# Foundation — Market Size

*Started 2026-06-27. Grading per [`_CANON.md`](_CANON.md).*
**Supersedes** Discovery `retir-ai/docs/gtm-market-sizing.md` §4 (Luxembourg beachhead) and §5 (addressable trajectory) on any conflict.

**One-line correction vs Discovery:** the Discovery doc's TAM is an *all-ages, generous-entitlement, payment-flow* count presented as the *active addressable* market. Apply the two missing filters — age 35–60 and genuine prior-country entitlement — and it falls ~2× in Luxembourg and ~4–6× EU-wide.

---

## 1. Definitions (so we stop conflating numbers)

- **Stock** = people who *have* the problem (entitlements in 2+ countries).
- **Active stock** = stock in the planning-relevant age band (35–60) — the product's actual market.
- **Flow** = people entering an *acquirable, active* state per year (new arrivals + existing stock hitting a trigger).
- **Reachable flow** = the slice of flow we can actually touch through a named channel.
- **Axis = work history, not nationality.** The target is anyone with a multi-country career — including *naturalized* Luxembourgers and native Luxembourgers who worked abroad, not just foreign nationals (see §2).
- These are NOT the same as Eurostat "payment flows," "movers," or "P1 documents" — see §6.

---

## 2. Luxembourg — active stock (multi-country-career residents)

### 2a. Foreign-resident stream

**VERIFIED — resident populations, STATEC, 1 Jan 2026** (via justarrived.lu / chronicle.lu summaries; STATEC direct PDFs 403-blocked):

| Community | Residents | | Community | Residents |
|---|---|---|---|---|
| Portuguese | 88,260 | | German | 12,107 |
| French | 49,255 | | Spanish | 10,276 |
| Italian | 25,529 | | Total foreign | ~322,050 (46.6%) |
| Belgian | 18,253 | | Total population | 690,959 |

Frontaliers (~231K cross-border commuters) are **not counted in this figure**, which is resident-based by construction. They are a **separate segment, not a non-segment** — an earlier version of this note excluded them on the grounds that "they contribute to one system and don't have the problem", and that reasoning is wrong twice over:

- **Most have ≥2 systems, not one.** A frontalier accrues in Luxembourg and typically has a home-country career on either side of it. By this section's own definition — multi-country career — they qualify; they simply don't live here.
- **They carry an exposure residents do not.** Luxembourg's pillar 2 is exempt at payout *because* a 20% entry tax was paid at funding. Germany and Belgium wrote treaty clauses recognising that; **France did not**. A French-resident frontalier's Luxembourg workplace pot is taxed again by a state that received nothing from the first tax. See `clerio-knowledge/maps/cross-border-pension-taxation.md`.

**Sizing them is OPEN** and deliberately not folded into the estimates below — a separate stream with its own reachability and product-fit questions, not a line item in the resident stock.

**ESTIMATE — age 35–60 share of foreign residents ≈ 40%.** Basis: STATEC confirms foreigners over-represented in 30–54; the 35–39 cohort alone is ~29K (largest single bracket); interpolating 35–60 gives ~38–42% of the ~322K foreign pool. Per-nationality age data is OPEN (see §7).

**ESTIMATE — "worked in prior country with a *vested* entitlement" share (the load-bearing assumption).** Portuguese skew is the swing factor: STATEC confirms the community is 70% first-generation but historically *young, low-skill* emigration (1960s–2000s steel/construction waves, arriving in their 20s) — "born in Portugal" ≠ "accrued a vested PT pension before leaving." These ratios are reasoned, not sourced:

| Community | Residents | × entitlement | × age 0.40 | ≈ active stock |
|---|---|---|---|---|
| Portuguese | 88,260 | 30–45% | | 10.6K–15.9K |
| French | 49,255 | 55–70% | | 10.8K–13.8K |
| Italian | 25,529 | 45–60% | | 4.6K–6.1K |
| Belgian | 18,253 | 40–55% | | 2.9K–4.0K |
| German | 12,107 | 45–60% | | 2.2K–2.9K |
| Spanish | 10,276 | 50–65% | | 2.1K–2.7K |
| Other foreign (~118K; UK/NL/PL/RO + TCN) | — | 25–40% | | ~12K–18K |

**ESTIMATE — foreign-resident active stock ≈ 45K–65K.** Dropping the age filter (problem-holders of all ages) returns ~110–160K — which is essentially what the Discovery number *is*, just mislabelled as addressable.

### 2b. Luxembourg-national stream (the boundary fix)

Starting from foreign *nationals* undercounts the market, because naturalization moves the best-fit users into the "national" column. Two groups carry a genuine multi-country career:

- **Naturalized Luxembourgers** — high naturalization rates mean a large first-generation cohort that worked abroad has since taken citizenship. Concrete signal: foreign-national Portuguese = 88,260, but *Portuguese-origin* (incl. naturalized) ≈ 142,000 → ~50K naturalized, additional people not in §2a. Same entitlement haircut applies (Portuguese-origin skews young/low-skill emigration); the strong adds are French/German/Belgian-origin and other professionals.
- **Native Luxembourgers who worked abroad and returned** — small country, cross-border education/early careers are normal. Real but smaller and softer.

**ESTIMATE — Luxembourg-national stream ≈ 17–28K active stock** (naturalized ~12–18K + native returnees ~5–10K). Lower confidence than §2a — STATEC publishes resident populations cleanly, but naturalized-by-origin and return-migration are not as readily pinned (see §7).

### 2c. Combined

**ESTIMATE — LU active stock ≈ 60–90K** (45–65K foreign residents + 17–28K nationals with foreign careers), vs Discovery's 130–150K. The nationals layer *partially offsets* the haircut without restoring the inflated number. **Note:** this widens *stock* more than *flow* — naturalized/native nationals are settled, so they barely appear in the arrivals-driven flow (§4); they activate mainly through tax-calendar and pre-retirement triggers, via different channels (SEO/community/tax-season, not relocation agencies or EU-institution HR).

---

## 3. Luxembourg — the high-value core (segment lens)

The diaspora gives headcount; this segment gives *quality*. It sits *inside* the 45–65K (overlaps the nationality counts — do not add), but it's the slice worth having: high income, English/French-reachable, and reachable through a *handful of named partners*.

**VERIFIED — concentration (stock):**
- EU institutions in LU: **~12,000–14,000 staff** (EP Secretariat ~4,000, EIB ~3,500, CJEU 2,302, + ECA/EIF/ESM/Eurostat). Almost by definition the exact profile. *(EIB LU-vs-external split is MEDIUM confidence.)*
- Big Four: **~10,300** (PwC ~3,650, Deloitte ~2,600, EY ~2,200, KPMG ~1,900). Younger-skewing, high mobility.
- International finance (BGL/BIL/BCEE/ING/Clearstream/Caceis + asset servicing): **~12,000–15,000**.

**ESTIMATE — high-WTP, in-band, partner-reachable core ≈ 15K–25K.** This is the believable bottom-up beachhead — concentrated, nameable, high-intent — not the 150K headline.

---

## 4. Luxembourg — annual flow

**VERIFIED — channel throughput:**
- Total long-stay arrivals: **25,725** (2024, STATEC); ~92% EU-origin; net migration +9,281.
- EU-institution new hires: **~400–700/yr** (ESTIMATE, from ~4–6% turnover on the stock).
- Corporate relocations: **~1,500–2,500/yr** (ESTIMATE; no published LU figure).
- Big Four / finance joiners: **~1,500–2,500/yr** (ESTIMATE).

**Flow model:**

| Source | Annual | Grade |
|---|---|---|
| New profile arrivals (prior-country entitlement, now in LU) | ~7–8K/yr | ESTIMATE (15–18K EU professionals × ~45%) |
| Existing active stock hitting a trigger | ~7–13K/yr | ASSUMPTION (60–90K combined stock × ~10–15%/yr; nationals activate at lower rates) |
| **Gross active flow** | **~14–20K/yr** | ESTIMATE |

**Reachability (the constraint):**

| Channel | Reachable flow/yr | Note |
|---|---|---|
| Partnerships (EU institutions + relocation + Big Four/finance HR) | ~3–5K | The dominant LU channel. Nameable, finite. |
| Organic search | ~hundreds | LU category search ~zero (§5); rides single-country + lost-pension hooks |
| Community / PR | ~hundreds | Broad reach, low WTP |
| **Realistically reachable** | **~3–6K/yr** | ESTIMATE |

**ESTIMATE — LU price-free funnel:** ~3–6K reachable → ~25–35% signup → ~800–2,000 signups/yr → ~12–20% "would pay anything" → **~150–400 paying-intent users/yr.** Conclusion: **LU is a proof market, not a venture market.**

---

## 5. Demand evidence + the SEO correction

**ESTIMATE — category search is near-zero.** Five independent search passes returned no hard per-keyword volume; the *reasoned* finding: phrases describing the value prop ("cross-border pension," "EU pension coordination," "pension multiple countries") are policy/expert vocabulary, **not** how people search. Real volume is on **single-country, single-action, native-language** terms: `Freizügigkeitskonto` (CH, likely largest cluster), `Rente im Ausland` (DE), `retraite à l'étranger` (FR), `QROPS` (UK/AU).
→ **Implication (challenges Discovery):** the "organic SEO is the zero-CAC engine" thesis is **softer than written**, especially in LU. Capture is per-country, in-language; partnerships carry more load than the Discovery economics imply. Hardening this is OPEN (§7).

**VERIFIED — demand proxies (the market *does* exist, proven behaviorally):**
- **CHF 6–6.75bn unclaimed** in ~960,000 dormant Swiss vested-benefits accounts (Stiftung Auffangeinrichtung BVG / aeis.ch, Dec 2025) — driven explicitly by people who change jobs/countries and forget. Best PR/SEO asset; maps to Trigger 2. *(Disregard an unverified "CHF 13bn" figure seen once.)*
- **Pension-dashboard usage proves latent appetite:** Belgium mypension.be 3.09M logins (1 in 3 adults); France 45.6M visits/yr; Netherlands 8.11M logins/yr.
- **Cross-border pension scale:** ~6.4M cross-border pensions paid / ~€31bn in 2024 (+9% YoY; HIVA-KU Leuven for EC) — *payment flows, not people*. LU: 43% of pensions paid abroad; 12–13% of LU pensioners draw a foreign pension.
- **Competitive slot is open:** FindYourPension.eu is grant-funded, Belgium-only; MyPensionPlan.lu is an independent beta. No VC-funded commercial multi-country aggregator. Incumbents are human IFAs (deVere, AES).

---

## 6. EU overlay (lower confidence — option value, not base case)

**Gate is having worked in 2+ countries, not age** (age segments value, it doesn't qualify the problem).

**CORRECTION (2026-06-27, after primary-source check):** an earlier rework anchored this TAM on "~6M people who worked in 2+ EU countries." Primary-source verification showed **~6M is a *payment-flow* count** — cross-border pensions *paid* to people *residing* abroad (HIVA RY2024: 6,358,008 pensions / €31.0bn, scope EU-27 + EFTA + UK), which even includes single-country careers who retired abroad. It is NOT a count of people who worked in 2+ countries; that was a press paraphrase of an EPSCO Council statement (no primary stat exists for it). This was exactly the flows-for-people trap. Corrected structure:

**KEY REFRAME (the customer is the planner, not the retiree):** the one cleanly *measurable* EU number is the problem's END-STATE (retirees already drawing), which is NOT the customer. The customer is the working-age PLANNING population (35–65, still deciding), which no source measures. So:

**EVIDENCE (derived, NOT customers) ≈ 1–3M.** People who *already draw* pensions from 2+ states — derived from HIVA RY2022 §5.1 (~1.48M exported dual-entitlement streams, partial-state subset → ~1–2M unique), cross-checked by ~3.2% of ~99M EU old-age pensioners (~3.2M). Retirees *past the planning window* — proof the problem matures into millions, but mostly residual market, not the customer base. **Trigger inflow ≈ 100–200K/yr new multi-country retirees** (implied by stock ÷ ~15–20yr drawing duration — internally consistent). ⚠️ The ~1M PD P1 *documents* issued/yr is NOT this — documents overcount people several-fold (one per institution per claim, 3 benefit types); an earlier draft wrongly used ~1M/yr as new people (a ~1–2M stock can't take in 1M/yr). **Scope already covers CH + UK** (HIVA = EU-27 + EFTA incl. Switzerland + UK); CH alone ≈ 14% of flows.

**CUSTOMER TAM (modeled, low confidence) ≈ 3–5M.** Working-age + pre-retirement people with 2+ entitlements, in the planning window. No source measures this — modeled, anchored on the ~1M/yr claim flow + rising mobility. High-value core (35–65, pre-retirement-weighted, urgency/WTP) ≈ **1.5–2.5M**; 60–67 kept in (most acute claim moment). **To harden:** pair the ~1M/yr claim flow with pre-retirement age structure (5–10yr planning window) for a firmer core floor.

Context bounds (NOT multiplied in): 10.1M working-age movers (EC 2024), 17M gross movers (Eurostat). Discovery's 12M conflates all-movers with payment-flow figures.

**Do not sum the EU figures** — each measures something different: ~6M (people who worked in 2+), 1.48M (people drawing 2+ pensions), 6.4M (payment flows), 1.03M (P1 docs/yr), 1.9M (65+ movers), 10.1M (working-age movers). Use them to triangulate, never to add.

**Reconciliation with Discovery's forecast:** the Discovery *subscriber* forecast (~19,437 by Y5) is plausible — the flow model scales to roughly that. Against the ~1.5–2.5M core the same forecast is ~1% penetration (~0.5% of the ~3–5M modeled TAM) — believable. The forecast was never the problem; the TAM framing was.

---

## 7. OPEN — what to harden next

- **Per-nationality age × generation × work-history** — in STATEC LUSTAT (table DF_B1113) but needs interactive browser access. Would replace the §2a entitlement ESTIMATEs with data.
- **Naturalized-by-origin + return migration** — to size the §2b Luxembourg-national stream properly. Needs STATEC naturalization statistics by country of origin, and a handle on native Luxembourgers with foreign work history. Currently the softest part of the LU stock.
- **LU keyword volumes** — pull Google Keyword Planner per-country, in local language, for the ~15 head terms. Confirms/kills the §5 SEO correction with hard numbers.
- **Conversion + WTP** — blocked until price is decided (price is currently a placeholder, *undecided*). The §4 funnel is price-free by design.
- **Capital-aggregation market** — the venture-scale answer (annual cross-border retirement capital flow × defensible take-rate) is **not yet sized**. This is the highest-value open item. Anchors: QROPS avg transfer £197K; CHF 6bn unclaimed; €31bn/yr cross-border flows; real retail trailing fees 0.5–1.5% vs Discovery's 0.03%.

---

## Verdict (VC lens)

Market **exists** — latent demand is real, large, and proven by adjacent behavior (billions unclaimed, millions of dashboard logins, empty competitive slot). But: low-ACV subscription on a niche that must be *explained* to the customer, near-zero category search, and a sub-scale subscriber endgame. The defensible venture thesis is the **capital-aggregation play wedged by the SaaS** — monetize the capital, not the €X/mo. That market is OPEN and should be sized next.
