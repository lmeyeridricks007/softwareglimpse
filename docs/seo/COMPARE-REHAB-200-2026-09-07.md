# Comparison estate rehabilitation — next 200 (2026-09-07)

Existing `/compare/` URLs only. Batches of 25. No new combinations. No deletes.
Selection: Lane A → B → C with real GSC + competitor/commercial signals.

**Completed full wave.**

## Results

| Metric | Value |
| --- | ---: |
| Selected | 200 |
| Processed | 200 |
| Improved (overlay applied) | 200 |
| Promoted | 124 |
| Still IMPROVE | 76 |
| Invalid relationships | 0 |
| Manual review | 0 |
| Average quality Δ | 5.2 |
| Promotion rate | 62.0% |
| Internal links added | 182 |
| Batches completed | 8 |

## Top blockers (still IMPROVE)

All **76** non-promoted pages share a **relationship gate**: `same_category_only` (same-category pairs without competitor / co-appear / commercial signals strong enough to index). Enrichment was applied; promote correctly refused.

During batch promote attempts, transient blockers also included inbound-link readiness and sibling semantic risk; final re-promote of already-INDEXABLE pages reported “Already indexable” (not a failure).

## Most successful comparison categories

- email-marketing: 100% (11/11)
- marketing: 100% (11/11)
- sales-intelligence: 100% (11/11)
- live-chat: 100% (10/10)
- helpdesk-ticketing: 100% (6/6)
- voip-business-phone: 100% (6/6)
- analytics-bi: 100% (4/4)
- dropshipping-pod: 100% (4/4)

## Least successful (held by relationship policy)

- crm: 0% (0/7) — mostly weak same-category mesh
- it-development: 5% (1/21)
- project-management: 33% (4/12)
- ai: 41% (9/22)
- business-communications: 43% (9/21)

## Batch log

| Batch | Applied | Promoted | Invalid | Links | Sem | Δ | Family | Audits | Stop |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | 25 | 23 | 0 | 44 | 2 | 13.88 | ok | cmp/kg/sm |  |
| 2 | 25 | 17 | 0 | 24 | 8 | 7.6 | ok | cmp/kg/sm |  |
| 3 | 25 | 17 | 0 | 16 | 8 | 6.08 | ok | cmp/kg/sm |  |
| 4 | 25 | 17 | 0 | 12 | 8 | 4.56 | ok | cmp/kg/sm |  |
| 5 | 25 | 15 | 0 | 10 | 10 | 4.56 | ok | cmp/kg/sm |  |
| 6 | 25 | 12 | 0 | 4 | 13 | 1.52 | ok | cmp/kg/sm |  |
| 7 | 25 | 12 | 0 | 35 | 13 | 2.24 | ok | cmp/kg/sm |  |
| 8 | 25 | 11 | 0 | 37 | 14 | 1.12 | ok | cmp/kg/sm |  |

## What changed to unlock promote

- Pair-specific decision copy (`Choose X only if`, poor-fit, workflow advantage, limitations, trade-offs).
- Preserve factory win mesh (≥2 product-a/b outcomes) while rewriting reasons — clears thin-mesh without clone pros/cons.
- YES / NO / PARTIAL / UNKNOWN capability labels; missing ≠ NO.
- Honest evidence disclaimers; asymmetric when only one product is tested.
- Link injections before promote; post-batch compare audit + knowledge graph + sitemap reconcile.

## Process notes (next 200)

- Prefer queue rows with indexable relationship kinds; deprioritize or skip `same_category_only` unless competitor/co-appear evidence upgrades them.
- Re-apply overlays after skeleton changes before expecting promote lifts.
- Capability cells: YES / NO / PARTIAL / UNKNOWN — never map missing→NO.
- Evidence disclaimers must stay asymmetric when only one product is hands-on tested.
- Re-promote after improve-linking in chunks of 25; load lifecycle before queueing.
- Invalid relationships (`cross_category_undeclared`) stay IMPROVE — do not fabricate comparability.

Artifacts: `data/seo/batches/compare-rehab-200-2026-09-07/`
