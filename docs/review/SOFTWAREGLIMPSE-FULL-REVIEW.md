# SoftwareGlimpse — Full Post-Remediation Review

**Audit timestamp (UTC):** 2026-09-08T23:00:14.163Z  
**Git commit:** `0a2dd4b` (`0a2dd4b489dca4a322cb98585cb3e17962b4973d`) — working tree includes register remediation  
**Build environment:** Next.js 16.3.0 (Turbopack), local production `next build` + `next start` on `http://127.0.0.1:3000`  
**Strategy judged:** PRESERVE → IMPROVE → VALIDATE → PROMOTE → INDEX → RANK → EARN TRAFFIC  
**Previous overall:** **49 / 100** → **Current overall: 54 / 100**

This review **recalculates** state from existing CLIs and live probes. It does **not** invent frameworks, traffic, hands-on tests, or backlinks.

Companion files:

| File | Role |
| --- | --- |
| [`docs/review/FULL-REVIEW-EXECUTIVE.md`](./FULL-REVIEW-EXECUTIVE.md) | Executive verdict |
| [`data/review/full-review-scorecard.json`](../../data/review/full-review-scorecard.json) | Scores + verification |
| [`data/review/full-review-issues.csv`](../../data/review/full-review-issues.csv) | Master issue register |
| [`data/review/full-review-url-matrix.csv`](../../data/review/full-review-url-matrix.csv) | Priority URL improvement matrix |

---

## Phase 0 — Current systems inventory

Existing commands used: `seo:audit`, `seo:sitemap-reconcile`, `seo:growth-dashboard`, `seo:guides-audit`, `seo:compare-audit`, `seo:knowledge-graph`, `seo:evidence-quality`, `migration:seo-audit`, `seo:lifecycle-orphans`, factory / evidence / testing prep CLIs.

### Data-source freshness

| Source | Validity | Through / generated | Freshness |
| --- | --- | --- | --- |
| GSC Performance export | **REAL** | dataThrough **2026-08-13** (imported 2026-08-15) | **STALE** |
| GSC Coverage export | **REAL** | 2026-08-13 / Aug-15 file | **STALE** |
| Growth Dashboard | REAL inputs + gaps | 2026-09-08T22:45:21.725Z | OK |
| Sitemap ↔ lifecycle reconcile | computed | disc=**0**; inSitemap=2941 | OK |
| Guides / compare audits | REAL estate | this review | OK |
| Knowledge graph | REAL | 6785 / 26853 | OK |
| Evidence reconcile | REAL | accepted **85** / 315 | OK |
| AI visibility | **NOT_CONNECTED** | fixture gated | no citation credit |
| Backlinks / PR | **NOT_CONNECTED** | — | no RD credit |
| Commercial clicks | **REAL** (0 events) | first-party store | conversions **NOT_CONNECTED** |

---

## Phase 1 — Build + live production review

| Check | Result |
| --- | --- |
| Lint | **PASS errors** — 0 errors / 102 warnings (unused-vars) |
| Typecheck (`tsc --noEmit`) | **PASS** — 0 errors |
| Tests (`vitest run`) | **PASS** — 1484 / 1484 (175 files) |
| Production build | **PASS** — 13,653 static pages (disk-full mid-build once; cleared `.next` and rebuilt) |
| Live server | **UP** during audits `http://127.0.0.1:3000` |
| `seo:audit --mode=full --base-url=…` | **PASS structure** — completed=32, skipped=0, failed=0; **P0=0 P1=0 P2=1** |
| `migration:seo-audit --base-url=…` | fate **643/643**; live probes **0 fails**; overall FAIL on static P1/P2 warns (GSC snapshot JSON + OG absolute URLs) |

### Live technical samples

| URL | HTTP | Notes |
| --- | --- | --- |
| `/` | 200 | index,follow |
| `/sitemap.xml` | 200 | sitemapindex → 15 child sitemaps; **~3,093** `<url>` |
| `/software/hubspot/` | 200 | index,follow |
| `/guides/what-is-crm/` | 200 | index,follow |
| `/guides/office-timeline-plans/` | 200 | noindex,follow |
| `/de/crm/` | 301 | → `/categories/crm/` |
| `/nl/` | 410 | x-robots-tag noindex |
| `/miocommerce-review/` | 308 | → `/software/miocommerce/` |

---

## Phases 2–5 — Route estate, indexability, sitemaps, migration

- Prerendered routes: **13,653**
- Public sitemap URLs (live): **~3,093**; reconcile discrepancies **0**; lifecycle orphans **0**
- Guides: INDEXABLE 472 · IMPROVE 1124 · factory packs 1272
- Compares: INDEXABLE 1699 · IMPROVE 1711 · INDEXABLE_READY 0

