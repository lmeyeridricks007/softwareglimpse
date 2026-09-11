# SoftwareGlimpse — organic search growth baseline (PRE-GROWTH)

Estate remediation is complete. This file is the **PRE-GROWTH** measurement snapshot plus the first existing-URL growth wave. It is **not** a new site-wide SEO score and **not** a new estate audit.

HANDS_ON remains **0 / NOT_CURRENT_SCOPE**. No first-hand testing is claimed.

**Do not attribute the GSC totals below to the latest remediation.** That work landed after this reporting window.

---

## GSC data-through date

**2026-09-03** (Last 12 months: 2025-09-04 → 2026-09-03)

Source: `docs/migration/data/gsc-export.json` (imported 2026-09-05). Opportunity engine 3.1.0 scored 122 eligible INDEXABLE rollups. Queue: `data/growth/organic-growth-queue.json`.

### Site totals (PRE-GROWTH)

| Metric | Value |
| --- | ---: |
| Clicks | **124** |
| Impressions | **361167** |
| CTR | **0.0343%** |
| Weighted position | **~69** |

### Page × query evidence

**Unavailable.** GSC export is Pages + Queries tabs separately (`rawPageQueryRows: 0`, `pagesWithDirectQuery: 0`). Live GSC API client is not implemented (`src/services/seo/providers/gsc-provider.ts`).

Query mapping used here: **page-level only**. No invented query-to-URL maps. Query-scoped title/H1 rewrites were **not** applied.

---

## Band definitions (existing INDEXABLE URLs only)

Scored from real GSC page metrics plus commercial intent, content quality, data quality, and authority opportunity. Legal, newsletter, and search URLs were excluded.

| Band | Rule |
| --- | --- |
| **A** | Position 4–20, impressions ≥ 25 |
| **B** | Position 21–40, impressions ≥ 80 |
| **C** | Position 41–70, impressions ≥ 400 |
| **D** | Impressions ≥ 80 and CTR well below expected for position (overlay; overlaps A/B/C) |
| **E** | Commercial paths with 15–79 impressions, not already in A/B/C |

No new URLs were created. SEMANTICALLY_BLOCKED / IMPROVE pages were not forced to INDEXABLE.

---

## Band A URLs (3)

| URL | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| `/company/my-story/` | 1 | 104 | 0.9615% | 7.2 |
| `/for/startups/` | 1 | 41 | 2.439% | 17.1 |
| `/guides/what-is-ai-software/` | 0 | 82 | 0% | 7.9 |

Highest CTR gap: `/guides/what-is-ai-software/` (position ~8, **0 clicks**).

---

## Band B URLs (10)

| URL | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| `/software/fastmail/` | 9 | 2275 | 0.3956% | 23.5 |
| `/compare/livechat-vs-tidio/` | 0 | 138 | 0% | 27.6 |
| `/software/shore/` | 0 | 345 | 0% | 22.9 |
| `/software/affinity/` | 0 | 225 | 0% | 34.5 |
| `/software/miocommerce/` | 0 | 653 | 0% | 23.6 |
| `/compare/chatgpt-vs-writesonic/` | 0 | 220 | 0% | 39.7 |
| `/guides/` | 0 | 144 | 0% | 33.2 |
| `/` | 4 | 282 | 1.4184% | 27.9 |
| `/software/folk/` | 1 | 484 | 0.2066% | 36.6 |
| `/software/diginius/` | 0 | 1044 | 0% | 37.4 |

Homepage CTR **beats** expected CTR at position ~28. Title was left unchanged.

---

## Band C URLs (30)

