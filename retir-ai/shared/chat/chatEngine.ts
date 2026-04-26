export interface ChatResponse {
  text: string;
  suggestions: string[];
}

const PRO_INTENTS = new Set([
  'gap', 'gap_buyback', 'switzerland', 'freizuegigkeit', 'target', 'retire_65', 'tax',
  // Country-specific P2/P3 product escalations from the "Stuck?" CTA:
  'agirc_arrco', 'lu_rcp', 'fr_per', 'ch_3a', 'lu_prevoyance', 'stuck',
]);

const proTeaserResponses: Record<string, ChatResponse> = {
  gap: {
    text: `I've detected **contribution gaps** in your career data that may be affecting your pension projection.\n\nUpgrade to **Pro** to see the full gap analysis — including financial impact per gap and whether they're correctable.`,
    suggestions: ['What documents am I missing?', 'Is retiring at 64 safe?'],
  },
  gap_buyback: {
    text: `There may be a **voluntary buy-back option** available to recover lost pension income from your career gaps.\n\nUpgrade to **Pro** to see the cost-benefit analysis and step-by-step instructions.`,
    suggestions: ['What documents am I missing?', 'Is retiring at 64 safe?'],
  },
  switzerland: {
    text: `I have information about your **Swiss pension situation** — including your AVS/AHV status and workplace pension tracking.\n\nUpgrade to **Pro** for personalised analysis of your Swiss pension across all pillars.`,
    suggestions: ['What documents am I missing?', 'Is retiring at 64 safe?'],
  },
  freizuegigkeit: {
    text: `I can explain how **vested benefits accounts** work and help you locate potentially dormant Swiss workplace pension assets.\n\nUpgrade to **Pro** for personalised guidance based on your career history.`,
    suggestions: ['What documents am I missing?', 'Is retiring at 64 safe?'],
  },
  target: {
    text: `I can break down your **income gap** and show specific strategies to close it — including product recommendations and contribution scenarios.\n\nUpgrade to **Pro** to access your personalised gap-closing analysis.`,
    suggestions: ['What documents am I missing?', 'Is retiring at 64 safe?'],
  },
  retire_65: {
    text: `Retiring at **65 vs 64** has significant implications across your 3 countries — including potential décote avoidance and higher Swiss benefits.\n\nUpgrade to **Pro** for a detailed year-by-year comparison based on your data.`,
    suggestions: ['Is retiring at 64 safe?', 'What documents am I missing?'],
  },
  tax: {
    text: `Your tax situation at retirement depends on where you're **tax resident** — and with pension income from 3 countries, the differences can be substantial.\n\nUpgrade to **Pro** to see a personalised tax comparison across residence countries.`,
    suggestions: ['What documents am I missing?', 'Is retiring at 64 safe?'],
  },
  agirc_arrco: {
    text: `**Agirc-Arrco** is the French complementary workplace pension — nearly every private-sector employee has one.\n\nUpgrade to **Pro** to get personalised help retrieving your statement (including via FranceConnect workarounds if you've left France).`,
    suggestions: ['What documents am I missing?', 'What is my LU RCP?'],
  },
  lu_rcp: {
    text: `**Luxembourg RCP** (employer pension under LPFP 1999) is often the second-largest slice of a LU resident's retirement — but plans are administered by different insurers per employer.\n\nUpgrade to **Pro** and we'll help you identify your plan provider and request a statement on your behalf.`,
    suggestions: ['What documents am I missing?', 'Is retiring at 64 safe?'],
  },
  fr_per: {
    text: `The French **PER** replaced PERP/Madelin in 2019 — but legacy plans often still sit with old insurers.\n\nUpgrade to **Pro** to trace and consolidate all your French retirement savings with personalised step-by-step guidance.`,
    suggestions: ['What documents am I missing?', 'What is my LU RCP?'],
  },
  ch_3a: {
    text: `Swiss **Pillar 3a** accounts can be split across up to 5 providers — easy to lose track of, and withdrawal timing drives the tax bill.\n\nUpgrade to **Pro** for a consolidated view of your 3a accounts and a staggered-withdrawal plan tailored to your retirement residency.`,
    suggestions: ['What documents am I missing?', 'Tax implications of each option'],
  },
  lu_prevoyance: {
    text: `Luxembourg **prévoyance-vieillesse** (Art. 111bis LIR) gives €3,200/yr tax deduction — but contract terms and early-exit clauses vary widely.\n\nUpgrade to **Pro** to review whether your current contract still fits your residency plans.`,
    suggestions: ['Tax implications of each option', 'What documents am I missing?'],
  },
  stuck: {
    text: `Getting pension records across multiple countries is genuinely hard, and sometimes the self-service routes don't work.\n\nUpgrade to **Pro** to chat with a pension advisor — we'll help you find a workaround or do it on your behalf.`,
    suggestions: ['What documents am I missing?', 'Is retiring at 64 safe?'],
  },
};

