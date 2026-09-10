# Growth Dashboard

**Internal only.** Not a public SEO dashboard. Do not fabricate unavailable metrics.

Generated: 2026-09-09T18:59:14.406Z  
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

Indexable 2,521 · Improve 2,791 · Ready 1

Evidence:
- Strategy: PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC.
- Guides/comparisons lifecycle from seo audits; software from catalogue indexability; other ≈ sitemap remainder.

Gaps:
- Large IMPROVE backlog vs indexable set

### More promoted pages — `on_track`

Confidence: `medium` · Freshness: Last 7 days · Trend: `partial`

Promoted this week: 517 · Ready for promotion: 1

Evidence:
- Largest improvements: /compare/alidrop-vs-flippa/ (+28); /compare/alidrop-vs-printify/ (+28); /compare/alidrop-vs-shipbob/ (+28)
- Do not treat empty velocity as zero wins when history is not connected.

Gaps:
_None._

### More page-one rankings — `insufficient_trend`

Confidence: `low` · Freshness: 2026-08-13 · Trend: `unavailable`

Top 10: 109 · clicks 1 · share 1.2% · commercial 0 · CTR 0.006928986549104861%

Evidence:
- Source: GSC Performance export — softwareglimpse.com — 2026-08-15
- Validity: REAL
- Top-10 ≥100 imp: 6 · with clicks: 1 · commercial: 0
- Page-one quality uses impressions, clicks, CTR, intent mix, and Top-10 share — not page count alone.
- Only one REAL GSC Performance period on disk — retain this snapshot, then import a newer export for comparable pre/post.

Gaps:
- No historical trend — status stays insufficient_trend (not on_track)
- Top-10 click volume still thin
- Low share of impressions occurring in Top 10
- Few Top-10 pages have ≥100 impressions
- Few Top-10 pages earn clicks
- Few commercial/search-intent pages in Top 10
- Top-10 mix is light on commercial/search-intent URLs
- Site CTR still below a decision-useful floor

### More clicks — `insufficient_trend`

Confidence: `low` · Freshness: 2026-08-13 · Trend: `unavailable`

Organic clicks 8 · pages with clicks 7

Evidence:
- CTR opportunities listed: 7
- Expected CTR is a heuristic baseline for opportunity spotting — not a GSC guarantee.
- Only one REAL GSC Performance period on disk — retain this snapshot, then import a newer export for comparable pre/post.
- Absolute click volume is too thin to frame as strong performance

Gaps:
- No period-over-period trend — avoid strong directional click labels
- Click volume far too low to call building or on_track

### More evidence — `building`

Confidence: `medium` · Freshness: 2026-09-09T18:59:14.376Z · Trend: `partial`

Hands-on 0 · data-verified 166 · research-based 149

Evidence:
- Evidence levels from catalogue + completed test sessions — unfinished sessions do not count as hands-on.
- Trend points: previous snapshot → current

Gaps:
- No completed hands-on test sessions counted

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
- Promoted 517 page(s) to indexable this week
- Quality score improved on 174 page(s)


### What declined
- Crawled-not-indexed count high (1607) — inspect Coverage export


### Top actions
- /software/miocommerce/ → OPTIMIZE_TITLE (score 59)
- /software/diginius/ → MANUAL_REVIEW (score 58)
- /software/podio/ → OPTIMIZE_TITLE (score 57)
- /categories/ecommerce/ → OPTIMIZE_TITLE (score 56)
- / → OPTIMIZE_TITLE (score 54)


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


### New tested products
- No completed product test sessions on disk.


### Research published
- /research/crm-pricing/ — /research/crm-pricing/ · n=29
- /research/crm-pricing-history/ — observation history collecting


_Weekly view only lists evidence from REAL connected sources — FIXTURE never counts as a win._

_Strategy: PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC._

---

## 1. Search visibility (Discovery · Ranking · CTR · Traffic)

Status: `connected` · Validity: `REAL`  
Source: GSC Performance export — softwareglimpse.com — 2026-08-15 · Through 2026-08-13

### Discovery
| Metric | Value |
|---|---|
| Pages with impressions | 995 _(Pages receiving ≥1 impression)_ |
| Impressions | 115457 _(Discovery demand — not ranking strength)_ |

### Ranking
| Band | Value |
|---|---|
| Top 10 | 109 _(Pages with avg position ≤ 10 — count alone is not quality)_ |
| 11–20 | 40 _(Pages with avg position 11–20)_ |
| 21–50 | 272 _(Pages with avg position 21–50)_ |
| >50 | 574 _(Pages with avg position > 50)_ |
| Weighted position | 74.5 _(Impression-weighted average — not fixed SERP rank)_ |

