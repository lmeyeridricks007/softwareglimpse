# Migration Monitor

**Generated:** 2026-08-15T17:28:36.202Z
**Agent:** LegacyMigrationMonitorAgent v1.0.0
**Mode:** static
**Overall:** **ATTENTION**

> Post-launch health monitor for legacy redirects. **Does not modify redirects.**

## Summary

| Metric | Value |
| --- | ---: |
| Overall | ATTENTION |
| Redirects checked | 59 |
| Important URLs watched | 296 |
| NEW | 51 |
| OPEN | 24 |
| REGRESSED | 0 |
| RESOLVED | 0 |
| INTENTIONAL | 0 |
| P0 / P1 / P2 (active) | 0 / 25 / 50 |

## Checks

| Check | Status | Issues | Summary |
| --- | --- | ---: | --- |
| `redirect_health` | pass | 0 | Configured redirects look consistent with mapping |
| `target_status` | pass | 0 | All redirect targets validate against inventory |
| `chains_loops` | pass | 0 | No chains or loops detected |
| `unexpected_404` | warn | 24 | 24 active issue(s) |
| `canonical_regression` | pass | 0 | No canonical regressions detected |
| `sitemap_regression` | pass | 0 | Sitemap does not include redirect/noindex URLs |
| `internal_legacy` | pass | 0 | No internal links / repo hits to redirect sources |
| `important_urls` | warn | 72 | 72 active issue(s) |
| `gsc_signals` | warn | 51 | 51 active issue(s) |

## Important / high-priority active issues

| ID | State | Sev | Subject | Problem |
| --- | --- | --- | --- | --- |
| `MIG-404-8F7F` | OPEN | P1 | `/benefits-of-freshsales-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-E3ED` | OPEN | P1 | `/benefits-of-microsoft-dynamics-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-683B` | OPEN | P1 | `/benefits-of-zoho-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-DAD8` | OPEN | P1 | `/best-commercial-real-estate-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-C399` | OPEN | P1 | `/best-crm-for-coaches/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-AFB9` | OPEN | P1 | `/best-crm-for-facebook-leads/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-306A` | OPEN | P1 | `/best-crm-for-financial-advisors/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-9FA8` | OPEN | P1 | `/best-crm-for-hotels/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-D470` | OPEN | P1 | `/best-crm-for-linkedin/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-25AF` | OPEN | P1 | `/best-crm-for-real-estate-investors/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-B370` | OPEN | P1 | `/best-crm-for-small-legal-practices/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-3E63` | OPEN | P1 | `/best-crm-for-small-real-estate-business/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-967A` | OPEN | P1 | `/best-crm-for-web-designers/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-C8FC` | OPEN | P1 | `/best-crm-software-for-car-dealerships/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-3729` | OPEN | P1 | `/best-crm-software-for-construction/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-8CFE` | OPEN | P1 | `/best-crm-software-for-restaurants/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-EEF3` | OPEN | P1 | `/best-practices-crm-deal-flow-private-equity/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-DDA3` | OPEN | P1 | `/best-practices-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-720D` | OPEN | P1 | `/best-practices-for-ensuring-crm-security/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-B60F` | OPEN | P1 | `/category/guides/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-9421` | OPEN | P1 | `/category/software-comparison/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-7A28` | OPEN | P1 | `/crm-guides/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-3B85` | OPEN | P1 | `/what-is-crm-lead-management/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-86E6` | OPEN | P1 | `/what-is-crm-marketing/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-GSC-5C74` | NEW | P1 | `Not found (404)` | GSC coverage reports “Not found (404)” (57 pages) |
| `MIG-GSC-FE51` | NEW | P2 | `Page with redirect` | GSC coverage reports “Page with redirect” (37 pages) |
| `MIG-GSC-E831` | NEW | P2 | `/lusha-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-386D` | NEW | P2 | `/contact/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-9522` | NEW | P2 | `/best-crm-for-startups/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-F225` | NEW | P2 | `/activecampaign-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-F547` | NEW | P2 | `/insightly-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-899B` | NEW | P2 | `/getresponse-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-3ABE` | NEW | P2 | `/hubspot-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-64E6` | NEW | P2 | `/capsule-crm-review-2/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-36CB` | NEW | P2 | `/keap-crm-review-2/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-C4A2` | NEW | P2 | `/best-crm-for-freelancers/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-AEC7` | NEW | P2 | `/closely-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-24A8` | NEW | P2 | `/salesforce-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-FEC5` | NEW | P2 | `/best-crms/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-B362` | NEW | P2 | `/microsoft-dynamics-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-EB18` | NEW | P2 | `/salesforce-vs-pipedrive/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-7FE3` | NEW | P2 | `/freshsales-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-ACB6` | NEW | P2 | `/comparing-setup-pipedrive-vs-hubspot/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-2B3E` | NEW | P2 | `/salesforce-vs-insightly/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-A973` | NEW | P2 | `/close-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-5CC0` | NEW | P2 | `/salesforce-vs-sugar-crm/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-6D52` | NEW | P2 | `/hubspot-vs-insightly/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-A9D8` | NEW | P2 | `/infusionsoft-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-E0BD` | NEW | P2 | `/best-crm-for-field-sales/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-FAAE` | NEW | P2 | `/salesforce-vs-monday/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-CDE4` | NEW | P2 | `/pipedrive-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-11C0` | NEW | P2 | `/keap-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-F7D5` | NEW | P2 | `/monday-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-3DBE` | NEW | P2 | `/copper-crm-alternatives/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-9AF2` | NEW | P2 | `/category/crm/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-5227` | NEW | P2 | `/folk-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-C71E` | NEW | P2 | `/folk-app-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-4863` | NEW | P2 | `/salesforce-vs-infusionsoft/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-5AC4` | NEW | P2 | `/salesforce-vs-oracle/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-718F` | NEW | P2 | `/hubspot-vs-infusionsoft/` | Imported GSC data still shows impressions on a redirect source path |