const chatResponses: Record<string, ChatResponse> = {
  gap: {
    text: `Good question, Mats. I've found **2 gaps** in your imported career data:\n\n**1. Jan–Mar 2020 (3 months)**\nBetween your Swiss period (ended Dec 2019) and your Luxembourg period (started Apr 2020). Impact: **−€120/month** at retirement.\n\n**2. Aug 2013 – Aug 2014 (14 months)**\nBetween your two French employment periods. We don't have any data for this time — were you working, studying, or abroad?\n\nThe Luxembourg gap can potentially be fixed via CNAP voluntary buy-back (~€1,200). Adding the missing period would improve your estimate.`,
    suggestions: ['Add missing period', 'How much would the buy-back cost?', 'Show my career timeline']
  },
  gap_buyback: {
    text: `The Luxembourg CNAP buy-back for your 3-month gap (Jan–Mar 2020) would cost approximately **€1,200** as a one-time payment.\n\nIn return, you'd recover **€120/month** in pension income — that's **€43,200 over 30 years** of retirement.\n\nThe process involves filing a *demande de rachat* with CNAP in French, providing proof of the transition period, and paying within 60 days of approval.\n\nThis is one of the **highest ROI corrections** available in your profile.`,
    suggestions: ['Show my career timeline', 'What about the French gap?', 'What documents do I need?']
  },
  switzerland: {
    text: `Your Swiss pension data so far:\n\n**State pension (AVS/AHV)**\n• ~5.3 insurance years (estimated from dates)\n• Projected: ~€320/month (partial pension)\n• ⚠️ **Not verified** — upload your AHV/AVS extract to confirm\n\n**Workplace pension (BVG/LPP)**\n• ✅ **Tracked** — Vorsorgeausweis values in your picture: CHF 210,000 vested / CHF 12,480 projected annuity / CHF 85,000 insured salary\n• Current projection: **~€860/month** at retirement (≈ lump-sum equivalent annuitised)\n• Recommended follow-up: confirm whether any **Freizügigkeit** capital also sits at a former employer's foundation\n\n**Action:** Upload your latest Vorsorgeausweis to verify the figures, and check *Zentralstelle 2. Säule* (zentralstelle.ch) for any dormant vested benefits.`,
    suggestions: ['What is Freizügigkeitskonto?', 'What documents do I need?', 'Show my career timeline']
  },
  freizuegigkeit: {
    text: `A **Freizügigkeitskonto** (vested benefits account) is where your Swiss workplace pension goes when you leave an employer without joining a new Swiss pension fund.\n\nYour active Swiss BVG is already tracked in your picture (CHF 210,000 vested). But a separate **Freizügigkeit** may also exist from an earlier Swiss employer — that capital compounds silently until you claim it.\n\nTo trace any forgotten capital:\n• Search **zentralstelle.ch** using your AHV number (free, official)\n• If nothing shows up, call **Auffangeinrichtung BVG** at +41 41 799 75 75 — unclaimed vested benefits default there\n\nConsolidating everything gives you the full Swiss P2 picture.`,
    suggestions: ['Upload my Vorsorgeausweis', 'What documents do I need?', 'Show my career timeline']
  },
  target: {
    text: `Your combined projection so far: **€3,840/month** gross (state + tracked workplace + private savings) vs goal **€5,500/month** = **−€1,660/month gap**.\n\nWhat we already know:\n• **State pensions** (LU + FR + CNAV) → ~€2,520/mo\n• **Workplace pensions** — Swiss BVG (~€860/mo) and French Agirc-Arrco (~€420/mo) are tracked\n• **Personal savings** → €85,000 balance + €600/mo contributions\n\nOpen levers to close the gap:\n• **Luxembourg RCP** — if your employer runs a plan, that's often €500–2,500/mo on top\n• **Transition gap** → −€120/mo (fixable via CNAP buy-back)\n• **Missing French period** (14 months, 2013–2014) → unknown impact\n\nOr top up private savings:\n1. **Luxembourg prévoyance-vieillesse** → ~€450/mo at retirement (€267/mo contribution, tax-deductible)\n2. **Assurance-vie** → ~€550/mo (€400/mo contribution)\n3. **ETF savings plan** → ~€350/mo (€250/mo contribution)`,
    suggestions: ['What is my LU RCP?', 'Tax implications of each option', 'Show my career timeline']
  },
  documents: {
    text: `No documents uploaded yet — but you already have manual values in your picture. Uploading the originals lets us verify and replace estimates with engine-calculated figures.\n\n**Quick win (5 min):**\n• 🇫🇷 *Relevé de Carrière* — download instantly from lassuranceretraite.fr (verifies your CNAV state pension)\n\n**High impact:**\n• 🇨🇭 *Vorsorgeausweis* — verifies your tracked Swiss BVG figures\n• 🇨🇭 *AHV/AVS Extract* — verifies your Swiss state pension estimate\n• 🇱🇺 *Extrait de Carrière* — verifies your Luxembourg state pension estimate\n\n**Still unlocks new income:**\n• 🇱🇺 Luxembourg **RCP statement** from your employer — not yet tracked, often adds €500–2,500/mo\n• 🇨🇭 **Freizügigkeit** statement — if any former Swiss employer's capital is sitting dormant\n\n**For gap correction:**\n• 🏢 *Employment Certificate* from Swiss employer — needed to fix the Jan–Mar 2020 gap\n\nStart with the French Relevé — it's the fastest and will immediately sharpen your estimate.`,
    suggestions: ['Start with Relevé de Carrière', 'What is my LU RCP?', 'Show my career timeline']
  },
  retirement_age: {
    text: `**Critical topic for multi-country careers.**\n\n🇫🇷 **France:** Legal age **64** (post-2023 reform). Full-rate requires 172 trimestres.\n\n⚠️ If you claim at 64 without enough trimestres, France applies a **permanent décote** (0.625%/trimestre penalty). **Irreversible.**\n\n🇨🇭 **Switzerland:** Standard age **65** for men.\n\n🇱🇺 **Luxembourg:** Standard age **65**.\n\nWe need your Relevé de Carrière from CNAV to calculate your exact trimestres. **Do NOT file for French pension without this analysis.**`,
    suggestions: ['What if I retire at 65?', 'What documents do I need?', 'Show retirement simulation']
  },
  retire_65: {
    text: `Retiring at **65 instead of 64** has significant advantages for your profile:\n\n🇫🇷 **France:** One extra year of contributions = ~4 additional trimestres. This could mean the difference between a décote penalty and full rate. Impact: **+€200–400/month for life**.\n\n🇨🇭 **Switzerland:** You'd reach the standard AVS age (65). No early withdrawal reduction.\n\n🇱🇺 **Luxembourg:** Standard age is 65, so you'd claim on time.\n\nThe trade-off: one fewer year of receiving pension payments. But for your situation, the **avoided décote alone likely makes 65 the better choice**.\n\nWant a detailed year-by-year comparison?`,
    suggestions: ['Show the simulation page', 'What about retiring at 63?', 'What documents do I need?']
  },
  tax: {
    text: `Tax implications depend heavily on where you're tax resident at retirement:\n\n🇫🇷 **France (current residence):**\n• Progressive income tax (0–45%) + 9.1% social charges (CSG/CRDS)\n• Your ~€3,840/mo pension → ~€740/mo in taxes = **€3,100 net**\n\n🇵🇹 **Portugal (NHR regime):**\n• Flat 10% on foreign pension income\n• Same pension → ~€384/mo in taxes = **€3,456 net** (+€356/mo vs France)\n\n🇨🇭 **Switzerland:**\n• Lower rates but higher cost of living. PPP-adjusted: roughly equal to France.\n\nThis is genuinely complex with 3 source countries. Check the Retirement Simulation page for a detailed comparison.`,
    suggestions: ['View the simulation page', 'How does the Swiss workplace pension lump sum get taxed?', 'What documents do I need?']
  },
  default: {
    text: `Based on your career across France, Switzerland, and Luxembourg, I can help with:\n\n• **Career gaps** — 2 detected, 1 fixable via buy-back\n• **Country-specific rules** — retirement ages, trimestres, AVS\n• **Document guidance** — what to upload and how to get it\n• **Income optimization** — closing the gap to your €5,500 goal\n\nWhat would you like to explore?`,
    suggestions: ['Explain my pension gaps', 'How does Swiss pension work?', 'What documents am I missing?']
  },
  agirc_arrco: {
    text: `**Agirc-Arrco — tracing your French complementary pension**\n\nYou should have a points statement ("relevé de points") available online at agirc-arrco.fr.\n\n**If you can't sign in:**\n1. Use FranceConnect (same credentials as impots.gouv.fr or lassuranceretraite.fr).\n2. If FranceConnect is broken, create a direct account at agirc-arrco.fr with your numéro fiscal + personal details.\n3. If you've left France and no longer have active credentials, request by post to: Agirc-Arrco, 16-18 rue Jules César, 75592 Paris Cedex 12.\n\n**Good news:** all your French private-sector employments feed into the same account — one statement covers everything. Points accumulated keep earning revaluation each year.`,
    suggestions: ['What documents am I missing?', 'Help me retrieve my PER']
  },
  lu_rcp: {
    text: `**Identifying your Luxembourg employer pension (RCP)**\n\n**Step 1 — Check payroll.** Your annual salary statement ("décompte annuel") shows RCP employer contributions. If nothing's listed, your employer may not run a plan.\n\n**Step 2 — Ask HR.** They'll direct you to the provider. Common LU RCP administrators: Foyer, AXA, Swiss Life, Vitis Life, Generali, Cardif Lux Vie.\n\n**Step 3 — If you've left the employer:** vested rights stay with the provider. Contact them with your 13-digit matricule. Request "reconstitution des droits acquis".\n\n**Step 4 — If HR is unresponsive:** contact CCSS (+352 40 141-1) — they can confirm whether contributions were declared on your behalf.\n\nEmployer contribution rates typically range 4–12% of salary. With €85–95k salary over 6 years, a projected lump sum of €35–90k is plausible.`,
    suggestions: ['What documents am I missing?', 'Tax implications of each option']
  },
  fr_per: {
    text: `**Finding and consolidating your French retirement savings**\n\nSince 2019 the PER replaced PERP, Madelin, and Préfon. But legacy plans often still sit with old insurers.\n\n**To trace:**\n1. Log in to your current bank / insurer — look for "Plan d'Épargne Retraite" in your products.\n2. Check the **ciclade.fr** service for dormant contracts (French government free search).\n3. Review your tax returns from 2015–2018 — PERP/Madelin deductions were declared under specific lines; the provider name appears.\n\n**To consolidate:** you can transfer a PERP/Madelin into a PER individuel at a cheaper provider (BoursoBank, Linxea, Yomoni). Gives you flexibility at retirement (capital option, not just annuity).`,
    suggestions: ['What documents am I missing?', 'Tax implications of each option']
  },
  ch_3a: {
    text: `**Consolidating your Swiss Pillar 3a accounts**\n\nYou can hold up to 5 separate 3a accounts. Common culprits for "forgotten" 3a: old bank accounts from before switching to a digital provider (VIAC, Finpension, Frankly).\n\n**To trace:**\n1. Check every Swiss bank where you've had a main account — each usually sold you a 3a product when you opened.\n2. Request an "attestation 3a" from each provider for the last closed tax year.\n\n**Staggered withdrawal strategy:** splitting withdrawal across 2–3 tax years reduces lump-sum tax. If you have 1 large account, you can transfer part to a second foundation to enable staggering. Must be done **before** the first withdrawal.\n\nIf you've left Switzerland, withdrawal is possible but timing + cantonal residence on the withdrawal date determine the tax rate.`,
    suggestions: ['Tax implications of each option', 'What documents am I missing?']
  },
  lu_prevoyance: {
    text: `**Reviewing your Luxembourg prévoyance-vieillesse (Art. 111bis LIR)**\n\n**Key levers on any contract:**\n• **Deduction cap:** €3,200/yr per spouse. Fully deductible from taxable income.\n• **Term:** minimum 10 years, must run to age 60+.\n• **Payout:** at least 50% as annuity (taxed at 50% of standard rate); up to 50% as tax-free lump sum.\n\n**Residency risk flags:**\n• If you leave LU before payout, the contract stays — but some insurers apply punitive fees on cross-border encashment.\n• Tax treatment in your new residence country may not match LU's favourable regime. Check the Tax simulation page for France vs Portugal vs LU comparisons.\n\n**Providers:** Foyer, Swiss Life, AXA, LaLux, Cardif Lux Vie, BIL, ING. Most contracts have a 10-year lock-in.`,
    suggestions: ['Tax implications of each option', 'What documents am I missing?']
  },
  stuck: {
    text: `Some pension records are genuinely difficult to retrieve — especially across borders, decades, and language barriers.\n\nTell me which document or institution is blocking you. Include:\n• Country + pension type (state / workplace / personal)\n• What you've already tried\n• Any account numbers, employer names, or credentials you still have\n\nI'll point you to the right workaround.`,
    suggestions: ['What documents am I missing?', 'Explain my pension gaps']
  }
};