| URL | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| `/categories/ai/` | 7 | 1520 | 0.4605% | 49.8 |
| `/industries/music/` | 1 | 1178 | 0.0849% | 49.3 |
| `/compare/salesforce-vs-siebel/` | 1 | 981 | 0.1019% | 52.8 |
| `/compare/salesforce-vs-sugarcrm/` | 0 | 916 | 0% | 58.3 |
| `/compare/marketo-vs-salesforce/` | 0 | 632 | 0% | 67.9 |
| `/categories/ecommerce/` | 0 | 751 | 0% | 42.7 |
| `/categories/crm/` | 3 | 7172 | 0.0418% | 61.6 |
| `/categories/marketing/` | 1 | 4232 | 0.0236% | 52.7 |
| `/software/getresponse/` | 1 | 4143 | 0.0241% | 61.0 |
| `/software/hubspot/` | 0 | 2880 | 0% | 67.0 |
| `/software/krispcall/` | 4 | 1266 | 0.316% | 48.0 |
| `/software/closely/` | 2 | 1059 | 0.1889% | 41.1 |
| `/compare/insightly-vs-salesforce/` | 0 | 451 | 0% | 56.2 |
| `/compare/hubspot-vs-insightly/` | 0 | 411 | 0% | 64.9 |
| `/compare/oracle-cx-vs-salesforce/` | 0 | 410 | 0% | 53.8 |
| `/software/freshsales/` | 0 | 1199 | 0% | 59.4 |
| `/software/close/` | 1 | 881 | 0.1135% | 54.9 |
| `/software/nimble/` | 1 | 830 | 0.1205% | 67.9 |
| `/software/netsuite/` | 0 | 508 | 0% | 66.7 |
| `/software/capsule/` | 1 | 1482 | 0.0675% | 51.0 |
| `/use-cases/lead-management/` | 0 | 835 | 0% | 69.8 |
| `/software/cloze/` | 0 | 429 | 0% | 57.9 |
| `/software/keap/` | 0 | 2295 | 0% | 64.8 |
| `/software/sanebox/` | 0 | 1593 | 0% | 59.3 |
| `/software/kaspr/` | 0 | 1460 | 0% | 55.1 |
| `/software/navan/` | 0 | 1360 | 0% | 52.5 |
| `/software/lusha/` | 1 | 1068 | 0.0936% | 59.7 |
| `/guides/what-is-crm/` | 1 | 716 | 0.1397% | 56.2 |
| `/software/nicejob/` | 0 | 988 | 0% | 58.0 |
| `/industries/security-companies/` | 2 | 462 | 0.4329% | 51.9 |

---

## Band D URLs (78)

Overlay of high-impression pages with unusually poor CTR. Many also sit in A/B/C. Deep industry hubs at positions ~80–88 are listed for measurement, not for guessed-keyword rewrites.

