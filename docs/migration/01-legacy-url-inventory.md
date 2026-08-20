# Legacy URL Migration Inventory

Generated: 2026-08-19T11:35:37.636Z

> Audit only. **Do not implement redirects from this document** until the redirect plan is approved.

## Purpose

Compare live WordPress production (`https://www.softwareglimpse.com`) against the new SoftwareGlimpse Next.js application in this repository. Identify exact matches, redirect candidates, merges, retirements, duplicates/canonical risks, and SEO-sensitive URLs that must not disappear accidentally.

## Summary counts

| Metric | Count |
| --- | --- |
| Legacy sitemap unique `<loc>` URLs | 5158 |
| Legacy locale/hreflang URLs (excl. from primary EN match) | 3222 |
| Legacy primary English content URLs | 643 |
| New app public routes inventoried | 6534 |
| New app sitemap-eligible URLs | 6432 |
| Exact path matches | 3 |
| Redirect candidates (301 / merge+301) | 87 |
| … of which high confidence | 59 |
| Retirement candidates (404 / 410) | 155 |
| Manual review candidates | 398 |
| New routes with no legacy counterpart | 6531 |
| High SEO-risk legacy URLs | 136 |

## Discovery sources

- Host: https://www.softwareglimpse.com
- Sitemap index: https://www.softwareglimpse.com/sitemap_index.xml
- Child sitemaps: `post-sitemap.xml`, `page-sitemap.xml`, `category-sitemap.xml`, `post_tag-sitemap.xml`, `author-sitemap.xml`, `kadence_element-sitemap.xml`
- robots.txt → Yoast sitemap index
- New app: `getSitemapEntries()` + data-layer entities + static hubs/legal/company/tools

## Record model

```ts
LegacyUrlMigrationRecord {
  legacyUrl, legacyStatus, legacyTitle, legacyCanonical,
  legacyIndexable, legacyPageType,
  newUrl?, newTitle?, newPageType?,
  relationship: EXACT | EQUIVALENT | MERGED_INTO | SPLIT_INTO |
                NO_EQUIVALENT | DUPLICATE | UNKNOWN,
  recommendedAction: KEEP | 301_REDIRECT | MERGE_AND_301 |
                     404 | 410 | NOINDEX | REVIEW,
  confidence: HIGH | MEDIUM | LOW,
  reason, seoRisk, notes
}
```

Machine-readable snapshot: [`data/migration-records.json`](./data/migration-records.json).

## Legacy URL inventory (primary EN)

| Legacy page type | Count |
| --- | --- |
| other_article | 198 |
| wp_tag | 154 |
| guide_like | 78 |
| comparison | 71 |
| product_review | 61 |
| best_list | 44 |
| wp_category | 30 |
| hub_or_legal | 4 |
| home | 1 |
| wp_author | 1 |
| alternatives | 1 |

Full list: [`data/legacy-primary-en.json`](./data/legacy-primary-en.json) (643 URLs).

### Locale / alternate URLs

Yoast emits hreflang alternates for `de`, `nl`, `es`, `fr`, and `ar` (~3,222 URLs). These are **not** collapsed into English matches. See [`data/legacy-locale-summary.json`](./data/legacy-locale-summary.json). Cutover needs an explicit language strategy (redirect to EN, keep locales, or retire).

## Current (new app) URL inventory

| Page type | Count |
| --- | --- |
| comparison | 4122 |
| guide | 1386 |
| software | 306 |
| pricing | 306 |
| alternatives | 302 |
| tool | 98 |
| use_case | 97 |
| capability | 70 |
| industry | 25 |
| feature | 24 |
| category | 23 |
| resource | 17 |
| requirement | 14 |
| best | 11 |
| legal | 8 |
| audience | 8 |
| company | 5 |
| newsletter_utility | 3 |
| homepage | 1 |
| software_hub | 1 |
| categories_hub | 1 |
| tools_hub | 1 |
| pricing_hub | 1 |
| compare_hub | 1 |
| compare_builder | 1 |
| guides_hub | 1 |
| use_cases_hub | 1 |
| capabilities_hub | 1 |
| requirements_hub | 1 |
| features_hub | 1 |
| resources_hub | 1 |
| audiences_hub | 1 |
| industries_hub | 1 |
| best_hub | 1 |
| alternatives_hub | 1 |
| search | 1 |
| privacy_utility | 1 |

