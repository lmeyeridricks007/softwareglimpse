# Improve batch — 2026-09-06

First serious existing-content improve → reanalyze → promote batch (30 pages).

## Numbers

| Metric | Value |
| --- | ---: |
| Pages processed | 30 |
| Pages materially improved | 29 |
| Pages promoted this batch | 8 |
| Pages still blocked | 1 |
| Average quality delta | 0.43 |

## Selection

- Lane A / highest-confidence page-level GSC demand
- Excluded target-query-driven selection when mapping was LOW-only inferred
- 10 guides · 10 comparisons · 8 software + 2 categories

## Common blockers

- **1×** cross_category_undeclared — left IMPROVE; nonsensical comparison relationship
- **1×** nonsensical_comparison

## Scoreboard

| Path | Before | After | Δ | Life before → after | Improved | Promoted | Blocked |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| /guides/zoho-crm-setup/ | 77 | 75 | -2 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/how-to-choose-crm/ | 96 | 96 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /guides/what-is-crm/ | 89 | 90 | 1 | INDEXABLE → INDEXABLE | yes |  |  |
| /guides/hubspot-plans/ | 95 | 95 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/is-hubspot-worth-it/ | 95 | 95 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/getresponse-plans/ | 95 | 95 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/keap-plans/ | 95 | 95 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/is-keap-worth-it/ | 95 | 95 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/capsule-plans/ | 95 | 95 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/zoho-crm-plans/ | 95 | 95 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /compare/salesforce-vs-siebel/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/pipedrive-vs-salesforce/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/insightly-vs-salesforce/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/pega-vs-salesforce/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/hubspot-vs-pipedrive/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/hubspot-vs-insightly/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/monday-sales-crm-vs-salesforce/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/salesforce-vs-sugarcrm/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/salesforce-vs-sap/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/hubspot-vs-tidio/ | 89 | 89 | 0 | IMPROVE → IMPROVE |  |  | yes |
| /software/hubspot/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/getresponse/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/keap/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/capsule/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/sanebox/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/closely/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/nimble/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/diginius/ | 91 | 91 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /categories/crm/ | 40 | 49 | 9 | INDEXABLE → INDEXABLE | yes |  |  |
| /categories/ecommerce/ | 39 | 44 | 5 | INDEXABLE → INDEXABLE | yes |  |  |

## Artifacts

- `data/seo/batches/improve-batch-2026-09-06.json`
- `data/seo/batches/improve-batch-2026-09-06-summary.json`
- `data/seo/batches/improve-batch-2026-09-06-linking.json` — contextual inbound plan/apply
- `data/seo/link-injections.json` — non-guide referrer edges (product/hub/best/…)
- Guide overlays: `data/seo/guide-enrichment-overlays/`
- Compare overlays: `data/seo/compare-enrichment-overlays/`

## Knowledge-graph linking (post-batch)

Integrated via `npm run seo:improve-linking -- --batch improve-batch-2026-09-06`.

| Metric | Value |
| --- | ---: |
| Pages eligible for inbound | 29 |
| Skipped (weak/blocked) | 1 |
| Opportunities applied | 98 |

Eligibility requires meaningful quality lift **and** user value — not orphan-count chasing. Promote to INDEXABLE now also checks ≥2 meaningful inbound, hub path, and outbound next steps (`MISSING_INTERNAL_LINKS` when quality is ready but links are not).
