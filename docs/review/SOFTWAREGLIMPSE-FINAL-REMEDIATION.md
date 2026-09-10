# SoftwareGlimpse — final remediation outcome

**Vs Review #5** (2026-09-10T08:38Z, overall 59/100, commit `37acc9bd`).  
**This snapshot:** 2026-09-10T21:06Z after commit `260cc889` deployed to www.

HANDS_ON remains **0 / NOT_CURRENT_SCOPE**. No first-hand testing claimed.

## Headline

| Metric | Review #5 | Now |
| --- | ---: | ---: |
| Overall baseline | 59 | not re-scored (no new audit pack) |
| Production sitemap URLs | 3133 | **3752** |
| Live P0 | 0 | **0** |
| Limited unique (estate) | 1326 | **1206** |
| DATA_VERIFIED | 187 / 315 | **240 / 315** |
| Eligible orphans | 2 / 80 sample | **2 / 3047** full IMPROVE graph |
| Semantic KG edges | 26856 | **26856** (contextual 51462) |
| Indexable guides (audit) | 532 | **688** |
| Improve guides (audit) | 963 | **1019** |
| Manual guides | — | **7** |
| Indexable comparisons (audit) | — | **2140** |
| Improve comparisons (audit) | — | **1809** |
| Manual comparisons | — | **51** |
| FACTORY_ORIGIN_TOTAL | 1272 | **1272** |
| FACTORY_HIGH_RISK | 1216 | **1104** |
| FACTORY_LIMITED_UNIQUE | 1218 | **1106** |
| FACTORY_QUALITY_PASS | 1272 | **1272** |
| FACTORY_INDEXABLE / PROMOTED | 263 | **419** |
| FACTORY_IMPROVE | 892 | **853** |
| GSC | STALE (R5) | **REAL** through 2026-09-03 · 124 clicks / 361167 impressions / CTR 0.0343% / pos ~69 |
| Authority | NOT_CONNECTED | **NOT_CONNECTED** |
| Conversions | NOT_CONNECTED | **NOT_CONNECTED** |

Local and live sitemap diagnostics: **3752** URLs, prohibited=0, dups=0, reconcile discrepancies=0, lifecycle orphans=0.

## DEPLOYED COMMIT

`260cc889` (remediation `1f4e7187` + perf:check false-positive fix)

## DEPLOYMENT VERIFIED

**YES** — GitHub Production deployment `260cc889` completed; `https://www.softwareglimpse.com` serves 200 with prerender cache.

## LIVE P0

**0** (`npm run seo:audit -- --mode=full --base-url=https://www.softwareglimpse.com` — 32 checks, 0 P0). Remaining 1 P1 + 1 P2 are lab TTFB on `/search` (robots-disallowed) and similar — not indexability.

## LIVE SITEMAP URLS

**3752** (15 child sitemaps all HTTP 200)

## LOCAL INDEXABLE VS LIVE INDEXABLE DIFFERENCE

**0**

```
LOCAL INDEXABLE (sitemap-eligible): 3752
LIVE INDEXABLE (live sitemap locs): 3752
IN SITEMAP: 3752
DIFFERENCE: 0
```

Unpublished lifecycle INDEXABLE pages: **0**. `what-is-sendcloud` remains INDEXABLE_READY until `scheduledAt` 2026-12-10T06:00:00.000Z (live `/guides/what-is-sendcloud/` is 404 until then — correct). Newly promoted `/compare/kaspr-vs-snov/` is live `200` + `index, follow` + self-canonical + JSON-LD and present in `sitemap-comparisons.xml`.

## GUIDES

- Indexable: **688**
- Improve: **1019**
- Manual: **7** (financial-services-crm cluster — intent overlap; not auto-merged)
- INDEXABLE_READY: **1** (`what-is-sendcloud`, calendar-blocked)

## COMPARISONS

- Indexable: **2140** (audit) / lifecycle registry INDEXABLE after orphan pass
- Improve: **1809** (audit) / **163** still IMPROVE in lifecycle registry
- Manual: **51** (43 WEAK_RELATIONSHIP disjoint use cases, 8 NONSENSICAL)

## FACTORY

- Origin: **1272**
- High risk: **1104**
- Limited unique: **1106**
- Quality pass: **1272**
- Indexable: **419**
- Improve: **853** (no unique-analysis overlay; sibling similarity still fails current thresholds)

## DATA_VERIFIED

**240 / 315**

Remaining 75: 73 `matches_domain_checked_at`, 1 `no_timestamp`, 1 `matches_enrichment_updatedAt`. Alternative first-party URLs tried for manychat / cpanel / turbotic → 0 additional stamps (hosts still blocked or plan-name miss). Policy not relaxed.

