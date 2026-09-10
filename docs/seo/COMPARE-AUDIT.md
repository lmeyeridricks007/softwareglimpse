# Comparison index-worthiness audit

**Generated:** 2026-09-10T20:42:55.806Z
**Engine:** compare-index-worthiness v2.0.0

Lifecycle-first policy: weak comparisons are **preserved** under IMPROVE (temporary `noindex,follow`), then remediated and promoted to INDEXABLE. Cartesian pairs are not deleted — they stay in the improvement queue until competitive relationships and quality gates clear.

## Summary

| Metric | Count |
| --- | ---: |
| Total comparison pages | 4000 |
| Indexable | 2140 |
| Improvement queue | 1809 (IMPROVE 1809 · IMPROVING 0) |
| Ready for promotion | 0 (INDEXABLE_READY 0 · READY_FOR_REVIEW 0) |
| Manual review | 51 |
| Retired | 0 |
| Potential indexable after remediation | 1860 |
| Search-indexable (post-policy) | 2140 |
| Seed `seo.indexable=true` (pre-policy) | 1440 |
| Orphans (0 inbound estimate) | 0 |
| Near-orphans (1 inbound) | 0 |
| Duplicate-risk clusters | 5 |

### Legacy class counts (compat)

| Class | Count |
| --- | ---: |
| KEEP_INDEX | 2251 |
| IMPROVE | 1693 |
| NOINDEX | 0 |
| MERGE | 0 |
| REDIRECT | 0 |
| REVIEW_MANUALLY | 56 |

## Policy

- Same-category **Cartesian** pairs without declared relationships → **IMPROVE** (WEAK_COMPARISON_RELATIONSHIP) — not deleted.
- Declared competitive relationships + quality/differentiation/decision gates → **INDEXABLE**.
- Soft gaps on otherwise legitimate pairs → **IMPROVE** → remediate → **INDEXABLE_READY** → promote.
- Best-of co-appearance without declarations → **MANUAL_REVIEW**.
- MANUAL_REVIEW backlog is triaged by `npm run seo:compare-manual-review -- --apply` (evidence → DIRECT_COMPETITOR / ALTERNATIVE / CROSS_CATEGORY_DECISION / SPECIALIST_VS_GENERALIST / WEAK_RELATIONSHIP / MISSING_DATA / NONSENSICAL). See `docs/seo/COMPARE-MANUAL-REVIEW.md`.
- New generation must call `mayCreateIndexableComparison` — unrestricted Cartesian cannot silently set `indexable: true`.
- **RETIRED** only for genuinely obsolete / invalid / duplicate pages.

## By category

| Category | Total | Indexable | Not indexed | Improve queue |
| --- | ---: | ---: | ---: | ---: |
| it-development | 1144 | 182 | 967 | 944 |
| crm | 666 | 659 | 7 | 7 |
| sales-intelligence | 409 | 390 | 117 | 117 |
| ai | 361 | 76 | 288 | 264 |
| business-communications | 282 | 204 | 81 | 78 |
| hr | 275 | 82 | 193 | 193 |
| marketing | 207 | 115 | 93 | 92 |
| project-management | 196 | 145 | 51 | 51 |
| ecommerce | 194 | 192 | 2 | 2 |
| email-marketing | 185 | 185 | 0 | 0 |
| customer-service | 16 | 13 | 3 | 3 |
| live-chat | 10 | 0 | 10 | 10 |
| analytics-bi | 9 | 6 | 4 | 4 |
| field-service-operations | 8 | 1 | 7 | 7 |
| reputation-reviews | 7 | 1 | 6 | 6 |
| voip-business-phone | 6 | 0 | 6 | 6 |
| helpdesk-ticketing | 6 | 0 | 6 | 6 |
| social-media-management | 4 | 0 | 4 | 4 |
| dropshipping-pod | 4 | 0 | 4 | 4 |
| website-digital-presence | 3 | 0 | 3 | 3 |
| accounting-finance | 2 | 0 | 2 | 2 |
| fulfillment-shipping | 2 | 0 | 2 | 2 |
| ppc-advertising | 1 | 0 | 1 | 1 |
| lms-course-creation | 1 | 0 | 1 | 1 |
| social-media-marketing | 1 | 0 | 1 | 1 |
| ats-recruiting | 1 | 0 | 1 | 1 |

