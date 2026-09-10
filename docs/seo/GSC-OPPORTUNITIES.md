# GSC Opportunities — SoftwareGlimpse

**Generated:** 2026-09-10T10:33:55.381Z
**Engine version:** 3.1.0
**Source file used:** `docs/migration/data/gsc-export.json`
**Source label:** GSC Performance export — softwareglimpse.com — 2026-09-05
**Data through:** 2026-09-03
**Range:** Last 12 months

## Methodology notes

- Analysis only — no production content, canonicals, or robots were modified.
- REAL GSC source: docs/migration/data/gsc-export.json (original: softwareglimpse.com-Performance-on-Search-2026-09-05.xlsx, softwareglimpse.com-Coverage-Drilldown-crawled-not-indexed-2026-09-05.xlsx, softwareglimpse.com-Coverage-Drilldown-discovered-not-indexed-2026-09-05.xlsx)
- Date range: 2025-09-04 → 2026-09-03
- Import retrievedAt: 2026-09-05T14:48:00.000Z
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
| Raw query rows | 1000 |
| Raw page×query rows | 0 |
| Has page×query matrix | no |
| Excluded page rows | 986 |
| Eligible rolled-up pages | 123 |
| Scored pages | 122 |
| Diagnosed pages | 122 |
| Pages with DIRECT_GSC query | 0 |
| Pages with INFERRED only | 109 |
| Pages with UNKNOWN query | 13 |
| Queue A (indexed improve) | 119 |
| Queue B (IMPROVE/promote) | 3 |
| CREATE deferred → existing page | 7 |

