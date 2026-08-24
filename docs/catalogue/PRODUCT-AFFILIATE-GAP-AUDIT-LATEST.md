# Product & affiliate gap audit

_Generated 2026-08-23 from live catalogue loaders. Regenerate: `npx tsx scripts/generate-product-gap-audit.ts`_

## Executive summary

| Metric | Count |
| --- | ---: |
| Software products in seed | 309 |
| Affiliate inventory rows | 101 |
| Partner link records | 103 |
| Live affiliate (enabled + tracking URL) | 90 |
| No live affiliate | 219 |
| Missing approved review/assessment | 0 |
| No 5-kind product guide pack | 11 |
| Zero guide mentions (any kind) | 0 |
| Onboarding manifests on disk | 309 |
| Products without manifest | 0 |
| Manifest: blocked | 0 |
| Manifest: review-required | 0 |
| Manifest: ready | 309 |
| Not on any best-page shortlist | 0 |
| metadata.status | 306 published, 3 scheduled |

### Products by category

| Category | Count |
| --- | ---: |
| it-development | 49 |
| crm | 37 |
| hr | 30 |
| sales-intelligence | 30 |
| marketing | 29 |
| business-communications | 28 |
| ecommerce | 28 |
| ai | 26 |
| project-management | 23 |
| email-marketing | 18 |
| customer-service | 11 |

---

## Priority gaps (affiliate + incomplete editorial)

Products with a **live affiliate link** but missing approved review/assessment and/or research enrichment:

_None — all affiliate products have reviews._

## Missing reviews (assessment + review not both approved)

_None._

## Partner links without configured URL

In `partner-links.ts` but `affiliateUrl: null` and not marked pending/declined:

_None._


## Partner links pending dashboard URL

Registry rows awaiting a real PartnerStack/Impact link (`affiliateUrlState: pending`). Wire via `npm run affiliate:set -- <slug> --url <https://...> --default` then set `affiliateUrl` in partner-links.

`freshcaller`, `freshchat`, `freshdesk`, `freshservice`, `freshteam`, `freshmarketer`, `livestorm`, `uniqode`
`motion`, `rocketreach`


## Partner links declined / inactive

`instantly`


## Onboarding manifest: blocked

_None._

## Onboarding manifest: review-required

0 products. Full list:

_None._


## Products with live affiliate (90)

`adcreative-ai`, `ai-intelekt`, `aira`, `elevenlabs`, `emergent`, `gamma`, `mindstudio`, `quillbot`
`rank-prompt`, `wegic`, `writesonic`, `aircall`, `callhippo`, `fastmail`, `krispcall`, `sanebox`
`wati`, `zenzap`, `capsule`, `close`, `folk`, `freshsales`, `hubspot`, `keap`
`pipedrive`, `salesflare`, `nicejob`, `shore`, `tidio`, `alidrop`, `flippa`, `printify`
`sellfy`, `sendcloud`, `shipbob`, `shopify`, `spocket`, `ueni`, `activecampaign`, `aweber`
`bouncer`, `campaign-monitor`, `getresponse`, `inboxally`, `kit`, `bolt-for-business`, `breezy-hr`, `carepatron`
`connecteam`, `dext`, `flexiquiz`, `jibble`, `navan`, `trainual`, `bright-data`, `plesk`
`thordata`, `accelerated-growth-studio`, `birch`, `brand24`, `databox`, `diginius`, `evolve`, `kartra`
`leadpages`, `learnworlds`, `lucrovox`, `socialbee`, `switcher-studio`, `webinarjam-everwebinar`, `whatconverts`, `zypper`
`clickup`, `contractor-foreman`, `foxit`, `getscreen-me`, `hive`, `monday`, `mrpeasy`, `office-timeline`
`vektoros`, `webcatalog`, `amplemarket`, `apollo`, `bookyourdata`, `closely`, `kixie`, `lusha`
`reply`, `snov`


## Partner link slugs without software seed

`canvas-score`, `freshworks`


## Missing 5-kind product guide pack

No output from `buildProductGuidePackForSlug` and no product-specific guides in registry. Customer-service category has no pack builder yet.

`freshchat`, `freshdesk`, `freshservice`, `gorgias`, `help-scout`, `livechat`, `nicejob`, `shore`
`tidio`, `zendesk-suite`, `zoho-desk`


## Zero guide mentions (product guides + educational)

_None._


## Not best-page eligible

_All seed products appear on a category best-page landscape or recommendation list._

_None._


## No onboarding manifest

_All seed products have an onboarding manifest._

## Products without live affiliate

219 products — editorial catalogue only, no partner tracking URL:

