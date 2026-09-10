# Evidence quality upgrade

**Wave:** lane-a-gsc-improve-30-2026-09-09-evidence  
**Generated:** 2026-09-09T18:29:55.191Z  
**Version:** 1.0.0  

Uses existing research sources + live vendor plan confirmation.
Does **not** fabricate hands-on testing or ProductTestSession records.

## Summary

| Metric | Value |
| --- | ---: |
| Priority products packed | 27 |
| Live pricing checks | 4 |
| Vendor plan confirmations | 0 |
| Promoted RESEARCHED → DATA_VERIFIED | 0 |
| Already DATA_VERIFIED | 23 |
| Still RESEARCHED (in wave) | 4 |
| Banned hands-on language hits | 0 |
| Evidence/schema QA | PASS |

## Propagation

Verified stamps live on enrichment `pricing.verifiedAt` + `sourceIds`.
Software / review / pricing / compare / guide / alternatives / best surfaces
read via `resolvePricingVerifiedAtForEvidence` / `buildEditorialTrustMetadata`
— no duplicated page-level price copies written.

Public labels: **Research-based review** · **Data verified** · **Hands-on tested**.

## Promoted to DATA_VERIFIED

_None in this run._

## Live verify failures (not elevated)

| Product | Reason |
| --- | --- |
| podio | plan_hit_ratio_below_0.75 |
| insightly | http_403 |
| agile-crm | http_403 |
| siebel | http_403 |

## Top 10 products for genuine hands-on testing

Queue only — **do not simulate tests**. Open `/dev/product-testing/` with the testing secret.

| Rank | Product | Priority | Comps | GSC opp | Impressions | Evidence |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [HubSpot](/software/hubspot/) (`hubspot`) | 263.54 | 48 | 53 | 1340 | data_verified |
| 2 | [Capsule](/software/capsule/) (`capsule`) | 239.57 | 36 | 48 | 431 | data_verified |
| 3 | [Keap](/software/keap/) (`keap`) | 236.97 | 36 | 45 | 567 | data_verified |
| 4 | [Insightly](/software/insightly/) (`insightly`) | 235.96 | 36 | 44 | 938 | researched |
| 5 | [Closely](/software/closely/) (`closely`) | 230.12 | 28 | 51 | 360 | data_verified |
| 6 | [GetResponse](/software/getresponse/) (`getresponse`) | 225.71 | 23 | 49 | 866 | data_verified |
| 7 | [Nimble](/software/nimble/) (`nimble`) | 223.1 | 36 | 50 | 302 | data_verified |
| 8 | [ActiveCampaign](/software/activecampaign/) (`activecampaign`) | 220.49 | 24 | 44 | 1019 | data_verified |
| 9 | [Salesforce](/software/salesforce/) (`salesforce`) | 217.32 | 37 | 46 | 264 | data_verified |
| 10 | [Freshsales](/software/freshsales/) (`freshsales`) | 213.7 | 36 | 47 | 193 | data_verified |

Full queue: `docs/editorial/PRODUCT-TESTING-QUEUE.md` (`npm run testing:queue`).

## Evidence / schema QA

- Reconciliation accepted DATA_VERIFIED stamps: 164
- Reconciliation rejected: 151
- Source coverage: 52.1%
- No AggregateRating / fabricated Review schema in this pass — trust uses editorial timestamps only.
- Hands-on tested remains 0 until a completed ProductTestSession exists.

_No banned “We tested / Our experience / During testing” hits on research-only surfaces._

## Artifacts

- Packs: `data/seo/evidence-packs/*.json`
- Report JSON: `data/seo/evidence-quality-report.json`
- Reconciliation: `docs/editorial/DATA-VERIFIED-RECONCILIATION.md` (refresh via `npm run seo:growth-dashboard`)