### Page-one quality
| Metric | Value |
|---|---|
| Top-10 impressions | 1348 _(Impressions on pages averaging ≤10)_ |
| Top-10 clicks | 1 _(Clicks on pages averaging ≤10)_ |
| Top-10 share of impressions | 1.20% _(Share of site impressions occurring in Top 10)_ |
| Top-10 pages ≥100 impressions | 6 _(Top-10 pages with ≥100 impressions)_ |
| Top-10 pages with clicks | 1 _(Top-10 pages earning ≥1 click)_ |
| Top-10 commercial pages | 0 _(Top-10 pages on software/compare/best/buying-guide paths)_ |
| Commercial Top-10 share | 0.00% _(Share of Top-10 pages that look commercial/search-intent)_ |
| Site CTR | 0.01% _(Site CTR — not a ranking quality label)_ |

Page-one quality uses impressions, clicks, CTR, intent mix, and Top-10 share — not page count alone.

### CTR
| Metric | Value |
|---|---|
| Site CTR | 0.01% _(Site CTR — not a ranking quality label)_ |
| Compared pages | 256 _(Pages with ≥50 impressions and expected CTR baseline)_ |

Expected CTR is a heuristic baseline for opportunity spotting — not a GSC guarantee.

High-impression low-CTR opportunities:

- `/ar/` — 152 imp · pos 1.1 · CTR 0% vs expected 28% (gap 28pp)
- `/zh/` — 152 imp · pos 2.2 · CTR 0% vs expected 15% (gap 15pp)
- `/nl/` — 153 imp · pos 3.3 · CTR 0% vs expected 11% (gap 11pp)
- `/nl/voorwaarden/` — 152 imp · pos 5.3 · CTR 0% vs expected 6% (gap 6pp)
- `/hi/surferseovspop/` — 155 imp · pos 7.8 · CTR 0% vs expected 4% (gap 4pp)
- `/de/crm/` — 152 imp · pos 7.4 · CTR 0% vs expected 4% (gap 4pp)
- `/zh/%E6%8C%87%E5%8D%97%E9%80%89%E6%8B%A9%E6%9C%80%E4%BD%B3-seo-%E8%BD%AF%E4%BB%B6/` — 191 imp · pos 14.8 · CTR 0% vs expected 1.5% (gap 1.5pp)


### Traffic
| Metric | Value |
|---|---|
| Organic clicks | 8 _(Low absolute volume — not strong performance)_ |
| Pages with clicks | 7 _(Pages earning ≥1 click)_ |

Trend: `not_connected` — Only one REAL GSC Performance period on disk — retain this snapshot, then import a newer export for comparable pre/post.

---

## 2. Content estate

Status: `connected`

### Totals

| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 6030 | 2521 | 2791 | 0 | 1 | 717 | 0 |

### By type

#### Guides
| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1715 | 508 | 1079 | 0 | 1 | 127 | 0 |

#### Comparisons
| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 4000 | 1699 | 1711 | 0 | 0 | 590 | 0 |

#### Software
| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 315 | 314 | 1 | 0 | 0 | 0 | 0 |

#### Other (sitemap remainder)
| Total | Indexable | Improve | Improving | Ready | Manual | Retired |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |

- Strategy: PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC.
- Guides/comparisons lifecycle from seo audits; software from catalogue indexability; other ≈ sitemap remainder.


---

## 3. Improvement velocity (Last 7 days)

Status: `connected`

| Metric | Value |
|---|---|
| Pages improved | 174 _(URLs with positive quality delta in window)_ |
| Promoted to indexable | 517 _(Lifecycle promotedAt and/or snapshot sourceEvent=promoted)_ |
| Quality score improved | 174 _(before→after qualityScore increases)_ |
| Average quality delta | 10.55 _(Mean score delta for improved URLs)_ |
| Quality regressions | 0 _(QUALITY_REGRESSION flags (policy guard — no auto-deindex))_ |
| Promotion conversion rate | 2.971 _(promoted ÷ improved in window)_ |
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
Source: GSC Coverage export — softwareglimpse.com — 2026-08-15

| Metric | Value |
|---|---|
| Sitemap URL count | 3133 _(Actual public sitemap URL count)_ |
| GSC indexed (Coverage) | 1527 _(GSC Coverage latestTotals.indexed — property aggregate)_ |
| Discovered not indexed | 2550 |
| Crawled not indexed | 1607 |
| Indexation ratio | Not comparable as a ratio — GSC indexed 1,527 vs sitemap 3,133 (different scopes) |

- Coverage reasons are aggregate counts only — not per-URL lists.
- Do not treat Page with redirect / 404 counts as confirmed migration failures without URL inspection.
- Sitemap URL count is the submitted/indexable denominator for this dashboard.
- GSC Coverage “indexed” totals are property-wide aggregates — not automatically comparable 1:1 to sitemap rows (Coverage may include URLs outside the sitemap or exclude some submitted URLs).


