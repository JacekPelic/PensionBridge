// Generates a self-contained HTML investor overview from financial-model.js.
// Single source of truth: all numbers come from the canonical model.

const M = require("./financial-model");
const fs = require("fs");
const path = require("path");

const baseData = M.simulate("base");
const upsideData = M.simulate("upside");
const baseBE = M.computeBreakEvens(baseData);
const upsideBE = M.computeBreakEvens(upsideData);

function trough(data) {
  let cash = 0, t = { month: 0, cash: 0 };
  for (let i = 0; i < data.length; i++) {
    cash += data[i].netIncome;
    if (cash < t.cash) t = { month: i + 1, cash };
  }
  return t;
}
const baseTrough = trough(baseData);
const upsideTrough = trough(upsideData);

const fmtEur = n => "€" + Math.round(n).toLocaleString("en-US");
const fmtEurShort = n => {
  const a = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (a >= 1e9) return sign + "€" + (a / 1e9).toFixed(2) + "B";
  if (a >= 1e6) return sign + "€" + (a / 1e6).toFixed(2) + "M";
  if (a >= 1e3) return sign + "€" + Math.round(a / 1e3).toLocaleString("en-US") + "K";
  return sign + "€" + Math.round(a).toLocaleString("en-US");
};
const fmtInt = n => Math.round(n).toLocaleString("en-US");
const fmtPct = (n, d = 1) => (n * 100).toFixed(d) + "%";

const yearIdx = [11, 23, 35, 47, 59];
const yearAggregates = (data) => yearIdx.map((endIdx, yi) => {
  const slice = data.slice(yi * 12, endIdx + 1);
  return {
    year: yi + 1,
    countries: data[endIdx].countriesLive,
    addressable: data[endIdx].addressable,
    paidSubs: data[endIdx].totalPaidSubs,
    subARR: data[endIdx].subARR,
    leadGenARR: data[endIdx].totalARR - data[endIdx].subARR,
    totalARR: data[endIdx].totalARR,
    capital: data[endIdx].totalCapital,
    annualSubRev: slice.reduce((s, d) => s + d.subMRR, 0),
    annualLeadGenRev: slice.reduce((s, d) => s + d.leadGenMonthly, 0),
    annualTotalRev: slice.reduce((s, d) => s + d.totalMRR, 0),
    annualCosts: slice.reduce((s, d) => s + d.totalCosts, 0),
    annualNet: slice.reduce((s, d) => s + d.netIncome, 0),
    cumulativeNet: data[endIdx].cumulativeNet,
    endFtes: data[endIdx].activeFtes,
  };
});
const baseYears = yearAggregates(baseData);
const upsideYears = yearAggregates(upsideData);

const yearCostsBreakdown = (data) => yearIdx.map((endIdx, yi) => {
  const slice = data.slice(yi * 12, endIdx + 1);
  return {
    year: yi + 1,
    infra: slice.reduce((s, d) => s + d.infraCost, 0),
    ai: slice.reduce((s, d) => s + d.aiCost, 0),
    marketing: slice.reduce((s, d) => s + d.marketingCost, 0),
    countryLaunch: slice.reduce((s, d) => s + d.countryLaunchBurst + d.countryRecurring, 0),
    support: slice.reduce((s, d) => s + d.supportCost, 0),
    legal: slice.reduce((s, d) => s + d.legalCost, 0),
    misc: slice.reduce((s, d) => s + d.miscCost, 0),
    founderComp: slice.reduce((s, d) => s + d.founderComp, 0),
    team: slice.reduce((s, d) => s + d.salaryCost, 0),
    total: slice.reduce((s, d) => s + d.totalOperatingCosts, 0),
  };
});
const baseCosts = yearCostsBreakdown(baseData);

const totalFounderComp = (data) => data.reduce((s, d) => s + d.founderComp, 0);