| URL | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| `/compare/livechat-vs-tidio/` | 0 | 138 | 0% | 27.6 |
| `/software/shore/` | 0 | 345 | 0% | 22.9 |
| `/software/affinity/` | 0 | 225 | 0% | 34.5 |
| `/software/miocommerce/` | 0 | 653 | 0% | 23.6 |
| `/compare/chatgpt-vs-writesonic/` | 0 | 220 | 0% | 39.7 |
| `/guides/` | 0 | 144 | 0% | 33.2 |
| `/compare/crisp-vs-tidio/` | 0 | 172 | 0% | 44.3 |
| `/company/my-story/` | 1 | 104 | 0.9615% | 7.2 |
| `/compare/keap-vs-salesforce/` | 0 | 117 | 0% | 48.5 |
| `/compare/salesforce-vs-sugarcrm/` | 0 | 916 | 0% | 58.3 |
| `/compare/marketo-vs-salesforce/` | 0 | 632 | 0% | 67.9 |
| `/software/writesonic/` | 0 | 95 | 0% | 65.2 |
| `/compare/hubspot-vs-monday-sales-crm/` | 0 | 807 | 0% | 74.8 |
| `/categories/ecommerce/` | 0 | 751 | 0% | 42.7 |
| `/guides/what-is-tidio/` | 0 | 237 | 0% | 41.8 |
| `/categories/marketing/` | 1 | 4232 | 0.0236% | 52.7 |
| `/software/getresponse/` | 1 | 4143 | 0.0241% | 61.0 |
| `/software/hubspot/` | 0 | 2880 | 0% | 67.0 |
| `/compare/pipedrive-vs-salesforce/` | 0 | 1386 | 0% | 73.4 |
| `/software/diginius/` | 0 | 1044 | 0% | 37.4 |
| `/compare/insightly-vs-salesforce/` | 0 | 451 | 0% | 56.2 |
| `/compare/hubspot-vs-insightly/` | 0 | 411 | 0% | 64.9 |
| `/compare/oracle-cx-vs-salesforce/` | 0 | 410 | 0% | 53.8 |
| `/compare/tidio-vs-zendesk/` | 0 | 100 | 0% | 51.7 |
| `/software/freshsales/` | 0 | 1199 | 0% | 59.4 |
| `/compare/hubspot-vs-pipedrive/` | 0 | 825 | 0% | 76.1 |
| `/compare/freshsales-vs-hubspot/` | 0 | 274 | 0% | 62.8 |
| `/compare/act-vs-salesforce/` | 0 | 228 | 0% | 63.2 |
| `/compare/hubspot-vs-keap/` | 0 | 225 | 0% | 65.1 |
| `/compare/pega-vs-salesforce/` | 0 | 204 | 0% | 58.1 |
| `/use-cases/analytics/` | 0 | 980 | 0% | 79.0 |
| `/use-cases/prospecting/` | 0 | 695 | 0% | 76.1 |
| `/compare/monday-sales-crm-vs-salesforce/` | 0 | 523 | 0% | 72.0 |
| `/software/netsuite/` | 0 | 508 | 0% | 66.7 |
| `/compare/` | 0 | 505 | 0% | 70.4 |
| `/industries/solar/` | 0 | 2743 | 0% | 86.6 |
| `/industries/private-equity/` | 0 | 2736 | 0% | 83.9 |
| `/industries/event-management/` | 0 | 2190 | 0% | 87.8 |
| `/for/freelancers/` | 0 | 912 | 0% | 83.7 |
| `/use-cases/lead-management/` | 0 | 835 | 0% | 69.8 |
| `/software/copper/` | 0 | 788 | 0% | 75.6 |
| `/software/cloze/` | 0 | 429 | 0% | 57.9 |
| `/software/wealthbox/` | 0 | 266 | 0% | 53.3 |
| `/industries/plumbing/` | 0 | 3187 | 0% | 86.5 |
| `/industries/venture-capital/` | 0 | 1464 | 0% | 80.9 |
| `/industries/coaching/` | 0 | 1368 | 0% | 86.9 |
| `/industries/photography/` | 0 | 1213 | 0% | 81.5 |
| `/industries/nonprofit/` | 0 | 1153 | 0% | 80.9 |
| `/software/salesforce/` | 0 | 761 | 0% | 78.2 |
| `/software/agile-crm/` | 0 | 573 | 0% | 71.9 |
| `/software/apptivo/` | 0 | 211 | 0% | 64.0 |
| `/software/sugarcrm/` | 0 | 160 | 0% | 60.4 |
| `/guides/what-is-ai-software/` | 0 | 82 | 0% | 7.9 |
| `/software/keap/` | 0 | 2295 | 0% | 64.8 |
| `/industries/investor-relations/` | 0 | 980 | 0% | 86.8 |
| `/industries/web-design/` | 0 | 864 | 0% | 81.2 |
| `/industries/engineering/` | 0 | 780 | 0% | 72.1 |
| `/software/pipedrive/` | 0 | 503 | 0% | 84.2 |
| `/software/podio/` | 0 | 344 | 0% | 55.6 |
| `/software/sanebox/` | 0 | 1593 | 0% | 59.3 |
| `/software/kaspr/` | 0 | 1460 | 0% | 55.1 |
| `/software/navan/` | 0 | 1360 | 0% | 52.5 |
| `/software/dynamics-365/` | 0 | 1074 | 0% | 75.4 |
| `/capabilities/sms-messaging/` | 0 | 961 | 0% | 87.7 |
| `/software/mailchimp/` | 0 | 286 | 0% | 63.2 |
| `/software/pipelinepro/` | 0 | 219 | 0% | 66.5 |
| `/compare/netsuite-vs-salesforce/` | 0 | 131 | 0% | 81.7 |
| `/software/nicejob/` | 0 | 988 | 0% | 58.0 |
| `/guides/zoho-crm-setup/` | 0 | 209 | 0% | 61.4 |
| `/use-cases/field-sales/` | 0 | 207 | 0% | 64.6 |
| `/software/activecampaign/` | 0 | 2407 | 0% | 78.3 |
| `/software/monday-sales-crm/` | 0 | 234 | 0% | 74.0 |
| `/industries/construction/` | 0 | 160 | 0% | 76.6 |
| `/industries/legal-services/` | 0 | 86 | 0% | 66.9 |
| `/industries/retail-ecommerce/` | 0 | 560 | 0% | 84.3 |
| `/guides/crm-data-migration/` | 0 | 351 | 0% | 80.0 |
| `/best/marketing-software/` | 0 | 117 | 0% | 80.5 |
| `/compare/salesforce-vs-sap/` | 0 | 171 | 0% | 84.0 |

## Band E URLs (16) — beginning commercial impressions

Watch only in this wave (compare SERP titles still benefit from the platform differentiator).

