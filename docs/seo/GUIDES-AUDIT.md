# Guides index-worthiness audit

**Generated:** 2026-09-10T20:40:27.314Z
**Engine:** guides-index-worthiness v2.2.0

Lifecycle-first policy: weak guides are **preserved** under IMPROVE (temporary `noindex,follow`), then enriched, validated, and promoted to INDEXABLE. Robots noindex is a directive — not a permanent business classification. Factory packs and product explainers stay routable for onsite UX.

## Summary

| Metric | Count |
| --- | ---: |
| Total guide pages | 1715 |
| Indexable | 688 |
| Improvement queue | 1019 (IMPROVE 1019 · IMPROVING 0) |
| Ready for promotion | 1 (INDEXABLE_READY 1 · READY_FOR_REVIEW 0) |
| Manual review | 7 |
| Retired | 0 |
| Potential indexable after remediation | 1027 |
| Search-indexable (post-policy) | 688 |
| Seed `seo.indexable=true` (pre-policy) | 348 |
| FACTORY_ORIGIN_TOTAL (inventory — not a quality KPI) | 1272 |
| FACTORY_HIGH_RISK | 1104 |
| FACTORY_LIMITED_UNIQUE | 1106 |
| FACTORY_QUALITY_PASS | 1272 |
| FACTORY_INDEXABLE | 419 |
| FACTORY_IMPROVE | 853 |
| FACTORY_PROMOTED (promoted after remediation) | 419 |
| Estate high near-duplicate risk (all guides) | 1192 |
| Estate limited unique-analysis (all guides) | 1206 |
| Orphans (0 inbound estimate) | 0 |
| Near-orphans (1 inbound) | 0 |
| Duplicate-risk clusters | 6 |
| Intent clusters | 0 |

### Legacy class counts (compat)

| Class | Count |
| --- | ---: |
| KEEP_INDEX | 450 |
| IMPROVE | 1258 |
| NOINDEX | 0 |
| MERGE | 0 |
| REMOVE | 0 |
| REVIEW_MANUALLY | 7 |

## Policy

- **FACTORY_ORIGIN_TOTAL** is inventory/history (slug-class packs). It does **not** fall when those pages become excellent. Remediation KPIs are HIGH_RISK ↓, LIMITED_UNIQUE ↓, QUALITY_PASS ↑, INDEXABLE ↑, IMPROVE ↓.
- **Factory product packs** → **IMPROVE** (TEMPLATE_HEAVY) — preserved; temporary noindex until enriched + promoted.
- **Product explainers** → **IMPROVE** (THIN_EXPLAINER / TEMPLATE_HEAVY) — preserved for product-hub UX.
- Category educational guides with substance + uniqueness → **INDEXABLE**.
- Soft gaps → **IMPROVE** → enrichment → **INDEXABLE_READY** → `promoteToIndexable` → sitemap.
- Ambiguous intent clusters → **MANUAL_REVIEW** (no destructive redirects).
- **RETIRED** only for genuinely obsolete / invalid / duplicate pages — not for weak-but-useful URLs.

## Guide types

| Type | Total | Indexable |
| --- | ---: | ---: |
| product-pack-factory | 1272 | 421 |
| product-explainer | 101 | 13 |
| educational-explainer | 75 | 53 |
| software-selection | 58 | 36 |
| comparison-education | 39 | 39 |
| pricing-guide | 36 | 14 |
| buying-guide | 34 | 34 |
| how-to | 33 | 33 |
| checklist | 30 | 30 |
| implementation-guide | 18 | 18 |
| industry-guide | 7 | 0 |
| trend-research | 6 | 6 |
| migration-guide | 5 | 5 |
| other | 1 | 1 |

## By category

| Category | Total | Indexable | Not indexed | Improve queue |
| --- | ---: | ---: | ---: | ---: |
| crm | 268 | 153 | 115 | 189 |
| it-development | 250 | 50 | 200 | 203 |
| sales-intelligence | 180 | 120 | 61 | 131 |
| ai | 132 | 50 | 83 | 98 |
| business-communications | 125 | 43 | 84 | 92 |
| hr | 121 | 33 | 89 | 100 |
| project-management | 115 | 33 | 82 | 101 |
| ecommerce | 109 | 23 | 87 | 92 |
| email-marketing | 100 | 39 | 61 | 87 |
| marketing | 80 | 33 | 47 | 62 |
| customer-service | 21 | 7 | 14 | 14 |
| voip-business-phone | 13 | 6 | 8 | 8 |
| accounting-finance | 11 | 5 | 6 | 6 |
| live-chat | 11 | 5 | 6 | 6 |
| dropshipping-pod | 11 | 5 | 6 | 6 |
| landing-pages-cro | 11 | 5 | 6 | 6 |
| website-digital-presence | 10 | 7 | 5 | 5 |
| field-service-operations | 10 | 5 | 5 | 5 |
| fulfillment-shipping | 10 | 7 | 5 | 4 |
| ats-recruiting | 10 | 5 | 5 | 5 |
| time-attendance | 10 | 5 | 5 | 5 |
| ppc-advertising | 10 | 5 | 5 | 5 |
| social-media-marketing | 9 | 5 | 4 | 4 |
| webinar-virtual-events | 9 | 6 | 4 | 4 |
| lms-course-creation | 9 | 5 | 4 | 4 |
| analytics-bi | 9 | 5 | 4 | 4 |
| ai-website-builder | 9 | 5 | 4 | 4 |
| helpdesk-ticketing | 9 | 6 | 4 | 4 |
| web-hosting | 9 | 5 | 4 | 4 |
| itsm | 9 | 6 | 4 | 4 |
| social-media-management | 9 | 6 | 4 | 4 |
| reputation-reviews | 8 | 5 | 3 | 3 |
| ai-writing | 8 | 5 | 3 | 3 |

