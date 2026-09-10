# Drop Ahrefs / Semrush / other **REAL** backlink exports here

Supported: `.csv` or `.json` (array of rows, or `{ "rows": [] }`).

## Production rules

- Only **REAL** exports drive Digital PR opportunity reports.
- Files named `*sample*`, `*fixture*`, `*example*`, `*demo*`, `*test*` are **rejected**.
- Paths under `/fixtures/` are **rejected**.
- Example/placeholder domains (`example.com`, `*.example`, etc.) never become prospects.

## Useful columns (any subset; never invent missing metrics)

- domain / referring_domain
- target_url / To URL
- source_url / Referring page URL
- Domain Rating / DR / Domain Authority / DA (optional)
- Organic traffic (optional)
- anchor (optional)

Prefer filenames with an export date: `ahrefs-refdomains-2026-09-06.csv`.

```bash
npm run seo:link-opportunities
```

Drop folders:

- `data/seo/imports/ahrefs/`
- `data/seo/imports/semrush/`
- `data/seo/imports/backlinks/`