`/compare/hubspot-vs-tidio/`, `/compare/hubspot-vs-zendesk/`, `/compare/chatgpt-vs-github-copilot/`, `/compare/hubspot-vs-marketo/`, `/compare/activecampaign-vs-hubspot/`, `/compare/salesforce-vs-zoho-crm/`, `/compare/hubspot-vs-zoho-crm/`, `/compare/cpanel-vs-siteground/` (IMPROVE — not promoted), `/compare/salesforce-vs-zendesk/`, `/software/pega/`, `/software/tidio/`, `/industries/education/`, `/compare/hubspot-vs-pardot/`, `/compare/hubspot-vs-mailchimp/`, `/compare/clay-vs-outreach/`, `/compare/saleor-vs-shopify/`.

---

## Pages actually improved

Page-level and platform changes supported by existing verdicts, seed SEO, or criterion wins — **not** guessed keywords.

### Band A

| URL | Change |
| --- | --- |
| `/company/my-story/` | Title → `Why SoftwareGlimpse Exists` |
| `/for/startups/` | Title → `CRM for Startups: Speed, Adoption, Room to Grow` |
| `/guides/what-is-ai-software/` | Title → `What Is AI Software? Jobs, Not One Ranking` |

CRM hub **explore path** now points at `/for/startups/` (type card still `/categories/crm/startup/` so that subcategory is not orphaned).

### Software reviews (Band B/C/D)

Titles/descriptions rewritten from existing editorial verdicts. Generic “Pricing, Features, Pros & Cons” / “review on SoftwareGlimpse” SERP copy replaced with buyer-job hooks.

`activecampaign`, `affinity`, `agile-crm`, `apptivo`, `cloze`, `copper`, `diginius`, `dynamics-365`, `fastmail`, `folk`, `freshsales`, `getresponse`, `hubspot`, `kaspr`, `keap`, `mailchimp`, `miocommerce`, `monday-sales-crm`, `navan`, `netsuite`, `nicejob`, `pipedrive`, `pipelinepro`, `podio`, `salesforce`, `sanebox`, `shore`, `sugarcrm`, `wealthbox`, `writesonic`.

`/software/writesonic/` — `seo.indexable` set **true** (approved review, already receiving GSC impressions).

### Hubs / guides

| URL | Change |
| --- | --- |
| `/guides/` | Title → `Software Buying Guides: Choose, Compare, Decide` |
| `/categories/ai/` | Seed title now used in metadata: `AI Software: Pick the Job, Not One Ranking` |
| `/categories/marketing/` | Seed title now used: `Marketing Software: Job Fit Before Brand Lists` |
| `/categories/crm/` | Existing seed title `CRM Software: Choose by Job Fit, Not Brand Lists` now used (was unused; metadata previously emitted the short display name) |
| `/categories/ecommerce/` | Same metadata fix — existing seed title used when it is a real SERP hook |

### Comparisons (platform — all generic A vs B titles)

`buildSeo` now rebuilds bare `A vs B` / “Which Is Better?” titles from criterion **winBits**, and replaces generic “Compare X and Y on SoftwareGlimpse” descriptions with the decision summary. Word-boundary clip at 70 / 160. Applies to Band B/D compares such as `/compare/livechat-vs-tidio/` and `/compare/chatgpt-vs-writesonic/` without inventing queries.

### Authority

39 contextual internal links from category hubs, best pages, research, tools, product reviews, and same-cluster guides. 48 industry-template injections (`Industry page → contextual resource` to unrelated products) were **rejected** as not legitimate.

---

## Pages unchanged due to insufficient query evidence

- **All query-scoped title/H1 rewrites** — no DIRECT_GSC page×query matrix.
- **`/`** — 4 clicks / 282 impressions at pos 27.9; CTR already beats expected. No title churn.
- **`/guides/what-is-tidio/`** — IMPROVE; not promoted.
- **`/compare/cpanel-vs-siteground/`** — IMPROVE; not promoted.
- **Industry hubs at positions ~80–88** (`/industries/plumbing/`, `/industries/solar/`, `/industries/private-equity/`, etc.) — high impressions, no DIRECT_GSC queries, no evidence-backed SERP hook.
- **`/compare/` hub**, **`/capabilities/sms-messaging/`**, deep use-case pages without a repository-controlled differentiator beyond existing templates.
- Partner-less products: **no invented affiliate URLs**.

---

## Pages with commercial improvements