export function detectIntent(msg: string): string {
  const lower = msg.toLowerCase();

  // Country-specific products (P2/P3) — placed early so they win over broader matches.
  if (/agirc|arrco/.test(lower)) return 'agirc_arrco';
  if (/rcp|luxembourg employer|lu employer pension|employer pension/.test(lower)) return 'lu_rcp';
  if (/\bper\b|perp|madelin|plan d.?\u00e9pargne retraite|pargne retraite/.test(lower)) return 'fr_per';
  if (/pr\u00e9voyance|prevoyance|111bis|art\.? 111|art 111/.test(lower)) return 'lu_prevoyance';
  if (/\b3a\b|s\u00e4ule|saule|pillar 3a/.test(lower)) return 'ch_3a';

  // Specific follow-ups
  if (/freiz|vested benefit|what is.*konto/.test(lower)) return 'freizuegigkeit';
  if (/buy.?back|cost.*correction|how much.*fix/.test(lower)) return 'gap_buyback';
  if (/retire.*65|what if.*65|at 65/.test(lower)) return 'retire_65';
  if (/tax|csg|social charge|residency.*analy|where.*retire|net income/.test(lower)) return 'tax';

  // Broad topics
  if (/gap|missing.*month|jan.?mar|2020|contribution gap|missing period/.test(lower)) return 'gap';
  if (/swiss|switzerland|bvg|lpp|avs|ahv|pillar 2|where.*pension|locate|unlocated|vorsorge/.test(lower)) return 'switzerland';
  if (/target|goal|5.?500|shortfall|close.*gap|bridge|compare.*option|strategy/.test(lower)) return 'target';
  if (/document|upload|missing.*doc|certificate|extrait|relev\u00e9|releve/.test(lower)) return 'documents';
  if (/retire.*age|when.*retire|64|67|d\u00e9cote|decote|multi.?country|pension.*reform/.test(lower)) return 'retirement_age';

  // Last-ditch: any "stuck" phrasing that didn't match above.
  if (/stuck|trouble|can.?t access|can.?t find|blocked|help me trace|help me find|help me retrieve|workaround/.test(lower)) {
    return 'stuck';
  }

  return 'default';
}

export function getResponse(intent: string, isPro?: boolean): ChatResponse {
  if (!isPro && PRO_INTENTS.has(intent)) {
    return proTeaserResponses[intent] || proTeaserResponses.gap;
  }
  return chatResponses[intent] || chatResponses.default;
}
