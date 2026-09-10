# Growth Dashboard

**Internal only.** Not a public SEO dashboard. Do not fabricate unavailable metrics.

Generated: 2026-09-10T16:01:30.153Z  
Engine: 2.3.0  
Strategy: **PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC**

---

## System

Unified internal view of whether SoftwareGlimpse is becoming a stronger organic search and software-intelligence property.

| Artifact | Path |
|---|---|
| This report | `docs/seo/GROWTH-DASHBOARD.md` |
| Machine JSON | `data/seo/growth-dashboard.json` |
| Internal UI | `/dev/growth/?secret=…` |
| Implementation | `src/services/seo/growth-dashboard/` |

### Data sources

GSC Opportunity Engine · indexing / Coverage · content lifecycle audits · quality gate history · product testing · research · digital PR · AI visibility · distribution · affiliate programme coverage.

Missing integrations show **not connected**. Validity: **REAL** / **PARTIAL** / **FIXTURE** / **NOT_CONNECTED** / **STALE**. Fixture/sample inputs never drive production north-star status.

### North-star objectives

Six primary objectives (`on_track` / `building` / `insufficient_trend` / `behind` / `not_connected`). Each carries **confidence**, **data freshness**, and **trend availability**. **No single vanity composite score.** Top-10 page count alone never implies `on_track`; missing historical trend usually yields `insufficient_trend`.

### CLI

```bash
npm run seo:growth-dashboard
npm run seo:growth-dashboard -- --no-write --json
```

### Access

Secret gate matches product testing: `GROWTH_SECRET` or `TESTING_SECRET` or `PREVIEW_SECRET`.

---

## North-star objectives

### More high-quality pages — `on_track`

Confidence: `low` · Freshness: Last 7 days · Trend: `unavailable`

Indexable 2,811 · Improve 2,278 · Ready 1

Evidence:
- Strategy: PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC.
- Guides/comparisons lifecycle from seo audits; software from catalogue indexability; other ≈ sitemap remainder.

Gaps:
_None._

### More promoted pages — `on_track`

Confidence: `medium` · Freshness: Last 7 days · Trend: `partial`

Promoted this week: 854 · Ready for promotion: 1

Evidence:
- Largest improvements: /compare/alidrop-vs-flippa/ (+28); /compare/alidrop-vs-printify/ (+28); /compare/alidrop-vs-shipbob/ (+28)
- Do not treat empty velocity as zero wins when history is not connected.

Gaps:
_None._

### More page-one rankings — `insufficient_trend`

Confidence: `low` · Freshness: 2026-09-03 · Trend: `unavailable`

Top 10: 37 · clicks 3 · share 0.9% · commercial 0 · CTR 0.034333147823582995%

Evidence:
- Source: GSC Performance export — softwareglimpse.com — 2026-09-05
- Validity: REAL
- Top-10 ≥100 imp: 12 · with clicks: 3 · commercial: 0
- Page-one quality uses impressions, clicks, CTR, intent mix, and Top-10 share — not page count alone.
- No comparable REAL GSC Performance period on disk (same range label required). Last-12-months vs Last-3-months is NOT_YET_MEASURABLE — retain this snapshot and import a later Last-12-months export.

Gaps:
- No historical trend — status stays insufficient_trend (not on_track)
- Top-10 click volume still thin
- Low share of impressions occurring in Top 10
- Few Top-10 pages earn clicks
- Few commercial/search-intent pages in Top 10
- Top-10 mix is light on commercial/search-intent URLs
- Site CTR still below a decision-useful floor

### More clicks — `insufficient_trend`

Confidence: `low` · Freshness: 2026-09-03 · Trend: `unavailable`

Organic clicks 124 · pages with clicks 79

Evidence:
- CTR opportunities listed: 15
- Expected CTR is a heuristic baseline for opportunity spotting — not a GSC guarantee.
- No comparable REAL GSC Performance period on disk (same range label required). Last-12-months vs Last-3-months is NOT_YET_MEASURABLE — retain this snapshot and import a later Last-12-months export.
- Click volume assessed with trend when available

Gaps:
- No period-over-period trend — avoid strong directional click labels

### More evidence — `on_track`

Confidence: `medium` · Freshness: 2026-09-10T16:01:30.081Z · Trend: `partial`

Data-verified 240 · research-based 75 · hands-on 0 / NOT_CURRENT_SCOPE