## Queue A — Indexed page improvement

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | /software/fastmail/ | software | A | 67 | fastmail review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 2275 | 23.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 2 | /legal/privacy/ | other | A | 66 | (candidates only — crm legal) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 14.1 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 3 | /legal/terms/ | other | A | 66 | (candidates only — crm legal) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 30 | 18.4 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 4 | /compare/livechat-vs-tidio/ | comparisons | A | 65 | (candidates only — tidio) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 138 | 27.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 5 | /compare/hubspot-vs-tidio/ | comparisons | A | 64 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 67 | 23.0 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 6 | /software/shore/ | software | A | 63 | — | UNKNOWN | UNKNOWN | 345 | 22.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 7 | /compare/hubspot-vs-zendesk/ | comparisons | A | 63 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 43 | 35.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 8 | /software/affinity/ | software | A | 62 | — | UNKNOWN | UNKNOWN | 225 | 34.5 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 9 | /compare/chatgpt-vs-github-copilot/ | comparisons | A | 62 | (candidates only — writesonic vs chatgpt) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 24.4 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 10 | /software/miocommerce/ | software | A | 60 | miocommerce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 653 | 23.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 11 | /compare/chatgpt-vs-writesonic/ | comparisons | A | 60 | writesonic vs chatgpt | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 220 | 39.7 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 12 | /guides/ | guides | A | 60 | — | UNKNOWN | UNKNOWN | 144 | 33.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 13 | /categories/ai/ | categories | A | 59 | (candidates only — caktus ai vs chatgpt) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1520 | 49.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 14 | /compare/crisp-vs-tidio/ | comparisons | A | 59 | tidio vs crisp | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 172 | 44.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 15 | / | other | A | 58 | — | UNKNOWN | UNKNOWN | 282 | 27.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 16 | /company/my-story/ | other | A | 58 | — | UNKNOWN | UNKNOWN | 104 | 7.2 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 17 | /compare/hubspot-vs-marketo/ | comparisons | A | 58 | hubspot vs marketo | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 64 | 37.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 18 | /for/startups/ | other | A | 58 | (candidates only — crm für startups) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 17.1 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 19 | /industries/music/ | industries | A | 57 | (candidates only — crm music industry) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1178 | 49.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 20 | /software/folk/ | software | A | 57 | folk crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 484 | 36.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 21 | /compare/keap-vs-salesforce/ | comparisons | A | 57 | (candidates only — keap crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 117 | 48.5 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 22 | /compare/activecampaign-vs-hubspot/ | comparisons | A | 57 | activecampaign vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 53 | 41.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 23 | /compare/salesforce-vs-zoho-crm/ | comparisons | A | 56 | zoho vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 36 | 41.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 24 | /compare/salesforce-vs-siebel/ | comparisons | A | 55 | siebel vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 981 | 52.8 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 25 | /compare/salesforce-vs-sugarcrm/ | comparisons | A | 55 | salesforce vs sugarcrm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 916 | 58.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 26 | /compare/marketo-vs-salesforce/ | comparisons | A | 55 | marketo vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 632 | 67.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 27 | /software/writesonic/ | software | A | 55 | (candidates only — writesonic vs chatgpt) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 95 | 65.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 28 | /compare/hubspot-vs-zoho-crm/ | comparisons | A | 55 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 30 | 35.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 29 | /compare/hubspot-vs-monday-sales-crm/ | comparisons | A | 54 | hubspot vs monday | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 807 | 74.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 30 | /categories/ecommerce/ | categories | A | 54 | (candidates only — webydo ecommerce) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 751 | 42.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 33 | /categories/crm/ | categories | A | 53 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 7172 | 61.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 34 | /categories/marketing/ | categories | A | 53 | (candidates only — local seo marketing software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 4232 | 52.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 35 | /software/getresponse/ | software | A | 53 | getresponse review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 4143 | 61.0 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 36 | /software/hubspot/ | software | A | 53 | hubspot review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 2880 | 67.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 37 | /compare/pipedrive-vs-salesforce/ | comparisons | A | 53 | pipedrive vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1386 | 73.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 38 | /software/krispcall/ | software | A | 53 | krispcall | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1266 | 48.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 39 | /software/closely/ | software | A | 53 | closely | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1059 | 41.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 40 | /software/diginius/ | software | A | 53 | diginius | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1044 | 37.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 41 | /compare/insightly-vs-salesforce/ | comparisons | A | 53 | salesforce vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 451 | 56.2 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 42 | /compare/hubspot-vs-insightly/ | comparisons | A | 53 | hubspot vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 411 | 64.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 43 | /compare/oracle-cx-vs-salesforce/ | comparisons | A | 53 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 410 | 53.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 44 | /software/zoho-crm/ | software | A | 53 | (candidates only — salesforce crm review) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 244 | 41.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 45 | /compare/tidio-vs-zendesk/ | comparisons | A | 53 | tidio vs zendesk | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 100 | 51.7 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 46 | /software/freshsales/ | software | A | 52 | freshsales review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1199 | 59.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 47 | /software/close/ | software | A | 52 | close crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 881 | 54.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 48 | /software/nimble/ | software | A | 52 | nimble crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 830 | 67.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 49 | /compare/hubspot-vs-pipedrive/ | comparisons | A | 52 | pipedrive vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 825 | 76.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 50 | /compare/freshsales-vs-hubspot/ | comparisons | A | 52 | freshsales vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 274 | 62.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 51 | /compare/act-vs-salesforce/ | comparisons | A | 52 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 228 | 63.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 52 | /compare/hubspot-vs-keap/ | comparisons | A | 52 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 225 | 65.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |

## Queue B — IMPROVE / noindex promotion

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 31 | /guides/what-is-tidio/ | guides | B | 54 | tidio | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 237 | 41.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 32 | /compare/cpanel-vs-siteground/ | comparisons | B | 54 | — | UNKNOWN | UNKNOWN | 60 | 65.4 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 121 | /compare/clay-vs-outreach/ | comparisons | B | 31 | — | UNKNOWN | UNKNOWN | 20 | 61.5 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |

### Exclusion summary

| Reason | Count |
| --- | ---: |
| locale_redirect | 506 |
| legacy_locale | 227 |
| redirect_source | 184 |
| removed_410 | 56 |
| taxonomy_junk | 11 |
| author_archive | 2 |

## TOP 20 — Immediate opportunities

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | /software/fastmail/ | software | A | 67 | fastmail review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 2275 | 23.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 2 | /legal/privacy/ | other | A | 66 | (candidates only — crm legal) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 14.1 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 3 | /legal/terms/ | other | A | 66 | (candidates only — crm legal) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 30 | 18.4 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 4 | /compare/livechat-vs-tidio/ | comparisons | A | 65 | (candidates only — tidio) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 138 | 27.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 5 | /compare/hubspot-vs-tidio/ | comparisons | A | 64 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 67 | 23.0 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 6 | /software/shore/ | software | A | 63 | — | UNKNOWN | UNKNOWN | 345 | 22.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 7 | /compare/hubspot-vs-zendesk/ | comparisons | A | 63 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 43 | 35.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 8 | /software/affinity/ | software | A | 62 | — | UNKNOWN | UNKNOWN | 225 | 34.5 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 9 | /compare/chatgpt-vs-github-copilot/ | comparisons | A | 62 | (candidates only — writesonic vs chatgpt) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 24.4 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 10 | /software/miocommerce/ | software | A | 60 | miocommerce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 653 | 23.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 11 | /compare/chatgpt-vs-writesonic/ | comparisons | A | 60 | writesonic vs chatgpt | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 220 | 39.7 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 12 | /guides/ | guides | A | 60 | — | UNKNOWN | UNKNOWN | 144 | 33.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 13 | /categories/ai/ | categories | A | 59 | (candidates only — caktus ai vs chatgpt) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1520 | 49.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 14 | /compare/crisp-vs-tidio/ | comparisons | A | 59 | tidio vs crisp | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 172 | 44.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 15 | / | other | A | 58 | — | UNKNOWN | UNKNOWN | 282 | 27.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 16 | /company/my-story/ | other | A | 58 | — | UNKNOWN | UNKNOWN | 104 | 7.2 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 17 | /compare/hubspot-vs-marketo/ | comparisons | A | 58 | hubspot vs marketo | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 64 | 37.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 18 | /for/startups/ | other | A | 58 | (candidates only — crm für startups) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 17.1 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 19 | /industries/music/ | industries | A | 57 | (candidates only — crm music industry) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1178 | 49.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 20 | /software/folk/ | software | A | 57 | folk crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 484 | 36.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |

## TOP 50 — High-priority opportunities

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | /software/fastmail/ | software | A | 67 | fastmail review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 2275 | 23.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 2 | /legal/privacy/ | other | A | 66 | (candidates only — crm legal) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 14.1 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 3 | /legal/terms/ | other | A | 66 | (candidates only — crm legal) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 30 | 18.4 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 4 | /compare/livechat-vs-tidio/ | comparisons | A | 65 | (candidates only — tidio) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 138 | 27.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 5 | /compare/hubspot-vs-tidio/ | comparisons | A | 64 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 67 | 23.0 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 6 | /software/shore/ | software | A | 63 | — | UNKNOWN | UNKNOWN | 345 | 22.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 7 | /compare/hubspot-vs-zendesk/ | comparisons | A | 63 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 43 | 35.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 8 | /software/affinity/ | software | A | 62 | — | UNKNOWN | UNKNOWN | 225 | 34.5 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 9 | /compare/chatgpt-vs-github-copilot/ | comparisons | A | 62 | (candidates only — writesonic vs chatgpt) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 24.4 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 10 | /software/miocommerce/ | software | A | 60 | miocommerce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 653 | 23.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 11 | /compare/chatgpt-vs-writesonic/ | comparisons | A | 60 | writesonic vs chatgpt | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 220 | 39.7 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 12 | /guides/ | guides | A | 60 | — | UNKNOWN | UNKNOWN | 144 | 33.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 13 | /categories/ai/ | categories | A | 59 | (candidates only — caktus ai vs chatgpt) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1520 | 49.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 14 | /compare/crisp-vs-tidio/ | comparisons | A | 59 | tidio vs crisp | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 172 | 44.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 15 | / | other | A | 58 | — | UNKNOWN | UNKNOWN | 282 | 27.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 16 | /company/my-story/ | other | A | 58 | — | UNKNOWN | UNKNOWN | 104 | 7.2 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 17 | /compare/hubspot-vs-marketo/ | comparisons | A | 58 | hubspot vs marketo | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 64 | 37.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 18 | /for/startups/ | other | A | 58 | (candidates only — crm für startups) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 17.1 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 19 | /industries/music/ | industries | A | 57 | (candidates only — crm music industry) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1178 | 49.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 20 | /software/folk/ | software | A | 57 | folk crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 484 | 36.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 21 | /compare/keap-vs-salesforce/ | comparisons | A | 57 | (candidates only — keap crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 117 | 48.5 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 22 | /compare/activecampaign-vs-hubspot/ | comparisons | A | 57 | activecampaign vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 53 | 41.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 23 | /compare/salesforce-vs-zoho-crm/ | comparisons | A | 56 | zoho vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 36 | 41.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 24 | /compare/salesforce-vs-siebel/ | comparisons | A | 55 | siebel vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 981 | 52.8 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 25 | /compare/salesforce-vs-sugarcrm/ | comparisons | A | 55 | salesforce vs sugarcrm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 916 | 58.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 26 | /compare/marketo-vs-salesforce/ | comparisons | A | 55 | marketo vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 632 | 67.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 27 | /software/writesonic/ | software | A | 55 | (candidates only — writesonic vs chatgpt) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 95 | 65.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 28 | /compare/hubspot-vs-zoho-crm/ | comparisons | A | 55 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 30 | 35.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 29 | /compare/hubspot-vs-monday-sales-crm/ | comparisons | A | 54 | hubspot vs monday | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 807 | 74.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 30 | /categories/ecommerce/ | categories | A | 54 | (candidates only — webydo ecommerce) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 751 | 42.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 31 | /guides/what-is-tidio/ | guides | B | 54 | tidio | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 237 | 41.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 32 | /compare/cpanel-vs-siteground/ | comparisons | B | 54 | — | UNKNOWN | UNKNOWN | 60 | 65.4 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 33 | /categories/crm/ | categories | A | 53 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 7172 | 61.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 34 | /categories/marketing/ | categories | A | 53 | (candidates only — local seo marketing software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 4232 | 52.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 35 | /software/getresponse/ | software | A | 53 | getresponse review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 4143 | 61.0 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 36 | /software/hubspot/ | software | A | 53 | hubspot review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 2880 | 67.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 37 | /compare/pipedrive-vs-salesforce/ | comparisons | A | 53 | pipedrive vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1386 | 73.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 38 | /software/krispcall/ | software | A | 53 | krispcall | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1266 | 48.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 39 | /software/closely/ | software | A | 53 | closely | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1059 | 41.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 40 | /software/diginius/ | software | A | 53 | diginius | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1044 | 37.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 41 | /compare/insightly-vs-salesforce/ | comparisons | A | 53 | salesforce vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 451 | 56.2 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 42 | /compare/hubspot-vs-insightly/ | comparisons | A | 53 | hubspot vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 411 | 64.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 43 | /compare/oracle-cx-vs-salesforce/ | comparisons | A | 53 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 410 | 53.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 44 | /software/zoho-crm/ | software | A | 53 | (candidates only — salesforce crm review) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 244 | 41.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 45 | /compare/tidio-vs-zendesk/ | comparisons | A | 53 | tidio vs zendesk | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 100 | 51.7 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 46 | /software/freshsales/ | software | A | 52 | freshsales review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1199 | 59.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 47 | /software/close/ | software | A | 52 | close crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 881 | 54.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 48 | /software/nimble/ | software | A | 52 | nimble crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 830 | 67.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 49 | /compare/hubspot-vs-pipedrive/ | comparisons | A | 52 | pipedrive vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 825 | 76.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 50 | /compare/freshsales-vs-hubspot/ | comparisons | A | 52 | freshsales vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 274 | 62.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |

## TOP 100 — Full improvement backlog

| # | Path | Estate | Queue | Page opportunity | Query evidence | Query confidence | Relationship | Imp | Pos | Recommended action | Action conf | Diff |
| ---: | --- | --- | --- | ---: | --- | --- | --- | ---: | ---: | --- | --- | --- |
| 1 | /software/fastmail/ | software | A | 67 | fastmail review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 2275 | 23.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 2 | /legal/privacy/ | other | A | 66 | (candidates only — crm legal) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 14.1 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 3 | /legal/terms/ | other | A | 66 | (candidates only — crm legal) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 30 | 18.4 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 4 | /compare/livechat-vs-tidio/ | comparisons | A | 65 | (candidates only — tidio) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 138 | 27.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 5 | /compare/hubspot-vs-tidio/ | comparisons | A | 64 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 67 | 23.0 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 6 | /software/shore/ | software | A | 63 | — | UNKNOWN | UNKNOWN | 345 | 22.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 7 | /compare/hubspot-vs-zendesk/ | comparisons | A | 63 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 43 | 35.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 8 | /software/affinity/ | software | A | 62 | — | UNKNOWN | UNKNOWN | 225 | 34.5 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 9 | /compare/chatgpt-vs-github-copilot/ | comparisons | A | 62 | (candidates only — writesonic vs chatgpt) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 24.4 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 10 | /software/miocommerce/ | software | A | 60 | miocommerce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 653 | 23.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 11 | /compare/chatgpt-vs-writesonic/ | comparisons | A | 60 | writesonic vs chatgpt | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 220 | 39.7 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 12 | /guides/ | guides | A | 60 | — | UNKNOWN | UNKNOWN | 144 | 33.2 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 13 | /categories/ai/ | categories | A | 59 | (candidates only — caktus ai vs chatgpt) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1520 | 49.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 14 | /compare/crisp-vs-tidio/ | comparisons | A | 59 | tidio vs crisp | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 172 | 44.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 15 | / | other | A | 58 | — | UNKNOWN | UNKNOWN | 282 | 27.9 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 16 | /company/my-story/ | other | A | 58 | — | UNKNOWN | UNKNOWN | 104 | 7.2 | OPTIMIZE_TITLE | PAGE_LEVEL | LOW |
| 17 | /compare/hubspot-vs-marketo/ | comparisons | A | 58 | hubspot vs marketo | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 64 | 37.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 18 | /for/startups/ | other | A | 58 | (candidates only — crm für startups) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 41 | 17.1 | OPTIMIZE_TITLE | SUPPRESSED | LOW |
| 19 | /industries/music/ | industries | A | 57 | (candidates only — crm music industry) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1178 | 49.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 20 | /software/folk/ | software | A | 57 | folk crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 484 | 36.6 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 21 | /compare/keap-vs-salesforce/ | comparisons | A | 57 | (candidates only — keap crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 117 | 48.5 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 22 | /compare/activecampaign-vs-hubspot/ | comparisons | A | 57 | activecampaign vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 53 | 41.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 23 | /compare/salesforce-vs-zoho-crm/ | comparisons | A | 56 | zoho vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 36 | 41.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 24 | /compare/salesforce-vs-siebel/ | comparisons | A | 55 | siebel vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 981 | 52.8 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 25 | /compare/salesforce-vs-sugarcrm/ | comparisons | A | 55 | salesforce vs sugarcrm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 916 | 58.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 26 | /compare/marketo-vs-salesforce/ | comparisons | A | 55 | marketo vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 632 | 67.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 27 | /software/writesonic/ | software | A | 55 | (candidates only — writesonic vs chatgpt) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 95 | 65.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 28 | /compare/hubspot-vs-zoho-crm/ | comparisons | A | 55 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 30 | 35.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 29 | /compare/hubspot-vs-monday-sales-crm/ | comparisons | A | 54 | hubspot vs monday | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 807 | 74.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 30 | /categories/ecommerce/ | categories | A | 54 | (candidates only — webydo ecommerce) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 751 | 42.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 31 | /guides/what-is-tidio/ | guides | B | 54 | tidio | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 237 | 41.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 32 | /compare/cpanel-vs-siteground/ | comparisons | B | 54 | — | UNKNOWN | UNKNOWN | 60 | 65.4 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 33 | /categories/crm/ | categories | A | 53 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 7172 | 61.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 34 | /categories/marketing/ | categories | A | 53 | (candidates only — local seo marketing software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 4232 | 52.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 35 | /software/getresponse/ | software | A | 53 | getresponse review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 4143 | 61.0 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 36 | /software/hubspot/ | software | A | 53 | hubspot review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 2880 | 67.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 37 | /compare/pipedrive-vs-salesforce/ | comparisons | A | 53 | pipedrive vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1386 | 73.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 38 | /software/krispcall/ | software | A | 53 | krispcall | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1266 | 48.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 39 | /software/closely/ | software | A | 53 | closely | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1059 | 41.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 40 | /software/diginius/ | software | A | 53 | diginius | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1044 | 37.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 41 | /compare/insightly-vs-salesforce/ | comparisons | A | 53 | salesforce vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 451 | 56.2 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 42 | /compare/hubspot-vs-insightly/ | comparisons | A | 53 | hubspot vs insightly | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 411 | 64.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 43 | /compare/oracle-cx-vs-salesforce/ | comparisons | A | 53 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 410 | 53.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 44 | /software/zoho-crm/ | software | A | 53 | (candidates only — salesforce crm review) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 244 | 41.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 45 | /compare/tidio-vs-zendesk/ | comparisons | A | 53 | tidio vs zendesk | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 100 | 51.7 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 46 | /software/freshsales/ | software | A | 52 | freshsales review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1199 | 59.4 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 47 | /software/close/ | software | A | 52 | close crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 881 | 54.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 48 | /software/nimble/ | software | A | 52 | nimble crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 830 | 67.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 49 | /compare/hubspot-vs-pipedrive/ | comparisons | A | 52 | pipedrive vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 825 | 76.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 50 | /compare/freshsales-vs-hubspot/ | comparisons | A | 52 | freshsales vs hubspot | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 274 | 62.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 51 | /compare/act-vs-salesforce/ | comparisons | A | 52 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 228 | 63.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 52 | /compare/hubspot-vs-keap/ | comparisons | A | 52 | (candidates only — pipedrive vs hubspot) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 225 | 65.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 53 | /compare/pega-vs-salesforce/ | comparisons | A | 52 | pega vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 204 | 58.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 54 | /use-cases/analytics/ | use-cases | A | 51 | (candidates only — analytics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 980 | 79.0 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 55 | /use-cases/prospecting/ | use-cases | A | 51 | — | UNKNOWN | UNKNOWN | 695 | 76.1 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 56 | /compare/monday-sales-crm-vs-salesforce/ | comparisons | A | 51 | monday crm vs salesforce | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 523 | 72.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 57 | /software/netsuite/ | software | A | 51 | netsuite crm reviews | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 508 | 66.7 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 58 | /compare/ | comparisons | A | 51 | — | UNKNOWN | UNKNOWN | 505 | 70.4 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 59 | /compare/salesforce-vs-zendesk/ | comparisons | A | 51 | (candidates only — pipedrive vs salesforce) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 77 | 50.9 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 60 | /software/pega/ | software | A | 51 | pega crm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 74 | 47.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 61 | /industries/solar/ | industries | A | 50 | (candidates only — solar crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 2743 | 86.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 62 | /industries/private-equity/ | industries | A | 50 | (candidates only — private equity crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 2736 | 83.9 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 63 | /industries/event-management/ | industries | A | 50 | (candidates only — best crm for event management) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 2190 | 87.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 64 | /software/capsule/ | software | A | 50 | capsule crm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1482 | 51.0 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 65 | /for/freelancers/ | other | A | 50 | (candidates only — crm for freelancers) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 912 | 83.7 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 66 | /use-cases/lead-management/ | use-cases | A | 50 | — | UNKNOWN | UNKNOWN | 835 | 69.8 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 67 | /software/copper/ | software | A | 50 | (candidates only — copper crm alternatives) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 788 | 75.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 68 | /software/cloze/ | software | A | 50 | cloze crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 429 | 57.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 69 | /software/wealthbox/ | software | A | 50 | (candidates only — wealthbox vs redtail) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 266 | 53.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 70 | /company/contact/ | other | A | 50 | — | UNKNOWN | UNKNOWN | 96 | 35.6 | OPTIMIZE_TITLE | PAGE_LEVEL | MEDIUM |
| 71 | /industries/hospitality/ | industries | A | 49 | (candidates only — hospitality crm software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 5053 | 85.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 72 | /best/crm-software/ | best | A | 49 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 4513 | 77.3 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 73 | /industries/plumbing/ | industries | A | 49 | (candidates only — plumbing crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 3187 | 86.5 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 74 | /industries/real-estate/ | industries | A | 49 | (candidates only — commercial real estate crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 2847 | 76.8 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 75 | /industries/venture-capital/ | industries | A | 49 | (candidates only — venture capital crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1464 | 80.9 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 76 | /industries/coaching/ | industries | A | 49 | (candidates only — crm for coaching business) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1368 | 86.9 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 77 | /industries/photography/ | industries | A | 49 | (candidates only — photography crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 1213 | 81.5 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 78 | /industries/nonprofit/ | industries | A | 49 | (candidates only — best crm for small nonprofit) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 1153 | 80.9 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 79 | /software/salesforce/ | software | A | 49 | salesforce crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 761 | 78.2 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 80 | /software/zendesk/ | software | A | 49 | zendesk crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 759 | 71.9 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 81 | /software/agile-crm/ | software | A | 49 | agile crm review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 573 | 71.9 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 82 | /software/apptivo/ | software | A | 49 | apptivo review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 211 | 64.0 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 83 | /software/sugarcrm/ | software | A | 49 | (candidates only — salesforce vs sugarcrm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 160 | 60.4 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 84 | /guides/what-is-ai-software/ | guides | A | 49 | (candidates only — what is semrush) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 82 | 7.9 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 85 | /software/keap/ | software | A | 48 | keap | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 2295 | 64.8 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 86 | /industries/investor-relations/ | industries | A | 48 | (candidates only — investor relations crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 980 | 86.8 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 87 | /industries/financial-services/ | industries | A | 48 | (candidates only — crm for financial advisors) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 965 | 80.7 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 88 | /industries/web-design/ | industries | A | 48 | (candidates only — best crm for web designers) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 864 | 81.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 89 | /industries/engineering/ | industries | A | 48 | (candidates only — engineering crm software) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 780 | 72.1 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 90 | /software/pipedrive/ | software | A | 48 | pipedrive review | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 503 | 84.2 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 91 | /software/podio/ | software | A | 48 | (candidates only — podio crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 344 | 55.6 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |
| 92 | /guides/crm-implementation/ | guides | A | 48 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 33 | 45.7 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 93 | /software/sanebox/ | software | A | 47 | sanebox | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1593 | 59.3 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 94 | /software/kaspr/ | software | A | 47 | kaspr | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1460 | 55.1 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 95 | /software/navan/ | software | A | 47 | navan | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1360 | 52.5 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 96 | /software/dynamics-365/ | software | A | 47 | dynamics 365 crm | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1074 | 75.4 | IMPROVE_INTRO | REVIEW_REQUIRED | MEDIUM |
| 97 | /software/lusha/ | software | A | 47 | lusha | HIGH | INFERRED_HIGH — NOT DIRECT GSC DATA | 1068 | 59.7 | MANUAL_REVIEW | REVIEW_REQUIRED | MEDIUM |
| 98 | /capabilities/sms-messaging/ | other | A | 47 | (candidates only — crm messaging platform) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 961 | 87.7 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 99 | /guides/what-is-crm/ | guides | A | 47 | (candidates only — microsoft dynamics crm) | LOW | INFERRED_LOW — NOT DIRECT GSC DATA | 716 | 56.2 | IMPROVE_INTRO | SUPPRESSED | MEDIUM |
| 100 | /software/mailchimp/ | software | A | 47 | (candidates only — mailchimp crm) | MEDIUM | INFERRED_MEDIUM — NOT DIRECT GSC DATA | 286 | 63.2 | OPTIMIZE_TITLE | SUPPRESSED | MEDIUM |

## Cannibalization / intent overlap

| Classification | Cluster/query | Provenance | Paths | Impressions | Review |
| --- | --- | --- | --- | --- | --- |
| POSSIBLE_INTENT_OVERLAP | comparison:pipedrive+salesforce | INFERRED | /compare/keap-vs-salesforce/<br>/compare/salesforce-vs-zoho-crm/<br>/compare/salesforce-vs-siebel/<br>/compare/salesforce-vs-sugarcrm/<br>/compare/marketo-vs-salesforce/<br>/compare/pipedrive-vs-salesforce/<br>/compare/oracle-cx-vs-salesforce/<br>/compare/hubspot-vs-pipedrive/<br>/compare/act-vs-salesforce/<br>/compare/pega-vs-salesforce/<br>/compare/monday-sales-crm-vs-salesforce/<br>/compare/salesforce-vs-zendesk/<br>/software/salesforce/<br>/compare/netsuite-vs-salesforce/<br>/compare/salesforce-vs-sap/ | 117, 36, 981, 916, 632, 1386, 410, 825, 228, 204, 523, 77, 761, 131, 171 | yes |
| POSSIBLE_INTENT_OVERLAP | comparison:hubspot+pipedrive | INFERRED | /compare/hubspot-vs-tidio/<br>/compare/hubspot-vs-zendesk/<br>/compare/hubspot-vs-marketo/<br>/compare/hubspot-vs-zoho-crm/<br>/compare/hubspot-vs-monday-sales-crm/<br>/software/hubspot/<br>/compare/pipedrive-vs-salesforce/<br>/compare/hubspot-vs-pipedrive/<br>/compare/freshsales-vs-hubspot/<br>/compare/hubspot-vs-keap/<br>/software/pipedrive/<br>/compare/hubspot-vs-pardot/<br>/compare/hubspot-vs-mailchimp/ | 67, 43, 64, 30, 807, 2880, 1386, 825, 274, 225, 503, 24, 23 | yes |
| POSSIBLE_INTENT_OVERLAP | best:crm:none | INFERRED | /industries/solar/<br>/industries/event-management/<br>/for/freelancers/<br>/industries/hospitality/<br>/industries/photography/<br>/industries/nonprofit/<br>/industries/web-design/<br>/industries/construction/ | 2743, 2190, 912, 5053, 1213, 1153, 864, 160 | yes |
| POSSIBLE_INTENT_OVERLAP | microsoft dynamics crm | INFERRED | /categories/crm/<br>/best/crm-software/<br>/guides/crm-implementation/<br>/guides/what-is-crm/<br>/guides/how-to-choose-crm/<br>/guides/zoho-crm-setup/<br>/guides/crm-data-migration/ | 7172, 4513, 33, 716, 1093, 209, 351 | yes |
| POSSIBLE_INTENT_OVERLAP | plumber crm | INFERRED | /categories/crm/<br>/best/crm-software/<br>/guides/crm-implementation/<br>/guides/what-is-crm/<br>/guides/how-to-choose-crm/<br>/guides/zoho-crm-setup/<br>/guides/crm-data-migration/ | 7172, 4513, 33, 716, 1093, 209, 351 | yes |
| POSSIBLE_INTENT_OVERLAP | salesforce crm review | INFERRED | /compare/oracle-cx-vs-salesforce/<br>/software/zoho-crm/<br>/compare/act-vs-salesforce/<br>/software/salesforce/<br>/software/agile-crm/<br>/compare/netsuite-vs-salesforce/<br>/software/monday-sales-crm/ | 410, 244, 228, 761, 573, 131, 234 | yes |
| POSSIBLE_INTENT_OVERLAP | tidio | INFERRED | /compare/livechat-vs-tidio/<br>/compare/crisp-vs-tidio/<br>/guides/what-is-tidio/<br>/software/tidio/ | 138, 172, 237, 78 | yes |
| POSSIBLE_INTENT_OVERLAP | hubspot crm | INFERRED | /compare/hubspot-vs-tidio/<br>/compare/hubspot-vs-zoho-crm/<br>/compare/hubspot-vs-pardot/<br>/compare/hubspot-vs-mailchimp/ | 67, 30, 24, 23 | yes |
| POSSIBLE_INTENT_OVERLAP | zendesk crm | INFERRED | /compare/hubspot-vs-zendesk/<br>/compare/tidio-vs-zendesk/<br>/compare/salesforce-vs-zendesk/<br>/software/zendesk/ | 43, 100, 77, 759 | yes |
| POSSIBLE_INTENT_OVERLAP | comparison:chatgpt | INFERRED | /compare/chatgpt-vs-github-copilot/<br>/compare/chatgpt-vs-writesonic/<br>/categories/ai/<br>/guides/what-is-ai-software/ | 41, 220, 1520, 82 | yes |
| POSSIBLE_INTENT_OVERLAP | crm legal | INFERRED | /legal/privacy/<br>/legal/terms/<br>/industries/legal-services/ | 41, 30, 86 | yes |
| POSSIBLE_INTENT_OVERLAP | comparison:crisp+tidio | INFERRED | /compare/livechat-vs-tidio/<br>/compare/crisp-vs-tidio/<br>/software/tidio/ | 138, 172, 78 | yes |
| POSSIBLE_INTENT_OVERLAP | comparison:chatgpt+writesonic | INFERRED | /compare/chatgpt-vs-github-copilot/<br>/compare/chatgpt-vs-writesonic/<br>/software/writesonic/ | 41, 220, 95 | yes |
| POSSIBLE_INTENT_OVERLAP | keap crm | INFERRED | /compare/keap-vs-salesforce/<br>/compare/hubspot-vs-keap/<br>/software/keap/ | 117, 225, 2295 | yes |
| POSSIBLE_INTENT_OVERLAP | insightly | INFERRED | /compare/insightly-vs-salesforce/<br>/compare/hubspot-vs-insightly/<br>/software/insightly/ | 451, 411, 2837 | yes |
| POSSIBLE_INTENT_OVERLAP | activecampaign | INFERRED | /compare/activecampaign-vs-hubspot/<br>/software/activecampaign/ | 53, 2407 | yes |
| POSSIBLE_INTENT_OVERLAP | comparison:salesforce+sugarcrm | INFERRED | /compare/salesforce-vs-sugarcrm/<br>/software/sugarcrm/ | 916, 160 | yes |
| POSSIBLE_INTENT_OVERLAP | webydo ecommerce | INFERRED | /categories/ecommerce/<br>/industries/retail-ecommerce/ | 751, 560 | yes |
| POSSIBLE_INTENT_OVERLAP | what is semrush | INFERRED | /guides/what-is-tidio/<br>/guides/what-is-ai-software/ | 237, 82 | yes |
| POSSIBLE_INTENT_OVERLAP | local seo marketing software | INFERRED | /categories/marketing/<br>/best/marketing-software/ | 4232, 117 | yes |

## High-impression queries — existing-page-first

_Prefer improving an existing SoftwareGlimpse URL. CREATE_CANDIDATE only when no suitable page exists._

| Query | Imp | Pos | Intent | Improve existing | Create? |
| --- | ---: | ---: | --- | --- | --- |
| spyfu vs semrush | 8627 | 63.8 | comparison | — | maybe |
| surferseo vs ahrefs | 6692 | 72.8 | comparison | — | maybe |
| semrush vs moz | 5508 | 70.1 | comparison | — | maybe |
| surfer seo vs ahrefs | 5277 | 76.7 | comparison | — | maybe |
| semrush vs spyfu | 5020 | 71.7 | comparison | — | maybe |
| software seo | 4368 | 81.6 | informational | — | maybe |
| ahrefs vs semrush | 4046 | 70.8 | comparison | — | maybe |
| seo moz vs semrush | 3809 | 68.8 | comparison | — | maybe |
| semrush review | 3596 | 82.4 | review | — | maybe |
| seo software | 3337 | 81.7 | informational | — | maybe |
| beste seo software | 2470 | 81.3 | informational | — | maybe |
| microsoft dynamics crm | 2264 | 73.9 | informational | — | maybe |
| seo software nederlands | 1836 | 80.0 | informational | — | maybe |
| diy seo software | 1765 | 72.5 | informational | — | maybe |
| script writing software | 1394 | 80.0 | informational | — | maybe |
| local seo marketing software | 1310 | 83.3 | informational | — | maybe |
| surfer seo vs semrush | 1261 | 67.3 | comparison | — | maybe |
| software para seo | 1236 | 82.2 | informational | — | maybe |
| lokale seo software | 1218 | 80.9 | informational | — | maybe |
| local seo tools | 1195 | 88.2 | informational | — | maybe |
| seopress vs rank math | 1158 | 66.1 | comparison | — | maybe |
| seo software pro | 1122 | 92.0 | informational | — | maybe |
| crm para restaurantes | 1120 | 83.2 | informational | — | maybe |
| local seo software | 1097 | 86.7 | informational | — | maybe |
| plumber crm | 1060 | 89.0 | informational | — | maybe |

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
