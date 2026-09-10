# Measurement closure — 2026-09-08

Closes FR-005 / FR-010 / FR-004 dashboard gaps without mixing REAL / STALE / FIXTURE / NOT_CONNECTED.

## A — GSC

| Item | Status |
| --- | --- |
| Latest REAL Performance on disk | `docs/migration/data/gsc-export.json` · through **2026-08-13** · `synthetic: false` |
| Latest REAL Coverage on disk | `docs/migration/data/gsc-coverage.json` · through **2026-08-13** |
| Newer export in Downloads/Desktop | **Not found** — no fresher file to import |
| Prior snapshot retained | `data/seo/archives/gsc/*-2026-08-13.json` + `src/data/seo/snapshots/import-Last__3__months-2026-08-13.json` |
| Page×query (DIRECT_GSC) | **Missing** — drop `data/seo/imports/gsc-page-query.csv` |
| Pre/post trend | **NOT_CONNECTED** — only one REAL period; never pairs REAL current with fixture prior |
| Re-ran | `seo:gsc-opportunities`, `seo:growth-dashboard`, `seo:improvement-cycle` (plan) |

## B — Affiliate funnel

| Layer | Status |
| --- | --- |
| First-party click beacon | `POST /api/analytics/affiliate-click` + client `sendBeacon` |
| `/go/[product]` server record | Writes path/host only (no PII) |
| Click store | `data/analytics/affiliate-clicks.json` · validity **REAL** · 0 events until traffic |
| Conversions / revenue | `data/analytics/affiliate-conversions.json` · **NOT_CONNECTED** · revenue never shown as $0 |
| CLI | `npm run analytics:affiliate-clicks` · `npm run analytics:affiliate-conversions` |

## C — Authority

| Item | Status |
| --- | --- |
| REAL backlink export | **NOT_CONNECTED** (import dirs empty of data files) |
| Fixture rejection | Enforced — sample/fixture/example paths rejected |
| Dashboard | Referring domains NOT_CONNECTED; sample link table empty until REAL export |

## D — Source validity (after refresh)

| Source | Validity |
| --- | --- |
| GSC Performance | REAL |
| GSC Coverage | REAL |
| GSC Opportunities | REAL |
| Affiliate clicks | REAL (store live, 0 clicks) |
| Affiliate conversions/revenue | NOT_CONNECTED |
| Digital PR / backlinks | NOT_CONNECTED |
| AI Visibility | FIXTURE |
| Organic pre/post trend | NOT_CONNECTED (incomparable — single period) |

### Still not connected (important)

1. **Affiliate conversions + revenue** — need network export/API
2. **Backlink / referring-domain export** — drop Ahrefs/Semrush under `data/seo/imports/`
3. **GSC page×query matrix** — required for DIRECT_GSC
4. **Fresher GSC Performance/Coverage** — re-export after remediation for comparable pre/post
5. **AI Visibility** — replace fixture with REAL export (currently FIXTURE)

CLI cheat sheet: `data/seo/imports/README.md`
