# Migration monitor schedule

Recommended cadence for `LegacyMigrationMonitorAgent` after the new SoftwareGlimpse site launches.

| Phase | Cadence | Commands |
| --- | --- | --- |
| **Pre-launch** | Once (gate) | `npm run migration:audit` |
| **Launch day** | Once + spot checks | `npm run migration:monitor` (+ live spot-check important 301s) |
| **First week** | Daily if CI supports it | `npm run migration:monitor` |
| **First month** | Weekly | `npm run migration:monitor` |
| **After** | Monthly / normal SEO audit | `npm run migration:monitor` + `npm run seo:audit` |

## Commands

```bash
npm run migration:audit       # full Migration SEO QA (alias of migration:seo-audit)
npm run migration:redirects   # regenerate approved permanent redirects (never auto-applied by monitor)
npm run migration:monitor     # LegacyMigrationMonitorAgent
npm run migration:monitor -- --json
npm run migration:monitor -- --import docs/migration/data/gsc-export.json
```

## Outputs

| Path | Role |
| --- | --- |
| [`MIGRATION-MONITOR-LATEST.md`](./MIGRATION-MONITOR-LATEST.md) | Latest human report |
| [`archive/YYYY-MM-DD-migration-monitor.md`](./archive/) | Dated archive |
| [`data/migration-monitor.json`](./data/migration-monitor.json) | Full JSON |
| [`data/migration-monitor-issues-latest.json`](./data/migration-monitor-issues-latest.json) | Issue snapshot for NEW/OPEN/RESOLVED/REGRESSED |
| [`data/monitor-intentional.json`](./data/monitor-intentional.json) | Allowlist → INTENTIONAL state |

## Limitations

- Does **not** modify redirects.
- Static by default (inventory, redirect config, sitemap, internal-link graph, repo scan).
- Live HTTP loops/soft-404s need a deployment + future `BASE_URL` probe.
- Search Console signals only when a real (non-synthetic) import/snapshot exists — never invented; interpret with crawl context.
