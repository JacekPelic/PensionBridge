# Vault Feature — Monetization Strategy

## Guiding Principle

**Storage and intelligence are free. Ongoing active management is paid.**

The strategic goal is to maximize the volume of user-uploaded data. Every document a user uploads increases switching cost, improves pension calculation accuracy, and creates upsell opportunities into expert services. Nothing that drives document uploads should sit behind a paywall.

---

## Free Tier

The free tier must deliver the full "aha moment": upload a document, see it extracted, understand your pension situation. A user who can't see what's in their uploaded Vorsorgeausweis has no reason to trust the platform with more documents.

| Feature | Rationale |
|---|---|
| Unlimited document uploads & storage | Data accumulation is more valuable than gatekeeping. Every document deepens lock-in and improves projections. |
| Full AI data extraction | Extraction IS the product. It's how users gain visibility on workplace and personal contributions. Without it, the free tier is a filing cabinet. |
| Document retrieval guides | Step-by-step "How to get it" instructions drive uploads. They're a funnel, not a product. |
| Categorization, search & filters | Organization by category (Career, Pension, Identity, Tax, Correspondence), country, and source type (State, Workplace, Personal). |
| Document preview | Image and PDF preview for uploaded files. |
| Basic status tracking | Simple verified / pending / missing labels. |

---

## Paid Tier — "Vault Pro"

Users graduate to paid when their situation is complex enough that passive visibility isn't enough — which is exactly the cross-border, multi-country user the platform targets.

### 1. Cross-referencing & Discrepancy Alerts

Compares documents against each other and against calculated pension projections. Flags inconsistencies with financial impact.

**What it detects:**

- Date mismatches between employer certificates and career extracts (could cost missing contribution quarters)
- Overlapping contribution periods across countries (double-counting risk)
- Salary discrepancies between employment records and pension calculation assumptions
- EU totalisation period inconsistencies between E205 forms from different countries
- Extracted data that contradicts the pension engine's assumptions

**Output:** Alert card showing what's wrong, which documents conflict, estimated financial impact (e.g., "this could cost you €45/mo at retirement"), and recommended action.

**Upgrade trigger:** Free users see a teaser — "We found a possible discrepancy in your French career extract — upgrade to see details."

---

### 2. Correction Workflow

When a discrepancy is found, the system manages the entire correction process. Fully automated — no human staff required.

**Pipeline:**

```
Discrepancy Detected → Correction Prepared → User Submitted → Awaiting Response → Follow-up Nudge → Resolved
```

| Step | What happens | Who acts |
|---|---|---|
| Discrepancy detected | Cross-referencing flags an issue | System (automated) |
| Correction prepared | Auto-generates pre-filled letter/form in the correct language (FR/DE/EN), with correct institution address and reference numbers | System (automated) |
| User submitted | User sends the letter/form, then clicks "I've submitted this" — date is logged | User |
| Awaiting response | Smart timer starts based on known institution response times | System (automated) |
| Follow-up nudge | If no update after expected window, system generates a follow-up letter template | System (automated) |
| Resolved | User re-uploads corrected document → re-extraction → updated status | User |

**Known institution SLAs:**

| Institution | Expected response time |
|---|---|
| CNAV (France) | 2–3 weeks |
| SVA (Switzerland) | 7–10 business days (postal) |
| CNAP (Luxembourg) | 10–15 business days via guichet.lu |

**Design constraint:** Pension institutions do not have APIs or programmatic status tracking. The system cannot verify whether an institution received or is processing a request. This is a smart reminder system, not a real-time tracker. Users self-report submission and resolution.

---

### 3. Document Age & Expiry Monitoring

Tracks how old each document is and alerts when staleness creates financial risk. This is not a simple expiry date check — it connects document age to external events that make old documents unreliable.

**Staleness triggers:**

**Legislative changes invalidate old extracts:**
- User has a Swiss AHV extract from 2024. In 2026, Switzerland adjusts AVS contribution rates (AVS 22 reform). The old extract shows Scale 21, but updated rates put them on Scale 22. Their projection is off by CHF 140/mo — and they don't know.
- France changes the best-25-years SAM calculation methodology. A 2-year-old Relevé de Carrière doesn't reflect this.
- The system cross-references document dates with legislative changes from the Radar module.