Inspected affiliate destinations for high-visibility software. Partner URL already present (CTA via existing `resolveAffiliateLink`): **fastmail, shore, folk, diginius, hubspot, writesonic**.

**No partner row** (left unchanged; do not invent): **affinity, miocommerce**, plus most Band C/D CRM brands without a programme.

Other commercial-path work:

- Writesonic indexable so the commercial review can appear in Google.
- Compare pages keep related-product / visit CTAs; generic SERP copy now states who-wins-on-what from the model.
- Category hubs now surface job-fit titles instead of a bare noun in the SERP.
- CRM hub explore path → `/for/startups/` (commercial audience page already receiving impressions).
- Disclosures remain on-page / legal — not burned into social pixels.

Pages were not made salesy at the expense of intent.

---

## Internal links added

**39** contextual edges (`batchId: organic-growth-2026-09-11` after dropping 48 weak industry-template edges).

High-signal examples:

- `/categories/ai/` → `/guides/what-is-ai-software/`
- `/best/ai-software/` → `/guides/what-is-ai-software/`
- `/tools/ai-finder/` → `/compare/chatgpt-vs-writesonic/`
- `/software/chatgpt/` → `/compare/chatgpt-vs-writesonic/`
- `/categories/crm/` → `/software/affinity/`, `/software/netsuite/`, `/software/copper/`, `/software/cloze/`, `/software/wealthbox/`, `/software/apptivo/`, `/software/sugarcrm/`, `/software/pipelinepro/`, `/software/monday-sales-crm/`, `/guides/crm-data-migration/`
- `/research/crm-pricing/` → `/software/folk/`, `/software/pipedrive/`
- `/categories/marketing/` → `/best/marketing-software/`
- `/tools/crm-finder/` → `/software/salesforce/`, `/software/agile-crm/`, `/software/podio/`, `/software/dynamics-365/`, `/software/mailchimp/`

Guide overlay dual-writes: `what-is-crm`, `how-crm-works`, CRM vs-* cluster → `/guides/crm-data-migration/` and `/guides/zoho-crm-setup/`; AdCreative AI guides → `/guides/what-is-ai-software/`.

No sitewide/footer link spam.

Artifacts: `data/seo/link-injections.json`, `data/seo/batches/organic-growth-2026-09-11-linking.json`, `data/seo/guide-enrichment-overlays/*`.

---

## Deployment

| Field | Value |
| --- | --- |
| Deployment date | 2026-09-11 |
| Deployment commit | **PENDING — filled after git push** |
| Production | `https://www.softwareglimpse.com` |

---

## TOP 30 URLs to watch for movement

Future GSC snapshots should be compared to the per-URL numbers in the band tables (data through **2026-09-03**).

