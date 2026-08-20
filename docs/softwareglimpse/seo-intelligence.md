# SEO Intelligence / Search Console feedback

Code: `src/services/seo/`, `src/domain/schemas/seo.ts`, `src/data/seo/`, `src/data/config/seo/`, `scripts/seo-cli.ts`.

## Purpose

Turn Search Console–shaped performance into **editorial content opportunities** — not auto-published pages, and never product recommendation rankings.

## Commercial vs editorial boundary

| Layer | May use commercial / affiliate signals? | Effect |
| --- | --- | --- |
| Product recommendation (`recommendCrm`, finder scoring) | **No** | Rankings stay affiliate-independent |
| SEO opportunity scoring | **Optional only** | `commercialBoost` (0–1) may raise **content queue priority** via `commercialOpportunity` weight |
| Publishing / live site | **No auto-publish** | Accept → `ContentQueueItem` / brief candidate; humans + publishing engine own the rest |

Never invent live SoftwareGlimpse GSC metrics as facts. Repo fixtures are labeled `synthetic: true`.

## Boundaries

| Rule | Detail |
| --- | --- |
| Commercial signals | Optional `commercialBoost` may raise **content priority** only |
| Affiliate / recommendCrm | Must never read affiliate into product ranks |
| Live GSC | Not required — fixture/import is primary |
| Synthetic data | Fixtures are labeled `synthetic: true` — never claim live SoftwareGlimpse GSC |
| Publishing | Opportunities queue briefs; they do **not** create or publish pages |

## Pipeline

```text
Provider (fixture | import | GSC stub)
  → syncSearchPerformance (idempotent snapshot)
  → aggregate (page / query / page×query / period deltas)
  → classifyQuery + recognizeEntities
  → detectAllOpportunities
  → scoreOpportunity (0–100 + breakdown)
  → acceptOpportunity → ContentQueueItem (editorial handoff)
  → measurement stubs (experiment windows)
```

## Opportunity types

Detectors under `src/services/seo/opportunities/`:

- `striking-distance`
- `high-impression-low-ctr` / `high-impression-no-click`
- `query-page-mismatch`
- `missing-content` (+ `comparison-opportunity`, `alternatives-opportunity`, `pricing-opportunity`, `use-case-opportunity`)
- `cannibalization`
- `content-decay` / `growth`
- `internal-link-opportunity`

Stable ids live in `opportunity-ids.ts` (e.g. `seo-opportunity:comparison:close:pipedrive`).

Default detection respects `seoThresholds.minImpressions` so tiny-sample noise does not create opportunities.

## Fixture mode

`src/data/seo/fixtures/`:

- `synthetic-28d-current.json`
- `synthetic-28d-previous.json`

Cover low CTR, missing comparison demand (`pipedrive vs close`), striking distance, decay, cannibalization, pricing mismatch, and noise below sample thresholds.

```bash
npm run seo -- sync --fixture   # idempotent snapshot + opportunity upsert
```

Without live credentials, CLI commands fall back to these fixtures when no store snapshots exist.

## CLI

```bash
npm run seo -- sync --fixture
npm run seo -- status
npm run seo -- opportunities
npm run seo -- opportunities --type comparison-opportunity
npm run seo -- page -- /software/pipedrive/
npm run seo -- page -- content:software:pipedrive
npm run seo -- query -- "best crm software"
npm run seo -- query -- "pipedrive vs close"
npm run seo -- gaps -- crm
npm run seo -- gaps -- pipedrive
npm run seo -- links -- crm
npm run seo -- quick-wins
npm run seo -- validate
```

Package aliases: `seo:sync`, `seo:status`, `seo:opportunities`, `seo:page`, `seo:query`, `seo:gaps`, `seo:links`, `seo:quick-wins`, `seo:validate`.

`validate` checks fixture integrity, opportunity id stability across identical runs, and that below-threshold noise does not surface as default opportunities.

## Providers

- `FixtureSearchPerformanceProvider` — loads fixtures
- `GoogleSearchConsoleProvider` — stub; throws “not configured” or empty with `allowEmpty`

Optional env placeholders (see `.env.example`): `GSC_PROPERTY_URL`, `GSC_CLIENT_EMAIL`, `GOOGLE_APPLICATION_CREDENTIALS`.

## Storage

`src/data/seo/{fixtures,snapshots,opportunities,experiments,queue}/`

Snapshot id: `${source}-${rangeLabel}-${dataThroughDate}`.

## Imports

- Pure helpers: `@/services/seo`
- FS / sync / queue mutations: `@/services/seo/server`

## Related

- [seo-architecture.md](./seo-architecture.md) — on-page metadata / sitemaps
- [affiliate-model.md](./affiliate-model.md) — commercial boundaries
- [publishing-engine.md](./publishing-engine.md) — lifecycle (SEO never auto-publishes)