Full inventory: [`data/new-inventory.json`](./data/new-inventory.json).

### Route patterns (new app)

| Pattern | Notes |
| --- | --- |
| `/` | Homepage |
| `/software/`, `/software/[slug]/` | Catalogue + product/review surface |
| `/software/[slug]/[tab]/` | Product tabs |
| `/pricing/`, `/pricing/[slug]/` | Pricing hub + product pricing (often noindex) |
| `/categories/`, `/categories/[...slug]/` | Category tree |
| `/compare/`, `/compare/[slug]/`, `/compare/build/` | Comparisons |
| `/alternatives/`, `/alternatives/[slug]/` | Alternatives |
| `/best/`, `/best/[slug]/` | Best-of pages |
| `/guides/`, `/guides/[slug]/` | Guides |
| `/features/`, `/capabilities/`, `/requirements/`, `/use-cases/` | Knowledge hubs + detail |
| `/industries/[slug]/…` | Industry hubs + nested (mostly noindex today) |
| `/resources/`, `/tools/…` | Resources + interactive tools |
| `/for/[slug]/` | Audience pages |
| `/company/*`, `/legal/*` | Company + legal |
| `/search/` | Search (noindex) |

## Exact matches

| Legacy | New | Action |
| --- | --- | --- |
| `/` | `/` | KEEP |
| `/guides/` | `/guides/` | KEEP |
| `/software/` | `/software/` | KEEP |

WordPress used flat post slugs (`/pipedrive-crm-review/`). The new IA uses namespaced routes (`/software/pipedrive/`), so exact path overlap is intentionally small.

## Potential redirects (high confidence)