`adobe-firefly`, `chatgpt`, `claude`, `cursor`, `fireflies`, `gemini`, `github-copilot`, `microsoft-copilot`
`midjourney`, `n8n`, `otter-ai`, `perplexity`, `runway`, `synthesia`, `zapier`, `eightx8`
`webex`, `dialpad`, `five9`, `freshcaller`, `genesys`, `goto-connect`, `grasshopper`, `intercom`
`manychat`, `microsoft-teams`, `nextiva`, `ooma`, `openphone`, `respond-io`, `ringcentral`, `slack`
`talkdesk`, `twilio`, `vonage`, `zoom`, `act`, `affinity`, `agile-crm`, `apptivo`
`attio`, `bitrix24`, `cloze`, `copper`, `creatio`, `dynamics-365`, `insightly`, `mailchimp`
`monday-sales-crm`, `nimble`, `nutshell`, `oracle-cx`, `netsuite`, `siebel`, `pega`, `pipelinepro`
`podio`, `salesforce`, `pardot`, `sap`, `streak`, `sugarcrm`, `wealthbox`, `zendesk`
`zoho-crm`, `freshchat`, `freshdesk`, `freshservice`, `gorgias`, `help-scout`, `livechat`, `zendesk-suite`
`zoho-desk`, `bigcommerce`, `commercetools`, `ecwid`, `lightspeed-retail`, `magento`, `medusa`, `opencart`
`prestashop`, `printful`, `saleor`, `salesforce-commerce-cloud`, `shopware`, `square-online`, `squarespace`, `tiendanube`
`vtex`, `webflow`, `wix`, `woocommerce`, `beehiiv`, `brevo`, `constant-contact`, `customer-io`
`drip`, `flodesk`, `klaviyo`, `mailerlite`, `mailjet`, `moosend`, `omnisend`, `7shifts`
`adp-workforce-now`, `ashby`, `bamboohr`, `dayforce`, `deputy`, `freshteam`, `greenhouse`, `gusto`
`hibob`, `homebase`, `lever`, `oracle-hcm`, `paycor`, `paylocity`, `personio`, `rippling`
`ukg-pro`, `when-i-work`, `workable`, `workday`, `apify`, `appdynamics`, `azure-devops`, `bitbucket`
`bmc-helix`, `buildkite`, `chronosphere`, `circleci`, `cloudways`, `coralogix`, `cpanel`, `datadog`
`smartproxy`, `directadmin`, `dynatrace`, `elastic-observability`, `firehydrant`, `fly-io`, `github`, `gitlab`
`grafana-cloud`, `haloitsm`, `heroku`, `honeycomb`, `incident-io`, `iproyal`, `ivanti`, `jira-service-management`
`kinsta`, `manageengine-servicedesk-plus`, `new-relic`, `oxylabs`, `pagerduty`, `railway`, `render`, `rootly`
`scraperapi`, `sentry`, `servicenow`, `siteground`, `squadcast`, `splunk`, `sysaid`, `topdesk`
`wp-engine`, `zyte`, `marketo`, `agorapulse`, `brandwatch`, `braze`, `buffer`, `clickfunnels`
`freshmarketer`, `hootsuite`, `iterable`, `later`, `livestorm`, `meltwater`, `sprout-social`, `uniqode`
`airtable`, `asana`, `basecamp`, `jira`, `linear`, `microsoft-project`, `motion`, `notion`
`servicem8`, `smartsheet`, `todoist`, `trello`, `wrike`, `sixsense`, `adapt-io`, `bombora`
`clay`, `clearbit`, `cognism`, `demandbase`, `gong`, `hunter`, `instantly`, `kaspr`
`leadiq`, `lemlist`, `linkedin-sales-navigator`, `ocean`, `outreach`, `rocketreach`, `salesloft`, `seamless-ai`
`smartlead`, `uplead`, `zoominfo`


## Coverage matrix (affiliate inventory SOFTWARE bucket)

Run `npm run catalogue:coverage` for the live table. Snapshot:

| Dimension | Affiliate SOFTWARE (94) | All seed (308) |
| --- | ---: | ---: |
| Alternatives page | ✓ | 308/308 |
| Comparisons | ✓ | 308/308 |
| Pricing snapshot | ✓ | 308/308 |
| Approved review | 2 gaps | 309/309 |
| 5-kind guide pack | partial | 298/309 |

## Recommended next actions

1. **Editorial**: Run review workflow for products still missing assessment/review JSON (if any remain after scheduled launches).
2. **Partner URLs**: See [EDITORIAL-AFFILIATE-PROGRAM-GUIDE-LATEST.md](./EDITORIAL-AFFILIATE-PROGRAM-GUIDE-LATEST.md) for where to apply. Paste PartnerStack/Impact links for pending registry rows (`affiliate:set` + partner-links import). Instantly is declined.
3. **Onboarding**: Run `npm run onboard:manifest-reconcile` after research/editorial catch-up; `npm run onboard:manifest-backfill` for new seed rows without manifests.
4. **Guides**: CS short guides for `livechat`, `zoho-desk`, `nicejob`, `shore` are in `guides-product-cs.ts` (scheduled 25 Aug 2026). Remaining CS gap: 5-kind pack builder or extend guides for other CS primaries.
5. **Catalogue CLI**: Fix catalogue alias map if `npm run catalogue:status` errors; use `npm run catalogue:commercial` and `catalogue:research-backlog` for batch planning.

## Related commands

| Command | Purpose |
| --- | --- |
| `npm run catalogue:coverage` | Per-affiliate-product review/pricing/alt/comp/best matrix |
| `npm run catalogue:commercial` | Commercial onboarding priority |
| `npm run catalogue:research-backlog` | Research enrichment gaps |
| `npm run audit:product -- <slug>` | Single-product editorial QA |
| `npm run audit:site` | Site-wide audit |
| `npm run catalogue:affiliate-guide` | Where to apply for editorial-only products (219) |
| `npx tsx scripts/generate-product-gap-audit.ts` | Regenerate this document |