Evidence:
- HANDS_ON is 0 / NOT_CURRENT_SCOPE for the current remediation phase — future enhancement, not a growth gate.
- Current evidence gate is DATA_VERIFIED (vendor primary sources + documented pricing with sourceIds) plus research-based pages. Unfinished test sessions do not count as hands-on and must not block improvement or promotion.
- Trend points: previous snapshot → current

Gaps:
_None._

### More relevant links — `not_connected`

Confidence: `low` · Freshness: — · Trend: `unavailable`

Authority validity NOT_CONNECTED — fixture/sample links do not count

Evidence:
- Do not buy links or invent Ahrefs/Semrush RDs.
- Fixture/sample/example backlink exports are rejected for production Digital PR metrics.

Gaps:
- Backlink/PR validity is NOT_CONNECTED
- No LINK_EARNED records yet


---

## Weekly view

### What improved
- Trend comparison not connected or GSC not REAL — import a prior live GSC period.
- Promoted 854 page(s) to indexable this week
- Quality score improved on 251 page(s)


### What declined
- Crawled-not-indexed count high (1687) — inspect Coverage export


### Top actions
- /software/fastmail/ → MANUAL_REVIEW (score 67)
- /legal/privacy/ → OPTIMIZE_TITLE (score 66)
- /legal/terms/ → OPTIMIZE_TITLE (score 66)
- /compare/livechat-vs-tidio/ → OPTIMIZE_TITLE (score 65)
- /compare/hubspot-vs-tidio/ → OPTIMIZE_TITLE (score 64)


### Major pricing changes
- /software/monday-sales-crm/: Outdated pricing risk: monday sales CRM: new plan detected in catalogue (Ultimate) (REQUIRES_REVIEW)
- /pricing/monday-sales-crm/: Outdated pricing risk: monday sales CRM: new plan detected in catalogue (Ultimate) (REQUIRES_REVIEW)
- /tools/crm-cost-calculator/: Outdated pricing risk: monday sales CRM: new plan detected in catalogue (Ultimate) (REQUIRES_REVIEW)
- /compare/act-vs-monday-sales-crm/: Outdated pricing risk: monday sales CRM: new plan detected in catalogue (Ultimate) (REQUIRES_REVIEW)
- /compare/affinity-vs-monday-sales-crm/: Outdated pricing risk: monday sales CRM: new plan detected in catalogue (Ultimate) (REQUIRES_REVIEW)
- /compare/agile-crm-vs-monday-sales-crm/: Outdated pricing risk: monday sales CRM: new plan detected in catalogue (Ultimate) (REQUIRES_REVIEW)
- /compare/apptivo-vs-monday-sales-crm/: Outdated pricing risk: monday sales CRM: new plan detected in catalogue (Ultimate) (REQUIRES_REVIEW)
- /compare/attio-vs-monday-sales-crm/: Outdated pricing risk: monday sales CRM: new plan detected in catalogue (Ultimate) (REQUIRES_REVIEW)


### Links earned
- No LINK_EARNED records — not connected / none recorded.


### New tested products (HANDS_ON = NOT_CURRENT_SCOPE)
- HANDS_ON 0 / NOT_CURRENT_SCOPE — no completed sessions expected in this phase.


### Research published
- /research/crm-pricing/ — /research/crm-pricing/ · n=29
- /research/crm-pricing-history/ — observation history collecting


_Weekly view only lists evidence from REAL connected sources — FIXTURE never counts as a win._

_Strategy: PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC._

---

## 1. Search visibility (Discovery · Ranking · CTR · Traffic)

Status: `connected` · Validity: `REAL`  
Source: GSC Performance export — softwareglimpse.com — 2026-09-05 · Through 2026-09-03

### Discovery
| Metric | Value |
|---|---|
| Pages with impressions | 991 _(Pages receiving ≥1 impression in the Pages tab (GSC export capped at 1000))_ |
| Impressions | 361167 _(Discovery demand — not ranking strength)_ |

### Ranking
| Band | Value |
|---|---|
| Top 10 | 37 _(Pages with avg position ≤ 10 — count alone is not quality)_ |
| 11–20 | 82 _(Pages with avg position 11–20)_ |
| 21–50 | 352 _(Pages with avg position 21–50)_ |
| >50 | 520 _(Pages with avg position > 50)_ |
| Weighted position | 69 _(Impression-weighted average — not fixed SERP rank)_ |