| Legacy | → New | Relationship | Action | Reason |
| --- | --- | --- | --- | --- |
| `/activecampaign-crm-review/` | `/software/activecampaign/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/activecampaign/ |
| `/best-crm-engineering/` | `/industries/engineering/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/engineering/ |
| `/best-crm-for-coaches/` | `/industries/coaching/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/coaching/ |
| `/best-crm-for-event-management/` | `/industries/event-management/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/event-management/ |
| `/best-crm-for-investor-relations/` | `/industries/investor-relations/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/investor-relations/ |
| `/best-crm-for-musicians/` | `/industries/music/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/music/ |
| `/best-crm-for-photographers/` | `/industries/photography/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/photography/ |
| `/best-crm-for-plumbers/` | `/industries/plumbing/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/plumbing/ |
| `/best-crm-for-web-designers/` | `/industries/web-design/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/web-design/ |
| `/best-crm-solar-businesses/` | `/industries/solar/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/solar/ |
| `/best-crm-venture-capital/` | `/industries/venture-capital/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/venture-capital/ |
| `/best-crms/` | `/best/crm-software/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /best/crm-software/ |
| `/best-private-equity-crm/` | `/industries/private-equity/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /industries/private-equity/ |
| `/capsule-crm-review-2/` | `/software/capsule/` | DUPLICATE | 301_REDIRECT | Explicit alias → /software/capsule/ |
| `/capsule-crm-review/` | `/software/capsule/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/capsule/ |
| `/category/best-crms/` | `/best/crm-software/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /best/crm-software/ |
| `/category/crm-comparisons/` | `/compare/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /compare/ |
| `/category/crm-guides/` | `/guides/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /guides/ |
| `/category/crm/` | `/categories/crm/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /categories/crm/ |
| `/close-crm-review/` | `/software/close/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/close/ |
| `/closely-review/` | `/software/closely/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/closely/ |
| `/comparing-setup-pipedrive-vs-hubspot/` | `/compare/hubspot-vs-pipedrive/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /compare/hubspot-vs-pipedrive/ |
| `/comparing-setup-salesforce-vs-pipedrive/` | `/compare/pipedrive-vs-salesforce/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /compare/pipedrive-vs-salesforce/ |
| `/contact/` | `/company/contact/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /company/contact/ |
| `/copper-crm-alternatives/` | `/software/copper/` | MERGED_INTO | MERGE_AND_301 | No /alternatives/copper/ yet — interim product merge |
| `/crm-for-security-companies/` | `/industries/security-companies/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /industries/security-companies/ |
| `/diginius-review/` | `/software/diginius/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/diginius/ |
| `/fastmail-review/` | `/software/fastmail/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/fastmail/ |
| `/folk-app-review/` | `/software/folk/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/folk/ |
| `/folk-crm-review/` | `/software/folk/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/folk/ |
| `/freshsales-crm-review/` | `/software/freshsales/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/freshsales/ |
| `/getresponse-review/` | `/software/getresponse/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/getresponse/ |
| `/hubspot-crm-review/` | `/software/hubspot/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/hubspot/ |
| `/hubspot-vs-infusionsoft/` | `/compare/hubspot-vs-keap/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /compare/hubspot-vs-keap/ |
| `/hubspot-vs-monday-2/` | `/compare/hubspot-vs-monday-sales-crm/` | DUPLICATE | 301_REDIRECT | Explicit alias → /compare/hubspot-vs-monday-sales-crm/ |
| `/infusionsoft-crm-review/` | `/software/keap/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/keap/ |
| `/insightly-crm-review/` | `/software/insightly/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/insightly/ |
| `/kaspr-review/` | `/software/kaspr/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/kaspr/ |
| `/keap-crm-review-2/` | `/software/keap/` | DUPLICATE | 301_REDIRECT | Explicit alias → /software/keap/ |
| `/keap-crm-review/` | `/software/keap/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/keap/ |
| `/krispcall-review/` | `/software/krispcall/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/krispcall/ |
| `/lusha-review/` | `/software/lusha/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/lusha/ |
| `/microsoft-dynamics-crm-review/` | `/software/dynamics-365/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/dynamics-365/ |
| `/monday-com-review/` | `/software/monday-sales-crm/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/monday-sales-crm/ |
| `/monday-crm-review/` | `/software/monday-sales-crm/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/monday-sales-crm/ |
| `/navan-review/` | `/software/navan/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/navan/ |
| `/nicejob-review/` | `/software/nicejob/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/nicejob/ |
| `/pipedrive-crm-review/` | `/software/pipedrive/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/pipedrive/ |
| `/privacy-policy/` | `/legal/privacy/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /legal/privacy/ |
| `/salesforce-crm-review/` | `/software/salesforce/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/salesforce/ |
| `/salesforce-vs-infusionsoft/` | `/compare/keap-vs-salesforce/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /compare/keap-vs-salesforce/ |
| `/sanebox-review/` | `/software/sanebox/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/sanebox/ |
| `/shore-review/` | `/software/shore/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/shore/ |
| `/sugar-crm-review/` | `/software/sugarcrm/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/sugarcrm/ |
| `/the-ultimate-guide-to-pipedrive-vs-hubspot/` | `/compare/hubspot-vs-pipedrive/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /compare/hubspot-vs-pipedrive/ |
| `/the-ultimate-guide-to-salesforce-vs-pipedrive/` | `/compare/pipedrive-vs-salesforce/` | MERGED_INTO | MERGE_AND_301 | Explicit alias → /compare/pipedrive-vs-salesforce/ |
| `/tidio-review/` | `/software/tidio/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/tidio/ |
| `/writesonic-review/` | `/software/writesonic/` | EQUIVALENT | 301_REDIRECT | Review slug maps to /software/writesonic/ |
| `/zoho-crm-review/` | `/software/zoho-crm/` | EQUIVALENT | 301_REDIRECT | Explicit alias → /software/zoho-crm/ |

## Potential redirects (medium/low confidence)