---

## 5. Opportunity

Status: `connected` · Validity: `REAL`

1. `/software/miocommerce/` — score 59 · pos 28.49 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
2. `/software/diginius/` — score 58 · pos 34.34 · MANUAL_REVIEW · INFERRED_HIGH · query: diginius · actionConf REVIEW_REQUIRED
3. `/software/podio/` — score 57 · pos 27.278965517241378 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
4. `/categories/ecommerce/` — score 56 · pos 39.17 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
5. `/` — score 54 · pos 49.34 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
6. `/software/hubspot/` — score 53 · pos 66.38997014925373 · MANUAL_REVIEW · INFERRED_HIGH · query: hubspot review · actionConf REVIEW_REQUIRED
7. `/compare/salesforce-vs-siebel/` — score 52 · pos 69.55 · IMPROVE_INTRO · INFERRED_HIGH · query: siebel vs salesforce · actionConf REVIEW_REQUIRED
8. `/categories/crm/` — score 51 · pos 83.4100472937467 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
9. `/software/closely/` — score 51 · pos 36.26 · MANUAL_REVIEW · INFERRED_HIGH · query: closely · actionConf REVIEW_REQUIRED
10. `/software/fastmail/` — score 51 · pos 41.25 · MANUAL_REVIEW · INFERRED_HIGH · query: fastmail · actionConf REVIEW_REQUIRED
11. `/compare/pipedrive-vs-salesforce/` — score 51 · pos 63.75 · MANUAL_REVIEW · INFERRED_HIGH · query: pipedrive vs salesforce · actionConf REVIEW_REQUIRED
12. `/compare/pega-vs-salesforce/` — score 51 · pos 58.51 · MANUAL_REVIEW · INFERRED_HIGH · query: pega crm vs salesforce · actionConf REVIEW_REQUIRED
13. `/compare/hubspot-vs-pipedrive/` — score 51 · pos 67.5688 · MANUAL_REVIEW · INFERRED_HIGH · query: pipedrive vs hubspot · actionConf REVIEW_REQUIRED
14. `/compare/insightly-vs-salesforce/` — score 51 · pos 54.76 · MANUAL_REVIEW · INFERRED_HIGH · query: salesforce vs insightly · actionConf REVIEW_REQUIRED
15. `/compare/salesforce-vs-sugarcrm/` — score 51 · pos 69.07264705882353 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
16. `/software/folk/` — score 51 · pos 43.11266666666666 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL
17. `/categories/marketing/` — score 50 · pos 60.27477491961414 · OPTIMIZE_TITLE · INFERRED_LOW · actionConf SUPPRESSED
18. `/software/nimble/` — score 50 · pos 65.10516556291391 · MANUAL_REVIEW · INFERRED_HIGH · query: nimble crm review · actionConf REVIEW_REQUIRED
19. `/compare/hubspot-vs-insightly/` — score 50 · pos 67.62 · MANUAL_REVIEW · INFERRED_HIGH · query: hubspot vs insightly · actionConf REVIEW_REQUIRED
20. `/guides/` — score 50 · pos 41.665 · OPTIMIZE_TITLE · UNKNOWN · actionConf PAGE_LEVEL


- Top 20 from GSC Opportunity Engine (real export through 2026-08-13).
- Queue A (indexed): 50 · Queue B (IMPROVE/promote): 0
- “Entering” lists are current-position slices (≤10 / 11–20), not proven week-over-week entries without a prior snapshot.
- Ranking declines: not connected without prior-period comparison (refresh flags shown only when opportunity report exists).


---

## 6. Evidence

Status: `connected` · Validity: `REAL`

| Level | Value |
|---|---|
| Hands-on tested | 0 |
| Data verified | 166 |
| Research-based | 149 |
| Reviews with evidence | 0 |
| Stale pricing pages | 45 _(Unique paths with outdatedPricing in price-monitor growth feed)_ |
| Pages requiring refresh | 0 _(Refresh scanner candidates)_ |

### Evidence over time

- **previous snapshot** (2026-09-09T18:46:58.382Z): hands-on 0 · data-verified 166 · research-based 149
- **current** (2026-09-09T18:59:14.376Z): hands-on 0 · data-verified 166 · research-based 149


- Evidence levels from catalogue + completed test sessions — unfinished sessions do not count as hands-on.
- DATA_VERIFIED requires software.pricingVerifiedAt / software.pricing.verifiedAt / enrichment.pricing.verifiedAt with sources — never domainCheckedAt, updatedAt/generatedAt twins, or mass-identical backfill stamps.
- Price growth signals from 2026-09-08T23:17:49.543Z


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