## FULL-ESTATE ELIGIBLE ORPHANS

**2 / 3047** IMPROVE pages (knowledge graph). Hard INDEXABLE contradictions: **0**. Lifecycle orphans: **0**.

## SEMANTIC EDGES

**26856** semantic · **51462** contextual (injections + overlays). KG QA errors: **0**.

## GSC

**REAL / FRESH** through **2026-09-03**: 124 clicks, 361167 impressions, CTR 0.0343%, weighted position ~69.

This remediation is **after** that window — do not attribute those metrics to this commit.

High-impression existing pages (fastmail, shore, affinity, miocommerce, `/categories/ai/`, several INDEXABLE compares) still show TITLE_WEAK / POOR_CTR. **pagesWithDirectQuery = 0** — titles were not rewritten from inferred queries. Legal/privacy CTR issues left as non-product.

## AUTHORITY

**NOT_CONNECTED**

## CONVERSIONS

**NOT_CONNECTED**

## UNCOMMITTED REQUIRED FILES

**0** after the proof commit that records live verification.

## UNPUBLISHED INDEXABLE PAGES

**0** (verified against lifecycle INDEXABLE × `isContentVisible` / `isEntityIndexable`)

## What this wave did (repository-controlled)

- Classified the dirty tree; gitignored regenerated dumps (`knowledge-graph.json`, `compare-audit.json`, gate history, batch logs).
- Reclassified 493 false-MANUAL guides → IMPROVE; 403 ENQUEUE_ENRICHMENT compares → IMPROVE.
- Enriched remaining IMPROVE comparisons (233 overlays).
- Injected **261** product-guide `relatedComparisons` edges that **render** (module cap 4; verified HTML for `kaspr-vs-snov`).
- Promoted **261** quality+visible+linked compares; demoted 4 lifecycle orphans (`adcreative-ai-vs-rank-prompt` family — `isEntityIndexable` still false).
- Promoted **44** factory-pack guides that already had unique-analysis overlays.
- Removed self-referential `relatedGuideSlugs` on the financial-services-crm cluster (KG QA errors 4 → 0).
- `what-is-sendcloud`: inbound ready; **not** promoted (publish calendar).

Validation this tree: lint errors **0**, typecheck **0**, tests **1502 passed**, production build **PASS**, guides/compare audits, quality validate, knowledge graph, lifecycle orphans 0, sitemap reconcile discrepancies 0, migration SEO QA **P0=0**.

## REPOSITORY-CONTROLLED REMEDIATION REMAINING

| Category | Count | Why it cannot be auto-finished |
| --- | ---: | --- |
| IMPROVE guides (mostly factory uniqueness / template) | 1019 | SEMANTICALLY_BLOCKED — sibling packs still fail uniqueness thresholds; `what-is-keap` / `what-is-hubspot` SEMANTIC_TEMPLATE_RISK |
| Factory IMPROVE without overlay | 853 | SEMANTICALLY_BLOCKED — no additional unique analysis in repository evidence |
| MANUAL guides | 7 | MANUAL_ACTUALLY_REQUIRED — financial-services-crm intent cluster; auto-merge would collapse distinct buyer jobs |
| IMPROVE comparisons (audit) | 1809 | mix of research-incomplete, undeclared cross-category, same_category_only, and pages never in the lifecycle registry |
| Lifecycle IMPROVE compares still quality-ok but slot-capped | 98 | LEGITIMATELY_BLOCKED — product-guide `relatedComparisons` already at 4 rendered slots; more links would be spam |
| MANUAL comparisons | 51 | 43 WEAK_RELATIONSHIP (disjoint use cases), 8 NONSENSICAL — editorial, not auto-promotable |
| INDEXABLE_READY | 1 | `what-is-sendcloud` calendar (2026-12-10) |
| GSC title/CTR on existing URLs | ~15 top pages | no DIRECT page×query matrix; inferred mappings must not rewrite titles |
| DATA_VERIFIED remainder | 75 | see external — twin stamps / no first-party timestamp in policy |

## EXTERNAL REMEDIATION REMAINING

- AUTHORITY = NOT_CONNECTED
- CONVERSIONS = NOT_CONNECTED
- Google recrawl / indexing / ranking of newly INDEXABLE URLs
- Vendor pricing 403 / 429 / plan-name miss (75 products)
- HANDS_ON = 0 / NOT_CURRENT_SCOPE
- GSC measurement lag (current file through 2026-09-03)

No backlink export. No conversion network import. Do not treat missing as zero.
