# GSC + measurement imports

## Search Performance + Coverage

Canonical REAL files (latest available in repo):

- `docs/migration/data/gsc-export.json` — Performance (`synthetic: false`)
- `docs/migration/data/gsc-coverage.json` — Coverage / Indexing

### Current import (2026-09-05)

| Field | Value |
| --- | --- |
| Source | Google Search Console UI export (xlsx) — softwareglimpse.com, Search type Web |
| Export date | 2026-09-05 |
| Performance data-through | 2026-09-03 |
| Performance window | 2025-09-04 → 2026-09-03 (Last 12 months) |
| Coverage data-through | 2026-08-28 |
| Coverage window | 2026-06-08 → 2026-08-28 (issue-chart drilldowns only) |
| Page × query | **Not in this export** — query mappings stay `INFERRED_*` / `UNKNOWN` |
| Sitemap GSC report | **Not in this export** (Metadata: Sitemap = All known pages) |

Raw xlsx: `data/seo/imports/gsc/2026-09-05/`. Prior live snapshot archived at `data/seo/archives/gsc/` (`*-2026-08-13.json` and `*-replaced-2026-09-10.json`). Do **not** compare Last-12-months Performance to the archived Last-3-months snapshot, or Coverage drilldowns to the pre-sitemap-cutover Overview.

Optional drop zones (auto-discovered):

- `data/seo/gsc-export.json`
- `data/seo/imports/gsc-export.json`

### Page × query (DIRECT_GSC)

Export GSC with dimensions **Page + Query**, then place:

- `data/seo/imports/gsc-page-query.csv` or
- `data/seo/imports/gsc-page-query.json`

Without this file, query mappings stay `INFERRED_*` (never labeled DIRECT_GSC).

### Snapshot retention

```bash
npm run site:search-performance -- --import docs/migration/data/gsc-export.json
```

Writes REAL snapshot under `src/data/seo/snapshots/`. Prior REAL periods enable
dashboard pre/post **only when date ranges are comparable**. Fixture snapshots
never pair with REAL current data.

## Affiliate funnel

```bash
npm run analytics:affiliate-clicks -- --ensure
npm run analytics:affiliate-clicks -- --import path/to/ga4-clicks.json
npm run analytics:affiliate-conversions -- --ensure
npm run analytics:affiliate-conversions -- --import path/to/network-conversions.json
```

Beacon: `POST /api/analytics/affiliate-click` (also used by client `sendBeacon`).
`/go/[product]` records server-side clicks.

## Backlinks (authority)

Drop REAL Ahrefs/Semrush CSV under `data/seo/imports/ahrefs/` or `semrush/`.
Fixture/sample paths are rejected. Then:

```bash
npm run seo:link-opportunities
```
