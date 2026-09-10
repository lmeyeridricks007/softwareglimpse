# Factory remediation ↔ estate audit measurement fix (2026-09-09)

## Root cause (A + B + C)

| Code | Finding |
| --- | --- |
| **A** | `runGuidesIndexAudit` evaluated seed guides only — never `mergeGuideWithOverlay`. |
| **B** | Factory-pack waves persist improvements as overlay JSON, not seed rewrites. |
| **C** | Wave “semantic risk reduced” scored enriched pages against **seed** peers; estate siblings with the same overlay family stay near-identical (e.g. `slack-plans` vs `dialpad-plans` intro sim **1.0** merged, **0.50** vs seeds). |
| **D** (secondary) | Wave counted a **0.02** similarity drop as risk reduced even without a riskLevel drop. |
| **E** | Not stale cache — counts were structurally fixed to slug-class. |
| **F** | Promoted packs can still fail estate sibling uniqueness (20 of 21 in this batch). |

Previously the estate audit also **hardcoded** every factory pack as `duplicateNearDuplicateRisk: "high"` and forced `limited-unique-analysis-signals` via `guideBodyHasUniqueAnalysis` without `allowEnrichedFactory` — so 1272 / 1373 could not move.

## Fix implemented

1. Guides audit merges enrichment overlays (same path as public routes / quality gate).
2. Near-dup risk for factory/explainers comes from `assessGuideSemanticTemplateRisk` against **overlay-merged** peers (same `SEMANTIC_SIMILARITY_*` thresholds). Unenriched factory packs fail closed as high.
3. `limited-unique-analysis-signals` for template-heavy pages requires ≥2 canonical semantic unique signals and non-high sibling risk — not mere template block types.
4. Summary exposes `highNearDuplicateRiskCount` / `limitedUniqueAnalysisCount` separately from `factoryPackCount` inventory.
5. Factory-pack wave after-score uses merged peers; `semanticRiskReduced` requires an actual riskLevel drop.

Thresholds were **not** lowered.

## Estate results (after full `npm run seo:guides-audit`)

| Metric | Before (Review #3) | After |
| --- | ---: | ---: |
| Factory pack inventory | 1272 | 1272 |
| Factory high-near-duplicate-risk | 1272 | **1247** |
| Limited unique-analysis (estate) | 1373 | **1349** |

### Factory-pack-100 batch

| | |
| --- | ---: |
| Processed | 100 |
| Overlays present | 100 |
| Actually cleared estate high-near-dup | **1** (`fastmail-setup`) |
| Still failing high-near-dup | **99** |
| Promoted but still risky | **20** |

Artifact: `data/seo/batches/factory-remediation-measurement-fix-2026-09-09/verification.json`
