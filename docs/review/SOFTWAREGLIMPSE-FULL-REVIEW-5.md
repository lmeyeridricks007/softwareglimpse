# SoftwareGlimpse — Full Post-Execution Review #5

**Audit timestamp (UTC):** 2026-09-10T08:38:06.000Z  
**Git commit:** `37acc9bd` (`37acc9bd8f272cf78cef7344419323c984f1861c`)  
**Strategy:** PRESERVE → IMPROVE → VALIDATE → PROMOTE → INDEX → RANK → EARN TRAFFIC  

**Baseline (Review #4):** 2026-09-09T18:59:39.000Z · overall **55/100** · P0/P1/P2/P3 = 1/5/3/2 · production parity **NO** · prod sitemap **6370**

This audit scores **actual www production**. Localhost architecture, local sitemap counts, and unpublished promotions are reported as local evidence only. They do **not** award production SEO points.

Companion files: `FULL-REVIEW-EXECUTIVE-5.md`, `full-review-scorecard-5.json`, `full-review-issues-5.csv`, `full-review-url-matrix-5.csv`, `full-review-delta-5.json`.

---

## Executive answer

| Question | Answer |
| --- | --- |
| Did execution after Review #4 produce measurable outcomes? | **Yes** — www crawl architecture flipped; orphans, DV, limited-unique, and +16 local promotions also moved |
| Materially better organic growth? | **Not measurable** — GSC still STALE identical 8 / 115457 / 74.5 |
| Does www match the validated sitemap architecture? | **YES** — live sitemapindex, 15 children 200, URL total **3133** (was monolithic **6370**) |
| Does www match **today’s** local URL set? | **Not yet** — local diagnostics **3149** (16 newly INDEXABLE guides still **noindex** on www) |
| Ready for sustained IMPROVE→PROMOTE? | **Yes** — crawl surface is now the partitioned architecture |
| Deploy? | **YES — architecture safe to crawl.** Next deploy is the 16 INDEXABLE promotions (still noindex on www) |

**Overall score: 55 → 59 / 100 (Δ +4)**

---

## Phase 0 — Baseline locked (Review #4)

| Metric | Review #4 |
| --- | ---: |
| Overall | **55** |
| P0/P1/P2/P3 | 1 / 5 / 3 / 2 |
| Production parity | **NO** |
| Production sitemap | **6370** (monolithic urlset) |
| Local expected | **3133** (sitemapindex) |
| Factory | **1272** |
| Limited unique | **1342** |
| DATA_VERIFIED | **164** |
| HANDS_ON | **0** |
| Semantic KG | 6785 / **26853** |
| IMPROVE orphans | **15/80** |
| Authority | NOT_CONNECTED |
| Conversions | NOT_CONNECTED |
| GSC | STALE 8 / 115457 / 74.5 (through 2026-08-13) |

---

## Phase 1 — Recalculated current state

Sources refreshed this audit:

- Live www probes (no-follow + body) against `https://www.softwareglimpse.com`
- `npm run seo:sitemap-reconcile -- --live https://www.softwareglimpse.com` → `liveValidation.ok=true` · 15 children 200
- `npm run seo:audit -- --mode=full --base-url=https://www.softwareglimpse.com` → P0=**0** P1=1 (lab TTFB `/search/`) P2=0
- `npm run seo:guides-audit` → 2026-09-10T08:33:25Z
- `reconcileDataVerifiedCoverage()` → accepted **187** / rejected 128 / total 315 (dashboard band **189** — reconcile remains source of truth)
- Knowledge graph `data/seo/knowledge-graph.json` 2026-09-10T08:10:16Z → nodes 6785 · semanticEdges **26856** · orphans **2/80**
- Growth dashboard 2026-09-10T08:27:53Z → GSC STALE · authority NOT_CONNECTED · conversions NOT_CONNECTED · HANDS_ON **0 / NOT_CURRENT_SCOPE**
- Lifecycle `promotedAt` after 2026-09-09T18:59:39Z → **16** INDEXABLE guides
- Batches: `factory-pack-100c-2026-09-10`, `evidence-wave-50-2026-09-10`

### Outcome comparison (score only these)

| Metric | Previous (#4) | Current (#5) | Δ |
| --- | ---: | ---: | --- |
| Production parity | NO | **YES** (architecture) | **fixed** |
| Prod sitemap URL count | 6370 monolithic | **3133** sitemapindex | **−3237** |
| Local expected sitemap URLs | 3133 | **3149** | +16 unpublished promotions |
| Live P0 (FULL www audit) | 8 | **0** | **−8** |
| Factory near-dup (factoryPackCount) | 1272 | **1272** | 0 |
| Limited unique (limitedUniqueAnalysisCount) | 1342 | **1326** | **−16** |
| DATA_VERIFIED (reconcile accepted) | 164 | **187** | **+23** |
| HANDS_ON | 0 | **0 / NOT_CURRENT_SCOPE** | 0 (not a current gate) |
| KG nodes | 6785 | **6785** | 0 |
| KG edges (comparable semantic) | 26853 | **26856** | **+3** |
| IMPROVE orphans (sample) | 15/80 | **2/80** | **−13** |
| Promotions since prior review | +7 since R3 | **+16** since R4 | +16 local; **0 newly indexable on www sitemap** |
| GSC clicks / imp / pos | 8 / 115457 / 74.5 | **8 / 115457 / 74.5** | n/a (STALE identical) |
| Authority | NOT_CONNECTED | **NOT_CONNECTED** | 0 |
| Conversions | NOT_CONNECTED | **NOT_CONNECTED** | 0 |

Notes:

- Growth dashboard `sitemapUrlCount` **3149** is **local** architecture. Live www loc-sum is **3133**. Production SEO uses **3133**.
- The 16 lifecycle promotions exist as **200 + noindex** on www (example: `/guides/zendesk-implementation/`, `/guides/podio-setup/`). They are **not** in live `sitemap-guides.xml` (409 vs local 425). Do not score them as live-indexed.
- KG `edges` 72584 = semantic **26856** + contextual 45728 — **contextual inflation is not scored**.
- HANDS_ON remains 0 and is **NOT_CURRENT_SCOPE** for this phase. It is reported honestly and is **not** treated as a current growth, promotion, or deploy blocker.
- GSC validity REAL but **STALE** — rank/click movement **not measurable**.

### Live www evidence (this audit)

| Probe | Result |
| --- | --- |
| `/sitemap.xml` | **200** `<sitemapindex>` · 15 child locs |
| Child sitemaps | all **200** · loc-sum **3133** |
| `/robots.txt` | Sitemap → `/sitemap.xml` · Host www |
| `/compare/crisp-vs-tidio/` | **200** (R4: 404 P0) |
| `/best/social-media-marketing-software/` | **200** (R4: 404 P0) |
| `/research/crm-pricing/` | **200** (R4: 404 P0) |
| `/fr/mon-histoire/` | **301** → `/company/my-story/` (R4: 404 P0) |
| `/fr/`, `/de/` | **410** (R4: 404 P0) |
| `/tag/pipedrive/`, `/category/random-thin-tag-xyz/` | **410** (R4: 404 P0) |
| `/category/crm/` | **308** → `/categories/crm/` (intentional hop) |
| FULL `seo:audit` vs www | P0=**0** · P1=1 (`PERF-TTFB-SEARCH`) · checks 32/32 |

### Execution batches since Review #4

| Batch | Processed | Material outcomes |
| --- | ---: | --- |
| factory-pack-100c | 100 | 10 promoted · limited unique 1342→1326 · high-near-dup 1328→1312 · **factoryPackCount still 1272** |
| Same-day earlier factory promotions | 6 | `podio-setup`, `sap-setup`, `siebel-implementation`, `siebel-setup`, `wealthbox-implementation`, `wealthbox-setup` |
| evidence-wave-50-2026-09-10 | 50 products | DV 164→187 (+23) · 26 live-blocked (403/429/timeout/plan_hit) · 1 rejected (`sellfy`) |
| IMPROVE orphan graph fix | sample 80 | orphans 15→2 · remaining `/alternatives/canvas-score/`, `/use-cases/cohort-learning/` (intentional) |
| www architecture (already live at audit) | — | sitemapindex 3133 · locale/taxonomy 410 · former P0 money pages 200 |

---

## Phase 2 — Dimension scores (outcomes-weighted)

Local-only gains are capped where www does not yet ship the URL set.

| Dimension | #4 | #5 | Δ | Why |
| --- | ---: | ---: | ---: | --- |
| technicalSeo | 76 | **87** | +11 | Live www P0 8→0; 410/301 cutover now live. Residual: lab TTFB P1 on `/search/` |
| crawlEfficiency | 58 | **86** | +28 | Prod partitioned sitemap 3133 vs 6370. Residual: 16 INDEXABLE guides still noindex / absent from live guides sitemap |
| indexability | 70 | **83** | +13 | Live over-inclusion ~3.2k gone. Residual: URL-set lag 3149 vs 3133 |
| contentQuality | 64 | **65** | +1 | Factory-100c page work; modest |
| contentUniqueness | 46 | **48** | +2 | Limited unique 1342→1326; packs still 1272 |
| softwareDataQuality | 78 | **81** | +3 | DV reconcile 164→187 |
| editorialCredibility | 64 | **66** | +2 | DV up; HO remaining 0 is NOT_CURRENT_SCOPE (not a current credibility fail) |
| internalLinking | 74 | **80** | +6 | Orphans 15/80→2/80; semantic edges +3 only |
| searchOpportunityExecution | 57 | **59** | +2 | +16 local promotions; **not live-indexed**; GSC STALE caps |
| authorityBacklinks | 18 | 18 | 0 | NOT_CONNECTED |
| originalResearch | 45 | 45 | 0 | No new earned citation proof |
| evidenceTesting | 40 | **44** | +4 | DV +23; 26 products still blocked live |
| pricingFreshness | 65 | **66** | +1 | Evidence stamps continued |
| ux | 54 | 54 | 0 | — |
| performance | 50 | 50 | 0 | Still lab-only; one `/search/` TTFB P1 not field CWV |
| commercialTracking | 42 | 42 | 0 | Conversions NOT_CONNECTED |
| aiVisibilityMeasurement | 22 | 22 | 0 | NOT_CONNECTED |

**Overall: 55 → 59 (Δ +4)** — production crawl architecture recovered; GSC/factory/authority/conversions still do not prove earned traffic.

---

## Phase 3 — Issue register (delta)

| ID | Severity | Status vs #4 |
| --- | --- | --- |
| FR-001 Organic/GSC | P1 | UNCHANGED blocked (STALE identical) |
| FR-002 Factory uniqueness | P1 | IMPROVED_PARTIAL (limited −16; packs flat 1272) |
| FR-003 Evidence | P1 | IMPROVED_PARTIAL (DV+23; HO NOT_CURRENT_SCOPE) |
| FR-004 Authority | P1 | UNCHANGED |
| FR-005 GSC freshness | P1 | UNCHANGED |
| FR-009 Linking | P2 | IMPROVED (orphans 15→2) |
| FR-012 Deploy parity | P0→**resolved** | **RESOLVED** (architecture live) |
| FR4-019 Prod sitemap arch | P0→**resolved** | **RESOLVED** |
| FR5-020 Live URL-set lag | **P2** | **NEW** — 16 INDEXABLE promotions still noindex on www |
| FR3-018 Link honesty | P2 | IMPROVED (orphans); semantic still essentially flat |

Full rows: `data/review/full-review-issues-5.csv`.

---

## Top 5 outcome improvements

1. **www production sitemap 6370 monolithic → 3133 sitemapindex** (15 children 200; `liveValidation.ok=true`)  
2. **Live FULL P0 8 → 0** (money pages 200; locale/taxonomy 410; `/fr/mon-histoire/` 301)  
3. **IMPROVE orphans 15/80 → 2/80**  
4. **DATA_VERIFIED 164 → 187** (+23 reconcile-accepted)  
5. **Limited unique 1342 → 1326** and **+16** local lifecycle promotions (not yet live-indexed)

## Top 5 remaining blockers

1. **STALE GSC** — identical 8 / 115457 / 74.5 through 2026-08-13; rank/click movement not measurable  
2. **Factory packs still 1272** — 100c waves cleared limited-unique rows, not the pack inventory KPI  
3. **Authority NOT_CONNECTED** — no REAL backlink export  
4. **Conversions NOT_CONNECTED**  
5. **16 INDEXABLE promotions still noindex on www** (local sitemap 3149 vs live 3133)

## Biggest KPI that failed to move

**Estate factory pack count (1272)** and **GSC freshness**. Production crawl — Review #4’s biggest failure — **did move**. The remaining growth proof gap is STALE GSC; the remaining uniqueness KPI that execution did not move is `factoryPackCount`.

## Next 30 days

1. **Deploy** the 16 INDEXABLE promotions so live sitemap loc-sum matches local **3149** and those URLs emit `index,follow`  
2. Import **fresh GSC** Performance + Coverage + page×query (replace 2026-08-13 STALE)  
3. Factory waves **only** when estate `factoryPackCount` / `limitedUniqueAnalysisCount` move  
4. Import **REAL** backlink export  
5. Import affiliate **conversions**  
6. Continue evidence wave on 403/429/timeout/plan-hit blockers (DV 187/315)  
7. Keep **semanticEdges + orphan sample** as linking KPIs — ignore contextual edge inflation  
8. HANDS_ON is a **future enhancement**, not a current deploy/growth gate  

---

## Indexing (GSC Coverage — STALE)

Source: Coverage export 2026-08-15 · through same STALE window as Performance.

| Metric | Value |
| --- | ---: |
| GSC indexed (property aggregate) | **1527** |
| Crawled not indexed | 1607 |
| Discovered not indexed | 2550 |
| Live sitemap URLs | **3133** |
| Local sitemap URLs | 3149 |

Indexation ratio is **not comparable** (different scopes). Do not treat 1527/3133 as a live post-deploy ratio — the Coverage export predates the sitemapindex cutover.

## Authority / conversions

| Surface | Status |
| --- | --- |
| Authority / referring domains | **NOT_CONNECTED** |
| Conversions / commission / revenue | **NOT_CONNECTED** (never display 0) |

---

## Final answer block

```
SCORE:           55 → 59
PROD PARITY:     NO → YES (architecture; URL-set lag 16)
PROD SITEMAP:    6370 → 3133
P0:              1 → 0
FACTORY:         1272 → 1272
LIMITED UNIQUE:  1342 → 1326
DATA_VERIFIED:   164 → 187
HANDS_ON:        0 → 0 / NOT_CURRENT_SCOPE
ORPHANS:         15/80 → 2/80
SEMANTIC EDGES:  26853 → 26856
GSC:             STALE identical 8/115457/74.5 — rank/click movement NOT_MEASURABLE
AUTHORITY:       NOT_CONNECTED → NOT_CONNECTED
CONVERSIONS:     NOT_CONNECTED → NOT_CONNECTED
```
