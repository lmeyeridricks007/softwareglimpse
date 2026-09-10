# Comparison estate rehabilitation — next 200 (2026-09-08)

Existing `/compare/` URLs only. Batches of 25. No new combinations. No deletes.
Selection: Lane A → B → C with real GSC + competitor/commercial signals; prior-wave (2026-09-07) slugs excluded; preferred `data_backed_comparable` + thesis.

## INDEXABLE_READY (first)

Comparison INDEXABLE_READY queue was **already empty** after the earlier ready-queue pass (843 → MANUAL_REVIEW for semantic template risk; 0 promoted). Confirm run: `npm run seo:ready-queue -- --apply --persist --kind comparisons` → queue size 0. No manufactured indexability.

## IMPROVE / MANUAL_REVIEW rehab wave

**Completed full wave.** 200/200 promoted after enrich → link → promote → compare-audit / KG / sitemap each batch.

Note: enrichment queue admits **valid-relationship MANUAL_REVIEW** pairs (from prior ready triage) alongside IMPROVE. This wave largely rehabbed those pairs with pair-specific overlays; registry shows `previousLifecycle: MANUAL_REVIEW` → `INDEXABLE`.

| Metric | Value |
| --- | ---: |
| Selected | 200 |
| Processed | 200 |
| Improved (overlay applied) | 200 |
| Promoted | 200 |
| Still IMPROVE (this wave) | 0 |
| Invalid relationships | 0 |
| Manual review (this wave) | 0 |
| Average quality Δ | 0 |
| Promotion rate | 100.0% |
| Internal links added | 701 |
| Batches completed | 8 |
| Lane mix | B=200 (A=0 — no GSC demand on selected paths) |
| Relationship | data_backed_comparable × 200 |

## Top transient blockers (cleared by linking)

Before improve-linking, promote attempts reported inbound-link readiness gaps; after linking, all 200 promoted. Final re-promote pass: 0 new (already INDEXABLE).

## Most successful comparison categories

- business-communications: 100% (28/28)
- ecommerce: 100% (28/28)
- email-marketing: 100% (28/28)
- project-management: 100% (28/28)
- it-development: 100% (27/27)
- sales-intelligence: 100% (27/27)
- marketing: 100% (24/24)
- ai: 100% (6/6)

## Batch log

| Batch | Applied | Promoted | Invalid | Links | Sem | Δ | Family | Audits | Stop |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | 25 | 25 | 0 | 80 | 0 | 0 | ok | cmp/kg/sm |  |
| 2 | 25 | 25 | 0 | 84 | 0 | 0 | ok | cmp/kg/sm |  |
| 3 | 25 | 25 | 0 | 90 | 0 | 0 | ok | cmp/kg/sm |  |
| 4 | 25 | 25 | 0 | 87 | 0 | 0 | ok | cmp/kg/sm |  |
| 5 | 25 | 25 | 0 | 91 | 0 | 0 | ok | cmp/kg/sm |  |
| 6 | 25 | 25 | 0 | 91 | 0 | 0 | ok | cmp/kg/sm |  |
| 7 | 25 | 25 | 0 | 87 | 0 | 0 | ok | cmp/kg/sm |  |
| 8 | 25 | 25 | 0 | 91 | 0 | 0 | ok | cmp/kg/sm |  |

## Estate after wave (audit recount)

| Lifecycle | Count |
| --- | ---: |
| INDEXABLE | 1699 |
| IMPROVE | 1711 |
| INDEXABLE_READY | 0 |
| MANUAL_REVIEW | 590 |

Cumulative rehab: 124 (2026-09-07) + 200 (2026-09-08) = **324** promoted from progressive waves.

## Process notes (next 200)

- Prefer declared/data-backed relationships; keep `same_category_only` as IMPROVE unless evidence upgrades.
- Require a clear buyer question (thesis) before treating a pair as promote-ready.
- Capability cells: YES / NO / PARTIAL / UNKNOWN — never map missing→NO.
- Link before promote; post-batch compare audit + knowledge graph + sitemap reconcile.
- Invalid relationships stay IMPROVE — do not fabricate comparability.

Artifacts: `data/seo/batches/compare-rehab-200-2026-09-08/`