## Content completeness distributions

| Metric | p25 | p50 | p75 |
| --- | ---: | ---: | ---: |
| Feature completeness | 1 | 1 | 1 |
| Pricing completeness | 1 | 1 | 1 |
| Unique content ratio | 0.868 | 0.931 | 1 |

## Duplicate-risk clusters

- **dup-reputation-reviews-1** (high): 6 reputation-reviews comparisons with high template/boilerplate risk — sample: nicejob-vs-shore, nicejob-vs-tidio, nicejob-vs-ueni, nicejob-vs-uniqode, nicejob-vs-wati, ueni-vs-uniqode
- **dup-field-service-operations-2** (high): 7 field-service-operations comparisons with high template/boilerplate risk — sample: connecteam-vs-contractor-foreman, connecteam-vs-servicem8, contractor-foreman-vs-miocommerce, contractor-foreman-vs-servicem8, miocommerce-vs-servicem8, servicem8-vs-shore, shore-vs-tidio
- **dup-live-chat-3** (high): 10 live-chat comparisons with high template/boilerplate risk — sample: crisp-vs-freshchat, crisp-vs-intercom, crisp-vs-livechat, freshchat-vs-intercom, freshchat-vs-zendesk-suite, intercom-vs-livechat, intercom-vs-tidio, intercom-vs-zendesk
- **dup-voip-business-phone-4** (high): 6 voip-business-phone comparisons with high template/boilerplate risk — sample: aircall-vs-kixie, callhippo-vs-freshcaller, callhippo-vs-kixie, freshcaller-vs-kixie, freshcaller-vs-krispcall, kixie-vs-krispcall
- **dup-helpdesk-ticketing-5** (high): 6 helpdesk-ticketing comparisons with high template/boilerplate risk — sample: freshdesk-vs-gorgias, freshdesk-vs-intercom, freshservice-vs-zoho-desk, gorgias-vs-zendesk-suite, help-scout-vs-intercom, intercom-vs-zendesk-suite

## Orphan / near-orphan comparisons

Orphans: 0. Near-orphans: 0.

## Ready for promotion

_None currently INDEXABLE_READY._

## Top 100 to improve first

