# GSC Opportunity Engine

Real Google Search Console performance data drives prioritization for the **existing** SoftwareGlimpse content estate.

## Command

```bash
npm run seo:gsc-opportunities
npm run seo:gsc-opportunities -- --export docs/migration/data/gsc-export.json
npm run seo:gsc-opportunities -- --export data/seo/imports/gsc-page-query.csv
```

## Outputs

| Artifact | Purpose |
|---|---|
| `data/seo/gsc-opportunities.json` | Machine-readable ranked opportunities + provenance |
| `docs/seo/GSC-OPPORTUNITIES.md` | Full report |
| `docs/seo/TOP-20-GROWTH-PAGES.md` | Shortlist + Queue A/B |
| `data/seo/feeds/gsc-*.json` | Feeds for enrichment / testing / pricing / links / refresh |

## Rules

1. **Real export only** — fixture/synthetic GSC data is rejected for production reporting.
2. **Existing pages first** — do not create articles by default; IMPROVE/noindex pages with historical demand are Queue B priorities.
3. **Provenance** — every report records source path, date range, import `retrievedAt`, and generation timestamp.
4. **CREATE_CANDIDATE** only when no suitable existing URL can absorb the intent after improvement.
5. **No false page→query precision** — heuristic overlap is never labeled as Search Console evidence.

## Query relationship model

Every page↔query candidate stores:

| Field | Meaning |
|---|---|
| `relationshipSource` | `DIRECT_GSC` · `HISTORICAL_DIRECT_GSC` · `INFERRED_HIGH` · `INFERRED_MEDIUM` · `INFERRED_LOW` · `UNKNOWN` |
| `confidence` | `HIGH` · `MEDIUM` · `LOW` · `UNKNOWN` |
| `reason` | Human-readable mapping explanation |
| `evidence` | Structured labels (e.g. `direct_page_query_row`, `heuristic_overlap`) |
| `sourceDateRange` | `{ startDate, endDate }` from the export/API window |

### Action rules (strict)

| relationshipSource | May auto-trigger query-scoped rewrites? | Allowed outcome |
|---|---|---|
| `DIRECT_GSC` / `HISTORICAL_DIRECT_GSC` | **Yes** | `OPTIMIZE_TITLE_FOR_QUERY`, `REWRITE_H1_FOR_QUERY`, `SEARCH_INTENT_MISMATCH`, `QUERY_CLUSTER_CONSOLIDATION` |
| `INFERRED_HIGH` | **No** — recommend only | Same actions listed as recommendations under `MANUAL_REVIEW` / `actionConfidence: REVIEW_REQUIRED` |
| `INFERRED_MEDIUM` / `INFERRED_LOW` / `UNKNOWN` | **Never** | Page-level actions only (`OPTIMIZE_TITLE` from TITLE_WEAK/POOR_CTR, links, enrichment) |

Page-level opportunity scoring uses impressions, clicks, CTR, position, page type, quality gaps, internal links, freshness, and commercial relevance — **independent of guessed query mapping**.

## Obtaining page×query data (required for trusted target queries)

Separate **Pages** and **Queries** tabs are useful for page-level scoring, but **cannot** produce `DIRECT_GSC` mappings.

### Option 1 — Search Console API

Request Performance with:

```text
dimensions = ["page", "query"]
```

Export clicks, impressions, CTR, position for the same date range as your page report.

Accepted JSON shapes:

```json
{
  "startDate": "2026-07-16",
  "endDate": "2026-08-13",
  "rows": [
    {
      "keys": [
        "https://softwareglimpse.com/software/hubspot/",
        "hubspot crm"
      ],
      "clicks": 2,
      "impressions": 80,
      "ctr": 0.025,
      "position": 14.1
    }
  ]
}
```

Save under `data/seo/imports/` (filename containing `gsc` + `page` + `query`, or pass `--export`).

### Option 2 — Combined JSON export

```json
{
  "synthetic": false,
  "label": "GSC page×query 2026-08",
  "meta": {
    "retrievedAt": "2026-08-20T12:00:00.000Z",
    "dataThroughDate": "2026-08-13",
    "source": "gsc",
    "rangeLabel": "Last 28 days"
  },
  "pages": [],
  "queries": [],
  "pageQueries": [
    {
      "page": "https://softwareglimpse.com/software/hubspot/",
      "query": "hubspot crm",
      "clicks": 2,
      "impressions": 80,
      "ctr": 0.025,
      "position": 14.1,
      "dateRange": { "startDate": "2026-07-16", "endDate": "2026-08-13" }
    }
  ]
}
```

### Option 3 — Manual page×query CSV

```csv
page,query,clicks,impressions,ctr,position,startDate,endDate
https://softwareglimpse.com/software/hubspot/,hubspot crm,2,80,0.025,14.1,2026-07-16,2026-08-13
```

Required headers: `page`, `query`, `impressions`, `position` (plus `clicks`, `ctr` recommended).

## Cannibalization

- **`CANNIBALIZATION` / `QUERY_CLUSTER_CONSOLIDATION`** — multiple URLs observed for the **same** `DIRECT_GSC` query.
- **`POSSIBLE_INTENT_OVERLAP`** — heuristic cluster/name overlap only → **requires review**, never consolidate automatically.

## Queues

- **A — Indexed improvement:** already indexable pages (title/CTR/links/content).
- **B — IMPROVE / promote:** temporary noindex / IMPROVE lifecycle with GSC demand → enrich then restore indexation.

## Downstream

Guide/compare enrichment queues, product-testing queue, and price-change monitor load scores from `data/seo/gsc-opportunities.json` / feeds automatically.

Feeds only pass **trusted** target queries (`EVIDENCED` or `REVIEW_REQUIRED`). Weak inferred candidates are listed separately and must not drive automated rewrites.
