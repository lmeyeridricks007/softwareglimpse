# Editorial catalogue — where to get affiliate programmes

_Generated 2026-08-23. Regenerate: `npm run catalogue:affiliate-guide`_

> **Related:** [PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md](./PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md) · Deep research (Aug 2026): [affiliate-program-gap-research-2026-08-19.md](../reports/affiliate-program-gap-research-2026-08-19.md)

**Scope:** **219** seed products with **no live affiliate** (`affiliate.enabled` + tracking URL on the software row). This doc tells you **where to apply** — it does not invent PartnerStack links. After approval, wire URLs via `npm run affiliate:set -- <slug> --url <https://...> --default` and `partner-links.ts`.

**Rules:** Affiliate economics never change Finder / Best / comparison rankings. Confirm rates in the vendor dashboard after approval.

## Snapshot

| Tier | Count | Action |
| --- | ---: | --- |
| Apply first — public programme confirmed | 8 | Apply on official URLs below |
| Approved/pending — paste dashboard URL | 12 | Log into PartnerStack/Impact; paste product homepage link |
| Reuse existing live programme | 1 | Extend existing programme row |
| Check & apply — programme may exist | 133 | Verify programme exists, then apply |
| Partner/reseller only — no review-site CPA | 56 | Official CTA only unless partner contract |
| No public publisher programme | 8 | Keep official site CTA |
| Declined or inactive | 1 | Do not re-apply without vendor OK |

---

## Apply first (highest overlap with ranked content)

