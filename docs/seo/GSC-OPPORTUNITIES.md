# GSC Opportunities — SoftwareGlimpse

**Generated:** 2026-09-08T23:15:00.661Z
**Engine version:** 3.1.0
**Source file used:** `docs/migration/data/gsc-export.json`
**Source label:** GSC Performance export — softwareglimpse.com — 2026-08-15
**Data through:** 2026-08-13
**Range:** Last 3 months

## Methodology notes

- Analysis only — no production content, canonicals, or robots were modified.
- REAL GSC source: docs/migration/data/gsc-export.json (original: softwareglimpse.com-Performance-on-Search-2026-08-15.xlsx, softwareglimpse.com-Coverage-2026-08-15.xlsx)
- Date range: 2026-05-14 → 2026-08-13
- Import retrievedAt: 2026-08-15T17:30:00.000Z
- Fixture/synthetic GSC data is rejected for production reporting.
- Pages and Queries tabs loaded separately — NO page×query matrix. Heuristic candidates are INFERRED_* — NOT DIRECT GSC DATA. INFERRED_MEDIUM/LOW never become target queries or rewrite drivers.
- relationshipSource: DIRECT_GSC | HISTORICAL_DIRECT_GSC | INFERRED_HIGH | INFERRED_MEDIUM | INFERRED_LOW | UNKNOWN.
- Query-scoped actions (OPTIMIZE_TITLE_FOR_QUERY, REWRITE_H1_FOR_QUERY, SEARCH_INTENT_MISMATCH, QUERY_CLUSTER_CONSOLIDATION) auto-apply only from DIRECT_GSC / HISTORICAL_DIRECT_GSC; INFERRED_HIGH requires human review; INFERRED_MEDIUM/LOW never rewrite.
- Page-level OPTIMIZE_TITLE may still fire from TITLE_WEAK / POOR_CTR without a target query.
- CANNIBALIZATION requires multiple URLs for the same DIRECT_GSC query; heuristic overlap is POSSIBLE_INTENT_OVERLAP.
- Legacy non-English, taxonomy, utility, 410/404-classified, and author/feed URLs are excluded.
- English redirect sources are excluded as pages; their impressions roll up to live destinations.
- Position bands: 8–20 very high, 21–35 high, 36–50 medium, 51–70 selective, >70 low unless impressions unusually high.
- Queue A = indexed page improvement; Queue B = IMPROVE/noindex promotion (historical demand is a priority signal, not a discard reason).
- CREATE_CANDIDATE is deferred when an existing SoftwareGlimpse page can absorb the intent after improvement.
- Score weights: {"impressions":0.15,"positionProximity":0.15,"rankingProximityToPageOne":0.09,"ctrGap":0.09,"queryCoverage":0.05,"commercialIntent":0.08,"contentType":0.05,"pageQualityGap":0.07,"internalLinkStrength":0.05,"topicalRelevance":0.05,"freshness":0.04,"cannibalizationRisk":0.03,"improvementLikelihood":0.05,"improvePromotionBoost":0.05}
- Opportunity score uses page-level metrics independently — inferred query coverage does not inflate score.
- Commercial intent boosts editorial priority only — never product recommendation ranks.
- AI Visibility summary loaded from data/seo/ai-visibility.json (7 citations, 6 unique pages) — measurement only.

## Totals

| Metric | Value |
| --- | ---: |
| Raw page rows | 1000 |
| Raw query rows | 500 |
| Raw page×query rows | 0 |
| Has page×query matrix | no |
| Excluded page rows | 997 |
| Eligible rolled-up pages | 111 |
| Scored pages | 91 |
| Diagnosed pages | 91 |
| Pages with DIRECT_GSC query | 0 |
| Pages with INFERRED only | 69 |
| Pages with UNKNOWN query | 22 |
| Queue A (indexed improve) | 91 |
| Queue B (IMPROVE/promote) | 0 |
| CREATE deferred → existing page | 6 |

