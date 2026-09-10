# SoftwareGlimpse — Full Post-Remediation Review #2

**Audit timestamp (UTC):** 2026-09-08T23:26:09.024Z  
**Git commit:** `0a2dd4b` (`0a2dd4b489dca4a322cb98585cb3e17962b4973d`) — large uncommitted remediation tree  
**Build:** Next.js 16.3.0 · production `next build` + `next start` @ `http://127.0.0.1:3000`  
**Strategy:** PRESERVE → IMPROVE → VALIDATE → PROMOTE → INDEX → RANK → EARN TRAFFIC  

**Baseline (Review #1 artifacts):** 2026-09-08T23:00:14.163Z · overall **54/100** · commit `0a2dd4b`  
**Original first-review reference (pre-remediation):** overall **49/100** (eng broken)

This audit recalculates from existing CLIs/live probes. It does **not** invent traffic, hands-on tests, or backlinks.

Companion files: `FULL-REVIEW-EXECUTIVE-2.md`, `full-review-scorecard-2.json`, `full-review-issues-2.csv`, `full-review-url-matrix-2.csv`, `full-review-delta.json`.

---

## Executive answer

| Question | Answer |
| --- | --- |
| Materially better than Review #1 (score 54)? | **No — outcomes flat** (same GSC window, same template risk, same HO=0, same authority gap) |
| Materially better than original@49? | **Yes — eng + DV + crawl honesty held** |
| Ready for sustained IMPROVE→PROMOTE growth work? | **Yes for process execution** — but **not** yet an organic growth engine |
| Deploy? | **YES WITH MINOR ISSUES** |

**Overall score: 54 → 54 / 100 (Δ 0)**

---

## Phase 0 — Baseline locked

| Metric | Previous review | Notes |
| --- | --- | --- |
| Timestamp | 2026-09-08T23:00:14.163Z | |
| Commit | 0a2dd4b | |
| Overall | **54** | was 49→54 remediation |
| P0/P1/P2/P3 remaining | 0/5/3/2 | |
| Lint/tsc/tests | 0 err / 0 / 1484 pass | |
| Sitemap live | ~3093 | reconcile disc 0 |
| Factory / near-dup / limited-unique | 1272 / 1272 / 1373 | |
| GSC | 8 clicks / 115457 imp / pos 74.5 through 2026-08-13 | STALE |
| DATA_VERIFIED / HANDS_ON | 85 / 0 | |

---

## Phase 1–2 — Repo + engineering

Working tree: ~742 modified / ~1093 untracked on `main@0a2dd4b`.

### Engineering delta

| Gate | Original (~first review) | Previous remediation | **Current** | Δ vs remediation |
| --- | --- | --- | --- | --- |
| Lint errors | ~255 | 0 | **0** | 0 |
| Lint warnings | ~98 | 102 | **102** | 0 |
| TypeScript errors | ~730 | 0 | **0** | 0 |
| Vitest failed | ~53 | 0 | **0** | 0 |
| Vitest passed | ~1417 | 1484 | **1484** | 0 |
| Production build | PASS | PASS 13653 | **PASS 13653** | 0 |

**Gate-gaming scan:** `@ts-ignore/@ts-nocheck`=0 · `test.skip/only`=0 · `as any`=0 · `eslint-disable`≈51 (img-element / localStorage hydration — not mass suppressions).

---

## Phase 3 — Live production

| Check | Result |
| --- | --- |
| FULL seo:audit | completed=32 skipped=**0** failed=0 · **P0=0 P1=0 P2=1** (thin Pipedrive alternatives) |
| Migration SEO QA | fate 643/643 · live probe fails **0** · static P1=1 P2=3 (snapshot JSON noise) |
| Note | Transient false P0s when `next start` dropped mid-audit; stable re-run RESOLVED 33 |

### Representative routes

| URL | HTTP | robots/notes |
| --- | --- | --- |
| `/` | 200 | index,follow · HTML **393,385** bytes · JSON-LD 2 |
| `/software/hubspot/` | 200 | index,follow · affiliate signals · self-canonical |
| `/guides/what-is-crm/` | 200 | INDEXABLE · index,follow |
| `/guides/office-timeline-plans/` | 200 | IMPROVE · **noindex,follow** |
| `/compare/hubspot-vs-pipedrive/` | 200 | INDEXABLE |
| `/best/crm-software/` | 200 | index,follow |
| `/alternatives/pipedrive/` | 200 | thin (audit P2) |
| `/categories/crm/` | 200 | |
| `/use-cases/pipeline-management/` | 200 | |
| `/industries/hospitality/` | 200 | |
| `/tools/crm-finder/` | 200 | many affiliate signals |
| `/research/crm-pricing/` | 200 | |
| `/de/crm/` | **301** | → `/categories/crm/` |
| `/nl/` | **410** | x-robots-tag noindex |
| `/miocommerce-review/` | **308** | → `/software/miocommerce/` |

---

## Phases 4–6 — Estate / lifecycle / phantoms

| | Previous | Current | Δ |
| --- | --- | --- | --- |
| Prerendered routes | 13653 | 13653 | 0 |
| Live sitemap URLs | ~3093 | **3093** | 0 |
| Reconcile discrepancies | 0 | **0** | 0 |
| Lifecycle orphans | 0 | **0** | 0 |
| Unexpected Cartesian explosion | — | **not observed** | |

Sitemap ↔ lifecycle by type: disc=0 for guides/comparisons/software/alternatives/categories/tools/research (see `SITEMAP-LIFECYCLE-RECONCILIATION.md`).

Phantom INDEXABLE (entity missing / 404): **0** remaining (FR-016 held). Prior remediation demoted 57.

---

## Phases 7–10 — Quality / uniqueness / guides / compares

| Risk metric | Previous | Current | Δ |
| --- | --- | --- | --- |
| Factory product-pack guides | 1272 | **1272** | 0 |
| high-near-duplicate-risk | 1272 | **1272** | 0 |
| limited-unique-analysis signals | 1373 | **1373** | 0 |
| Compare semantic-template mentions | 59 | **59** | 0 |
| INDEXABLE editorial_completeness fails | 0 | **0** | 0 |
| INDEXABLE & searchIndexable=false | 0 | **0** | 0 |

### Guides lifecycle

| | Prev review | Current |
| --- | --- | --- |
| INDEXABLE | 472 | 472 |
| IMPROVE | 1124 | 1124 |
| INDEXABLE_READY | 1 | 1 |
| MANUAL_REVIEW | 118 | 118 |
| Factory IMPROVE / INDEXABLE / MANUAL | — | 1056 / 200 / 16 |

**Promotions since previous review:** factory **0** · compare **0** (gates held; waves produced material edits without promote).

### Compare lifecycle

| | Current |
| --- | --- |
| INDEXABLE | 1699 |
| IMPROVE | 1711 |
| INDEXABLE_READY | 0 |
| MANUAL_REVIEW | 590 |

---

## Phases 11–12 — Software evidence

| | Previous | Current | Δ |
| --- | --- | --- | --- |
| Catalogue | 315 | 315 | 0 |
| RESEARCHED | 228 | 228 | 0 |
| DATA_VERIFIED (reconcile accepted) | 85 | **85** | 0 |
| HANDS_ON | 0 | **0** | 0 |

Integrity: reconcile still rejects `domain_checked_at` / import-time stamps. No fabricated HANDS_ON.

---

## Phases 13–14 — Linking + sitemaps

KG **6785 / 26853** (flat). IMPROVE sample orphans **80/80**. No measurable new contextual link growth since prior review.

Sitemap: **15** children · **3093** URLs · HTTP 200 · disc=0.

---

## Phases 15–18 — GSC / opportunities / coverage

| | Value |
| --- | --- |
| Freshness | **STALE** (dataThrough **2026-08-13**, imported 2026-08-15) |
| Clicks / impressions / pos | **8 / 115,457 / 74.5** (identical) |
| Pages w/ impressions | 995 |
| page×query matrix | **false** → DIRECT_GSC=0 |
| Provenance on ranked set | INFERRED 69 · UNKNOWN 22 · DIRECT 0 |
| Coverage snapshot | Indexed **1527** · notIndexed **4504** (sheet date 2026-08-07) — **NOT YET MEASURABLE** post-deploy |
| Trend confidence | **NOT_CONNECTED** (single period) |

Lane A: indexed-improvement queue length 50; **no evidence of new promotions on high-impression URLs** since prior review. High-imp examples still deep (e.g. hospitality 2526 imp / pos~88, CRM category 1903 / ~83).

---

## Phases 19–23 — Pricing / authority / research / commercial / AI

| Area | Current |
| --- | --- |
| Pricing monitor | needsVerification **1** · growthSignals **45** · confirmed published **0** |
| Authority | **NOT_CONNECTED** |
| Research | CRM pricing live + sitemap; still under-cited for PR |
| Commercial | programmes **94/315** · clicks **REAL (0 events)** · conversions/revenue **NOT_CONNECTED** |
| AI visibility | **NOT_CONNECTED** (fixture gated) |

---

## Phases 24–27 — Buyer / perf / a11y / security (sample)

Buyer read (publication vs programmatic): **mixed**. Stronger islands (`what-is-crm`, HubSpot software, CRM finder) feel editorial; factory packs remain noindex programmatic; Pipedrive alternatives still thin; best/CRM category pages heavy HTML.

Performance: homepage **393KB** HTML (unchanged vs prior ~393KB). No field CWV.

Security/hygiene: growth dashboard remains data/docs internal; no new public debug routes found in this pass. Affiliate `/go/` + sponsored signals present on commercial templates.

---

## Phases 28–31 — Scorecard / issues / promotion velocity

Overall **54/100** (previous **54**, Δ **0**). Dimension deltas all **0** vs remediation review (compatible methodology).

Promotion velocity since previous review: **processed waves earlier same day, but 0 new promotions after Review #1 stamp**. Loop produces structural IMPROVE without crossing semantic gates — correct behavior, not success yet.

---

## Phases 32–33 — 30-day + stop list

**Do next:** deploy www → fresh GSC+page×query → human top-10 tests → REAL backlinks → Lane A title/intro on high-imp URLs → factory IMPROVE only with promote gates.

**Stop:** new URL factories · Cartesian compares · new SEO agents/dashboards · mass deletion · fixture metrics as status · low-demand packs · AI-completing HANDS_ON.

---

## Phase 34 — Verdict checklist

1. Deployable? **Yes (minor issues)**  
2. Eng improved vs original? **Yes (held)**  
3. Crawl architecture healthy? **Yes**  
4. Indexable estate stronger? **Held; not newly stronger**  
5. Template risk declining? **No (flat)**  
6. Improve→promote real quality? **Not yet (0 promo)**  
7. Software data quality? **Held at DV85**  
8. Evidence? **No HO progress**  
9. Internal linking? **Flat**  
10. Organic performance? **Unchanged / STALE**  
11. Authority measurable? **No**  
12. Commercial measurable end-to-end? **No (clicks only)**  
13. Largest blocker? **Stale GSC + no authority + template uniqueness at scale**  
14. Top 5 issues: FR-001/005, FR-002, FR-003, FR-004, FR-010  
15. Top 5 actions: deploy; fresh GSC; human tests; backlink export; Lane A enrich  