| Product | Category | Apply | Network | Pays (public — confirm in dashboard) |
| --- | --- | --- | --- | --- |
| `zendesk` | crm | [Apply](https://www.zendesk.com/programs/affiliate-program/) | PartnerStack | 15% of first-year sales |
| `zendesk-suite` | customer-service | [Apply](https://www.zendesk.com/programs/affiliate-program/) | PartnerStack | 15% of first-year sales |
| `printful` | ecommerce | [Apply](https://www.printful.com/affiliates) | — | 10% of orders × 12 months |
| `webflow` | ecommerce | [Apply](https://webflow.com/solutions/affiliates) | PartnerStack | First-subscription commission up to 12 months (rate in dashboard) |
| `beehiiv` | email-marketing | [Apply](https://www.beehiiv.com/partners) | — | 50% referred revenue × 12 months (up to 60% at Gold) |
| `mailerlite` | email-marketing | [Apply](https://www.mailerlite.com/affiliate) | — | 30% recurring for customer lifetime |
| `hunter` | sales-intelligence | [Apply](https://hunter.io/affiliate-program) | — | 30% recurring × 12 months |
| `lemlist` | sales-intelligence | [Apply](https://www.lemlist.com/service-partners) | PartnerStack | 25% of plan within 30-day click window |

## Programme families (one apply → multiple slugs)

### freshworks

- **Apply:** [https://www.freshworks.com/partners/affiliate-partner-individual/](https://www.freshworks.com/partners/affiliate-partner-individual/)
- **Slugs:** `freshsales`, `freshdesk`, `freshservice`, `freshchat`, `freshcaller`, `freshmarketer`, `freshteam`
- **Pays:** 20% first-year recurring default; volume tiers to 25%+
- **Notes:** One application unlocks all Freshworks SKUs. Paste each product homepage link from PartnerStack after approval (freshsales URL is wired — copy pattern per SKU).

### zoho

- **Apply:** [https://www.zoho.com/affiliate/](https://www.zoho.com/affiliate/)
- **Slugs:** `zoho-crm`, `zoho-desk`
- **Pays:** 15–20% of revenue for 12 months (tiered); 90-day cookie
- **Notes:** Cannot also be a Zoho consulting/reseller partner. Commission on first Zoho product in account only.

## Pending dashboard URL (in `partner-links.ts`, URL still null)

Inventory/programme active or pending — copy the **homepage** tracking link from your affiliate dashboard, then:

```bash
npm run affiliate:set -- <slug> --url "https://..." --default
```

| Product | Category | Hint |
| --- | --- | --- |
| `freshcaller` | business-communications | Impact / Freshworks · pending |
| `zoho-crm` | crm | [Partners](https://www.zoho.com/affiliate/) · Zoho in-house · Cannot also be a Zoho consulting/reseller partner. Commission on first Zoho product in account only. |
| `freshchat` | customer-service | Impact / Freshworks · pending |
| `freshdesk` | customer-service | Impact / Freshworks · pending |
| `freshservice` | customer-service | Impact / Freshworks · pending |
| `zoho-desk` | customer-service | [Partners](https://www.zoho.com/affiliate/) · Zoho in-house · Cannot also be a Zoho consulting/reseller partner. Commission on first Zoho product in account only. |
| `freshteam` | hr | Impact / Freshworks · pending |
| `freshmarketer` | marketing | Impact / Freshworks · pending |
| `livestorm` | marketing | [Partners](https://livestorm.co/partners) · pending · Active inventory — paste PartnerStack homepage link after login |
| `uniqode` | marketing | [Partners](https://www.uniqode.com/partners) · pending · Active inventory — paste PartnerStack link after login |
| `motion` | project-management | PartnerStack · pending · Programme pending in programmes.json — paste URL via affiliate:set |
| `rocketreach` | sales-intelligence | [Partners](https://rocketreach.co/partners) · pending · Active inventory — confirm affiliate vs partner track |

## Reuse live programme (do not re-apply)

- **`monday-sales-crm`** — Do not re-apply. Add slug to existing monday.com programme in programmes.json

## Declined / inactive

- **`instantly`** — Application declined Aug 2026 — official site CTA only unless re-approved ([programme page](https://instantly.ai/affiliate))

## Check & apply (programme may exist — verify on vendor site)

_133 products. Search `{vendor} affiliate` or check PartnerStack marketplace._

| Product | Category | Apply / notes |
| --- | --- | --- |
| `fireflies` | ai | [Apply](https://fireflies.ai/affiliate) |
| `n8n` | ai | [Apply](https://n8n.io/affiliate/) |
| `otter-ai` | ai | [Apply](https://otter.ai/affiliate) |
| `synthesia` | ai | [Apply](https://www.synthesia.io/affiliate-program) |
| `zapier` | ai | [Apply](https://zapier.com/l/partner-program) |
| `grasshopper` | business-communications | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `manychat` | business-communications | [Apply](https://manychat.com/affiliate) |
| `openphone` | business-communications | [Apply](https://www.openphone.com/affiliates) |
| `respond-io` | business-communications | [Apply](https://respond.io/partners) |
| `act` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `affinity` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `agile-crm` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `apptivo` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `attio` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `bitrix24` | crm | [Apply](https://www.bitrix24.com/partners/) |
| `cloze` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `copper` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `creatio` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `insightly` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `mailchimp` | crm | [Apply](https://mailchimp.com/help/earn-commission/) — 25% new connected paid referrals (Mailchimp & Co agency model) |
| `nimble` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `nutshell` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `pipelinepro` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `podio` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `streak` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `sugarcrm` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `wealthbox` | crm | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `gorgias` | customer-service | [Apply](https://www.gorgias.com/partners) |
| `help-scout` | customer-service | [Apply](https://www.helpscout.com/partners/) |
| `livechat` | customer-service | [Apply](https://www.livechat.com/affiliates/) |
| `bigcommerce` | ecommerce | [Apply](https://www.bigcommerce.com/partners/) |
| `commercetools` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `ecwid` | ecommerce | [Apply](https://www.ecwid.com/affiliates) |
| `lightspeed-retail` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `magento` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `medusa` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `opencart` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `prestashop` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `saleor` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `salesforce-commerce-cloud` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `shopware` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `square-online` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `squarespace` | ecommerce | [Apply](https://www.squarespace.com/affiliates) |
| `tiendanube` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `vtex` | ecommerce | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `wix` | ecommerce | [Apply](https://www.wix.com/affiliates) |
| `woocommerce` | ecommerce | [Apply](https://woocommerce.com/affiliates/) |
| `brevo` | email-marketing | [Apply](https://www.brevo.com/partners/) |
| `constant-contact` | email-marketing | [Apply](https://www.constantcontact.com/affiliates) |
| `customer-io` | email-marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `drip` | email-marketing | [Apply](https://www.drip.com/partners) |
| `flodesk` | email-marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `klaviyo` | email-marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `mailjet` | email-marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `moosend` | email-marketing | [Apply](https://moosend.com/affiliates/) |
| `omnisend` | email-marketing | [Apply](https://www.omnisend.com/partners/) — ~20% recurring up to 24 months (confirm on Impact) |
| `7shifts` | hr | [Apply](https://www.7shifts.com/affiliates/) |
| `deputy` | hr | [Apply](https://www.deputy.com/partners/affiliate) |
| `gusto` | hr | [Apply](https://gusto.com/partners) |
| `homebase` | hr | [Apply](https://joinhomebase.com/affiliates/) |
| `when-i-work` | hr | [Apply](https://wheniwork.com/affiliates/) |
| `workable` | hr | [Apply](https://www.workable.com/affiliates) |
| `apify` | it-development | Search official site for “apify affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `appdynamics` | it-development | Search official site for “appdynamics affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `azure-devops` | it-development | Search official site for “azure-devops affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `bitbucket` | it-development | Search official site for “bitbucket affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `bmc-helix` | it-development | Search official site for “bmc-helix affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `buildkite` | it-development | Search official site for “buildkite affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `chronosphere` | it-development | Search official site for “chronosphere affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `circleci` | it-development | Search official site for “circleci affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `cloudways` | it-development | [Apply](https://www.cloudways.com/en/affiliate.php) |
| `coralogix` | it-development | Search official site for “coralogix affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `cpanel` | it-development | Search official site for “cpanel affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `directadmin` | it-development | Search official site for “directadmin affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `dynatrace` | it-development | Search official site for “dynatrace affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `elastic-observability` | it-development | Search official site for “elastic-observability affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `firehydrant` | it-development | Search official site for “firehydrant affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `fly-io` | it-development | Search official site for “fly-io affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `github` | it-development | Search official site for “github affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `gitlab` | it-development | Search official site for “gitlab affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `grafana-cloud` | it-development | Search official site for “grafana-cloud affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `haloitsm` | it-development | Search official site for “haloitsm affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `heroku` | it-development | Search official site for “heroku affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `honeycomb` | it-development | Search official site for “honeycomb affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `incident-io` | it-development | Search official site for “incident-io affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `iproyal` | it-development | Search official site for “iproyal affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `ivanti` | it-development | Search official site for “ivanti affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `jira-service-management` | it-development | Search official site for “jira-service-management affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `kinsta` | it-development | [Apply](https://kinsta.com/affiliates/) |
| `manageengine-servicedesk-plus` | it-development | Search official site for “manageengine-servicedesk-plus affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `new-relic` | it-development | Search official site for “new-relic affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `oxylabs` | it-development | Search official site for “oxylabs affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `pagerduty` | it-development | Search official site for “pagerduty affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `railway` | it-development | Search official site for “railway affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `render` | it-development | Search official site for “render affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `rootly` | it-development | Search official site for “rootly affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `scraperapi` | it-development | Search official site for “scraperapi affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `sentry` | it-development | [Apply](https://sentry.io/for/partners/) |
| `siteground` | it-development | [Apply](https://www.siteground.com/affiliates) |
| `smartproxy` | it-development | Search official site for “smartproxy affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `splunk` | it-development | Search official site for “splunk affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `squadcast` | it-development | Search official site for “squadcast affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `sysaid` | it-development | Search official site for “sysaid affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `topdesk` | it-development | Search official site for “topdesk affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `wp-engine` | it-development | [Apply](https://wpengine.com/partners/) |
| `zyte` | it-development | Search official site for “zyte affiliate” or PartnerStack — hosting/proxy vendors sometimes pay |
| `agorapulse` | marketing | [Apply](https://www.agorapulse.com/affiliates/) |
| `brandwatch` | marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `braze` | marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `buffer` | marketing | [Apply](https://buffer.com/affiliates) |
| `clickfunnels` | marketing | [Apply](https://www.clickfunnels.com/affiliates) — ~30–40% recurring (confirm on apply) |
| `hootsuite` | marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `iterable` | marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `later` | marketing | [Apply](https://later.com/affiliate-program/) |
| `marketo` | marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `meltwater` | marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `sprout-social` | marketing | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `airtable` | project-management | [Apply](https://airtable.com/affiliates) |
| `asana` | project-management | [Apply](https://asana.com/partners/affiliates) |
| `basecamp` | project-management | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `jira` | project-management | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `linear` | project-management | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `microsoft-project` | project-management | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `notion` | project-management | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `servicem8` | project-management | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `smartsheet` | project-management | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `todoist` | project-management | [Apply](https://todoist.com/affiliates) |
| `trello` | project-management | Search vendor site for partners/affiliate — confirm before inventing URLs |
| `wrike` | project-management | [Apply](https://www.wrike.com/affiliates/) |
| `adapt-io` | sales-intelligence | [Apply](https://www.adapt.io/affiliate-program) |
| `kaspr` | sales-intelligence | [Apply](https://www.kaspr.io/affiliate) |
| `smartlead` | sales-intelligence | [Apply](https://www.smartlead.ai/affiliate) |
| `uplead` | sales-intelligence | [Apply](https://www.uplead.com/affiliates/) |

## Partner / reseller only (no review-site CPA)

_56 products — keep official CTAs on /software/ pages unless you have a partner contract._

| Product | Category | Partner path |
| --- | --- | --- |
| `adobe-firefly` | ai | [Partner portal](https://partners.adobe.com/) |
| `microsoft-copilot` | ai | [Partner portal](https://partner.microsoft.com/) |
| `dialpad` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `eightx8` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `five9` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `genesys` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `goto-connect` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `intercom` | business-communications | [Partner portal](https://www.intercom.com/partners) |
| `microsoft-teams` | business-communications | [Partner portal](https://partner.microsoft.com/) |
| `nextiva` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `ooma` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `ringcentral` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `slack` | business-communications | [Partner portal](https://slack.com/partners) |
| `talkdesk` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `twilio` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `vonage` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `webex` | business-communications | CCaaS/CPaaS — agency or reseller partner, not review-site CPA |
| `zoom` | business-communications | [Partner portal](https://partner.zoom.us/) |
| `dynamics-365` | crm | [Partner portal](https://partner.microsoft.com/) |
| `netsuite` | crm | [Partner portal](https://www.oracle.com/partners/) |
| `oracle-cx` | crm | [Partner portal](https://www.oracle.com/partners/) |
| `pardot` | crm | [Partner portal](https://www.salesforce.com/partners/become-a-partner/) |
| `pega` | crm | [Partner portal](https://www.pega.com/partners) |
| `salesforce` | crm | [Partner portal](https://www.salesforce.com/partners/become-a-partner/) |
| `sap` | crm | [Partner portal](https://www.sap.com/partners.html) |
| `siebel` | crm | [Partner portal](https://www.oracle.com/partners/) |
| `adp-workforce-now` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `ashby` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `bamboohr` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `dayforce` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `greenhouse` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `hibob` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `lever` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `oracle-hcm` | hr | [Partner portal](https://www.oracle.com/partners/) |
| `paycor` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `paylocity` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `personio` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `rippling` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `ukg-pro` | hr | Payroll/HCM/ATS — ADP, Workday, Greenhouse class; confirm vendor affiliate page before applying |
| `workday` | hr | [Partner portal](https://www.workday.com/en-us/company/partners.html) |
| `datadog` | it-development | [Partner portal](https://www.datadoghq.com/partner/network/) |
| `servicenow` | it-development | [Partner portal](https://www.servicenow.com/partners.html) |
| `bombora` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `clay` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `clearbit` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `cognism` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `demandbase` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `gong` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `leadiq` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `linkedin-sales-navigator` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `ocean` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `outreach` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `salesloft` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `seamless-ai` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `sixsense` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |
| `zoominfo` | sales-intelligence | Enterprise SI / ABM — ZoomInfo, 6sense, Gong, Outreach, etc. use partner networks, not publisher CPA |

## No public publisher programme

`chatgpt`, `claude`, `cursor`, `gemini`, `github-copilot`, `midjourney`
`perplexity`, `runway`


## Full slug index (all editorial-only rows)

`adobe-firefly`, `chatgpt`, `claude`, `cursor`, `fireflies`, `gemini`
`github-copilot`, `microsoft-copilot`, `midjourney`, `n8n`, `otter-ai`, `perplexity`
`runway`, `synthesia`, `zapier`, `dialpad`, `eightx8`, `five9`
`freshcaller`, `genesys`, `goto-connect`, `grasshopper`, `intercom`, `manychat`
`microsoft-teams`, `nextiva`, `ooma`, `openphone`, `respond-io`, `ringcentral`
`slack`, `talkdesk`, `twilio`, `vonage`, `webex`, `zoom`
`act`, `affinity`, `agile-crm`, `apptivo`, `attio`, `bitrix24`
`cloze`, `copper`, `creatio`, `dynamics-365`, `insightly`, `mailchimp`
`monday-sales-crm`, `netsuite`, `nimble`, `nutshell`, `oracle-cx`, `pardot`
`pega`, `pipelinepro`, `podio`, `salesforce`, `sap`, `siebel`
`streak`, `sugarcrm`, `wealthbox`, `zendesk`, `zoho-crm`, `freshchat`
`freshdesk`, `freshservice`, `gorgias`, `help-scout`, `livechat`, `zendesk-suite`
`zoho-desk`, `bigcommerce`, `commercetools`, `ecwid`, `lightspeed-retail`, `magento`
`medusa`, `opencart`, `prestashop`, `printful`, `saleor`, `salesforce-commerce-cloud`
`shopware`, `square-online`, `squarespace`, `tiendanube`, `vtex`, `webflow`
`wix`, `woocommerce`, `beehiiv`, `brevo`, `constant-contact`, `customer-io`
`drip`, `flodesk`, `klaviyo`, `mailerlite`, `mailjet`, `moosend`
`omnisend`, `7shifts`, `adp-workforce-now`, `ashby`, `bamboohr`, `dayforce`
`deputy`, `freshteam`, `greenhouse`, `gusto`, `hibob`, `homebase`
`lever`, `oracle-hcm`, `paycor`, `paylocity`, `personio`, `rippling`
`ukg-pro`, `when-i-work`, `workable`, `workday`, `apify`, `appdynamics`
`azure-devops`, `bitbucket`, `bmc-helix`, `buildkite`, `chronosphere`, `circleci`
`cloudways`, `coralogix`, `cpanel`, `datadog`, `directadmin`, `dynatrace`
`elastic-observability`, `firehydrant`, `fly-io`, `github`, `gitlab`, `grafana-cloud`
`haloitsm`, `heroku`, `honeycomb`, `incident-io`, `iproyal`, `ivanti`
`jira-service-management`, `kinsta`, `manageengine-servicedesk-plus`, `new-relic`, `oxylabs`, `pagerduty`
`railway`, `render`, `rootly`, `scraperapi`, `sentry`, `servicenow`
`siteground`, `smartproxy`, `splunk`, `squadcast`, `sysaid`, `topdesk`
`wp-engine`, `zyte`, `agorapulse`, `brandwatch`, `braze`, `buffer`
`clickfunnels`, `freshmarketer`, `hootsuite`, `iterable`, `later`, `livestorm`
`marketo`, `meltwater`, `sprout-social`, `uniqode`, `airtable`, `asana`
`basecamp`, `jira`, `linear`, `microsoft-project`, `motion`, `notion`
`servicem8`, `smartsheet`, `todoist`, `trello`, `wrike`, `adapt-io`
`bombora`, `clay`, `clearbit`, `cognism`, `demandbase`, `gong`
`hunter`, `instantly`, `kaspr`, `leadiq`, `lemlist`, `linkedin-sales-navigator`
`ocean`, `outreach`, `rocketreach`, `salesloft`, `seamless-ai`, `sixsense`
`smartlead`, `uplead`, `zoominfo`


## After approval — wire in repo

1. Copy the vendor-issued **homepage** or trial tracking URL (never guess PartnerStack paths).
2. `npm run affiliate:set -- <slug> --url "https://..." --default`
3. Update `src/data/affiliates/source/partner-links.ts` (or import CSV).
4. `npm run affiliate:validate`
5. Enable affiliate on software seed only after destination is validated.

## Recommended application order

1. **Pending dashboard URLs** — Freshworks SKUs, Livestorm, Uniqode, Motion, RocketReach (fastest win).
2. **HubSpot, Zoho, Zendesk, Shopify, Webflow** — high-intent category pages.
3. **Email:** Beehiiv, MailerLite, Omnisend (check), Brevo.
4. **SI:** Hunter, Snov, Lemlist, Smartlead (check).
5. **Ecommerce:** Printful, Printify, Wix, WooCommerce.
6. Skip **Salesforce, Microsoft, Oracle, SAP, Workday, ServiceNow, Datadog** unless a partner manager offers a referral mechanic.