## Content distributions

| Metric | p25 | p50 | p75 |
| --- | ---: | ---: | ---: |
| Unique content ratio | 0.55 | 0.55 | 0.55 |
| Word count | 1227 | 1344 | 1491 |

## Duplicate-risk clusters

- **dup-factory-worth-it** (high): 243 factory worth-it product packs still high near-duplicate after overlay+sibling analysis — sample: is-zendesk-suite-worth-it, is-help-scout-worth-it, is-gorgias-worth-it, is-livechat-worth-it, is-zoho-desk-worth-it, is-nicejob-worth-it, is-shore-worth-it, is-act-worth-it
- **dup-factory-implementation** (high): 183 factory implementation product packs still high near-duplicate after overlay+sibling analysis — sample: act-implementation, affinity-implementation, agile-crm-implementation, apptivo-implementation, attio-implementation, bitrix24-implementation, capsule-implementation, close-implementation
- **dup-factory-migration** (high): 248 factory migration product packs still high near-duplicate after overlay+sibling analysis — sample: act-migration, affinity-migration, agile-crm-migration, apptivo-migration, attio-migration, bitrix24-migration, capsule-migration, close-migration
- **dup-factory-setup** (high): 188 factory setup product packs still high near-duplicate after overlay+sibling analysis — sample: act-setup, affinity-setup, agile-crm-setup, apptivo-setup, attio-setup, bitrix24-setup, capsule-setup, close-setup
- **dup-factory-plans** (high): 242 factory plans product packs still high near-duplicate after overlay+sibling analysis — sample: act-plans, affinity-plans, agile-crm-plans, apptivo-plans, attio-plans, bitrix24-plans, close-plans, cloze-plans
- **dup-product-explainer-what-is** (high): 88 what-is-{product} explainers still high template overlap — sample: what-is-zendesk-suite, what-is-help-scout, what-is-gorgias, what-is-livechat, what-is-zoho-desk, what-is-nicejob, what-is-shore, what-is-inboxally

## Intent clusters (cannibalization)

_None detected._

## Proposed merges

_None with automatic confidence._

## Proposed redirects

_None applied automatically — medium-confidence merges stay MANUAL_REVIEW flags only. Existing URLs are preserved._

## Orphan / near-orphan guides

Orphans: 0. Near-orphans: 0.

## Ready for promotion

| Rank | URL | Lifecycle | Reasons |
| ---: | --- | --- | --- |
| 1 | /guides/what-is-sendcloud/ | INDEXABLE_READY | All index-worthiness gates passed |

## Top 100 improvement priorities

