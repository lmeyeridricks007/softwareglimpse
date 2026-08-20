# Redirect Manifest

**Generated:** 2026-08-19T15:12:46.271Z
**Generator:** RedirectPlanGenerator v1.0.0
**Source of truth:** [`config/legacy-redirects.json`](../../config/legacy-redirects.json)

> Permanent (301) redirects only. Low/medium confidence mappings are **excluded**. No homepage dumps. No middleware.

## Policy

- Only **HIGH** confidence + allowlisted match bases
- Permanent redirects only (no temporary migration redirects)
- Chains flattened to final destination
- Destinations validated against new-app inventory
- Retired WP taxonomy stays 404/410 — not redirected to `/` or `/guides/`
- Stretch guide merges (vertical posts → generic guides) excluded for manual review

## Summary

| Metric | Count |
| --- | ---: |
| Redirects implemented | 370 |
| Auto-approved (legacy) | 332 |
| Manual mappings excluded | 0 |
| WP retired patterns documented | 4 |
| Chains flattened | 0 |

## Implemented redirects

| Source | Destination | Type | Reason | Confidence | Implemented? | Test status |
| --- | --- | --- | --- | --- | --- | --- |
| `/5-ways-marketing-apis-boost-your-marketing-operations/` | `/categories/marketing/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Marketing topical → marketing category | HIGH | yes | pass |
| `/a-guide-to-cdp-vs-crm/` | `/guides/crm-vs-cdp/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Comparison-shaped URL is guide intent → /guides/crm-vs-cdp/ | HIGH | yes | pass |
| `/activecampaign-crm-review/` | `/software/activecampaign/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/affinity-crm-review/` | `/software/affinity/` | 301 | Legacy Affinity review → Affinity product page | HIGH | yes | pass |
| `/agile-crm-case-study/` | `/software/agile-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Case study → matching product page | HIGH | yes | pass |
| `/agile-crm-review/` | `/software/agile-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Agile CRM review → catalogue product page | HIGH | yes | pass |
| `/ai-software-reviews/` | `/categories/ai/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy AI reviews hub → AI category index | HIGH | yes | pass |
| `/ai-software/` | `/guides/what-is-ai-software/` | 301 | Launch-approved semantic_similarity mapping (LOW confidence): Semantic guide similarity 50% → /guides/what-is-ai-software/ | HIGH | yes | pass |
| `/apptivo-crm-review/` | `/software/apptivo/` | 301 | Legacy Apptivo review → Apptivo product page | HIGH | yes | pass |
| `/benefits-crm-financial-advisors/` | `/industries/financial-services/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/benefits-of-agile-crm/` | `/software/agile-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy product article → catalogue product page | HIGH | yes | pass |
| `/benefits-of-crm-for-engineering-firms/` | `/industries/engineering/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/benefits-of-crm-for-event-management/` | `/industries/event-management/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/benefits-of-crm-for-facebook-leads/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/benefits-of-crm-for-linkedin/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/benefits-of-crm-for-web-designers/` | `/industries/web-design/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/benefits-of-freshsales-crm/` | `/software/freshsales/` | 301 | Launch-approved same_product mapping (MEDIUM confidence): Product-benefits article for freshsales merges into product hub | HIGH | yes | pass |
| `/benefits-of-microsoft-dynamics-crm/` | `/software/dynamics-365/` | 301 | Launch-approved same_product mapping (MEDIUM confidence): Product-benefits article for dynamics-365 merges into product hub | HIGH | yes | pass |
| `/benefits-of-pictory-ai-for-businesses/` | `/categories/ai/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Pictory benefits → AI category (product not onboarded) | HIGH | yes | pass |
| `/benefits-of-podio-crm/` | `/software/podio/` | 301 | Launch-approved same_product mapping (MEDIUM confidence): Product-benefits article for podio merges into product hub | HIGH | yes | pass |
| `/benefits-of-tidio-for-businesses/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/benefits-of-zoho-crm/` | `/software/zoho-crm/` | 301 | Launch-approved same_product mapping (MEDIUM confidence): Product-benefits article for zoho-crm merges into product hub | HIGH | yes | pass |
| `/best-ai-software/` | `/categories/ai/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Best AI list → AI category | HIGH | yes | pass |
| `/best-commercial-real-estate-crm/` | `/industries/real-estate/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "commercial-real-estate" → /industries/real-estate/ | HIGH | yes | pass |
| `/best-crm-engineering/` | `/industries/engineering/` | 301 | Legacy vertical best-CRM → engineering industry hub | HIGH | yes | pass |
| `/best-crm-for-coaches/` | `/industries/coaching/` | 301 | Legacy vertical best-CRM → coaching industry hub | HIGH | yes | pass |
| `/best-crm-for-event-management/` | `/industries/event-management/` | 301 | Legacy vertical best-CRM → event-management industry hub | HIGH | yes | pass |
| `/best-crm-for-facebook-leads/` | `/use-cases/lead-management/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "facebook-leads" → /use-cases/lead-management/ | HIGH | yes | pass |
| `/best-crm-for-field-sales/` | `/use-cases/field-sales/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Vertical best list cluster "field-sales" → /use-cases/field-sales/ | HIGH | yes | pass |
| `/best-crm-for-financial-advisors/` | `/industries/financial-services/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "financial-advisors" → /industries/financial-services/ | HIGH | yes | pass |
| `/best-crm-for-freelancers/` | `/for/freelancers/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Vertical best list cluster "freelancers" → /for/freelancers/ | HIGH | yes | pass |
| `/best-crm-for-hotels/` | `/industries/hospitality/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "hotels" → /industries/hospitality/ | HIGH | yes | pass |
| `/best-crm-for-investor-relations/` | `/industries/investor-relations/` | 301 | Legacy vertical best-CRM → investor-relations industry hub | HIGH | yes | pass |
| `/best-crm-for-linkedin/` | `/use-cases/prospecting/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "linkedin" → /use-cases/prospecting/ | HIGH | yes | pass |
| `/best-crm-for-musicians/` | `/industries/music/` | 301 | Legacy vertical best-CRM → music industry hub | HIGH | yes | pass |
| `/best-crm-for-office-365/` | `/best/crm-software/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Launch-approved redirect: Vertical best-CRM (office-365) has no dedicated industry/audience/use-case page — REVIEW before merging into /best/crm-software/ | HIGH | yes | pass |
| `/best-crm-for-photographers/` | `/industries/photography/` | 301 | Legacy vertical best-CRM → photography industry hub | HIGH | yes | pass |
| `/best-crm-for-plumbers/` | `/industries/plumbing/` | 301 | Legacy vertical best-CRM → plumbing industry hub | HIGH | yes | pass |
| `/best-crm-for-real-estate-investors/` | `/industries/real-estate/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "real-estate-investors" → /industries/real-estate/ | HIGH | yes | pass |
| `/best-crm-for-small-legal-practices/` | `/industries/legal-services/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "small-legal-practices" → /industries/legal-services/ | HIGH | yes | pass |
| `/best-crm-for-small-real-estate-business/` | `/industries/real-estate/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "small-real-estate-business" → /industries/real-estate/ | HIGH | yes | pass |
| `/best-crm-for-startups/` | `/for/startups/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Vertical best list cluster "startups" → /for/startups/ | HIGH | yes | pass |
| `/best-crm-for-web-designers/` | `/industries/web-design/` | 301 | Legacy vertical best-CRM → web-design industry hub | HIGH | yes | pass |
| `/best-crm-software-for-car-dealerships/` | `/industries/retail-ecommerce/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "car-dealerships" → /industries/retail-ecommerce/ | HIGH | yes | pass |
| `/best-crm-software-for-construction/` | `/industries/construction/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "construction" → /industries/construction/ | HIGH | yes | pass |
| `/best-crm-software-for-restaurants/` | `/industries/hospitality/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): Vertical best list cluster "restaurants" → /industries/hospitality/ | HIGH | yes | pass |
| `/best-crm-software-in-dubai/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy regional best-CRM list → CRM category index | HIGH | yes | pass |
| `/best-crm-solar-businesses/` | `/industries/solar/` | 301 | Legacy vertical best-CRM → solar industry hub | HIGH | yes | pass |
| `/best-crm-systems-for-small-nonprofits/` | `/industries/nonprofit/` | 301 | Legacy nonprofit best-CRM list → nonprofit industry hub | HIGH | yes | pass |
| `/best-crm-venture-capital/` | `/industries/venture-capital/` | 301 | Legacy vertical best-CRM → venture-capital industry hub | HIGH | yes | pass |
| `/best-crm-with-text-messaging/` | `/capabilities/sms-messaging/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy SMS CRM list → SMS capability hub | HIGH | yes | pass |
| `/best-crms/` | `/best/crm-software/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/best-practices-crm-deal-flow-private-equity/` | `/guides/common-crm-mistakes/` | 301 | Launch-approved same_guide_intent mapping (LOW confidence): Best-practices article is guide intent, not a ranked best list — soft merge to related guide; confirm editorially | HIGH | yes | pass |
| `/best-practices-crm/` | `/guides/common-crm-mistakes/` | 301 | Launch-approved same_guide_intent mapping (LOW confidence): Best-practices article is guide intent, not a ranked best list — soft merge to related guide; confirm editorially | HIGH | yes | pass |
| `/best-practices-for-ensuring-crm-security/` | `/guides/common-crm-mistakes/` | 301 | Launch-approved same_guide_intent mapping (LOW confidence): Best-practices article is guide intent, not a ranked best list — soft merge to related guide; confirm editorially | HIGH | yes | pass |
| `/best-private-equity-crm/` | `/industries/private-equity/` | 301 | Legacy vertical best-CRM → private-equity industry hub | HIGH | yes | pass |
| `/boosting-productivity-with-crm-for-real-estate-investors/` | `/industries/real-estate/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/capsule-crm-review-2/` | `/software/capsule/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/capsule-crm-review/` | `/software/capsule/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/case-studies-of-successful-real-estate-investors-using-crm/` | `/industries/real-estate/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/case-studies-successful-crm-implementations-for-plumbers/` | `/guides/crm-implementation/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-implementation/ | HIGH | yes | pass |
| `/case-studies-successful-photographers/` | `/industries/photography/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/category/best-crms/` | `/best/crm-software/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/category/crm-comparisons/` | `/compare/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/category/crm-engineering/` | `/industries/engineering/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Launch-approved redirect: Possible industry category affinity → /industries/engineering/ (confirm before 301) | HIGH | yes | pass |
| `/category/crm-event-management/` | `/industries/event-management/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Launch-approved redirect: Possible industry category affinity → /industries/event-management/ (confirm before 301) | HIGH | yes | pass |
| `/category/crm-guides/` | `/guides/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/category/crm-music/` | `/industries/music/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Launch-approved redirect: Possible industry category affinity → /industries/music/ (confirm before 301) | HIGH | yes | pass |
| `/category/crm-plumbing/` | `/industries/plumbing/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Launch-approved redirect: Possible industry category affinity → /industries/plumbing/ (confirm before 301) | HIGH | yes | pass |
| `/category/crm-private-equity/` | `/industries/private-equity/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Launch-approved redirect: Possible industry category affinity → /industries/private-equity/ (confirm before 301) | HIGH | yes | pass |
| `/category/crm-real-estate/` | `/industries/real-estate/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Launch-approved redirect: Possible industry category affinity → /industries/real-estate/ (confirm before 301) | HIGH | yes | pass |
| `/category/crm-solar/` | `/industries/solar/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Launch-approved redirect: Possible industry category affinity → /industries/solar/ (confirm before 301) | HIGH | yes | pass |
| `/category/crm-venture-capital/` | `/industries/venture-capital/` | 301 | Launch-approved same_category_cluster mapping (HIGH confidence): Launch-approved redirect: Possible industry category affinity → /industries/venture-capital/ (confirm before 301) | HIGH | yes | pass |
| `/category/crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (migrationSeed:mig-wp-crm-category): Canonical category hub path | HIGH | yes | pass |
| `/category/guides/` | `/guides/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): WP guides category → /guides/ hub | HIGH | yes | pass |
| `/category/software-comparison/` | `/compare/` | 301 | Launch-approved same_category_cluster mapping (MEDIUM confidence): WP comparison category → /compare/ hub | HIGH | yes | pass |
| `/close-crm-review/` | `/software/close/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (migrationSeed:mig-wp-close-crm-review): Canonical product URL; structured draft replaces legacy after approval | HIGH | yes | pass |
| `/closely-review/` | `/software/closely/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/cloze-crm-review/` | `/software/cloze/` | 301 | Legacy Cloze review → Cloze product page | HIGH | yes | pass |
| `/common-security-risks-in-crm-systems/` | `/guides/crm-implementation/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy CRM security article → CRM implementation guide | HIGH | yes | pass |
| `/comparing-agile-crm/` | `/software/agile-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy product article → catalogue product page | HIGH | yes | pass |
| `/comparing-freshsales-crm/` | `/software/freshsales/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy product article → catalogue product page | HIGH | yes | pass |
| `/comparing-microsoft-dynamics-crm/` | `/software/dynamics-365/` | 301 | Legacy Dynamics comparison article → Dynamics 365 product page | HIGH | yes | pass |
| `/comparing-podio-crm/` | `/software/podio/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy product article → catalogue product page | HIGH | yes | pass |
| `/comparing-setup-pipedrive-vs-hubspot/` | `/compare/hubspot-vs-pipedrive/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/comparing-setup-salesforce-vs-pipedrive/` | `/compare/pipedrive-vs-salesforce/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/comparing-zoho-crm/` | `/software/zoho-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy product article → catalogue product page | HIGH | yes | pass |
| `/contact/` | `/company/contact/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/copilot-vs-chatgpt/` | `/compare/chatgpt-vs-github-copilot/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [github-copilot, chatgpt] → canonical /compare/chatgpt-vs-github-copilot/ | HIGH | yes | pass |
| `/copper-crm-alternatives/` | `/software/copper/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): No /alternatives/copper/ yet — interim product merge | HIGH | yes | pass |
| `/cost-considerations-for-crm-security-services/` | `/guides/common-crm-mistakes/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/common-crm-mistakes/ | HIGH | yes | pass |
| `/crm-benefits-for-solar-businesses/` | `/guides/crm-benefits/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-benefits/ | HIGH | yes | pass |
| `/crm-by-industry/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM hub → category index | HIGH | yes | pass |
| `/crm-comparisons/` | `/compare/` | 301 | Legacy CRM comparisons hub → compare index | HIGH | yes | pass |
| `/crm-data-management-best-practices/` | `/guides/crm-data-migration/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy data-management article → CRM data migration guide | HIGH | yes | pass |
| `/crm-features-solar-business/` | `/industries/solar/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/crm-for-security-companies/` | `/industries/security-companies/` | 301 | Legacy vertical CRM page → security-companies industry hub | HIGH | yes | pass |
| `/crm-for-startups-vs-investors/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/crm-guide/` | `/guides/what-is-crm/` | 301 | Legacy CRM guide → what-is-crm guide | HIGH | yes | pass |
| `/crm-guides/` | `/guides/what-is-crm/` | 301 | Launch-approved exact_title_topic mapping (HIGH confidence): Semantic guide similarity 100% → /guides/what-is-crm/ | HIGH | yes | pass |
| `/crm-implementation-and-training-for-real-estate-investors/` | `/guides/crm-implementation/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-implementation/ | HIGH | yes | pass |
| `/crm-implementation-hotels/` | `/guides/crm-implementation/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-implementation/ | HIGH | yes | pass |
| `/crm-implementation-private-equity-firms/` | `/guides/crm-implementation/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-implementation/ | HIGH | yes | pass |
| `/crm-implementation-strategies-for-photographers/` | `/guides/crm-implementation/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-implementation/ | HIGH | yes | pass |
| `/crm-integration-financial-advisors/` | `/industries/financial-services/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/crm-integration-private-equity-tools/` | `/industries/private-equity/` | 301 | Launch-approved semantic_similarity mapping (HIGH confidence): Launch-approved redirect: Weak semantic candidate 50% → /industries/private-equity/ — REVIEW before 301 | HIGH | yes | pass |
| `/crm-integration-with-photography-tools/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/crm-integrations-for-venture-capital-firms/` | `/industries/venture-capital/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/crm-integrations-for-venture-capital/` | `/industries/venture-capital/` | 301 | Launch-approved semantic_similarity mapping (HIGH confidence): Launch-approved redirect: Weak semantic candidate 50% → /industries/venture-capital/ — REVIEW before 301 | HIGH | yes | pass |
| `/crm-onboarding-training-financial-advisors/` | `/industries/financial-services/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/crm-pricing-and-plans-for-venture-capital-firms/` | `/guides/crm-pricing-guide/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-pricing-guide/ | HIGH | yes | pass |
| `/crm-pricing-private-equity-firms/` | `/guides/crm-pricing-guide/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-pricing-guide/ | HIGH | yes | pass |
| `/crm-reviews/` | `/categories/crm/` | 301 | Legacy CRM reviews hub → CRM category index | HIGH | yes | pass |
| `/crm-roi-and-performance-metrics-for-private-equity/` | `/guides/crm-roi-guide/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-roi-guide/ | HIGH | yes | pass |
| `/crm-success-stories-for-musicians/` | `/industries/music/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/diginius-review/` | `/software/diginius/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/diginius/ (primary review intent) | HIGH | yes | pass |
| `/emerging-trends-in-crm-security/` | `/guides/common-crm-mistakes/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/common-crm-mistakes/ | HIGH | yes | pass |
| `/engineering-and-crm-a-case-study/` | `/industries/engineering/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/evaluating-crm-security-solutions/` | `/guides/common-crm-mistakes/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/common-crm-mistakes/ | HIGH | yes | pass |
| `/event-management-and-crm-a-case-study/` | `/industries/event-management/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/facebook-leads-and-crm-a-case-study/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/faqs-about-infusionsoft-crm/` | `/software/keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Infusionsoft FAQ → Keap product page (rebrand) | HIGH | yes | pass |
| `/faqs-about-insightly-crm/` | `/software/insightly/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Insightly FAQ → product page | HIGH | yes | pass |
| `/faqs-about-keap-crm/` | `/software/keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Keap FAQ → product page | HIGH | yes | pass |
| `/faqs-about-mailchimp-crm/` | `/software/mailchimp/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Mailchimp FAQ → product page | HIGH | yes | pass |
| `/faqs-about-monday-crm/` | `/software/monday/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Monday CRM FAQ → product page | HIGH | yes | pass |
| `/faqs-about-nimble-crm/` | `/software/nimble/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Nimble FAQ → product page | HIGH | yes | pass |
| `/fastmail-review/` | `/software/fastmail/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/fastmail/ (primary review intent) | HIGH | yes | pass |
| `/features-of-infusionsoft-crm/` | `/software/keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Infusionsoft features → Keap product page (rebrand) | HIGH | yes | pass |
| `/features-of-insightly-crm/` | `/software/insightly/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Insightly features → product page | HIGH | yes | pass |
| `/features-of-keap-crm/` | `/software/keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Keap features → product page | HIGH | yes | pass |
| `/features-of-mailchimp-crm/` | `/software/mailchimp/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Mailchimp features → product page | HIGH | yes | pass |
| `/features-of-monday-crm/` | `/software/monday/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Monday CRM features → product page | HIGH | yes | pass |
| `/features-of-nimble-crm/` | `/software/nimble/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Nimble features → product page | HIGH | yes | pass |
| `/features/call-functionality/` | `/features/calling/` | 301 | In-app feature slug rename | HIGH | yes | pass |
| `/features/reporting/` | `/features/reporting-dashboards/` | 301 | In-app feature slug rename | HIGH | yes | pass |
| `/folk-app-review/` | `/software/folk/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/folk-crm-review/` | `/software/folk/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/freelancers-and-crm-a-case-study/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/freshsales-crm-case-study/` | `/software/freshsales/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Case study → matching product page | HIGH | yes | pass |
| `/freshsales-crm-review/` | `/software/freshsales/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/future-of-crm-music-industry-trends/` | `/industries/music/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/getresponse-review/` | `/software/getresponse/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/guide-importance-crm-for-plumbers/` | `/industries/plumbing/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/guide-to-making-money-using-ai/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-crm-software-streamlines-deal-sourcing/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/how-engineering-firms-benefit-from-crm/` | `/industries/engineering/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/how-event-management-works-with-crm/` | `/industries/event-management/` | 301 | Launch-approved semantic_similarity mapping (HIGH confidence): Launch-approved redirect: Weak semantic candidate 50% → /industries/event-management/ — REVIEW before 301 | HIGH | yes | pass |
| `/how-facebook-leads-works-with-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/how-freelancers-benefit-from-crm/` | `/for/freelancers/` | 301 | Launch-approved semantic_similarity mapping (HIGH confidence): Launch-approved redirect: Weak semantic candidate 50% → /for/freelancers/ — REVIEW before 301 | HIGH | yes | pass |
| `/how-linkedin-integrates-with-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/how-to-buy-infusionsoft-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-buy-insightly-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-buy-keap-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-buy-mailchimp-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-buy-monday-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-buy-nimble-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-choose-a-crm-for-hotels/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-a-crm-for-private-equity-firms/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-best-ai-writer/` | `/guides/how-to-choose-ai-software/` | 301 | Launch-approved semantic_similarity mapping (LOW confidence): Semantic guide similarity 50% → /guides/how-to-choose-ai-software/ | HIGH | yes | pass |
| `/how-to-choose-between-pipedrive-and-hubspot/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-choose-crm-financial-advisors/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-crm-for-musicians/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-crm-for-plumbing-business/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-crm-for-real-estate-investors/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-the-best-crm-for-engineering-firms/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-the-best-crm-for-event-management/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-the-best-crm-for-facebook-leads/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-the-best-crm-for-freelancers/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-the-best-crm-for-linkedin-2/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-the-best-crm-for-linkedin/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-the-best-crm-for-web-designers/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-the-best-crm-solar-business/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-choose-the-right-crm-security-company/` | `/guides/how-to-choose-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Launch-approved redirect: Vertical choose-CRM guide — candidate merge to /guides/how-to-choose-crm/; confirm vs industry/audience page before 301 | HIGH | yes | pass |
| `/how-to-implement-a-crm-in-a-venture-capital-firm/` | `/industries/venture-capital/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/how-to-implement-agile-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-implement-crm-as-a-freelancer/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-implement-freshsales-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-implement-hubspot/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-implement-microsoft-dynamics-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-implement-pipedrive/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-implement-podio-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-implement-salesforce/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-implement-zoho-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-integrate-crm-in-engineering-firms/` | `/industries/engineering/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/how-to-integrate-crm-into-web-design-workflows/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-integrate-event-management-with-crm/` | `/industries/event-management/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/how-to-integrate-facebook-leads-with-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-integrate-linkedin-with-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-use-infusionsoft-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-use-insightly-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-use-keap-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-use-mailchimp-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-use-monday-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-use-nimble-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/how-to-zoho-thrive-zoho-crm-integration/` | `/guides/zoho-crm-setup/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Zoho integration article → Zoho CRM setup guide | HIGH | yes | pass |
| `/hubspot-crm-case-study/` | `/software/hubspot/` | 301 | Legacy HubSpot case study → HubSpot product page | HIGH | yes | pass |
| `/hubspot-crm-review/` | `/software/hubspot/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/hubspot-vs-activecampaign/` | `/compare/activecampaign-vs-hubspot/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [hubspot, activecampaign] → canonical /compare/activecampaign-vs-hubspot/ | HIGH | yes | pass |
| `/hubspot-vs-freshsales/` | `/compare/freshsales-vs-hubspot/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [hubspot, freshsales] → canonical /compare/freshsales-vs-hubspot/ | HIGH | yes | pass |
| `/hubspot-vs-infusionsoft/` | `/compare/hubspot-vs-keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/hubspot-vs-insightly/` | `/compare/hubspot-vs-insightly/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [hubspot, insightly] → canonical /compare/hubspot-vs-insightly/ | HIGH | yes | pass |
| `/hubspot-vs-keap/` | `/compare/hubspot-vs-keap/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [hubspot, keap] → canonical /compare/hubspot-vs-keap/ | HIGH | yes | pass |
| `/hubspot-vs-mailchimp/` | `/compare/hubspot-vs-mailchimp/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [hubspot, mailchimp] → canonical /compare/hubspot-vs-mailchimp/ | HIGH | yes | pass |
| `/hubspot-vs-marketo/` | `/compare/hubspot-vs-marketo/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [hubspot, marketo] → canonical /compare/hubspot-vs-marketo/ | HIGH | yes | pass |
| `/hubspot-vs-monday-2/` | `/compare/hubspot-vs-monday-sales-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/hubspot-vs-monday/` | `/compare/hubspot-vs-monday-sales-crm/` | 301 | Legacy HubSpot vs Monday → canonical HubSpot vs monday sales CRM compare | HIGH | yes | pass |
| `/hubspot-vs-pardot/` | `/compare/hubspot-vs-pardot/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [hubspot, pardot] → canonical /compare/hubspot-vs-pardot/ | HIGH | yes | pass |
| `/hubspot-vs-zendesk/` | `/compare/hubspot-vs-zendesk/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [hubspot, zendesk] → canonical /compare/hubspot-vs-zendesk/ | HIGH | yes | pass |
| `/hubspot-vs-zoho/` | `/compare/hubspot-vs-zoho-crm/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [hubspot, zoho-crm] → canonical /compare/hubspot-vs-zoho-crm/ | HIGH | yes | pass |
| `/implement-a-crm-plumbing-business/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/implement-a-successful-crm-for-photographers/` | `/industries/photography/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/implementation-of-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/implementing-crm-private-equity/` | `/guides/crm-implementation/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-implementation/ | HIGH | yes | pass |
| `/implementing-crm-security-measures/` | `/guides/crm-implementation/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/crm-implementation/ | HIGH | yes | pass |
| `/importance-crm-for-hotels/` | `/industries/hospitality/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/importance-of-crm-for-plumbers/` | `/industries/plumbing/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/importance-of-crm-security-for-businesses/` | `/guides/common-crm-mistakes/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/common-crm-mistakes/ | HIGH | yes | pass |
| `/infusionsoft-crm-competitors/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/infusionsoft-crm-review/` | `/software/keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/insightly-crm-competitors/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/insightly-crm-review/` | `/software/insightly/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/integrating-crm-hotel-management-systems/` | `/industries/hospitality/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/integrating-crm-with-real-estate-investment-tools/` | `/industries/real-estate/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/integration-crm-for-musicians/` | `/industries/music/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/introduction-crm-financial-advisors/` | `/industries/financial-services/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/introduction-crm-for-photographers/` | `/industries/photography/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/introduction-crm-for-private-equity-firms/` | `/industries/private-equity/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/introduction-crm-for-real-estate-investors/` | `/industries/real-estate/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/introduction-crm-hotels/` | `/industries/hospitality/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/introduction-crm-integration-with-plumbing-tools-and-software/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/introduction-crm-solar/` | `/industries/solar/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/introduction-to-agile/` | `/software/agile-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Agile intro → Agile CRM product page | HIGH | yes | pass |
| `/introduction-to-crm-systems-for-venture-capital-firms/` | `/industries/venture-capital/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/kaspr-review/` | `/software/kaspr/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/kaspr/ (primary review intent) | HIGH | yes | pass |
| `/keap-crm-competitors/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/keap-crm-review-2/` | `/software/keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/keap-crm-review/` | `/software/keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/key-crm-features-for-photographers/` | `/industries/photography/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/key-features-crm-for-hotels/` | `/industries/hospitality/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/key-features-crm-private-equity-firms/` | `/industries/private-equity/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/key-features-of-crm-for-venture-capital-firms/` | `/industries/venture-capital/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/key-features-of-crm-software-for-real-estate-investors/` | `/industries/real-estate/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/krispcall-review/` | `/software/krispcall/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/krispcall/ (primary review intent) | HIGH | yes | pass |
| `/laxis-review/` | `/categories/ai/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Off-catalogue AI review → AI category index | HIGH | yes | pass |
| `/linkedin-and-crm-a-case-study/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/lusha-review/` | `/software/lusha/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/mailchimp-crm-competitors/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/mailchimp-crm-review-2/` | `/software/mailchimp/` | 301 | Legacy duplicate Mailchimp review → Mailchimp product page | HIGH | yes | pass |
| `/mailchimp-crm-review/` | `/software/mailchimp/` | 301 | Legacy Mailchimp review → Mailchimp product page | HIGH | yes | pass |
| `/microsoft-dynamics-crm-case-study/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/microsoft-dynamics-crm-review/` | `/software/dynamics-365/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/microsoft-dynamics-vs-salesforce/` | `/compare/dynamics-365-vs-salesforce/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [dynamics-365, salesforce] → canonical /compare/dynamics-365-vs-salesforce/ | HIGH | yes | pass |
| `/monday-com-review/` | `/software/monday-sales-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/monday-crm-competitors/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/monday-crm-review/` | `/software/monday-sales-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/navan-review/` | `/software/navan/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/navan/ (primary review intent) | HIGH | yes | pass |
| `/netsuite-crm-review/` | `/software/netsuite/` | 301 | Legacy NetSuite review → NetSuite product page | HIGH | yes | pass |
| `/nicejob-review/` | `/software/nicejob/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/nicejob/ (primary review intent) | HIGH | yes | pass |
| `/nimble-crm-competitors/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/nimble-crm-review/` | `/software/nimble/` | 301 | Legacy Nimble review → Nimble product page | HIGH | yes | pass |
| `/notion-ai-vs-chatgpt/` | `/categories/ai/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): AI topical → AI category index | HIGH | yes | pass |
| `/paraphrasetool-ai-review/` | `/categories/ai/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): AI topical → AI category index | HIGH | yes | pass |
| `/pega-crm-review/` | `/software/pega/` | 301 | Legacy Pega review → Pega product page | HIGH | yes | pass |
| `/pipedrive-case-study/` | `/software/pipedrive/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Case study → matching product page | HIGH | yes | pass |
| `/pipedrive-crm-review/` | `/software/pipedrive/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/pipedrive-vs-hubspot/` | `/compare/hubspot-vs-pipedrive/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [pipedrive, hubspot] → canonical /compare/hubspot-vs-pipedrive/ | HIGH | yes | pass |
| `/pipelinepro-review/` | `/software/pipelinepro/` | 301 | Legacy PipelinePro review → PipelinePro product page | HIGH | yes | pass |
| `/podio-crm-case-study/` | `/software/podio/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Case study → matching product page | HIGH | yes | pass |
| `/podio-crm-review/` | `/software/podio/` | 301 | Legacy Podio review → Podio product page | HIGH | yes | pass |
| `/pricing-of-infusionsoft-crm/` | `/software/keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Infusionsoft pricing → Keap product page (rebrand) | HIGH | yes | pass |
| `/pricing-of-insightly-crm/` | `/software/insightly/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Insightly pricing → product page | HIGH | yes | pass |
| `/pricing-of-keap-crm/` | `/software/keap/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Keap pricing → product page | HIGH | yes | pass |
| `/pricing-of-mailchimp-crm/` | `/software/mailchimp/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Mailchimp pricing → product page | HIGH | yes | pass |
| `/pricing-of-monday-crm/` | `/software/monday/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Monday CRM pricing → product page | HIGH | yes | pass |
| `/pricing-of-nimble-crm/` | `/software/nimble/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy Nimble pricing → product page | HIGH | yes | pass |
| `/pricing-packages-of-crm-for-hotels/` | `/industries/hospitality/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy hotel CRM pricing → hospitality industry hub | HIGH | yes | pass |
| `/privacy-policy/` | `/legal/privacy/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/pros-and-cons-of-infusionsoft-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/pros-and-cons-of-insightly-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/pros-and-cons-of-keap-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/pros-and-cons-of-mailchimp-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/pros-and-cons-of-monday-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/pros-and-cons-of-nimble-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/quillbot-vs-prowritingaid/` | `/categories/ai/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Off-catalogue AI comparison → AI category index | HIGH | yes | pass |
| `/role-of-engineering-in-business/` | `/industries/engineering/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/salesforce-case-study/` | `/software/salesforce/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Case study → matching product page | HIGH | yes | pass |
| `/salesforce-crm-review/` | `/software/salesforce/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/salesforce-vs-act/` | `/compare/act-vs-salesforce/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, act] → canonical /compare/act-vs-salesforce/ | HIGH | yes | pass |
| `/salesforce-vs-infusionsoft/` | `/compare/keap-vs-salesforce/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/salesforce-vs-insightly/` | `/compare/insightly-vs-salesforce/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, insightly] → canonical /compare/insightly-vs-salesforce/ | HIGH | yes | pass |
| `/salesforce-vs-marketo/` | `/compare/marketo-vs-salesforce/` | 301 | Legacy Salesforce vs Marketo → materialized marketo-vs-salesforce compare | HIGH | yes | pass |
| `/salesforce-vs-monday/` | `/compare/monday-sales-crm-vs-salesforce/` | 301 | Legacy Salesforce vs Monday → canonical monday sales CRM vs Salesforce compare | HIGH | yes | pass |
| `/salesforce-vs-netsuite/` | `/compare/netsuite-vs-salesforce/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, netsuite] → canonical /compare/netsuite-vs-salesforce/ | HIGH | yes | pass |
| `/salesforce-vs-oracle/` | `/compare/oracle-cx-vs-salesforce/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, oracle-cx] → canonical /compare/oracle-cx-vs-salesforce/ | HIGH | yes | pass |
| `/salesforce-vs-pega/` | `/compare/pega-vs-salesforce/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, pega] → canonical /compare/pega-vs-salesforce/ | HIGH | yes | pass |
| `/salesforce-vs-pipedrive/` | `/compare/pipedrive-vs-salesforce/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, pipedrive] → canonical /compare/pipedrive-vs-salesforce/ | HIGH | yes | pass |
| `/salesforce-vs-sap/` | `/compare/salesforce-vs-sap/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, sap] → canonical /compare/salesforce-vs-sap/ | HIGH | yes | pass |
| `/salesforce-vs-sugar-crm/` | `/compare/salesforce-vs-sugarcrm/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, sugarcrm] → canonical /compare/salesforce-vs-sugarcrm/ | HIGH | yes | pass |
| `/salesforce-vs-sugarcrm-vs-microsoft-dynamics/` | `/compare/salesforce-vs-sugarcrm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Legacy three-way comparison → primary pair compare page | HIGH | yes | pass |
| `/salesforce-vs-zendesk/` | `/compare/salesforce-vs-zendesk/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, zendesk] → canonical /compare/salesforce-vs-zendesk/ | HIGH | yes | pass |
| `/salesforce-vs-zoho/` | `/compare/salesforce-vs-zoho-crm/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [salesforce, zoho-crm] → canonical /compare/salesforce-vs-zoho-crm/ | HIGH | yes | pass |
| `/sanebox-review/` | `/software/sanebox/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/sanebox/ (primary review intent) | HIGH | yes | pass |
| `/shore-review/` | `/software/shore/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/shore/ (primary review intent) | HIGH | yes | pass |
| `/shortstack-review/` | `/categories/marketing/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Off-catalogue marketing review → marketing category index | HIGH | yes | pass |
| `/siebel-crm-vs-salesforce/` | `/compare/salesforce-vs-siebel/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [siebel, salesforce] → canonical /compare/salesforce-vs-siebel/ | HIGH | yes | pass |
| `/steps-to-implement-a-crm-system-for-hotels/` | `/industries/hospitality/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/success-ai-review/` | `/categories/ai/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Off-catalogue AI review → AI category index | HIGH | yes | pass |
| `/sugar-crm-review/` | `/software/sugarcrm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/the-ultimate-guide-to-agile-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/the-ultimate-guide-to-crm-for-engineering/` | `/industries/engineering/` | 301 | Launch-approved semantic_similarity mapping (HIGH confidence): Launch-approved redirect: Weak semantic candidate 50% → /industries/engineering/ — REVIEW before 301 | HIGH | yes | pass |
| `/the-ultimate-guide-to-crm-for-event-management/` | `/industries/event-management/` | 301 | Launch-approved exact_title_topic mapping (HIGH confidence): Launch-approved redirect: Weak semantic candidate 67% → /industries/event-management/ — REVIEW before 301 | HIGH | yes | pass |
| `/the-ultimate-guide-to-crm-for-facebook-leads/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/the-ultimate-guide-to-crm-for-freelancers/` | `/for/freelancers/` | 301 | Launch-approved exact_title_topic mapping (HIGH confidence): Launch-approved redirect: Weak semantic candidate 100% → /for/freelancers/ — REVIEW before 301 | HIGH | yes | pass |
| `/the-ultimate-guide-to-crm-for-linkedin-2/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/the-ultimate-guide-to-crm-for-linkedin/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/the-ultimate-guide-to-crm-for-web-designers/` | `/industries/web-design/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/the-ultimate-guide-to-freshsales-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/the-ultimate-guide-to-microsoft-dynamics-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/the-ultimate-guide-to-pipedrive-vs-hubspot/` | `/compare/hubspot-vs-pipedrive/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/the-ultimate-guide-to-podio-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/the-ultimate-guide-to-salesforce-vs-pipedrive/` | `/compare/pipedrive-vs-salesforce/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |
| `/the-ultimate-guide-to-zoho-crm/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/tidio-review/` | `/software/tidio/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/tidio/ (primary review intent) | HIGH | yes | pass |
| `/tidio-vs-hubspot/` | `/compare/hubspot-vs-tidio/` | 301 | Legacy Tidio vs HubSpot → materialized hubspot-vs-tidio compare | HIGH | yes | pass |
| `/tidio-vs-zendesk/` | `/compare/tidio-vs-zendesk/` | 301 | Legacy Tidio vs Zendesk → materialized tidio-vs-zendesk compare | HIGH | yes | pass |
| `/tips-for-musician-crm-success/` | `/industries/music/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/top-crm-features-financial-advisors/` | `/industries/financial-services/` | 301 | Legacy financial-advisors CRM features → financial-services industry hub | HIGH | yes | pass |
| `/top-crm-features-for-real-estate-investors/` | `/industries/real-estate/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/understanding-crm-security-compliance-standards/` | `/guides/common-crm-mistakes/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/common-crm-mistakes/ | HIGH | yes | pass |
| `/understanding-crm-systems-for-engineering/` | `/industries/engineering/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/understanding-crm-systems-for-event-management/` | `/industries/event-management/` | 301 | Launch-approved semantic_similarity mapping (HIGH confidence): Launch-approved redirect: Weak semantic candidate 50% → /industries/event-management/ — REVIEW before 301 | HIGH | yes | pass |
| `/understanding-crm-systems-for-facebook/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/understanding-crm-systems-for-linkedin-2/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/understanding-crm-systems-for-linkedin/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/understanding-crm-systems-for-web-designers/` | `/industries/web-design/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/understanding-crm-systems/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/wealthbox-crm-review/` | `/software/wealthbox/` | 301 | Legacy Wealthbox review → Wealthbox product page | HIGH | yes | pass |
| `/web-design-and-crm-a-case-study/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/webydo-review/` | `/categories/ecommerce/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Off-catalogue builder review → ecommerce category index | HIGH | yes | pass |
| `/what-are-the-best-crm-strategies/` | `/categories/crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): CRM topical → category index | HIGH | yes | pass |
| `/what-are-the-best-crm-with-analytics/` | `/use-cases/analytics/` | 301 | Launch-approved semantic_similarity mapping (HIGH confidence): Launch-approved redirect: Weak semantic candidate 50% → /use-cases/analytics/ — REVIEW before 301 | HIGH | yes | pass |
| `/what-are-the-types-of-crm/` | `/guides/types-of-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/types-of-crm/ | HIGH | yes | pass |
| `/what-is-a-crms/` | `/guides/what-is-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/what-is-crm/ | HIGH | yes | pass |
| `/what-is-a-sales-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-cloud-crm-software/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-crm-lead-management/` | `/guides/what-is-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/what-is-crm/ | HIGH | yes | pass |
| `/what-is-crm-marketing/` | `/guides/what-is-crm/` | 301 | Launch-approved same_guide_intent mapping (HIGH confidence): Same guide intent topic map → /guides/what-is-crm/ | HIGH | yes | pass |
| `/what-is-event-management/` | `/industries/event-management/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Industry topical → industry hub | HIGH | yes | pass |
| `/what-is-facebook-leads/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-infusionsoft-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-insightly-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-keap-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-linkedin-for-business/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-mailchimp-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-monday-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-nimble-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-pictory-ai/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-project-management-in-crm/` | `/guides/what-is-project-management-software/` | 301 | Launch-approved exact_title_topic mapping (HIGH confidence): Semantic guide similarity 67% → /guides/what-is-project-management-software/ | HIGH | yes | pass |
| `/what-is-the-best-crm-feature/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/what-is-tidio/` | `/guides/what-is-tidio/` | 301 | Launch-approved semantic_similarity mapping (LOW confidence): Semantic guide similarity 50% → /guides/what-is-tidio/ | HIGH | yes | pass |
| `/what-is-workflows-crm/` | `/guides/what-is-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Guide-like article → CRM pillar guide | HIGH | yes | pass |
| `/whitespark-review/` | `/categories/marketing/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Off-catalogue local-SEO review → marketing category index | HIGH | yes | pass |
| `/whitespark-vs-brightlocal/` | `/categories/marketing/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Off-catalogue local-SEO comparison → marketing category index | HIGH | yes | pass |
| `/writesonic-review/` | `/software/writesonic/` | 301 | Launch-approved same_product mapping (HIGH confidence): Same product entity → /software/writesonic/ (primary review intent) | HIGH | yes | pass |
| `/writesonic-vs-chatgpt/` | `/compare/chatgpt-vs-writesonic/` | 301 | Launch-approved same_comparison_pair mapping (HIGH confidence): Order-insensitive comparison pair [writesonic, chatgpt] → canonical /compare/chatgpt-vs-writesonic/ | HIGH | yes | pass |
| `/zendesk-crm-review/` | `/software/zendesk/` | 301 | Legacy Zendesk Sell review → Zendesk product page | HIGH | yes | pass |
| `/zoho-crm-case-study/` | `/software/zoho-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Case study → matching product page | HIGH | yes | pass |
| `/zoho-crm-review/` | `/software/zoho-crm/` | 301 | Launch-approved explicit_historical mapping (HIGH confidence): Explicit historical mapping (LEGACY_PATH_ALIASES): LEGACY_PATH_ALIASES explicit map | HIGH | yes | pass |

## Manual mappings excluded (not implemented)

These had redirect recommendations but failed auto-approval (low/medium confidence or non-allowlisted basis):

| Source | Destination | Type | Reason | Confidence | Implemented? | Test status |
| --- | --- | --- | --- | --- | --- | --- |

## Retired (404/410) — no redirect

| Source | Destination | Type | Reason | Confidence | Implemented? | Test status |
| --- | --- | --- | --- | --- | --- | --- |
| `/tag/*` (pattern) | — | 410 | WP tag archives | HIGH | no (intentional) | skipped |
| `/author/*` (pattern) | — | 404 | WP author archives | HIGH | no (intentional) | skipped |
| `/feed` patterns | — | 410 | WP feeds | HIGH | no (intentional) | skipped |
| _272 exact URLs in mapping plan marked 404/410_ | — | 410/404 | See mapping plan | — | no | skipped |

Exact 410/404 paths are **not** emitted as Next redirects (Next cannot express 410 via `redirects()`). They simply have no 301 — platform/default 404 applies until explicit 410 handling is approved.

## WordPress legacy patterns

| Pattern | Action | Notes |
| --- | --- | --- |
| `/tag/:slug*` | 410 | WP tag archives — low-value taxonomy (exact paths preferred over broad catch-alls in Next; documented for ops) |
| `/author/:slug*` | 404 | WP author archives not in new IA |
| `/feed` | 410 | WP feed URL |
| `/comments/feed` | 410 | WP comments feed |
| `/category/:slug` | selective 301 | Only HIGH allowlisted category→hub maps (e.g. `/category/crm/` → `/categories/crm/`). No broad regex. |
| `/page/2/`, `?amp`, date archives, `?attachment_id=` | 404/410 | Not implemented as catch-alls — avoid colliding with new routes. |

## Wiring

- `config/legacy-redirects.json` — machine-readable source of truth
- `next.config.ts` — loads via `toNextConfigRedirects()`
- Tests: `src/services/legacy-url-migration/redirect-plan/redirect-plan.test.ts`

```bash
npm run migration:redirects
npm test -- src/services/legacy-url-migration/redirect-plan
```