### Page-one quality
| Metric | Value |
|---|---|
| Top-10 impressions | 3362 _(Impressions on pages averaging ≤10)_ |
| Top-10 clicks | 3 _(Clicks on pages averaging ≤10)_ |
| Top-10 share of impressions | 0.90% _(Share of site impressions occurring in Top 10)_ |
| Top-10 pages ≥100 impressions | 12 _(Top-10 pages with ≥100 impressions)_ |
| Top-10 pages with clicks | 3 _(Top-10 pages earning ≥1 click)_ |
| Top-10 commercial pages | 0 _(Top-10 pages on software/compare/best/buying-guide paths)_ |
| Commercial Top-10 share | 0.00% _(Share of Top-10 pages that look commercial/search-intent)_ |
| Site CTR | 0.03% _(Site CTR — not a ranking quality label)_ |

Page-one quality uses impressions, clicks, CTR, intent mix, and Top-10 share — not page count alone.

### CTR
| Metric | Value |
|---|---|
| Site CTR | 0.03% _(Site CTR — not a ranking quality label)_ |
| Compared pages | 604 _(Pages with ≥50 impressions and expected CTR baseline)_ |

Expected CTR is a heuristic baseline for opportunity spotting — not a GSC guarantee.

High-impression low-CTR opportunities:

- `/ar/` — 266 imp · pos 2 · CTR 0% vs expected 28% (gap 28pp)
- `/zh/` — 264 imp · pos 2.9 · CTR 0% vs expected 15% (gap 15pp)
- `/nl/` — 244 imp · pos 4.3 · CTR 0% vs expected 8% (gap 8pp)
- `/nl/voorwaarden/` — 202 imp · pos 5.4 · CTR 0% vs expected 6% (gap 6pp)
- `/hi/what-are-the-best-crm-with-analytics/` — 115 imp · pos 5.9 · CTR 0% vs expected 6% (gap 6pp)
- `/de/crm/` — 247 imp · pos 7.6 · CTR 0% vs expected 4% (gap 4pp)
- `/hi/salesforce-vs-zoho/` — 134 imp · pos 7.5 · CTR 0% vs expected 4% (gap 4pp)
- `/hi/surferseovspop/` — 412 imp · pos 9.9 · CTR 0% vs expected 2.5% (gap 2.5pp)
- `/my-story/` — 104 imp · pos 7.2 · CTR 0.96% vs expected 4% (gap 3.04pp)
- `/de/surferseovsclearscope/` — 162 imp · pos 10.4 · CTR 0% vs expected 2.5% (gap 2.5pp)


### Traffic
| Metric | Value |
|---|---|
| Organic clicks | 124 |
| Pages with clicks | 79 _(Pages earning ≥1 click)_ |

Trend: `not_connected` — No comparable REAL GSC Performance period on disk (same range label required). Last-12-months vs Last-3-months is NOT_YET_MEASURABLE — retain this snapshot and import a later Last-12-months export.

---

## 2. Content estate

Status: `connected`

### Totals

| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 6030 | 2811 | 2278 | 0 | 1 | 940 | 0 |

### By type

#### Guides
| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1715 | 644 | 570 | 0 | 1 | 500 | 0 |

#### Comparisons
| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 4000 | 1853 | 1707 | 0 | 0 | 440 | 0 |

#### Software
| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 315 | 314 | 1 | 0 | 0 | 0 | 0 |

#### Other (sitemap remainder)
| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### Factory-origin remediation

FACTORY_ORIGIN_TOTAL is **inventory** (pages created from factory families). It does **not** fall when those pages become excellent. Quality KPIs: HIGH_RISK ↓, LIMITED_UNIQUE ↓, QUALITY_PASS ↑, INDEXABLE ↑, IMPROVE ↓.

| Metric | Value |
|---|---|
| FACTORY_ORIGIN_TOTAL | 1272 _(FACTORY_ORIGIN_TOTAL — inventory/history, not a quality KPI)_ |
| FACTORY_HIGH_RISK | 1104 _(FACTORY_HIGH_RISK — factory-origin failing semantic uniqueness)_ |
| FACTORY_LIMITED_UNIQUE | 1106 _(FACTORY_LIMITED_UNIQUE — factory-origin lacking unique analysis)_ |
| FACTORY_QUALITY_PASS | 1272 _(FACTORY_QUALITY_PASS — factory-origin passing current quality gate)_ |
| FACTORY_INDEXABLE | 375 _(FACTORY_INDEXABLE — factory-origin legitimately INDEXABLE)_ |
| FACTORY_IMPROVE | 499 _(FACTORY_IMPROVE — factory-origin still requiring improvement)_ |
| FACTORY_PROMOTED | 375 _(FACTORY_PROMOTED — factory-origin promoted after remediation)_ |