| # | URL | Band | Imp | Pos | Clicks | Why watch |
| ---: | --- | --- | ---: | ---: | ---: | --- |
| 1 | `/guides/what-is-ai-software/` | A | 82 | 7.9 | 0 | Title + inbound from AI hub/best/finder |
| 2 | `/company/my-story/` | A | 104 | 7.2 | 1 | Title (pos 7, CTR still thin) |
| 3 | `/for/startups/` | A | 41 | 17.1 | 1 | Title + CRM hub explore path |
| 4 | `/software/fastmail/` | B | 2275 | 23.5 | 9 | Highest-click software URL; affiliate live |
| 5 | `/software/diginius/` | B | 1044 | 37.4 | 0 | High impressions, 0 clicks; affiliate live |
| 6 | `/software/miocommerce/` | B | 653 | 23.6 | 0 | Pos ~24, 0 clicks |
| 7 | `/software/folk/` | B | 484 | 36.6 | 1 | Affiliate live |
| 8 | `/software/shore/` | B | 345 | 22.9 | 0 | Affiliate live |
| 9 | `/software/affinity/` | B | 225 | 34.5 | 0 | No partner URL — ranking/CTR only |
| 10 | `/compare/chatgpt-vs-writesonic/` | B | 220 | 39.7 | 0 | SERP differentiator + Writesonic indexable |
| 11 | `/compare/livechat-vs-tidio/` | B | 138 | 27.6 | 0 | Generic title replaced from winBits |
| 12 | `/guides/` | B | 144 | 33.2 | 0 | Hub title |
| 13 | `/` | B | 282 | 27.9 | 4 | Control — unchanged on purpose |
| 14 | `/categories/crm/` | C | 7172 | 61.6 | 3 | Highest impressions; seed title now in SERP |
| 15 | `/categories/marketing/` | C | 4232 | 52.7 | 1 | Seed title now in SERP |
| 16 | `/software/getresponse/` | C | 4143 | 61.0 | 1 | Review snippet |
| 17 | `/software/hubspot/` | C | 2880 | 67.0 | 0 | Review snippet + affiliate |
| 18 | `/software/keap/` | C | 2295 | 64.8 | 0 | Review snippet |
| 19 | `/software/activecampaign/` | D | 2407 | 78.3 | 0 | Review snippet |
| 20 | `/categories/ai/` | C | 1520 | 49.8 | 7 | Seed title + link to AI guide |
| 21 | `/software/sanebox/` | C | 1593 | 59.3 | 0 | Review snippet |
| 22 | `/software/capsule/` | C | 1482 | 51.0 | 1 | Visibility without this-wave snippet (watch) |
| 23 | `/software/kaspr/` | C | 1460 | 55.1 | 0 | Review snippet |
| 24 | `/software/navan/` | C | 1360 | 52.5 | 0 | Review snippet |
| 25 | `/software/krispcall/` | C | 1266 | 48.0 | 4 | Beginning clicks — watch |
| 26 | `/software/freshsales/` | C | 1199 | 59.4 | 0 | Review snippet |
| 27 | `/software/writesonic/` | D | 95 | 65.2 | 0 | Newly indexable + affiliate |
| 28 | `/categories/ecommerce/` | C | 751 | 42.7 | 0 | Metadata now uses seed title |
| 29 | `/compare/salesforce-vs-siebel/` | C | 981 | 52.8 | 1 | Platform SERP differentiator |
| 30 | `/compare/pipedrive-vs-salesforce/` | D | 1386 | 73.4 | 0 | High impressions; generic-title platform fix |

---

## Per priority URL — PRE-GROWTH metrics + this-wave change

Use this table when the next GSC export arrives. Clicks / impressions / CTR / position are **through 2026-09-03**.

| URL | Clicks | Imp | CTR | Pos | This-wave change |
| --- | ---: | ---: | ---: | ---: | --- |
| `/guides/what-is-ai-software/` | 0 | 82 | 0% | 7.9 | Title;  inbound from AI hub/best/guides |
| `/company/my-story/` | 1 | 104 | 0.96% | 7.2 | Title |
| `/for/startups/` | 1 | 41 | 2.44% | 17.1 | Title; CRM hub explore path |
| `/software/fastmail/` | 9 | 2275 | 0.40% | 23.5 | Title/description; affiliate already present |
| `/software/diginius/` | 0 | 1044 | 0% | 37.4 | Title/description + alternatives in meta |
| `/software/miocommerce/` | 0 | 653 | 0% | 23.6 | Title/description; **no affiliate** |
| `/software/folk/` | 1 | 484 | 0.21% | 36.6 | Title/description; affiliate live |
| `/software/shore/` | 0 | 345 | 0% | 22.9 | Title/description; affiliate live |
| `/software/affinity/` | 0 | 225 | 0% | 34.5 | Title/description; **no affiliate** |
| `/compare/chatgpt-vs-writesonic/` | 0 | 220 | 0% | 39.7 | Platform SERP; inbound from ChatGPT + AI finder |
| `/compare/livechat-vs-tidio/` | 0 | 138 | 0% | 27.6 | Platform SERP (winBits) |
| `/guides/` | 0 | 144 | 0% | 33.2 | Hub title |
| `/` | 4 | 282 | 1.42% | 27.9 | **Unchanged** (CTR control) |
| `/categories/crm/` | 3 | 7172 | 0.04% | 61.6 | Seed title now in metadata; outbound to CRM reviews |
| `/categories/marketing/` | 1 | 4232 | 0.02% | 52.7 | Seed title now in metadata |
| `/categories/ai/` | 7 | 1520 | 0.46% | 49.8 | Seed title; outbound to AI guide |
| `/software/writesonic/` | 0 | 95 | 0% | 65.2 | Title/description; **indexable true**; affiliate live |

---

## What this wave did **not** do

- Another full-site SEO score or estate audit
- New URLs
- Forcing SEMANTICALLY_BLOCKED / IMPROVE pages to INDEXABLE
- Invented page×query mappings
- Hands-on / “we tested” claims
- Industry-wide footer or unrelated industry→product link spam
