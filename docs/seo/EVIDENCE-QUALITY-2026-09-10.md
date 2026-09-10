# Evidence quality upgrade

**Wave:** evidence-quality-2026-09-10  
**Generated:** 2026-09-10T20:17:25.727Z  
**Version:** 1.0.0  

Uses existing research sources + live vendor plan confirmation.
Does **not** fabricate hands-on testing or ProductTestSession records.

## Summary

| Metric | Value |
| --- | ---: |
| Priority products packed | 3 |
| Live pricing checks | 3 |
| Vendor plan confirmations | 0 |
| Promoted RESEARCHED → DATA_VERIFIED | 0 |
| Already DATA_VERIFIED | 0 |
| Still RESEARCHED (in wave) | 3 |
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
| manychat | http_403 |
| cpanel | plan_hit_ratio_below_0.75 |
| turbotic | plan_hit_ratio_below_0.75 |

## Hands-on testing

HANDS_ON is **0 / NOT_CURRENT_SCOPE** for the current remediation phase.
Do not block DATA_VERIFIED promotion or page improvement on missing human tests.
Do not create ProductTestSessions or testing tasks in this wave.
Public copy must not claim “we tested”, “our testing found”, “hands-on”, or “we used the product” unless a genuine completed session exists.

Future enhancement only — ranked candidates (not a current queue):

| Rank | Product | Priority | Comps | GSC opp | Impressions | Evidence |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [HubSpot](/software/hubspot/) (`hubspot`) | 268.5 | 48 | 53 | 2880 | data_verified |
| 2 | [folk](/software/folk/) (`folk`) | 253.87 | 36 | 57 | 484 | data_verified |
| 3 | [Freshsales](/software/freshsales/) (`freshsales`) | 252.67 | 36 | 52 | 1199 | data_verified |
| 4 | [Close](/software/close/) (`close`) | 251.68 | 37 | 52 | 881 | data_verified |
| 5 | [Keap](/software/keap/) (`keap`) | 251.18 | 36 | 48 | 2295 | data_verified |
| 6 | [Capsule](/software/capsule/) (`capsule`) | 251.14 | 36 | 50 | 1482 | data_verified |
| 7 | [Fastmail](/software/fastmail/) (`fastmail`) | 247.76 | 22 | 67 | 2275 | data_verified |
| 8 | [Insightly](/software/insightly/) (`insightly`) | 246.4 | 36 | 46 | 2837 | researched |
| 9 | [Oracle NetSuite CRM](/software/netsuite/) (`netsuite`) | 242.21 | 36 | 51 | 508 | researched |
| 10 | [Pipedrive](/software/pipedrive/) (`pipedrive`) | 240.64 | 36 | 48 | 503 | data_verified |

Future ranked list only: `docs/editorial/PRODUCT-TESTING-QUEUE.md` — not a current operating queue.

## Evidence / schema QA

- Reconciliation accepted DATA_VERIFIED stamps: 240
- Reconciliation rejected: 75
- Source coverage: 76.2%
- No AggregateRating / fabricated Review schema in this pass — trust uses editorial timestamps only.
- Hands-on tested remains 0 / NOT_CURRENT_SCOPE for the current remediation phase — not a promotion or growth gate.

_No banned “We tested / Our experience / During testing” hits on research-only surfaces._

## Artifacts

- Packs: `data/seo/evidence-packs/*.json`
- Report JSON: `data/seo/evidence-quality-report.json`
- Reconciliation: `docs/editorial/DATA-VERIFIED-RECONCILIATION.md` (refresh via `npm run seo:growth-dashboard`)

