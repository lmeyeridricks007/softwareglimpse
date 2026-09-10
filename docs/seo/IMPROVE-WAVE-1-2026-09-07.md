# Improvement Wave 1 — 2026-09-07

Existing-URL improve → unique overlays → promote (**50 pages**: 20 guides · 20 comparisons · 7 software · 1 best · 2 categories).

Selection uses **real page-level GSC** metrics. Inferred query mappings are not treated as direct GSC evidence.

## Results

| Metric | Value |
| --- | ---: |
| Processed | 50 |
| Materially improved | 50 |
| Promoted | 22 |
| Not promoted | 28 |
| Still blocked | 2 |
| Still IMPROVE (blocked) | 2 |
| Manual review (nonsensical compares) | 2 |
| Average score before | 89.4 |
| Average score after | 88.66 |
| Average quality Δ | -0.74 |
| Internal links added | 256 |
| Semantic-risk failures | 0 |

Lifecycle promotions are persisted in `data/seo/content-lifecycle.json` (promote-and-persist path fixed so batch promotions survive process exit).

## Top unresolved blockers

- **2×** nonsensical_comparison (`hubspot-vs-tidio`, `aircall-vs-kixie`) — left IMPROVE; no fabricated relationship
- **2×** gate (same pages)
- **1×** Intent invalid (same cluster)

## Scoreboard

| Path | Before | After | Δ | Life | Improved | Promoted | Blocked |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| /guides/zoho-crm-setup/ | 75 | 75 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/how-to-choose-crm/ | 96 | 96 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /guides/what-is-crm/ | 90 | 89 | -1 | INDEXABLE → INDEXABLE | yes |  |  |
| /guides/hubspot-plans/ | 95 | 92 | -3 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/is-hubspot-worth-it/ | 95 | 92 | -3 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/activecampaign-plans/ | 95 | 92 | -3 | IMPROVE → INDEXABLE | yes | yes |  |
| /guides/is-activecampaign-worth-it/ | 95 | 92 | -3 | IMPROVE → INDEXABLE | yes | yes |  |
| /guides/insightly-plans/ | 95 | 92 | -3 | IMPROVE → INDEXABLE | yes | yes |  |
| /guides/is-insightly-worth-it/ | 95 | 95 | 0 | IMPROVE → INDEXABLE | yes | yes |  |
| /guides/getresponse-plans/ | 95 | 92 | -3 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/keap-plans/ | 95 | 92 | -3 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/is-keap-worth-it/ | 95 | 92 | -3 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/capsule-plans/ | 95 | 92 | -3 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/is-capsule-worth-it/ | 92 | 92 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/closely-plans/ | 95 | 92 | -3 | IMPROVE → INDEXABLE | yes | yes |  |
| /guides/is-closely-worth-it/ | 92 | 92 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/lusha-plans/ | 92 | 92 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/is-lusha-worth-it/ | 92 | 92 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /guides/pipedrive-plans/ | 95 | 92 | -3 | IMPROVE → INDEXABLE | yes | yes |  |
| /guides/is-pipedrive-worth-it/ | 95 | 92 | -3 | IMPROVE → INDEXABLE | yes | yes |  |
| /compare/salesforce-vs-siebel/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/pipedrive-vs-salesforce/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/pega-vs-salesforce/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/hubspot-vs-pipedrive/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/insightly-vs-salesforce/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/salesforce-vs-sugarcrm/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/hubspot-vs-insightly/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/salesforce-vs-sap/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/monday-sales-crm-vs-salesforce/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/hubspot-vs-tidio/ | 89 | 89 | 0 | IMPROVE → IMPROVE | yes |  | yes |
| /compare/hubspot-vs-salesforce/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/capsule-vs-pipedrive/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/close-vs-pipedrive/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/freshsales-vs-hubspot/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/copper-vs-hubspot/ | 89 | 89 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /compare/bookyourdata-vs-reply/ | 89 | 89 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /compare/bookyourdata-vs-snov/ | 89 | 89 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /compare/campaign-monitor-vs-kit/ | 89 | 89 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /compare/aircall-vs-kixie/ | 63 | 63 | 0 | IMPROVE → IMPROVE | yes |  | yes |
| /compare/lusha-vs-snov/ | 89 | 89 | 0 | INDEXABLE_READY → INDEXABLE | yes | yes |  |
| /software/closely/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/diginius/ | 91 | 91 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/hubspot/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/capsule/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/sanebox/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/lusha/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /software/krispcall/ | 95 | 95 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /best/crm-software/ | 98 | 98 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /categories/ecommerce/ | 44 | 44 | 0 | INDEXABLE → INDEXABLE | yes |  |  |
| /categories/crm/ | 49 | 49 | 0 | INDEXABLE → INDEXABLE | yes |  |  |

## Artifacts

- `data/seo/batches/improve-wave-1-2026-09-07.json`
- `data/seo/batches/improve-wave-1-2026-09-07-summary.json`
- Guide overlays: `data/seo/guide-enrichment-overlays/`
- Compare overlays: `data/seo/compare-enrichment-overlays/`
- Linking: `data/seo/batches/improve-wave-1-2026-09-07-linking.json`
- Gate history: `data/seo/content-quality-gate-history.json`
