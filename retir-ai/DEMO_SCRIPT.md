# RetirAI Demo Script — 5-Minute Screen Recording

**Persona:** Mats Karlsson, 45, Swedish-born, currently living and working in Luxembourg.
Career across 3 countries (France, Switzerland, Luxembourg) over 20+ years. Wants to retire at 64 with €5,500/month.

**Pre-demo:** Clear localStorage so the onboarding wizard appears on load.

---

## INTRO — The Problem (0:00 – 0:20)

> "Meet Mats. He's 45, originally from Sweden, and currently lives in Luxembourg. Over the past two decades, his career has taken him through France, Switzerland, and Luxembourg.
>
> Like millions of professionals with international experience, Mats has built up pension entitlements in multiple countries — each with its own rules, institutions, and language. The problem? Nobody gives him a unified view of what that actually means for his retirement.
>
> Let's see what happens when Mats opens RetirAI for the first time."

**On screen:** Load the app — the onboarding wizard appears full-screen.

---

## ACT 1 — Onboarding (0:20 – 1:20)

### Step 1: Profile (0:20 – 0:35)

> "RetirAI starts by collecting the basics: name, date of birth, country of residence, and target retirement age. These aren't just profile fields — each one determines which pension rules apply. Your birth year sets the French trimestre requirement. Your gender affects the Swiss AVS retirement age. Your residence country determines your tax regime."

**On screen:** The form is pre-filled with Mats Karlsson, born 15 March 1981, Male, Luxembourg, age 64. **Click Continue.**

### Step 2: Employment History (0:35 – 1:00)

> "Now the key step — employment history. Mats can import directly from his CV or LinkedIn profile. Let's upload his CV."

**Click "Upload CV". The parsing animation runs for ~2 seconds.**

> "RetirAI extracted four employment periods across three countries — Luxembourg from 2020 to present, Switzerland from 2014 to 2019, and two French periods going back to 2003. Countries, dates, and employment type — all detected automatically.
>
> Salary data can't be extracted from a CV, so each period shows 'Add salary' in amber. In production, Mats would click each period to enter his salary. For now, let's use the sample data to keep things moving."

**On screen:** Show the 4 extracted periods with flags, dates, and amber "Add salary" labels. **Click "Fill with sample data"** in the success banner. Salaries populate across all periods. The Continue button activates. Point to the country summary cards (FR: ~9.8 yrs, CH: ~5.3 yrs, LU: ~6.0 yrs). **Click Continue.**

### Step 3: Pillar 1 Estimate (0:55 – 1:10)

> "And here it is — Mats's first pension estimate, calculated in seconds. RetirAI applied the actual pension formulas: French CNAV rules with the SAM and trimestre calculations, Swiss AVS scale tables, Luxembourg CNAP flat-rate and proportional components.
>
> The result: Mats's combined Pillar 1 — state pension — comes to approximately €2,500 a month across three countries."

**On screen:** Show the total with the per-country breakdown. **Expand France** briefly to show the formula breakdown (trimestres, SAM, taux, décote). **Click "See Income Gap".**

### Step 4: Gap Analysis (1:10 – 1:20)

> "Now the reality check. Mats wants €5,500 a month. Pillar 1 covers less than half of that. The gap is roughly €3,000 a month — that's €756,000 over a 21-year retirement.
>
> But this is just Pillar 1. Pillar 2 and Pillar 3 haven't been tracked yet. Let's enter the dashboard to see the full picture."

**On screen:** Show the progress bar with the covered vs gap portions. **Click "Enter Dashboard".**

---

## ACT 2 — The Dashboard (1:20 – 2:00)

> "Notice what just happened — the numbers on the dashboard match exactly what the onboarding calculated. No disconnect. Mats sees his Pillar 1 projection, his income goal, the shortfall, and two gaps detected in his career.
>
> Pillar 2 and 3 aren't tracked yet — that card shows 'Not tracked' with a note that it could add over €1,000 a month."

**On screen:** Point to each KPI card — P1 Projection, Gaps Detected, Pillar 2 & 3 Not Tracked, Income Goal with the shortfall.

> "Now watch what happens when Mats uploads his pension documents."

**Click the "Before documents / Documents uploaded" toggle.**

> "His projection jumps to €3,840 a month. We've located his Swiss Pillar 2 at UBS — €1,040 a month plus a €210,000 capital option. Everything turns green: France verified, Switzerland verified, Luxembourg verified. Accuracy goes from ±15% to ±3%.
>
> This is the power of document verification."

---

## ACT 3 — Payout Estimation & Fund Detail (2:00 – 2:40)

**Navigate to Payout Estimation.**

> "The estimation page breaks down exactly where each euro comes from. By country — France at €1,500, Switzerland at €1,360, Luxembourg at €980. By pillar — Pillar 1 at €2,520, Pillar 2 at €1,320.
>
> But here's what makes RetirAI unique."

**Click the Switzerland accordion in "By fund & institution".**

