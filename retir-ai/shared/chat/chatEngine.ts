export interface ChatResponse {
  text: string;
  suggestions: string[];
}

const PRO_INTENTS = new Set(['gap', 'gap_buyback', 'switzerland', 'freizuegigkeit', 'target', 'retire_65', 'tax']);

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
    text: `Your Swiss pension data so far:\n\n**State pension (AVS/AHV)**\n• ~5.3 insurance years (estimated from dates)\n• Projected: ~€320/month (partial pension)\n• ⚠️ **Not verified** — upload your AHV/AVS extract to confirm\n\n**Workplace pension (BVG/LPP)**\n• ❌ **Not yet tracked**\n• When you left your Swiss employer in Dec 2019, your workplace pension capital should have been transferred to a *Freizügigkeitskonto*\n• This is often the **largest single component** of retirement income\n\n**Action:** Upload your Vorsorgeausweis, or search via *Zentralstelle 2. Säule* (zentralstelle.ch) to locate your assets.`,
    suggestions: ['What is Freizügigkeitskonto?', 'What documents do I need?', 'Show my career timeline']
  },
  freizuegigkeit: {
    text: `A **Freizügigkeitskonto** (vested benefits account) is where your Swiss workplace pension goes when you leave an employer without joining a new Swiss pension fund.\n\nSince you left Switzerland in Dec 2019, your employer's pension fund (likely UBS) would have transferred your accumulated capital to either:\n• A *Freizügigkeitsstiftung* (vested benefits foundation) you chose\n• The *Stiftung Auffangeinrichtung* (substitute institution) if you didn't choose\n\nYour estimated capital: **~€210,000** based on your salary and contribution period.\n\nYou can search for lost accounts at **zentralstelle.ch**.`,
    suggestions: ['Upload my Vorsorgeausweis', 'What documents do I need?', 'Show my career timeline']
  },
  target: {
    text: `Your state pension projection: **€2,520/month** vs goal **€5,500/month** = **−€2,980/month gap**.\n\nBut this gap is partly because we only have state pension data:\n• **Workplace pension & personal savings** → not yet tracked (could add €1,000+/mo)\n• **Transition gap** → −€120/mo (fixable)\n• **Missing period** → unknown impact (14 months with no data)\n\nEven before uploading documents, you can start closing the gap:\n1. **Prévoyance-vieillesse** → +€450/mo (€267/mo contribution)\n2. **Sogelife assurance-vie** → +€550/mo (€400/mo contribution)\n3. **ETF Savings Plan** → +€350/mo (€250/mo contribution)`,
    suggestions: ['Upload documents first', 'Tax implications of each option', 'Show my career timeline']
  },
  documents: {
    text: `No documents uploaded yet. Here's what would unlock the most value:\n\n**Quick win (5 min):**\n• 🇫🇷 *Relevé de Carrière* — download instantly from lassuranceretraite.fr\n\n**High impact:**\n• 🇨🇭 *Vorsorgeausweis* — unlocks your workplace pension, could add €1,000+/mo to your projection\n• 🇨🇭 *AHV/AVS Extract* — verifies your Swiss state pension estimate\n• 🇱🇺 *Extrait de Carrière* — verifies your Luxembourg state pension estimate\n\n**For gap correction:**\n• 🏢 *Employment Certificate* from Swiss employer — needed to fix the Jan–Mar 2020 gap\n\nStart with the French Relevé — it's the fastest and will immediately sharpen your estimate.`,
    suggestions: ['Start with Relevé de Carrière', 'Help me find Swiss workplace pension', 'Show my career timeline']
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
  }
};

export function detectIntent(msg: string): string {
  const lower = msg.toLowerCase();

  // Specific follow-ups
  if (/freiz|vested benefit|what is.*konto/.test(lower)) return 'freizuegigkeit';
  if (/buy.?back|cost.*correction|how much.*fix/.test(lower)) return 'gap_buyback';
  if (/retire.*65|what if.*65|at 65/.test(lower)) return 'retire_65';
  if (/tax|csg|social charge|residency.*analy|where.*retire|net income/.test(lower)) return 'tax';

  // Broad topics
  if (/gap|missing.*month|jan.?mar|2020|contribution gap|missing period/.test(lower)) return 'gap';
  if (/swiss|switzerland|bvg|lpp|avs|ahv|pillar 2|where.*pension|locate|unlocated/.test(lower)) return 'switzerland';
  if (/target|goal|5.?500|shortfall|close.*gap|bridge|compare.*option|strategy/.test(lower)) return 'target';
  if (/document|upload|missing.*doc|certificate|extrait|relevé|vorsorge/.test(lower)) return 'documents';
  if (/retire.*age|when.*retire|64|67|décote|decote|multi.?country|pension.*reform/.test(lower)) return 'retirement_age';

  return 'default';
}

export function getResponse(intent: string, isPro?: boolean): ChatResponse {
  if (!isPro && PRO_INTENTS.has(intent)) {
    return proTeaserResponses[intent] || proTeaserResponses.gap;
  }
  return chatResponses[intent] || chatResponses.default;
}