_…and 12 more (see JSON)._

## All active issues (NEW / OPEN / REGRESSED)

| ID | State | Sev | Subject | Problem |
| --- | --- | --- | --- | --- |
| `MIG-404-8F7F` | OPEN | P1 | `/benefits-of-freshsales-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-E3ED` | OPEN | P1 | `/benefits-of-microsoft-dynamics-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-683B` | OPEN | P1 | `/benefits-of-zoho-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-DAD8` | OPEN | P1 | `/best-commercial-real-estate-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-C399` | OPEN | P1 | `/best-crm-for-coaches/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-AFB9` | OPEN | P1 | `/best-crm-for-facebook-leads/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-306A` | OPEN | P1 | `/best-crm-for-financial-advisors/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-9FA8` | OPEN | P1 | `/best-crm-for-hotels/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-D470` | OPEN | P1 | `/best-crm-for-linkedin/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-25AF` | OPEN | P1 | `/best-crm-for-real-estate-investors/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-B370` | OPEN | P1 | `/best-crm-for-small-legal-practices/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-3E63` | OPEN | P1 | `/best-crm-for-small-real-estate-business/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-967A` | OPEN | P1 | `/best-crm-for-web-designers/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-C8FC` | OPEN | P1 | `/best-crm-software-for-car-dealerships/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-3729` | OPEN | P1 | `/best-crm-software-for-construction/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-8CFE` | OPEN | P1 | `/best-crm-software-for-restaurants/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-EEF3` | OPEN | P1 | `/best-practices-crm-deal-flow-private-equity/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-DDA3` | OPEN | P1 | `/best-practices-crm/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-720D` | OPEN | P1 | `/best-practices-for-ensuring-crm-security/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-B60F` | OPEN | P1 | `/category/guides/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-9421` | OPEN | P1 | `/category/software-comparison/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-7A28` | OPEN | P1 | `/crm-guides/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-3B85` | OPEN | P1 | `/what-is-crm-lead-management/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-404-86E6` | OPEN | P1 | `/what-is-crm-marketing/` | Important legacy URL has no implemented redirect (risk of unexpected 404) |
| `MIG-GSC-A3D0` | NEW | P2 | `Excluded by ‘noindex’ tag` | GSC coverage reports “Excluded by ‘noindex’ tag” (228 pages) |
| `MIG-GSC-5C74` | NEW | P1 | `Not found (404)` | GSC coverage reports “Not found (404)” (57 pages) |
| `MIG-GSC-FE51` | NEW | P2 | `Page with redirect` | GSC coverage reports “Page with redirect” (37 pages) |
| `MIG-GSC-5049` | NEW | P2 | `Alternative page with proper canonical tag` | GSC coverage reports “Alternative page with proper canonical tag” (24 pages) |
| `MIG-GSC-1D07` | NEW | P2 | `Duplicate, Google chose different canonical than user` | GSC coverage reports “Duplicate, Google chose different canonical than user” (1 pages) |
| `MIG-GSC-E831` | NEW | P2 | `/lusha-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-386D` | NEW | P2 | `/contact/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-9522` | NEW | P2 | `/best-crm-for-startups/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-F225` | NEW | P2 | `/activecampaign-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-F547` | NEW | P2 | `/insightly-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-899B` | NEW | P2 | `/getresponse-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-3ABE` | NEW | P2 | `/hubspot-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-64E6` | NEW | P2 | `/capsule-crm-review-2/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-36CB` | NEW | P2 | `/keap-crm-review-2/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-C4A2` | NEW | P2 | `/best-crm-for-freelancers/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-AEC7` | NEW | P2 | `/closely-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-24A8` | NEW | P2 | `/salesforce-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-FEC5` | NEW | P2 | `/best-crms/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-B362` | NEW | P2 | `/microsoft-dynamics-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-EB18` | NEW | P2 | `/salesforce-vs-pipedrive/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-7FE3` | NEW | P2 | `/freshsales-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-ACB6` | NEW | P2 | `/comparing-setup-pipedrive-vs-hubspot/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-2B3E` | NEW | P2 | `/salesforce-vs-insightly/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-A973` | NEW | P2 | `/close-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-5CC0` | NEW | P2 | `/salesforce-vs-sugar-crm/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-6D52` | NEW | P2 | `/hubspot-vs-insightly/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-A9D8` | NEW | P2 | `/infusionsoft-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-E0BD` | NEW | P2 | `/best-crm-for-field-sales/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-FAAE` | NEW | P2 | `/salesforce-vs-monday/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-CDE4` | NEW | P2 | `/pipedrive-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-11C0` | NEW | P2 | `/keap-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-F7D5` | NEW | P2 | `/monday-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-3DBE` | NEW | P2 | `/copper-crm-alternatives/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-9AF2` | NEW | P2 | `/category/crm/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-5227` | NEW | P2 | `/folk-crm-review/` | Imported GSC data still shows impressions on a redirect source path |
| `MIG-GSC-C71E` | NEW | P2 | `/folk-app-review/` | Imported GSC data still shows impressions on a redirect source path |