> "We don't just say 'Swiss pension.' We show the exact institutions: AVS for Pillar 1 at €320 a month — 5.3 years, verified. UBS Pension Fund for Pillar 2 at €1,040 a month — with a €210,000 capital option. And Pillar 3a — not tracked, which is common for people who've moved on from Switzerland."

**Expand Luxembourg briefly to show estimated/unconfirmed/self-reported statuses.**

> "Luxembourg tells a different story: CNAP is estimated, the employer scheme is unconfirmed, and the Foyer private pension is self-reported. This transparency matters when you're making retirement decisions."

**Drag the capital slider to ~50% briefly.**

> "And the capital modeller lets Mats slide between annuity and lump sum for his Swiss Pillar 2."

---

## ACT 4 — Retirement Simulation (2:40 – 3:05)

**Navigate to Retirement Simulation.**

> "Where should Mats retire? It matters enormously. If he stays in Luxembourg — progressive rates — he'd keep a certain amount. If he moves to Portugal under the NHR regime — flat 10% tax — his net jumps to €3,456. Factor in purchasing power and that's equivalent to €4,800 in Luxembourg terms.
>
> That's over €2,000 a month in real spending power — just by choosing a different country."

**On screen:** Point to the net amounts and PPP-adjusted figures across countries.

> "The banner at the bottom connects Mats to a tax expert for a personalised residency analysis — because with pension income from three countries, double taxation treaties make this genuinely complex."

---

## ACT 5 — Legislative Radar (3:05 – 3:30)

**Navigate to Legislative Radar.**

> "RetirAI doesn't just calculate — it monitors. The Legislative Radar tracks pension laws and tax reforms across every country where Mats has built up entitlements. Six active alerts, three high priority.
>
> This one: France is considering raising the retirement age from 64 to 65. If it passes, Mats's planned retirement from France shifts by a year.
>
> And this: France and Switzerland are renegotiating how Pillar 2 lump sums get taxed. Mats could pay up to €12,000 more on his Swiss capital depending on where he's living when he claims it."

**Click the "Tax & Social Charges" filter. Point to the "Get expert analysis" CTA on a high-severity alert.**

> "Each alert cites the legislative source, effective date, and personal impact. For high-priority ones, Mats can connect directly with an expert."

---

## ACT 6 — Family Protection (3:30 – 4:00)

**Navigate to Family Access.**

> "Here's a stat that should concern every internationally mobile professional: €3.7 billion in pensions go unclaimed in France every year. CHF 4.1 billion in dormant Swiss Pillar 2 assets. 60% of families with pensions in multiple countries miss at least one claim.
>
> For Mats, that means his family would need to contact CNAV in France, AVS and UBS in Switzerland, CNAP in Luxembourg — in French and German — with strict deadlines they don't know about."

**Expand the Switzerland claim instructions.**

> "RetirAI builds real, actionable claim guides: 6 steps, 7 documents, three specific contacts for Switzerland alone — SVA Zürich, UBS Pension Fund, and the Stiftung Auffangeinrichtung for dormant assets. Plus warnings the family needs to know, like the fact that unmarried partners may have no legal claim to Pillar 2.
>
> Anna, Mats's wife, already received the France instructions. Swiss and Luxembourg are one click away."

---

## ACT 7 — Expert Consulting & Chat (4:00 – 4:50)

**Open the Chat Widget (click the gold FAB).**

> "Throughout the app, Mats has an AI pension advisor. Let me ask about the gaps."

**Click "Explain my gaps".**

> "The advisor explains both gaps, the financial impact, and the fix. But notice the suggestion chip: 'Have an expert fix this for me.'"

**Click "Have an expert fix this for me".**

> "The chatbot lists all consulting services — from document retrieval at €99 to a full retirement strategy at €899 — with a direct link to the Services page. This is how RetirAI turns data into action."

**Click the "View Expert Services" card in the chat, navigating to Expert Consulting.**

> "Five packages, plus a custom inquiry for anything that doesn't fit. Every engagement starts with a tailored quote — no commitment until Mats approves.
>
> And he can track everything here: his document retrieval is complete — Marie Dupont retrieved his French career extract in 14 days. His pension audit is in progress with Thomas Weber. A gap correction quote just came in — €179 to handle the CNAP buy-back that would recover €120 a month for life."

**Scroll to the request tracker showing the three requests.**

---

## CLOSE (4:50 – 5:00)

**Navigate back to Dashboard. Toggle to "Documents uploaded".**

> "From a blank slate to a complete retirement picture in under five minutes. RetirAI takes the most complex financial challenge facing internationally mobile professionals — pension entitlements scattered across countries, languages, and institutions — and makes it clear, actionable, and protected.
>
> From onboarding to estimates. From gaps to corrections. From data to expert strategy.
>
> This is retirement planning for how people actually build their careers today."

**On screen:** Dashboard with €3,840 projection, all green verification pills, €210K capital option badge.
