# SERP Competitor Discovery

Organic search competitors for SoftwareGlimpse topics — identified from **current SERP results**, not a hardcoded business-competitor list.

## Agent

`SERPCompetitorDiscoveryAgent` (`src/services/site-intelligence/serp-competitors/`)

1. Build bounded query seeds (CRM map + titles + entities + guides/products/comparisons)  
2. Search via **approved API** (Brave / Serper / Google CSE) or import a snapshot  
3. Classify domains (marketplace / review / vendor / editorial / consultancy / community / other)  
4. Score significance (primary / secondary / query-specific)  
5. Write Markdown + JSON snapshot  

**Never scrapes Google HTML.**

## Commands

```bash
npm run site:serp-competitors
npm run site:serp-competitors -- --fixture
npm run site:serp-competitors -- --import docs/site-intelligence/competitors/snapshots/2026-08-15-crm-serp-live.json
```

Env (see `.env.example`):

- `BRAVE_API_KEY` (preferred)
- `SERPER_API_KEY`
- `GOOGLE_CUSTOM_SEARCH_API_KEY` + `GOOGLE_CUSTOM_SEARCH_ID`
- optional `SERP_SEARCH_PROVIDER=brave|serper|google-cse`

## Outputs

| File | Purpose |
| --- | --- |
| [`SERP-COMPETITORS-LATEST.md`](./SERP-COMPETITORS-LATEST.md) | Domain + query-level competitors |
| [`CRM-QUERY-SET.md`](./CRM-QUERY-SET.md) | Seeds with intent + SG page |
| [`snapshots/`](./snapshots/) | Raw SERP JSON (dated) |
| [`archive/`](./archive/) | Dated Markdown copies |

## Refresh policy

Treat snapshots as **stale after 14 days** (noted in the report). Re-run after material content-map or SERP shifts. Do not treat old competitor lists as current.

## CompetitorWebsiteAnalysisAgent

Consumes SERP competitor snapshots (not a hardcoded rival list). Samples 3–8 domains per high-priority CRM query cluster, fetches **representative** pages only, scores observable dimensions, writes profiles + page-by-page benchmarks.

```bash
npm run site:competitive-benchmark -- --fixture
npm run site:competitive-benchmark -- --live
```

| File | Purpose |
| --- | --- |
| [`COMPETITIVE-BENCHMARK-LATEST.md`](./COMPETITIVE-BENCHMARK-LATEST.md) | Cluster sample + page benchmarks |
| `[domain].md` | Per-domain profile |
| `competitor-pack-latest.json` | Pack for Site Intelligence pillar E |

Does **not** claim traffic, DA, backlinks, conversion, or revenue.

## CompetitiveGapAgent

Consumes Content Intelligence scores, SERP competitors, competitive benchmark, and CRM map coverage.

```bash
npm run site:competitive-gaps
npm run site:competitive-gaps -- --fixture
```

| File | Purpose |
| --- | --- |
| [`COMPETITIVE-GAPS-LATEST.md`](./COMPETITIVE-GAPS-LATEST.md) | Advantages, weaknesses, missing coverage, top 50 actions |
| `competitive-gaps-latest.json` | Structured snapshot |

Rejects “copy competitor feature” recommendations without user-value rationale (e.g. Top-50 list volume).

## Tests

```bash
npx vitest run src/services/site-intelligence/serp-competitors/serp-competitors.test.ts
npx vitest run src/services/site-intelligence/competitive-benchmark/competitive-benchmark.test.ts
npx vitest run src/services/site-intelligence/competitive-gaps/competitive-gaps.test.ts
```
