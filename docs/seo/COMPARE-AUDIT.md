# Comparison index-worthiness audit

**Generated:** 2026-09-08T23:08:03.934Z
**Engine:** compare-index-worthiness v2.0.0

Lifecycle-first policy: weak comparisons are **preserved** under IMPROVE (temporary `noindex,follow`), then remediated and promoted to INDEXABLE. Cartesian pairs are not deleted — they stay in the improvement queue until competitive relationships and quality gates clear.

## Summary

| Metric | Count |
| --- | ---: |
| Total comparison pages | 4000 |
| Indexable | 1699 |
| Improvement queue | 1711 (IMPROVE 1711 · IMPROVING 0) |
| Ready for promotion | 0 (INDEXABLE_READY 0 · READY_FOR_REVIEW 0) |
| Manual review | 590 |
| Retired | 0 |
| Potential indexable after remediation | 2301 |
| Search-indexable (post-policy) | 1699 |
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
| sales-intelligence | 409 | 390 | 270 | 19 |
| ai | 361 | 76 | 288 | 264 |
| business-communications | 282 | 204 | 158 | 78 |
| hr | 275 | 82 | 193 | 193 |
| marketing | 207 | 115 | 93 | 92 |
| project-management | 196 | 145 | 98 | 51 |
| ecommerce | 194 | 192 | 113 | 2 |
| email-marketing | 185 | 185 | 53 | 0 |
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
| 1 | /compare/dialpad-vs-microsoft-teams/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 2 | /compare/dialpad-vs-slack/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 3 | /compare/dialpad-vs-twilio/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 4 | /compare/five9-vs-twilio/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 5 | /compare/goto-connect-vs-microsoft-teams/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 6 | /compare/goto-connect-vs-slack/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 7 | /compare/goto-connect-vs-twilio/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 8 | /compare/manychat-vs-nextiva/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 9 | /compare/manychat-vs-twilio/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 10 | /compare/microsoft-teams-vs-nextiva/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 11 | /compare/nextiva-vs-slack/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 12 | /compare/ooma-vs-twilio/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 13 | /compare/openphone-vs-twilio/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 14 | /compare/ringcentral-vs-slack/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 15 | /compare/ringcentral-vs-wati/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 16 | /compare/talkdesk-vs-wati/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 17 | /compare/twilio-vs-vonage/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 18 | /compare/twilio-vs-webex/ | MANUAL_REVIEW | business-communications | 1 | — | — |
| 19 | /compare/bouncer-vs-brevo/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 20 | /compare/bouncer-vs-constant-contact/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 21 | /compare/bouncer-vs-drip/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 22 | /compare/bouncer-vs-flodesk/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 23 | /compare/bouncer-vs-klaviyo/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 24 | /compare/bouncer-vs-mailerlite/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 25 | /compare/bouncer-vs-mailjet/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 26 | /compare/bouncer-vs-moosend/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 27 | /compare/bouncer-vs-omnisend/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 28 | /compare/brevo-vs-inboxally/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 29 | /compare/constant-contact-vs-inboxally/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 30 | /compare/drip-vs-inboxally/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 31 | /compare/flodesk-vs-inboxally/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 32 | /compare/inboxally-vs-klaviyo/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 33 | /compare/inboxally-vs-mailerlite/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 34 | /compare/inboxally-vs-mailjet/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 35 | /compare/inboxally-vs-moosend/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 36 | /compare/inboxally-vs-omnisend/ | MANUAL_REVIEW | email-marketing | 1 | — | — |
| 37 | /compare/office-timeline-vs-todoist/ | MANUAL_REVIEW | project-management | 1 | — | — |
| 38 | /compare/office-timeline-vs-trello/ | MANUAL_REVIEW | project-management | 1 | — | — |
| 39 | /compare/office-timeline-vs-wrike/ | MANUAL_REVIEW | project-management | 1 | — | — |
| 40 | /compare/smartsheet-vs-vektoros/ | MANUAL_REVIEW | project-management | 1 | — | — |
| 41 | /compare/vektoros-vs-wrike/ | MANUAL_REVIEW | project-management | 1 | — | — |
| 42 | /compare/evolve-vs-uniqode/ | MANUAL_REVIEW | marketing | 1 | — | — |
| 43 | /compare/mindstudio-vs-wegic/ | IMPROVE | ai | 1 | — | — |
| 44 | /compare/cloudways-vs-directadmin/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 45 | /compare/cpanel-vs-kinsta/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 46 | /compare/cpanel-vs-siteground/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 47 | /compare/directadmin-vs-kinsta/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 48 | /compare/directadmin-vs-siteground/ | MANUAL_REVIEW | it-development | 1 | — | — |
| 49 | /compare/bigcommerce-vs-lightspeed-retail/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 50 | /compare/bigcommerce-vs-sellfy/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 51 | /compare/bigcommerce-vs-square-online/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 52 | /compare/bigcommerce-vs-squarespace/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 53 | /compare/bigcommerce-vs-webflow/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 54 | /compare/bigcommerce-vs-wix/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 55 | /compare/commercetools-vs-lightspeed-retail/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 56 | /compare/commercetools-vs-sellfy/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 57 | /compare/commercetools-vs-square-online/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 58 | /compare/commercetools-vs-squarespace/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 59 | /compare/commercetools-vs-webflow/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 60 | /compare/commercetools-vs-wix/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 61 | /compare/ecwid-vs-square-online/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 62 | /compare/ecwid-vs-webflow/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 63 | /compare/lightspeed-retail-vs-magento/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 64 | /compare/lightspeed-retail-vs-medusa/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 65 | /compare/lightspeed-retail-vs-opencart/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 66 | /compare/lightspeed-retail-vs-prestashop/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 67 | /compare/lightspeed-retail-vs-saleor/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 68 | /compare/lightspeed-retail-vs-salesforce-commerce-cloud/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 69 | /compare/lightspeed-retail-vs-sellfy/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 70 | /compare/lightspeed-retail-vs-shopware/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 71 | /compare/lightspeed-retail-vs-squarespace/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 72 | /compare/lightspeed-retail-vs-tiendanube/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 73 | /compare/lightspeed-retail-vs-vtex/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 74 | /compare/lightspeed-retail-vs-webflow/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 75 | /compare/lightspeed-retail-vs-wix/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 76 | /compare/lightspeed-retail-vs-woocommerce/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 77 | /compare/magento-vs-sellfy/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 78 | /compare/magento-vs-square-online/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 79 | /compare/magento-vs-squarespace/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 80 | /compare/magento-vs-webflow/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 81 | /compare/magento-vs-wix/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 82 | /compare/medusa-vs-sellfy/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 83 | /compare/medusa-vs-square-online/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 84 | /compare/medusa-vs-squarespace/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 85 | /compare/medusa-vs-webflow/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 86 | /compare/medusa-vs-wix/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 87 | /compare/opencart-vs-square-online/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 88 | /compare/opencart-vs-squarespace/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 89 | /compare/opencart-vs-webflow/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 90 | /compare/opencart-vs-wix/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 91 | /compare/prestashop-vs-square-online/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 92 | /compare/prestashop-vs-squarespace/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 93 | /compare/prestashop-vs-webflow/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 94 | /compare/prestashop-vs-wix/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 95 | /compare/saleor-vs-square-online/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 96 | /compare/saleor-vs-squarespace/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 97 | /compare/saleor-vs-webflow/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 98 | /compare/saleor-vs-wix/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 99 | /compare/salesforce-commerce-cloud-vs-square-online/ | MANUAL_REVIEW | ecommerce | 1 | — | — |
| 100 | /compare/salesforce-commerce-cloud-vs-squarespace/ | MANUAL_REVIEW | ecommerce | 1 | — | — |

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

- /compare/adapt-io-vs-bombora/ — All index-worthiness gates passed (unique=0.725, features=1)
- /compare/adapt-io-vs-clay/ — All index-worthiness gates passed (unique=0.717, features=1)
- /compare/adapt-io-vs-clearbit/ — All index-worthiness gates passed (unique=0.721, features=1)
- /compare/adapt-io-vs-cognism/ — All index-worthiness gates passed (unique=0.715, features=1)
- /compare/adapt-io-vs-demandbase/ — All index-worthiness gates passed (unique=0.725, features=1)
- /compare/adapt-io-vs-instantly/ — All index-worthiness gates passed (unique=0.717, features=1)
- /compare/adapt-io-vs-kaspr/ — All index-worthiness gates passed (unique=0.702, features=1)
- /compare/adapt-io-vs-leadiq/ — All index-worthiness gates passed (unique=0.714, features=1)

## Machine-readable output

- `data/seo/compare-audit.json`
- `data/seo/content-lifecycle.json` (promotion registry)

