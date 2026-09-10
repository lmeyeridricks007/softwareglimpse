# Guide enrichment system

**Generated:** 2026-09-10T15:09:20.027Z
**Engine:** guide-enrichment v2.0.0

Progressive enrichment of **existing** guide URLs. Weak/noindex pages stay live, get type-specific blueprints + real SoftwareGlimpse data, then promote only when quality gates pass. No replacement URLs.

Execution lanes separate **proven search demand** from strategic catalogue work. Zero-impression pages are preserved — they do not outrank strong GSC opportunities.

## Summary

| Metric | Count |
| --- | ---: |
| Improvement queue | 571 |
| Default batch size | 30 |
| Ready-for-promotion (estimate) | 1 |
| Batch mix (A/B/C) | 65% / 25% / 10% |

## Queue by lane

| Lane | Meaning | Count |
| --- | --- | ---: |
| A | Proven search demand (GSC / REAL citations / backlinks) | 0 |
| B | Strategic existing content (no meaningful GSC yet) | 525 |
| C | Long-tail improvement — preserve, enrich after A/B | 46 |

## Queue by enrichment type

| Type | Count |
| --- | ---: |
| IMPLEMENTATION_GUIDE | 157 |
| DECISION_GUIDE | 150 |
| COST_GUIDE | 144 |
| MIGRATION_GUIDE | 92 |
| CATEGORY_EDUCATION | 22 |
| PRODUCT_EXPLAINER | 6 |

## Quality blueprints

### CATEGORY_EDUCATION

Category education: what it solves, who needs it, workflows, capabilities, pricing from SG data, mistakes, products, next step.

- Required: problem_or_definition, who_needs_it, workflows, capabilities, implementation, pricing_expectations, common_mistakes, candidate_products, next_decision
- Optional: tradeoffs, checklist, evidence
- Min unique elements: 4

### BUYING_GUIDE

Buying guide: criteria, shortlist, tradeoffs, pricing, checklist.

- Required: problem_or_definition, requirements, capabilities, candidate_products, tradeoffs, pricing_expectations, checklist, next_decision
- Optional: scenario_analysis, comparisons, evidence
- Min unique elements: 4

### IMPLEMENTATION_GUIDE

Implementation: workflow, constraints, mistakes, checklist.

- Required: problem_or_definition, requirements, implementation, workflows, common_mistakes, checklist, next_decision
- Optional: integrations, pricing_expectations, evidence
- Min unique elements: 3

### USE_CASE_GUIDE

Use-case: problem → requirements → capabilities → candidates → checklist.

- Required: problem_or_definition, who_needs_it, requirements, workflows, capabilities, candidate_products, tradeoffs, pricing_expectations, checklist, next_decision
- Optional: scenario_analysis, evidence
- Min unique elements: 4

### INDUSTRY_GUIDE

Industry: workflows, constraints, integrations, evaluation criteria, candidates.

- Required: problem_or_definition, workflows, requirements, industry_constraints, integrations, implementation, candidate_products, checklist, next_decision
- Optional: pricing_expectations, evidence
- Min unique elements: 4

### PRODUCT_EXPLAINER

Product explainer (what-is-{product}): informational orientation — what it is, who uses it, workflows, capabilities, limits, pricing shape, integrations, alternatives, when to consider — distinct from the commercial product review.

- Required: problem_or_definition, who_needs_it, workflows, capabilities, limitations, pricing_expectations, integrations, alternatives, comparisons, checklist, evidence, next_decision
- Optional: tradeoffs, scenario_analysis
- Min unique elements: 5

### FEATURE_GUIDE

Feature guide: capability meaning, when it matters, product coverage.

- Required: problem_or_definition, capabilities, workflows, candidate_products, tradeoffs, next_decision
- Optional: checklist, evidence
- Min unique elements: 3

### COST_GUIDE

Cost guide: real plan structure, free/trial, TCO tradeoffs — never invent prices.

- Required: problem_or_definition, pricing_expectations, tradeoffs, candidate_products, checklist, next_decision
- Optional: scenario_analysis, evidence
- Min unique elements: 3

### MIGRATION_GUIDE

Migration: cutover risks, data mapping, checklist.

- Required: problem_or_definition, requirements, implementation, common_mistakes, checklist, next_decision
- Optional: integrations, candidate_products, evidence
- Min unique elements: 3

### INTEGRATION_GUIDE

Integration: systems, patterns, product coverage.

- Required: problem_or_definition, integrations, workflows, requirements, candidate_products, next_decision
- Optional: checklist, evidence
- Min unique elements: 3

### DECISION_GUIDE

Decision: framework, scenarios, shortlist, next action.

- Required: problem_or_definition, requirements, tradeoffs, candidate_products, scenario_analysis, checklist, next_decision
- Optional: pricing_expectations, comparisons, evidence
- Min unique elements: 4

### OTHER

Fallback — keep flexible; do not force a mismatched template.

- Required: problem_or_definition, next_decision
- Optional: checklist, evidence
- Min unique elements: 2

## Top Lane A — Proven search demand

_Highest execution priority. Real GSC impressions/clicks/position, direct page×query when available, known backlinks, or REAL AI citations. Demand is never fabricated._