- Strategy: PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC.
- Guides/comparisons lifecycle from seo audits; software from catalogue indexability; other ≈ sitemap remainder.
- FACTORY_ORIGIN_TOTAL is inventory (slug-class packs). Do not treat a stable count as remediation failure. Quality KPIs are HIGH_RISK, LIMITED_UNIQUE, QUALITY_PASS, INDEXABLE, IMPROVE.


---

## 3. Improvement velocity (Last 7 days)

Status: `connected`

| Metric | Value |
|---|---|
| Pages improved | 251 _(URLs with positive quality delta in window)_ |
| Promoted to indexable | 854 _(Lifecycle promotedAt and/or snapshot sourceEvent=promoted)_ |
| Quality score improved | 251 _(before→after qualityScore increases)_ |
| Average quality delta | 8.54 _(Mean score delta for improved URLs)_ |
| Quality regressions | 0 _(QUALITY_REGRESSION flags (policy guard — no auto-deindex))_ |
| Promotion conversion rate | 3.402 _(promoted ÷ improved in window)_ |
| Rankings improved after upgrade | Requires paired pre/post GSC for upgraded URLs — not connected |

### Largest improvements
- /compare/alidrop-vs-flippa/: 51 → 79 (**+28**)
- /compare/alidrop-vs-printify/: 51 → 79 (**+28**)
- /compare/alidrop-vs-shipbob/: 51 → 79 (**+28**)
- /compare/birch-vs-diginius/: 51 → 79 (**+28**)
- /compare/breezy-hr-vs-flexiquiz/: 51 → 79 (**+28**)
- /compare/callhippo-vs-kixie/: 51 → 79 (**+28**)
- /compare/dext-vs-navan/: 51 → 79 (**+28**)
- /compare/canvas-score-vs-whatconverts/: 51 → 79 (**+28**)
- /compare/printify-vs-spocket/: 51 → 79 (**+28**)
- /compare/contractor-foreman-vs-miocommerce/: 51 → 79 (**+28**)

- Largest improvements: /compare/alidrop-vs-flippa/ (+28); /compare/alidrop-vs-printify/ (+28); /compare/alidrop-vs-shipbob/ (+28)
- Do not treat empty velocity as zero wins when history is not connected.
- Snapshots are append-only (sourceEvent: first_analyzed/enriched/promoted/…). Historical observations are never rewritten.


---

## 4. Indexation

Status: `connected` · Validity: `REAL`  
Source: GSC Coverage drilldowns — softwareglimpse.com — 2026-09-05

| Metric | Value |
|---|---|
| Sitemap URL count | 3419 _(Actual public sitemap URL count)_ |
| GSC indexed (Coverage) | not connected |
| Discovered not indexed | 8797 |
| Crawled not indexed | 1687 |
| Indexation ratio | Need both sitemap count and GSC indexed total — and an explicit comparable-scope declaration |

- PARTIAL Coverage: only two issue drilldowns were available (Crawled not indexed; Discovered not indexed).
- Do not compare these aggregates to the 2026-08-15 Coverage Overview (indexed 1527 / crawled 1607 / discovered 2550). That overview predates the production sitemapindex cutover and is a different export type.
- Issue URL tables are GSC-capped at 1000 URLs; Chart totals are the issue counts.
- Coverage charts run 2026-06-08 → 2026-08-28 — not the Performance Last-12-months window.
- Indexed / noindex / 404 / redirect / canonical counts are NOT_IN_THIS_EXPORT.
- Sitemap URL count is the submitted/indexable denominator for this dashboard.
- GSC Coverage “indexed” totals are property-wide aggregates — not automatically comparable 1:1 to sitemap rows (Coverage may include URLs outside the sitemap or exclude some submitted URLs).


---

## 5. Opportunity

Status: `connected` · Validity: `REAL`

