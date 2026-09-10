# Evidence quality upgrade

**Wave:** evidence-quality-2026-09-07  
**Generated:** 2026-09-07T22:40:56.011Z  
**Version:** 1.0.0  

Uses existing research sources + live vendor plan confirmation.
Does **not** fabricate hands-on testing or ProductTestSession records.

## Summary

| Metric | Value |
| --- | ---: |
| Priority products packed | 40 |
| Live pricing checks | 40 |
| Vendor plan confirmations | 29 |
| Promoted RESEARCHED → DATA_VERIFIED | 29 |
| Already DATA_VERIFIED | 0 |
| Still RESEARCHED (in wave) | 11 |
| Banned hands-on language hits | 0 |
| Evidence/schema QA | PASS |

## Propagation

Verified stamps live on enrichment `pricing.verifiedAt` + `sourceIds`.
Software / review / pricing / compare / guide / alternatives / best surfaces
read via `resolvePricingVerifiedAtForEvidence` / `buildEditorialTrustMetadata`
— no duplicated page-level price copies written.

Public labels: **Research-based review** · **Data verified** · **Hands-on tested**.

## Promoted to DATA_VERIFIED

| Product | Source | Plans confirmed | Stamp | Dependents |
| --- | --- | --- | --- | ---: |
| [Capsule](/software/capsule/) | https://capsulecrm.com/pricing/ | 5/5 | `2026-09-07T22:40:22.766Z` | 46 |
| [Keap](/software/keap/) | https://keap.com/pricing | 3/3 | `2026-09-07T22:40:24.416Z` | 45 |
| [Closely](/software/closely/) | https://closelyhq.com/pricing | 4/4 | `2026-09-07T22:40:25.949Z` | 41 |
| [GetResponse](/software/getresponse/) | https://www.getresponse.com/pricing | 5/5 | `2026-09-07T22:40:27.936Z` | 35 |
| [Nimble](/software/nimble/) | https://www.nimble.com/pricing/ | 1/1 | `2026-09-07T22:40:30.014Z` | 45 |
| [ActiveCampaign](/software/activecampaign/) | https://www.activecampaign.com/pricing | 4/4 | `2026-09-07T22:40:32.347Z` | 42 |
| [Salesforce](/software/salesforce/) | https://www.salesforce.com/crm/pricing/ | 4/5 | `2026-09-07T22:40:41.227Z` | 47 |
| [Freshsales](/software/freshsales/) | https://www.freshworks.com/crm/pricing/ | 3/3 | `2026-09-07T22:40:42.436Z` | 46 |
| [Dynamics 365](/software/dynamics-365/) | https://www.microsoft.com/en-us/dynamics-365/products/sales/pricing | 4/4 | `2026-09-07T22:40:44.144Z` | 45 |
| [Close](/software/close/) | https://www.close.com/pricing | 4/4 | `2026-09-07T22:40:45.585Z` | 47 |
| [Fastmail](/software/fastmail/) | https://www.fastmail.com/pricing/ | 4/4 | `2026-09-07T22:40:46.934Z` | 33 |
| [Mailchimp](/software/mailchimp/) | https://mailchimp.com/pricing/marketing/ | 4/4 | `2026-09-07T22:40:48.194Z` | 64 |
| [SaneBox](/software/sanebox/) | https://www.sanebox.com/pricing | 3/3 | `2026-09-07T22:40:49.639Z` | 31 |
| [Kaspr](/software/kaspr/) | https://kaspr.io/pricing | 4/4 | `2026-09-07T22:40:52.096Z` | 36 |
| [Zendesk Sell](/software/zendesk/) | https://www.zendesk.com/sell/pricing/ | 4/4 | `2026-09-07T22:40:53.978Z` | 47 |
| [Lusha](/software/lusha/) | https://www.lusha.com/pricing/ | 5/5 | `2026-09-07T22:40:58.058Z` | 44 |
| [Diginius](/software/diginius/) | https://www.diginius.com/pricing | 1/1 | `2026-09-07T22:41:02.065Z` | 13 |
| [folk](/software/folk/) | https://www.folk.app/pricing | 4/4 | `2026-09-07T22:41:03.339Z` | 45 |
| [Navan](/software/navan/) | https://navan.com/pricing | 1/1 | `2026-09-07T22:41:04.616Z` | 15 |
| [NiceJob](/software/nicejob/) | https://get.nicejob.com/pricing | 3/3 | `2026-09-07T22:41:05.917Z` | 17 |
| [Wealthbox](/software/wealthbox/) | https://www.wealthbox.com/pricing/ | 4/4 | `2026-09-07T22:41:09.105Z` | 44 |
| [monday sales CRM](/software/monday-sales-crm/) | https://monday.com/pricing | 4/4 | `2026-09-07T22:41:11.578Z` | 47 |
| [Pipeline CRM](/software/pipelinepro/) | https://www.pipelinecrm.com/pricing/ | 3/3 | `2026-09-07T22:41:14.707Z` | 44 |
| [Copper](/software/copper/) | https://www.copper.com/pricing | 3/3 | `2026-09-07T22:41:16.205Z` | 46 |
| [Affinity](/software/affinity/) | https://www.affinity.co/pricing | 4/4 | `2026-09-07T22:41:20.103Z` | 48 |
| [KrispCall](/software/krispcall/) | https://krispcall.com/pricing/ | 3/3 | `2026-09-07T22:41:24.617Z` | 19 |
| [Salesflare](/software/salesflare/) | https://salesflare.com/pricing | 3/3 | `2026-09-07T22:41:25.924Z` | 46 |
| [Apollo.io](/software/apollo/) | https://www.apollo.io/pricing | 4/4 | `2026-09-07T22:41:27.237Z` | 45 |
| [Amplemarket](/software/amplemarket/) | https://www.amplemarket.com/pricing | 3/3 | `2026-09-07T22:41:28.552Z` | 44 |