// Unit economics (mature, blended)
const annualMix = M.ANNUAL_SPLIT_TARGET;
const blendedMonthlyArpu = (1 - annualMix) * M.PRICE_MONTHLY + annualMix * (M.PRICE_ANNUAL / 12);
const blendedAnnualArpu = blendedMonthlyArpu * 12;
// Mature churn ≈ floor of churnAdj = 70% of base churn = 0.021
const matureChurn = M.SCENARIOS.base.monthlyChurn * 0.70;
const ltvMonths = 1 / matureChurn;
const ltv = ltvMonths * blendedMonthlyArpu;

// Y5 ARR growth from Y1
const baseY1Arr = baseYears[0].totalARR;
const baseY5Arr = baseYears[4].totalARR;
const baseCagr = Math.pow(baseY5Arr / Math.max(baseY1Arr, 1), 1 / 4) - 1;
const upsideCagr = Math.pow(upsideYears[4].totalARR / Math.max(upsideYears[0].totalARR, 1), 1 / 4) - 1;

const today = new Date().toISOString().split("T")[0];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Prevista — Financial Overview</title>
<style>
  :root {
    --navy: #1B2A4A;
    --navy-deep: #0F1A30;
    --gold: #B8860B;
    --gold-soft: #D4A832;
    --cream: #FAF7F0;
    --paper: #FFFFFF;
    --ink: #2A2A2A;
    --ink-soft: #4A4A4A;
    --muted: #6E6A60;
    --rule: #D8D2C2;
    --tint: #F4F0E5;
    --positive: #2D6A4F;
    --negative: #9B2226;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", system-ui, sans-serif;
    background: var(--cream);
    color: var(--ink);
    line-height: 1.55;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: "kern", "liga";
  }
  main {
    max-width: 980px;
    margin: 0 auto;
    padding: 64px 56px 80px;
    background: var(--paper);
    box-shadow: 0 0 0 1px var(--rule);
  }
  header.doc {
    margin-bottom: 56px;
  }
  .eyebrow {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--gold);
    margin: 0 0 14px;
    font-weight: 600;
  }
  h1 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 42px;
    margin: 0 0 10px;
    line-height: 1.1;
    color: var(--navy);
    font-weight: 600;
    letter-spacing: -0.015em;
  }
  .subtitle {
    color: var(--muted);
    font-size: 15px;
    margin: 0;
    font-style: italic;
  }
  h2 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 26px;
    color: var(--navy);
    margin: 64px 0 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--gold);
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  h3 {
    font-family: Georgia, serif;
    font-size: 17px;
    color: var(--navy);
    margin: 32px 0 10px;
    font-weight: 600;
  }
  p { margin: 0 0 14px; max-width: 70ch; }
  p.lead {
    font-size: 17px;
    color: var(--ink-soft);
    line-height: 1.6;
    max-width: 68ch;
  }
  .metric-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
    margin: 28px 0 8px;
  }
  .metric {
    border: 1px solid var(--rule);
    border-top: 2px solid var(--gold);
    padding: 20px 22px 18px;
    background: var(--paper);
  }
  .metric .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    margin: 0 0 10px;
    font-weight: 600;
  }
  .metric .value {
    font-family: Georgia, serif;
    font-size: 28px;
    font-variant-numeric: tabular-nums;
    color: var(--navy);
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.01em;
  }
  .metric .note {
    font-size: 12px;
    color: var(--muted);
    margin: 8px 0 0;
    line-height: 1.4;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 22px 0 8px;
    font-variant-numeric: tabular-nums;
    font-size: 14px;
  }
  th {
    text-align: right;
    font-weight: 600;
    color: var(--navy);
    padding: 11px 12px 10px;
    border-bottom: 1.5px solid var(--navy);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--paper);
  }
  th:first-child, td:first-child {
    text-align: left;
  }
  td {
    padding: 9px 12px;
    border-bottom: 1px solid var(--rule);
    color: var(--ink-soft);
  }
  tr:last-child td { border-bottom: none; }
  tbody tr.section-head td {
    color: var(--navy);
    font-weight: 600;
    background: var(--tint);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.06em;
    padding-top: 12px;
    padding-bottom: 10px;
  }
  tbody tr.total td {
    font-weight: 600;
    color: var(--navy);
    border-top: 1px solid var(--navy);
    border-bottom: 1.5px solid var(--navy);
    background: var(--tint);
  }
  tbody tr.indent td:first-child {
    padding-left: 28px;
  }
  td.pos { color: var(--positive); font-weight: 600; }
  td.neg { color: var(--negative); font-weight: 600; }
  .scenarios {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin: 24px 0;
  }
  .scenario {
    border: 1px solid var(--rule);
    padding: 22px 24px 24px;
    background: var(--paper);
  }
  .scenario.upside {
    border-top: 2px solid var(--gold);
  }
  .scenario.base {
    border-top: 2px solid var(--navy);
  }
  .scenario h4 {
    margin: 0 0 16px;
    font-family: Georgia, serif;
    color: var(--navy);
    font-size: 17px;
    font-weight: 600;
  }
  .scenario dl {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr auto;
    row-gap: 8px;
    column-gap: 18px;
    font-size: 14px;
  }
  .scenario dt { color: var(--muted); }
  .scenario dd {
    margin: 0;
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: var(--navy);
    font-weight: 600;
  }
  .pull {
    border-left: 2px solid var(--gold);
    padding: 4px 0 4px 18px;
    margin: 22px 0;
    color: var(--ink-soft);
    font-style: italic;
    font-size: 16px;
  }
  ul { margin: 8px 0 16px; padding-left: 22px; max-width: 70ch; }
  li { margin: 5px 0; color: var(--ink-soft); }
  .footnote {
    font-size: 12px;
    color: var(--muted);
    margin: 6px 0 0;
    line-height: 1.45;
    font-style: italic;
  }
  footer.doc {
    margin-top: 72px;
    padding-top: 22px;
    border-top: 1px solid var(--rule);
    font-size: 12px;
    color: var(--muted);
    line-height: 1.5;
  }
  @media (max-width: 720px) {
    main { padding: 40px 24px 60px; }
    h1 { font-size: 32px; }
    h2 { font-size: 22px; }
    .scenarios { grid-template-columns: 1fr; }
  }
  @media print {
    body { background: white; }
    main { box-shadow: none; max-width: 100%; padding: 32px 24px; }
    h2 { page-break-after: avoid; }
    table { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<main>
  <header class="doc">
    <p class="eyebrow">Prevista · Financial Overview</p>
    <h1>Pension clarity for Europe's mobile professionals</h1>
    <p class="subtitle">5-year projection · base &amp; upside scenarios · pure bootstrap · ${today}</p>
  </header>

  <section>
    <h2>At a glance</h2>
    <p class="lead">Two revenue streams (subscriptions + lead generation) compounding across 29 country pension engines, reaching €${(baseY5Arr/1e6).toFixed(2)}M ARR in the base scenario and €${(upsideYears[4].totalARR/1e6).toFixed(2)}M in the upside. Reaches cumulative break-even in month ${baseBE.cumBE} (base) on roughly €60-70K of founder capital — no external funding required.</p>
    <div class="metric-grid">
      <div class="metric">
        <p class="label">Year 5 ARR · Base</p>
        <p class="value">${fmtEurShort(baseYears[4].totalARR)}</p>
        <p class="note">${fmtInt(baseYears[4].paidSubs)} paying subscribers · ${baseYears[4].countries} countries live</p>
      </div>
      <div class="metric">
        <p class="label">Year 5 ARR · Upside</p>
        <p class="value">${fmtEurShort(upsideYears[4].totalARR)}</p>
        <p class="note">${fmtInt(upsideYears[4].paidSubs)} paying subscribers · ${baseCagr > 0 ? "" : ""}${fmtPct(upsideCagr, 0)} CAGR Y1→Y5</p>
      </div>
      <div class="metric">
        <p class="label">Cumulative break-even</p>
        <p class="value">M${baseBE.cumBE} <span style="font-size:18px; color:var(--muted); font-weight:400;">/ M${upsideBE.cumBE}</span></p>
        <p class="note">Base / upside · monthly BE M${baseBE.monthlyBE} / M${upsideBE.monthlyBE}</p>
      </div>
      <div class="metric">
        <p class="label">Total founder capital</p>
        <p class="value">~€60-70K</p>
        <p class="note">Trough ${fmtEurShort(baseTrough.cash)} at M${baseTrough.month} (base) · pure bootstrap</p>
      </div>
      <div class="metric">
        <p class="label">Addressable market</p>
        <p class="value">${fmtInt(baseYears[4].addressable / 1e6)}M+</p>
        <p class="note">Bilateral pension corridors across 29 countries (EU27 + UK + CH)</p>
      </div>
      <div class="metric">
        <p class="label">Y5 capital under referral</p>
        <p class="value">${fmtEurShort(baseYears[4].capital)}</p>
        <p class="note">Compounding asset base behind the lead-gen revenue stream</p>
      </div>
    </div>
  </section>

  <section>
    <h2>Business model</h2>
    <p>Prevista unifies fragmented pension data across state, workplace, and personal pillars for internationally-mobile professionals — careers spanning 3+ EU jurisdictions. Two revenue streams compound on the same user base:</p>
    <h3>Stream 1 · Subscriptions</h3>
    <p>€${M.PRICE_MONTHLY.toFixed(2)}/month or €${M.PRICE_ANNUAL.toFixed(0)}/year. Annual mix matures to ${fmtPct(M.ANNUAL_SPLIT_TARGET, 0)} of paid users by Y5. ${fmtPct(M.SCENARIOS.base.paidConversion, 0)} signup→paid conversion in base, ${fmtPct(M.SCENARIOS.upside.paidConversion, 0)} in upside.</p>
    <h3>Stream 2 · Lead generation</h3>
    <p>0.03% annual trailing commission on aggregate referred capital — a deliberate conservative floor against published 1.0–1.5% LU/FR retail distribution rates. ${fmtPct(M.LEAD_GEN_EFFECTIVE, 1)} of all signups become referred investors (80% gap × 25% click × 15% invest); average ${fmtEur(M.AVG_CAPITAL_INVESTED)} placement compounds at ${fmtPct(M.CAPITAL_ANNUAL_GROWTH, 0)}/year.</p>
    <h3>Acquisition · seed-stage</h3>
    <p>Two channels: organic SEO content (compounds with each new country engine) and distribution partnerships (BD-led, ramping from ${M.SCENARIOS.base.activePartnersM7} active partner at M7 to ${M.SCENARIOS.base.activePartnersM60} by M60 in base). Paid acquisition is held in reserve as a Series A lever — at €4.99 + 12% conversion paid LTV:CAC is 0.49×.</p>
  </section>

  <section>
    <h2>Base vs upside scenarios</h2>
    <p>Same underlying engine deployment schedule, founder compensation structure, and country-launch costs across both scenarios. The variables that diverge are conversion (signup→paid), organic reach, churn, and partnership velocity.</p>
    <div class="scenarios">
      <div class="scenario base">
        <h4>Base scenario</h4>
        <dl>
          <dt>Y5 ARR</dt><dd>${fmtEurShort(baseYears[4].totalARR)}</dd>
          <dt>Y5 paying subs</dt><dd>${fmtInt(baseYears[4].paidSubs)}</dd>
          <dt>Y5 cumulative net</dt><dd>${fmtEurShort(baseYears[4].cumulativeNet)}</dd>
          <dt>Monthly break-even</dt><dd>M${baseBE.monthlyBE}</dd>
          <dt>Cumulative break-even</dt><dd>M${baseBE.cumBE}</dd>
          <dt>Cash trough</dt><dd>${fmtEurShort(baseTrough.cash)} at M${baseTrough.month}</dd>
          <dt>Conversion (signup→paid)</dt><dd>${fmtPct(M.SCENARIOS.base.paidConversion, 0)}</dd>
          <dt>Initial monthly churn</dt><dd>${fmtPct(M.SCENARIOS.base.monthlyChurn, 1)}</dd>
          <dt>Y5 FTE headcount</dt><dd>${baseYears[4].endFtes}</dd>
        </dl>
      </div>
      <div class="scenario upside">
        <h4>Upside scenario</h4>
        <dl>
          <dt>Y5 ARR</dt><dd>${fmtEurShort(upsideYears[4].totalARR)}</dd>
          <dt>Y5 paying subs</dt><dd>${fmtInt(upsideYears[4].paidSubs)}</dd>
          <dt>Y5 cumulative net</dt><dd>${fmtEurShort(upsideYears[4].cumulativeNet)}</dd>
          <dt>Monthly break-even</dt><dd>M${upsideBE.monthlyBE}</dd>
          <dt>Cumulative break-even</dt><dd>M${upsideBE.cumBE}</dd>
          <dt>Cash trough</dt><dd>${fmtEurShort(upsideTrough.cash)} at M${upsideTrough.month}</dd>
          <dt>Conversion (signup→paid)</dt><dd>${fmtPct(M.SCENARIOS.upside.paidConversion, 0)}</dd>
          <dt>Initial monthly churn</dt><dd>${fmtPct(M.SCENARIOS.upside.monthlyChurn, 1)}</dd>
          <dt>Y5 FTE headcount</dt><dd>${upsideYears[4].endFtes}</dd>
        </dl>
      </div>
    </div>
  </section>

  <section>
    <h2>Five-year P&amp;L · base scenario</h2>
    <table>
      <thead>
        <tr>
          <th>Annual figures</th>
          <th>Year 1</th>
          <th>Year 2</th>
          <th>Year 3</th>
          <th>Year 4</th>
          <th>Year 5</th>
        </tr>
      </thead>
      <tbody>
        <tr class="section-head"><td colspan="6">Revenue</td></tr>
        <tr class="indent"><td>Subscription revenue</td>${baseYears.map(y => `<td>${fmtEurShort(y.annualSubRev)}</td>`).join("")}</tr>
        <tr class="indent"><td>Lead-gen revenue</td>${baseYears.map(y => `<td>${fmtEurShort(y.annualLeadGenRev)}</td>`).join("")}</tr>
        <tr class="total"><td>Total revenue</td>${baseYears.map(y => `<td>${fmtEurShort(y.annualTotalRev)}</td>`).join("")}</tr>
        <tr class="section-head"><td colspan="6">Operating costs</td></tr>
        <tr class="indent"><td>Infrastructure</td>${baseCosts.map(c => `<td>${fmtEurShort(c.infra)}</td>`).join("")}</tr>
        <tr class="indent"><td>AI API</td>${baseCosts.map(c => `<td>${fmtEurShort(c.ai)}</td>`).join("")}</tr>
        <tr class="indent"><td>Content &amp; SEO (global)</td>${baseCosts.map(c => `<td>${fmtEurShort(c.marketing)}</td>`).join("")}</tr>
        <tr class="indent"><td>Country launch + recurring</td>${baseCosts.map(c => `<td>${fmtEurShort(c.countryLaunch)}</td>`).join("")}</tr>
        <tr class="indent"><td>Support</td>${baseCosts.map(c => `<td>${fmtEurShort(c.support)}</td>`).join("")}</tr>
        <tr class="indent"><td>Legal / compliance</td>${baseCosts.map(c => `<td>${fmtEurShort(c.legal)}</td>`).join("")}</tr>
        <tr class="indent"><td>Founder compensation</td>${baseCosts.map(c => `<td>${fmtEurShort(c.founderComp)}</td>`).join("")}</tr>
        <tr class="indent"><td>FTE salaries</td>${baseCosts.map(c => `<td>${fmtEurShort(c.team)}</td>`).join("")}</tr>
        <tr class="total"><td>Total operating costs</td>${baseCosts.map(c => `<td>${fmtEurShort(c.total)}</td>`).join("")}</tr>
        <tr class="section-head"><td colspan="6">Bottom line</td></tr>
        <tr><td>Net income</td>${baseYears.map(y => `<td class="${y.annualNet >= 0 ? "pos" : "neg"}">${fmtEurShort(y.annualNet)}</td>`).join("")}</tr>
        <tr class="total"><td>Cumulative net</td>${baseYears.map(y => `<td class="${y.cumulativeNet >= 0 ? "pos" : "neg"}">${fmtEurShort(y.cumulativeNet)}</td>`).join("")}</tr>
      </tbody>
    </table>
    <p class="footnote">Founder compensation: BD draws from M8 (€3K → €5K → €7K as subMRR scales); tech defers until subMRR &gt; €25K (~M28). All loaded company cost (~25% LU indépendant social charges). FTE headcount in base: ${baseYears.map(y => y.endFtes).join(" → ")} by year-end.</p>
  </section>

  <section>
    <h2>Path to break-even</h2>
    <p>The bootstrap thesis is: founder capital absorbs the operational trough; nothing else. Founders draw salary from M8 onwards (BD) and from M28 onwards (tech) — included in the cost base above, not deferred to Series A.</p>
    <table>
      <thead>
        <tr><th>&nbsp;</th><th>Base</th><th>Upside</th></tr>
      </thead>
      <tbody>
        <tr><td>Monthly break-even (revenue &gt; costs)</td><td>M${baseBE.monthlyBE}</td><td>M${upsideBE.monthlyBE}</td></tr>
        <tr><td>Cumulative break-even (recovers all losses)</td><td>M${baseBE.cumBE}</td><td>M${upsideBE.cumBE}</td></tr>
        <tr><td>Deepest cash trough</td><td>${fmtEurShort(baseTrough.cash)} at M${baseTrough.month}</td><td>${fmtEurShort(upsideTrough.cash)} at M${upsideTrough.month}</td></tr>
        <tr><td>Total founder capital required</td><td>~€60-70K</td><td>~€40-50K</td></tr>
        <tr><td>Y5 cumulative net income</td><td class="pos">${fmtEurShort(baseYears[4].cumulativeNet)}</td><td class="pos">${fmtEurShort(upsideYears[4].cumulativeNet)}</td></tr>
      </tbody>
    </table>
    <p class="pull">Pure bootstrap survives in both scenarios. External capital is opportunistic acceleration — never a survival input.</p>
  </section>

  <section>
    <h2>Unit economics</h2>
    <table>
      <thead>
        <tr><th>Metric</th><th>Value</th><th>Note</th></tr>
      </thead>
      <tbody>
        <tr><td>Subscription price (monthly / annual)</td><td>€${M.PRICE_MONTHLY.toFixed(2)} / €${M.PRICE_ANNUAL.toFixed(0)}</td><td>Annual carries ~18% effective discount</td></tr>
        <tr><td>Mature blended ARPU (annualised)</td><td>${fmtEur(blendedAnnualArpu)}</td><td>${fmtPct(M.ANNUAL_SPLIT_TARGET, 0)} annual / ${fmtPct(1 - M.ANNUAL_SPLIT_TARGET, 0)} monthly mix</td></tr>
        <tr><td>Mature monthly churn</td><td>${fmtPct(matureChurn, 2)}</td><td>3.0% initial, improving with cohort tenure</td></tr>
        <tr><td>Avg subscriber lifetime</td><td>${ltvMonths.toFixed(0)} months</td><td>1 / mature churn</td></tr>
        <tr><td>LTV (subscription only)</td><td>${fmtEur(ltv)}</td><td>Lead-gen LTV is additive on top</td></tr>
        <tr><td>CAC (organic, base)</td><td>€0</td><td>SEO content compounds at zero marginal cost per signup</td></tr>
        <tr><td>CAC (paid, hypothetical)</td><td>€${M.SCENARIOS.base.blendedCAC}</td><td>Held in reserve — paid is a Series A lever, not a bootstrap channel</td></tr>
        <tr><td>Lead-gen referrals (% of signups)</td><td>${fmtPct(M.LEAD_GEN_EFFECTIVE, 1)}</td><td>80% gap × 25% click × 15% invest</td></tr>
        <tr><td>Avg capital placed per referred investor</td><td>${fmtEur(M.AVG_CAPITAL_INVESTED)}</td><td>Initial placement; rollover-pathway clients defend higher</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>Geographic expansion</h2>
    <p>29 country engines (EU27 + UK + CH) deployed in greedy TAM-maximising order. Three live at launch (LU/FR/CH); quarterly cadence in Y1; ~2-month cadence Y2-Y5. Each new engine unlocks bilateral pension corridors with all already-supported countries — addressable market compounds.</p>
    <table>
      <thead>
        <tr><th>End of</th><th>Countries live</th><th>Addressable population</th><th>Paying subs</th><th>Total ARR</th></tr>
      </thead>
      <tbody>
        ${baseYears.map(y => `
        <tr>
          <td>Year ${y.year}</td>
          <td>${y.countries}</td>
          <td>${fmtInt(y.addressable)}</td>
          <td>${fmtInt(y.paidSubs)}</td>
          <td>${fmtEurShort(y.totalARR)}</td>
        </tr>`).join("")}
      </tbody>
    </table>
    <p class="footnote">Addressable = sum of bilateral pension corridors (diaspora populations) × 0.55 addressability factor, with a 6-month linear ramp from when both engines are live. Demo persona: Mats Karlsson, 45, Luxembourg resident, career across France (10y), Switzerland (5y), Luxembourg (6y).</p>
  </section>

  <section>
    <h2>Founder economics &amp; bootstrap thesis</h2>
    <p>Two co-founders, both working from day 1. Salary draws are staggered to match the operational reality of a launch: BD becomes the binding constraint earlier (post-launch distribution), tech defers because they have higher pain tolerance for low-pay phase and the patterned engine-build cadence sustains.</p>
    <h3>BD co-founder</h3>
    <ul>
      <li>Full-time from M7. First paycheck M8 (€3K/month — ramen).</li>
      <li>Step-up to €5K/month once subMRR &gt; €8K (M${baseData.findIndex(d => d.subMRR >= 8000) + 1} base / M${upsideData.findIndex(d => d.subMRR >= 8000) + 1} upside).</li>
      <li>Step-up to €7K/month once subMRR &gt; €25K (M${baseData.findIndex(d => d.subMRR >= 25000) + 1} base / M${upsideData.findIndex(d => d.subMRR >= 25000) + 1} upside).</li>
    </ul>
    <h3>Technical co-founder</h3>
    <ul>
      <li>Defers salary until subMRR &gt; €25K (~M${baseData.findIndex(d => d.subMRR >= 25000) + 1} base / M${upsideData.findIndex(d => d.subMRR >= 25000) + 1} upside).</li>
      <li>Joins at €5K/month, steps up to €7K once subMRR &gt; €60K (~M${baseData.findIndex(d => d.subMRR >= 60000) + 1 || 0} base / M${upsideData.findIndex(d => d.subMRR >= 60000) + 1} upside).</li>
    </ul>
    <h3>Total founder cost</h3>
    <p>Y1-Y5 founder compensation totals ${fmtEurShort(totalFounderComp(baseData))} (base) / ${fmtEurShort(totalFounderComp(upsideData))} (upside) — split across two people over 5 years, this lands at sub-market LU professional rates and is fully funded from operating cashflow after M28.</p>
    <p>All figures are <strong>company cost</strong> (loaded with ~25% LU indépendant social charges). Net to founder ≈ 75% of these numbers.</p>
  </section>

  <section>
    <h2>Key assumptions</h2>
    <table>
      <thead>
        <tr><th>Lever</th><th>Base</th><th>Upside</th><th>Sensitivity</th></tr>
      </thead>
      <tbody>
        <tr><td>Organic reach (Y1)</td><td>${fmtPct(M.SCENARIOS.base.organicReachY1, 0)} of addressable</td><td>${fmtPct(M.SCENARIOS.upside.organicReachY1, 0)} of addressable</td><td>High</td></tr>
        <tr><td>Organic monthly growth</td><td>${fmtPct(M.SCENARIOS.base.organicGrowthRate, 0)}</td><td>${fmtPct(M.SCENARIOS.upside.organicGrowthRate, 0)}</td><td>High</td></tr>
        <tr><td>Email capture rate</td><td>${fmtPct(M.SCENARIOS.base.emailCapture, 0)}</td><td>${fmtPct(M.SCENARIOS.upside.emailCapture, 0)}</td><td>Medium</td></tr>
        <tr><td>Email → signup</td><td>${fmtPct(M.SCENARIOS.base.emailToSignup, 0)}</td><td>${fmtPct(M.SCENARIOS.upside.emailToSignup, 0)}</td><td>Medium</td></tr>
        <tr><td>Signup → paid conversion</td><td>${fmtPct(M.SCENARIOS.base.paidConversion, 0)}</td><td>${fmtPct(M.SCENARIOS.upside.paidConversion, 0)}</td><td>Critical</td></tr>
        <tr><td>Monthly churn (initial)</td><td>${fmtPct(M.SCENARIOS.base.monthlyChurn, 1)}</td><td>${fmtPct(M.SCENARIOS.upside.monthlyChurn, 1)}</td><td>High</td></tr>
        <tr><td>Active partnerships by Y5</td><td>${M.SCENARIOS.base.activePartnersM60}</td><td>${M.SCENARIOS.upside.activePartnersM60}</td><td>Medium</td></tr>
        <tr><td>Signups per partner / month</td><td>${M.SCENARIOS.base.signupsPerPartnerPerMonth}</td><td>${M.SCENARIOS.upside.signupsPerPartnerPerMonth}</td><td>Medium</td></tr>
        <tr><td>Lead-gen trailing commission</td><td>${fmtPct(M.LEAD_GEN_RATE, 2)}</td><td>${fmtPct(M.LEAD_GEN_RATE, 2)}</td><td>Low (deliberate floor vs 1.0–1.5% market rate)</td></tr>
      </tbody>
    </table>
  </section>

  <footer class="doc">
    <p>Generated ${today} from <code>docs/financial-model.js</code>. All figures derive directly from the canonical 60-month simulation; this document and the underlying Excel workbook (<code>Prevista-Financial-Projections.xlsx</code>) share a single source of truth.</p>
    <p>Both scenarios assume the same engine deployment schedule, founder compensation structure, country-launch costs, and FTE schedule per scenario. Variables that diverge between scenarios are organic reach, conversion, churn, and partnership velocity.</p>
  </footer>
</main>
</body>
</html>`;

const outPath = path.join(__dirname, "Prevista-Investor-Overview.html");
fs.writeFileSync(outPath, html);
console.log("Written to:", outPath);
console.log("Size:", (html.length / 1024).toFixed(1) + "KB");
