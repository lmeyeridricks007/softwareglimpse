# Guides sitemap reconciliation

Generated: 2026-09-08T20:10:52.030Z

| Metric | Count |
| --- | ---: |
| KEEP_INDEX (audit) | 370 |
| sitemap-guides entity URLs | 369 |
| KEEP_INDEX present in sitemap | 162 |
| KEEP_INDEX excluded from sitemap | 208 |
| Incorrect exclusions (should be fixed) | 15 |

## Why the gap exists

Sitemap inclusion uses `isEntityIndexable()` which requires **both**:

1. `seo.indexable === true`
2. Publication visibility (`status` / `scheduledAt` via `isContentVisible` for SITEMAP context)
3. Guide quality + `isGuideSearchIndexWorthy` (KEEP_INDEX hard gates)

The guides index-worthiness audit classifies educational substance as **KEEP_INDEX** without applying the publication schedule gate. Future-scheduled KEEP_INDEX guides are therefore correctly absent from `sitemap-guides.xml` until `scheduledAt`.

Incorrect pattern (fixed): coupling schedule wrappers to `seo.indexable: false`, which never flipped when the schedule fired.

## Exclusion reason summary

| Count | Reason family |
| ---: | --- |
| 193 | `publication_gate:scheduled_in_future` |
| 83 | `seo.indexable=false` |
| 15 | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |

### Exact reason strings (including scheduledAt)

| Count | Reason |
| ---: | --- |
| 15 | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| 4 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-25T06:00:00.000Z) + seo.indexable=false` |
| 3 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-01T06:00:00.000Z) + seo.indexable=false` |
| 3 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-11T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-04T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-01T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-04T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-26T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-01T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-04T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-07T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-01T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-04T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-07T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-10T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-13T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-16T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-19T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-22T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-28T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-21T06:00:00.000Z) + seo.indexable=false` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-15T06:00:00.000Z)` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-18T06:00:00.000Z)` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-27T06:00:00.000Z)` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-15T06:00:00.000Z)` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-18T06:00:00.000Z)` |
| 2 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-27T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-07T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-10T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-13T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-16T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-02T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-06T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-14T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-10T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-09-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-09-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-09-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-09-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-09-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-09-25T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-09-28T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-09-29T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-10-23T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-23T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-25T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-11-27T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-21T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-23T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-25T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-25T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-27T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-24T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-02-28T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-03-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-03-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-03-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-03-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-03-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-03-25T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-03-30T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-04-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-04-16T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-04-19T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-04-22T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-04-26T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-25T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-30T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-10T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-12T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-14T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-16T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-18T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-26T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-28T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-05-29T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-23T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-25T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-27T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-28T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-06-30T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-10T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-12T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-14T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-16T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-25T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-26T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-28T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-29T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-21T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-07-24T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-07T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-10T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-10T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-12T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-14T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-16T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-25T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-26T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-28T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-29T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-21T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-08-24T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-27T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2026-12-28T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-01-29T06:00:00.000Z) + seo.indexable=false` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-09T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-11T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-13T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-15T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-17T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-10T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-12T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-14T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-16T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-18T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-25T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-26T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-27T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-28T06:00:00.000Z)` |
| 1 | `publication_gate:scheduled_in_future(scheduledAt=2027-09-29T06:00:00.000Z)` |

## Every KEEP_INDEX guide excluded from sitemap-guides