| Rank | URL | Lifecycle | Type | Unique | Improvement reasons | Remediation |
| ---: | --- | --- | --- | ---: | --- | --- |
| 1 | /guides/how-to-choose-accounting-finance-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 2 | /guides/accounting-finance-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 3 | /guides/what-is-social-media-marketing-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 4 | /guides/how-to-choose-social-media-marketing-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 5 | /guides/social-media-marketing-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 6 | /guides/what-is-webinar-virtual-events-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 7 | /guides/how-to-choose-webinar-virtual-events-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 8 | /guides/webinar-virtual-events-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 9 | /guides/what-is-lms-course-creation-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 10 | /guides/how-to-choose-lms-course-creation-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 11 | /guides/lms-course-creation-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 12 | /guides/what-is-website-digital-presence-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 13 | /guides/how-to-choose-website-digital-presence-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 14 | /guides/website-digital-presence-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 15 | /guides/what-is-analytics-bi-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 16 | /guides/how-to-choose-analytics-bi-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 17 | /guides/analytics-bi-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 18 | /guides/what-is-field-service-operations-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 19 | /guides/how-to-choose-field-service-operations-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 20 | /guides/field-service-operations-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 21 | /guides/what-is-reputation-reviews-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 22 | /guides/how-to-choose-reputation-reviews-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 23 | /guides/reputation-reviews-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 24 | /guides/what-is-ai-writing-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 25 | /guides/how-to-choose-ai-writing-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 26 | /guides/ai-writing-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 27 | /guides/what-is-ai-website-builder-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 28 | /guides/how-to-choose-ai-website-builder-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 29 | /guides/ai-website-builder-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 30 | /guides/what-is-voip-business-phone-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 31 | /guides/how-to-choose-voip-business-phone-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 32 | /guides/voip-business-phone-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 33 | /guides/what-is-live-chat-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 34 | /guides/how-to-choose-live-chat-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 35 | /guides/live-chat-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 36 | /guides/what-is-helpdesk-ticketing-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 37 | /guides/how-to-choose-helpdesk-ticketing-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 38 | /guides/helpdesk-ticketing-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 39 | /guides/what-is-dropshipping-pod-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 40 | /guides/how-to-choose-dropshipping-pod-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 41 | /guides/dropshipping-pod-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 42 | /guides/what-is-fulfillment-shipping-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 43 | /guides/how-to-choose-fulfillment-shipping-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 44 | /guides/fulfillment-shipping-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 45 | /guides/what-is-ats-recruiting-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 46 | /guides/how-to-choose-ats-recruiting-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 47 | /guides/ats-recruiting-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 48 | /guides/what-is-time-attendance-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 49 | /guides/how-to-choose-time-attendance-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 50 | /guides/time-attendance-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 51 | /guides/what-is-web-hosting-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 52 | /guides/how-to-choose-web-hosting-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 53 | /guides/web-hosting-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 54 | /guides/what-is-itsm-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 55 | /guides/how-to-choose-itsm-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 56 | /guides/itsm-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 57 | /guides/what-is-social-media-management-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 58 | /guides/how-to-choose-social-media-management-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 59 | /guides/social-media-management-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 60 | /guides/what-is-landing-pages-cro-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 61 | /guides/how-to-choose-landing-pages-cro-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 62 | /guides/landing-pages-cro-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 63 | /guides/what-is-ppc-advertising-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 64 | /guides/how-to-choose-ppc-advertising-software/ | IMPROVE | software-selection | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 65 | /guides/ppc-advertising-pricing-guide/ | IMPROVE | pricing-guide | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 66 | /guides/what-is-accounting-finance-software/ | IMPROVE | educational-explainer | 0.55 | LOW_EVIDENCE | evidence_sources, data_backed_comparison |
| 67 | /guides/act-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 68 | /guides/act-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 69 | /guides/act-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 70 | /guides/affinity-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 71 | /guides/affinity-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 72 | /guides/affinity-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 73 | /guides/agile-crm-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 74 | /guides/agile-crm-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 75 | /guides/agile-crm-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 76 | /guides/apptivo-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 77 | /guides/apptivo-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 78 | /guides/apptivo-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 79 | /guides/attio-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 80 | /guides/attio-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 81 | /guides/attio-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 82 | /guides/is-attio-worth-it/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 83 | /guides/bitrix24-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 84 | /guides/bitrix24-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 85 | /guides/bitrix24-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 86 | /guides/is-bitrix24-worth-it/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 87 | /guides/cloze-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 88 | /guides/cloze-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 89 | /guides/cloze-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 90 | /guides/copper-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 91 | /guides/copper-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 92 | /guides/copper-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 93 | /guides/is-copper-worth-it/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 94 | /guides/creatio-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 95 | /guides/creatio-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 96 | /guides/creatio-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 97 | /guides/is-creatio-worth-it/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 98 | /guides/dynamics-365-implementation/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 99 | /guides/dynamics-365-migration/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |
| 100 | /guides/dynamics-365-setup/ | IMPROVE | product-pack-factory | 0.55 | TEMPLATE_HEAVY, INSUFFICIENT_UNIQUE_VALUE | product_specific_analysis, data_backed_comparison, category_specific_guidance |

## Weak guides (completeness / uniqueness)


## Sitemap impact

Only **INDEXABLE** guides enter the sitemap. IMPROVE / MANUAL_REVIEW pages remain HTTP 200 with temporary noindex until promoted via `canPromoteToIndexable` / `promoteToIndexable` (no per-page code edit).

| Seed indexable flag (current) | Indexable (sitemap) | Improvement queue |
| ---: | ---: | ---: |
| 348 | 688 | 1019 |

## Safe consolidations applied

- Runtime `isGuideSearchIndexWorthy` + lifecycle promotion wired into `isEntityIndexable`.
- Factory product-pack builders default `seo.indexable: false` (IMPROVE queue).
- Guides hub discovery grid + CollectionPage JSON-LD limited to INDEXABLE guides.
- Ambiguous merges flagged MANUAL_REVIEW — no mass 301s; URLs preserved.

## Remaining work

1. Editorial pass on MANUAL_REVIEW intent clusters before merging.
2. Enrich IMPROVE queue pages (unique analysis, pricing, links) then promote.
3. Optionally promote a curated set of enriched product `worth-it` pages after unique editorial work.

## Machine-readable output

- `data/seo/guides-audit.json`
- `data/seo/content-lifecycle.json` (promotion registry)