| Rank | URL | Lifecycle | Category | Unique | Improvement reasons | Remediation |
| ---: | --- | --- | --- | ---: | --- | --- |
| 1 | /compare/ringcentral-vs-wati/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 2 | /compare/evolve-vs-uniqode/ | MANUAL_REVIEW | marketing | 1 | — | — |
| 3 | /compare/mindstudio-vs-wegic/ | IMPROVE | ai | 1 | — | — |
| 4 | /compare/cloudways-vs-directadmin/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 5 | /compare/cpanel-vs-kinsta/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 6 | /compare/cpanel-vs-siteground/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 7 | /compare/directadmin-vs-kinsta/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 8 | /compare/directadmin-vs-siteground/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 9 | /compare/eightx8-vs-respond-io/ | MANUAL_REVIEW | business-communications | 0.934 | — | — |
| 10 | /compare/respond-io-vs-ringcentral/ | MANUAL_REVIEW | business-communications | 0.934 | — | — |
| 11 | /compare/gamma-vs-rank-prompt/ | IMPROVE | ai | 0.893 | — | — |
| 12 | /compare/meltwater-vs-uniqode/ | IMPROVE | analytics-bi | 0.863 | — | — |
| 13 | /compare/demandbase-vs-kaspr/ | IMPROVE | sales-intelligence | 0.801 | — | — |
| 14 | /compare/instantly-vs-kaspr/ | IMPROVE | sales-intelligence | 0.801 | — | — |
| 15 | /compare/bombora-vs-kaspr/ | IMPROVE | sales-intelligence | 0.8 | — | — |
| 16 | /compare/demandbase-vs-instantly/ | IMPROVE | sales-intelligence | 0.8 | — | — |
| 17 | /compare/clay-vs-demandbase/ | IMPROVE | sales-intelligence | 0.799 | — | — |
| 18 | /compare/adcreative-ai-vs-rank-prompt/ | IMPROVE | ai | 0.799 | — | — |
| 19 | /compare/clay-vs-instantly/ | IMPROVE | sales-intelligence | 0.798 | — | — |
| 20 | /compare/cognism-vs-instantly/ | IMPROVE | sales-intelligence | 0.798 | — | — |
| 21 | /compare/gong-vs-instantly/ | IMPROVE | sales-intelligence | 0.798 | — | — |
| 22 | /compare/instantly-vs-leadiq/ | IMPROVE | sales-intelligence | 0.798 | — | — |
| 23 | /compare/gong-vs-kaspr/ | IMPROVE | sales-intelligence | 0.797 | — | — |
| 24 | /compare/demandbase-vs-lemlist/ | IMPROVE | sales-intelligence | 0.796 | — | — |
| 25 | /compare/bombora-vs-hunter/ | IMPROVE | sales-intelligence | 0.795 | — | — |
| 26 | /compare/cognism-vs-ocean/ | IMPROVE | sales-intelligence | 0.795 | — | — |
| 27 | /compare/demandbase-vs-hunter/ | IMPROVE | sales-intelligence | 0.795 | — | — |
| 28 | /compare/leadiq-vs-salesloft/ | IMPROVE | sales-intelligence | 0.795 | — | — |
| 29 | /compare/clay-vs-hunter/ | IMPROVE | sales-intelligence | 0.794 | — | — |
| 30 | /compare/cognism-vs-leadiq/ | IMPROVE | sales-intelligence | 0.794 | — | — |
| 31 | /compare/cognism-vs-lemlist/ | IMPROVE | sales-intelligence | 0.794 | — | — |
| 32 | /compare/leadiq-vs-lemlist/ | IMPROVE | sales-intelligence | 0.794 | — | — |
| 33 | /compare/cognism-vs-smartlead/ | IMPROVE | sales-intelligence | 0.793 | — | — |
| 34 | /compare/gong-vs-lemlist/ | IMPROVE | sales-intelligence | 0.793 | — | — |
| 35 | /compare/clay-vs-smartlead/ | IMPROVE | sales-intelligence | 0.792 | — | — |
| 36 | /compare/clearbit-vs-uplead/ | IMPROVE | sales-intelligence | 0.792 | — | — |
| 37 | /compare/gong-vs-smartlead/ | IMPROVE | sales-intelligence | 0.792 | — | — |
| 38 | /compare/instantly-vs-ocean/ | IMPROVE | sales-intelligence | 0.792 | — | — |
| 39 | /compare/leadiq-vs-smartlead/ | IMPROVE | sales-intelligence | 0.792 | — | — |
| 40 | /compare/lemlist-vs-uplead/ | IMPROVE | sales-intelligence | 0.792 | — | — |
| 41 | /compare/linkedin-sales-navigator-vs-salesloft/ | IMPROVE | sales-intelligence | 0.792 | — | — |
| 42 | /compare/clay-vs-linkedin-sales-navigator/ | IMPROVE | sales-intelligence | 0.791 | — | — |
| 43 | /compare/demandbase-vs-leadiq/ | IMPROVE | sales-intelligence | 0.791 | — | — |
| 44 | /compare/hunter-vs-uplead/ | IMPROVE | sales-intelligence | 0.791 | — | — |
| 45 | /compare/kaspr-vs-ocean/ | IMPROVE | sales-intelligence | 0.791 | — | — |
| 46 | /compare/leadiq-vs-ocean/ | IMPROVE | sales-intelligence | 0.791 | — | — |
| 47 | /compare/linkedin-sales-navigator-vs-uplead/ | IMPROVE | sales-intelligence | 0.791 | — | — |
| 48 | /compare/rocketreach-vs-salesloft/ | IMPROVE | sales-intelligence | 0.791 | — | — |
| 49 | /compare/clay-vs-uplead/ | IMPROVE | sales-intelligence | 0.79 | — | — |
| 50 | /compare/clearbit-vs-hunter/ | IMPROVE | sales-intelligence | 0.79 | — | — |
| 51 | /compare/hunter-vs-leadiq/ | IMPROVE | sales-intelligence | 0.79 | — | — |
| 52 | /compare/salesloft-vs-smartlead/ | IMPROVE | sales-intelligence | 0.79 | — | — |
| 53 | /compare/kaspr-vs-rocketreach/ | IMPROVE | sales-intelligence | 0.789 | — | — |
| 54 | /compare/outreach-vs-uplead/ | IMPROVE | sales-intelligence | 0.789 | — | — |
| 55 | /compare/cognism-vs-uplead/ | IMPROVE | sales-intelligence | 0.788 | — | — |
| 56 | /compare/demandbase-vs-ocean/ | IMPROVE | sales-intelligence | 0.788 | — | — |
| 57 | /compare/hunter-vs-ocean/ | IMPROVE | sales-intelligence | 0.788 | — | — |
| 58 | /compare/rocketreach-vs-zoominfo/ | IMPROVE | sales-intelligence | 0.788 | — | — |
| 59 | /compare/demandbase-vs-linkedin-sales-navigator/ | IMPROVE | sales-intelligence | 0.787 | — | — |
| 60 | /compare/kaspr-vs-lemlist/ | IMPROVE | sales-intelligence | 0.787 | — | — |
| 61 | /compare/smartlead-vs-uplead/ | IMPROVE | sales-intelligence | 0.787 | — | — |
| 62 | /compare/demandbase-vs-uplead/ | IMPROVE | sales-intelligence | 0.786 | — | — |
| 63 | /compare/linkedin-sales-navigator-vs-ocean/ | IMPROVE | sales-intelligence | 0.786 | — | — |
| 64 | /compare/ocean-vs-rocketreach/ | IMPROVE | sales-intelligence | 0.786 | — | — |
| 65 | /compare/ocean-vs-smartlead/ | IMPROVE | sales-intelligence | 0.786 | — | — |
| 66 | /compare/rocketreach-vs-uplead/ | IMPROVE | sales-intelligence | 0.786 | — | — |
| 67 | /compare/clay-vs-lemlist/ | IMPROVE | sales-intelligence | 0.784 | — | — |
| 68 | /compare/gong-vs-uplead/ | IMPROVE | sales-intelligence | 0.784 | — | — |
| 69 | /compare/hunter-vs-linkedin-sales-navigator/ | IMPROVE | sales-intelligence | 0.784 | — | — |
| 70 | /compare/lemlist-vs-ocean/ | IMPROVE | sales-intelligence | 0.784 | — | — |
| 71 | /compare/instantly-vs-linkedin-sales-navigator/ | IMPROVE | sales-intelligence | 0.783 | — | — |
| 72 | /compare/linkedin-sales-navigator-vs-smartlead/ | IMPROVE | sales-intelligence | 0.783 | — | — |
| 73 | /compare/lemlist-vs-linkedin-sales-navigator/ | IMPROVE | sales-intelligence | 0.78 | — | — |
| 74 | /compare/lemlist-vs-rocketreach/ | IMPROVE | sales-intelligence | 0.78 | — | — |
| 75 | /compare/instantly-vs-rocketreach/ | IMPROVE | sales-intelligence | 0.779 | — | — |
| 76 | /compare/rocketreach-vs-smartlead/ | IMPROVE | sales-intelligence | 0.779 | — | — |
| 77 | /compare/linkedin-sales-navigator-vs-rocketreach/ | IMPROVE | sales-intelligence | 0.774 | — | — |
| 78 | /compare/salesloft-vs-sixsense/ | IMPROVE | sales-intelligence | 0.723 | — | — |
| 79 | /compare/clearbit-vs-seamless-ai/ | IMPROVE | sales-intelligence | 0.721 | — | — |
| 80 | /compare/adapt-io-vs-outreach/ | IMPROVE | sales-intelligence | 0.719 | — | — |
| 81 | /compare/salesloft-vs-seamless-ai/ | IMPROVE | sales-intelligence | 0.719 | — | — |
| 82 | /compare/adapt-io-vs-seamless-ai/ | IMPROVE | sales-intelligence | 0.718 | — | — |
| 83 | /compare/hunter-vs-seamless-ai/ | IMPROVE | sales-intelligence | 0.718 | — | — |
| 84 | /compare/kaspr-vs-sixsense/ | IMPROVE | sales-intelligence | 0.718 | — | — |
| 85 | /compare/rocketreach-vs-seamless-ai/ | IMPROVE | sales-intelligence | 0.718 | — | — |
| 86 | /compare/adapt-io-vs-clay/ | IMPROVE | sales-intelligence | 0.717 | — | — |
| 87 | /compare/adapt-io-vs-instantly/ | IMPROVE | sales-intelligence | 0.717 | — | — |
| 88 | /compare/instantly-vs-sixsense/ | IMPROVE | sales-intelligence | 0.717 | — | — |
| 89 | /compare/adapt-io-vs-cognism/ | IMPROVE | sales-intelligence | 0.715 | — | — |
| 90 | /compare/cognism-vs-seamless-ai/ | IMPROVE | sales-intelligence | 0.715 | — | — |
| 91 | /compare/instantly-vs-seamless-ai/ | IMPROVE | sales-intelligence | 0.715 | — | — |
| 92 | /compare/leadiq-vs-sixsense/ | IMPROVE | sales-intelligence | 0.715 | — | — |
| 93 | /compare/adapt-io-vs-leadiq/ | IMPROVE | sales-intelligence | 0.714 | — | — |
| 94 | /compare/adapt-io-vs-rocketreach/ | IMPROVE | sales-intelligence | 0.714 | — | — |
| 95 | /compare/adapt-io-vs-lemlist/ | IMPROVE | sales-intelligence | 0.713 | — | — |
| 96 | /compare/lemlist-vs-sixsense/ | IMPROVE | sales-intelligence | 0.713 | — | — |
| 97 | /compare/ocean-vs-seamless-ai/ | IMPROVE | sales-intelligence | 0.713 | — | — |
| 98 | /compare/adapt-io-vs-smartlead/ | IMPROVE | sales-intelligence | 0.712 | — | — |
| 99 | /compare/hunter-vs-sixsense/ | IMPROVE | sales-intelligence | 0.712 | — | — |
| 100 | /compare/lemlist-vs-seamless-ai/ | IMPROVE | sales-intelligence | 0.711 | — | — |