| Slug | Type | Category | Status | scheduledAt | seo.indexable | Pub visible | Exclusion reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `accounting-finance-evaluation-guide` | buying-guide | accounting-finance | scheduled | 2026-09-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-09-17T06:00:00.000Z)` |
| `accounting-finance-requirements-guide` | checklist | accounting-finance | scheduled | 2026-09-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-09-15T06:00:00.000Z)` |
| `accounting-finance-vs-hr-software` | comparison-education | accounting-finance | scheduled | 2026-09-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-09-13T06:00:00.000Z)` |
| `ai-website-builder-evaluation-guide` | buying-guide | ai-website-builder | scheduled | 2027-05-18T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-18T06:00:00.000Z)` |
| `ai-website-builder-requirements-guide` | checklist | ai-website-builder | scheduled | 2027-05-16T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-16T06:00:00.000Z)` |
| `ai-website-builder-vs-ai-software` | comparison-education | ai-website-builder | scheduled | 2027-05-14T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-14T06:00:00.000Z)` |
| `ai-writing-evaluation-guide` | buying-guide | ai-writing | scheduled | 2027-05-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-17T06:00:00.000Z)` |
| `ai-writing-requirements-guide` | checklist | ai-writing | scheduled | 2027-05-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-15T06:00:00.000Z)` |
| `ai-writing-vs-ai-software` | comparison-education | ai-writing | scheduled | 2027-05-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-13T06:00:00.000Z)` |
| `analytics-bi-evaluation-guide` | buying-guide | analytics-bi | scheduled | 2027-02-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-17T06:00:00.000Z)` |
| `analytics-bi-requirements-guide` | checklist | analytics-bi | scheduled | 2027-02-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-15T06:00:00.000Z)` |
| `analytics-bi-vs-marketing-software` | comparison-education | analytics-bi | scheduled | 2027-02-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-13T06:00:00.000Z)` |
| `ats-recruiting-evaluation-guide` | buying-guide | ats-recruiting | scheduled | 2027-08-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-17T06:00:00.000Z)` |
| `ats-recruiting-requirements-guide` | checklist | ats-recruiting | scheduled | 2027-08-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-15T06:00:00.000Z)` |
| `ats-recruiting-vs-hr-software` | comparison-education | ats-recruiting | scheduled | 2027-08-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-13T06:00:00.000Z)` |
| `dropshipping-pod-evaluation-guide` | buying-guide | dropshipping-pod | scheduled | 2027-07-29T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-29T06:00:00.000Z)` |
| `dropshipping-pod-requirements-guide` | checklist | dropshipping-pod | scheduled | 2027-07-28T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-28T06:00:00.000Z)` |
| `dropshipping-pod-vs-ecommerce-software` | comparison-education | dropshipping-pod | scheduled | 2027-07-27T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-27T06:00:00.000Z)` |
| `field-service-operations-evaluation-guide` | buying-guide | field-service-operations | scheduled | 2027-03-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-03-17T06:00:00.000Z)` |
| `field-service-operations-requirements-guide` | checklist | field-service-operations | scheduled | 2027-03-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-03-15T06:00:00.000Z)` |
| `field-service-operations-vs-project-management-software` | comparison-education | field-service-operations | scheduled | 2027-03-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-03-13T06:00:00.000Z)` |
| `fulfillment-shipping-evaluation-guide` | buying-guide | fulfillment-shipping | scheduled | 2027-07-27T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-27T06:00:00.000Z)` |
| `fulfillment-shipping-requirements-guide` | checklist | fulfillment-shipping | scheduled | 2027-07-24T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-24T06:00:00.000Z)` |
| `fulfillment-shipping-vs-ecommerce-software` | comparison-education | fulfillment-shipping | scheduled | 2027-07-21T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-21T06:00:00.000Z)` |
| `helpdesk-ticketing-evaluation-guide` | buying-guide | helpdesk-ticketing | scheduled | 2027-07-18T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-18T06:00:00.000Z)` |
| `helpdesk-ticketing-requirements-guide` | checklist | helpdesk-ticketing | scheduled | 2027-07-16T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-16T06:00:00.000Z)` |
| `helpdesk-ticketing-vs-customer-service-software` | comparison-education | helpdesk-ticketing | scheduled | 2027-07-14T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-14T06:00:00.000Z)` |
| `how-accounting-finance-software-works` | how-to | accounting-finance | scheduled | 2026-09-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-09-09T06:00:00.000Z)` |
| `how-ai-website-builder-software-works` | how-to | ai-website-builder | scheduled | 2027-05-10T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-10T06:00:00.000Z)` |
| `how-ai-writing-software-works` | how-to | ai-writing | scheduled | 2027-05-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-09T06:00:00.000Z)` |
| `how-analytics-bi-software-works` | how-to | analytics-bi | scheduled | 2027-02-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-09T06:00:00.000Z)` |
| `how-ats-recruiting-software-works` | how-to | ats-recruiting | scheduled | 2027-08-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-09T06:00:00.000Z)` |
| `how-dropshipping-pod-software-works` | how-to | dropshipping-pod | scheduled | 2027-07-25T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-25T06:00:00.000Z)` |
| `how-field-service-operations-software-works` | how-to | field-service-operations | scheduled | 2027-03-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-03-09T06:00:00.000Z)` |
| `how-fulfillment-shipping-software-works` | how-to | fulfillment-shipping | scheduled | 2027-07-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-15T06:00:00.000Z)` |
| `how-helpdesk-ticketing-software-works` | how-to | helpdesk-ticketing | scheduled | 2027-07-10T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-10T06:00:00.000Z)` |
| `how-itsm-software-works` | how-to | itsm | scheduled | 2027-08-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-15T06:00:00.000Z)` |
| `how-landing-pages-cro-software-works` | how-to | landing-pages-cro | scheduled | 2027-09-10T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-10T06:00:00.000Z)` |
| `how-live-chat-software-works` | how-to | live-chat | scheduled | 2027-07-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-09T06:00:00.000Z)` |
| `how-lms-course-creation-software-works` | how-to | lms-course-creation | scheduled | 2026-12-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-09T06:00:00.000Z)` |
| `how-ppc-advertising-software-works` | how-to | ppc-advertising | scheduled | 2027-09-25T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-25T06:00:00.000Z)` |
| `how-reputation-reviews-software-works` | how-to | reputation-reviews | scheduled | 2027-04-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-04-13T06:00:00.000Z)` |
| `how-social-media-management-software-works` | how-to | social-media-management | scheduled | 2027-09-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-09T06:00:00.000Z)` |
| `how-social-media-marketing-software-works` | how-to | social-media-marketing | scheduled | 2026-10-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-09T06:00:00.000Z)` |
| `how-time-attendance-software-works` | how-to | time-attendance | scheduled | 2027-08-10T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-10T06:00:00.000Z)` |
| `how-voip-business-phone-software-works` | how-to | voip-business-phone | scheduled | 2027-06-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-09T06:00:00.000Z)` |
| `how-web-hosting-software-works` | how-to | web-hosting | scheduled | 2027-08-25T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-25T06:00:00.000Z)` |
| `how-webinar-virtual-events-software-works` | how-to | webinar-virtual-events | scheduled | 2026-11-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-09T06:00:00.000Z)` |
| `how-website-digital-presence-software-works` | how-to | website-digital-presence | scheduled | 2027-01-09T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-09T06:00:00.000Z)` |
| `itsm-evaluation-guide` | buying-guide | itsm | scheduled | 2027-08-27T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-27T06:00:00.000Z)` |
| `itsm-requirements-guide` | checklist | itsm | scheduled | 2027-08-24T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-24T06:00:00.000Z)` |
| `itsm-vs-it-development-software` | comparison-education | itsm | scheduled | 2027-08-21T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-21T06:00:00.000Z)` |
| `landing-pages-cro-evaluation-guide` | buying-guide | landing-pages-cro | scheduled | 2027-09-18T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-18T06:00:00.000Z)` |
| `landing-pages-cro-requirements-guide` | checklist | landing-pages-cro | scheduled | 2027-09-16T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-16T06:00:00.000Z)` |
| `landing-pages-cro-vs-marketing-software` | comparison-education | landing-pages-cro | scheduled | 2027-09-14T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-14T06:00:00.000Z)` |
| `live-chat-evaluation-guide` | buying-guide | live-chat | scheduled | 2027-07-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-17T06:00:00.000Z)` |
| `live-chat-requirements-guide` | checklist | live-chat | scheduled | 2027-07-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-15T06:00:00.000Z)` |
| `live-chat-vs-customer-service-software` | comparison-education | live-chat | scheduled | 2027-07-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-13T06:00:00.000Z)` |
| `lms-course-creation-evaluation-guide` | buying-guide | lms-course-creation | scheduled | 2026-12-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-17T06:00:00.000Z)` |
| `lms-course-creation-requirements-guide` | checklist | lms-course-creation | scheduled | 2026-12-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-15T06:00:00.000Z)` |
| `lms-course-creation-vs-hr-software` | comparison-education | lms-course-creation | scheduled | 2026-12-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-13T06:00:00.000Z)` |
| `ppc-advertising-evaluation-guide` | buying-guide | ppc-advertising | scheduled | 2027-09-29T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-29T06:00:00.000Z)` |
| `ppc-advertising-requirements-guide` | checklist | ppc-advertising | scheduled | 2027-09-28T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-28T06:00:00.000Z)` |
| `ppc-advertising-vs-marketing-software` | comparison-education | ppc-advertising | scheduled | 2027-09-27T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-27T06:00:00.000Z)` |
| `reputation-reviews-evaluation-guide` | buying-guide | reputation-reviews | scheduled | 2027-04-26T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-04-26T06:00:00.000Z)` |
| `reputation-reviews-requirements-guide` | checklist | reputation-reviews | scheduled | 2027-04-22T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-04-22T06:00:00.000Z)` |
| `reputation-reviews-vs-customer-service-software` | comparison-education | reputation-reviews | scheduled | 2027-04-19T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-04-19T06:00:00.000Z)` |
| `social-media-management-evaluation-guide` | buying-guide | social-media-management | scheduled | 2027-09-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-17T06:00:00.000Z)` |
| `social-media-management-requirements-guide` | checklist | social-media-management | scheduled | 2027-09-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-15T06:00:00.000Z)` |
| `social-media-management-vs-marketing-software` | comparison-education | social-media-management | scheduled | 2027-09-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-13T06:00:00.000Z)` |
| `social-media-marketing-evaluation-guide` | buying-guide | social-media-marketing | scheduled | 2026-10-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-17T06:00:00.000Z)` |
| `social-media-marketing-requirements-guide` | checklist | social-media-marketing | scheduled | 2026-10-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-15T06:00:00.000Z)` |
| `social-media-marketing-vs-marketing-software` | comparison-education | social-media-marketing | scheduled | 2026-10-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-13T06:00:00.000Z)` |
| `time-attendance-evaluation-guide` | buying-guide | time-attendance | scheduled | 2027-08-18T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-18T06:00:00.000Z)` |
| `time-attendance-requirements-guide` | checklist | time-attendance | scheduled | 2027-08-16T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-16T06:00:00.000Z)` |
| `time-attendance-vs-hr-software` | comparison-education | time-attendance | scheduled | 2027-08-14T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-14T06:00:00.000Z)` |
| `types-of-accounting-finance-software` | educational-explainer | accounting-finance | scheduled | 2026-09-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-09-11T06:00:00.000Z)` |
| `types-of-ai-website-builder-software` | educational-explainer | ai-website-builder | scheduled | 2027-05-12T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-12T06:00:00.000Z)` |
| `types-of-ai-writing-software` | educational-explainer | ai-writing | scheduled | 2027-05-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-11T06:00:00.000Z)` |
| `types-of-analytics-bi-software` | educational-explainer | analytics-bi | scheduled | 2027-02-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-11T06:00:00.000Z)` |
| `types-of-ats-recruiting-software` | educational-explainer | ats-recruiting | scheduled | 2027-08-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-11T06:00:00.000Z)` |
| `types-of-dropshipping-pod-software` | educational-explainer | dropshipping-pod | scheduled | 2027-07-26T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-26T06:00:00.000Z)` |
| `types-of-field-service-operations-software` | educational-explainer | field-service-operations | scheduled | 2027-03-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-03-11T06:00:00.000Z)` |
| `types-of-fulfillment-shipping-software` | educational-explainer | fulfillment-shipping | scheduled | 2027-07-18T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-18T06:00:00.000Z)` |
| `types-of-helpdesk-ticketing-software` | educational-explainer | helpdesk-ticketing | scheduled | 2027-07-12T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-12T06:00:00.000Z)` |
| `types-of-itsm-software` | educational-explainer | itsm | scheduled | 2027-08-18T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-18T06:00:00.000Z)` |
| `types-of-landing-pages-cro-software` | educational-explainer | landing-pages-cro | scheduled | 2027-09-12T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-12T06:00:00.000Z)` |
| `types-of-live-chat-software` | educational-explainer | live-chat | scheduled | 2027-07-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-07-11T06:00:00.000Z)` |
| `types-of-lms-course-creation-software` | educational-explainer | lms-course-creation | scheduled | 2026-12-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-11T06:00:00.000Z)` |
| `types-of-ppc-advertising-software` | educational-explainer | ppc-advertising | scheduled | 2027-09-26T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-26T06:00:00.000Z)` |
| `types-of-reputation-reviews-software` | educational-explainer | reputation-reviews | scheduled | 2027-04-16T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-04-16T06:00:00.000Z)` |
| `types-of-social-media-management-software` | educational-explainer | social-media-management | scheduled | 2027-09-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-09-11T06:00:00.000Z)` |
| `types-of-social-media-marketing-software` | educational-explainer | social-media-marketing | scheduled | 2026-10-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-11T06:00:00.000Z)` |
| `types-of-time-attendance-software` | educational-explainer | time-attendance | scheduled | 2027-08-12T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-12T06:00:00.000Z)` |
| `types-of-voip-business-phone-software` | educational-explainer | voip-business-phone | scheduled | 2027-06-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-11T06:00:00.000Z)` |
| `types-of-web-hosting-software` | educational-explainer | web-hosting | scheduled | 2027-08-26T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-26T06:00:00.000Z)` |
| `types-of-webinar-virtual-events-software` | educational-explainer | webinar-virtual-events | scheduled | 2026-11-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-11T06:00:00.000Z)` |
| `types-of-website-digital-presence-software` | educational-explainer | website-digital-presence | scheduled | 2027-01-11T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-11T06:00:00.000Z)` |
| `voip-business-phone-evaluation-guide` | buying-guide | voip-business-phone | scheduled | 2027-06-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-17T06:00:00.000Z)` |
| `voip-business-phone-requirements-guide` | checklist | voip-business-phone | scheduled | 2027-06-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-15T06:00:00.000Z)` |
| `voip-business-phone-vs-business-communications` | comparison-education | voip-business-phone | scheduled | 2027-06-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-13T06:00:00.000Z)` |
| `web-hosting-evaluation-guide` | buying-guide | web-hosting | scheduled | 2027-08-29T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-29T06:00:00.000Z)` |
| `web-hosting-requirements-guide` | checklist | web-hosting | scheduled | 2027-08-28T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-28T06:00:00.000Z)` |
| `web-hosting-vs-it-development-software` | comparison-education | web-hosting | scheduled | 2027-08-27T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-08-27T06:00:00.000Z)` |
| `webinar-virtual-events-evaluation-guide` | buying-guide | webinar-virtual-events | scheduled | 2026-11-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-17T06:00:00.000Z)` |
| `webinar-virtual-events-requirements-guide` | checklist | webinar-virtual-events | scheduled | 2026-11-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-15T06:00:00.000Z)` |
| `webinar-virtual-events-vs-marketing-software` | comparison-education | webinar-virtual-events | scheduled | 2026-11-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-13T06:00:00.000Z)` |
| `website-digital-presence-evaluation-guide` | buying-guide | website-digital-presence | scheduled | 2027-01-17T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-17T06:00:00.000Z)` |
| `website-digital-presence-requirements-guide` | checklist | website-digital-presence | scheduled | 2027-01-15T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-15T06:00:00.000Z)` |
| `website-digital-presence-vs-ecommerce-software` | comparison-education | website-digital-presence | scheduled | 2027-01-13T06:00:00.000Z | true | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-13T06:00:00.000Z)` |
| `what-is-affinity` | product-explainer | crm | scheduled | 2026-10-28T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-28T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-agile-crm` | product-explainer | crm | scheduled | 2026-10-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-aircall` | product-explainer | voip-business-phone | scheduled | 2027-06-27T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-27T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-alidrop` | product-explainer | dropshipping-pod | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-apptivo` | product-explainer | crm | scheduled | 2026-10-28T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-28T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-attio` | product-explainer | crm | scheduled | 2026-10-13T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-13T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-birch` | product-explainer | ppc-advertising | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-bitrix24` | product-explainer | crm | scheduled | 2026-10-19T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-19T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-brand24` | product-explainer | marketing | scheduled | 2026-10-23T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-23T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-breezy-hr` | product-explainer | ats-recruiting | scheduled | 2026-12-27T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-27T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-bright-data` | product-explainer | it-development | scheduled | 2027-01-02T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-02T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-callhippo` | product-explainer | voip-business-phone | scheduled | 2027-06-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-carepatron` | product-explainer | hr | scheduled | 2026-12-26T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-26T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-cometchat` | product-explainer | live-chat | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-connecteam` | product-explainer | time-attendance | scheduled | 2026-12-26T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-26T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-contractor-foreman` | product-explainer | field-service-operations | scheduled | 2027-03-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-03-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-copper` | product-explainer | crm | scheduled | 2026-10-13T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-13T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-creatio` | product-explainer | crm | scheduled | 2026-10-22T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-22T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-databox` | product-explainer | analytics-bi | scheduled | 2027-02-28T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-28T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-dext` | product-explainer | accounting-finance | scheduled | 2026-09-28T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-09-28T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-diginius` | product-explainer | ppc-advertising | scheduled | 2027-01-11T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-11T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-dynamics-365` | product-explainer | crm | scheduled | 2026-10-10T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-10T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-elevenlabs` | product-explainer | ai | scheduled | 2026-11-01T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-01T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-emergent` | product-explainer | ai-website-builder | scheduled | 2027-05-29T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-29T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-evolve` | product-explainer | marketing | scheduled | 2027-01-11T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-11T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-flexiquiz` | product-explainer | lms-course-creation | scheduled | 2026-12-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-flippa` | product-explainer | website-digital-presence | scheduled | 2027-01-27T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-27T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-foxit` | product-explainer | project-management | scheduled | 2027-02-01T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-01T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-freshcaller` | product-explainer | voip-business-phone | scheduled | 2027-06-28T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-28T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-freshchat` | product-explainer | live-chat | scheduled | 2026-11-04T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-04T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-freshdesk` | product-explainer | helpdesk-ticketing | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-freshmarketer` | product-explainer | landing-pages-cro | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-freshservice` | product-explainer | itsm | scheduled | 2026-11-01T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-01T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-freshteam` | product-explainer | ats-recruiting | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-gamma` | product-explainer | ai | scheduled | 2026-11-01T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-01T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-getscreen-me` | product-explainer | project-management | scheduled | 2027-02-07T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-07T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-hive` | product-explainer | project-management | scheduled | 2027-02-04T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-04T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-hubspot` | product-explainer | crm | scheduled | 2026-12-04T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-04T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-hynote` | product-explainer | ai | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-inboxally` | product-explainer | email-marketing | scheduled | 2026-09-01T06:00:00.000Z | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-insightly` | product-explainer | crm | scheduled | 2026-10-16T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-16T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-jibble` | product-explainer | time-attendance | scheduled | 2026-12-28T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-28T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-kartra` | product-explainer | landing-pages-cro | scheduled | 2027-01-11T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-11T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-keap` | product-explainer | crm | scheduled | 2026-12-01T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-01T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-kit` | product-explainer | email-marketing | scheduled | 2026-09-04T06:00:00.000Z | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-kixie` | product-explainer | voip-business-phone | scheduled | 2027-06-30T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-30T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-krispcall` | product-explainer | voip-business-phone | scheduled | 2027-06-23T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-06-23T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-leadpages` | product-explainer | landing-pages-cro | scheduled | 2027-01-21T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-21T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-learnworlds` | product-explainer | marketing | scheduled | 2026-12-21T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-21T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-livechat` | product-explainer | customer-service | scheduled | 2026-11-07T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-07T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-livestorm` | product-explainer | marketing | scheduled | 2026-11-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-lucrovox` | product-explainer | marketing | scheduled | 2027-01-14T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-14T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-mailchimp` | product-explainer | crm | scheduled | 2026-10-01T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-01T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-mindstudio` | product-explainer | ai | scheduled | 2027-05-28T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-28T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-monday` | product-explainer | project-management | scheduled | 2027-02-01T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-01T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-monday-sales-crm` | product-explainer | crm | scheduled | 2026-10-07T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-07T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-mrpeasy` | product-explainer | accounting-finance | scheduled | 2026-09-29T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-09-29T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-navan` | product-explainer | accounting-finance | scheduled | 2026-09-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-09-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-nicejob` | product-explainer | customer-service | scheduled | 2026-11-13T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-13T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-nimble` | product-explainer | crm | scheduled | 2026-10-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-nutshell` | product-explainer | crm | scheduled | 2026-10-16T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-16T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-office-timeline` | product-explainer | project-management | scheduled | 2027-02-04T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-04T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-oracle-cx` | product-explainer | crm | scheduled | 2026-10-19T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-19T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-pardot` | product-explainer | crm | scheduled | 2026-10-01T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-01T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-plesk` | product-explainer | web-hosting | scheduled | 2027-01-29T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-29T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-printify` | product-explainer | dropshipping-pod | scheduled | 2026-12-04T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-04T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-quillbot` | product-explainer | ai | scheduled | 2027-05-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-rank-prompt` | product-explainer | ai | scheduled | 2026-11-04T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-04T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-rippling` | product-explainer | hr | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-salesforce` | product-explainer | crm | scheduled | 2026-10-04T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-04T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-sanebox` | product-explainer | business-communications | scheduled | 2026-09-01T06:00:00.000Z | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-sendcloud` | product-explainer | fulfillment-shipping | scheduled | 2026-12-10T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-10T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-servicem8` | product-explainer | field-service-operations | scheduled | 2027-03-30T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-03-30T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-shipbob` | product-explainer | fulfillment-shipping | scheduled | 2026-12-07T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-07T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-shopify` | product-explainer | ecommerce | scheduled | 2027-01-21T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-21T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-shore` | product-explainer | customer-service | scheduled | 2026-11-16T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-16T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-snov` | product-explainer | sales-intelligence | scheduled | 2026-09-04T06:00:00.000Z | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-socialbee` | product-explainer | social-media-management | scheduled | 2026-10-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-spocket` | product-explainer | dropshipping-pod | scheduled | 2026-12-01T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-01T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-streak` | product-explainer | crm | scheduled | 2026-10-07T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-07T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-sugarcrm` | product-explainer | crm | scheduled | 2026-10-22T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-22T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-switcher-studio` | product-explainer | marketing | scheduled | 2026-11-27T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-27T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-thordata` | product-explainer | it-development | scheduled | 2027-01-06T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-06T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-tidio` | product-explainer | live-chat | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-trainual` | product-explainer | hr | scheduled | 2026-12-23T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-12-23T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-turbotic` | product-explainer | ai | published | — | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-ueni` | product-explainer | website-digital-presence | scheduled | 2027-01-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-01-25T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-vektoros` | product-explainer | project-management | scheduled | 2027-02-10T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-10T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-webcatalog` | product-explainer | project-management | scheduled | 2027-02-07T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-07T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-webinarjam-everwebinar` | product-explainer | webinar-virtual-events | scheduled | 2026-11-23T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-23T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-wegic` | product-explainer | ai | scheduled | 2027-05-26T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-26T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-whatconverts` | product-explainer | marketing | scheduled | 2027-02-24T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-02-24T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-writesonic` | product-explainer | ai | scheduled | 2027-05-30T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2027-05-30T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-zendesk` | product-explainer | crm | scheduled | 2026-10-04T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-04T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-zenzap` | product-explainer | business-communications | scheduled | 2026-09-01T06:00:00.000Z | false | true | `seo.indexable=false (incorrect: publication-visible KEEP_INDEX blocked from sitemap)` |
| `what-is-zoho-crm` | product-explainer | crm | scheduled | 2026-10-10T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-10T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-zoho-desk` | product-explainer | customer-service | scheduled | 2026-11-10T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-11-10T06:00:00.000Z)`<br>`seo.indexable=false` |
| `what-is-zypper` | product-explainer | social-media-marketing | scheduled | 2026-10-25T06:00:00.000Z | false | false | `publication_gate:scheduled_in_future(scheduledAt=2026-10-25T06:00:00.000Z)`<br>`seo.indexable=false` |

