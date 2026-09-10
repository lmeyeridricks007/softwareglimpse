# GSC snapshot archive

Live files live at `docs/migration/data/gsc-export.json` and `gsc-coverage.json`.

| File | Window | Role |
| --- | --- | --- |
| `gsc-performance-2026-08-13.json` | Last 3 months, through 2026-08-13 | Archived Performance (stale at import time) |
| `gsc-coverage-2026-08-13.json` | Coverage Overview through ~2026-08-07 | Pre-sitemap-cutover Overview — **incompatible** with 2026-09-05 drilldowns |
| `gsc-performance-replaced-2026-09-10.json` | Same as 08-13 | Copy of live file at the moment it was replaced |
| `gsc-coverage-replaced-2026-09-10.json` | Same as 08-13 Overview | Copy of live file at the moment it was replaced |
| `import-2026-09-05-summary.json` | 2026-09-05 import | Totals + provenance for the replacement |

Do not delete dated archives when importing a newer export.
