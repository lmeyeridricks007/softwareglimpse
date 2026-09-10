# SoftwareGlimpse — Full Post-Execution Review #4

**Audit timestamp (UTC):** 2026-09-09T18:59:39.000Z  
**Git commit:** `0a2dd4b` (`0a2dd4b489dca4a322cb98585cb3e17962b4973d`) — large uncommitted execution tree  
**Strategy:** PRESERVE → IMPROVE → VALIDATE → PROMOTE → INDEX → RANK → EARN TRAFFIC  

**Baseline (Review #3):** 2026-09-09T08:48:00.000Z · overall **56/100** · P0/P1/P2/P3 = 0/5/3/2  

This audit recalculates from CLIs + live www probes. It scores **measurable outcomes only**. New systems are not rewarded.

Companion files: `FULL-REVIEW-EXECUTIVE-4.md`, `full-review-scorecard-4.json`, `full-review-issues-4.csv`, `full-review-url-matrix-4.csv`, `full-review-delta-4.json`.

---

## Executive answer

| Question | Answer |
| --- | --- |
| Did execution after Review #3 produce measurable outcomes? | **Yes — partial** (DV +49, orphans −65, limited-unique −31, +7 promos, Lane A 30) |
| Materially better organic growth? | **No** — GSC identical STALE; authority/HO/conversions flat |
| Does www match validated local architecture? | **NO** |
| Ready for sustained IMPROVE→PROMOTE? | **Yes locally** — **deploy first** before treating www as source of truth |
| Deploy? | **NO — unsafe production parity** |

**Overall score: 56 → 55 / 100 (Δ −1)**

---

## Phase 0 — Baseline locked (Review #3)

| Metric | Review #3 |
| --- | ---: |
| Overall | **56** |
| P0/P1/P2/P3 | 0 / 5 / 3 / 2 |
| Factory near-dup | 1272 |
| Limited unique | 1373 |
| DATA_VERIFIED | 115 |
| HANDS_ON | 0 |
| KG | 6785 / 26853 |
| IMPROVE orphan sample | 80/80 |
| Promotions (since R2) | 36 |
| GSC | 8 / 115457 / 74.5 (through 2026-08-13) |
| Authority | NOT_CONNECTED |
| Conversions | NOT_CONNECTED |

---

## Phase 1 — Recalculated current state

Sources refreshed this audit:

- `reconcileDataVerifiedCoverage()` → accepted **164** / rejected 151 / total 315  
- `buildTestCoverageMetrics()` → HANDS_ON **0** · dashboard DV band 166  
- `npm run seo:guides-audit` → `data/seo/guides-audit.json` (2026-09-09T18:57:52Z)  
- `npm run seo:knowledge-graph` → nodes 6785 · semanticEdges **26853** · orphans **15/80**  
- `npm run seo:growth-dashboard` → GSC STALE · authority NOT_CONNECTED · commercial PARTIAL/conv NOT_CONNECTED  
- `npm run seo:sitemap-reconcile -- --live https://www.softwareglimpse.com` → liveValidation **ok:false** · prod urls **6370**  
- `npm run seo:audit -- --mode=full --base-url=https://www.softwareglimpse.com` → P0=8 P1=1 P2=0  
- Batches: `factory-pack-100b-2026-09-09`, `lane-a-gsc-improve-30-2026-09-09`, `evidence-wave-50-2026-09-09-combined`

### Outcome comparison (score only these)

| Metric | Previous (#3) | Current (#4) | Δ |
| --- | ---: | ---: | ---: |
| Factory near-dup (factoryPackCount) | 1272 | **1272** | 0 |
| Limited unique (limitedUniqueAnalysisCount) | 1373 | **1342** | **−31** |
| DATA_VERIFIED (reconcile accepted) | 115 | **164** | **+49** |
| HANDS_ON | 0 | **0** | 0 |
| KG nodes | 6785 | **6785** | 0 |
| KG edges (comparable semantic) | 26853 | **26853** | 0 |
| IMPROVE orphans (sample) | 80/80 | **15/80** | **−65** |
| Promotions since prior review | 36 | **+7 incremental** | +7 |
| GSC clicks / imp / pos | 8 / 115457 / 74.5 | **8 / 115457 / 74.5** | n/a (STALE identical) |
| Authority | NOT_CONNECTED | **NOT_CONNECTED** | 0 |
| Conversions | NOT_CONNECTED | **NOT_CONNECTED** | 0 |
| Production parity | unvalidated | **NO** | fail |
| Prod sitemap URL count | — | **6370** | — |
| Local arch sitemap URL count | — | **3133** | — |

Notes:

- Growth dashboard shows `dataVerified: 166`; **reconcile accepted=164** is the policy source of truth.  
- KG `edges: 71601` = semantic **26853** + contextual 44748 — **contextual inflation is not scored as an outcome**.  
- Factory-pack-100b cleared 7 estate near-dup/limited-unique rows; **factoryPackCount remains 1272**.  
- GSC validity REAL but **STALE** — rank/click movement **not measurable**.

### Execution batches since Review #3

| Batch | Processed | Material outcomes |
| --- | ---: | --- |
| factory-pack-100b | 100 | 6 materially improved · 7 promoted · 7 estate near-dup/limited clears · packs still 1272 |
| lane-a-gsc-improve-30 | 30 | 27 content · 55 links · 14 data · 0 promoted · band 8–20 = 0 |
| evidence-wave-50 combined | 96 products | DV 115→164 (+49) |
| production live audit | www | parity NO · sitemap 6370 · FULL P0=8 |

---

## Phase 2 — Dimension scores (outcomes-weighted)

| Dimension | #3 | #4 | Δ | Why |
| --- | ---: | ---: | ---: | --- |
| technicalSeo | 78 | **76** | −2 | Live www P0 status mismatches |
| crawlEfficiency | 80 | **58** | −22 | Prod monolithic sitemap / children 404 |
| indexability | 78 | **70** | −8 | Live over-inclusion + wrong retirement codes |
| contentQuality | 63 | **64** | +1 | Lane A content applies |
| contentUniqueness | 43 | **46** | +3 | Limited unique −31; packs flat |
| softwareDataQuality | 72 | **78** | +6 | DV +49 |
| editorialCredibility | 64 | 64 | 0 | HO=0 |
| internalLinking | 68 | **74** | +6 | Orphans 80→15; semantic edges flat |
| searchOpportunityExecution | 55 | **57** | +2 | Lane A 30 + 7 promos; GSC caps |
| authorityBacklinks | 18 | 18 | 0 | NOT_CONNECTED |
| originalResearch | 45 | 45 | 0 | No new earned proof |
| evidenceTesting | 35 | **40** | +5 | DV up; HO still 0 |
| pricingFreshness | 64 | **65** | +1 | Evidence stamps |
| ux | 54 | 54 | 0 | — |
| performance | 50 | 50 | 0 | — |
| commercialTracking | 42 | 42 | 0 | Conv NOT_CONNECTED (adapters not rewarded) |
| aiVisibilityMeasurement | 22 | 22 | 0 | NOT_CONNECTED |

**Overall: 56 → 55 (Δ −1)** — DV/orphan/limited-unique gains outweighed by **production crawl failure**.

---

## Phase 3 — Issue register (delta)

| ID | Severity | Status vs #3 |
| --- | --- | --- |
| FR-001 Organic/GSC | P1 | UNCHANGED blocked |
| FR-002 Factory uniqueness | P1 | IMPROVED_PARTIAL (limited −31; packs flat) |
| FR-003 Evidence | P1 | IMPROVED_PARTIAL (DV+ / HO flat) |
| FR-004 Authority | P1 | UNCHANGED |
| FR-005 GSC freshness | P1 | UNCHANGED |
| FR-009 Linking | P2 | IMPROVED (orphans) |
| FR-012 Deploy parity | **P0** | **REGRESSED** |
| FR4-019 Prod sitemap arch | **P0** | **NEW** |
| FR3-018 Link honesty | P2 | IMPROVED_PARTIAL |

Full rows: `data/review/full-review-issues-4.csv`.

---

## Top 5 outcome improvements

1. **DATA_VERIFIED 115 → 164** (+49 reconcile-accepted)  
2. **IMPROVE orphans 80/80 → 15/80** (−65)  
3. **Limited unique 1373 → 1342** (−31)  
4. **Lane A GSC improve-30** on 30 existing URLs (27 content / 55 links)  
5. **+7 promotions** since Review #3  

## Top 5 remaining blockers

1. **www production parity FAILED** (6370 monolithic vs 3133 index; locale 410→404)  
2. **STALE GSC** — no comparable rank/click movement  
3. **Factory packs still 1272**  
4. **HANDS_ON = 0**  
5. **Authority + conversions NOT_CONNECTED**  

## Biggest KPI that failed to move

**Production parity / live crawl control** — validated local architecture is not what www serves. Blocks INDEX→RANK honesty.

## Next 30 days

1. **Deploy www** to validated build; re-run live sitemap reconcile + FULL `seo:audit` until parity YES  
2. Import **fresh GSC** Performance + Coverage + page×query  
3. Human-complete **top-10 HANDS_ON** sessions  
4. Import **REAL** backlink export  
5. Factory waves only when **estate** factoryPackCount / limitedUnique move  
6. Lane A title/CTR after fresh GSC (band 8–20 empty today)  
7. Import affiliate **conversions**  
8. Keep **semanticEdges + orphan sample** as linking KPIs — ignore contextual edge inflation  

---

## Final answer block

```
SCORE:           56 → 55
FACTORY RISK:    1272 → 1272
LIMITED UNIQUE:  1373 → 1342
DATA_VERIFIED:   115 → 164
HANDS_ON:        0 → 0
KG EDGES:        26853 → 26853 (semantic; total 71601 not scored)
ORPHANS:         80/80 → 15/80
PROMOTIONS:      36 → +7 incremental
AUTHORITY:       NOT_CONNECTED → NOT_CONNECTED
CONVERSIONS:     NOT_CONNECTED → NOT_CONNECTED
GSC:             STALE identical 8/115457/74.5 — rank/click movement NOT_MEASURABLE
PROD PARITY:     unvalidated → NO (6370 vs 3133)
```