1. `/software/fastmail/` — score 67 · pos 23.52 · MANUAL_REVIEW · INFERRED_HIGH · query: fastmail review · actionConf REVIEW_REQUIRED
2. `/legal/privacy/` — score 66 · pos 14.12 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
3. `/legal/terms/` — score 66 · pos 18.37 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
4. `/compare/livechat-vs-tidio/` — score 65 · pos 27.6 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
5. `/compare/hubspot-vs-tidio/` — score 64 · pos 23 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
6. `/software/shore/` — score 63 · pos 22.86 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
7. `/compare/hubspot-vs-zendesk/` — score 63 · pos 34.95 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
8. `/software/affinity/` — score 62 · pos 34.55 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
9. `/compare/chatgpt-vs-github-copilot/` — score 62 · pos 24.37 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
10. `/software/miocommerce/` — score 60 · pos 23.58 · MANUAL_REVIEW · INFERRED_HIGH · query: miocommerce · actionConf REVIEW_REQUIRED
11. `/compare/chatgpt-vs-writesonic/` — score 60 · pos 39.67 · MANUAL_REVIEW · INFERRED_HIGH · query: writesonic vs chatgpt · actionConf REVIEW_REQUIRED
12. `/guides/` — score 60 · pos 33.18 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
13. `/categories/ai/` — score 59 · pos 49.76613815789474 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
14. `/compare/crisp-vs-tidio/` — score 59 · pos 44.25 · MANUAL_REVIEW · INFERRED_HIGH · query: tidio vs crisp · actionConf REVIEW_REQUIRED
15. `/` — score 58 · pos 27.95 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
16. `/company/my-story/` — score 58 · pos 7.15 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
17. `/compare/hubspot-vs-marketo/` — score 58 · pos 37.41 · MANUAL_REVIEW · INFERRED_HIGH · query: hubspot vs marketo · actionConf REVIEW_REQUIRED
18. `/for/startups/` — score 58 · pos 17.15 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
19. `/industries/music/` — score 57 · pos 49.32792869269949 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
20. `/software/folk/` — score 57 · pos 36.6229958677686 · MANUAL_REVIEW · INFERRED_HIGH · query: folk crm review · actionConf REVIEW_REQUIRED


- Top 20 from GSC Opportunity Engine (real export through 2026-09-03).
- Queue A (indexed): 50 · Queue B (IMPROVE/promote): 3
- “Entering” lists are current-position slices (≤10 / 11–20), not proven week-over-week entries without a prior snapshot.
- Ranking declines: not connected without prior-period comparison (refresh flags shown only when opportunity report exists).


---

## 6. Evidence

Status: `connected` · Validity: `REAL`

| Level | Value |
|---|---|
| Hands-on tested | 0 _(NOT_CURRENT_SCOPE — future enhancement, not a growth gate)_ |
| Data verified | 240 |
| Research-based | 75 |
| Reviews with evidence | 0 |
| Stale pricing pages | 51 _(Unique paths with outdatedPricing in price-monitor growth feed)_ |
| Pages requiring refresh | 0 _(Refresh scanner candidates)_ |

### Evidence over time

- **previous snapshot** (2026-09-10T11:47:23.008Z): hands-on 0 · data-verified 240 · research-based 75
- **current** (2026-09-10T16:01:30.081Z): hands-on 0 · data-verified 240 · research-based 75


- HANDS_ON is 0 / NOT_CURRENT_SCOPE for the current remediation phase — future enhancement, not a growth gate.
- Current evidence gate is DATA_VERIFIED (vendor primary sources + documented pricing with sourceIds) plus research-based pages. Unfinished test sessions do not count as hands-on and must not block improvement or promotion.
- DATA_VERIFIED requires software.pricingVerifiedAt / software.pricing.verifiedAt / enrichment.pricing.verifiedAt with sources — never domainCheckedAt, updatedAt/generatedAt twins, or mass-identical backfill stamps.
- Price growth signals from 2026-09-10T10:34:44.084Z


---

## 7. Authority

Status: `not_connected` · Validity: `NOT_CONNECTED`

