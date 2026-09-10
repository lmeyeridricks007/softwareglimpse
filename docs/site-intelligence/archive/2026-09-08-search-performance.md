# Search Performance — SoftwareGlimpse

**Generated:** 2026-09-08T21:40:25.197Z
**Source mode:** import
**Live / approved import:** yes
**Synthetic:** no

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

- Using approved import file: docs/migration/data/gsc-export.json
- Import saved to src/data/seo/snapshots for Site Intelligence reuse
- Imported GSC-shaped snapshot (approved export) — treat as performance truth for this run

## Period

- **Snapshot:** `import-Last 3 months-2026-08-13`
- **Source:** import
- **Range label:** Last 3 months
- **Period:** 2026-05-14 → 2026-08-13
- **Data through:** 2026-08-13
- **Rows:** 1000

## Totals

| Metric | Value |
| --- | ---: |
| Clicks | 8 |
| Impressions | 115457 |
| CTR | 0.01% |
| Avg position* | 74.5 |
| Queries | 0 |
| Pages | 1000 |

## Near-win pages

High impressions + average position 8–20 (relative traction — not a fixed SERP slot).

_None flagged in this run._

## Title / snippet (CTR) opportunities

High impressions + poor CTR vs expected band for average position.

_None flagged in this run._

## Refresh candidates

Position decline and/or click drop vs prior period.

_None flagged in this run._

## Emerging topics

Queries with new impressions not present in the prior snapshot.

_None flagged in this run._

## Defend / build cluster

Strong average position with weak measurable supporting-cluster impressions.

_None flagged in this run._

## Site Intelligence visibility metrics (derived)

_Ready for Search Visibility pillar when overview re-runs._

| Factor | Norm |
| --- | ---: |
| indexedPerformingCoverage | 100 |
| impressionsNorm | 100 |
| clicksNorm | 27 |
| ctrNorm | 0 |
| positionDistributionNorm | 10 |
| queryCoverageNorm | 0 |

## Sample rows (top impressions)

| Page | Query | Imp | Clicks | CTR | Avg pos* | Device | Country |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |

## Refresh

```bash
# Synthetic pipeline (labeled — not live GSC)
npm run site:search-performance -- --fixture
# Approved GSC-shaped export
npm run site:search-performance -- --import path/to/export.json
# From snapshots already in src/data/seo/snapshots
npm run site:search-performance
```
