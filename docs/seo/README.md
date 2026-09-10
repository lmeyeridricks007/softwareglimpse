# SEO audit agents

Local, reusable **ANALYZE → REPORT → RECOMMEND** agents for SoftwareGlimpse.

They inspect the application/content graph and write Markdown recommendations.
They **never** automatically change production content, canonicals, robots, scores, or affiliate links.

## Current scores (2026-09-07 P2 triage)

| Metric | Value |
| --- | ---: |
| Technical SEO Health (Website Intelligence) | **100 / 100** |
| Overall Website Quality | **83 / 100** |
| SEO-HEALTH open findings (FULL + live) | **1** (0 P0 / 0 P1 / 1 P2) |
| Migration SEO QA (static+live) | **PASS** (0 findings) |
| Production `next build` | **PASS** |
| Live probes | **32/32 checks completed, 0 skipped** |
| P2 triage | [`P2-TRIAGE-RECONCILIATION.md`](./P2-TRIAGE-RECONCILIATION.md) |

**Bottom line:** Live FULL audit is clean for P0/P1. Remaining P2 is thin Pipedrive alternatives content (editorial deepen — not a link-graph delete). IMPROVE-cluster internal links retained under PRESERVE → IMPROVE → PROMOTE.

English-only legacy crawl cleanup (locale + WP taxonomy + robots/sitemap verification): [`ENGLISH-LEGACY-CLEANUP.md`](./ENGLISH-LEGACY-CLEANUP.md).
Locale 410 topic equity review: [`LOCALE-410-TOPIC-REVIEW.md`](./LOCALE-410-TOPIC-REVIEW.md) · gap queue [`EXISTING_ESTATE_GAP_REVIEW.md`](./EXISTING_ESTATE_GAP_REVIEW.md) (`npm run migration:locale-410-review`) — **open queue cleared 2026-09-06**.

Production migration SEO integrity (routes / redirects / canonicals / sitemaps + live probes): [`../migration/MIGRATION-SEO-QA-LATEST.md`](../migration/MIGRATION-SEO-QA-LATEST.md) — `npm run migration:seo-audit -- --base-url=http://127.0.0.1:3000`.

Comparison index-worthiness audit (INDEXABLE / IMPROVE lifecycle + promotion): [`COMPARE-AUDIT.md`](./COMPARE-AUDIT.md) — regenerate with `npm run seo:compare-audit`.

Guides index-worthiness audit (same lifecycle): [`GUIDES-AUDIT.md`](./GUIDES-AUDIT.md) — `npm run seo:guides-audit`. Promotion registry: `data/seo/content-lifecycle.json` via `canPromoteToIndexable` / `promoteToIndexable`.

Progressive guide enrichment (taxonomy, blueprints, queued batches, overlays): [`GUIDE-ENRICHMENT.md`](./GUIDE-ENRICHMENT.md) — `npm run seo:enrich-guides -- --batch 30 --apply`.

Guides INDEXABLE ↔ sitemap-guides reconciliation: [`GUIDES-SITEMAP-RECONCILIATION.md`](./GUIDES-SITEMAP-RECONCILIATION.md) — `npx tsx scripts/seo/reconcile-guides-sitemap.ts`.

Digital PR / backlink opportunities: [`DIGITAL-PR-SYSTEM.md`](./DIGITAL-PR-SYSTEM.md) — `npm run seo:link-opportunities`.

AI Visibility (AI answer-engine citations, measurement only): [`AI-VISIBILITY.md`](./AI-VISIBILITY.md) — `npm run seo:ai-visibility`.

GSC organic growth opportunities (real export only): `npm run seo:gsc-opportunities` → [`GSC-OPPORTUNITIES.md`](./GSC-OPPORTUNITIES.md) / [`TOP-20-GROWTH-PAGES.md`](./TOP-20-GROWTH-PAGES.md) / [`GSC-OPPORTUNITY-ENGINE.md`](./GSC-OPPORTUNITY-ENGINE.md). Writes `data/seo/gsc-opportunities.json` + `data/seo/feeds/gsc-*.json`. Queue A = indexed improve; Queue B = IMPROVE/noindex promote.

Content knowledge graph (estate linking): `npm run seo:knowledge-graph` → [`KNOWLEDGE-GRAPH.md`](./KNOWLEDGE-GRAPH.md) / `data/seo/knowledge-graph.json`. Semantic entity graph, journeys, IMPROVE inbound, hub sections, QA.

Improve-batch contextual linking (quality+value gate → 3–8 inbound → overlays/injections → promote link readiness): `npm run seo:improve-linking` → `data/seo/batches/{batch}-linking.json` + `data/seo/link-injections.json`.

Content Quality Gate (index eligibility / improve loop): [`CONTENT-QUALITY-GATE.md`](./CONTENT-QUALITY-GATE.md) — `npm run quality:gate -- analyze --type guide --slug …`. Shared thresholds with guide/comparison promotion + sitemap via `isEntityIndexable`.

Unified internal Growth Dashboard (PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC): [`GROWTH-DASHBOARD.md`](./GROWTH-DASHBOARD.md) — `npm run seo:growth-dashboard` · UI `/dev/growth/?secret=…`. Discovery/Ranking/CTR/Traffic · content estate · improvement velocity · sitemap indexation denominator · REAL/FIXTURE/NOT_CONNECTED/STALE validity.

## Architecture

```text
SEOHealthOrchestrator
  ├─ TechnicalSEOAuditAgent
  ├─ InternalLinkAuditAgent
  ├─ ContentCoverageAuditAgent
  ├─ StructuredDataAuditAgent
  ├─ PerformanceAuditAgent
  ├─ MediaSEOAuditAgent
  └─ OutboundLinkAuditAgent
```