---

## Issue register (FR-001 … FR-016)

| ID | Sev | Status | Area |
| --- | --- | --- | --- |
| FR-001 | P1 | **blocked_external** | Organic traffic / GSC |
| FR-002 | P1 | **in_progress** | Content uniqueness |
| FR-003 | P1 | **in_progress** | Evidence / credibility |
| FR-004 | P1 | **blocked_external** | Authority |
| FR-005 | P1 | **blocked_external** | Data freshness |
| FR-006 | P1 | **resolved** | Engineering quality |
| FR-007 | P2 | **resolved** | Indexable quality |
| FR-008 | P2 | **in_progress** | Comparisons |
| FR-009 | P2 | **resolved** | Internal linking |
| FR-010 | P2 | **in_progress** | Commercial measurement |
| FR-011 | P2 | **resolved** | AI visibility |
| FR-012 | P2 | **blocked_external** | Deploy lag / production parity |
| FR-013 | P3 | **deferred_with_reason** | Thin alternatives |
| FR-014 | P3 | **deferred_with_reason** | Metric coherence |
| FR-016 | P2 | **resolved** | Indexability hygiene |

**Counts (non-resolved remaining):** P0=0 · P1=5 · P2=3 · P3=2  
**Status mix:** open=0 · in_progress=4 · resolved=5 · blocked_external=4 · deferred=2

---

## Scorecard summary

**Overall: 54 / 100** (previous 49)

| Dimension | Score | Rationale |
| --- | --- | --- |
| technicalSeo | 78 | Architecture coherent; FULL live audit P0=0 P1=0 P2=1 (thin Pipedrive alternatives); typecheck/tests/lint errors zero; production build PASS (13,653 pages) |
| crawlEfficiency | 80 | Locale/legacy exclusions; sitemap ↔ lifecycle disc=0; live sitemapindex 15 children / ~3,093 URLs; www deploy still external |
| indexability | 78 | Reconcile INDEXABLE≈3.1k; lifecycle orphans=0; coverage backlog still from stale Aug-13 GSC |
| contentQuality | 60 | FR-007 guide editorial_completeness hard fails=0; factory packs still dominate IMPROVE queue |
| contentUniqueness | 42 | Factory product-pack-factory still ~1272 estate risk; 3×50 waves material but 0 promotions (semantic gates) |
| softwareDataQuality | 67 | DATA_VERIFIED reconcile accepted=85/315; rejected=230 |
| editorialCredibility | 64 | Methodology/disclosure present; HANDS_ON=0; top-10 draft sessions prepared, not completed |
| internalLinking | 68 | KG 6785 nodes / 26853 edges; authority-flow hubs; IMPROVE sample orphans remain |
| searchOpportunityExecution | 50 | Lane A thin; GSC REAL but stale through 2026-08-13; 8 clicks / ~115k impressions / pos~74.5 |
| authorityBacklinks | 18 | NOT_CONNECTED — no REAL Ahrefs/Semrush; fixture exports rejected |
| originalResearch | 45 | CRM pricing research published; underused for PR/citations |
| evidenceTesting | 31 | HANDS_ON=0; DATA_VERIFIED accepted=85; never invent sessions |
| pricingFreshness | 62 | Monitor path intact; verification tasks remain operational |
| ux | 54 | Buyer utility stronger on enriched hubs; factory packs still programmatic |
| performance | 50 | No field CWV; lab proxies via live audit only |
| commercialTracking | 42 | First-party affiliate clicks REAL (0 events); conversions/revenue NOT_CONNECTED |
| aiVisibilityMeasurement | 22 | NOT_CONNECTED in production dashboard (fixture gated); REAL export still required |

---

## What moved / what did not

### Moved (evidence-backed)
- Engineering quality green (lint errors / tsc / vitest / build)
- DATA_VERIFIED **85** accepted (was ~29–31 at first review)
- AI Visibility fixture no longer reported as production REAL
- First-party affiliate click store REAL (0 events until traffic)
- Lifecycle orphans 0; FR-007/009/016 remain resolved
- Factory waves executed (material structure; **0** promotions — gates held)

### Did not move (blocked / honest gaps)
- Organic clicks still **8** on stale GSC through 2026-08-13
- HANDS_ON still **0**
- Authority / conversions / fresh GSC / www deploy still external
- Factory uniqueness risk still large (~1272 factory packs)

**Deploy verdict:** YES_WITH_MINOR_ISSUES
