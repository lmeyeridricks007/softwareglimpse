# Legacy URL migration

Audit + mapping framework comparing live WordPress (`https://www.softwareglimpse.com`) to this Next.js app.

## Commands

```bash
# Inventory + first-pass recommendations
npm run migration:legacy-urls

# Entity/intent URL mapping plan (LegacyUrlMappingAgent)
npm run migration:map-urls
npm run migration:map-urls -- --json
npm run migration:map-urls -- --no-write

# SEO priority enrichment (GSC/GA/backlinks when available — never invented)
npm run migration:seo-priority
npm run migration:seo-priority -- --import path/to/gsc-export.json
npm run migration:seo-priority -- --json

# Approved permanent redirects (HIGH confidence only)
npm run migration:redirects
npm run migration:redirects -- --json

# Pre/post-launch migration SEO QA
npm run migration:audit
npm run migration:seo-audit -- --json

# Post-launch migration health monitor (does not modify redirects)
npm run migration:monitor
npm run migration:monitor -- --json
```

## Outputs

| Path | Role |
| --- | --- |
| [`01-legacy-url-inventory.md`](./01-legacy-url-inventory.md) | Discovery inventory |
| [`02-url-mapping-plan.md`](./02-url-mapping-plan.md) | Per-URL mapping plan (sorted by SEO risk) |
| [`03-seo-priority-migration-map.md`](./03-seo-priority-migration-map.md) | Historical SEO importance + migration risk |
| [`04-redirect-manifest.md`](./04-redirect-manifest.md) | Human-readable redirect manifest |
| [`05-monitor-schedule.md`](./05-monitor-schedule.md) | Monitor cadence + limitations |
| [`MIGRATION-SEO-QA-LATEST.md`](./MIGRATION-SEO-QA-LATEST.md) | Migration SEO QA (PASS/FAIL) |
| [`MIGRATION-MONITOR-LATEST.md`](./MIGRATION-MONITOR-LATEST.md) | Post-launch monitor (HEALTHY/ATTENTION/CRITICAL) |
| [`archive/`](./archive/) | Dated monitor archives |
| [`../config/legacy-redirects.json`](../config/legacy-redirects.json) | Machine-readable redirect source of truth |
| [`data/`](./data/) | JSON snapshots |

## Rules

- **Do not** implement redirects until the mapping plan is approved.
- Matching priority: explicit historical → entity → title/topic → product → comparison pair → guide intent → cluster → gated semantic similarity.
- Never redirect retired/irrelevant URLs to the homepage.
- Never invent GSC / Analytics / backlink metrics. Synthetic SEO fixtures are excluded from priority scoring.
- Place approved GSC exports at `docs/migration/data/gsc-export.json` (or pass `--import`).
- Coverage aggregates (optional): `docs/migration/data/gsc-coverage.json`.
- RedirectPlanGenerator auto-implements **HIGH** confidence allowlisted mappings only; low/medium stay excluded.
- MigrationSEOAuditAgent validates fate coverage, high-risk redirects, internal links, canonicals, sitemap, schema/OG, hardcoded legacy refs, assets, and 404 UX. **P0 → FAIL**.
- LegacyMigrationMonitorAgent tracks post-launch health with stable `MIG-*` issue IDs (NEW/OPEN/RESOLVED/REGRESSED/INTENTIONAL). **Never auto-edits redirects.**
- Distinct from `src/data/seed/migration.ts` (hand CRM ledger) — that ledger is an **input** to the mapping agent as explicit historical maps.
- Service code: `src/services/legacy-url-migration/` (+ `mapping-agent/`, `seo-priority/`, `redirect-plan/`, `seo-audit/`, `monitor/`).