Implementation: `src/services/seo-audit-agents/`  
CLI: `scripts/seo-audit-cli.ts`  
Reports: `docs/seo/reports/`

Each agent:

1. **ANALYZE** — run checks (graph / fixtures / budgets)
2. **REPORT** — write `*-latest.md` (+ archive on FULL)
3. **RECOMMEND** — structured findings with stable IDs

Fixes happen only through explicit engineering/editorial work.

## Commands

```bash
# Full suite (FAST by default)
npm run seo:audit
npm run seo:audit -- --mode=full
npm run seo:audit -- --json
npm run seo:audit -- --no-write

# Individual agents
npm run seo:technical
npm run seo:links
npm run seo:content
npm run seo:schema
npm run seo:performance
npm run seo:media
npm run seo:outbound
```

### FAST vs FULL

| Mode | Intent |
| --- | --- |
| **FAST** | Local/dev — capped samples, no dated archive spam |
| **FULL** | Broader scan + dated archive under `docs/seo/reports/archive/` |

### Live probes (`BASE_URL`)

Without a running origin, HTML/HTTP checks stay skipped. Enable them:

```bash
# local next dev / next start
BASE_URL=http://127.0.0.1:3000 npm run seo:audit -- --mode=full
# or
npm run seo:audit -- --mode=full --base-url=http://127.0.0.1:3000
```

Live checks cover: robots meta, status codes, redirect hops, JSON-LD, images/embeds, outbound HEAD samples, lab TTFB proxies.

## Report locations

| Report | Path |
| --- | --- |
| Master health | `docs/seo/reports/SEO-HEALTH-LATEST.md` |
| Technical | `docs/seo/reports/technical-seo-latest.md` |
| Internal linking | `docs/seo/reports/internal-linking-latest.md` |
| Content coverage | `docs/seo/reports/content-coverage-latest.md` |
| Structured data | `docs/seo/reports/structured-data-latest.md` |
| Performance | `docs/seo/reports/performance-latest.md` |
| Media SEO | `docs/seo/reports/media-seo-latest.md` |
| Outbound | `docs/seo/reports/outbound-links-latest.md` |
| Issue snapshot (diff) | `docs/seo/reports/archive/seo-issues-latest.json` |
| Dated archives | `docs/seo/reports/archive/YYYY-MM-DD-*.md` (FULL only) |

Related baselines (manual): `docs/seo/01-technical-seo-baseline.md`, `docs/seo/02-technical-seo-architecture.md`, `docs/seo/03-technical-seo-current-status.md`, `docs/performance/01-performance-baseline-and-actions.md`.

## Severity

| Level | Meaning |
| --- | --- |
| **P0** | Indexation/crawl break, missing production pages, canonical catastrophe |
| **P1** | Material discoverability / performance / schema / compliance issue |
| **P2** | Important optimization |
| **P3** | Nice-to-have refinement |

Do not treat every finding as P1.

## Issue IDs + diffing

Stable IDs (examples):

- `SEO-CANONICAL-GUIDES-WHAT-IS-CRM-A3F1`
- `SEO-ORPHAN-SOFTWARE-PIPEDRIVE-B2C9`
- `PERF-LCP-HERO-007A`
- `OUT-AFFILIATE-…`
- `MEDIA-DIM-…`

Derived from kind + subject + problem signature (not sort order).

Master report compares to previous snapshot:

| Status | Meaning |
| --- | --- |
| NEW | First seen this run |
| EXISTING / UNCHANGED | Still open |
| RESOLVED | Gone since previous snapshot |
| REGRESSED | Same ID, worse severity |

## Finding format

Every finding includes: ID, Severity, Area, Problem, Evidence, Affected pages, Likely cause, Recommended action, Files/components, Expected impact, Effort (`small`/`medium`/`large`), Confidence.

## How to act on recommendations

1. Read `SEO-HEALTH-LATEST.md` summary + Top 20.
2. Confirm skipped/failed checks — **do not claim clean SEO** if checks did not complete.
3. Triage P0 → P1 manually.
4. Implement via normal PR / editorial / research workflows.
5. Re-run `npm run seo:audit` and confirm RESOLVED in the diff.

## How to add a new check

1. Prefer extending an existing agent under `src/services/seo-audit-agents/agents/`.
2. Emit findings via `finding({ kind, subject, severity, … })` so IDs stay stable.
3. Mark checks `completed` | `skipped` | `failed` with reasons — never silent skip.
4. Add a fixture assertion in `seo-audit-agents.test.ts`.
5. Keep `mutatesProduction: false`.

## Reused systems

- `@/seo/*` — canonical, indexability, sitemap, structured-data helpers
- `src/services/internal-linking` — orphans, health, graph
- `src/services/content-quality/gaps/map-register` — CRM master map
- `src/services/outbound/validate-links` — affiliate/evidence validation
- `src/performance/budgets` — CWV targets + route families

## Limitations

- Live HTML status/JSON-LD/img scans need `BASE_URL` / `--base-url` against a running origin (or fixtures in tests).
- Performance agent lab TTFB via BASE_URL is **not** field CrUX — treat as proxy only.
- Content coverage emits **opportunities**, not generated articles; product-evidence is a shallow sample (deep scoring stays in content-quality).
- FULL archives are intentional; FAST avoids flooding `archive/`.

## Tests

```bash
npx vitest run src/services/seo-audit-agents/seo-audit-agents.test.ts
```

Fixtures cover: orphan, bad canonical, noindex sitemap URL, broken internal link, affiliate missing `sponsored`, invalid structured data, oversized image, redirect chain.