| Legacy | → New | Conf | Action | Reason |
| --- | --- | --- | --- | --- |
| `/ai-software/` | `/guides/what-is-ai-software/` | LOW | 301_REDIRECT | Fuzzy guide match → /guides/what-is-ai-software/ |
| `/crm/` | `/guides/what-is-crm/` | LOW | 301_REDIRECT | Fuzzy guide match → /guides/what-is-crm/ |
| `/hubspot-vs-activecampaign/` | `/compare/activecampaign-vs-hubspot/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/activecampaign-vs-hubspot/ |
| `/hubspot-vs-freshsales/` | `/compare/freshsales-vs-hubspot/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/freshsales-vs-hubspot/ |
| `/hubspot-vs-insightly/` | `/compare/hubspot-vs-insightly/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/hubspot-vs-insightly/ |
| `/hubspot-vs-keap/` | `/compare/hubspot-vs-keap/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/hubspot-vs-keap/ |
| `/hubspot-vs-mailchimp/` | `/compare/hubspot-vs-mailchimp/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/hubspot-vs-mailchimp/ |
| `/hubspot-vs-marketo/` | `/compare/hubspot-vs-marketo/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/hubspot-vs-marketo/ |
| `/hubspot-vs-monday/` | `/compare/hubspot-vs-monday-sales-crm/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/hubspot-vs-monday-sales-crm/ |
| `/hubspot-vs-pardot/` | `/compare/hubspot-vs-pardot/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/hubspot-vs-pardot/ |
| `/hubspot-vs-zendesk/` | `/compare/hubspot-vs-zendesk/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/hubspot-vs-zendesk/ |
| `/hubspot-vs-zoho/` | `/compare/hubspot-vs-zoho-crm/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/hubspot-vs-zoho-crm/ |
| `/microsoft-dynamics-vs-salesforce/` | `/compare/dynamics-365-vs-salesforce/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/dynamics-365-vs-salesforce/ |
| `/pipedrive-vs-hubspot/` | `/compare/hubspot-vs-pipedrive/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/hubspot-vs-pipedrive/ |
| `/salesforce-vs-act/` | `/compare/act-vs-salesforce/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/act-vs-salesforce/ |
| `/salesforce-vs-insightly/` | `/compare/insightly-vs-salesforce/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/insightly-vs-salesforce/ |
| `/salesforce-vs-monday/` | `/compare/monday-sales-crm-vs-salesforce/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/monday-sales-crm-vs-salesforce/ |
| `/salesforce-vs-netsuite/` | `/compare/netsuite-vs-salesforce/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/netsuite-vs-salesforce/ |
| `/salesforce-vs-pega/` | `/compare/pega-vs-salesforce/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/pega-vs-salesforce/ |
| `/salesforce-vs-pipedrive/` | `/compare/pipedrive-vs-salesforce/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/pipedrive-vs-salesforce/ |
| `/salesforce-vs-sap/` | `/compare/salesforce-vs-sap/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/salesforce-vs-sap/ |
| `/salesforce-vs-sugar-crm/` | `/compare/salesforce-vs-sugarcrm/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/salesforce-vs-sugarcrm/ |
| `/salesforce-vs-zendesk/` | `/compare/salesforce-vs-zendesk/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/salesforce-vs-zendesk/ |
| `/salesforce-vs-zoho/` | `/compare/salesforce-vs-zoho-crm/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/salesforce-vs-zoho-crm/ |
| `/siebel-crm-vs-salesforce/` | `/compare/salesforce-vs-siebel/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/salesforce-vs-siebel/ |
| `/what-are-the-types-of-crm/` | `/guides/types-of-crm/` | LOW | 301_REDIRECT | Fuzzy guide match → /guides/types-of-crm/ |
| `/what-is-tidio/` | `/guides/what-is-tidio/` | LOW | 301_REDIRECT | Fuzzy guide match → /guides/what-is-tidio/ |
| `/writesonic-vs-chatgpt/` | `/compare/chatgpt-vs-writesonic/` | MEDIUM | 301_REDIRECT | Comparison slug maps to /compare/chatgpt-vs-writesonic/ |

## No-equivalent URLs (SEO-sensitive subsets)

Reviews, best lists, comparisons, and alternatives without a clear new counterpart:

| Legacy | Type | SEO risk | Suggested next step |
| --- | --- | --- | --- |
| `/a-guide-to-cdp-vs-crm/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/adriel-review/` | product_review | high | Product review with no matching software entity |
| `/affinity-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/agile-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/ahrefs-vs-semrush/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/apptivo-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/bard-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/best-ai-seo-tool/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-ai-software/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-ai-tweet-generator/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-commercial-real-estate-crm/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-facebook-leads/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-field-sales/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-financial-advisors/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-freelancers/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-hotels/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-linkedin/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-office-365/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-real-estate-investors/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-small-legal-practices/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-small-real-estate-business/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-startups/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-software-for-car-dealerships/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-software-for-construction/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-software-for-restaurants/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-software-in-dubai/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-systems-for-small-nonprofits/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-with-text-messaging/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-diy-seo-software/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-practices-crm-deal-flow-private-equity/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-practices-crm/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-practices-for-ensuring-crm-security/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-script-writing-software/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-seo-reporting-software/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-seo-software-small-business/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/caktus-ai-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/chatsonic-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/cloze-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/content-at-scale-review/` | product_review | high | Product review with no matching software entity |
| `/copilot-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/copy-ai-review/` | product_review | high | Product review with no matching software entity |
| `/crm-for-startups-vs-investors/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/frase-vs-surfer-seo/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/ginger-vs-grammarly/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/grammarly-vs-wordtune/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/gramplagchecker-vs-turnitin/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/hemingway-vs-grammarly/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/jasper-ai-review/` | product_review | high | Product review with no matching software entity |
| `/jasper-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/lamda-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/languagetool-vs-grammarly/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/laxis-review/` | product_review | high | Product review with no matching software entity |
| `/llama-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/mailchimp-crm-review-2/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/mailchimp-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/miocommerce-review/` | product_review | high | Product review with no matching software entity |
| `/muse-vs-surfer-seo/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/netsuite-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/nimble-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/notion-ai-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/paraphrasetool-ai-review/` | product_review | high | Product review with no matching software entity |
| `/pega-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/pictory-ai-review-2/` | product_review | high | Product review with no matching software entity |
| `/pictory-ai-review/` | product_review | high | Product review with no matching software entity |
| `/pictory-ai-vs-copy-ai-2/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pictory-ai-vs-copy-ai-3/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pictory-ai-vs-copy-ai/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pictory-ai-vs-invideo-2/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pictory-ai-vs-invideo/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pipelinepro-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/podio-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/quillbot-vs-jasper/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/quillbot-vs-prowritingaid/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/rankmath-review/` | product_review | high | Product review with no matching software entity |
| `/rankmath-vs-seopress/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/salesforce-vs-marketo/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/salesforce-vs-oracle/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/salesforce-vs-sugarcrm-vs-microsoft-dynamics/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/semrush-review/` | product_review | high | Product review with no matching software entity |
| `/semrush-vs-moz/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/shortstack-review/` | product_review | high | Product review with no matching software entity |
| `/spyfu-vs-semrush/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/stockfish-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/success-ai-review/` | product_review | high | Product review with no matching software entity |
| `/surfer-seo-review/` | product_review | high | Product review with no matching software entity |
| `/surferseo-vs-semrush/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/tidio-vs-crisp/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/tidio-vs-hubspot/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/tidio-vs-live-chat/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/tidio-vs-zendesk/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/top-crm-features-financial-advisors/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/top-crm-features-for-real-estate-investors/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/top-local-seo-tools/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/top-seo-automation/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/wealthbox-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/webydo-review/` | product_review | high | Product review with no matching software entity |
| `/whitespark-review/` | product_review | high | Product review with no matching software entity |
| `/whitespark-vs-brightlocal/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/whitespark-vs-moz-local/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/yoast-vs-rankmath/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/zendesk-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |

## Duplicate / alias URLs

- WordPress `-2` / `-3` slug suffixes (e.g. `/capsule-crm-review-2/`, `/hubspot-vs-monday-2/`) → treat as **DUPLICATE** of the canonical review/compare target.
- Prefixed comparison essays (`/the-ultimate-guide-to-…`, `/comparing-setup-…`) → **MERGED_INTO** canonical `/compare/{a}-vs-{b}/`.
- WP tag archives (154) → recommended **410** (or soft noindex) unless a tag clearly equals a product/category hub.
- Duplicate/alias-related records in snapshot: **169**.

## Legacy redirects (already live)

HEAD sampling of SEO-critical English URLs returned **HTTP 200** with no `Location` headers (sample size limited). Full redirect-chain crawl not completed in this pass.

## Potentially important URLs needing manual review

High SEO risk and/or commercial intent without a safe automatic redirect:

| Legacy | Type | Risk | Why |
| --- | --- | --- | --- |
| `/a-guide-to-cdp-vs-crm/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/adriel-review/` | product_review | high | Product review with no matching software entity |
| `/affinity-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/agile-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/ahrefs-vs-semrush/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/apptivo-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/bard-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/best-ai-seo-tool/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-ai-software/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-ai-tweet-generator/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-commercial-real-estate-crm/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-facebook-leads/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-field-sales/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-financial-advisors/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-freelancers/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-hotels/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-linkedin/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-office-365/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-real-estate-investors/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-small-legal-practices/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-small-real-estate-business/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-for-startups/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-software-for-car-dealerships/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-software-for-construction/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-software-for-restaurants/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-software-in-dubai/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-systems-for-small-nonprofits/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-crm-with-text-messaging/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-diy-seo-software/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-practices-crm-deal-flow-private-equity/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-practices-crm/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-practices-for-ensuring-crm-security/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-script-writing-software/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-seo-reporting-software/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/best-seo-software-small-business/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/caktus-ai-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/chatsonic-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/cloze-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/content-at-scale-review/` | product_review | high | Product review with no matching software entity |
| `/copilot-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/copy-ai-review/` | product_review | high | Product review with no matching software entity |
| `/crm-for-startups-vs-investors/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/frase-vs-surfer-seo/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/ginger-vs-grammarly/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/grammarly-vs-wordtune/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/gramplagchecker-vs-turnitin/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/hemingway-vs-grammarly/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/jasper-ai-review/` | product_review | high | Product review with no matching software entity |
| `/jasper-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/lamda-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/languagetool-vs-grammarly/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/laxis-review/` | product_review | high | Product review with no matching software entity |
| `/llama-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/mailchimp-crm-review-2/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/mailchimp-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/miocommerce-review/` | product_review | high | Product review with no matching software entity |
| `/muse-vs-surfer-seo/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/netsuite-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/nimble-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/notion-ai-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/paraphrasetool-ai-review/` | product_review | high | Product review with no matching software entity |
| `/pega-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/pictory-ai-review-2/` | product_review | high | Product review with no matching software entity |
| `/pictory-ai-review/` | product_review | high | Product review with no matching software entity |
| `/pictory-ai-vs-copy-ai-2/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pictory-ai-vs-copy-ai-3/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pictory-ai-vs-copy-ai/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pictory-ai-vs-invideo-2/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pictory-ai-vs-invideo/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/pipelinepro-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/podio-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/quillbot-vs-jasper/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/quillbot-vs-prowritingaid/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/rankmath-review/` | product_review | high | Product review with no matching software entity |
| `/rankmath-vs-seopress/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/salesforce-vs-marketo/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/salesforce-vs-oracle/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/salesforce-vs-sugarcrm-vs-microsoft-dynamics/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/semrush-review/` | product_review | high | Product review with no matching software entity |
| `/semrush-vs-moz/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/shortstack-review/` | product_review | high | Product review with no matching software entity |
| `/spyfu-vs-semrush/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/stockfish-vs-chatgpt/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/success-ai-review/` | product_review | high | Product review with no matching software entity |
| `/surfer-seo-review/` | product_review | high | Product review with no matching software entity |
| `/surferseo-vs-semrush/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/tidio-vs-crisp/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/tidio-vs-hubspot/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/tidio-vs-live-chat/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/tidio-vs-zendesk/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/top-crm-features-financial-advisors/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/top-crm-features-for-real-estate-investors/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/top-local-seo-tools/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/top-seo-automation/` | best_list | high | Vertical/best list — map to /best/, /industries/, or /for/ after editorial review |
| `/wealthbox-crm-review/` | product_review | high | Mapped as no catalogue equivalent; decide retire vs keep/rewrite content |
| `/webydo-review/` | product_review | high | Product review with no matching software entity |
| `/whitespark-review/` | product_review | high | Product review with no matching software entity |
| `/whitespark-vs-brightlocal/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/whitespark-vs-moz-local/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |
| `/yoast-vs-rankmath/` | comparison | medium | Comparison with no matching new compare page (often non-CRM) |

_…and 1 more in data file_

### Priority review themes

1. **CRM vertical best-ofs** (`/best-crm-for-*`, `/best-crm-software-for-*`) — map to `/best/`, `/industries/`, or `/for/` once those pages are indexable.
2. **Out-of-catalogue CRM reviews** (Podio, Nimble, NetSuite, Zendesk CRM, etc.) — onboard product **or** retire with intentional 410 + related hub link.
3. **Non-CRM SEO/AI content** (Semrush, Jasper, ChatGPT comparisons) — decide keep-as-archive vs retire; not part of CRM IA.
4. **Locale URLs** — language cutover plan before DNS/host cutover.
5. **Existing seed ledger gaps** — `src/data/seed/migration.ts` includes paths like `/pipedrive-review/` and `/best-crm-software/` that did **not** appear in the live Yoast EN sitemap (aliases to verify against GSC).

## New routes with no legacy counterpart (sample)

The new IA is largely additive (tools, requirements, capabilities, resources, industry graph). Sample:

| New path | Type | Indexable |
| --- | --- | --- |
| `/categories/` | categories_hub | yes |
| `/tools/` | tools_hub | yes |
| `/pricing/` | pricing_hub | yes |
| `/compare/` | compare_hub | yes |
| `/compare/build/` | compare_builder | no |
| `/use-cases/` | use_cases_hub | yes |
| `/capabilities/` | capabilities_hub | yes |
| `/requirements/` | requirements_hub | yes |
| `/features/` | features_hub | yes |
| `/resources/` | resources_hub | yes |
| `/for/` | audiences_hub | yes |
| `/industries/` | industries_hub | no |
| `/best/` | best_hub | yes |
| `/alternatives/` | alternatives_hub | yes |
| `/search/` | search | no |
| `/company/about/` | company | yes |
| `/company/my-story/` | company | yes |
| `/company/editorial-methodology/` | company | yes |
| `/company/how-we-review-software/` | company | yes |
| `/company/contact/` | company | yes |
| `/legal/privacy/` | legal | yes |
| `/legal/cookies/` | legal | yes |
| `/legal/terms/` | legal | yes |
| `/legal/affiliate-disclosure/` | legal | yes |
| `/legal/editorial-independence/` | legal | yes |
| `/legal/advertising-sponsorship/` | legal | yes |
| `/legal/disclaimer/` | legal | yes |
| `/legal/accessibility/` | legal | yes |
| `/tools/crm-finder/` | tool | yes |
| `/tools/sales-intelligence-finder/` | tool | yes |
| `/tools/sales-intelligence-vendor-scorecard/` | tool | yes |
| `/tools/sales-intelligence-demo-checklist-builder/` | tool | yes |
| `/tools/sales-intelligence-rfp-builder/` | tool | yes |
| `/tools/sales-intelligence-readiness-assessment/` | tool | yes |
| `/tools/crm-vendor-scorecard/` | tool | yes |
| `/tools/crm-cost-calculator/` | tool | yes |
| `/tools/sales-intelligence-cost-calculator/` | tool | no |
| `/tools/crm-plan-selector/` | tool | yes |
| `/tools/sales-intelligence-plan-selector/` | tool | no |
| `/tools/crm-tco-calculator/` | tool | yes |
| `/tools/crm-roi-calculator/` | tool | yes |
| `/tools/crm-readiness-assessment/` | tool | yes |
| `/tools/crm-adoption-health-assessment/` | tool | yes |
| `/tools/crm-multi-compare/` | tool | yes |
| `/tools/crm-requirements-builder/` | tool | yes |
| `/tools/sales-intelligence-requirements-builder/` | tool | yes |
| `/tools/crm-rfp-builder/` | tool | yes |
| `/tools/crm-demo-checklist-builder/` | tool | yes |
| `/tools/crm-implementation-planner/` | tool | yes |
| `/tools/crm-migration-cost-calculator/` | tool | yes |
| `/tools/crm-migration-planner/` | tool | yes |
| `/tools/software-stack-builder/` | tool | no |
| `/tools/software-finder/` | tool | no |
| `/tools/software-cost-calculator/` | tool | no |
| `/tools/marketing-finder/` | tool | yes |
| `/tools/marketing-vendor-scorecard/` | tool | yes |
| `/tools/marketing-demo-checklist-builder/` | tool | yes |
| `/tools/marketing-rfp-builder/` | tool | yes |
| `/tools/marketing-readiness-assessment/` | tool | yes |
| `/tools/marketing-cost-calculator/` | tool | yes |
| `/tools/marketing-plan-selector/` | tool | yes |
| `/tools/marketing-requirements-builder/` | tool | yes |
| `/tools/email-marketing-finder/` | tool | yes |
| `/tools/email-marketing-vendor-scorecard/` | tool | yes |
| `/tools/email-marketing-demo-checklist-builder/` | tool | yes |
| `/tools/email-marketing-rfp-builder/` | tool | yes |
| `/tools/email-marketing-readiness-assessment/` | tool | yes |
| `/tools/email-marketing-cost-calculator/` | tool | yes |
| `/tools/email-marketing-plan-selector/` | tool | yes |
| `/tools/email-marketing-requirements-builder/` | tool | yes |
| `/tools/business-communications-finder/` | tool | yes |
| `/tools/business-communications-vendor-scorecard/` | tool | yes |
| `/tools/business-communications-demo-checklist-builder/` | tool | yes |
| `/tools/business-communications-rfp-builder/` | tool | yes |
| `/tools/business-communications-readiness-assessment/` | tool | yes |
| `/tools/business-communications-cost-calculator/` | tool | yes |
| `/tools/business-communications-plan-selector/` | tool | yes |
| `/tools/business-communications-requirements-builder/` | tool | yes |
| `/tools/customer-service-finder/` | tool | yes |
| `/tools/customer-service-vendor-scorecard/` | tool | yes |

Full new-only list: [`data/new-only.json`](./data/new-only.json).

## Potential redirect chains / canonical risks

- **Avoid chains**: legacy A → legacy B → new C. Prefer single-hop A → final canonical.
- **Duplicate reviews** (`-review-2`) must point at the same final `/software/{slug}/` as the primary review URL.
- **Infusionsoft → Keap**: `/infusionsoft-crm-review/` and `/hubspot-vs-infusionsoft/` should land on Keap software/compare URLs (not a dead Infusionsoft slug).
- **Monday naming**: legacy `/monday-crm-review/` / `/monday-com-review/` → `/software/monday-sales-crm/`.
- **Compare slug order**: legacy `pipedrive-vs-hubspot` → new lexicographic `/compare/hubspot-vs-pipedrive/`.
- New app already has internal feature aliases in `src/seo/canonical.ts` / `next.config.ts` (`call-functionality` → `calling`); keep legacy WP redirects separate from those.

## Crawl limitations

- Primary English inventory from Yoast XML sitemaps; not a full HTML link crawl of every template.
- Locale hreflang URLs (de/nl/es/fr/ar) counted separately — need a language cutover plan.
- Live page titles/canonicals/robots only sampled via HEAD for SEO-critical paths (full GET crawl deferred).
- Google Search Console / Bing indexed URL exports not imported in this pass.
- Internal link graph and redirect-chain detection across the live site are incomplete.
- Kadence element query URLs and media attachment URLs excluded from primary matching.
- No redirects were written to next.config.ts or hosting config.

## Framework location

- Service: `src/services/legacy-url-migration/`
- CLI: `npm run migration:legacy-urls`
- Related hand ledger (CRM batch proposals): `src/data/seed/migration.ts` (`MigrationRecord`)

## Next steps (not done yet)

1. Import GSC/Bing URL inventories; reconcile against this sitemap set.
2. Editorial pass on high SEO-risk REVIEW rows.
3. Approve redirect map → implement in hosting/`next.config` (separate change).
4. Locale cutover plan.
5. Post-cutover crawl for chains, 404 spikes, and canonical mismatches.