**Documents have legal validity windows:**
- Tax residence certificates are typically valid for 1 fiscal year. A 2025 certificate won't work for 2027 double-taxation claims.
- EU coordination forms (E205) must be current when the user actually claims their pension. A 5-year-old E205 may not include recent contribution periods.
- Employment certificates from dissolved or acquired companies become harder to obtain over time. Early alert: "Get this now before it becomes impossible."

**Annual cycles create refresh opportunities:**
- Vorsorgeausweis is issued annually by the pension fund, typically in Q1. System knows the document date and nudges: "Your fund should have issued a 2025 version — upload it to update your projection by ~CHF 12,000 in capital."

**Life events change document requirements:**
- User changes tax residency from Luxembourg to Portugal (detected from profile data). Luxembourg tax cert becomes irrelevant; Portuguese NHR application is now needed. System flags the document gap.
- Civil status changes affect survivor pension calculations. A 16-year-old marriage certificate prompts: "Is your civil status still current?"

**Cascade effects across documents:**
- User corrects their Luxembourg CNAP extract. But now their French extract is inconsistent — the EU totalisation calculation needs updating. A fresh Relevé de Carrière should be requested. Without monitoring, the user would never connect these dots.

**Alert format:** "Verified ✓ — but this extract is 14 months old and Swiss rates changed. Your projection may be off by CHF 140/mo. Request an updated extract →"

---

### 4. Consolidated Dossier Export

One-click PDF report pulling extracted data from all documents.

**Contents:**
- Pension summary across all countries and source types (State, Workplace, Personal)
- Document inventory with verification status, dates, and categories
- Extracted data highlights per document
- Known gaps and discrepancies
- Country breakdown with projected income

**Use cases:**
- Financial advisor meetings — hand over a complete pension profile in one document
- Mortgage applications — prove expected retirement income
- Relocation planning — show pension entitlements across countries
- Personal records — a single reference document for a complex multi-country situation

---

### 5. Family Vault Sharing

Controlled multi-user access to vault documents. Integrates with existing Family module permission levels.

| Access Level | Can do |
|---|---|
| Full | View, upload, and manage all documents |
| Beneficiary | View pension statements and claim-related documents |
| Emergency | View critical documents only |
| Readonly | View all documents, cannot modify |

**Key use case:** If the pension holder passes away, the family needs immediate access to documents for survivor pension claims. Some claims are time-sensitive — French state pension survivor benefits must be claimed within 12 months, some Swiss workplace pension funds have 6-month deadlines.

---

## Why This Paywall Works

1. **Free tier delivers genuine value.** Users can organize, extract, and understand their pension situation at no cost. This builds trust and engagement before asking for money.

2. **Paywall sits at the right moment.** The upgrade prompt appears when the system finds something — a discrepancy, a stale document, a risk. The user sees the problem exists (teaser) but needs Pro to see the details and act on it.

3. **Paid features have ongoing value.** These aren't one-time features. Documents expire, institutions update records, legislation changes. The pipeline keeps working as long as the user is subscribed. This supports recurring revenue.

4. **Hard to replicate manually.** A user could theoretically cross-check documents themselves — across 3 countries, in 3 languages, with different pension rules and legislative calendars. That's exactly where they'll pay.

5. **Drives upsell into expert services.** When the correction pipeline surfaces issues the user can't resolve themselves (complex gap corrections, cross-border disputes, institutional non-response), that's a natural entry point into the paid expert services module.

---

## Dropped Ideas

| Idea | Why dropped |
|---|---|
| Document upload limits (e.g., 5 free) | Data accumulation is strategically more valuable than gatekeeping. More documents = better projections = higher engagement. |
| Gating AI extraction | Extraction is the core value proposition. Without it, the free tier is a filing cabinet and users churn before seeing value. |
| Gating document retrieval guides | Guides drive uploads. Paywalling them means fewer documents uploaded — the opposite of the strategic goal. |
| Priority concierge processing | No human resources available. All paid features must be fully automated or user-triggered. |
| Real-time institutional tracking | Pension institutions have no APIs. "Acknowledged" and "processing" statuses would be fabricated. Replaced with honest smart reminder system based on known SLAs. |