## Lifecycle samples

### INDEXABLE (sample)

- /compare/7shifts-vs-connecteam/ — All index-worthiness gates passed (unique=1, features=1)
- /compare/7shifts-vs-deputy/ — All index-worthiness gates passed (unique=0.865, features=1)
- /compare/7shifts-vs-homebase/ — All index-worthiness gates passed (unique=1, features=1)
- /compare/7shifts-vs-when-i-work/ — All index-worthiness gates passed (unique=0.861, features=1)
- /compare/accelerated-growth-studio-vs-braze/ — All index-worthiness gates passed (unique=1, features=1)
- /compare/accelerated-growth-studio-vs-clickfunnels/ — All index-worthiness gates passed (unique=1, features=1)
- /compare/accelerated-growth-studio-vs-evolve/ — All index-worthiness gates passed (unique=0.863, features=1)
- /compare/accelerated-growth-studio-vs-iterable/ — All index-worthiness gates passed (unique=1, features=1)

### IMPROVE (sample)

- /compare/7shifts-vs-adp-workforce-now/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/7shifts-vs-ashby/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/7shifts-vs-bamboohr/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/7shifts-vs-bolt-for-business/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/7shifts-vs-carepatron/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/7shifts-vs-dayforce/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/7shifts-vs-greenhouse/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/7shifts-vs-gusto/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)

### INDEXABLE_READY (sample)

_None._

### MANUAL_REVIEW (sample)

- /compare/adcreative-ai-vs-cursor/ — WEAK_COMPARISON_RELATIONSHIP (unique=0.811, features=1)
- /compare/adcreative-ai-vs-elevenlabs/ — WEAK_COMPARISON_RELATIONSHIP (unique=0.812, features=1)
- /compare/adcreative-ai-vs-fireflies/ — WEAK_COMPARISON_RELATIONSHIP (unique=0.93, features=1)
- /compare/adcreative-ai-vs-zapier/ — WEAK_COMPARISON_RELATIONSHIP (unique=0.816, features=1)
- /compare/bright-data-vs-datadog/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/bright-data-vs-github/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/bright-data-vs-pagerduty/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)
- /compare/bright-data-vs-render/ — WEAK_COMPARISON_RELATIONSHIP (unique=1, features=1)

## Machine-readable output

- `data/seo/compare-audit.json`
- `data/seo/content-lifecycle.json` (promotion registry)