## Queue A — Indexed page improvement

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | /software/miocommerce/ | software | A | 59 | — | UNKNOWN | UNKNOWN | 45 | 28.5 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 2 | /software/diginius/ | software | A | 58 | diginius | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 258 | 34.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 3 | /software/podio/ | software | A | 57 | — | UNKNOWN | UNKNOWN | 29 | 27.3 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 4 | /categories/ecommerce/ | categories | A | 56 | — | UNKNOWN | UNKNOWN | 144 | 39.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 5 | / | other | A | 54 | — | UNKNOWN | UNKNOWN | 41 | 49.3 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 6 | /software/hubspot/ | software | A | 53 | hubspot review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1340 | 66.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 7 | /compare/salesforce-vs-siebel/ | comparisons | A | 52 | siebel vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 231 | 69.5 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 8 | /categories/crm/ | categories | A | 51 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1903 | 83.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 9 | /software/closely/ | software | A | 51 | closely | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 360 | 36.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 10 | /software/fastmail/ | software | A | 51 | fastmail | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 284 | 41.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 11 | /compare/pipedrive-vs-salesforce/ | comparisons | A | 51 | pipedrive vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 194 | 63.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 12 | /compare/pega-vs-salesforce/ | comparisons | A | 51 | pega crm vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 155 | 58.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 13 | /compare/hubspot-vs-pipedrive/ | comparisons | A | 51 | pipedrive vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 150 | 67.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 14 | /compare/insightly-vs-salesforce/ | comparisons | A | 51 | salesforce vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 142 | 54.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 15 | /compare/salesforce-vs-sugarcrm/ | comparisons | A | 51 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 136 | 69.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 16 | /software/folk/ | software | A | 51 | — | UNKNOWN | UNKNOWN | 45 | 43.1 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 17 | /categories/marketing/ | categories | A | 50 | (candidates only — local seo marketing software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 622 | 60.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 18 | /software/nimble/ | software | A | 50 | nimble crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 302 | 65.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 19 | /compare/hubspot-vs-insightly/ | comparisons | A | 50 | hubspot vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 87 | 67.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 20 | /guides/ | guides | A | 50 | — | UNKNOWN | UNKNOWN | 48 | 41.7 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 21 | /software/wealthbox/ | software | A | 50 | — | UNKNOWN | UNKNOWN | 41 | 44.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 22 | /software/shore/ | software | A | 50 | — | UNKNOWN | UNKNOWN | 35 | 46.0 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 23 | /software/cloze/ | software | A | 50 | — | UNKNOWN | UNKNOWN | 27 | 45.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 24 | /industries/hospitality/ | industries | A | 49 | (candidates only — hospitality crm software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 2526 | 88.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 25 | /industries/plumbing/ | industries | A | 49 | (candidates only — plumbing crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1750 | 86.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 26 | /industries/solar/ | industries | A | 49 | (candidates only — solar crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1428 | 87.9 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 27 | /software/getresponse/ | software | A | 49 | getresponse review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 866 | 78.4 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 28 | /use-cases/prospecting/ | use-cases | A | 49 | — | UNKNOWN | UNKNOWN | 276 | 75.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 29 | /compare/monday-sales-crm-vs-salesforce/ | comparisons | A | 49 | monday vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 59 | 66.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 30 | /industries/real-estate/ | industries | A | 48 | (candidates only — commercial real estate crm software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1172 | 76.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 31 | /industries/event-management/ | industries | A | 48 | (candidates only — best crm for event management) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1061 | 89.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 32 | /industries/private-equity/ | industries | A | 48 | (candidates only — private equity crm solutions) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1021 | 82.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 33 | /software/capsule/ | software | A | 48 | capsule crm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 431 | 52.0 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 34 | /compare/ | comparisons | A | 48 | — | UNKNOWN | UNKNOWN | 208 | 77.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 35 | /software/zendesk/ | software | A | 48 | zendesk crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 182 | 66.8 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 36 | /industries/venture-capital/ | industries | A | 47 | (candidates only — venture capital crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 656 | 78.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 37 | /best/crm-software/ | best | A | 47 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 551 | 76.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 38 | /industries/nonprofit/ | industries | A | 47 | (candidates only — best crm for small nonprofit) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 504 | 79.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 39 | /categories/ai/ | categories | A | 47 | (candidates only — success group business ai) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 416 | 57.5 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 40 | /for/freelancers/ | other | A | 47 | (candidates only — crm for freelancers) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 366 | 84.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 41 | /use-cases/analytics/ | use-cases | A | 47 | (candidates only — analytics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 249 | 86.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 42 | /software/freshsales/ | software | A | 47 | — | UNKNOWN | UNKNOWN | 193 | 64.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 43 | /software/netsuite/ | software | A | 47 | netsuite crm reviews | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 94 | 65.7 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 44 | /industries/music/ | industries | A | 46 | — | UNKNOWN | UNKNOWN | 288 | 71.1 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 45 | /software/salesforce/ | software | A | 46 | salesforce crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 264 | 80.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 46 | /software/mailchimp/ | software | A | 46 | (candidates only — mailchimp crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 160 | 62.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 47 | /software/keap/ | software | A | 45 | keap | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 567 | 66.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 48 | /capabilities/sms-messaging/ | other | A | 45 | (candidates only — crm messaging platform) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 541 | 87.8 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 49 | /guides/how-to-choose-crm/ | guides | A | 45 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 507 | 84.1 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 50 | /industries/photography/ | industries | A | 45 | (candidates only — photography crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 479 | 81.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |

## Queue B — IMPROVE / noindex promotion

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |

### Exclusion summary

| Reason | Count |
| --- | ---: |
| locale_redirect | 562 |
| legacy_locale | 203 |
| redirect_source | 164 |
| removed_410 | 52 |
| taxonomy_junk | 11 |
| author_archive | 5 |

## TOP 20 — Immediate opportunities

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | /software/miocommerce/ | software | A | 59 | — | UNKNOWN | UNKNOWN | 45 | 28.5 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 2 | /software/diginius/ | software | A | 58 | diginius | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 258 | 34.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 3 | /software/podio/ | software | A | 57 | — | UNKNOWN | UNKNOWN | 29 | 27.3 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 4 | /categories/ecommerce/ | categories | A | 56 | — | UNKNOWN | UNKNOWN | 144 | 39.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 5 | / | other | A | 54 | — | UNKNOWN | UNKNOWN | 41 | 49.3 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 6 | /software/hubspot/ | software | A | 53 | hubspot review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1340 | 66.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 7 | /compare/salesforce-vs-siebel/ | comparisons | A | 52 | siebel vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 231 | 69.5 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 8 | /categories/crm/ | categories | A | 51 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1903 | 83.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 9 | /software/closely/ | software | A | 51 | closely | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 360 | 36.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 10 | /software/fastmail/ | software | A | 51 | fastmail | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 284 | 41.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 11 | /compare/pipedrive-vs-salesforce/ | comparisons | A | 51 | pipedrive vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 194 | 63.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 12 | /compare/pega-vs-salesforce/ | comparisons | A | 51 | pega crm vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 155 | 58.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 13 | /compare/hubspot-vs-pipedrive/ | comparisons | A | 51 | pipedrive vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 150 | 67.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 14 | /compare/insightly-vs-salesforce/ | comparisons | A | 51 | salesforce vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 142 | 54.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 15 | /compare/salesforce-vs-sugarcrm/ | comparisons | A | 51 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 136 | 69.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 16 | /software/folk/ | software | A | 51 | — | UNKNOWN | UNKNOWN | 45 | 43.1 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 17 | /categories/marketing/ | categories | A | 50 | (candidates only — local seo marketing software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 622 | 60.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 18 | /software/nimble/ | software | A | 50 | nimble crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 302 | 65.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 19 | /compare/hubspot-vs-insightly/ | comparisons | A | 50 | hubspot vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 87 | 67.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 20 | /guides/ | guides | A | 50 | — | UNKNOWN | UNKNOWN | 48 | 41.7 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |

## TOP 50 — High-priority opportunities

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | /software/miocommerce/ | software | A | 59 | — | UNKNOWN | UNKNOWN | 45 | 28.5 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 2 | /software/diginius/ | software | A | 58 | diginius | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 258 | 34.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 3 | /software/podio/ | software | A | 57 | — | UNKNOWN | UNKNOWN | 29 | 27.3 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 4 | /categories/ecommerce/ | categories | A | 56 | — | UNKNOWN | UNKNOWN | 144 | 39.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 5 | / | other | A | 54 | — | UNKNOWN | UNKNOWN | 41 | 49.3 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 6 | /software/hubspot/ | software | A | 53 | hubspot review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1340 | 66.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 7 | /compare/salesforce-vs-siebel/ | comparisons | A | 52 | siebel vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 231 | 69.5 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 8 | /categories/crm/ | categories | A | 51 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1903 | 83.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 9 | /software/closely/ | software | A | 51 | closely | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 360 | 36.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 10 | /software/fastmail/ | software | A | 51 | fastmail | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 284 | 41.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 11 | /compare/pipedrive-vs-salesforce/ | comparisons | A | 51 | pipedrive vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 194 | 63.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 12 | /compare/pega-vs-salesforce/ | comparisons | A | 51 | pega crm vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 155 | 58.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 13 | /compare/hubspot-vs-pipedrive/ | comparisons | A | 51 | pipedrive vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 150 | 67.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 14 | /compare/insightly-vs-salesforce/ | comparisons | A | 51 | salesforce vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 142 | 54.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 15 | /compare/salesforce-vs-sugarcrm/ | comparisons | A | 51 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 136 | 69.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 16 | /software/folk/ | software | A | 51 | — | UNKNOWN | UNKNOWN | 45 | 43.1 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 17 | /categories/marketing/ | categories | A | 50 | (candidates only — local seo marketing software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 622 | 60.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 18 | /software/nimble/ | software | A | 50 | nimble crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 302 | 65.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 19 | /compare/hubspot-vs-insightly/ | comparisons | A | 50 | hubspot vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 87 | 67.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 20 | /guides/ | guides | A | 50 | — | UNKNOWN | UNKNOWN | 48 | 41.7 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 21 | /software/wealthbox/ | software | A | 50 | — | UNKNOWN | UNKNOWN | 41 | 44.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 22 | /software/shore/ | software | A | 50 | — | UNKNOWN | UNKNOWN | 35 | 46.0 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 23 | /software/cloze/ | software | A | 50 | — | UNKNOWN | UNKNOWN | 27 | 45.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 24 | /industries/hospitality/ | industries | A | 49 | (candidates only — hospitality crm software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 2526 | 88.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 25 | /industries/plumbing/ | industries | A | 49 | (candidates only — plumbing crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1750 | 86.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 26 | /industries/solar/ | industries | A | 49 | (candidates only — solar crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1428 | 87.9 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 27 | /software/getresponse/ | software | A | 49 | getresponse review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 866 | 78.4 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 28 | /use-cases/prospecting/ | use-cases | A | 49 | — | UNKNOWN | UNKNOWN | 276 | 75.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 29 | /compare/monday-sales-crm-vs-salesforce/ | comparisons | A | 49 | monday vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 59 | 66.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 30 | /industries/real-estate/ | industries | A | 48 | (candidates only — commercial real estate crm software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1172 | 76.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 31 | /industries/event-management/ | industries | A | 48 | (candidates only — best crm for event management) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1061 | 89.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 32 | /industries/private-equity/ | industries | A | 48 | (candidates only — private equity crm solutions) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1021 | 82.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 33 | /software/capsule/ | software | A | 48 | capsule crm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 431 | 52.0 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 34 | /compare/ | comparisons | A | 48 | — | UNKNOWN | UNKNOWN | 208 | 77.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 35 | /software/zendesk/ | software | A | 48 | zendesk crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 182 | 66.8 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 36 | /industries/venture-capital/ | industries | A | 47 | (candidates only — venture capital crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 656 | 78.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 37 | /best/crm-software/ | best | A | 47 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 551 | 76.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 38 | /industries/nonprofit/ | industries | A | 47 | (candidates only — best crm for small nonprofit) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 504 | 79.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 39 | /categories/ai/ | categories | A | 47 | (candidates only — success group business ai) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 416 | 57.5 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 40 | /for/freelancers/ | other | A | 47 | (candidates only — crm for freelancers) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 366 | 84.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 41 | /use-cases/analytics/ | use-cases | A | 47 | (candidates only — analytics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 249 | 86.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 42 | /software/freshsales/ | software | A | 47 | — | UNKNOWN | UNKNOWN | 193 | 64.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 43 | /software/netsuite/ | software | A | 47 | netsuite crm reviews | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 94 | 65.7 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 44 | /industries/music/ | industries | A | 46 | — | UNKNOWN | UNKNOWN | 288 | 71.1 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 45 | /software/salesforce/ | software | A | 46 | salesforce crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 264 | 80.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 46 | /software/mailchimp/ | software | A | 46 | (candidates only — mailchimp crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 160 | 62.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 47 | /software/keap/ | software | A | 45 | keap | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 567 | 66.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 48 | /capabilities/sms-messaging/ | other | A | 45 | (candidates only — crm messaging platform) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 541 | 87.8 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 49 | /guides/how-to-choose-crm/ | guides | A | 45 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 507 | 84.1 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 50 | /industries/photography/ | industries | A | 45 | (candidates only — photography crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 479 | 81.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |

## TOP 100 — Full improvement backlog

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | /software/miocommerce/ | software | A | 59 | — | UNKNOWN | UNKNOWN | 45 | 28.5 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 2 | /software/diginius/ | software | A | 58 | diginius | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 258 | 34.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 3 | /software/podio/ | software | A | 57 | — | UNKNOWN | UNKNOWN | 29 | 27.3 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 4 | /categories/ecommerce/ | categories | A | 56 | — | UNKNOWN | UNKNOWN | 144 | 39.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 5 | / | other | A | 54 | — | UNKNOWN | UNKNOWN | 41 | 49.3 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 6 | /software/hubspot/ | software | A | 53 | hubspot review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1340 | 66.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 7 | /compare/salesforce-vs-siebel/ | comparisons | A | 52 | siebel vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 231 | 69.5 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 8 | /categories/crm/ | categories | A | 51 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1903 | 83.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 9 | /software/closely/ | software | A | 51 | closely | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 360 | 36.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 10 | /software/fastmail/ | software | A | 51 | fastmail | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 284 | 41.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 11 | /compare/pipedrive-vs-salesforce/ | comparisons | A | 51 | pipedrive vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 194 | 63.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 12 | /compare/pega-vs-salesforce/ | comparisons | A | 51 | pega crm vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 155 | 58.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 13 | /compare/hubspot-vs-pipedrive/ | comparisons | A | 51 | pipedrive vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 150 | 67.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 14 | /compare/insightly-vs-salesforce/ | comparisons | A | 51 | salesforce vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 142 | 54.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 15 | /compare/salesforce-vs-sugarcrm/ | comparisons | A | 51 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 136 | 69.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 16 | /software/folk/ | software | A | 51 | — | UNKNOWN | UNKNOWN | 45 | 43.1 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 17 | /categories/marketing/ | categories | A | 50 | (candidates only — local seo marketing software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 622 | 60.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 18 | /software/nimble/ | software | A | 50 | nimble crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 302 | 65.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 19 | /compare/hubspot-vs-insightly/ | comparisons | A | 50 | hubspot vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 87 | 67.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 20 | /guides/ | guides | A | 50 | — | UNKNOWN | UNKNOWN | 48 | 41.7 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 21 | /software/wealthbox/ | software | A | 50 | — | UNKNOWN | UNKNOWN | 41 | 44.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 22 | /software/shore/ | software | A | 50 | — | UNKNOWN | UNKNOWN | 35 | 46.0 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 23 | /software/cloze/ | software | A | 50 | — | UNKNOWN | UNKNOWN | 27 | 45.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 24 | /industries/hospitality/ | industries | A | 49 | (candidates only — hospitality crm software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 2526 | 88.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 25 | /industries/plumbing/ | industries | A | 49 | (candidates only — plumbing crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1750 | 86.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 26 | /industries/solar/ | industries | A | 49 | (candidates only — solar crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1428 | 87.9 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 27 | /software/getresponse/ | software | A | 49 | getresponse review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 866 | 78.4 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 28 | /use-cases/prospecting/ | use-cases | A | 49 | — | UNKNOWN | UNKNOWN | 276 | 75.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 29 | /compare/monday-sales-crm-vs-salesforce/ | comparisons | A | 49 | monday vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 59 | 66.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 30 | /industries/real-estate/ | industries | A | 48 | (candidates only — commercial real estate crm software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1172 | 76.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 31 | /industries/event-management/ | industries | A | 48 | (candidates only — best crm for event management) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1061 | 89.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 32 | /industries/private-equity/ | industries | A | 48 | (candidates only — private equity crm solutions) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1021 | 82.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 33 | /software/capsule/ | software | A | 48 | capsule crm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 431 | 52.0 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 34 | /compare/ | comparisons | A | 48 | — | UNKNOWN | UNKNOWN | 208 | 77.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 35 | /software/zendesk/ | software | A | 48 | zendesk crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 182 | 66.8 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 36 | /industries/venture-capital/ | industries | A | 47 | (candidates only — venture capital crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 656 | 78.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 37 | /best/crm-software/ | best | A | 47 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 551 | 76.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 38 | /industries/nonprofit/ | industries | A | 47 | (candidates only — best crm for small nonprofit) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 504 | 79.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 39 | /categories/ai/ | categories | A | 47 | (candidates only — success group business ai) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 416 | 57.5 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 40 | /for/freelancers/ | other | A | 47 | (candidates only — crm for freelancers) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 366 | 84.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 41 | /use-cases/analytics/ | use-cases | A | 47 | (candidates only — analytics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 249 | 86.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 42 | /software/freshsales/ | software | A | 47 | — | UNKNOWN | UNKNOWN | 193 | 64.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 43 | /software/netsuite/ | software | A | 47 | netsuite crm reviews | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 94 | 65.7 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 44 | /industries/music/ | industries | A | 46 | — | UNKNOWN | UNKNOWN | 288 | 71.1 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 45 | /software/salesforce/ | software | A | 46 | salesforce crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 264 | 80.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 46 | /software/mailchimp/ | software | A | 46 | (candidates only — mailchimp crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 160 | 62.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 47 | /software/keap/ | software | A | 45 | keap | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 567 | 66.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 48 | /capabilities/sms-messaging/ | other | A | 45 | (candidates only — crm messaging platform) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 541 | 87.8 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 49 | /guides/how-to-choose-crm/ | guides | A | 45 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 507 | 84.1 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 50 | /industries/photography/ | industries | A | 45 | (candidates only — photography crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 479 | 81.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 51 | /industries/coaching/ | industries | A | 45 | (candidates only — crm for coaching business) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 457 | 86.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 52 | /software/sanebox/ | software | A | 45 | sanebox | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 393 | 53.2 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 53 | /software/close/ | software | A | 45 | (candidates only — close crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 137 | 58.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 54 | /compare/salesforce-vs-sap/ | comparisons | A | 45 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 84 | 85.0 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 55 | /compare/act-vs-salesforce/ | comparisons | A | 45 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 71 | 74.9 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 56 | /compare/marketo-vs-salesforce/ | comparisons | A | 45 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 49 | 77.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 57 | /software/monday-sales-crm/ | software | A | 45 | monday crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 48 | 69.1 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 58 | /software/activecampaign/ | software | A | 44 | activecampaign | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1019 | 77.0 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 59 | /software/insightly/ | software | A | 44 | insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 938 | 71.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 60 | /software/navan/ | software | A | 44 | navan | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 353 | 54.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 61 | /software/kaspr/ | software | A | 44 | kaspr | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 342 | 60.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 62 | /industries/investor-relations/ | industries | A | 44 | (candidates only — investor relations crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 335 | 90.7 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 63 | /industries/engineering/ | industries | A | 44 | (candidates only — engineering crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 278 | 85.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 64 | /software/nicejob/ | software | A | 44 | nicejob | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 265 | 57.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 65 | /use-cases/lead-management/ | use-cases | A | 44 | — | UNKNOWN | UNKNOWN | 161 | 76.4 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 66 | /software/pipelinepro/ | software | A | 44 | — | UNKNOWN | UNKNOWN | 39 | 64.0 | IMPROVE_INTRO | PAGE_LEVEL | MEDIUM |
| 67 | /software/dynamics-365/ | software | A | 43 | dynamics 365 crm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 313 | 76.3 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 68 | /industries/financial-services/ | industries | A | 43 | (candidates only — crm for plumbing services) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 215 | 86.1 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 69 | /software/agile-crm/ | software | A | 43 | (candidates only — crm reviews) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 149 | 71.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 70 | /industries/retail-ecommerce/ | industries | A | 43 | — | UNKNOWN | UNKNOWN | 113 | 81.0 | IMPROVE_INTRO | PAGE_LEVEL | MEDIUM |
| 71 | /industries/web-design/ | industries | A | 42 | (candidates only — crm for web design agency) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 170 | 88.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 72 | /software/pega/ | software | A | 42 | pega crm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 27 | 52.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 73 | /software/pipedrive/ | software | A | 41 | pipedrive review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 53 | 72.2 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 74 | /software/copper/ | software | A | 41 | (candidates only — copper crm alternatives) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 45 | 76.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 75 | /software/lusha/ | software | A | 40 | lusha | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 182 | 54.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 76 | /industries/security-companies/ | industries | A | 40 | (candidates only — crm for plumbing companies) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 65 | 89.2 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 77 | /software/zoho-crm/ | software | A | 40 | (candidates only — crm reviews) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 32 | 73.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 78 | /use-cases/field-sales/ | use-cases | A | 39 | (candidates only — crm field sales) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 63 | 81.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 79 | /guides/zoho-crm-setup/ | guides | A | 39 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 44 | 79.3 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 80 | /guides/what-is-crm/ | guides | A | 38 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 110 | 72.4 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 81 | /software/krispcall/ | software | A | 35 | krispcall | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 132 | 51.2 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 82 | /compare/hubspot-vs-tidio/ | comparisons | A | 34 | (candidates only — hubspot crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 11 | 27.6 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 83 | /compare/livechat-vs-tidio/ | comparisons | A | 32 | — | UNKNOWN | UNKNOWN | 20 | 48.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 84 | /compare/hubspot-vs-keap/ | comparisons | A | 30 | (candidates only — hubspot crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 15 | 48.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 85 | /company/my-story/ | other | A | 30 | — | UNKNOWN | UNKNOWN | 14 | 4.6 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 86 | /software/apptivo/ | software | A | 27 | — | UNKNOWN | UNKNOWN | 13 | 42.6 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 87 | /software/affinity/ | software | A | 26 | — | UNKNOWN | UNKNOWN | 23 | 54.1 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 88 | /compare/keap-vs-salesforce/ | comparisons | A | 26 | (candidates only — keap crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 14 | 60.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 89 | /compare/oracle-cx-vs-salesforce/ | comparisons | A | 26 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 14 | 65.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 90 | /company/contact/ | other | A | 25 | — | UNKNOWN | UNKNOWN | 18 | 7.8 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 91 | /industries/construction/ | industries | A | 21 | — | UNKNOWN | UNKNOWN | 16 | 79.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |

## Cannibalization / intent overlap

| Classification | Cluster/query | Provenance | Paths | Impressions | Review |
| --- | --- | --- | --- | --- | --- |
| POSSIBLE_INTENT_OVERLAP | comparison:pipedrive+salesforce | INFERRED | /compare/salesforce-vs-siebel/<br>/compare/pipedrive-vs-salesforce/<br>/compare/pega-vs-salesforce/<br>/compare/salesforce-vs-sugarcrm/<br>/software/salesforce/<br>/compare/salesforce-vs-sap/<br>/compare/act-vs-salesforce/<br>/compare/marketo-vs-salesforce/<br>/compare/keap-vs-salesforce/<br>/compare/oracle-cx-vs-salesforce/ | 231, 194, 155, 136, 264, 84, 71, 49, 14, 14 | yes |
| POSSIBLE_INTENT_OVERLAP | microsoft dynamics crm | INFERRED | /categories/crm/<br>/best/crm-software/<br>/guides/how-to-choose-crm/<br>/guides/zoho-crm-setup/<br>/guides/what-is-crm/ | 1903, 551, 507, 44, 110 | yes |
| POSSIBLE_INTENT_OVERLAP | plumber crm | INFERRED | /categories/crm/<br>/best/crm-software/<br>/guides/how-to-choose-crm/<br>/guides/zoho-crm-setup/<br>/guides/what-is-crm/ | 1903, 551, 507, 44, 110 | yes |
| POSSIBLE_INTENT_OVERLAP | comparison:hubspot+pipedrive | INFERRED | /compare/pipedrive-vs-salesforce/<br>/compare/hubspot-vs-pipedrive/<br>/software/pipedrive/<br>/compare/hubspot-vs-tidio/<br>/compare/hubspot-vs-keap/ | 194, 150, 53, 11, 15 | yes |
| POSSIBLE_INTENT_OVERLAP | comparison:salesforce | INFERRED | /compare/salesforce-vs-sugarcrm/<br>/compare/salesforce-vs-sap/<br>/compare/act-vs-salesforce/<br>/compare/marketo-vs-salesforce/<br>/compare/oracle-cx-vs-salesforce/ | 136, 84, 71, 49, 14 | yes |
| POSSIBLE_INTENT_OVERLAP | best:crm:none | INFERRED | /industries/hospitality/<br>/industries/event-management/<br>/industries/nonprofit/<br>/for/freelancers/<br>/industries/web-design/ | 2526, 1061, 504, 366, 170 | yes |
| POSSIBLE_INTENT_OVERLAP | hubspot crm | INFERRED | /software/hubspot/<br>/compare/hubspot-vs-pipedrive/<br>/compare/hubspot-vs-tidio/<br>/compare/hubspot-vs-keap/ | 1340, 150, 11, 15 | yes |
| POSSIBLE_INTENT_OVERLAP | monday crm review | INFERRED | /compare/monday-sales-crm-vs-salesforce/<br>/software/monday-sales-crm/<br>/software/agile-crm/<br>/software/zoho-crm/ | 59, 48, 149, 32 | yes |
| POSSIBLE_INTENT_OVERLAP | insightly | INFERRED | /compare/insightly-vs-salesforce/<br>/compare/hubspot-vs-insightly/<br>/software/insightly/ | 142, 87, 938 | yes |
| POSSIBLE_INTENT_OVERLAP | crm reviews | INFERRED | /software/monday-sales-crm/<br>/software/agile-crm/<br>/software/zoho-crm/ | 48, 149, 32 | yes |
| POSSIBLE_INTENT_OVERLAP | comparison:pega+salesforce | INFERRED | /compare/pega-vs-salesforce/<br>/software/pega/ | 155, 27 | yes |
| POSSIBLE_INTENT_OVERLAP | keap crm | INFERRED | /software/keap/<br>/compare/keap-vs-salesforce/ | 567, 14 | yes |

## High-impression queries — existing-page-first

_Prefer improving an existing SoftwareGlimpse URL. CREATE_CANDIDATE only when no suitable page exists._

| Query | Imp | Pos | Intent | Improve existing | Create? |
| --- | ---: | ---: | --- | --- | --- |
| software seo | 2255 | 74.3 | informational | — | maybe |
| seo software | 1750 | 76.0 | informational | — | maybe |
| seo moz vs semrush | 1511 | 65.9 | comparison | — | maybe |
| semrush review | 1452 | 82.9 | review | — | maybe |
| semrush vs moz | 1448 | 64.5 | comparison | — | maybe |
| semrush vs spyfu | 1306 | 66.5 | comparison | — | maybe |
| spyfu vs semrush | 1167 | 63.2 | comparison | — | maybe |
| beste seo software | 1110 | 89.6 | informational | — | maybe |
| microsoft dynamics crm | 991 | 70.4 | informational | — | maybe |
| ahrefs vs semrush | 883 | 55.0 | comparison | — | maybe |
| seo software pro | 877 | 91.3 | informational | — | maybe |
| local seo tools | 763 | 88.0 | informational | — | maybe |
| script writing software | 676 | 78.4 | informational | — | maybe |
| software para seo | 675 | 81.5 | informational | — | maybe |
| local seo marketing software | 632 | 82.2 | informational | — | maybe |
| plumber crm | 616 | 88.0 | informational | — | maybe |
| seo software nederlands | 592 | 87.3 | informational | — | maybe |
| local seo software | 573 | 86.3 | informational | — | maybe |
| crm freelancer | 388 | 82.0 | informational | — | maybe |
| seo reporting software | 380 | 89.9 | informational | — | maybe |
| commercial crm | 369 | 78.0 | informational | — | maybe |
| seo software vergleich | 365 | 89.0 | informational | — | maybe |
| xovi alternative | 352 | 85.1 | alternatives | — | maybe |
| crm para restaurantes | 350 | 86.2 | informational | — | maybe |
| seo software online | 345 | 63.7 | informational | — | maybe |

## System feeds

- **guideEnrichment:** `data/seo/feeds/gsc-guide-enrichment.json`
- **compareEnrichment:** `data/seo/feeds/gsc-compare-enrichment.json`
- **testingPriority:** `data/seo/feeds/gsc-testing-priority.json`
- **pricingMonitor:** `data/seo/feeds/gsc-pricing-monitor.json`
- **internalLinks:** `data/seo/feeds/gsc-internal-links.json`
- **refresh:** `data/seo/feeds/gsc-refresh.json`

## AI Visibility summary

| Citations | Unique pages | Top platform | New | Lost |
| ---: | ---: | --- | ---: | ---: |
| 7 | 6 | chatgpt | 0 | 0 |

See [`AI-VISIBILITY.md`](./AI-VISIBILITY.md). Measurement only.

## Weekly process

1. Prefer a page×query export (GSC API dimensions page+query, combined CSV, or JSON pageQueries[]) — required for DIRECT_GSC target queries.
2. If only Pages + Queries tabs exist, the engine will NOT invent primary queries; candidates stay INFERRED — NOT DIRECT GSC DATA.
3. Place under data/seo/imports/ or docs/migration/data/ (must be synthetic:false) — see docs/seo/GSC-OPPORTUNITY-ENGINE.md.
4. Run: npm run seo:gsc-opportunities -- --export <path>
5. Review Queue A (indexed improvement) AND Queue B (IMPROVE/noindex promotion).
6. Only auto-optimize titles/H1 from DIRECT_GSC (or HIGH inference after human review).
7. Prefer enriching existing URLs — only create when resolveCreateCandidate finds no match.
8. Feed outputs under data/seo/feeds/ drive guide/compare enrichment, testing, pricing, links, refresh.
9. Re-export GSC the following week and re-run to measure impression/CTR/position deltas.
10. Optionally run npm run seo:ai-visibility (measurement only).

## Re-run

```bash
npm run seo:gsc-opportunities -- --export path/to/gsc-export.json
npm run seo:ai-visibility
```

Machine-readable output: [`data/seo/gsc-opportunities.json`](../../data/seo/gsc-opportunities.json)  
Actionable top 20: [`TOP-20-GROWTH-PAGES.md`](./TOP-20-GROWTH-PAGES.md)
AI Visibility: [`AI-VISIBILITY.md`](./AI-VISIBILITY.md)
