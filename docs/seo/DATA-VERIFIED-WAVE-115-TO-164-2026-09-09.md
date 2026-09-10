# DATA_VERIFIED coverage wave — 115 → 164 (2026-09-09)

Live vendor plan confirmation only. No manufactured stamps. No HANDS_ON fabrication.

Timestamps that **do not** count: `generatedAt`, `domainCheckedAt`, import/file/migration mtimes.

## Selection

`buildProductTestingQueue` priority: GSC opportunity → comparison usage → commercial / category / Lane A. Pass 2 deferred recent live failures (`http_403`, `plan_hit_ratio`, …) so the wave spent budget on fresher candidates.

## Results

| Metric | Value |
| --- | ---: |
| Starting DATA_VERIFIED | **115** |
| Products processed (unique across 2 passes) | 96 |
| New verified (stamped this run) | **49** |
| Ending DATA_VERIFIED | **164** |
| Blocked live | 49 |
| Rejected mass/twin stamps (reconcile leftover) | 151 |
| Pricing consistency conflicts (samples) | 0 |
| Downstream dependents flagged | ≈1753 |

### Blocked reasons

| Reason | Count |
| --- | ---: |
| http_403 | 25 |
| plan_hit_ratio_below_0.75 | 20 |
| http_404 | 2 |
| http_429 | 1 |
| fetch_failed | 1 |

### Passes

| Pass | Before → After | Promoted | Blocked | Deps |
| --- | ---: | ---: | ---: | ---: |
| 1 (`evidence-wave-50-2026-09-09`) | 115 → 130 | 15 | 34 | 707 |
| 2 (`…-pass2`) | 130 → 164 | 34 | 15 | 1046 |

Reconciliation after each batch of 25. Downstream: `runSoftwareEnrichmentBatch` on newly stamped products; pages read canonical enrichment `pricing.verifiedAt` + `sourceIds` (no duplicated price files).

## Goal

Target ≥150: **met (164)**. Coverage improved only where vendor HTML confirmed catalogue plan names.
