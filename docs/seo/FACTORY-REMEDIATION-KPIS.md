# Factory-origin vs quality KPIs

**Date:** 2026-09-10  
**Do not change quality/semantic thresholds.**

## What `factoryPackCount` actually is

`factoryPackCount` counts guide pages whose slug matches a **factory product-pack family**:

- `{product}-implementation`
- `{product}-migration`
- `{product}-setup`
- `{product}-plans`
- `is-{product}-worth-it`

That is **FACTORY_ORIGIN_TOTAL**: inventory of pages *created from* those families.

It **does not** mean “pages currently failing uniqueness.” A factory-origin page that is fully unique, quality-gated, and INDEXABLE is still factory-origin. **Do not try to reduce FACTORY_ORIGIN_TOTAL.** Review #5 treating a stable 1272 as a major KPI failure was **conceptually incorrect**.

## Semantic uniqueness (unchanged thresholds)

For factory/explainer pages, `duplicateNearDuplicateRisk` comes from `assessGuideSemanticTemplateRisk` against overlay-merged estate siblings (`SEMANTIC_SIMILARITY_*`). Fail-closed to **high** when no sibling assessment exists.

`limited-unique-analysis-signals` for template-heavy pages requires ≥2 canonical semantic unique signals **and** sibling risk not `high`. Block-type presence alone does not count as unique analysis.

Estate-wide `highNearDuplicateRiskCount` / `limitedUniqueAnalysisCount` include **non-factory** guides too. Factory remediation KPIs are the **factory-origin subset**.

## Remediation KPIs (what should move)

| KPI | Meaning | Desired |
| --- | --- | --- |
| FACTORY_ORIGIN_TOTAL | Pages created from factory families | **Stable** (inventory) |
| FACTORY_HIGH_RISK | Factory-origin failing semantic uniqueness (`high-near-duplicate-risk`) | ↓ |
| FACTORY_LIMITED_UNIQUE | Factory-origin lacking sufficient unique analysis | ↓ |
| FACTORY_QUALITY_PASS | Factory-origin passing current quality gate | ↑ |
| FACTORY_INDEXABLE | Factory-origin legitimately INDEXABLE | ↑ |
| FACTORY_IMPROVE | Factory-origin still IMPROVE / IMPROVING | ↓ |
| FACTORY_PROMOTED | Factory-origin promoted after remediation (= INDEXABLE) | ↑ |

Source: `src/services/seo/guides-index-worthiness/factory-kpis.ts` via `npm run seo:guides-audit`. Growth dashboard reads the same fields from `data/seo/guides-audit.json`.
