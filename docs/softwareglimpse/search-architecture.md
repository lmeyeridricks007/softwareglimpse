# Search architecture — SoftwareGlimpse

## Current stack (2026-08)

Cross-site discovery search is an **in-process, deterministic index** built from published catalogue entities. No Algolia / Meilisearch / Typesense dependency.

| Layer | Location |
| --- | --- |
| Index builder | `src/services/search/build-index.ts` |
| Intent + synonyms + fuzzy | `intent.ts`, `synonyms.ts`, `fuzzy.ts` |
| Scoring | `score.ts` |
| Query orchestration | `query.ts` |
| Autocomplete | `suggest.ts` + `GET /api/search/suggest` |
| UI | `src/app/(site)/search/page.tsx`, `src/components/search/*` |
| Header | `GlobalSearchField` (same suggest API) |
| Quality agent | `quality-agent.ts` → `docs/site-intelligence/SEARCH-QUALITY-LATEST.md` |
| Demand agent | `demand-agent.ts` (no fabricated popularity) |

## What is searchable

Published / publicly available:

- Software (active products)
- Comparisons
- Guides
- Tools (available + routable)
- Resources
- Best pages
- Categories
- Industries
- Use cases & capabilities (with hub depth)
- Feature pillars / substantive feature pages
- Requirement pillars

Excluded: drafts, `/go/` redirects, `/api/`, admin/dev, empty feature shells, coming-soon tools without href.

## Ranking (priority order)

1. Exact title / entity / alias / slug
2. Strong title/slug containment
3. Intent type preference (vs → comparison, finder → tool, …)
4. Entity relationship (product graph)
5. Synonym expansion (curated)
6. Conservative typo / fuzzy (entity titles)
7. Importance + small optional content-quality boost

**Never** uses affiliate commission or affiliate status.

## SEO

`/search/` and `/search/?q=…` are **noindex, follow** via `indexabilityForUtility("search")`. Not in sitemap. Result links remain normal crawlable `<a href>`.

## Upgrade path

1. Keep deterministic index while catalogue is hundreds–low thousands of docs.
2. Add Postgres FTS or MiniSearch if index build / query latency becomes an issue.
3. Introduce Typesense/Meilisearch only with a clear ops need — not by default.
