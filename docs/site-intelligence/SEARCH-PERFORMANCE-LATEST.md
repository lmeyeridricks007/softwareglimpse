# Search Performance — SoftwareGlimpse

**Generated:** 2026-08-15T16:30:00.000Z
**Source mode:** fixture
**Live / approved import:** no
**Synthetic:** yes

> Consumes approved Search Console–shaped data (live GSC connector, import, or labeled fixtures). Does **not** scrape GSC. Does **not** invent credentials.

## Methodology — average position

- Average position (GSC) is an impression-weighted average across the reporting period — not a fixed SERP rank.
- A URL can appear at different ranks for the same query on different days/devices; the metric blends those appearances.
- Do not treat position 8.4 as “always rank #8.” Use it as a relative traction/near-win signal only.
- Site Intelligence never converts average position into a “% chance to rank.”

\* Avg pos columns use GSC average position for the period.

## Disclaimers

- Does not scrape Google Search Console HTML.
- Does not invent credentials or fabricate live GSC rows.
- Fixture/synthetic snapshots must not be claimed as live SoftwareGlimpse GSC.

## Notes

- Using synthetic fixture synthetic-28d-current.json — not live SoftwareGlimpse GSC
- GSC not configured (set GSC_PROPERTY_URL + GSC_CLIENT_EMAIL or GOOGLE_APPLICATION_CREDENTIALS)
- SYNTHETIC snapshot — suitable for pipeline tests; do not claim live SoftwareGlimpse GSC

## Period

- **Snapshot:** `fixture-28d-current-2026-08-13`
- **Source:** fixture
- **Range label:** 28d-current
- **Period:** 2026-07-22 → 2026-08-19
- **Data through:** 2026-08-13
- **Rows:** 8
- **Compare vs:** `fixture-28d-previous-2026-07-16` (2026-07-16)

## Totals

| Metric | Value |
| --- | ---: |
| Clicks | 66 |
| Impressions | 3383 |
| CTR | 1.95% |
| Avg position* | 8.8 |
| Queries | 7 |
| Pages | 4 |

## Near-win pages

High impressions + average position 8–20 (relative traction — not a fixed SERP slot).

| Page | Query | Imp | Clicks | CTR | Avg pos* | Action |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `/best/crm-software/` | best crm software | 950 | 18 | 1.90% | 11.2 | Improve existing page depth/intent match and internal links — treat as |
| `/software/pipedrive/` | pipedrive vs close | 420 | 8 | 1.90% | 9.5 | Improve existing page depth/intent match and internal links — treat as |
| `/categories/crm/` | best crm software | 310 | 6 | 1.90% | 14.0 | Improve existing page depth/intent match and internal links — treat as |
| `/software/freshsales/` | freshsales crm | 220 | 5 | 2.30% | 8.0 | Improve existing page depth/intent match and internal links — treat as |
| `/categories/crm/` | crm for agencies | 180 | 2 | 1.10% | 12.0 | Improve existing page depth/intent match and internal links — treat as |

## Title / snippet (CTR) opportunities

High impressions + poor CTR vs expected band for average position.

| Page | Query | Imp | Clicks | CTR | Avg pos* | Action |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `/software/pipedrive/` | pipedrive review | 800 | 12 | 1.50% | 4.2 | Test title/meta description / SERP snippet clarity — do not assume ran |

## Refresh candidates

Position decline and/or click drop vs prior period.

| Page | Query | Imp | Clicks | CTR | Avg pos* | Action |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `/software/pipedrive/` | — | 1723 | 35 | 2.03% | 6.2 | Refresh content/evidence/freshness signals; investigate SERP feature s |
| `/software/freshsales/` | — | 220 | 5 | 2.27% | 8.0 | Refresh content/evidence/freshness signals; investigate SERP feature s |

## Emerging topics

Queries with new impressions not present in the prior snapshot.

_None flagged in this run._

## Defend / build cluster

Strong average position with weak measurable supporting-cluster impressions.

| Page | Query | Imp | Clicks | CTR | Avg pos* | Action |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `/software/pipedrive/` | pipedrive review | 800 | 12 | 1.50% | 4.2 | Build/strengthen supporting cluster pages and internal links to defend |

## Site Intelligence visibility metrics (derived)

_SYNTHETIC — do not claim live visibility._

| Factor | Norm |
| --- | ---: |
| indexedPerformingCoverage | 20 |
| impressionsNorm | 88 |
| clicksNorm | 51 |
| ctrNorm | 20 |
| positionDistributionNorm | 53 |
| queryCoverageNorm | 28 |

## Sample rows (top impressions)

| Page | Query | Imp | Clicks | CTR | Avg pos* | Device | Country |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| `/best/crm-software/` | best crm software | 950 | 18 | 1.90% | 11.2 | — | — |
| `/software/pipedrive/` | pipedrive review | 800 | 12 | 1.50% | 4.2 | — | — |
| `/software/pipedrive/` | pipedrive pricing | 500 | 15 | 3.00% | 6.5 | — | — |
| `/software/pipedrive/` | pipedrive vs close | 420 | 8 | 1.90% | 9.5 | — | — |
| `/categories/crm/` | best crm software | 310 | 6 | 1.90% | 14.0 | — | — |
| `/software/freshsales/` | freshsales crm | 220 | 5 | 2.30% | 8.0 | — | — |
| `/categories/crm/` | crm for agencies | 180 | 2 | 1.10% | 12.0 | — | — |
| `/software/pipedrive/` | xyz obscure noise query | 3 | 0 | 0.00% | 45.0 | — | — |

## Refresh

```bash
# Synthetic pipeline (labeled — not live GSC)
npm run site:search-performance -- --fixture
# Approved GSC-shaped export
npm run site:search-performance -- --import path/to/export.json
# From snapshots already in src/data/seo/snapshots
npm run site:search-performance
```