| Rank | URL | Type | Lane | Overall | GSC demand | Strategic | Quality gap | Commercial | Authority | Override | GSC impr. | Reason |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |

## Top Lane B — Strategic existing content

_No meaningful GSC demand yet, but important category / popular product / commercial relevance / journey / buyer question. Explicit strategic override — not invented search demand._

| Rank | URL | Type | Lane | Overall | GSC demand | Strategic | Quality gap | Commercial | Authority | Override | GSC impr. | Reason |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | /guides/what-is-keap/ | PRODUCT_EXPLAINER | B | 137.03 | 0 | 97.3 | 25 | 16.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 2 | /guides/what-is-hubspot/ | PRODUCT_EXPLAINER | B | 137.03 | 0 | 97.3 | 25 | 16.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 3 | /guides/is-greenhouse-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 4 | /guides/gusto-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 5 | /guides/is-gusto-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 6 | /guides/hibob-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 7 | /guides/is-hibob-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 8 | /guides/homebase-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 9 | /guides/is-homebase-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 10 | /guides/lever-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 11 | /guides/is-lever-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 12 | /guides/oracle-hcm-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 13 | /guides/is-oracle-hcm-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 14 | /guides/paycor-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 15 | /guides/is-paycor-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 16 | /guides/paylocity-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 17 | /guides/is-paylocity-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 18 | /guides/personio-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 19 | /guides/is-personio-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 20 | /guides/ukg-pro-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 21 | /guides/is-ukg-pro-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 22 | /guides/when-i-work-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 23 | /guides/is-when-i-work-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 24 | /guides/workable-plans/ | COST_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 25 | /guides/is-workable-worth-it/ | DECISION_GUIDE | B | 117.45 | 0 | 84.5 | 21 | 30 | 0 | yes | 0 | Lane B — strategic existing content (HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |

## Top Lane C — Long-tail improvement

_Existing valid pages with no current demand and no strong business priority. Preserve and improve progressively after A/B._

| Rank | URL | Type | Lane | Overall | GSC demand | Strategic | Quality gap | Commercial | Authority | Override | GSC impr. | Reason |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | /guides/servicenow-implementation/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 2 | /guides/servicenow-migration/ | MIGRATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 3 | /guides/servicenow-setup/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 4 | /guides/siteground-implementation/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 5 | /guides/siteground-migration/ | MIGRATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 6 | /guides/siteground-setup/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 7 | /guides/smartproxy-implementation/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 8 | /guides/smartproxy-migration/ | MIGRATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 9 | /guides/smartproxy-setup/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 10 | /guides/splunk-implementation/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 11 | /guides/splunk-migration/ | MIGRATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 12 | /guides/splunk-setup/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 13 | /guides/squadcast-implementation/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 14 | /guides/squadcast-migration/ | MIGRATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 15 | /guides/squadcast-setup/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 16 | /guides/sysaid-implementation/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 17 | /guides/sysaid-migration/ | MIGRATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 18 | /guides/sysaid-setup/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 19 | /guides/topdesk-implementation/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 20 | /guides/topdesk-migration/ | MIGRATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 21 | /guides/topdesk-setup/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 22 | /guides/wp-engine-implementation/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 23 | /guides/wp-engine-migration/ | MIGRATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 24 | /guides/wp-engine-setup/ | IMPLEMENTATION_GUIDE | C | 35.84 | 0 | 47.75 | 21 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 25 | /guides/what-is-social-media-marketing-software/ | CATEGORY_EDUCATION | C | 25.05 | 0 | 19 | 17 | 8 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |

## Latest batch

- Batch size: 2
- Applied overlays: 0
- Promoted: 0
- Skipped promotion: 2
- Queue remaining (approx): 567
- Family QA: **FLAGGED** (1 shared patterns)
  - Family QA flagged: ≥35% of batch pages share thesis/recommendation/skeleton patterns
  - recommendation: 100% share (2 pages) — “common alternatives peers catalogue relationships comparisons understa…”

## Operating rules

1. Default batch mix ≈ **65% Lane A / 25% Lane B / 10% Lane C** (configurable via `laneAllocation`).
2. A zero-impression page may not outrank Lane A unless `strategicOverride === true` (Lane B only) with an explicit reason.
3. Semantic template risk (interchangeable analysis after stripping names/prices) blocks auto-promote — stay IMPROVE or MANUAL_REVIEW.
4. Process batches of 20–50 — do not rewrite 1,300 guides blindly.
5. Use real catalogue/pricing/research data; omit unsupported sections.
6. Reject generic filler and near-duplicate intros/conclusions (QA).
7. Promote only via `validateAndMaybePromoteGuide` → content-lifecycle.
8. Overlays live in `data/seo/guide-enrichment-overlays/{slug}.json`.
9. Never fabricate GSC demand; FIXTURE AI/backlink inputs do not count for Lane A.

## Machine-readable output

- `data/seo/guide-enrichment.json`
- Semantic history: `data/seo/content-quality-gate-history.json` (`semanticRecords`, `familyQaRecords`)