_…and 15 more (see JSON)._

## Resolved since last run

_None._

## Intentional (allowlisted)

_None._

## Search Console

| Field | Value |
| --- | --- |
| Available | yes |
| Mode | import |

**Notes**

- Approved import path present: /Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/docs/migration/data/gsc-export.json
- Do not interpret Search Console coverage warnings without crawl/context review.
- Loaded coverage import: /Users/LMeyeridricks/Documents/coding/SoftwareGlimpse/docs/migration/data/gsc-coverage.json
- Coverage reasons are aggregate counts only — not per-URL lists.
- Do not treat Page with redirect / 404 counts as confirmed migration failures without URL inspection.
- Scanned 1000 imported page row(s) for legacy redirect-source overlap.

**Signals (interpret with caution)**

- `MIG-GSC-INDEX-TOTALS` — **Indexed vs not-indexed totals (aggregate)**: As of 2026-08-07: indexed=1527, notIndexed=4504, impressions=1193 — WordPress-era crawl inventory; re-check after Next.js launch.
- `MIG-GSC-A3D0` — **Coverage: Excluded by ‘noindex’ tag**: 228 page(s) — source=Website; validation=Not Started. Aggregate only; inspect URL examples in GSC before changing redirects.
- `MIG-GSC-5C74` — **Coverage: Not found (404)**: 57 page(s) — source=Website; validation=Not Started. Aggregate only; inspect URL examples in GSC before changing redirects.
- `MIG-GSC-FE51` — **Coverage: Page with redirect**: 37 page(s) — source=Website; validation=Not Started. Aggregate only; inspect URL examples in GSC before changing redirects.
- `MIG-GSC-5049` — **Coverage: Alternative page with proper canonical tag**: 24 page(s) — source=Website; validation=Not Started. Aggregate only; inspect URL examples in GSC before changing redirects.
- `MIG-GSC-1D07` — **Coverage: Duplicate, Google chose different canonical than user**: 1 page(s) — source=Google systems; validation=Not Started. Aggregate only; inspect URL examples in GSC before changing redirects.
- `MIG-GSC-E831` — **Legacy URL still receiving impressions (import)**: /lusha-review/ impressions=182 clicks=1 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-386D` — **Legacy URL still receiving impressions (import)**: /contact/ impressions=18 clicks=1 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-9522` — **Legacy URL still receiving impressions (import)**: /best-crm-for-startups/ impressions=6 clicks=1 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-F225` — **Legacy URL still receiving impressions (import)**: /activecampaign-crm-review/ impressions=1019 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-F547` — **Legacy URL still receiving impressions (import)**: /insightly-crm-review/ impressions=938 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-899B` — **Legacy URL still receiving impressions (import)**: /getresponse-review/ impressions=866 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-3ABE` — **Legacy URL still receiving impressions (import)**: /hubspot-crm-review/ impressions=442 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-64E6` — **Legacy URL still receiving impressions (import)**: /capsule-crm-review-2/ impressions=428 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-36CB` — **Legacy URL still receiving impressions (import)**: /keap-crm-review-2/ impressions=421 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-C4A2` — **Legacy URL still receiving impressions (import)**: /best-crm-for-freelancers/ impressions=366 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-AEC7` — **Legacy URL still receiving impressions (import)**: /closely-review/ impressions=360 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-24A8` — **Legacy URL still receiving impressions (import)**: /salesforce-crm-review/ impressions=264 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-FEC5` — **Legacy URL still receiving impressions (import)**: /best-crms/ impressions=218 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-B362` — **Legacy URL still receiving impressions (import)**: /microsoft-dynamics-crm-review/ impressions=213 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-EB18` — **Legacy URL still receiving impressions (import)**: /salesforce-vs-pipedrive/ impressions=194 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-7FE3` — **Legacy URL still receiving impressions (import)**: /freshsales-crm-review/ impressions=191 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-ACB6` — **Legacy URL still receiving impressions (import)**: /comparing-setup-pipedrive-vs-hubspot/ impressions=144 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-2B3E` — **Legacy URL still receiving impressions (import)**: /salesforce-vs-insightly/ impressions=142 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-A973` — **Legacy URL still receiving impressions (import)**: /close-crm-review/ impressions=137 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-5CC0` — **Legacy URL still receiving impressions (import)**: /salesforce-vs-sugar-crm/ impressions=122 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-6D52` — **Legacy URL still receiving impressions (import)**: /hubspot-vs-insightly/ impressions=87 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-A9D8` — **Legacy URL still receiving impressions (import)**: /infusionsoft-crm-review/ impressions=85 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-E0BD` — **Legacy URL still receiving impressions (import)**: /best-crm-for-field-sales/ impressions=63 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-FAAE` — **Legacy URL still receiving impressions (import)**: /salesforce-vs-monday/ impressions=59 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-CDE4` — **Legacy URL still receiving impressions (import)**: /pipedrive-crm-review/ impressions=53 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-11C0` — **Legacy URL still receiving impressions (import)**: /keap-crm-review/ impressions=47 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-F7D5` — **Legacy URL still receiving impressions (import)**: /monday-crm-review/ impressions=45 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-3DBE` — **Legacy URL still receiving impressions (import)**: /copper-crm-alternatives/ impressions=45 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-9AF2` — **Legacy URL still receiving impressions (import)**: /category/crm/ impressions=27 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-5227` — **Legacy URL still receiving impressions (import)**: /folk-crm-review/ impressions=26 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-C71E` — **Legacy URL still receiving impressions (import)**: /folk-app-review/ impressions=19 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-4863` — **Legacy URL still receiving impressions (import)**: /salesforce-vs-infusionsoft/ impressions=14 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-5AC4` — **Legacy URL still receiving impressions (import)**: /salesforce-vs-oracle/ impressions=14 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-718F` — **Legacy URL still receiving impressions (import)**: /hubspot-vs-infusionsoft/ impressions=9 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-A057` — **Legacy URL still receiving impressions (import)**: /sugar-crm-review/ impressions=8 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-E0A0` — **Legacy URL still receiving impressions (import)**: /hubspot-vs-freshsales/ impressions=7 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-E1E8` — **Legacy URL still receiving impressions (import)**: /hubspot-vs-keap/ impressions=6 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-51B8` — **Legacy URL still receiving impressions (import)**: /category/best-crms/ impressions=6 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-CB5B` — **Legacy URL still receiving impressions (import)**: /privacy-policy/ impressions=5 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-2ADE` — **Legacy URL still receiving impressions (import)**: /hubspot-vs-monday/ impressions=5 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-EAFD` — **Legacy URL still receiving impressions (import)**: /the-ultimate-guide-to-pipedrive-vs-hubspot/ impressions=3 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-B26A` — **Legacy URL still receiving impressions (import)**: /pipedrive-vs-hubspot/ impressions=3 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-F971` — **Legacy URL still receiving impressions (import)**: /capsule-crm-review/ impressions=3 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-7C07` — **Legacy URL still receiving impressions (import)**: /monday-com-review/ impressions=3 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-C512` — **Legacy URL still receiving impressions (import)**: /hubspot-vs-monday-2/ impressions=3 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-E226` — **Legacy URL still receiving impressions (import)**: /microsoft-dynamics-vs-salesforce/ impressions=2 clicks=0 — verify redirect live + GSC “Page with redirect” after launch
- `MIG-GSC-CONTEXT` — **GSC monitoring checklist (manual)**: Watch Not found (404), Page with redirect, Duplicate without user-selected canonical, Indexed legacy URLs, new target indexing, and traffic deltas — with path context.

## Recommended schedule

**PRE-LAUNCH:** `npm run migration:audit` (full QA). **LAUNCH DAY:** `npm run migration:monitor` + redirect/canonical/sitemap focus; spot-check important 301s live. **FIRST WEEK:** daily monitor if CI scheduling supports it. **FIRST MONTH:** weekly monitor. **AFTER:** monthly monitor / fold into normal SEO audit cadence.

## Commands

```bash
npm run migration:audit      # full pre/post-launch SEO QA
npm run migration:redirects  # regenerate approved redirects (manual approval gate)
npm run migration:monitor    # this report
```

## Limitations

- Static by default — live HTTP status/redirect-loop probes require `BASE_URL` / future live mode.
- Soft 404 detection is not asserted without live HTML.
- GSC coverage reports are never invented; imported rows are signals only.
- This agent **never** auto-edits `config/legacy-redirects.json`.

## Issue states

| State | Meaning |
| --- | --- |
| NEW | First seen this run |
| OPEN | Seen before, still present |
| RESOLVED | Present last run, gone now |
| REGRESSED | Returned after resolve, or severity worsened |
| INTENTIONAL | Listed in `docs/migration/data/monitor-intentional.json` |

