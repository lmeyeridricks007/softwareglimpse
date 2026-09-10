# GSC + measurement imports

## Search Performance + Coverage

Canonical REAL files (latest available in repo):

- `docs/migration/data/gsc-export.json` — Performance (`synthetic: false`)
- `docs/migration/data/gsc-coverage.json` — Coverage / Indexing

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