## Live verify failures (not elevated)

| Product | Reason |
| --- | --- |
| hubspot | plan_hit_ratio_below_0.75 |
| insightly | http_403 |
| pipedrive | http_403 |
| netsuite | http_403 |
| agile-crm | http_403 |
| podio | plan_hit_ratio_below_0.75 |
| cloze | http_404 |
| pega | http_404 |
| apptivo | http_403 |
| bright-data | plan_hit_ratio_below_0.75 |
| thordata | plan_hit_ratio_below_0.75 |

## Top 10 products for genuine hands-on testing

Queue only — **do not simulate tests**. Open `/dev/product-testing/` with the testing secret.

| Rank | Product | Priority | Comps | GSC opp | Impressions | Evidence |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [HubSpot](/software/hubspot/) (`hubspot`) | 277.54 | 48 | 53 | 1340 | researched |
| 2 | [Capsule](/software/capsule/) (`capsule`) | 253.57 | 36 | 48 | 431 | researched |
| 3 | [Keap](/software/keap/) (`keap`) | 250.97 | 36 | 45 | 567 | researched |
| 4 | [Closely](/software/closely/) (`closely`) | 244.12 | 28 | 51 | 360 | researched |
| 5 | [GetResponse](/software/getresponse/) (`getresponse`) | 239.71 | 23 | 49 | 866 | researched |
| 6 | [Nimble](/software/nimble/) (`nimble`) | 237.1 | 36 | 50 | 302 | researched |
| 7 | [Insightly](/software/insightly/) (`insightly`) | 235.96 | 36 | 44 | 938 | researched |
| 8 | [ActiveCampaign](/software/activecampaign/) (`activecampaign`) | 234.49 | 24 | 44 | 1019 | researched |
| 9 | [Salesforce](/software/salesforce/) (`salesforce`) | 231.32 | 37 | 46 | 264 | researched |
| 10 | [Freshsales](/software/freshsales/) (`freshsales`) | 227.7 | 36 | 47 | 193 | researched |

Full queue: `docs/editorial/PRODUCT-TESTING-QUEUE.md` (`npm run testing:queue`).

## Evidence / schema QA

- Reconciliation accepted DATA_VERIFIED stamps: 29
- Reconciliation rejected: 286
- Source coverage: 9.2%
- No AggregateRating / fabricated Review schema in this pass — trust uses editorial timestamps only.
- Hands-on tested remains 0 until a completed ProductTestSession exists.

_No banned “We tested / Our experience / During testing” hits on research-only surfaces._

## Artifacts

- Packs: `data/seo/evidence-packs/*.json`
- Report JSON: `data/seo/evidence-quality-report.json`
- Reconciliation: `docs/editorial/DATA-VERIFIED-RECONCILIATION.md` (refresh via `npm run seo:growth-dashboard`)