| Metric | Value |
|---|---|
| Referring domains | No REAL backlink export — do not invent referring domains |
| Backlinks | No REAL backlink export |
| Linked pages | No REAL backlink export |
| Topical relevance (avg) | No REAL backlink export |
| New referring domains | No REAL backlink export |
| Lost referring domains | No REAL backlink export |
| Links → research assets | No REAL backlink export |
| Links → commercial pages | No REAL backlink export |
| Quality prospects | 0 _(No REAL export — fixture/sample prospect count forced to 0)_ |
| Links earned | 0 _(From tracking LINK_EARNED only — never invent)_ |
| Research assets | 3 _(Research assets in inventory (not yet proven earned links))_ |

Validity legend: `REAL` · `PARTIAL` · `STALE` (>45d) · `FIXTURE` · `NOT_CONNECTED`

_No REAL backlink rows to sample (export NOT_CONNECTED or empty)._

- Do not buy links or invent Ahrefs/Semrush RDs.
- Fixture/sample/example backlink exports are rejected for production Digital PR metrics.
- Dashboard validity: REAL | STALE (>45d export date) | FIXTURE | NOT_CONNECTED.
- REAL backlink export not connected — authority referring domains stay NOT_CONNECTED.
- Fixture/sample prospect count in report: 0 (must be 0 in production).


---

## 8. Research / AI / Distribution / Commercial

### Research
| Metric | Value |
|---|---|
| Published reports | 1 _(CRM Pricing Statistics & Benchmarks 2026)_ |
| Dataset coverage | 29 _(USD products with starting price / 37 primary CRM)_ |
| Latest | /research/crm-pricing/ · n=29 |
| Research citations tracked | 2 _(AI Visibility top cited paths under /research/)_ |

### AI Visibility (`NOT_CONNECTED`)
| Metric | Value |
|---|---|
| Citations | FIXTURE sample — excluded from production metrics |
| Unique cited pages | FIXTURE sample — excluded |
| Platforms | FIXTURE sample — excluded |

- AI Visibility source is FIXTURE/sample — treated as NOT_CONNECTED for production status.
- Drop a REAL Ahrefs AI Visibility (or similar) export under data/seo/imports/ and re-run npm run seo:ai-visibility.
- Never fabricate ChatGPT/Perplexity citations.


### Commercial (`PARTIAL`)
| Metric | Value |
|---|---|
| Affiliate clicks | 0 _(First-party clicks (first_party_beacon) · 0 products)_ |
| Conversions | Conversion analytics NOT_CONNECTED — import network export (never invent; never show 0) |
| Matched conversions | Matched conversions require network import |
| Conversion rate | Conversion rate unavailable until clicks + conversions connect |
| Commission | Commission NOT_CONNECTED — do not show $0 |
| Revenue | Revenue NOT_CONNECTED — do not show $0 without network amounts |
| Unmatched conversions | Unmatched count unavailable |
| Programme coverage | 94 _(94/315 products with active programme)_ |

Top converting source pages:
_None._


Top products:
_None._


- Conversions NOT_CONNECTED — import network export; do not display 0 conversions.
- Published with affiliate CTA: 94
- Personal data: path + host only — no emails, IPs, or full referrer URLs.


---

## Source inventory

| Source | Status | Validity | Path |
|---|---|---|---|
| GSC Performance export | `connected` | `REAL` | `/Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/docs/migration/data/gsc-export.json` |
| GSC Coverage export | `connected` | `REAL` | `/Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/docs/migration/data/gsc-coverage.json` |
| GSC Opportunity Engine | `connected` | `REAL` | `/Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/data/seo/gsc-opportunities.json` |
| Price change growth signals | `connected` | `REAL` | `/Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/data/pricing/price-change-growth-signals.json` |
| Digital PR / link opportunities | `not_connected` | `NOT_CONNECTED` | `/Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/data/seo/link-opportunities.json` |
| AI Visibility | `not_connected` | `NOT_CONNECTED` | `/Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/data/seo/ai-visibility.json` |
| Distribution pack / tracking | `partial` | `REAL` | `/Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/data/distribution/latest-pack.json` |
| Affiliate click / revenue analytics | `partial` | `PARTIAL` | `/Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/data/analytics/affiliate-clicks.json` |

---

## Compliance

- Internal dashboard only — not a public SEO scoreboard.
- Do not fabricate unavailable metrics; show not connected instead of fake zeros for clicks/revenue.
- No single vanity composite score — north-star is six primary objectives.
- Do not label search strong from impressions alone.
- FIXTURE / sample integrations never contribute to production north-star status.
- Indexation ratio is withheld unless GSC indexed and sitemap scopes are explicitly comparable.

