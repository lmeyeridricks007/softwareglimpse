# Guide enrichment system

**Generated:** 2026-09-06T19:36:19.751Z
**Engine:** guide-enrichment v2.0.0

Progressive enrichment of **existing** guide URLs. Weak/noindex pages stay live, get type-specific blueprints + real SoftwareGlimpse data, then promote only when quality gates pass. No replacement URLs.

Execution lanes separate **proven search demand** from strategic catalogue work. Zero-impression pages are preserved — they do not outrank strong GSC opportunities.

## Summary

| Metric | Count |
| --- | ---: |
| Improvement queue | 1370 |
| Default batch size | 30 |
| Ready-for-promotion (estimate) | 98 |
| Batch mix (A/B/C) | 65% / 25% / 10% |

## Queue by lane

| Lane | Meaning | Count |
| --- | --- | ---: |
| A | Proven search demand (GSC / REAL citations / backlinks) | 1 |
| B | Strategic existing content (no meaningful GSC yet) | 982 |
| C | Long-tail improvement — preserve, enrich after A/B | 387 |

## Queue by enrichment type

| Type | Count |
| --- | ---: |
| IMPLEMENTATION_GUIDE | 506 |
| DECISION_GUIDE | 260 |
| COST_GUIDE | 253 |
| MIGRATION_GUIDE | 253 |
| PRODUCT_EXPLAINER | 98 |

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
| 1 | /guides/zoho-crm-setup/ | IMPLEMENTATION_GUIDE | A | 129.49 | 63.09 | 67 | 30 | 18 | 0 | — | 44 | Lane A — proven search demand (GSC impressions/clicks/position) |

## Top Lane B — Strategic existing content

_No meaningful GSC demand yet, but important category / popular product / commercial relevance / journey / buyer question. Explicit strategic override — not invented search demand._

| Rank | URL | Type | Lane | Overall | GSC demand | Strategic | Quality gap | Commercial | Authority | Override | GSC impr. | Reason |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | /guides/capsule-plans/ | COST_GUIDE | B | 166.03 | 0 | 119.3 | 31 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 2 | /guides/hubspot-plans/ | COST_GUIDE | B | 166.03 | 0 | 119.3 | 31 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 3 | /guides/is-capsule-worth-it/ | DECISION_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 4 | /guides/close-plans/ | COST_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 5 | /guides/is-close-worth-it/ | DECISION_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 6 | /guides/folk-plans/ | COST_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 7 | /guides/is-folk-worth-it/ | DECISION_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 8 | /guides/freshsales-plans/ | COST_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 9 | /guides/is-freshsales-worth-it/ | DECISION_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 10 | /guides/is-hubspot-worth-it/ | DECISION_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 11 | /guides/keap-plans/ | COST_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 12 | /guides/is-keap-worth-it/ | DECISION_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 13 | /guides/pipedrive-plans/ | COST_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 14 | /guides/is-pipedrive-worth-it/ | DECISION_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 15 | /guides/salesflare-plans/ | COST_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 16 | /guides/is-salesflare-worth-it/ | DECISION_GUIDE | B | 165.48 | 0 | 119.3 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 17 | /guides/amplemarket-plans/ | COST_GUIDE | B | 161.28 | 0 | 115.8 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 18 | /guides/is-amplemarket-worth-it/ | DECISION_GUIDE | B | 161.28 | 0 | 115.8 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 19 | /guides/apollo-plans/ | COST_GUIDE | B | 161.28 | 0 | 115.8 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 20 | /guides/is-apollo-worth-it/ | DECISION_GUIDE | B | 161.28 | 0 | 115.8 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 21 | /guides/bookyourdata-plans/ | COST_GUIDE | B | 161.28 | 0 | 115.8 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 22 | /guides/closely-plans/ | COST_GUIDE | B | 161.28 | 0 | 115.8 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 23 | /guides/is-closely-worth-it/ | DECISION_GUIDE | B | 161.28 | 0 | 115.8 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 24 | /guides/lusha-plans/ | COST_GUIDE | B | 161.28 | 0 | 115.8 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |
| 25 | /guides/is-lusha-worth-it/ | DECISION_GUIDE | B | 161.28 | 0 | 115.8 | 30 | 38.8 | 0 | yes | 0 | Lane B — strategic existing content (IMPORTANT_CATEGORY, POPULAR_PRODUCT, HIGH_COMMERCIAL_RELEVANCE, IMPORTANT_BUYER_QUESTION); no meaningful GSC demand yet |

## Top Lane C — Long-tail improvement

_Existing valid pages with no current demand and no strong business priority. Preserve and improve progressively after A/B._

| Rank | URL | Type | Lane | Overall | GSC demand | Strategic | Quality gap | Commercial | Authority | Override | GSC impr. | Reason |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| 1 | /guides/saleor-implementation/ | IMPLEMENTATION_GUIDE | C | 46.15 | 0 | 53 | 31 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 2 | /guides/7shifts-implementation/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 3 | /guides/7shifts-migration/ | MIGRATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 4 | /guides/7shifts-setup/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 5 | /guides/adp-workforce-now-implementation/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 6 | /guides/adp-workforce-now-migration/ | MIGRATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 7 | /guides/adp-workforce-now-setup/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 8 | /guides/ashby-implementation/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 9 | /guides/ashby-migration/ | MIGRATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 10 | /guides/ashby-setup/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 11 | /guides/bamboohr-implementation/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 12 | /guides/bamboohr-migration/ | MIGRATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 13 | /guides/bamboohr-setup/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 14 | /guides/dayforce-implementation/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 15 | /guides/dayforce-migration/ | MIGRATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 16 | /guides/dayforce-setup/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 17 | /guides/deputy-implementation/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 18 | /guides/deputy-migration/ | MIGRATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 19 | /guides/deputy-setup/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 20 | /guides/greenhouse-implementation/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 21 | /guides/greenhouse-migration/ | MIGRATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 22 | /guides/greenhouse-setup/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 23 | /guides/gusto-implementation/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 24 | /guides/gusto-migration/ | MIGRATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |
| 25 | /guides/gusto-setup/ | IMPLEMENTATION_GUIDE | C | 46.13 | 0 | 56.5 | 30 | 18 | 0 | — | 0 | Lane C — long-tail improvement; preserve and enrich after A/B |

## Latest batch

- Batch size: 30
- Applied overlays: 0
- Promoted: 0
- Skipped promotion: 24
- Queue remaining (approx): 1340

## Operating rules

1. Default batch mix ≈ **65% Lane A / 25% Lane B / 10% Lane C** (configurable via `laneAllocation`).
2. A zero-impression page may not outrank Lane A unless `strategicOverride === true` (Lane B only) with an explicit reason.
3. Process batches of 20–50 — do not rewrite 1,300 guides blindly.
4. Use real catalogue/pricing/research data; omit unsupported sections.
5. Reject generic filler and near-duplicate intros/conclusions (QA).
6. Promote only via `validateAndMaybePromoteGuide` → content-lifecycle.
7. Overlays live in `data/seo/guide-enrichment-overlays/{slug}.json`.
8. Never fabricate GSC demand; FIXTURE AI/backlink inputs do not count for Lane A.

## Machine-readable output

- `data/seo/guide-enrichment.json`

